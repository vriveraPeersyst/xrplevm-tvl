import { isBrowser } from '../utils/isBrowser';

const CACHE_KEY = "price-cache";
const TTL_MS = 5 * 60 * 1000; // 5 minutes

// Use direct API URLs
const COINGECKO_API_BASE = "https://api.coingecko.com";
const BINANCE_API_BASE = "https://api.binance.com";

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
      `${COINGECKO_API_BASE}/api/v3/simple/price?ids=${ids}&vs_currencies=usd`
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
      `${BINANCE_API_BASE}/api/v3/ticker/price?symbol=${binance}`
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

  // mXRP is handled in coingeckoService.ts with XRP price × 1.002

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
      // mXRP is handled in coingeckoService, skip here
      price = undefined;
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
