// vite.config.ts
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    allowedHosts: true,
    proxy: {
      // Proxy Midas API requests to bypass CORS
      '/api/midas': {
        target: 'https://api-prod.midas.app/api/data',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/midas/, ''),
        configure: (proxy, _options) => {
          proxy.on('error', (err, _req, _res) => {
            console.log('Midas API proxy error', err);
          });
        },
      },
      // Proxy CoinGecko API requests to bypass CORS
      '/api/coingecko': {
        target: 'https://api.coingecko.com',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/coingecko/, ''),
        configure: (proxy, _options) => {
          proxy.on('error', (err, _req, _res) => {
            console.log('CoinGecko API proxy error', err);
          });
        },
      },
      // Proxy Binance API requests to bypass CORS
      '/api/binance': {
        target: 'https://api.binance.com',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/binance/, ''),
        configure: (proxy, _options) => {
          proxy.on('error', (err, _req, _res) => {
            console.log('Binance API proxy error', err);
          });
        },
      },
      // Proxy API requests to submission platform or mock endpoint
      '/api/tokens': {
        target: process.env.VITE_SUBMISSION_PLATFORM_URL || 'http://localhost:5000',
        changeOrigin: true,
        configure: (proxy, _options) => {
          proxy.on('error', (err, _req, _res) => {
            console.log('Proxy error', err);
          });
        },
        // Fallback to mock data if submission platform is not available
        bypass: (req, res) => {
          if (req.url === '/api/tokens/approved') {
            // Mock approved tokens for development
            if (res) {
              res.setHeader('Content-Type', 'application/json');
              res.end(JSON.stringify([
                {
                  id: "mock-1",
                  name: "Mock Token",
                  symbol: "MOCK",
                  address: "0x1234567890123456789012345678901234567890",
                  decimals: 18,
                  source: "Ethereum",
                  coingeckoId: "",
                  binanceSymbol: "",
                  image: "mock-token.png",
                  status: "approved"
                }
              ]));
            }
            return false;
          }
          return false;
        }
      }
    },
  },
})