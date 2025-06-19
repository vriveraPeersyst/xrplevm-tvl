# XRP Dashboard

The dashboard shows TVL across the XRPL EVM ecosystem in one filterable table (Source / Destination / Symbol).

## Development

Start the development server with Hot Module Replacement:

```bash
npm run dev
```

Open your browser at `http://localhost:5173`.

## Production Build

```bash
npm run build
npm run preview
```

## Configuration

### Vite Proxy

In `vite.config.ts`, API requests are proxied to mainnet endpoints only.

### Chains List

Defined in `src/config/chains.ts`:

* **key**: unique chain identifier
* **name**: human-friendly name
* **denom**: IBC denom or native token
* **endpoint**: REST path
