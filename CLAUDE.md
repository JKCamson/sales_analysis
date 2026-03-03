# Sales Analyst

## Overview
Web application for displaying live sales data. Built with Next.js, runs as a web dashboard showing real-time sales data with Supabase for future data persistence.

## Tech Stack
- **Next.js** (v16) — React framework with App Router
- **React** (v19) — UI library
- **Supabase** — database & auth (configured, not yet wired to tables)
- **Mockaroo API** — live product data source

## Project Structure
```
app/page.js                — Dashboard page (client component with polling)
app/layout.js              — Root layout with metadata
app/globals.css            — Dark theme styles
app/api/sales/live/route.js — Server-side Mockaroo proxy (GET → POST to Mockaroo, returns JSON)
lib/supabase.js            — Supabase client config (reads env vars)
.env.local.example         — Template for Supabase credentials
package.json               — npm config, run with `npm run dev`
```

## API
- **Mockaroo endpoint:** `https://my.api.mockaroo.com/rnl.json?key=5dcd9580&__method=POST`
- **Internal API route:** `GET /api/sales/live` — proxies the Mockaroo call server-side, parses CSV, returns JSON
- **Response format:** JSON array of `{ time, product, quantity, price, total }`

## Architecture
- `app/api/sales/live/route.js` fetches from Mockaroo on the server side (keeps the API key out of the browser)
- `app/page.js` is a client component that polls `/api/sales/live` every 5 seconds
- Stats (count, revenue, top product) are calculated client-side from the fetched data
- `total` is calculated as `price * quantity`

## Supabase Setup
1. Create a Supabase project at https://supabase.com
2. Copy `.env.local.example` to `.env.local`
3. Fill in `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` from your project dashboard
4. The Supabase client in `lib/supabase.js` will connect automatically

## How to Run
```
npm run dev
```
Opens at http://localhost:3000

## Completed Steps
1. Migrated from Electron to Next.js with App Router
2. Ported dark-themed dashboard UI to React component
3. Created server-side API route to proxy Mockaroo (replaces preload.js)
4. Installed and configured Supabase client
5. Set up environment variable template for Supabase credentials
6. Preserved CSV parser with quoted-field handling
7. Maintained 5-second polling with online/offline status indicator

## What's Not Done Yet
- Supabase tables not created — no persistent storage yet
- No filtering or sorting on the sales table
- No user authentication
- Stats are basic (count, sum, top product) — no charts or trends
- No error retry logic beyond logging to console
