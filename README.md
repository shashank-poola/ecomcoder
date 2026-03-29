# Store Analytics Dashboard

End-to-end demo for **per-store e-commerce analytics**: revenue aggregates, funnel counts, top products, recent events, and JWT (or dev header) auth. Backend is **NestJS + Prisma + PostgreSQL**; frontend is **Next.js (App Router)** with a Swiss-style UI.

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
bun run dev            # http://localhost:8000/api/v1
```

### 3. Frontend

```bash
cd frontend
# Optional .env: NEXT_PUBLIC_API_URL=http://localhost:8000
bun install
bun run dev            # http://localhost:3000 → /dashboard
```

Open **http://localhost:3000/dashboard**. Pick a store, optional time range (`?range=7d`), and ensure the API is running.

---

## Architecture Decisions

### Data Aggregation Strategy

- **Decision:** Maintain a **`DailyAggregate`** table (per store, per calendar day) populated by the seed script from raw **`Event`** rows. Overview revenue uses aggregates; top products and funnel slices still query **`Event`** with indexed filters.
- **Why:** Rolling up revenue by day avoids scanning every purchase event for “today / week / month” KPIs as data grows.
- **Trade-offs:** **Gain:** faster reads and predictable cost for dashboard metrics. **Sacrifice:** extra storage and a **batch/ETL step** (here: seed-time recompute; production would use a job or incremental updater).

### Real-time vs. Batch Processing

- **Decision:** **Hybrid.** Writes are assumed ingested as events in real time (not implemented in this demo ingest path). **Reads** use pre-aggregated daily rows where helpful; **recent activity** reads the latest raw events. The UI polls recent activity every 10 seconds.
- **Why:** Merchandising dashboards usually tolerate seconds of lag for “live” lists but need snappy headline numbers.
- **Trade-offs:** **Accuracy vs. speed:** aggregates can lag behind raw events until refresh. **Complexity vs. performance:** two representations (event stream + rollups) to keep in sync.

### Frontend Data Fetching

- **Decision:** **Server Components** on `/dashboard` call the REST API with **`fetch`** (store id + user id headers, or Bearer token in production). Client components handle search filter context, time-range navigation (`useRouter`), polling, and charts.
- **Why:** Keeps secrets off the client for server-side fetches, simplifies first paint with real data, and limits client JS to interactive pieces.
- **Trade-offs:** Each dashboard load hits the API from the Next server; scaling out requires a healthy API and optional caching.

### Performance Optimizations

- **Prisma:** Composite-style indexes on **`Event`** for `(storeId, timestamp)` and `(storeId, eventType, timestamp)` to support funnel and top-product queries.
- **Backend:** In-memory **TTL cache** (≈30s) on heavy analytics service methods to protect the DB under repeat loads.
- **Frontend:** Streaming-friendly layout; chart tooltips and polling isolated to client bundles.

---

## Known Limitations

- **Daily revenue** endpoint is fixed to the service’s “last ~30 days” window; it does not yet accept the same `from`/`to` range as overview/top products.
- **Top products table** uses **decorative** sparklines / % deltas where the API does not expose per-SKU time series.
- **Header auth** (`x-store-id` / `x-user-id`) is allowed in non-production for local demos; disable with `ALLOW_HEADER_AUTH=false` when using JWT only.
- **Scale:** In-memory cache is per process; multiple API instances need a shared cache (e.g. Redis) for consistency.

---

## What I'd Improve With More Time

- Unified **date-range** parameter across all analytics endpoints (including daily revenue).
- **Real ingest API** (signed store keys, idempotency, rate limits).
- **Materialized views** or a warehouse (BigQuery, ClickHouse) for very large event volumes.
- **Product-level** revenue series for honest sparklines and true period-over-period %.
- **E2E tests** and OpenAPI/Swagger for the REST surface.

---

## Time Spent

Approximately **3 hours**.