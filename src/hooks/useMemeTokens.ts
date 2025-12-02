import { useEffect, useState } from "react";
import { LocalStorageCacheService } from "../services/cacheService";
import { ASSETS } from "../config/assets";
import { scaleSupply } from "../utils/scaleSupply";

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
  const memeCache = new LocalStorageCacheService("memes-cache", 1 * 60 * 1000);

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

    // Fetch both RDDL and XRise33 tokens in parallel
    Promise.all([
      // RDDL meme tokens
      fetch(
        "https://corsproxy.io/?https://api.rddl.fun/tokens?paginate=:18:0&sort=marketCap:desc"
      )
        .then((res) => res.json())
        .then(async (data) => {
          const tokens = data.data;
          // Fetch priceUsd and totalSupply for each token
          return await Promise.all(
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
                decimals = explorerData.decimals
                  ? Number(explorerData.decimals)
                  : 18;
              } catch {}
              return {
                ...token,
                priceUsd: priceData.priceUsd,
                totalSupply,
                decimals,
              };
            })
          );
        })
        .catch(() => []),

      // XRise33 tokens
      fetch("https://api.xrise33.com/tokens")
        .then((res) => res.json())
        .then((data) => {
          if (!data.data || !Array.isArray(data.data)) return [];
          return data.data.map((token: any) => {
            // Calculate market cap from totalSupply and usdPerToken
            const totalSupply = token.totalSupply
              ? scaleSupply(
                  token.totalSupply,
                  Number(token.decimals || 18),
                  true
                )
              : "0";
            const priceUsd = token.usdPerToken
              ? String(token.usdPerToken)
              : "0";
            const marketCap = token.fdv ? String(token.fdv) : "0";

            return {
              address: token.address,
              symbol: token.symbol,
              name: token.name,
              logo: token.image || "/assets/XRPLEVM_FullWhiteLogo.png",
              marketCap,
              priceUsd,
              decimals: token.decimals || 18,
              totalSupply,
            };
          });
        })
        .catch(() => []),
    ])
      .then(([rddlTokens, xriseTokens]) => {
        // Tokens to hide from the list
        const hiddenTokens = new Set([
          "0x6a90E3aAB217b732Fa92f1678e41c4d18bcd6eD9".toLowerCase(),
        ]);

        // Get addresses of tokens already in main TVL (case-insensitive)
        const mainTvlAddresses = new Set(
          ASSETS.map((asset) => asset.address.toLowerCase())
        );

        // Filter out tokens that are already in main TVL or hidden
        const filteredRddlTokens = rddlTokens.filter(
          (token: any) =>
            !mainTvlAddresses.has(token.address.toLowerCase()) &&
            !hiddenTokens.has(token.address.toLowerCase())
        );

        const filteredXriseTokens = xriseTokens.filter(
          (token: any) =>
            !mainTvlAddresses.has(token.address.toLowerCase()) &&
            !hiddenTokens.has(token.address.toLowerCase())
        );

        // Combine both sources, avoiding duplicates by address
        const allTokens = [...filteredRddlTokens];
        const existingAddresses = new Set(
          filteredRddlTokens.map((t: any) => t.address.toLowerCase())
        );

        filteredXriseTokens.forEach((token: any) => {
          if (!existingAddresses.has(token.address.toLowerCase())) {
            allTokens.push(token);
          }
        });

        setMemes(allTokens);
        memeCache.set(allTokens);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [enabled]);

  return { memes, loading };
}
