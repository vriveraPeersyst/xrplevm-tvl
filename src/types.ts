export type Source =
  | 'XRPL' | 'Ethereum' | 'Osmosis' | 'Elys' | 'Injective'
  | 'Noble' | 'Cosmos Hub' | 'BSC' | 'Solana' | 'Sui';

export type Destination =
  | 'XRPL EVM' | 'Osmosis' | 'Elys Network'
  | 'Injective' | 'Cosmos Hub' | 'Noble';

export interface AssetStatic {
  key: string;
  symbol: string;
  decimals: number;
  source: Source;
  dest: Destination;
  address?: string;      // contracts on XRPL-EVM
  denom?: string;        // axrp on Cosmos
  cg: string;            // Coingecko id
  binance: string;       // Binance symbol
}

export interface Row extends AssetStatic {
  logo: string;          // token icon
  chainLogo: string;     // destination badge
  quantity: number;
  priceUsd: number;
  valueUsd: number;
}
