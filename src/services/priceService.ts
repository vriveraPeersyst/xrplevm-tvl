const CACHE_KEY = 'price-cache';
const TTL_MS = 5 * 60 * 1000; // 5 minutes

interface CacheEntry { price: number; ts: number }
type Cache = Record<string, CacheEntry>;

function loadCache(): Cache {
  try { return JSON.parse(localStorage.getItem(CACHE_KEY) || '{}'); }
  catch { return {}; }
}
function saveCache(c: Cache) {
  localStorage.setItem(CACHE_KEY, JSON.stringify(c));
}

export interface PriceIds {
  cg: string;
  cmc: string;
  binance: string;
}

async function fetchCG(cg: string): Promise<number> {
  const res = await fetch(`/api/coingecko/api/v3/simple/price?ids=${cg}&vs_currencies=usd`);
  if (res.status === 429) throw new Error('CG_RATE_LIMIT');
  const json = await res.json();
  return json[cg]?.usd as number;
}

async function fetchCMC(cmc: string): Promise<number> {
  const res = await fetch(`/api/cmc/v1/cryptocurrency/quotes/latest?slug=${cmc}`, {
    headers: { 'X-CMC_PRO_API_KEY': import.meta.env.VITE_CMC_API_KEY! }
  });
  if (!res.ok) throw new Error('CMC_ERROR');
  const data = await res.json();
  const key = Object.keys(data.data)[0];
  return data.data[key].quote.USD.price as number;
}

async function fetchBinance(binance: string): Promise<number> {
  const ticker = await fetch(`/api/binance/api/v3/ticker/price?symbol=${binance}`).then(r => r.json());
  return parseFloat(ticker.price);
}

/**
 * Get USD price, cached + fallback.
 */
export async function getPrice(ids: PriceIds): Promise<number> {
  const cache = loadCache();
  const cacheKey = ids.cg || ids.cmc || ids.binance;
  const entry = cache[cacheKey];
  if (entry && Date.now() - entry.ts < TTL_MS) {
    return entry.price;
  }

  let price: number;
  try {
    // Try Coingecko first
    price = await fetchCG(ids.cg);
    if (!isNaN(price) && price > 0) {
      cache[cacheKey] = { price, ts: Date.now() };
      saveCache(cache);
      return price;
    }
    // If Coingecko fails, try Binance
    price = await fetchBinance(ids.binance);
    if (!isNaN(price) && price > 0) {
      cache[cacheKey] = { price, ts: Date.now() };
      saveCache(cache);
      return price;
    }
    // If Binance fails, try CMC
    price = await fetchCMC(ids.cmc);
  } catch (e: any) {
    // If Coingecko throws 429, try Binance, then CMC
    try {
      price = await fetchBinance(ids.binance);
      if (!isNaN(price) && price > 0) {
        cache[cacheKey] = { price, ts: Date.now() };
        saveCache(cache);
        return price;
      }
      price = await fetchCMC(ids.cmc);
    } catch {
      try {
        price = await fetchCMC(ids.cmc);
      } catch {
        price = 0;
      }
    }
  }

  cache[cacheKey] = { price, ts: Date.now() };
  saveCache(cache);
  return price;
}
