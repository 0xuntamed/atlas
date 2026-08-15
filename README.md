# ATLAS — Personal Travel World Map

> Your personal map of the world — plan journeys, collect places, and preserve everywhere you've been.

A full-stack travel application. **PostgreSQL owns all user data**; third-party
APIs are read-only discovery sources added in later phases. Built in strict
phases (see the build prompt) — this repository is currently at **Phase 1:
Foundation + Core CRUD**.

## Stack

| Layer    | Choice                                             |
| -------- | -------------------------------------------------- |
| Web      | Next.js (App Router), React, Tailwind, TanStack Query |
| API      | Node.js, Fastify, Zod, Prisma                      |
| Database | PostgreSQL (Docker for local dev)                  |
| Auth     | Mock (default) or Clerk — toggled by `AUTH_MODE`   |
| Monorepo | pnpm workspaces + Turborepo                        |

```
apps/
  web/    Next.js frontend
  api/    Fastify backend (modular monolith)
packages/
  types/  Shared Zod schemas + TypeScript contracts (source of truth)
  config/ Shared tsconfig presets
```

> Note: Prisma lives under `apps/api/prisma/` (not the repo root) so the
> generated client resolves reliably in a pnpm workspace.

## Prerequisites

- Node.js ≥ 20 (tested on 22)
- pnpm ≥ 10
- Docker (for local Postgres)
- A free [Clerk](https://dashboard.clerk.com) application

## Setup

```bash
# 1. Install dependencies
pnpm install

# 2. Start Postgres (Docker; host port 5433)
pnpm db:up

# 3. Configure environment (defaults run in MOCK auth — no Clerk needed)
cp apps/api/.env.example apps/api/.env
cp apps/web/.env.example apps/web/.env.local

# 4. Create the database schema
pnpm db:migrate      # runs prisma migrate dev

# 5. Run everything
pnpm dev             # web on :3000, api on :4000
```

Open <http://localhost:3000> and click **Build your ATLAS** — no sign-in
required in mock mode.

## Auth modes

Auth is isolated behind a single switch so it can be swapped without touching
domain logic.

- **`mock` (default)** — every request resolves to a shared dev user; the web
  app skips Clerk entirely. Zero external setup. `AUTH_MODE=mock` (api) and
  `NEXT_PUBLIC_AUTH_MODE=mock` (web).
- **`clerk`** — real auth. Set `AUTH_MODE=clerk` + `CLERK_SECRET_KEY` in
  `apps/api/.env`, and `NEXT_PUBLIC_AUTH_MODE=clerk` + the Clerk keys in
  `apps/web/.env.local`. The web app attaches the Clerk session JWT as a
  `Bearer` token; the API verifies it against Clerk's JWKS and mirrors a local
  `User` row keyed by the Clerk user id.

## Scripts

| Command             | Description                                  |
| ------------------- | -------------------------------------------- |
| `pnpm dev`          | Run web + api in parallel (Turborepo)        |
| `pnpm build`        | Build all packages                           |
| `pnpm test`         | Run API integration tests (needs Postgres up)|
| `pnpm typecheck`    | Type-check the whole workspace               |
| `pnpm db:up` / `db:down` | Start / stop local Postgres             |
| `pnpm db:migrate`   | Apply Prisma migrations (dev)                |
| `pnpm db:studio`    | Open Prisma Studio                           |

## API surface

```
GET    /health

# Trips + itinerary (Phase 1)
GET    /api/trips
POST   /api/trips
GET    /api/trips/:tripId            # includes days + places
PATCH  /api/trips/:tripId
DELETE /api/trips/:tripId

POST   /api/trips/:tripId/days
PATCH  /api/trip-days/:dayId
DELETE /api/trip-days/:dayId

POST   /api/trip-days/:dayId/places  # externalPlaceId optional (from discovery)
PATCH  /api/trip-places/:placeId
DELETE /api/trip-places/:placeId

# Discovery + saved places (Phase 2)
GET    /api/countries?search=japan
GET    /api/countries/:code
GET    /api/places/search?country=JP&q=kyoto&lat=&lon=&limit=
GET    /api/weather?country=JP        # or ?lat=&lon=

GET    /api/saved-places?country=JP
POST   /api/saved-places              # idempotent per external place
DELETE /api/saved-places/:placeId

# Globe (Phase 3)
GET    /api/map/countries             # per-user country states for the globe

# Passport + profile (Phase 4)
GET    /api/passport                  # visited countries as stamps
GET    /api/profile/stats             # travel statistics
```

Every user-owned route is scoped by `userId` and verifies ownership before any
mutation. Errors use a predictable envelope:

```json
{ "error": { "code": "TRIP_NOT_FOUND", "message": "Trip could not be found" } }
```

## Discovery providers (Phase 2)

External world data is isolated behind provider adapters in
`apps/api/src/providers/` — nothing else knows the upstream response shapes, and
every call has a timeout that maps failures to `503 UPSTREAM_UNAVAILABLE` so
**discovery degrades independently** (trips, saved places, and itineraries never
depend on an upstream being reachable).

- **Countries** — the `world-countries` dataset (keyless, offline). REST
  Countries' hosted API was deprecated and its successor is key-gated, so we
  bundle the same open dataset; flag images come from flagcdn.com.
- **Weather** — Open-Meteo (keyless).
- **Places** — OpenTripMap when `OPENTRIPMAP_API_KEY` is set, otherwise a
  keyless curated **mock** provider (`PLACES_PROVIDER=auto`).

Saving a discovered place stores only the slim fields ATLAS needs
(`externalPlaceId, name, countryCode, latitude, longitude, category`) — never
the raw upstream payload.

## Globe + map (Phase 3)

The interactive globe uses `react-globe.gl` (keyless — no map tiles or API
keys). Country boundaries are a slim, bundled GeoJSON
(`apps/web/src/data/countries.geo.json`, derived from Natural Earth 110m and
keyed to ISO alpha-2 via `world-countries`).

- **`/world`** — the globe, countries colored by state
  (visited/planned/wishlist/neutral) from `GET /api/map/countries`; hover for a
  country label, click to open the country page.
- **Trip Journey ↔ Map** — the trip page toggles between the day-by-day Journey
  view and a Map view (`?view=map`). Both render from the **same** trip data via
  selectors in `apps/web/src/lib/geo.ts` (`tripToPoints` / `pointsToArcs`) — the
  map keeps no separate copy. Places without coordinates are simply not plotted.

## Identity + motion (Phase 4)

Presentation only — no architecture changes. Uses `framer-motion`.

- **Landing** (`/`) — a scroll-driven story (globe grows, pins appear, lines
  fade through) built on `useScroll` / `useTransform`.
- **Passport** (`/passport`) — visited countries as stamps that spring in like an
  inked press. Completing a trip (`PLANNED → COMPLETED`) records a
  `VisitedCountry` server-side and shows an animated stamp overlay.
- **Travel profile** (`/profile`) — countries, cities, trips, distance travelled
  (haversine over completed-trip routes), most-visited — with count-up numbers.
- **Drag-and-drop itinerary** — reorder places within a day (Framer Motion
  `Reorder` + a drag handle); positions persist via the trip-place endpoint.
- **Page transitions** — `app/template.tsx` gives every route a quiet entrance.

## Production + deployment (Phase 5)

The API is production-hardened:

- **Structured logs** — one JSON line per request in production
  (`reqId, userId, route, statusCode, durationMs`); pretty-printed in dev.
  `authorization`/`cookie` headers are redacted.
- **Rate limiting** — `@fastify/rate-limit` (default 100 req/min per IP;
  `/health` exempt), configurable via `RATE_LIMIT_*`.
- **Health** — `GET /health` verifies the DB and reports `version` + `uptime`
  (503 when the DB is unreachable).
- **Env validation** — the server refuses to boot on invalid config.
- **`trustProxy`** — honors `X-Forwarded-*` behind a load balancer.
- **Error seam** — all unhandled errors flow through `reportError` (wire Sentry
  in one place via `SENTRY_DSN`).

**CI** (`.github/workflows/ci.yml`): on push/PR, a Postgres service starts, then
`install → migrate → lint → typecheck → test → build`.

### Deploying — Option A (recommended)

| Piece | Host | How |
| ----- | ---- | --- |
| Web (`apps/web`) | Vercel | Import repo, root `apps/web`, set `NEXT_PUBLIC_*` env |
| API (`apps/api`) | Render / Railway | From source or the `apps/api/Dockerfile`; run `pnpm db:deploy` on release |
| Postgres | Neon / Supabase | Set `DATABASE_URL` on the API |

Set `AUTH_MODE=clerk` + Clerk keys, `WEB_ORIGIN` to the Vercel URL, and
`NODE_ENV=production` on the API.

### Deploying — Option B (AWS, optional)

`docker build -f apps/api/Dockerfile -t atlas-api .` → push to ECR → the
Terraform in `infra/terraform/` provisions VPC + RDS + ALB + ECS Fargate. See
[infra/terraform/README.md](infra/terraform/README.md). No Kubernetes.

## Completion flows

- **Phase 1** — create "Japan 2026" → add a day → add Tokyo → edit → delete
  Tokyo → delete the trip.
- **Phase 2** — Explore → search Japan → open Japan → discover a Kyoto
  attraction → Save it → Add to trip → see it in the itinerary.
- **Phase 3** — open a trip → switch between Journey and Map; both represent the
  same itinerary. Visit `/world` to see countries colored by your travel state.
- **Phase 4** — mark a trip completed → a passport stamp appears and lands in
  `/passport`; `/profile` fills with your travel stats.
- **Phase 5** — `docker build` + run the API container → `/health` reports
  `db:up`; CI runs the full pipeline; Terraform `validate` passes for dev + prod.
