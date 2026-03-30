# Store Analytics Dashboard

## Overview

This project is a **multi-tenant store analytics dashboard** so owners can see revenue, conversion, top products, and recent storefront events in one place.

**What it does**

- Pulls **aggregated metrics** and **recent activity** from a **NestJS** API backed by **PostgreSQL** (via **Prisma**).
- Serves a **Next.js** dashboard with charts, funnel visualization, product leaderboard, and responsive layout.
- Enforces **per-store access** using middleware (JWT in production-style flow, or dev headers for local demos).

**Why it’s structured this way**

Fast reads at scale, clear trade-offs, and honest limitations—so the README documents aggregation choices, what’s demo vs. production-ready, and what you’d improve next.

---

## Demo screenshot

![Store Analytics Dashboard](/frontend/public/demo/demo1.png)
![store analytics dashboard](/frontend/public/demo/demo2.png)

---

## Tech stack

| Layer | Technology | Role |
|--------|------------|------|
| **Language** | TypeScript | Shared typing end-to-end |
| **API** | NestJS (Express) | REST controllers, modules, middleware |
| **ORM** | Prisma | Schema, queries, migrations path |
| **Database** | PostgreSQL | Events, stores, daily aggregates |
| **Auth** | `jsonwebtoken`, bcrypt (login) | JWT payload with `storeId` / `userId` |
| **Validation** | Zod | Request query/body pipes |
| **Frontend** | Next.js (App Router), React | Server Components + client islands |
| **Styling** | Tailwind CSS v4 | Layout, theme tokens, responsive grids |
| **Icons** | Lucide | Header, metrics, funnel, activity |


---

## Setup Instructions

### Prerequisites

- [Bun](https://bun.sh) (or Node + your preferred package manager)
- PostgreSQL and a `DATABASE_URL` connection string

### 1. Database

```bash
cd backend/database
# Create .env with DATABASE_URL=postgresql://...
bun install
bun run generate
bun run db:push        # or migrate per your workflow
bun run db:seed        # demo stores, events, daily aggregates; sets demo API secret
```

After seeding, login uses **`apiSecret`: `demo_secret`** for any seeded store (see seed script output).

### 2. Backend API

```bash
cd backend
# Create .env: DATABASE_URL, optional JWT_SECRET, FRONTEND_URL, PORT
bun install
bun run dev            # GET http://localhost:8000/health  ·  API http://localhost:8000/api/v1
```

### 3. Frontend

```bash
cd frontend
# Optional .env: NEXT_PUBLIC_API_URL=http://localhost:8000
bun install
bun run dev            # http://localhost:3000 → /dashboard
bun run build          # uses webpack; see frontend/package.json if you tune Node heap
```

Open **http://localhost:3000/dashboard**. Pick a store, optional time range (`?range=7d`), and ensure the API is running.

---

## Architecture Decisions

### Data Aggregation Strategy

- **Decision:** Maintain a **`DailyAggregate`** table (per store, per calendar day) populated by the seed script from raw **`Event`** rows. Overview revenue uses aggregates; top products and funnel slices still query **`Event`** with indexed filters.
- **Why:** Rolling up revenue by day avoids scanning every purchase event for “today / week / month” KPIs as data grows.
- **Trade-offs:** **Gain:** faster reads and predictable cost for dashboard metrics. **Sacrifice:** extra storage and a **batch/ETL step** (here: seed-time recompute; production would use a job or incremental updater).

### Real-time vs. Batch Processing

- **Decision:** **Hybrid.** Writes are assumed ingested as events in real time (not implemented in this demo ingest path). **Reads** use pre-aggregated daily rows where helpful; **recent activity** reads the latest raw events on each page load (refresh to update).
- **Why:** Merchandising dashboards usually tolerate seconds of lag for “live” lists but need snappy headline numbers.
- **Trade-offs:** **Accuracy vs. speed:** aggregates can lag behind raw events until refresh. **Complexity vs. performance:** two representations (event stream + rollups) to keep in sync.

### Frontend Data Fetching

- **Decision:** **Server Components** on `/dashboard` call the REST API with **`fetch`** (store id + user id headers, or Bearer token in production). Client components handle search filter context, time-range navigation (`useRouter`), theme toggle, and interactive charts.
- **Why:** Keeps secrets off the client for server-side fetches, simplifies first paint with real data, and limits client JS to interactive pieces.
- **Trade-offs:** Each dashboard load hits the API from the Next server; scaling out requires a healthy API and optional caching.

### Performance Optimizations

- **Prisma:** Composite-style indexes on **`Event`** for `(storeId, timestamp)` and `(storeId, eventType, timestamp)` to support funnel and top-product queries.
- **Backend:** Straight Prisma queries (no in-process cache) for predictable, easy-to-read behavior at demo scale.
- **Frontend:** Server-rendered dashboard shell; small client islands for search, theme, and charts.

---

## Known Limitations

- **Daily revenue** endpoint is fixed to the service’s “last ~30 days” window; it does not yet accept the same `from`/`to` range as overview/top products.
- **Top products table** uses **decorative** sparklines / % deltas where the API does not expose per-SKU time series.
- **Header auth** (`x-store-id` / `x-user-id`) is allowed in non-production for local demos; disable with `ALLOW_HEADER_AUTH=false` when using JWT only.
- **Scale:** At very high traffic you would add caching (e.g. Redis) or read replicas; the current code favors clarity over micro-optimizations.

---

## What I'd Improve With More Time

- Unified **date-range** parameter across all analytics endpoints (including daily revenue).
- **Real ingest API** (signed store keys, idempotency, rate limits).
- **Materialized views** or a warehouse (BigQuery, ClickHouse) for very large event volumes.
- **Product-level** revenue series for honest sparklines and true period-over-period %.
- **E2E tests** and OpenAPI/Swagger for the REST surface.

---

## UI interactions (for your demo recording)

Use this as a click path while screen recording so the reviewer sees every major feature.

1. **Landing:** Open `/dashboard` — show the store name, subtitle, and overall layout (metrics grid + panels).
2. **Store switcher:** Change store (if multiple seeded) — numbers and lists should change per tenant.
3. **Time range:** Use the range control (e.g. 7d / 24h if available) — explain that overview and top products respect the range; daily revenue may use a fixed window (call out as a known limitation).
4. **View tabs / anchors:** Jump between Overview, Revenue, Products, Funnel, Activity — smooth scroll or section focus.
5. **Search:** Type in the product search — table filters; on mobile, show the mobile search field if present.
6. **Charts:** Hover or point at the **revenue** bar chart and **conversion funnel** — narrate what each represents (daily revenue vs. event funnel).
7. **Top products:** Scroll the table — revenue, trend sparkline, score, row hover.
8. **Recent activity:** Show the event list — event types, amounts, relative times; mention refresh to update.
9. **Theme:** Toggle **light / dark** — logo swap and readability.
10. **Optional — API health:** Quick tab to `GET /health` or login flow if you show JWT in the video.

---

## Repository structure

```
ecomcoder/
├── README.md                 # This file — setup, architecture, demo/video notes
├── .env.example              # Variable names for backend + frontend
├── backend/
│   ├── src/                  # NestJS app (controllers, middleware, routes, schemas)
│   ├── database/             # Prisma schema, migrations, seed
│   └── package.json
└── frontend/
    ├── app/                  # Next.js App Router (layout, dashboard routes, global styles)
    ├── lib/                  # Shared TS: API client, types, utils, theme
    ├── constants/            # e.g. demo store list
    ├── components/           # Dashboard + analytics UI
    ├── public/ecom/          # Logos + favicon assets
    └── package.json
```

---

## Time Spent

Approximately **3 hours**.
