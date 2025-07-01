# XRPL EVM TVL Dashboard

A **zero‑backend** web application that tracks the total value locked (TVL) across the XRPL EVM ecosystem and its IBC neighbours. The dashboard fetches on‑chain supply data, combines it with live USD prices, and presents everything in a single, filterable table.

---

## Table of Contents

1. [Demo](#demo)
2. [Features](#features)
3. [Tech Stack](#tech-stack)
4. [Quick Start](#quick-start)
5. [Configuration](#configuration)
6. [Project Structure](#project-structure)
7. [Scripts](#scripts)
8. [Contributing](#contributing)
9. [Licence](#licence)

---

## Features

|     | Capability                                                                                                                                             |
| --- | ------------------------------------------------------------------------------------------------------------------------------------------------------ |
| 📈  | **Real‑time TVL** – combines on‑chain supply with USD prices (Coingecko → Binance fallback).                                                           |
| 🔍  | **Instant filtering** by **Source chain**, **Destination chain**, and **Token symbol**.                                                                |
| ⚡   | **Hot Module Replacement** in development via Vite.                                                                                                    |
| 💾  | **Client‑side price cache** (5 min) to stay within public API rate limits.                                                                             |
| 🎨  | Fully responsive **Tailwind CSS** design with custom XRPL EVM brand colours.                                                                           |
| 🛠️ | Zero server code – everything runs in the browser; CORS is solved with Vite dev‑server proxies and the browser hitting public endpoints in production. |

---

## Tech Stack

* **React 18 + TypeScript** – UI & state management.
* **Vite** – blazingly fast dev‑server & optimised production build.
* **Tailwind CSS** – utility‑first styling.
* **eslint / typescript‑eslint** – type‑aware linting.
* **XRPL EVM Explorer API** – supplies ERC‑20 totals on XRPL EVM.
* **Cosmos LCD REST** – supplies IBC token totals on Osmosis, Injective, etc.
* **Coingecko / Binance** – price oracles with graceful fallback.

---

## Quick Start

> Requires **Node ≥ 20** and **npm ≥ 10**.

```bash
# 1. Clone & install
$ git clone https://github.com/your‑org/xrplevm-tvl.git
$ cd xrplevm-tvl/xrp-dashboard
$ npm install

# 2. Run in dev mode with HMR
$ npm run dev

# 3. Open the app
# Visit http://localhost:5173 in your browser
```

### Production build

```bash
# build the static site (dist/)
$ npm run build

# serve locally to preview the production bundle
$ npm run preview
```

The output in `dist/` is completely static and can be deployed to any CDN (e.g. **Vercel**, **Netlify**, **Cloudflare Pages**, S3 + CloudFront, etc.).

---

## Configuration

### Environment variables

| Variable           | Purpose                                                                                           |
| ------------------ | ------------------------------------------------------------------------------------------------- |
| `VITE_CMC_API_KEY` | Optional CoinMarketCap key used as the third‑level price oracle if Coingecko & Binance both fail. |

Create a `.env` file at the project root (same level as `vite.config.ts`):

```bash
VITE_CMC_API_KEY=your_cmc_key_here
```

### API proxies (development only)

The dev‑server automatically forwards `/api/*` calls to their real endpoints. See **[`vite.config.ts`](xrp-dashboard/vite.config.ts)** for the full list.

---

## Project Structure

```
xrplevm-tvl/
├── generate_report.sh      # utility script: prints repo tree & file contents
├── repo_report.txt         # machine‑generated snapshot (ignored in .git)
└── xrp-dashboard/          # main React app
    ├── public/             # static assets copied to dist/ as‑is
    ├── src/                # application source
    │   ├── components/     # UI building blocks (Table, Filters, …)
    │   ├── hooks/          # reusable React hooks (useRows, useTotalSupply)
    │   ├── services/       # data loaders (tvl, priceService, coingecko)
    │   ├── config/         # chain & asset lists (static metadata)
    │   └── …               # vite-env.d.ts, types.ts, etc.
    ├── tailwind.config.js  # design tokens
    ├── package.json        # npm dependencies & scripts
    └── vite.config.ts      # Vite + proxy rules
```

> **Why a separate folder?** Keeping the web UI isolated under `xrp-dashboard/` makes it easy to embed the dashboard into larger monorepos later on.

---

## Scripts

| Command                   | Directory        | Description                                               |
| ------------------------- | ---------------- | --------------------------------------------------------- |
| `npm run dev`             | `xrp-dashboard/` | Launch Vite dev‑server with HMR.                          |
| `npm run build`           | `xrp-dashboard/` | Create a production bundle in `dist/`.                    |
| `npm run preview`         | `xrp-dashboard/` | Serve the bundle locally (uses the same production code). |
| `bash generate_report.sh` | repo root        | Re‑generate **`repo_report.txt`** (handy for PR reviews). |

---

## Contributing

1. **Fork** the repository & create your branch.
2. Follow the **commit convention** (`feat:`, `fix:`, `docs:`, etc.).
3. Run `npm run lint` before pushing (ESLint will catch most issues).
4. Submit a PR – GitHub Actions will run the TypeScript compiler in `--noEmit` mode to ensure type safety.

Feel free to open **Issues** for feature requests or bugs.

---

## Licence

This project is released under the **MIT License** – see [LICENCE](LICENCE) for details.

> **⚠️ Note:**  
> In production, you must proxy `/api/*` endpoints (e.g., `/api/coingecko`, `/api/binance`) to their real upstream APIs.  
> The Vite dev server handles this automatically in development, but in production you need to set up your own proxy (e.g., serverless function, Cloudflare Worker, or backend server).  
> Otherwise, browser requests will be blocked by CORS and prices will not load.
