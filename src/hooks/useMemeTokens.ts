import { useEffect, useState } from "react";
import { LocalStorageCacheService } from '../services/cacheService';

export interface MemeToken {
  address: string;
  symbol: string;
  name: string;
  logo: string;
  marketCap: string;
  priceUsd: string;
  decimals?: number;
  totalSupply?: string;
}

// Fetch meme tokens and their priceUsd
export function useMemeTokens(enabled: boolean) {
  const [memes, setMemes] = useState<MemeToken[]>([]);
  const [loading, setLoading] = useState(false);

  // Add cache for memes (10 min)
  const memeCache = new LocalStorageCacheService('memes-cache', 1 * 60 * 1000);

  useEffect(() => {
    if (!enabled) {
      setMemes([]);
      return;
    }
    // Try cache first
    const cached = memeCache.get<MemeToken[]>();
    if (cached) {
      setMemes(cached);
      setLoading(false);
      return;
    }
    setLoading(true);
    fetch("https://corsproxy.io/?https://api.rddl.fun/tokens?paginate=:18:0&sort=marketCap:desc")
      .then((res) => res.json())
      .then(async (data) => {
        const tokens = data.data;
        // Fetch priceUsd and totalSupply for each token
        const withDetails = await Promise.all(
          tokens.map(async (token: any) => {
            const priceRes = await fetch(
              `https://corsproxy.io/?https://api.rddl.fun/token?address=${token.address}`
            );
            const priceData = await priceRes.json();
            // Fetch totalSupply from explorer API
            let totalSupply = undefined;
            let decimals = 18;
            try {
              const explorerRes = await fetch(
                `https://corsproxy.io/?https://explorer.xrplevm.org/api/v2/tokens/${token.address}`
              );
              const explorerData = await explorerRes.json();
              totalSupply = explorerData.total_supply;
              // Extract decimals as a number from explorer API (string in response)
              decimals = explorerData.decimals ? Number(explorerData.decimals) : 18;
            } catch {}
            return {
              ...token,
              priceUsd: priceData.priceUsd,
              totalSupply,
              decimals,
            };
          })
        );
        setMemes(withDetails);
        memeCache.set(withDetails);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [enabled]);

  return { memes, loading };
}
