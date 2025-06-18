import type { ChainConfig } from '../types';

/** List of supported chains with their settings */
export const CHAINS: ChainConfig[] = [
  {
    key: 'xrplEvmTestnet',
    displayName: 'XRPL EVM Testnet',
    network: 'testnet',
    denom: 'axrp',
    endpoints: {
      testnet: '/api/xrplEvmTestnet',
      mainnet: '',
    },
  },
  {
    key: 'elysNetworkTestnet',
    displayName: 'Elys Network Testnet',
    network: 'testnet',
    denom: 'ibc/E925EC46A2F4B84815DB7218ADF272989DADD18372C779F68DB31A6BC4F91B7D',
    endpoints: {
      testnet: '/api/elysNetworkTestnet',
      mainnet: '',
    },
  },
  {
    key: 'injectiveTestnet',
    displayName: 'Injective Testnet',
    network: 'testnet',
    denom: 'ibc/F9EEDC0E75CD67E8A72314B287BE7A221C365DE0F3D19D3E3272F07332ED8C1E',
    endpoints: {
      testnet: '/api/injectiveTestnet',
      mainnet: '',
    },
  },
  {
    key: 'osmosisTestnet',
    displayName: 'Osmosis Testnet',
    network: 'testnet',
    denom: 'ibc/24F3F83587084430E25E268A143565FEF5C84AE2308F2657BC46D1F227D2AF65',
    endpoints: {
      testnet: '/api/osmosisTestnet',
      mainnet: '',
    },
  },
  {
    key: 'cosmosProviderHub',
    displayName: 'Cosmos Provider Hub',
    network: 'testnet',
    denom: 'ibc/68D1062C8B0F11B913FD9285553A7529C3C26D0C49FB64D135E255D9742F6A01',
    endpoints: {
      testnet: '/api/cosmosProviderHub',
      mainnet: '',
    },
  },
  {
    key: 'xrplEvm',
    displayName: 'XRPL EVM',
    network: 'mainnet',
    denom: 'axrp',
    endpoints: {
      testnet: '',
      mainnet: '/api/xrplEvm',
    },
  },
  {
    key: 'elysNetwork',
    displayName: 'Elys Network',
    network: 'mainnet',
    denom: 'ibc/8464A63954C0350A26C8588E20719F3A0AC8705E4CA0F7450B60C3F16B2D3421',
    endpoints: {
      testnet: '',
      mainnet: '/api/elysNetwork',
    },
  },
  {
    key: 'injective',
    displayName: 'Injective',
    network: 'mainnet',
    denom: 'ibc/C3F872E2DF65D066215F3D61364A7D5342784DAB2A5B0441B9B558D692802902',
    endpoints: {
      testnet: '',
      mainnet: '/api/injective',
    },
  },
  {
    key: 'osmosis',
    displayName: 'Osmosis',
    network: 'mainnet',
    denom: 'ibc/46EB46DB30D3BBC6F404A9232C09785F36D40DA05C662A8E295712ECBAFF1609',
    endpoints: {
      testnet: '',
      mainnet: '/api/osmosis',
    },
  },
  {
    key: 'cosmosHub',
    displayName: 'CosmosHub',
    network: 'mainnet',
    denom: 'ibc/0D45B5DB56A06CE2B3559D8E2170E160A5516AC157A14F1C0B129577837083BC',
    endpoints: {
      testnet: '',
      mainnet: '/api/cosmosHub',
    },
  },
  {
    key: 'noble',
    displayName: 'Noble',
    network: 'mainnet',
    denom: 'ibc/B897654C6F340CE7063AB5BF0DE3F4372E86B40641B7FD7B60707F00CD6E0426',
    endpoints: {
      testnet: '',
      mainnet: '/api/noble',
    },
  },
];