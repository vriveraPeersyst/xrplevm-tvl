import type { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const { path } = req.query;
  const pathArray = Array.isArray(path) ? path : [path];
  const apiPath = pathArray.join('/');
  
  const url = `https://api.binance.com/${apiPath}${req.url?.split('?')[1] ? '?' + req.url.split('?')[1] : ''}`;
  
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
    
    res.status(response.status).json(data);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch from Binance API' });
  }
}
