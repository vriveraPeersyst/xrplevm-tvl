import type { Row } from '../types';

const SQUID_CHAIN_IDS: Record<string, number> = {
  'Ethereum': 1,
  'XRPL EVM': 1440000,
  'BSC': 56,
  // Add more EVM chains as needed
};

const SKIP_CHAIN_IDS: Record<string, string> = {
  'Cosmos Hub': 'cosmoshub-4',
  'Osmosis': 'osmosis-1',
  'Elys Network': 'elys-1',
  'Injective': 'injective-1',
  'Noble': 'noble-1',
  // Add more Cosmos chains as needed
};

const SKIP_ASSET_IDS: Record<string, string> = {
  ATOM: 'uatom',
  OSMO: 'uosmo',
  ELYS: 'uelys',
  INJ: 'uinj',
  // Add more asset denoms as needed
};

export function getSwapUrl(src: Row, dst: Row): string {
  const bothHaveAddr = src.address && dst.address;
  if (bothHaveAddr) {
    // Squid Router
    const a = SQUID_CHAIN_IDS[src.dest] || SQUID_CHAIN_IDS[src.source];
    const b = SQUID_CHAIN_IDS[dst.dest] || SQUID_CHAIN_IDS[dst.source];
    return `https://beta.app.squidrouter.com/?chains=${a}%2C${b}&tokens=${src.address}%2C${dst.address}`;
  } else {
    // Skip Go
    const srcChain = SKIP_CHAIN_IDS[src.dest] || SKIP_CHAIN_IDS[src.source];
    const dstChain = SKIP_CHAIN_IDS[dst.dest] || SKIP_CHAIN_IDS[dst.source];
    const srcAsset = SKIP_ASSET_IDS[src.symbol];
    const dstAsset = SKIP_ASSET_IDS[dst.symbol];
    return `https://go.skip.build/?src_asset=${srcAsset}&src_chain=${srcChain}&dest_asset=${dstAsset}&dest_chain=${dstChain}`;
  }
}
