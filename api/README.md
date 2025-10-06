# API Serverless Functions

This directory contains Vercel serverless functions that act as backend proxies for external APIs.

## `/api/midas-proxy`

**Purpose**: Fetch mXRP/XRP ratio from Midas API server-side to bypass Cloudflare protection.

### Endpoint
```
GET /api/midas-proxy
```

### Response
```json
{
  "ratio": 1.00270601,
  "timestamp": 1759758769000,
  "source": "midas",
  "dataPoints": 720
}
```

### Fields
- `ratio` (number): mXRP/XRP exchange ratio from Midas API
- `timestamp` (number): Unix timestamp of the latest data point
- `source` (string): Always "midas"
- `dataPoints` (number): Number of data points returned by Midas API

### Error Response
```json
{
  "error": "Error description",
  "message": "Detailed error message"
}
```

### Caching
- Response is cached for 5 minutes (`s-maxage=300`)
- Stale-while-revalidate for 10 minutes (`stale-while-revalidate=600`)

### How It Works
1. Calculates timestamp range (last 30 days)
2. Fetches from `https://api-prod.midas.app/api/data/mxrp/price`
3. Validates response structure
4. Returns latest mXRP/XRP ratio with metadata
5. Cloudflare protection is bypassed because request comes from server

### Usage in Frontend
```typescript
const response = await fetch('/api/midas-proxy');
const data = await response.json();
const ratio = data.ratio; // Use this to calculate mXRP USD price
```

### Fallback Strategy
If this endpoint fails, the frontend falls back to a fixed `1.002` multiplier:
```typescript
const finalRatio = ratio || 1.002;
const mxrpPrice = xrpPrice * finalRatio;
```
