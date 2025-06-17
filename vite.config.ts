// vite.config.ts
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      // XRPL-EVM Testnet
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
    },
  },
})
