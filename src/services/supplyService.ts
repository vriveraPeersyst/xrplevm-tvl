// src/services/supplyService.ts

import type { Env, ChainConfig } from '../types';

/**
 * Formats a big integer string into a decimal string with the given precision.
 */
function formatUnits(amount: string, decimals: number): string {
  // Convert to number, divide by 10^decimals, and fix to 2 decimals
  const n = Number(amount) / 10 ** decimals;
  return n.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

/**
 * Fetches the total supply for a given chain configuration and environment.
 *
 * @throws {Error} when endpoint is missing, network fails, or JSON is invalid.
 */
export async function fetchTotalSupply(
  env: Env,
  chain: ChainConfig,
  decimals: number = 18,
): Promise<string> {
  const baseUrl = chain.endpoints[env];
  if (!baseUrl) {
    throw new Error(`No endpoint for ${chain.key} on ${env}`);
  }

  const url = `${baseUrl}/cosmos/bank/v1beta1/supply/by_denom?denom=${encodeURIComponent(chain.denom)}`;
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error(`HTTP ${res.status} fetching ${chain.key}`);
  }

  let payload: { amount?: { amount: string } };
  try {
    payload = await res.json();
    // Debug: log the response for cosmos and osmosis
    if (chain.key === 'cosmos' || chain.key === 'osmosis') {
      console.log(`[DEBUG] ${chain.key} response:`, payload);
    }
  } catch (err) {
    const text = await res.text();
    throw new Error(`Invalid JSON from ${chain.key}: ${text.substring(0, 100)}`);
  }

  const raw = payload.amount?.amount ?? '0';
  return formatUnits(raw, decimals);
}
