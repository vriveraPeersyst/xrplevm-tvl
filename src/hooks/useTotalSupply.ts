import { useState, useEffect } from 'react';
import type { Env } from '../types';
import type { ChainConfig } from '../types';
import { fetchTotalSupply } from '../services/supplyService';

interface SupplyState {
  [key: string]: {
    amount?: string;
    error?: string;
  };
}

/**
 * Custom hook to load total supply for a list of chains.
 */
export function useTotalSupply(
  env: Env,
  chains: ChainConfig[],
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
  }, [env, chains]);

  return { loading, data };
}
