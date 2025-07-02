import type { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const { path = [] } = req.query;
  const url = `https://noble-api.polkachu.com/${Array.isArray(path) ? path.join('/') : path}${req.url?.split('?')[1] ? '?' + req.url?.split('?')[1] : ''}`;

  const upstreamRes = await fetch(url, {
    method: req.method,
    headers: {
      ...Object.fromEntries(Object.entries(req.headers)),
      host: 'noble-api.polkachu.com',
    },
  });

  const body = await upstreamRes.arrayBuffer();
  res.status(upstreamRes.status);
  res.setHeader('Access-Control-Allow-Origin', '*');
  upstreamRes.headers.forEach((value, key) => {
    if (key.toLowerCase() !== 'content-encoding' && key.toLowerCase() !== 'content-length') {
      res.setHeader(key, value);
    }
  });
  res.send(Buffer.from(body));
}
