# XRP Dashboard

A Vite-powered React + TypeScript application for monitoring XRP supply across multiple IBC-compatible chains in real time.

## Project Structure

```
xrp-dashboard
├── .gitignore
├── README.md             # This file
├── eslint.config.js      # ESLint configuration
├── index.html            # HTML template
├── package.json          # Project metadata & scripts
├── public                # Static assets (images, icons)
├── src                   # Application source code
│   ├── App.css           # Global styles
│   ├── App.tsx           # Root React component
│   ├── assets            # Logos and images
│   ├── components        # UI components
│   │   ├── Dashboard.tsx        # Grid layout for supply cards
│   │   ├── NetworkSelector.tsx  # Testnet/Mainnet toggle
│   │   └── SupplyCard.tsx       # Individual chain supply display
│   ├── config            # Chain configuration definitions
│   │   └── chains.ts     # Constants for supported chains
│   ├── hooks             # Custom React hooks
│   │   └── useTotalSupply.ts  # Fetch and manage supply data
│   ├── index.css         # Tailwind imports & custom resets
│   ├── main.tsx          # React entry point
│   ├── services          # API data-fetching logic
│   │   └── supplyService.ts  # HTTP requests & formatting
│   ├── types.ts          # Shared TypeScript interfaces
│   └── vite-env.d.ts     # Vite ambient type definitions
├── tailwind.config.js    # Tailwind CSS setup
├── tsconfig.app.json     # TypeScript settings for app
├── tsconfig.node.json    # TypeScript settings for Node tools
├── tsconfig.json         # Base TypeScript configuration
└── vite.config.ts        # Vite configuration (plugins & proxies)
```

## Prerequisites

* **Node.js** >=16
* **npm** (or **yarn**)

## Installation

```bash
git clone https://github.com/your-org/xrp-on-ibc.git
cd xrp-on-ibc/xrp-dashboard
npm install
```

## Development

Start the development server with Hot Module Replacement:

```bash
npm run dev
```

Open your browser at `http://localhost:5173`. Use the **TESTNET**/**MAINNET** buttons to switch environments.

## Production Build

```bash
npm run build
npm run preview
```

## Configuration

### Vite Proxy

In `vite.config.ts`, API requests are proxied to testnet endpoints:

```js
proxy: {
  '/api/xrplEvm': { /* XRPL EVM Testnet */ },
  '/api/elys':    { /* Elys Testnet */ },
  '/api/injective': { /* Injective Testnet */ },
  '/api/osmosis':   { /* Osmosis Testnet */ },
}
```

### Chains List

Defined in `src/config/chains.ts`:

* **key**: unique chain identifier
* **displayName**: human-friendly name
* **denom**: IBC denom or native token
* **endpoints**: REST paths per environment

## Key Modules

### `useTotalSupply` Hook

* File: `src/hooks/useTotalSupply.ts`
* Fetches total supply for all chains using `fetchTotalSupply`.
* Manages loading state and error handling.

### `supplyService`

* File: `src/services/supplyService.ts`
* Builds URL: `/cosmos/bank/v1beta1/supply/by_denom?denom=...`
* Parses JSON and formats amounts with decimals.

### Components

* **`Dashboard`**: Renders a responsive grid of `SupplyCard` elements.
* **`NetworkSelector`**: Toggles between environments.
* **`SupplyCard`**: Shows chain name and supply amount (or errors/loading).

## Styling

* **Tailwind CSS**: Configured in `tailwind.config.js`.
* Custom theme colors: `lightPurple`, `darkPurple`, `green`, `black`, `white`.

## Linting & Type Checking

* **ESLint**: Rules in `eslint.config.js` (including React Hooks & Fast Refresh).
* **TypeScript**: `strict` mode enabled across tsconfig files.

## Scripts

| Command           | Description              |
| ----------------- | ------------------------ |
| `npm run dev`     | Start dev server         |
| `npm run build`   | Build for production     |
| `npm run preview` | Preview production build |
| `npm run lint`    | Run ESLint               |

## Contributing

1. Fork the repo and branch off `main`.
2. Commit changes with clear messages.
3. Open a Pull Request for review.

## License

This project is licensed under MIT. See [LICENSE](../LICENSE) for details.
