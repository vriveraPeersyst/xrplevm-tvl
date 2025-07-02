// vite.config.ts
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  base: './',
  plugins: [react()],
  server: {
    port: process.env.PORT ? parseInt(process.env.PORT as string, 10) : 5173,
    proxy: {
      // XRPL EVM
      '/api/xrplEvm': {
        target: 'https://cosmos-api.xrplevm.org/',
        changeOrigin: true,
        rewrite: path => path.replace(/^\/api\/xrplEvm/, ''),
        configure: (proxy) => {
          proxy.on('proxyRes', (proxyRes) => {
            proxyRes.headers['Access-Control-Allow-Origin'] = 'https://xrplevm-tvl-puce.vercel.app/';
          });
        },
      },
      // Elys
      '/api/elysNetwork': {
        target: 'http://api.elys.network',
        changeOrigin: true,
        rewrite: path => path.replace(/^\/api\/elysNetwork/, ''),
        configure: (proxy) => {
          proxy.on('proxyRes', (proxyRes) => {
            proxyRes.headers['Access-Control-Allow-Origin'] = 'https://xrplevm-tvl-puce.vercel.app/';
          });
        },
      },
      // Injective
      '/api/injective': {
        target: 'https://injective-rest.publicnode.com',
        changeOrigin: true,
        rewrite: path => path.replace(/^\/api\/injective/, ''),
        configure: (proxy) => {
          proxy.on('proxyRes', (proxyRes) => {
            proxyRes.headers['Access-Control-Allow-Origin'] = 'https://xrplevm-tvl-puce.vercel.app/';
          });
        },
      },
      // Osmosis
      '/api/osmosis': {
        target: 'https://osmosis-rest.publicnode.com',
        changeOrigin: true,
        rewrite: path => path.replace(/^\/api\/osmosis/, ''),
        configure: (proxy) => {
          proxy.on('proxyRes', (proxyRes) => {
            proxyRes.headers['Access-Control-Allow-Origin'] = 'https://xrplevm-tvl-puce.vercel.app/';
          });
        },
      },
      // Cosmos Hub
      '/api/cosmosHub': {
        target: 'https://cosmoshub.lava.build:443',
        changeOrigin: true,
        rewrite: path => path.replace(/^\/api\/cosmosHub/, ''),
        configure: (proxy) => {
          proxy.on('proxyRes', (proxyRes) => {
            proxyRes.headers['Access-Control-Allow-Origin'] = 'https://xrplevm-tvl-puce.vercel.app/';
          });
        },
      },
      // Noble
      '/api/noble': {
        target: 'https://noble-api.polkachu.com',
        changeOrigin: true,
        rewrite: path => path.replace(/^\/api\/noble/, ''),
        configure: (proxy) => {
          proxy.on('proxyRes', (proxyRes) => {
            proxyRes.headers['Access-Control-Allow-Origin'] = 'https://xrplevm-tvl-puce.vercel.app/';
          });
        },
      },
      // Coingecko
      '/api/coingecko': {
        target: 'https://api.coingecko.com',
        changeOrigin: true,
        rewrite: path => path.replace(/^\/api\/coingecko/, ''),
        configure: (proxy) => {
          proxy.on('proxyRes', (proxyRes) => {
            proxyRes.headers['Access-Control-Allow-Origin'] = 'https://xrplevm-tvl-puce.vercel.app/';
          });
        },
      },
      // Binance
      '/api/binance': {
        target: 'https://api.binance.com',
        changeOrigin: true,
        rewrite: path => path.replace(/^\/api\/binance/, ''),
        configure: (proxy) => {
          proxy.on('proxyRes', (proxyRes) => {
            proxyRes.headers['Access-Control-Allow-Origin'] = 'https://xrplevm-tvl-puce.vercel.app/';
          });
        },
      },
    },
    allowedHosts: true,
  },
  preview: {
    allowedHosts: true,
  },
})