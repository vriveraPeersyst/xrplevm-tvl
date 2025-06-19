import { useState, useEffect } from 'react';

interface SupplyState {
  [key: string]: {
    amount?: string;
    error?: string;
  };
}

/**
 * Custom hook to load total supply for a list of chains.
 *
 * @param env - environment/config object (any type)
 * @param chains - array of chain config objects (any type)
 * @param fetchTotalSupply - function to fetch total supply for a chain
 */
export function useTotalSupply(
  env: any,
  chains: any[],
  fetchTotalSupply: (env: any, chain: any) => Promise<string>
): { loading: boolean; data: SupplyState } {
  const [data, setData] = useState<SupplyState>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    Promise.all(
      chains.map(async (chain) => {
        try {
          const amount = await fetchTotalSupply(env, chain);
          return { key: chain.key, amount };
        } catch (err: any) {
          return { key: chain.key, error: err.message };
        }
      }),
    ).then((results) => {
      const next: SupplyState = {};
      results.forEach((r) => {
        next[r.key] = { amount: r.amount, error: r.error };
      });
      setData(next);
      setLoading(false);
    });
  }, [env, chains, fetchTotalSupply]);

  return { loading, data };
}
