// vite.config.ts
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: process.env.PORT ? parseInt(process.env.PORT as string, 10) : 5173,
    proxy: {
      // XRPL EVM
      '/api/xrplEvm': {
        target: 'https://cosmos-api.xrplevm.org/',
        changeOrigin: true,
        rewrite: path => path.replace(/^\/api\/xrplEvm/, ''),
      },
      // Elys
      '/api/elysNetwork': {
        target: 'http://api.elys.network',
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
      // CoinMarketCap (requires VITE_CMC_API_KEY in .env)
      '/api/cmc': {
        target: 'https://pro-api.coinmarketcap.com',
        changeOrigin: true,
        rewrite: path => path.replace(/^\/api\/cmc/, ''),
      },
      // Binance
      '/api/binance': {
        target: 'https://api.binance.com',
        changeOrigin: true,
        rewrite: path => path.replace(/^\/api\/binance/, ''),
      },
    },
  },
  preview: {
    allowedHosts: ['tvl.peersyst.tech'],
  }
})
