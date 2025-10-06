import type { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const { path } = req.query;
  const pathArray = Array.isArray(path) ? path : [path];
  const apiPath = pathArray.join('/');
  
  const url = `https://api-prod.midas.app/api/data/${apiPath}${req.url?.split('?')[1] ? '?' + req.url.split('?')[1] : ''}`;
  
  try {
    const response = await fetch(url, {
      headers: {
        'Accept': 'application/json',
        'User-Agent': 'Mozilla/5.0 (compatible; XRPLEVMBot/1.0)',
      },
    });
    
    if (!response.ok) {
      throw new Error(`Midas API responded with status ${response.status}`);
    }
    
    const data = await response.json();
    
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    res.setHeader('Cache-Control', 's-maxage=300, stale-while-revalidate'); // Cache for 5 minutes
    
    res.status(200).json(data);
  } catch (error) {
    console.error('Midas API error:', error);
    res.status(500).json({ 
      error: 'Failed to fetch from Midas API',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}
