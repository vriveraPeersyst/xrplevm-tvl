import type { VercelRequest, VercelResponse } from '@vercel/node';
import { URLSearchParams } from 'url';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const { path = [], ...query } = req.query as Record<string, any>;
  const qs = new URLSearchParams();
  for (const [key, val] of Object.entries(query)) {
    if (Array.isArray(val)) {
      val.forEach(v => qs.append(key, v));
    } else if (val != null) {
      qs.append(key, String(val));
    }
  }
  const upstreamPath = Array.isArray(path) ? path.join('/') : String(path);
  const upstreamUrl = `https://noble-api.polkachu.com/${upstreamPath}${qs.toString() ? `?${qs}` : ''}`;

  const upstreamRes = await fetch(upstreamUrl, {
    method: req.method,
    headers: {
      ...Object.fromEntries(Object.entries(req.headers)),
      host: 'noble-api.polkachu.com',
    },
  });
  const body = await upstreamRes.arrayBuffer();

  res.status(upstreamRes.status);
  res.setHeader('Access-Control-Allow-Origin', '*');
  for (const [k, v] of upstreamRes.headers) {
    if (k.toLowerCase() === 'content-encoding' || k.toLowerCase() === 'content-length') continue;
    res.setHeader(k, v);
  }
  res.send(Buffer.from(body));
}
