// vite.config.ts
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      // XRPL-EVM Testnet
      '/api/xrplEvm': {
        target: 'http://cosmos.testnet.xrplevm.org:1317',
        changeOrigin: true,
        rewrite: path => path.replace(/^\/api\/xrplEvm/, ''),
      },
      // Elys Testnet
      '/api/elys': {
        target: 'https://elys-testnet-api.itrocket.net',
        changeOrigin: true,
        rewrite: path => path.replace(/^\/api\/elys/, ''),
      },
      // Injective Testnet
      '/api/injective': {
        target: 'https://injective-testnet-rest.publicnode.com',
        changeOrigin: true,
        rewrite: path => path.replace(/^\/api\/injective/, ''),
      },
      // Osmosis Testnet
      '/api/osmosis': {
        target: 'https://lcd.osmotest5.osmosis.zone/',
        changeOrigin: true,
        rewrite: path => path.replace(/^\/api\/osmosis/, ''),
      },
      // Osmosis Testnet
      '/api/cosmos': {
        target: 'https://cosmos-testnet-api.itrocket.net',
        changeOrigin: true,
        rewrite: path => path.replace(/^\/api\/cosmos/, ''),
      },
    },
  },
})
