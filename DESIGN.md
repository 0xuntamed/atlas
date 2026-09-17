---
name: ATLAS
description: A night sea-chart on the landing; the journal behind it inside — parchment pages ruled like a ship's log.
colors:
  ink: "#12100e"
  ink-raised: "#2a2622"
  parchment: "#f6f3ec"
  chart: "#081521"
  brass-bright: "#d8b25a"
  brass-light: "#e6c976"
  brass: "#a8853a"
  brass-ink: "#7a5c1e"
  graticule: "#5fb0c4"
  signal: "#ff5a8a"
  visited: "#34d399"
  planned: "#fbbf24"
  wishlist: "#a78bfa"
  danger-ink: "#9b2c2c"
typography:
  wordmark:
    fontFamily: "var(--font-display), Georgia, serif"
    fontSize: "clamp(3.5rem, 11vw, 9rem)"
    fontWeight: 700
    lineHeight: 1
    letterSpacing: "-0.02em"
  display:
    fontFamily: "var(--font-display), Georgia, serif"
    fontSize: "clamp(1.85rem, 4vw, 2.5rem)"
    fontWeight: 600
    lineHeight: 1.1
    letterSpacing: "0.025em"
  headline:
    fontFamily: "var(--font-display), Georgia, serif"
    fontSize: "clamp(1.875rem, 3vw, 2.25rem)"
    fontWeight: 600
    lineHeight: 1
    letterSpacing: "normal"
  title:
    fontFamily: "var(--font-display), Georgia, serif"
    fontSize: "1.25rem"
    fontWeight: 600
    lineHeight: 1.4
    letterSpacing: "normal"
  body:
    fontFamily: "var(--font-sans), ui-sans-serif, system-ui, sans-serif"
    fontSize: "0.875rem"
    fontWeight: 400
    lineHeight: 1.5
    letterSpacing: "normal"
  label:
    fontFamily: "var(--font-mono), ui-monospace, SFMono-Regular, Menlo, monospace"
    fontSize: "0.68rem"
    fontWeight: 500
    lineHeight: 1.4
    letterSpacing: "0.18em"
  marginalia:
    fontFamily: "var(--font-mono), ui-monospace, SFMono-Regular, Menlo, monospace"
    fontSize: "0.72rem"
    fontWeight: 500
    lineHeight: 1.4
    letterSpacing: "0.18em"
  labelSm:
    fontFamily: "var(--font-mono), ui-monospace, SFMono-Regular, Menlo, monospace"
    fontSize: "0.62rem"
    fontWeight: 500
    lineHeight: 1.4
    letterSpacing: "0.18em"
  field:
    fontFamily: "var(--font-sans), ui-sans-serif, system-ui, sans-serif"
    fontSize: "1rem"
    fontWeight: 400
    lineHeight: 1.4
    letterSpacing: "normal"
  figure:
    fontFamily: "var(--font-mono), ui-monospace, SFMono-Regular, Menlo, monospace"
    fontSize: "0.875rem"
    fontWeight: 400
    lineHeight: 1.5
    letterSpacing: "normal"
rounded:
  none: "0px"
  focus: "2px"
  dot: "999px"
spacing:
  xs: "4px"
  sm: "8px"
  md: "16px"
  lg: "24px"
  xl: "32px"
  2xl: "40px"
  3xl: "64px"
components:
  button-primary:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.parchment}"
    typography: "{typography.label}"
    rounded: "{rounded.none}"
    padding: "10px 20px"
  button-primary-hover:
    backgroundColor: "{colors.ink-raised}"
  button-secondary:
    backgroundColor: "transparent"
    textColor: "{colors.ink}"
    typography: "{typography.label}"
    rounded: "{rounded.none}"
    padding: "10px 20px"
  button-secondary-hover:
    textColor: "{colors.brass-ink}"
  button-ghost:
    backgroundColor: "transparent"
    textColor: "rgba(18, 16, 14, 0.7)"
    typography: "{typography.label}"
    rounded: "{rounded.none}"
    padding: "10px 20px"
  button-ghost-hover:
    textColor: "{colors.brass-ink}"
  button-danger-hover:
    textColor: "{colors.danger-ink}"
  field:
    backgroundColor: "transparent"
    textColor: "{colors.ink}"
    typography: "{typography.field}"
    rounded: "{rounded.none}"
    padding: "0.55rem 0"
    width: "100%"
  plate-paper:
    backgroundColor: "rgba(255, 255, 255, 0.35)"
    textColor: "{colors.ink}"
    rounded: "{rounded.none}"
    padding: "24px"
  plate-chart:
    backgroundColor: "{colors.chart}"
    textColor: "{colors.parchment}"
    rounded: "{rounded.none}"
    padding: "24px"
  nav-link:
    backgroundColor: "transparent"
    textColor: "rgba(18, 16, 14, 0.7)"
    typography: "{typography.label}"
    padding: "8px 10px"
  nav-link-active:
    textColor: "{colors.brass-ink}"
  country-mark:
    backgroundColor: "transparent"
    textColor: "rgba(18, 16, 14, 0.8)"
    typography: "{typography.labelSm}"
    rounded: "{rounded.none}"
    size: "32px"
---

# Design System: ATLAS

<!-- impeccable:design 3 · derived from the built landing (Night Sea-Chart, seed 59422312) and the built interior (journal, seed 59422312-interior) -->

## Overview

**Creative North Star: "The Night Chart and the Journal Behind It"**

The ATLAS landing establishes a **Night Sea-Chart** world: the product presented
as a working nautical/aeronautical navigation chart at night, with the real
interactive globe glowing at its center. This is the Persuade surface's identity.
The in-app screens (world, explore, trips, saved, passport, profile) are the
**journal behind the chart**: parchment pages under a soft top light, ruled like
a ship's log. They share the chart's roles (ink, parchment, brass, graticule,
the three state colors), its two faces (engraved Cinzel titles, JetBrains Mono
marginalia), and its one container grammar (the cartouche: a hairline with four
brass corner ticks). What changes between the two is the ground — night ink on
the landing, parchment inside — and, because of that, the weight of brass:
bright brass on the dark chart, a duller brass for rules and an ink-brass for
text on paper.

The interior refuses the admin-panel default. There are no card grids, stat
tiles, pills or badges, no sidebar shell. Content is set as ruled lists,
ledgers (`<table>` with a double rule above the total) and tallies (`<dl>` with
a dotted leader), the way a log book divides a page. Every measurement — dates,
ISO codes, counts, coordinates, amounts — is mono marginalia; prose is the
system sans; only titles and figures are engraved. Density is moderate: a
single 896px column, generous row height, and one authored motion moment per
sheet.

**Key Characteristics:**
- Two grounds, one world: night chart (`chart`) for the landing and map plates; parchment with a top light everywhere else.
- Brass in three weights, chosen by ground: bright on ink, plain for rules, ink-brass for text on paper.
- Cinzel for titles and figures only; JetBrains Mono for every measurement; system sans for prose.
- Rules instead of boxes: hairlines, brass rules, double rules, dotted leaders. The cartouche plate is the only container.
- Sharp corners throughout; depth by tone and line, never by shadow.
- Drawn 1.5px round-stroke icons on a 16-unit grid; ISO code marks instead of flag emoji.
- One authored motion moment per page; everything else arrives already laid out.

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

The interior (seed `59422312-interior`) was reviewed by screenshot in two rounds
(`.impeccable/review/*.png`) and shipped. The sections below record the interior
and the tokens both surfaces share; the frontmatter above is normative for both.

## Colors

A warm ink-on-parchment working palette carried by the same brass, cyan and
state hues as the night chart, so the journal is recognisably the same atlas
turned to a lighter page.

### Primary
- **Brass** (`brass`): the plain brass of rules and hairlines on parchment — the page-title rule, the header strip's bottom rule, the footer rule, corner ticks on paper plates, and the `:focus-visible` outline. It is a line color, not a text color (3.1:1 on parchment).
- **Brass Ink** (`brass-ink`): brass darkened until it reads as text (5.6:1 on parchment). The active nav item and its underscore, the active tab, link/row hover, the caret, the compass needle in the loader, and the focused field's rule. Any brass that must be read on parchment is this.
- **Bright Brass** (`brass-bright`, hover `brass-light`): the landing's brass. On the interior it appears only on dark ground — corner ticks of the `chart` plate and of the primary (ink) button, the header on `/`. Never as text on parchment (1.8:1).

### Secondary
- **Graticule Cyan** (`graticule`): map-surface only. Hairline lattice and border of the `chart` plate, the globe atmosphere. It does not appear on the paper.
- **Signal Magenta** (`signal`): the route arc — one accent, used once, on chart surfaces.

### Tertiary
- **Visited / Planned / Wishlist** (`visited`, `planned`, `wishlist`): the globe's state hues, and the same hues mean the same thing everywhere — a trip status dot is `visited` when completed, `planned` when planned or underway, so the journal and the globe agree.
- **Danger Ink** (`danger-ink`): error notes and the hover state of delete/danger controls; a dried-red ink, never a filled red surface.

### Neutral
- **Ink** (`ink`): all primary text, the primary button's ground, and — via alpha — every hairline and secondary tone on paper. The tonal ladder actually used: ink/85 body prose, ink/70 mono labels and marginalia, ink/60 secondary prose and hints, ink/50 idle icon controls, ink/35 dotted leaders and the draft dot, ink/25 stronger rules (table head, secondary button border), ink/15 hairlines (rows, sections, plate border), ink/10 ledger row rules.
- **Ink Raised** (`ink-raised`): the primary button's hover ground — ink warmed one step, not lightened to grey.
- **Parchment** (`parchment`): the interior ground; the header strip at 85% with a 2px blur so the page shows through; text on any `chart` surface.
- **Chart** (`chart`): the night ground, used inside the interior only for map plates.

### Named Rules
**The Three Brasses Rule.** Brass is picked by ground, not by taste: `brass-bright` on ink grounds only; `brass` for rules and ticks on parchment; `brass-ink` for any brass that is read. Bright brass never touches parchment as text.

**The Same-Hue-Same-Meaning Rule.** `visited`, `planned` and `wishlist` carry one meaning across the globe, the legend, trip status marks and stamps. No other hue is assigned to a status.

**The Paper Carries No Lattice Rule.** The interior ground is parchment with one radial top light and nothing else; the cyan graticule exists only on `Plate tone="chart"`, a map surface. (The direction contract's OWN-WORLD text in `layout.tsx` still says "a faint graticule drawn into the paper"; the build dropped it, and the build wins.)

**The Contrast Floor Rule.** Secondary prose is ink/60 or darker (4.8:1); small mono labels are ink/70 or darker; brass text is `brass-ink`. Nothing lighter carries words.

## Typography

**Display Font:** Cinzel (with Georgia, serif) — weights 400–700 via `next/font`, exposed as `--font-display`
**Body Font:** system sans stack (`ui-sans-serif, system-ui, sans-serif`), exposed as `--font-sans`
**Label/Mono Font:** JetBrains Mono (with ui-monospace, Menlo, monospace) — weights 400/500, exposed as `--font-mono`

**Character:** engraved Roman capitals for what is named or counted; a working monospace for everything measured; a quiet system sans for the prose in between. The pairing is a chart cartouche over a navigator's log — lettered, not typeset.

### Hierarchy
- **Wordmark** (700, `clamp(3.5rem, 11vw, 9rem)`, 1, `-0.02em`): the landing's ATLAS only. In the header strip the same face runs at 1.125rem/700 tracked `0.12em`.
- **Display** (600, `clamp(1.85rem, 4vw, 2.5rem)`, 1.1, `0.025em`, balanced wrap): the one `<h1>` per sheet, set over the brass page rule.
- **Headline** (600, 1.875–2.25rem, 1, tabular): engraved figures — the profile tally's numerals, stamp codes (`2.25rem` / `3rem`, tracked `0.12em`).
- **Title** (600, 1.25rem): empty-state titles. Row titles in lists are body sans at 1.125rem/500 — a written entry, not an engraved one.
- **Body** (400, 0.875rem, 1.5): prose, notes, hints; field text at 1rem/1.4 (16px so iOS Safari does not zoom a focused field). Long copy is capped around `max-w-md` (28rem).
- **Label** (500, 0.68rem, `0.18em`, uppercase): the mono marginalia voice — section heads, table heads, field labels, nav, tabs, md buttons, back link, status words, marginalia dates. The mono ramp has exactly three steps: **Marginalia** (0.72rem) for the line under a page title and the lg button; **Label** (0.68rem); **Label Sm** (0.62rem) for sheet-corner notes (tracked `0.12em`), the footer, sm buttons, list metadata (region/category/code lines), row indices, the dev mark, and the stamp's "ENTRY" line and date. No other literal mono size exists in the interior.
- **Figure** (400, 0.875rem, tabular-nums): mono amounts, dates and counts in ledgers and rows; the ledger total steps up to 1rem/500.

### Named Rules
**The Marginalia Rule.** Anything that is a measurement — a date, an ISO code, a count, a coordinate, an amount, a sheet number — is set in mono, tabular. Mono is never used for prose or for "tech" flavour.

**The Engraved-Only-When-Named Rule.** Cinzel appears on the page title, engraved figures and stamps. It is never used for buttons, labels, body copy or row titles.

**The No-Kicker Rule.** Nothing sits above an `<h1>` but the sheet-corner note (data) and the back link. The line under the title is marginalia — counts, dates, coordinates — never a category word.

**The Font Cascade Rule.** `--font-display` and `--font-mono` are set on `<html>` by `next/font` (`lib/fonts.ts`). Never redeclare them in `:root`; a `:root` declaration has the same specificity and, arriving later, silently replaces both faces with Georgia and the system mono.

## Layout

One column, one sheet. `<main>` is a centered 896px column (`max-w-4xl`) with 20px side padding (24px from `sm`) and 40px vertical padding; the header strip and footer share the same column. There is no sidebar, no app rail, and no card grid — the page reads top to bottom like a log.

Every sheet opens the same way: the header strip (compass + ATLAS wordmark left, mono nav right, active route underscored in brass one pixel below the strip's own rule) → an optional sheet-corner line (back link left, "Sheet 01 · Trips" right) → the engraved `<h1>` with marginalia beneath and, when the page has one, its single primary action on the right, all sitting on a brass rule (`border-b brass/60`, 16px padding below) → the ruled content.

Rhythm is a 4px-based ladder actually used as: 4px (label-to-hint), 8px (section head padding, small gaps), 16px (row padding, section body gap), 24px (plate padding, paper), 32px (page section gap, plate padding from `sm`), 40px (main vertical padding), 64px (footer offset). Lists are `<ol>`/`<ul>` opened with a hairline on top and a hairline under each row; multi-column rows are CSS grid with a fixed 9rem mono metadata column from `sm` and the metadata folding under the title below it. Ledgers are real `<table>` elements with the date column hidden below `sm`.

Responsive behaviour is a fold, not a rebuild: the nav scrolls horizontally with a right-edge fade below `sm`; forms go from a two-column grid to their named columns at `sm`; plates tighten from 32px to 24px padding; the primary button stays on the header rule. The page title uses `clamp()` rather than breakpoints.

## Elevation & Depth

Flat. The interior uses no box shadows at any level; the only `box-shadow` in the stylesheet is the 1px rule thickening under a focused field, and the only blur is the header's 2px backdrop so the parchment shows through. Depth is carried by tone and line: the parchment's radial top light (white at 55% fading out by 70% of the sheet), plates lifted by a 35% white wash and a hairline, the `chart` plate cut into the paper as a night surface, and hierarchy of rules — brass for the page, ink/25 for heads, ink/15 for rows, ink/10 for ledger lines, a 3px double rule above a total.

### Named Rules
**The No-Shadow Rule.** Nothing casts a shadow. If a surface needs to read as separate, give it a hairline and the corner ticks, or a different ground.

**The Rule Hierarchy Rule.** Line weight and tone encode importance: brass rule = the page; double rule = a sum; ink/25 = a head; ink/15 = a row; ink/10 = a ledger line; dotted ink/35 = a leader.

## Shapes

Square. Every plate, button, field, tab, mark and stamp has a 0px radius; the only rounded forms are things that are round in life — the 8px status dot, the loader's compass ring, the stamp's circular postmark, and the scrollbar thumb — plus the 2px softening on the focus outline. Borders are 1px hairlines in ink alpha, dashed for an empty page, double (3px) for a sum and for a passport stamp's frame. The recurring silhouette is the **cartouche**: a rectangle whose four corners are marked by 10px brass ticks set 2px outside the hairline (3px outside a button). Stamps are the one deliberately imperfect shape: rotated between −5° and 5° and multiplied into the paper.

## Components

### Buttons
Mono, uppercase, tracked labels; a written instruction rather than a pill.
- **Shape:** square (0px), `label` typography; sizes sm 6px 12px / `labelSm` 0.62rem, md 10px 20px / `label` 0.68rem, lg 14px 28px / `marginalia` 0.72rem.
- **Primary:** ink ground, parchment text; hovers to `ink-raised`. With `cartouche` it wears four bright-brass corner ticks — reserved for the one primary action on a page (the page-header action or the empty state's action).
- **Secondary (default):** transparent with an ink/25 hairline; hover turns border and text `brass-ink`.
- **Ghost:** ink/70 text, hover `brass-ink`. **Danger:** ink/60 text, hover `danger-ink`; icon-only deletes are ink/50 → `danger-ink`.
- **Focus:** the global 2px `brass` outline, 3px offset. **Disabled:** 50% opacity, not-allowed cursor.

### Cards / Containers
- **Plate (paper):** the only container. 35% white wash, ink/15 hairline, four `brass` corner ticks, 24px padding (32px from `sm`). `dashed` marks an empty page. Used for forms, the tally, and detail blocks — never repeated as a grid of tiles.
- **Plate (chart):** `chart` ground, parchment text, graticule/25 border, bright-brass ticks, and the cyan 56px lattice. For globes and maps only.
- **Section:** not a box — a mono `<h2>` label on an ink/15 hairline with an optional tabular aside on the right.

### Inputs / Fields
- **Style:** the `.field` ruled line — transparent, no side or top border, a 1px ink/28 bottom rule, 0.55rem vertical padding, 1rem text (16px, so iOS Safari does not zoom a focused field), placeholder ink/60. Selects drop the native chrome for a 12px drawn chevron in `brass-ink`. Mono label above (the `Field` primitive), optional ink/60 hint below.
- **Focus:** the rule turns `brass-ink` and thickens by 1px (`box-shadow: 0 1px 0 0`), 160ms; no outline. Caret is `brass-ink`.
- **Error / Disabled:** errors are a `Note` in `danger-ink` beneath the form; disabled fields drop to 50% opacity. Money and codes inside fields are mono, tabular, codes tracked `0.15em`.

### Navigation
- **Header strip:** parchment/85 with 2px blur, `brass`/50 bottom rule; on `/` it becomes the night chart (`chart` ground, graticule/20 rule). Wordmark in Cinzel 1.125rem/700 tracked `0.12em` beside the 18px drawn compass (`brass-ink` on paper, `brass-bright` on the chart).
- **Links:** mono `label` at 0.68rem, ink/70 → ink on hover; the active route is `brass-ink` with a 1px `brass-ink` underscore sitting on the strip's rule. Below `sm` the nav scrolls with a fade on its right edge.
- **Tabs (trip sheet):** the same grammar on a page hairline — mono labels, active in `brass-ink` with a 1px underscore.
- **Footer:** a `brass`/40 rule and the chart's marginalia ("Chart no. 001 — Personal" / "Scale 1 : the whole world") at `labelSm` 0.62rem mono, ink/60.

### Ruled list / Ledger / Tally
The interior's three ways of laying out records; all lines, no boxes.
- **Ruled list:** `<ol>` with a hairline above and under each row; 16px row padding; a 9rem mono metadata column (code, date range) at ink/70–60, then the title in sans 1.125rem/500 with the status dot before it, then a drawn arrow that shifts 2px right and turns `brass-ink` on row hover.
- **Ledger:** `<table>` with mono `Label` heads on an ink/25 rule, ink/10 row rules, mono tabular amounts right-aligned, and a 3px double ink/60 rule above the per-currency totals (mono 1rem/500).
- **Tally:** `<dl>` rows divided by ink/15, each a mono label, a dotted ink/35 leader, and an engraved tabular figure (1.875–2.25rem/600).

### Country Mark
The ISO alpha-2 code in mono, uppercase, tracked (`0.12em`–`0.16em`), at 0.62rem / 1rem / 1.125–1.5rem, centred in a hairline square (32 / 48 / 64–80px; ink/30 border, ink/80 text; `stamp` tone inherits `currentColor`). Replaces flag emoji everywhere: Chrome on Windows has no flag glyphs, and a chart labels territory by code anyway.

### Status Mark
An 8px dot plus an optional mono word: `visited` for completed, `planned` for planned, `planned` with a 2px same-hue ring for underway, ink/35 for draft, a hollow ink/40 ring for cancelled.

### Passport Stamp
A 160px (or 224px) square with a 3px double frame, inner dashed circular postmark, "ENTRY" and the date in 0.62rem mono, the code in engraved 2.25rem/700 (3rem large), the country name in engraved caps at 0.75rem (1.125rem large); inked in a deep visited green (emerald 800/900 at 75–85%) or a sepia `#8a5a3c` for the large celebratory stamp, `mix-blend-multiply` into the paper, rotated from a fixed set of eight angles. It lands with a spring (stiffness 260, damping 15) from 1.5×–2.2× scale.

### Icons
One set (`ui/icons.tsx`): 1.5px round-capped strokes on a 16-unit grid, `currentColor`, 13–18px on the page. No icon fonts, no glyph characters, no filled icons.

### Loading & Empty
- **Loading:** a 24px `brass`/70 ring with the compass needle in `brass-ink` sweeping once every 2.4s beside "Taking a bearing…" in mono; inline waits are a `Note` in the page's voice ("Opening the log…").
- **Empty:** the plate, dashed, with an engraved 1.25rem title, ink/60 body under 28rem, and the page's cartouche action.

### Motion (interior)
One authored moment per sheet, on an exponential ease-out (`cubic-bezier(0.22, 1, 0.36, 1)`): the app-wide template fade (350ms, 10px rise) on navigation; the profile tally's 50ms stagger with count-up; the passport stamp's spring. Rows do not each get an entrance — list and ledger rows only cross-fade on add/remove. Field rules and colour hovers transition in 160ms. Everything honours `prefers-reduced-motion` (the loader stops; framer follows the user setting).

## Do's and Don'ts

### Do:
- **Do** open every sheet with the header strip, the engraved `<h1>` over a `brass`/60 rule, and mono marginalia beneath it; put the page's one primary action on that rule, wearing the cartouche ticks.
- **Do** set every measurement — dates, ISO codes, counts, coordinates, amounts, sheet numbers — in JetBrains Mono, tabular, at the `label` or `figure` role.
- **Do** lay out records as ruled lists, ledgers (`<table>`) or tallies (`<dl>`) on hairlines; group with `Section` (a mono head on a rule), and reach for `Plate` only when content genuinely needs a frame.
- **Do** pick brass by ground: `brass-bright` on ink, `brass` for lines on parchment, `brass-ink` for anything read on parchment.
- **Do** keep secondary prose at ink/60 or darker and small mono at ink/70 or darker; use `danger-ink` for errors as text, not as a filled surface.
- **Do** use the `.field` ruled line for every text input, select and textarea, with a mono `Label` above.
- **Do** give each page at most one authored motion moment on the `[0.22, 1, 0.36, 1]` curve; let rows arrive laid out.
- **Do** label countries with `CountryMark` (mono ISO code in a hairline square) and draw icons at 1.5px on the 16-unit grid.

### Don't:
- **Don't** build card grids, stat tiles, pills, badges, chips or a sidebar shell; the interior is a page, not a dashboard.
- **Don't** put a kicker, eyebrow or category word above or beneath an `<h1>`; the only line under a title is data.
- **Don't** cast shadows or round corners; depth is tone and line, and the only round things are dots, rings and postmarks.
- **Don't** put `brass-bright` text on parchment (1.8:1), or use plain `brass` for words.
- **Don't** draw the cyan graticule into the parchment; it belongs to `Plate tone="chart"` and the globe only.
- **Don't** redeclare `--font-display` or `--font-mono` in `:root`; they are set on `<html>` by `next/font`.
- **Don't** use flag emoji, glyph-character icons, icon fonts, or Cinzel for buttons, labels or prose.
- **Don't** give every list row its own entrance animation, or add a second accent hue for a status.
