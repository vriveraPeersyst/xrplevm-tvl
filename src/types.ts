export type Env = 'testnet' | 'mainnet';
export type ChainKey = 'xrplEvmTestnet' | 'elysNetworkTestnet' | 'injectiveTestnet' | 'osmosisTestnet' | 'cosmosProviderHub' | 'xrplEvm' | 'elysNetwork' | 'injective' | 'osmosis' | 'cosmosHub' | 'noble';

/**
 * Configuration for each supported chain.
 */
export interface ChainConfig {
  /** Unique chain key */
  key: ChainKey;
  /** Human‐readable name */
  displayName: string;
  /** IBC denomination or native denom */
  denom: string;
  /** REST endpoints for testnet and mainnet */
  endpoints: {
    testnet: string;
    mainnet: string;
  };
}
