# Design

<!-- impeccable:design 1 · derived from the built landing (Night Sea-Chart, seed 59422312) -->

The ATLAS landing establishes a **Night Sea-Chart** world: the product presented
as a working nautical/aeronautical navigation chart at night, with the real
interactive globe glowing at its center. This is the Persuade surface's identity;
the in-app screens (globe, trips, passport, profile) keep their calmer
parchment/ink working palette and inherit only the tokens and type below where it
serves them.

## Palette (chart roles)

| Role | Value | Use |
| --- | --- | --- |
| Chart ground | `#081521` (deep prussian ink) | full-bleed background of the chart world |
| Parchment | `#f6f3ec` | primary type / landmass ink |
| Graticule cyan | `#5fb0c4` (+ `#7fb3c4` labels) | lat/long hairlines, rhumb lines, coordinate labels |
| Brass | `#d8b25a` (hover `#e6c976`) | compass rose, rules, primary CTA, cartouche ticks |
| Signal magenta | `#ff5a8a` | the route arc and its nodes — one accent, used once |

State colors (shared with the app globe): visited `#34d399`, planned `#fbbf24`,
wishlist `#a78bfa` — appear on the globe and in the chart legend, each with a
soft same-hue glow.

Strategy: **Committed/Drenched dark.** The scene is someone reflecting on travels
by lamplight — the chart is dark by decision, not category habit.

## Type

- **Display — Cinzel** (`--font-display`, self-hosted via `next/font`): engraved
  Roman capitals, the lettering of an engraved map cartouche. Carries the ATLAS
  wordmark at `clamp(3.5rem, 11vw, 9rem)`, tracking `-0.02em`.
- **Labels & coordinates — JetBrains Mono** (`--font-mono`): every uppercase
  tracked label, coordinate, legend term, and the CTA. Legitimate mono use —
  these are measurements and chart marginalia, not decorative "tech" styling.
- No eyebrow/kicker above the heading; the wordmark leads. Coordinates live as
  chart marginalia in the ruled caption and page corners.

## Signature motifs

- **Compass rose** — a 16-point brass star with a 72-tick degree ring, upper
  right; rhumb lines radiate from it across the whole field (portolan grammar).
- **Graticule** — cyan meridians + parallels at low opacity as the substrate.
- **Route arc** — a dashed magenta bézier with node circles: a journey drawn
  across the chart.
- **Cartouche** — the primary CTA is framed with four brass corner ticks.
- **Marginalia** — "Chart no. 001 — Personal" / "Scale 1 : the whole world" and
  edge coordinates, set like the notes on a real chart.
- **Legend, never cards** — the visited/planned/wishlist explainer is a map key
  (`<dl>`), not a row of feature cards.

## Motion

One authored moment on load, orchestrated, then still: the graticule and rhumb
lines draw in (`pathLength`), the compass rose rotates into place, the route arc
draws and its nodes pop, and the wordmark → caption → actions → legend rise in
sequence. Exponential ease-out from an already-laid-out default. Governed by
`<MotionConfig reducedMotion="user">`, so reduced-motion users get the end state
immediately.

## Browser surfaces (themed, in `globals.css`)

Selection = brass on ink; `:focus-visible` = brass ring; scrollbars = thin ink
thumb. The chrome belongs to the design, not the OS.

## The globe

The landing renders the real `WorldGlobe` (react-globe.gl, `ssr:false`) seeded
with a sample of colored countries so the mechanism is demonstrated, not
described. Clicking a country enters the app. It sits transparent on the chart;
its cyan atmosphere matches the graticule.

## Verification note

This world was built and audited against its direction contract and the craft
floor (detector clean; contract seed present in built HTML). The screenshot-based
finish review could not run in this environment because the automation browser
pane does not composite frames (it reports the page hidden, which also freezes
`requestAnimationFrame`); visual QA of the animated/WebGL result should be done in
a normal browser.
