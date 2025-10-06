/**
 * Vercel Serverless Function - Midas API Proxy
 * 
 * Fetches mXRP/XRP ratio from Midas API server-side to bypass Cloudflare protection
 * Cloudflare is less strict with server-to-server requests
 */

export default async function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Handle OPTIONS preflight
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Calculate timestamps (30 days ago to now)
    const now = Math.floor(Date.now() / 1000);
    const thirtyDaysAgo = now - (30 * 24 * 60 * 60);

    // Fetch from Midas API
    const midasUrl = `https://api-prod.midas.app/api/data/mxrp/price?timestampFrom=${thirtyDaysAgo}&timestampTo=${now}&environment=mainnet`;
    
    console.log('[midas-proxy] Fetching from:', midasUrl);
    
    const response = await fetch(midasUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; XRPLEVM-TVL/1.0)',
        'Accept': 'application/json',
      },
    });

    if (!response.ok) {
      console.error('[midas-proxy] Midas API error:', response.status, response.statusText);
      return res.status(response.status).json({ 
        error: 'Midas API error',
        status: response.status,
        statusText: response.statusText 
      });
    }

    const data = await response.json();
    
    // Validate response structure
    if (!Array.isArray(data) || data.length === 0) {
      console.error('[midas-proxy] Invalid response format:', data);
      return res.status(500).json({ error: 'Invalid response format from Midas API' });
    }

    // Get the latest price (mXRP/XRP ratio)
    const latestData = data[data.length - 1];
    
    if (!latestData || typeof latestData.price !== 'number') {
      console.error('[midas-proxy] Invalid price data:', latestData);
      return res.status(500).json({ error: 'Invalid price data from Midas API' });
    }

    console.log('[midas-proxy] Success! Latest ratio:', latestData.price);

    // Return the ratio with cache headers (5 minutes)
    res.setHeader('Cache-Control', 'public, s-maxage=300, stale-while-revalidate=600');
    
    return res.status(200).json({
      ratio: latestData.price,
      timestamp: latestData.timestamp,
      source: 'midas',
      dataPoints: data.length,
    });

  } catch (error) {
    console.error('[midas-proxy] Error:', error);
    return res.status(500).json({ 
      error: 'Failed to fetch mXRP ratio',
      message: error.message 
    });
  }
}
