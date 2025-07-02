import { ASSETS } from "../config/assets";
import { LocalStorageCacheService } from "./cacheService";

const ONE_MINUTE = 1 * 60 * 1000;

export class CoingeckoService {
  private cache: LocalStorageCacheService;

  constructor() {
    this.cache = new LocalStorageCacheService(
      "coingecko-price-cache",
      ONE_MINUTE
    );
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
    const cgIds = ASSETS.map((a) => a.cg).filter(Boolean);
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
    const prices = await this.getPrices();

    const asset = ASSETS.find((a) => a.symbol === symbol);
    if (!asset || !asset.cg) return NaN;

    return prices[asset.cg] ?? NaN;
  }
}
