// Static assets that are always included
export const STATIC_ASSETS = [
  // Squid Router
  {
    key: "xrp",
    symbol: "XRP",
    decimals: 18,
    source: "XRPL",
    dest: "XRPL EVM",
    address: "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE",
    cg: "ripple",
    binance: "XRPUSDT",
    image: "xrp.png",
  },{
    key: "mxrp",
    symbol: "mXRP",
    decimals: 18,
    source: "XRPL EVM",
    dest: "XRPL EVM",
    address: "0x06e0B0F1A644Bb9881f675Ef266CeC15a63a3d47",
    cg: "midas-xrp",
    binance: "XRPUSDT",
    image: "mxrp.png",
  },
  {
    key: "wbtc",
    symbol: "WBTC",
    decimals: 8,
    source: "Ethereum",
    dest: "XRPL EVM",
    address: "0xF8Eb4Ed0d4CF2bb707c0272F8C6827dEB6e4C0A9",
    cg: "wrapped-bitcoin",
    binance: "BTCUSDT",
    image: "wbtc.png",
  },
  {
    key: "weth",
    symbol: "WETH",
    decimals: 18,
    source: "Ethereum",
    dest: "XRPL EVM",
    address: "0x50498dC52bCd3dAeB54B7225A7d2FA8D536F313E",
    cg: "weth",
    binance: "ETHUSDT",
    image: "weth.png",
  },
  {
    key: "usdt",
    symbol: "USDT",
    decimals: 6,
    source: "Ethereum",
    dest: "XRPL EVM",
    address: "0x9F8CF9c00fac501b3965872f4ed3271f6f4d06fF",
    cg: "tether",
    binance: "USDTUSD",
    image: "tether.png",
  }, // fallback to BUSD/USDT as USDT/USDT does not exist
  {
    key: "usdc",
    symbol: "USDC",
    decimals: 6,
    source: "Ethereum",
    dest: "XRPL EVM",
    address: "0xa16148c6Ac9EDe0D82f0c52899e22a575284f131",
    cg: "usd-coin",
    binance: "USDCUSDT",
    image: "usdc.png",
  },
  {
    key: "dai",
    symbol: "DAI",
    decimals: 18,
    source: "Ethereum",
    dest: "XRPL EVM",
    address: "0xDc556F7209C48fC53a8cDf1339c033743A7e3e75",
    cg: "dai",
    binance: "DAIUSDT",
    image: "dai.png",
  },
  {
    key: "fdusd",
    symbol: "FDUSD",
    decimals: 18,
    source: "Ethereum",
    dest: "XRPL EVM",
    address: "0xE5747226D2005d7f0865780E8517397de66f2a76",
    cg: "first-digital-usd",
    binance: "FDUSDUSDT",
    image: "fdusd.png",
  },

  // Skip.Go
  {
    key: "osmo",
    symbol: "OSMO",
    decimals: 6,
    source: "Osmosis",
    dest: "XRPL EVM",
    address: "0x3d7189B6e6Fe13A17880FE2B42de1E6C1E329E23",
    cg: "osmosis",
    binance: "OSMOUSDT",
    image: "osmo.png",
  },
  {
    key: "usdc-noble",
    symbol: "USDC",
    decimals: 6,
    source: "Noble",
    dest: "XRPL EVM",
    address: "0xDDF7e0b30A631076cD80bc12A48C0e95404b4A41",
    cg: "usd-coin",
    binance: "USDCUSDT",
    image: "usdc.png",
  },
  { key:'elys',      symbol:'ELYS', decimals:6,  source:'Elys Network', dest:'XRPL EVM', address:'0x55A7Fc91A3Bf505b0136d84A21A875ABD1987D0e', cg:'elys-network', binance:'', image: 'elys.png' },
  {
    key: "inj",
    symbol: "INJ",
    decimals: 18,
    source: "Injective",
    dest: "XRPL EVM",
    address: "0x81F090B51f67e0A6afdC8d9347516dB519712c2f",
    cg: "injective-protocol",
    binance: "INJUSDT",
    image: "inj.png",
  },
  {
    key: "atom",
    symbol: "ATOM",
    decimals: 6,
    source: "Cosmos Hub",
    dest: "XRPL EVM",
    address: "0xC2bd90cD3d26848101Ba880445F119b22A1e254E",
    cg: "cosmos",
    binance: "ATOMUSDT",
    image: "atom.png",
  },{
    key: "usdf",
    symbol: "USDf",
    decimals: 18,
    source: "Ethereum",
    dest: "XRPL EVM",
    address: "0x5E54c1bbc5F19C7A39CC6ff7dbdFBdF438a3CD60",
    cg: "falcon-finance",
    binance: "",
    image: "usdf.png",
  },{
    key: "medge",
    symbol: "mEDGE",
    decimals: 18,
    source: "Ethereum",
    dest: "XRPL EVM",
    address: "0xD73f426D3F7048199934102da58BF856f369B3B3",
    cg: "midas-medge",
    binance: "",
    image: "medge.png",
  },{
    key: "mmev",
    symbol: "mMEV",
    decimals: 18,
    source: "Ethereum",
    dest: "XRPL EVM",
    address: "0x48B7827222910d60d448C4553E6b88ff424Bbe76",
    cg: "midas-mmev",
    binance: "",
    image: "mmev.png",
  },{
    key: "mtbill",
    symbol: "mTBILL",
    decimals: 18,
    source: "Ethereum",
    dest: "XRPL EVM",
    address: "0x693Ee27688B4E77788BCc31948f4C83e540d3a3e",
    cg: "midas-mtbill",
    binance: "",
    image: "mtbill.png",
  },
];

// Service to fetch approved tokens from submission platform
export const approvedTokensService = {
  async getApprovedTokens(): Promise<any[]> {
    try {
      const response = await fetch('/api/tokens/approved', {
        headers: {
          'Accept': 'application/json',
        },
      });
      
      if (!response.ok) {
        console.warn('Failed to fetch approved tokens:', response.status);
        return [];
      }
      
      const approvedTokens = await response.json();
      
      // Transform approved tokens to match AssetStatic format
      return approvedTokens.map((token: any) => ({
        key: token.address?.toLowerCase() || `token-${token.id}`,
        symbol: token.symbol,
        decimals: token.decimals || 18,
        source: token.source || "Ethereum",
        dest: "XRPL EVM",
        address: token.address,
        cg: token.coingeckoId || "",
        binance: token.binanceSymbol || "",
        image: token.image || "default-token.png",
      }));
    } catch (error) {
      console.warn('Error fetching approved tokens:', error);
      return [];
    }
  }
};

// Combined assets function - merges static and approved tokens
export const getAssets = async () => {
  try {
    const approvedTokens = await approvedTokensService.getApprovedTokens();
    
    // Filter out any duplicates by address (static assets take precedence)
    const staticAddresses = new Set(
      STATIC_ASSETS
        .filter(asset => asset.address)
        .map(asset => asset.address.toLowerCase())
    );
    
    const uniqueApprovedTokens = approvedTokens.filter(token => 
      !staticAddresses.has(token.address?.toLowerCase())
    );
    
    return [...STATIC_ASSETS, ...uniqueApprovedTokens];
  } catch (error) {
    console.warn('Error loading combined assets, falling back to static assets:', error);
    return STATIC_ASSETS;
  }
};

// Legacy export for backwards compatibility
export const ASSETS = STATIC_ASSETS;
