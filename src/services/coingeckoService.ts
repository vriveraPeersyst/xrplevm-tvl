import { getAssets } from "../config/assets";
import { LocalStorageCacheService } from "./cacheService";
import { getPrices as getPricesFromService } from "./priceService";

const ONE_MINUTE = 1 * 60 * 1000;

export class CoingeckoService {
  private cache: LocalStorageCacheService;
  private assetsCache: any[] | null = null;
  private assetsCacheTime = 0;
  private readonly ASSETS_CACHE_TTL = 5 * 60 * 1000; // 5 minutes

  constructor() {
    this.cache = new LocalStorageCacheService(
      "coingecko-price-cache",
      ONE_MINUTE
    );
  }

  private async getAssets() {
    const now = Date.now();
    
    // Use cached assets if still valid
    if (this.assetsCache && (now - this.assetsCacheTime) < this.ASSETS_CACHE_TTL) {
      return this.assetsCache;
    }
    
    // Fetch fresh assets
    this.assetsCache = await getAssets();
    this.assetsCacheTime = now;
    return this.assetsCache;
  }

  async _fetchPrice(cgIds: string[]): Promise<Record<string, number>> {
    try {
      const ids = cgIds.join(",");
      const res = await fetch(
        `https://api.coingecko.com/api/v3/simple/price?ids=${ids}&vs_currencies=usd`
      );
      if (res.status === 429) {
        // eslint-disable-next-line no-console
        console.warn(`[priceService] Coingecko rate limited (429)`);
        return Object.fromEntries(cgIds.map((id) => [id, NaN]));
      }

      if (!res.ok) throw new Error(`CG_${res.status}`);
      const json = await res.json();

      return cgIds.reduce((out, id) => {
        out[id] = json[id]?.usd ?? NaN;
        return out;
      }, {} as Record<string, number>);
    } catch (e) {
      // eslint-disable-next-line no-console
      console.warn(`[priceService] Coingecko batch fetch failed:`, e);
      return Object.fromEntries(cgIds.map((id) => [id, NaN]));
    }
  }

  // Batch fetch Coingecko prices for multiple ids
  private async getPrices(): Promise<Record<string, number>> {
    const assets = await this.getAssets();
    const cgIds = assets.map((a) => a.cg).filter(Boolean);
    if (!cgIds.length) return {};
    const cached = this.cache.get<Record<string, number>>();
    if (cached) {
      return cached;
    }

    const prices = await this._fetchPrice(cgIds);
    this.cache.set(prices);
    return prices;
  }

  async load(): Promise<void> {
    await this.getPrices();
  }

  async getPrice(symbol: string): Promise<number> {
    const assets = await this.getAssets();
    const asset = assets.find((a) => a.symbol === symbol);
    
    if (!asset) {
      console.warn(`[CoingeckoService] Asset not found for symbol: ${symbol}`);
      return NaN;
    }

    // Special handling for mXRP - fetch ratio from Midas API and multiply by XRP price
    if (symbol === "mXRP" || asset.cg === "midas-xrp") {
      console.log(`[CoingeckoService] Fetching mXRP price using Midas API ratio`);
      try {
        // Step 1: Get XRP price first
        const priceIds = [{
          cg: "ripple", // XRP CoinGecko ID
          binance: "XRPUSDT",
        }];
        
        const pricesResult = await getPricesFromService(priceIds);
        const xrpPrice = pricesResult["ripple"] || pricesResult["XRPUSDT"];
        
        console.log(`[CoingeckoService] XRP price:`, xrpPrice);
        
        if (!xrpPrice || isNaN(xrpPrice) || xrpPrice <= 0) {
          throw new Error(`Invalid XRP price: ${xrpPrice}`);
        }
        
        // Step 2: Fetch mXRP/XRP ratio from Midas API
        const now = Math.floor(Date.now() / 1000);
        const thirtyDaysAgo = now - (30 * 24 * 60 * 60);
        const midasUrl = `/api/midas/mxrp/price?timestampFrom=${thirtyDaysAgo}&timestampTo=${now}&environment=mainnet`;
        
        console.log(`[CoingeckoService] Fetching Midas ratio from:`, midasUrl);
        
        const midasRes = await fetch(midasUrl);
        
        if (!midasRes.ok) {
          console.warn(`[CoingeckoService] Midas API failed (${midasRes.status}), using fallback ratio 1.002`);
          const mxrpPrice = xrpPrice * 1.002;
          console.log(`[CoingeckoService] mXRP price (fallback): XRP $${xrpPrice.toFixed(4)} × 1.002 = $${mxrpPrice.toFixed(4)}`);
          return mxrpPrice;
        }
        
        const midasData = await midasRes.json();
        console.log(`[CoingeckoService] Midas response:`, midasData);
        
        // Get the latest mXRP/XRP ratio
        if (!midasData || midasData.length === 0) {
          console.warn(`[CoingeckoService] Midas returned empty data, using fallback ratio 1.002`);
          const mxrpPrice = xrpPrice * 1.002;
          return mxrpPrice;
        }
        
        const latestRatio = midasData[midasData.length - 1].price;
        console.log(`[CoingeckoService] Latest mXRP/XRP ratio from Midas:`, latestRatio);
        
        // Step 3: Calculate mXRP USD price = (mXRP/XRP ratio) × (XRP/USD price)
        const mxrpPrice = latestRatio * xrpPrice;
        console.log(`[CoingeckoService] ✅ mXRP price: ${latestRatio.toFixed(6)} (ratio) × $${xrpPrice.toFixed(4)} (XRP) = $${mxrpPrice.toFixed(4)}`);
        
        return mxrpPrice;
      } catch (e) {
        // eslint-disable-next-line no-console
        console.warn('[CoingeckoService] Failed to fetch mXRP price:', e);
        return NaN;
      }
    }

    // Standard CoinGecko handling for all other tokens
    const prices = await this.getPrices();
    if (!asset.cg) return NaN;
    return prices[asset.cg] ?? NaN;
  }
}
