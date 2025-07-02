import type { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const { path = [] } = req.query;
  const url = `https://cosmos-api.xrplevm.org/${Array.isArray(path) ? path.join('/') : path}${req.url?.split('?')[1] ? '?' + req.url?.split('?')[1] : ''}`;

  const upstreamRes = await fetch(url, {
    method: req.method,
    headers: {
      ...Object.fromEntries(Object.entries(req.headers)),
      host: 'cosmos-api.xrplevm.org',
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
