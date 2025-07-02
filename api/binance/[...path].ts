import type { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const suffix = req.url!.replace(/^\/api\/binance/, '');
  const upstreamUrl = `https://api.binance.com${suffix}`;

  const headers = new Headers(req.headers as Record<string, string>);
  headers.set('host', 'api.binance.com');

  const upstreamRes = await fetch(upstreamUrl, {
    method: req.method,
    headers,
  });

  const body = await upstreamRes.arrayBuffer();
  res.status(upstreamRes.status);
  res.setHeader('Access-Control-Allow-Origin', '*');
  upstreamRes.headers.forEach((v, k) => {
    if (k.toLowerCase() === 'content-encoding' || k.toLowerCase() === 'content-length') return;
    res.setHeader(k, v);
  });
  res.send(Buffer.from(body));
}
