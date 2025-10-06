export default async function handler(req, res) {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    return res.status(200).end();
  }

  const { path, ...queryParams } = req.query;
  const pathArray = Array.isArray(path) ? path : [path];
  const apiPath = pathArray.filter(Boolean).join('/');
  
  // Rebuild query string from remaining params
  const queryString = new URLSearchParams(queryParams).toString();
  const url = `https://api.coingecko.com/${apiPath}${queryString ? '?' + queryString : ''}`;
  
  console.log('[CoinGecko API] Fetching:', url);
  
  try {
    const response = await fetch(url, {
      headers: {
        'Accept': 'application/json',
      },
    });
    
    if (!response.ok) {
      throw new Error(`CoinGecko API responded with status ${response.status}`);
    }
    
    const data = await response.json();
    
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    res.setHeader('Cache-Control', 's-maxage=300, stale-while-revalidate'); // Cache for 5 minutes
    
    res.status(200).json(data);
  } catch (error) {
    console.error('CoinGecko API error:', error);
    res.status(500).json({ 
      error: 'Failed to fetch from CoinGecko API',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}
