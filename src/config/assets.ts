export const ASSETS = [
  // Squid Router
  { key:'xrp-xrpl',  symbol:'XRP',  decimals:18,  source:'XRPL',       dest:'XRPL EVM', address:'0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE', cg:'ripple' },
  { key:'wbtc',      symbol:'WBTC', decimals:8,  source:'Ethereum',   dest:'XRPL EVM', address:'0xF8Eb4Ed0d4CF2bb707c0272F8C6827dEB6e4C0A9', cg:'wrapped-bitcoin' },
  { key:'weth',      symbol:'WETH', decimals:18, source:'Ethereum',   dest:'XRPL EVM', address:'0x50498dC52bCd3dAeB54B7225A7d2FA8D536F313E', cg:'weth' },
  { key:'usdt',      symbol:'USDT', decimals:6,  source:'Ethereum',   dest:'XRPL EVM', address:'0x9F8CF9c00fac501b3965872f4ed3271f6f4d06fF', cg:'tether' },
  { key:'usdc',      symbol:'USDC', decimals:6,  source:'Ethereum',   dest:'XRPL EVM', address:'0xa16148c6Ac9EDe0D82f0c52899e22a575284f131', cg:'usd-coin' },
  { key:'dai',       symbol:'DAI',  decimals:18, source:'Ethereum',   dest:'XRPL EVM', address:'0xDc556F7209C48fC53a8cDf1339c033743A7e3e75', cg:'dai' },
  { key:'fdusd',     symbol:'FDUSD',decimals:18, source:'Ethereum',   dest:'XRPL EVM', address:'0xE5747226D2005d7f0865780E8517397de66f2a76', cg:'first-digital-usd' },

  // Skip.Go
  { key:'osmo',      symbol:'OSMO', decimals:6,  source:'Osmosis',    dest:'XRPL EVM', address:'0x3d7189B6e6Fe13A17880FE2B42de1E6C1E329E23', cg:'osmosis' },
  { key:'usdc-noble',symbol:'USDC', decimals:6,  source:'Noble',      dest:'XRPL EVM', address:'0xDDF7e0b30A631076cD80bc12A48C0e95404b4A41', cg:'usd-coin' },
  { key:'elys',      symbol:'ELYS', decimals:6,  source:'Elys',       dest:'XRPL EVM', address:'0x55A7Fc91A3Bf505b0136d84A21A875ABD1987D0e', cg:'elys-token' },
  { key:'inj',       symbol:'INJ',  decimals:18, source:'Injective',  dest:'XRPL EVM', address:'0x81F090B51f67e0A6afdC8d9347516dB519712c2f', cg:'injective-protocol' },
  { key:'atom',       symbol:'ATOM',  decimals:6, source:'CosmosHub',  dest:'XRPL EVM', address:'', cg:'cosmos-hub' },
  /* tokens still missing contracts (BNB, SOL, DOGE, SUI, ATOM) can be added later */
];
