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
  binance: string;
}

// Batch fetch Coingecko prices for multiple ids
async function fetchCGs(cgIds: string[]): Promise<Record<string, number>> {
  if (!cgIds.length) return {};
  try {
    const ids = cgIds.join(',');
    const res = await fetch(`/api/coingecko/api/v3/simple/price?ids=${ids}&vs_currencies=usd`);
    if (!res.ok) throw new Error(`CG_${res.status}`);
    const json = await res.json();
    const out: Record<string, number> = {};
    cgIds.forEach(id => {
      out[id] = json[id]?.usd ?? NaN;
    });
    return out;
  } catch (e) {
    // eslint-disable-next-line no-console
    console.warn(`[priceService] Coingecko batch fetch failed:`, e);
    return Object.fromEntries(cgIds.map(id => [id, NaN]));
  }
}

async function fetchBinance(binance: string): Promise<number> {
  if (!binance || binance.trim() === '') return NaN;
  try {
    const res = await fetch(`/api/binance/api/v3/ticker/price?symbol=${binance}`);
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

/**
 * Batch get USD prices for multiple ids.
 * @param idsArr Array of PriceIds
 * @returns Record<string, number> where key is cg or binance id
 */
export async function getPrices(idsArr: PriceIds[]): Promise<Record<string, number>> {
  const cache = loadCache();
  const now = Date.now();
  const cgIds = idsArr.map(i => i.cg).filter(Boolean);
  const uncachedCgIds = cgIds.filter(id => {
    const entry = cache[id];
    return !(entry && now - entry.ts < TTL_MS && entry.price > 0);
  });

  let cgPrices: Record<string, number> = {};
  if (uncachedCgIds.length) {
    cgPrices = await fetchCGs(uncachedCgIds);
    for (const id of uncachedCgIds) {
      const price = cgPrices[id];
      if (!isNaN(price) && price > 0) {
        cache[id] = { price, ts: now };
      }
    }
    saveCache(cache);
  }

  const result: Record<string, number> = {};
  for (const ids of idsArr) {
    const cacheKey = ids.cg || ids.binance;
    let price = cache[ids.cg]?.price;
    if (!price || price <= 0) {
      price = cgPrices[ids.cg];
    }
    if (!isNaN(price) && price > 0) {
      result[cacheKey] = price;
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