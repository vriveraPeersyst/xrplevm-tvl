// vite.config.ts
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      // XRPL EVM Testnet
      '/api/xrplEvmTestnet': {
        target: 'http://cosmos.testnet.xrplevm.org:1317',
        changeOrigin: true,
        rewrite: path => path.replace(/^\/api\/xrplEvmTestnet/, ''),
      },
      // Elys Testnet
      '/api/elysNetworkTestnet': {
        target: 'https://elys-testnet-api.itrocket.net',
        changeOrigin: true,
        rewrite: path => path.replace(/^\/api\/elysNetworkTestnet/, ''),
      },
      // Injective Testnet
      '/api/injectiveTestnet': {
        target: 'https://injective-testnet-rest.publicnode.com',
        changeOrigin: true,
        rewrite: path => path.replace(/^\/api\/injectiveTestnet/, ''),
      },
      // Osmosis Testnet
      '/api/osmosisTestnet': {
        target: 'https://lcd.osmotest5.osmosis.zone/',
        changeOrigin: true,
        rewrite: path => path.replace(/^\/api\/osmosisTestnet/, ''),
      },
      // Osmosis Testnet
      '/api/cosmosProviderHub': {
        target: 'https://cosmos-testnet-api.itrocket.net',
        changeOrigin: true,
        rewrite: path => path.replace(/^\/api\/cosmosProviderHub/, ''),
      },
      // XRPL EVM
      '/api/xrplEvm': {
        target: 'https://cosmos-api-mainnet.aws.peersyst.tech',
        changeOrigin: true,
        rewrite: path => path.replace(/^\/api\/xrplEvm/, ''),
      },
      // Elys
      '/api/elysNetwork': {
        target: 'https://api.elys.network',
        changeOrigin: true,
        rewrite: path => path.replace(/^\/api\/elysNetwork/, ''),
      },
      // Injective
      '/api/injective': {
        target: 'https://injective-rest.publicnode.com',
        changeOrigin: true,
        rewrite: path => path.replace(/^\/api\/injective/, ''),
      },
      // Osmosis
      '/api/osmosis': {
        target: 'https://osmosis-rest.publicnode.com',
        changeOrigin: true,
        rewrite: path => path.replace(/^\/api\/osmosis/, ''),
      },
      // Cosmos Hub
      '/api/cosmosHub': {
        target: 'https://cosmoshub.lava.build:443',
        changeOrigin: true,
        rewrite: path => path.replace(/^\/api\/cosmosHub/, ''),
      },
      // Noble
      '/api/noble': {
        target: 'https://noble-api.polkachu.com',
        changeOrigin: true,
        rewrite: path => path.replace(/^\/api\/cosmosHub/, ''),
      },
    },
  },
})
