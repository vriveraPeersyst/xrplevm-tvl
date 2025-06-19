// vite.config.ts
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
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
        rewrite: path => path.replace(/^\/api\/noble/, ''),
      },
      // Coingecko
      '/api/coingecko': {
        target: 'https://api.coingecko.com',
        changeOrigin: true,
        rewrite: path => path.replace(/^\/api\/coingecko/, ''),
      },
    },
  },
})
