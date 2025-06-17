import type { ChainConfig } from '../types';

/** List of supported chains with their settings */
export const CHAINS: ChainConfig[] = [
  {
    key: 'xrplEvm',
    displayName: 'XRPL EVM',
    denom: 'axrp',
    endpoints: {
      testnet: '/api/xrplEvm',
      mainnet: '',
    },
  },
  {
    key: 'elys',
    displayName: 'Elys',
    denom: 'ibc/E925EC46A2F4B84815DB7218ADF272989DADD18372C779F68DB31A6BC4F91B7D',
    endpoints: {
      testnet: '/api/elys',
      mainnet: '',
    },
  },
  {
    key: 'injective',
    displayName: 'Injective',
    denom: 'ibc/F9EEDC0E75CD67E8A72314B287BE7A221C365DE0F3D19D3E3272F07332ED8C1E',
    endpoints: {
      testnet: '/api/injective',
      mainnet: '',
    },
  },
  {
    key: 'osmosis',
    displayName: 'Osmosis',
    denom: 'ibc/24F3F83587084430E25E268A143565FEF5C84AE2308F2657BC46D1F227D2AF65',
    endpoints: {
      testnet: '/api/osmosis',
      mainnet: '',
    },
  },
];
