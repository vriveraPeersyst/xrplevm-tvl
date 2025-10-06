import { isBrowser } from '../utils/isBrowser';

const CACHE_KEY = "price-cache";
const TTL_MS = 5 * 60 * 1000; // 5 minutes
// Use proxy in browser to bypass CORS, direct API on server
const MIDAS_API_BASE = isBrowser ? "/api/midas" : "https://api-prod.midas.app/api/data";

interface MidasPricePoint {
  timestamp: number;
  price: number;
}

interface CacheEntry {
  price: number;
  ts: number;
}
type Cache = Record<string, CacheEntry>;

function loadCache(): Cache {
  if (!isBrowser) return {};
  try {
    return JSON.parse(localStorage.getItem(CACHE_KEY) || "{}");
  } catch {
    return {};
  }
}
function saveCache(c: Cache) {
  if (!isBrowser) return;
  localStorage.setItem(CACHE_KEY, JSON.stringify(c));
}

export interface PriceIds {
  cg: string;
  binance: string;
}

const CG_RATE_LIMIT_KEY = "cg-rate-limit";
const CG_RATE_LIMIT_TTL = 2 * 60 * 1000; // 2 minutes

function setCGRatelimit() {
  if (!isBrowser) return;
  localStorage.setItem(CG_RATE_LIMIT_KEY, Date.now().toString());
}
function isCGRatelimited(): boolean {
  if (!isBrowser) return false;
  const ts = Number(localStorage.getItem(CG_RATE_LIMIT_KEY) || "0");
  return !!ts && Date.now() - ts < CG_RATE_LIMIT_TTL;
}

// Custom price fetcher for mXRP using Midas API
// mXRP price is measured in XRP, so we need to multiply by XRP price to get USD value
async function fetchMidasMXRP(cache: Cache): Promise<number> {
  try {
    // eslint-disable-next-line no-console
    console.log('[priceService] Starting mXRP fetch from Midas API');
    
    const now = Math.floor(Date.now() / 1000);
    const thirtyDaysAgo = now - (30 * 24 * 60 * 60);
    
    const midasUrl = `${MIDAS_API_BASE}/mxrp/price?timestampFrom=${thirtyDaysAgo}&timestampTo=${now}&environment=mainnet`;
    // eslint-disable-next-line no-console
    console.log('[priceService] Midas API URL:', midasUrl);
    
    // Fetch mXRP/XRP ratio from Midas
    const res = await fetch(midasUrl);
    
    if (!res.ok) {
      // eslint-disable-next-line no-console
      console.warn('[priceService] Failed to fetch mXRP price from Midas API, status:', res.status);
      return NaN;
    }
    
    const data: MidasPricePoint[] = await res.json();
    // eslint-disable-next-line no-console
    console.log('[priceService] Midas API response:', data);
    
    // Get the most recent mXRP/XRP ratio
    if (!data || data.length === 0) {
      // eslint-disable-next-line no-console
      console.warn('[priceService] Midas API returned empty data');
      return NaN;
    }
    
    const latestRatio = data[data.length - 1].price;
    // eslint-disable-next-line no-console
    console.log('[priceService] Latest mXRP/XRP ratio:', latestRatio);
    
    // Try to get XRP price from cache first (it's likely already fetched)
    let xrpPriceUSD = cache["ripple"]?.price;
    // eslint-disable-next-line no-console
    console.log('[priceService] XRP price from cache:', xrpPriceUSD);
    
    // If not in cache, try fetching from Binance
    if (!xrpPriceUSD || xrpPriceUSD <= 0) {
      // eslint-disable-next-line no-console
      console.log('[priceService] Fetching XRP price from Binance...');
      xrpPriceUSD = await fetchBinance("XRPUSDT");
      // eslint-disable-next-line no-console
      console.log('[priceService] XRP price from Binance:', xrpPriceUSD);
    }
    
    if (isNaN(xrpPriceUSD) || xrpPriceUSD <= 0) {
      // eslint-disable-next-line no-console
      console.warn('[priceService] Failed to fetch XRP price for mXRP calculation');
      return NaN;
    }
    
    // mXRP USD price = (mXRP/XRP ratio) * (XRP/USD price)
    const mxrpPriceUSD = latestRatio * xrpPriceUSD;
    
    // eslint-disable-next-line no-console
    console.log(`[priceService] ✅ mXRP calculation: ${latestRatio.toFixed(8)} (mXRP/XRP) * $${xrpPriceUSD.toFixed(4)} (XRP/USD) = $${mxrpPriceUSD.toFixed(4)} USD`);
    
    return mxrpPriceUSD;
  } catch (e) {
    // eslint-disable-next-line no-console
    console.error('[priceService] Error fetching mXRP price from Midas:', e);
    return NaN;
  }
}

// Batch fetch Coingecko prices for multiple ids
async function fetchCGs(cgIds: string[]): Promise<Record<string, number>> {
  if (!cgIds.length) return {};
  if (isCGRatelimited()) {
    // Don't even try if recently rate-limited
    return Object.fromEntries(cgIds.map((id) => [id, NaN]));
  }
  try {
    const ids = cgIds.join(",");
    const res = await fetch(
      `/api/coingecko/api/v3/simple/price?ids=${ids}&vs_currencies=usd`
    );
    if (res.status === 429) {
      setCGRatelimit();
      // eslint-disable-next-line no-console
      console.warn(`[priceService] Coingecko rate limited (429)`);
      return Object.fromEntries(cgIds.map((id) => [id, NaN]));
    }
    if (!res.ok) throw new Error(`CG_${res.status}`);
    const json = await res.json();
    const out: Record<string, number> = {};
    cgIds.forEach((id) => {
      out[id] = json[id]?.usd ?? NaN;
    });
    return out;
  } catch (e) {
    // eslint-disable-next-line no-console
    console.warn(`[priceService] Coingecko batch fetch failed:`, e);
    return Object.fromEntries(cgIds.map((id) => [id, NaN]));
  }
}

async function fetchBinance(binance: string): Promise<number> {
  if (!binance || binance.trim() === "") return NaN;
  try {
    const res = await fetch(
      `/api/binance/api/v3/ticker/price?symbol=${binance}`
    );
    if (!res.ok) {
      if (res.status === 400) {
        // eslint-disable-next-line no-console
        console.warn(`[priceService] Binance symbol invalid: ${binance}`);
        return NaN;
      }
      throw new Error(`Binance_${res.status}`);
    }
    const ticker = await res.json();
    if (!ticker.price) return NaN;
    return parseFloat(ticker.price);
  } catch (e) {
    // eslint-disable-next-line no-console
    console.warn(`[priceService] Binance fetch failed for ${binance}:`, e);
    return NaN;
  }
}

// Fetch ELYS price from Elys DEX API
async function fetchElysElysUsdt(): Promise<number> {
  try {
    const res = await fetch(
      "https://prices.elys.network/realtime/market-summary"
    );
    if (!res.ok) throw new Error(`Elys_${res.status}`);
    const data = await res.json();
    // Find ELYS-USDT
    const elys = Array.isArray(data)
      ? data.find((d: any) => d.instrument === "ELYS-USDT")
      : Array.isArray(data.data)
      ? data.data.find((d: any) => d.instrument === "ELYS-USDT")
      : undefined;
    if (!elys || typeof elys.price !== "number") return NaN;
    return elys.price;
  } catch (e) {
    // eslint-disable-next-line no-console
    console.warn("[priceService] Elys DEX price fetch failed:", e);
    return NaN;
  }
}

/**
 * Batch get USD prices for multiple ids.
 * @param idsArr Array of PriceIds
 * @returns Record<string, number> where key is cg or binance id
 */
export async function getPrices(
  idsArr: PriceIds[]
): Promise<Record<string, number>> {
  const cache = loadCache();
  const now = Date.now();
  const cgIds = idsArr.map((i) => i.cg).filter(Boolean);
  const uncachedCgIds = cgIds.filter((id) => {
    const entry = cache[id];
    return !(entry && now - entry.ts < TTL_MS && entry.price > 0);
  });

  let cgPrices: Record<string, number> = {};
  // Special handling for ELYS: fetch from Elys DEX API
  let elysPrice: number | undefined;
  const hasElys = idsArr.some((i) => i.cg === "elys-token");
  if (hasElys) {
    // Use fetchElysElysUsdt helper
    try {
      elysPrice = await fetchElysElysUsdt();
      if (elysPrice !== undefined && !isNaN(elysPrice) && elysPrice > 0) {
        cache["elys-token"] = { price: elysPrice, ts: now };
        saveCache(cache);
      }
    } catch (e) {
      // eslint-disable-next-line no-console
      console.warn("[priceService] Elys DEX price fetch failed:", e);
    }
  }

  if (uncachedCgIds.length) {
    // Remove 'elys-token' and 'midas-xrp' from Coingecko batch if present
    const filteredCgIds = uncachedCgIds.filter((id) => id !== "elys-token" && id !== "midas-xrp");
    if (filteredCgIds.length) {
      cgPrices = await fetchCGs(filteredCgIds);
      for (const id of filteredCgIds) {
        const price = cgPrices[id];
        if (!isNaN(price) && price > 0) {
          cache[id] = { price, ts: now };
        }
      }
      saveCache(cache);
    }
  }

  // Fetch mXRP AFTER other prices (especially XRP) are cached
  // Special handling for mXRP: fetch from Midas API
  let mxrpPrice: number | undefined;
  const hasMXRP = idsArr.some((i) => i.cg === "midas-xrp");
  // eslint-disable-next-line no-console
  console.log('[priceService] Has mXRP in request?', hasMXRP, 'idsArr:', idsArr.map(i => i.cg));
  if (hasMXRP) {
    try {
      mxrpPrice = await fetchMidasMXRP(cache);
      if (mxrpPrice !== undefined && !isNaN(mxrpPrice) && mxrpPrice > 0) {
        cache["midas-xrp"] = { price: mxrpPrice, ts: now };
        saveCache(cache);
        // eslint-disable-next-line no-console
        console.log('[priceService] mXRP price cached successfully:', mxrpPrice);
      } else {
        // eslint-disable-next-line no-console
        console.warn('[priceService] mXRP price fetch returned invalid value:', mxrpPrice);
      }
    } catch (e) {
      // eslint-disable-next-line no-console
      console.warn("[priceService] Midas mXRP price fetch failed:", e);
    }
  }

  const STABLES = [
    "first-digital-usd", // FDUSD
    "tether", // USDT
    "dai", // DAI
    "usd-coin", // USDC
  ];
  const STABLE_BINANCE = [
    "FDUSDUSDT",
    "USDTUSD",
    "USDTUSDT",
    "DAIUSDT",
    "USDCUSDT",
  ];

  const result: Record<string, number> = {};
  for (const ids of idsArr) {
    const cacheKey = ids.cg || ids.binance;
    let price: number | undefined;
    if (ids.cg === "elys-token") {
      price = elysPrice;
    } else if (ids.cg === "midas-xrp") {
      price = mxrpPrice;
    } else {
      price = cache[ids.cg]?.price;
      if (!price || price <= 0) {
        price = cgPrices[ids.cg];
      }
    }
    if (!isNaN(price!) && price! > 0) {
      result[cacheKey] = price!;
      continue;
    }
    // fallback: try Binance
    price = cache[ids.binance]?.price;
    if (!price || price <= 0) {
      price = await fetchBinance(ids.binance);
      if (!isNaN(price) && price > 0) {
        cache[ids.binance] = { price, ts: now };
        saveCache(cache);
      }
    }
    // Stablecoin fallback to $1
    const isStable =
      STABLES.includes(ids.cg) || STABLE_BINANCE.includes(ids.binance);
    if ((isNaN(price) || price <= 0) && isStable) {
      price = 1;
    }
    result[cacheKey] = !isNaN(price) && price > 0 ? price : 0;
  }
  return result;
}

/**
 * Get USD price, cached + fallback, for a single asset.
 */
export async function getPrice(ids: PriceIds): Promise<number> {
  const prices = await getPrices([ids]);
  const cacheKey = ids.cg || ids.binance;
  return prices[cacheKey] ?? 0;
}

export async function loadPrices(ids: PriceIds[]): Promise<void> {
  await getPrices(ids);
}
