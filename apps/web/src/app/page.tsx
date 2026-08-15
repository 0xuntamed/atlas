"use client";

/*
  ───────────────────────────────────────────────────────────────────────────
  IMPECCABLE DIRECTION CONTRACT — ATLAS landing (Persuade)   seed 59422312
  THESIS:  The world as a working night sea-chart, YOUR living globe glowing at
           its center. Refuses the SaaS glowing-globe-+-feature-cards default and
           the cream-paper-serif cliché.
  OWN-WORLD: Deep prussian-ink ground; luminous cyan graticule + rhumb lines; a
           brass compass rose; signal-magenta route arc; parchment engraved caps
           (Cinzel) + mono coordinates (JetBrains Mono). Chart legend, never cards.
  STORY:   Visitor sees a beautiful chart of a real, colored globe → understands
           ATLAS remembers where they've been / are going → enters via cartouche.
  FIRST VIEWPORT: full-bleed chart; compass rose upper-right; interactive globe
           igniting with visited/planned/wishlist colors; ATLAS wordmark + ruled
           coordinate caption left; primary cartouche CTA; route arc drawn across.
  FORM:    Nautical/aeronautical night chart (grounded list #3, assigned by roll).
           Raised: +vellum depth, +provenance coordinate captions, +scroll-free
           single reveal, +one ignite event on the globe, +directional route line.
  FINISH:  unreviewed and undocumented is unfinished; this build ends with the
           finish review, the verdict, and DESIGN.md.
  ───────────────────────────────────────────────────────────────────────────
*/

import Link from "next/link";
import dynamic from "next/dynamic";
import { Cinzel, JetBrains_Mono } from "next/font/google";
import { motion } from "framer-motion";
import { SeaChart } from "@/components/landing/sea-chart";
import type { StateMap } from "@/lib/geo";

const display = Cinzel({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-display",
});
const mono = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-mono",
});

const WorldGlobe = dynamic(() => import("@/components/globe/world-globe"), {
  ssr: false,
});

// A sample of colored states so the globe demonstrates the real mechanism
// (visited / planned / wishlist) before anyone signs in.
const SAMPLE_STATES: StateMap = {
  JP: "visited",
  IT: "visited",
  US: "visited",
  GR: "visited",
  MA: "visited",
  FR: "planned",
  IN: "planned",
  TH: "planned",
  IS: "planned",
  BR: "wishlist",
  AU: "wishlist",
  ZA: "wishlist",
  PE: "wishlist",
  NO: "wishlist",
};

const rise = {
  hidden: { opacity: 0, y: 22 },
  show: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, delay: 0.3 + i * 0.12, ease: [0.22, 1, 0.36, 1] },
  }),
};

const LEGEND = [
  { label: "Visited", color: "#34d399", coord: "72 places" },
  { label: "Planned", color: "#fbbf24", coord: "9 trips" },
  { label: "Wishlist", color: "#a78bfa", coord: "24 saved" },
];

export default function HomePage() {
  return (
    <div
      data-impeccable-seed="59422312"
      className={`${display.variable} ${mono.variable} relative left-1/2 right-1/2 -mx-[50vw] -mt-10 w-screen overflow-hidden bg-[#081521] text-parchment`}
    >
      {/* atmospheric wash */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(120% 90% at 78% 30%, rgba(38,92,110,0.35), transparent 60%), radial-gradient(80% 70% at 12% 88%, rgba(255,90,138,0.10), transparent 55%)",
        }}
      />
      <SeaChart />

      <section className="relative mx-auto grid min-h-[calc(100vh-4rem)] max-w-7xl grid-cols-1 items-center gap-8 px-6 py-16 lg:grid-cols-[1.05fr_1fr] lg:gap-4 lg:px-10">
        {/* Left: wordmark cartouche + action */}
        <div className="order-2 lg:order-1">
          <motion.h1
            custom={0}
            variants={rise}
            initial="hidden"
            animate="show"
            className="text-[clamp(3.5rem,11vw,9rem)] font-medium leading-[0.9] tracking-[-0.02em]"
            style={{ fontFamily: "var(--font-display)" }}
          >
            ATLAS
          </motion.h1>

          <motion.div
            custom={1}
            variants={rise}
            initial="hidden"
            animate="show"
            className="mt-6 max-w-md border-t border-[#d8b25a]/40 pt-4"
          >
            <div
              className="flex items-baseline justify-between gap-4"
              style={{ fontFamily: "var(--font-mono)" }}
            >
              <span className="text-sm uppercase tracking-[0.22em] text-[#d8b25a]">
                The world is yours
              </span>
              <span className="text-[11px] uppercase tracking-[0.3em] text-[#7fb3c4]">
                48°51′N · 2°21′E
              </span>
            </div>
            <p className="mt-3 text-lg leading-relaxed text-parchment/75">
              A personal chart of everywhere you&apos;ve been and everywhere
              you&apos;re going. Plan journeys, collect places, and earn a stamp
              for every trip you complete.
            </p>
          </motion.div>

          <motion.div
            custom={2}
            variants={rise}
            initial="hidden"
            animate="show"
            className="mt-9 flex flex-wrap items-center gap-4"
          >
            <Link
              href="/world"
              className="group relative inline-flex items-center gap-3 bg-[#d8b25a] px-8 py-4 text-xs font-semibold uppercase tracking-[0.2em] text-[#081521] transition hover:bg-[#e6c976]"
              style={{ fontFamily: "var(--font-mono)" }}
            >
              <CornerTicks />
              Build your ATLAS
              <svg
                aria-hidden
                viewBox="0 0 24 24"
                className="h-3.5 w-3.5 transition group-hover:translate-x-1"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M5 12h14M13 6l6 6-6 6" />
              </svg>
            </Link>
            <Link
              href="/trips"
              className="text-xs font-medium uppercase tracking-[0.2em] text-parchment/70 underline decoration-[#d8b25a]/40 underline-offset-[6px] transition hover:text-parchment"
              style={{ fontFamily: "var(--font-mono)" }}
            >
              My trips
            </Link>
          </motion.div>

          {/* Chart legend — the map key, not feature cards */}
          <motion.dl
            custom={3}
            variants={rise}
            initial="hidden"
            animate="show"
            className="mt-12 flex flex-wrap gap-x-8 gap-y-3 border-t border-parchment/10 pt-5"
          >
            {LEGEND.map((item) => (
              <div key={item.label} className="flex items-center gap-2.5">
                <span
                  className="h-2.5 w-2.5 rounded-full"
                  style={{
                    backgroundColor: item.color,
                    boxShadow: `0 0 10px ${item.color}`,
                  }}
                />
                <dt
                  className="text-xs uppercase tracking-[0.18em] text-parchment/80"
                  style={{ fontFamily: "var(--font-mono)" }}
                >
                  {item.label}
                </dt>
                <dd
                  className="text-xs text-parchment/40"
                  style={{ fontFamily: "var(--font-mono)" }}
                >
                  {item.coord}
                </dd>
              </div>
            ))}
          </motion.dl>
        </div>

        {/* Right: the living globe */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.3, delay: 0.25, ease: [0.22, 1, 0.36, 1] }}
          className="order-1 h-[46vh] w-full sm:h-[56vh] lg:order-2 lg:h-[82vh]"
        >
          <WorldGlobe states={SAMPLE_STATES} />
        </motion.div>
      </section>

      {/* bottom coordinate strip */}
      <div
        className="pointer-events-none absolute inset-x-0 bottom-4 flex justify-between px-6 text-[10px] uppercase tracking-[0.3em] text-parchment/30 lg:px-10"
        style={{ fontFamily: "var(--font-mono)" }}
      >
        <span>Chart no. 001 — Personal</span>
        <span>Scale 1 : the whole world</span>
      </div>
    </div>
  );
}

/** Small brass corner ticks that frame the primary action like a cartouche. */
function CornerTicks() {
  return (
    <>
      {[
        "left-1 top-1 border-l border-t",
        "right-1 top-1 border-r border-t",
        "left-1 bottom-1 border-l border-b",
        "right-1 bottom-1 border-r border-b",
      ].map((pos) => (
        <span
          key={pos}
          aria-hidden
          className={`absolute h-2 w-2 border-[#081521]/50 ${pos}`}
        />
      ))}
    </>
  );
}
