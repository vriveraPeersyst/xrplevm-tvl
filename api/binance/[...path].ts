import type { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(req: VercelRequest, res: VercelResponse) {
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
  const queryString = new URLSearchParams(queryParams as Record<string, string>).toString();
  const url = `https://api.binance.com/${apiPath}${queryString ? '?' + queryString : ''}`;
  
  try {
    const response = await fetch(url, {
      headers: {
        'Accept': 'application/json',
      },
    });
    
    const data = await response.json();
    
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    res.setHeader('Cache-Control', 's-maxage=300, stale-while-revalidate');
    
    res.status(response.status).json(data);
  } catch (error) {
    console.error('Binance API error:', error);
    res.status(500).json({ 
      error: 'Failed to fetch from Binance API',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}
