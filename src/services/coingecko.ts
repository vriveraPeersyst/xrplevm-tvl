const cache = new Map<string, { usd: number; logo: string }>();
const logoUrlCache = new Map<string, string>(); // New: cache for logo URLs

export async function priceAndLogo(id: string) {
  if (cache.has(id)) return cache.get(id)!;
  // Fetch price and logo in parallel
  const [priceRes, logoRes] = await Promise.all([
    fetch(`/api/coingecko/api/v3/simple/price?ids=${id}&vs_currencies=usd`),
    fetch(`/api/coingecko/api/v3/coins/${id}`)
  ]);
  let usd = 0;
  let logo = '';
  try {
    const priceJson = await priceRes.json();
    if (priceRes.ok && priceJson && priceJson[id] && typeof priceJson[id].usd === 'number') {
      usd = priceJson[id].usd;
    } else {
      console.warn(`Coingecko price missing for ${id}`, priceJson);
    }
  } catch (e) {
    console.warn(`Coingecko price fetch error for ${id}`, e);
  }
  try {
    const logoJson = await logoRes.json();
    if (logoRes.ok && logoJson && logoJson.image && logoJson.image.small) {
      logo = logoJson.image.small;
      logoUrlCache.set(id, logo); // Save logo URL for this id
    } else if (logoUrlCache.has(id)) {
      logo = logoUrlCache.get(id)!; // Use cached logo if available
    } else {
      console.warn(`Coingecko logo missing for ${id}`, logoJson);
    }
  } catch (e) {
    if (logoUrlCache.has(id)) {
      logo = logoUrlCache.get(id)!; // Use cached logo if available
    } else {
      console.warn(`Coingecko logo fetch error for ${id}`, e);
    }
  }
  const v = { usd, logo };
  cache.set(id, v);
  return v;
}
