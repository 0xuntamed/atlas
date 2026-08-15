# ATLAS — Personal Travel World Map

Build a polished full-stack travel application called **ATLAS**.

ATLAS is a personal visual map of the world where users can:

- track countries they have visited
- plan upcoming trips
- save places they want to visit
- create daily itineraries
- track lightweight trip expenses
- mark trips as completed
- build a visual passport of visited countries
- view travel statistics

The goal is **not** to build Expedia, a booking engine, a social network, or an AI travel planner.

The product should remain focused:

> **ATLAS is your personal map of the world — plan journeys, collect places, and preserve everywhere you've been.**

The application should feel highly visual and premium, while the underlying system remains a clean CRUD application with good architecture.

---

# 1. Tech Stack

Use the following stack.

## Frontend

- Next.js
- TypeScript
- React
- Tailwind CSS
- Framer Motion for UI transitions
- GSAP only where advanced scroll-based animation is useful
- MapLibre GL or react-globe.gl for globe/map visualization
- TanStack Query only if client-side request caching becomes useful

Use Next.js App Router.

Prefer Server Components where they make sense, but do not force everything into Server Components.

Use Client Components for:

- globe interactions
- maps
- drag-and-drop
- animated UI
- itinerary editing
- interactive filters

---

## Backend

Use a **separate Node.js API**.

Recommended:

- Node.js
- TypeScript
- Fastify or Express
- Zod for validation
- Prisma ORM
- PostgreSQL

Preferred structure:

```text
apps/
    web/
        Next.js frontend

    api/
        Node.js backend

packages/
    types/
    config/
```

Use a monorepo if convenient.

Do not introduce microservices.

The backend should remain a modular monolith.

---

# 2. Deployment Strategy

The architecture should support both:

### Option A — Simple deployment

```text
Next.js
    ↓
Vercel

Node API
    ↓
Railway / Render / AWS

PostgreSQL
    ↓
Neon / Supabase / RDS
```

This should be the preferred development path.

---

### Option B — AWS deployment later

The application should be structured so the API can later run on:

```text
Internet
   ↓
CloudFront
   ↓
Next.js / Vercel

API traffic
   ↓
ALB
   ↓
Node.js application
   ↓
ECS Fargate
   ↓
RDS PostgreSQL
```

Optional later additions:

```text
Redis / ElastiCache
S3
CloudWatch
Route 53
Terraform
GitHub Actions
```

Do not add AWS infrastructure during the first development phases.

The application must work locally and on simple hosting first.

---

# 3. High-Level Architecture

```text
                         ┌───────────────────┐
                         │   REST Countries  │
                         └─────────┬─────────┘
                                   │
                                   │
┌──────────────────┐       ┌───────▼────────┐
│    Open-Meteo    ├──────►│                │
└──────────────────┘       │    Node API    │
                           │                │
┌──────────────────┐       │   Fastify /    │
│   OpenTripMap    ├──────►│    Express     │
└──────────────────┘       │                │
                           └───────┬────────┘
                                   │
                                   ▼
                           ┌───────────────┐
                           │  PostgreSQL   │
                           └───────────────┘
                                   ▲
                                   │
                           ┌───────┴────────┐
                           │                │
                           │    Next.js     │
                           │                │
                           └────────────────┘
```

Third-party APIs are only used for **world data and discovery**.

ATLAS owns all user-generated data.

Never attempt to CRUD third-party API data.

---

# 4. Data Ownership

External APIs provide:

```text
countries
country metadata
weather
coordinates
places
attractions
tourism data
```

Our database stores:

```text
users
trips
trip days
saved places
itinerary places
expenses
notes
visited countries
trip status
user preferences
```

Important architectural rule:

> External APIs provide discovery data.  
> PostgreSQL stores user-owned application state.

---

# 5. Core Database Model

Design the database approximately around these entities.

## User

```text
id
name
email
avatar
createdAt
updatedAt
```

---

## Trip

```text
id
userId

title
countryCode

startDate
endDate

status

coverImage

createdAt
updatedAt
```

Possible statuses:

```text
DRAFT
PLANNED
ACTIVE
COMPLETED
CANCELLED
```

---

## TripDay

```text
id
tripId

date
title
notes

position
```

---

## TripPlace

```text
id
tripDayId

externalPlaceId

name
latitude
longitude

category

position

notes
```

---

## SavedPlace

```text
id
userId

externalPlaceId

name

countryCode

latitude
longitude

category

createdAt
```

---

## Expense

```text
id
tripId

amount
currency

category
description

createdAt
```

Expense categories:

```text
FLIGHT
HOTEL
FOOD
TRANSPORT
ACTIVITY
SHOPPING
OTHER
```

---

## VisitedCountry

```text
id
userId

countryCode

firstVisitedAt
lastVisitedAt

visitCount
```

Trips marked as completed should be able to update visited-country information.

---

# 6. Core API Design

Keep APIs RESTful.

Example:

```text
GET    /api/trips
POST   /api/trips

GET    /api/trips/:tripId
PATCH  /api/trips/:tripId
DELETE /api/trips/:tripId
```

Trip days:

```text
POST   /api/trips/:tripId/days

PATCH  /api/trip-days/:dayId

DELETE /api/trip-days/:dayId
```

Places:

```text
POST   /api/trip-days/:dayId/places

PATCH  /api/trip-places/:placeId

DELETE /api/trip-places/:placeId
```

Saved places:

```text
GET    /api/saved-places
POST   /api/saved-places
DELETE /api/saved-places/:placeId
```

Expenses:

```text
POST   /api/trips/:tripId/expenses
PATCH  /api/expenses/:expenseId
DELETE /api/expenses/:expenseId
```

Country discovery:

```text
GET /api/countries
GET /api/countries/:countryCode
```

Places discovery:

```text
GET /api/places/search
```

Weather:

```text
GET /api/weather
```

Third-party APIs should be called from the backend whenever practical.

Avoid exposing API keys to the browser.

---

# 7. Authentication

Do not build custom authentication.

Use:

- Auth.js
- Clerk
- or Supabase Auth

Choose one and keep authentication isolated from domain logic.

Every user-owned query must be scoped by `userId`.

Never trust IDs coming from the client without checking ownership.

For example:

```text
DELETE /api/trips/:tripId
```

must verify:

```text
trip.userId === authenticatedUser.id
```

before deletion.

---

# 8. UX Direction

The UI should feel like:

```text
travel journal
+
digital passport
+
interactive world atlas
```

Avoid:

```text
admin dashboard aesthetics
huge tables
generic SaaS cards everywhere
blue enterprise UI
```

Prefer:

```text
large typography
editorial layouts
maps
photography
motion
minimal controls
strong whitespace
dark/light visual contrast
```

---

# 9. Primary Screens

Build these screens.

## Landing Page

Full-screen storytelling experience.

Suggested sequence:

```text
BLACK SCREEN

THE WORLD
IS YOURS.
```

A small globe appears.

Scroll.

The globe grows.

Pins appear.

Then:

```text
Every place you've been.
Every place you're going.
```

Finish with:

```text
BUILD YOUR ATLAS
```

CTA enters the application.

---

## World / Globe

Main app screen.

Show interactive globe.

Countries should have states:

```text
visited
planned
wishlist
neutral
```

Hovering a country should show a minimal information card.

Clicking a country opens the country experience.

---

## Country Page

Example:

```text
JAPAN
日本

Tokyo • Kyoto • Osaka

[ PLAN A TRIP ]
```

Show:

- country information
- existing trips
- saved places
- places to discover
- visited status

---

## Trip Page

This is one of the most important screens.

Example:

```text
JAPAN

12 OCT — 23 OCT

MAP       JOURNEY
```

Journey mode:

```text
DAY 01

Tokyo

Arrive Haneda
↓
Shibuya
↓
Dinner
```

Users should be able to:

```text
add place
edit place
remove place
reorder place
add notes
```

---

## Map Mode

Render itinerary places geographically.

Example:

```text
Tokyo
  ●

             ● Mount Fuji

                       ● Kyoto
```

Switching between Journey and Map should feel animated.

Both representations must use the same trip data.

---

## Place Discovery

Provide a discovery interface.

Users can:

```text
search
filter
explore
save place
add directly to itinerary
```

Saving external data should create internal application records.

---

## Passport

Show completed countries as passport stamps.

Example:

```text
YOUR PASSPORT

┌─────────────┐
│    JAPAN    │
│             │
│  OCT 2026   │
└─────────────┘
```

When a trip is marked completed, animate a passport stamp appearing.

---

## Travel Profile

Show useful stats.

Example:

```text
YOUR WORLD

12
COUNTRIES

28
CITIES

41,290 KM
TRAVELLED
```

Other possible metrics:

```text
most visited country
furthest destination
favorite continent
next planned destination
total trips
```

Do not build complex analytics.

---

# 10. State Management

Avoid Redux unless a real need appears.

Prefer:

```text
Server state
    ↓
TanStack Query

URL state
    ↓
Next.js search params

Local UI state
    ↓
React state
```

Keep domain state on the server.

Do not duplicate database state into giant frontend stores.

---

# 11. Error Handling

All APIs should use predictable error structures.

Example:

```json
{
  "error": {
    "code": "TRIP_NOT_FOUND",
    "message": "Trip could not be found"
  }
}
```

Validate input using Zod.

Handle:

```text
loading states
empty states
API failures
third-party API outages
invalid coordinates
unauthorized access
duplicate saves
network retries
```

---

# 12. Third-Party API Resilience

External APIs should not control the application's stability.

Example:

If OpenTripMap fails:

```text
existing trips should still work
saved places should still load
itinerary should still work
passport should still work
```

Only discovery functionality should degrade.

Introduce backend adapters:

```text
services/
    countries/
    weather/
    places/
```

Example:

```text
PlacesProvider
    ↓
OpenTripMapProvider
```

This allows providers to be replaced later without changing the rest of the application.

---

# PHASED IMPLEMENTATION

Do not attempt to build everything at once.

Complete each phase before starting the next.

---

# PHASE 1 — Foundation + Core CRUD

Goal:

> Build the product's data model and ensure the core application works without maps, animation, weather, or complicated integrations.

Build:

```text
Next.js frontend
Node.js API
PostgreSQL
Prisma
authentication
```

Implement:

```text
User
Trip
TripDay
TripPlace
SavedPlace
Expense
VisitedCountry
```

Create core trip CRUD.

Users should be able to:

```text
create trip
edit trip
delete trip

add day
edit day
delete day

add itinerary place manually
edit itinerary place
delete itinerary place
```

Build simple screens:

```text
/trips
/trips/new
/trips/:id
```

UI can be simple during this phase.

Focus on architecture.

### Phase 1 completion criteria

The following flow must work:

```text
Sign in

↓
Create "Japan 2026"

↓
Add October 12

↓
Add Tokyo

↓
Edit Tokyo

↓
Delete Tokyo

↓
Delete trip
```

Only move forward once this is reliable.

---

# PHASE 2 — World Data + Discovery

Goal:

> Connect the application to the real world.

Add integrations for:

```text
REST Countries
OpenTripMap
Open-Meteo
```

Implement adapter/service architecture.

Example:

```text
services/
    country.service.ts
    places.service.ts
    weather.service.ts
```

Build:

```text
country search
country page
place discovery
save external place
add external place to itinerary
```

When saving external objects, store only the fields ATLAS actually needs.

Do not dump complete third-party API responses into PostgreSQL.

Example:

External:

```text
100 fields
```

Internal:

```text
externalPlaceId
name
latitude
longitude
countryCode
category
```

### Phase 2 completion criteria

User can:

```text
search Japan

↓
open Japan

↓
discover Kyoto attraction

↓
save attraction

↓
add attraction to trip

↓
see it in itinerary
```

---

# PHASE 3 — Globe + Map Experience

Goal:

> Transform ATLAS from a normal CRUD application into a visual travel product.

Build the interactive globe.

Use:

```text
MapLibre
or
react-globe.gl
```

Implement country states:

```text
visited
planned
wishlist
neutral
```

Add:

```text
country hover
country selection
map markers
trip routes
```

Build Journey ↔ Map switching.

Ensure both use the same backend data.

Do not duplicate itinerary data for map rendering.

Create selectors/transformations such as:

```text
Trip
 ↓
TripDays
 ↓
TripPlaces
 ↓
GeoJSON
```

### Phase 3 completion criteria

The user can open a trip and switch between:

```text
Journey View

and

Map View
```

and both accurately represent the same itinerary.

---

# PHASE 4 — Product Identity + Motion

Goal:

> Make the application memorable.

Do not change architecture significantly during this phase.

Improve presentation.

Build:

```text
landing page
scroll animations
globe entrance
page transitions
country transitions
trip transitions
passport animation
drag-and-drop itinerary
```

Implement the Passport feature.

When:

```text
trip.status
```

changes:

```text
PLANNED → COMPLETED
```

update visited country data.

Then show an animated passport stamp.

Example:

```text
        JAPAN
      OCT 2026
```

Create Travel Profile.

Include:

```text
countries visited
cities visited
trips completed
upcoming trips
distance travelled
most visited destination
```

Animations should enhance meaning.

Avoid animation purely for decoration.

### Phase 4 completion criteria

The application should now feel like a polished travel product rather than a CRUD project.

---

# PHASE 5 — Production + Infrastructure

Only begin this phase after the product works.

Goal:

> Make ATLAS production-ready and demonstrate deployment/infrastructure skills.

First deployment:

```text
Next.js
    ↓
Vercel

Node API
    ↓
Render / Railway / AWS

PostgreSQL
    ↓
Neon / Supabase / RDS
```

Add:

```text
environment configuration
logging
rate limiting
API request validation
health endpoint
error monitoring
database migrations
CI
```

Backend health endpoint:

```text
GET /health
```

Example:

```json
{
  "status": "healthy"
}
```

Add structured logs.

Example:

```text
requestId
userId
route
statusCode
duration
```

Create GitHub Actions pipeline:

```text
push

↓
lint

↓
typecheck

↓
test

↓
build
```

Then optionally create an AWS deployment.

Possible AWS architecture:

```text
                    Internet
                       │
                       ▼
                  CloudFront
                       │
              ┌────────┴────────┐
              │                 │
            Vercel             ALB
                                │
                                ▼
                           ECS Fargate
                                │
                                ▼
                           RDS Postgres
```

Optional:

```text
Route53
CloudWatch
Secrets Manager
ElastiCache
S3
Terraform
```

If Terraform is introduced, infrastructure should be separated:

```text
infra/
    terraform/
        modules/
        environments/
            dev/
            prod/
```

Do not add Kubernetes.

It adds no useful value at this scale.

---

# Engineering Principles

Throughout the project follow these rules.

## 1. Keep the backend modular

Prefer:

```text
modules/
    trips/
    places/
    countries/
    weather/
    expenses/
    users/
```

Each module may contain:

```text
controller
service
repository
schema
routes
```

Avoid one giant controller.

---

## 2. Separate external integrations

Never scatter:

```text
fetch("https://api...")
```

throughout controllers.

Use:

```text
CountryProvider
WeatherProvider
PlacesProvider
```

---

## 3. Keep UI and server state separate

React should not become the source of truth for persistent data.

PostgreSQL is the source of truth.

---

## 4. Avoid premature infrastructure

Do NOT introduce:

```text
Kafka
Kubernetes
microservices
event buses
CQRS
GraphQL
multiple databases
service mesh
```

unless a genuine requirement later appears.

---

## 5. Optimize only after measurement

Do not introduce Redis immediately.

Potential later cache candidates:

```text
country metadata
place discovery responses
weather responses
```

Never cache user-specific mutable information unnecessarily.

---

# Suggested Repository

```text
atlas/

├── apps/
│
│   ├── web/
│   │   ├── app/
│   │   ├── components/
│   │   ├── features/
│   │   ├── hooks/
│   │   ├── lib/
│   │   └── styles/
│   │
│   └── api/
│       └── src/
│           ├── modules/
│           │   ├── auth/
│           │   ├── trips/
│           │   ├── places/
│           │   ├── countries/
│           │   ├── weather/
│           │   └── expenses/
│           │
│           ├── providers/
│           ├── middleware/
│           ├── config/
│           ├── db/
│           └── server.ts
│
├── packages/
│   ├── types/
│   └── config/
│
├── prisma/
│   └── schema.prisma
│
├── infra/
│   └── terraform/
│
├── docker-compose.yml
└── README.md
```

---

# Build Order

Follow this sequence strictly:

```text
Database
   ↓
Backend domain
   ↓
CRUD APIs
   ↓
Basic frontend
   ↓
External APIs
   ↓
Globe
   ↓
Maps
   ↓
Animations
   ↓
Polish
   ↓
Deployment
   ↓
Infrastructure
```

Never build:

```text
animation → database
```

Build:

```text
database → functionality → experience
```

---

# Final Product Flow

The final experience should approximately feel like this:

```text
Landing page

        ↓

      Globe
        │
        ├──────── Explore Country
        │               │
        │               ├── Places
        │               │
        │               └── Plan Trip
        │
        ├──────── My Trips
        │               │
        │               └── Trip
        │                    │
        │                    ├── Journey
        │                    │
        │                    └── Map
        │
        ├──────── Saved Places
        │
        ├──────── Passport
        │
        └──────── Travel Profile
```

The final product should demonstrate:

```text
Next.js architecture
React interaction design
Node.js backend development
REST API design
PostgreSQL relational modelling
third-party API integration
authentication
authorization
error handling
maps / geospatial data
animations
deployment
CI/CD
optional AWS infrastructure
```

The final result should be visually memorable while maintaining straightforward and defensible engineering decisions.

When implementing, always prioritize:

```text
Correctness
↓
Clear architecture
↓
Good UX
↓
Visual polish
↓
Infrastructure sophistication
```

Do not reverse this order.