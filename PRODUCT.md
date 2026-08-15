# Product

<!-- impeccable:product-schema 1 -->

<!-- Product truth derived from the existing codebase (built across 5 phases) —
     strong repository evidence, no material gaps required a user interview. -->

## Platform

web

## Users

Individual travelers who want a personal, visual record of their journeys — the
kind of person who keeps a travel journal and a stamped passport. They plan
upcoming trips, collect places they want to visit, and want to preserve
everywhere they've been. Single-user, personal; not a team/agency tool.

## Product Purpose

ATLAS is a personal visual map of the world. It lets one person track visited
countries, plan trips with day-by-day itineraries, save places to visit, log
lightweight trip expenses, mark trips completed, build a visual passport of
stamps, and view travel statistics. Success = the app feels like a keepsake of a
life of travel, not a booking tool or admin dashboard.

## Positioning

Not Expedia, not a booking engine, not a social network, not an AI planner.
The differentiator is emotional + visual: "your personal map of the world —
plan journeys, collect places, and preserve everywhere you've been." An
interactive globe colored by your own travel states (visited / planned /
wishlist) and a passport that earns stamps as you complete trips.

## Operating Context

Core surfaces already built: an interactive world globe (`/world`), country
pages with discovery + weather, trips with a Journey↔Map itinerary view, saved
places, a passport of stamps, and a travel-stats profile. External APIs
(countries dataset, OpenTripMap, Open-Meteo) provide read-only discovery data;
PostgreSQL owns all user data.

## Capabilities and Constraints

- Stack: Next.js (App Router) + React + Tailwind + Framer Motion; the globe uses
  react-globe.gl (WebGL, keyless). Country boundary GeoJSON is bundled locally.
- Palette tokens already in Tailwind: `ink` #12100e, `parchment` #f6f3ec.
- The landing page is public (pre-auth); everything else sits behind an auth
  switch (mock by default, Clerk later).
- Country states are real user-derived data: visited / planned / wishlist /
  neutral.

## Brand Commitments

- Name: **ATLAS**. Tagline: "The world is yours." / "Every place you've been.
  Every place you're going."
- Intended feel (from the build spec): **travel journal + digital passport +
  interactive world atlas.** Editorial typography, maps/globe, motion, strong
  whitespace, dark/light contrast. Explicitly avoid: admin-dashboard aesthetics,
  huge tables, generic SaaS cards, blue enterprise UI.

## Evidence on Hand

- A working interactive globe and passport are real, shippable product surfaces
  (not mockups) — the landing can honestly demonstrate them.
- No real customer logos, testimonials, prices, or user counts exist; these must
  not be fabricated on the landing.

## Product Principles

1. Emotional keepsake over utility tool — this is a personal atlas, not software.
2. The globe is the hero: the product's one-of-a-kind, provable mechanism.
3. Show, don't tell — demonstrate the real globe/passport, not stock travel art.
4. Correctness → clear architecture → good UX → visual polish (never reversed).
