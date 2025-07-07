import { useEffect, useState } from "react";
import { LocalStorageCacheService } from '../services/cacheService';
import { getPrice } from '../services/priceService';

export interface NFTCollection {
  address: string;
  name: string;
  symbol: string;
  logo: string;
  totalSupply: number;
  price: number;
  valueUsd: number;
}

export function useNFTCollections(enabled: boolean) {
  const [nfts, setNfts] = useState<NFTCollection[]>([]);
  const [loading, setLoading] = useState(false);
  const nftCache = new LocalStorageCacheService('nfts-cache', 2 * 60 * 1000);
  const logoCache = new LocalStorageCacheService('logo-cache', 365 * 24 * 60 * 60 * 1000); // 1 year

  function fetchWithCorsFallbacks(urls: string[], options?: RequestInit): Promise<Response> {
    // Try each URL in order until one succeeds (status 200-299)
    return new Promise((resolve, reject) => {
      let i = 0;
      const tryNext = () => {
        if (i >= urls.length) {
          reject(new Error('All proxies failed'));
          return;
        }
        fetch(urls[i], options)
          .then(res => {
            if (res.ok) resolve(res);
            else {
              i++;
              tryNext();
            }
          })
          .catch(() => {
            i++;
            tryNext();
          });
      };
      tryNext();
    });
  }

  // Helper to get/set logo in a single forever-cache object
  function getLogoFromCache(address: string): string | undefined {
    const all = logoCache.get<Record<string, string>>() || {};
    return all[address.toLowerCase()];
  }
  function setLogoInCache(address: string, logo: string) {
    const all = logoCache.get<Record<string, string>>() || {};
    all[address.toLowerCase()] = logo;
    logoCache.set(all);
  }

  useEffect(() => {
    if (!enabled) {
      setNfts([]);
      return;
    }
    const cached = nftCache.get<NFTCollection[]>();
    if (cached) {
      setNfts(cached);
      setLoading(false);
      return;
    }
    setLoading(true);
    const explorerBase = 'https://explorer.xrplevm.org/api/v2';
    const mintiqBase = 'https://mintiq.market/trade';
    const corsProxies = [
      'https://corsproxy.io/?',
      'https://api.allorigins.win/raw?url=',
      'https://thingproxy.freeboard.io/fetch/',
    ];
    const makeProxyUrls = (target: string) => corsProxies.map(proxy => proxy + encodeURIComponent(target));
    fetchWithCorsFallbacks(makeProxyUrls(`${explorerBase}/tokens?type=ERC-721`))
      .then(res => res.json())
      .then(async (data) => {
        // Fetch XRP price once per session from priceService
        let xrpUsd = 0;
        try {
          xrpUsd = await getPrice({ cg: "ripple", binance: "XRPUSDT" });
        } catch { xrpUsd = 0; }
        const collections = await Promise.all(
          data.items.map(async (col: any) => {
            // Get details
            let details;
            try {
              const detailsRes = await fetchWithCorsFallbacks(makeProxyUrls(`${explorerBase}/tokens/${col.address}`));
              details = await detailsRes.json();
            } catch { details = {}; }
            const totalSupply = Number(details.total_supply) || 0;
            const name = details.name || details.symbol || col.address;
            // Get logo by scraping mintiq.market, cache forever
            let logo = details.logo || col.logo || "";
            const cachedLogo = getLogoFromCache(col.address);
            if (!logo && cachedLogo) {
              logo = cachedLogo;
            }
            if (!logo) {
              try {
                const htmlRes = await fetchWithCorsFallbacks(makeProxyUrls(`${mintiqBase}/${col.address}`));
                const html = await htmlRes.text();
                const match = html.match(/<img[^>]*id=["']collection-logo["'][^>]*src=["']([^"']+)["']/);
                if (match) logo = match[1];
                else logo = "/assets/XRPLEVM_FullWhiteLogo.png";
                setLogoInCache(col.address, logo);
              } catch {
                logo = "/assets/XRPLEVM_FullWhiteLogo.png";
                setLogoInCache(col.address, logo);
              }
            }
            // Get last price
            let price = 0;
            try {
              const transfersRes = await fetchWithCorsFallbacks(makeProxyUrls(`${explorerBase}/tokens/${col.address}/transfers`));
              const transfers = await transfersRes.json();
              const last = transfers.items?.find((t: any) => t.type === "token_transfer");
              if (last && last.transaction_hash) {
                const txRes = await fetchWithCorsFallbacks(makeProxyUrls(`${explorerBase}/transactions/${last.transaction_hash}`));
                const tx = await txRes.json();
                if (tx.value) price = Number(tx.value) / 1e18;
              }
            } catch {}
            // Use price * totalSupply for TVL if both are present, else fallback to xrpUsd
            let valueUsd = 0;
            try {
              if (price && totalSupply) {
                valueUsd = price * totalSupply;
              } else {
                valueUsd = price * totalSupply * xrpUsd;
              }
            } catch { valueUsd = 0; }
            // Abbreviate symbol if it's a 0x address
            let symbol = name;
            if (/^0x[a-fA-F0-9]{40}$/.test(symbol)) {
              symbol = symbol.slice(0, 6) + '...' + symbol.slice(-4);
            }
            return {
              address: col.address,
              name,
              symbol,
              logo,
              totalSupply,
              price,
              valueUsd,
            };
          })
        );
        setNfts(collections);
        nftCache.set(collections);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [enabled]);

  return { nfts, loading };
}
