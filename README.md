# Lumen — Stellar Lending

A responsive lending-market interface prototype for the Stellar ecosystem, built with React, TypeScript, and Vite.

## Features

- Modular React components and typed market data.
- Responsive dashboard, portfolio visualization, asset allocation, market table, and activity history.
- Searchable asset markets and supply/borrow preview dialogs.
- Optional Freighter wallet connection using `@stellar/freighter-api`.
- Explicit prototype labels: sample APYs, balances, liquidity, and history are illustrative—not live protocol data.
- No wallet signing, token transfer, or on-chain lending action is performed.

## Run locally

```bash
npm install
npm run dev
```

## Production build

```bash
npm run build
npm run preview
```

For Netlify or Vercel, use build command `npm run build` and output directory `dist`.

## Before production

This repository currently contains the interface layer only. To enable real lending, integrate a reviewed Soroban lending contract, verified market/oracle data, collateral and liquidation rules, transaction simulation, wallet signing, network configuration, monitoring, and security audits. Never treat the demo figures as an offer or as real account balances.
