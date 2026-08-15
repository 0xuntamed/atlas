"use client";

import { motion } from "framer-motion";

/**
 * The Night Sea-Chart backdrop: a portolan-style navigation chart drawn in SVG —
 * lat/long graticule, rhumb lines radiating from a brass compass rose, and a
 * magenta route arc. Everything is hairline-thin and low-opacity so the globe
 * and type read on top. Lines draw themselves in once, on load.
 */

const CYAN = "#5fb0c4";
const BRASS = "#d8b25a";
const MAGENTA = "#ff5a8a";

// 32-point rhumb network, the signature of a portolan chart.
function rhumbLines(cx: number, cy: number, r: number) {
  const lines = [];
  for (let i = 0; i < 32; i++) {
    const a = (i / 32) * Math.PI * 2;
    lines.push({
      x1: cx,
      y1: cy,
      x2: cx + Math.cos(a) * r,
      y2: cy + Math.sin(a) * r,
      major: i % 4 === 0,
    });
  }
  return lines;
}

// A 16-point compass rose built from alternating star spikes.
function compassPoints(cx: number, cy: number, outer: number, inner: number) {
  const spikes = [];
  for (let i = 0; i < 16; i++) {
    const a = (i / 16) * Math.PI * 2 - Math.PI / 2;
    const len = i % 4 === 0 ? outer : i % 2 === 0 ? outer * 0.72 : outer * 0.5;
    const tip = [cx + Math.cos(a) * len, cy + Math.sin(a) * len];
    const bl = [
      cx + Math.cos(a - 0.09) * inner,
      cy + Math.sin(a - 0.09) * inner,
    ];
    const br = [
      cx + Math.cos(a + 0.09) * inner,
      cy + Math.sin(a + 0.09) * inner,
    ];
    spikes.push({
      d: `M ${bl[0]} ${bl[1]} L ${tip[0]} ${tip[1]} L ${br[0]} ${br[1]} Z`,
      cardinal: i % 4 === 0,
    });
  }
  return spikes;
}

const draw = {
  hidden: { pathLength: 0, opacity: 0 },
  show: (i: number) => ({
    pathLength: 1,
    opacity: 1,
    transition: {
      pathLength: { duration: 1.6, delay: 0.2 + i * 0.04, ease: "easeOut" },
      opacity: { duration: 0.4, delay: 0.2 + i * 0.04 },
    },
  }),
};

export function SeaChart() {
  const rose = { cx: 1200, cy: 250, r: 150 };
  const rhumbs = rhumbLines(rose.cx, rose.cy, 1500);
  const spikes = compassPoints(rose.cx, rose.cy, 88, 20);

  return (
    <svg
      className="pointer-events-none absolute inset-0 h-full w-full"
      viewBox="0 0 1440 900"
      preserveAspectRatio="xMidYMid slice"
      aria-hidden
    >
      {/* graticule — meridians + parallels */}
      <g stroke={CYAN} strokeWidth="1" opacity="0.14">
        {Array.from({ length: 13 }, (_, i) => (
          <line key={`v${i}`} x1={i * 120} y1={0} x2={i * 120} y2={900} />
        ))}
        {Array.from({ length: 11 }, (_, i) => (
          <line key={`h${i}`} x1={0} y1={i * 90} x2={1440} y2={i * 90} />
        ))}
      </g>

      {/* rhumb lines from the rose */}
      <g opacity="0.5">
        {rhumbs.map((l, i) => (
          <motion.line
            key={`r${i}`}
            x1={l.x1}
            y1={l.y1}
            x2={l.x2}
            y2={l.y2}
            stroke={l.major ? BRASS : CYAN}
            strokeWidth={l.major ? 0.8 : 0.5}
            opacity={l.major ? 0.28 : 0.16}
            variants={draw}
            custom={i}
            initial="hidden"
            animate="show"
          />
        ))}
      </g>

      {/* route arc — a journey drawn across the chart */}
      <motion.path
        d="M 210 700 Q 620 520 900 640 T 1320 470"
        fill="none"
        stroke={MAGENTA}
        strokeWidth="1.6"
        strokeDasharray="7 7"
        opacity="0.85"
        variants={draw}
        custom={20}
        initial="hidden"
        animate="show"
      />
      {[
        [210, 700],
        [900, 640],
        [1320, 470],
      ].map(([x, y], i) => (
        <motion.circle
          key={`node${i}`}
          cx={x}
          cy={y}
          r="4.5"
          fill="#0a1a26"
          stroke={MAGENTA}
          strokeWidth="1.6"
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 1.6 + i * 0.15, duration: 0.4 }}
        />
      ))}

      {/* compass rose */}
      <motion.g
        initial={{ opacity: 0, rotate: -12 }}
        animate={{ opacity: 1, rotate: 0 }}
        transition={{ duration: 1.2, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
        style={{ transformOrigin: `${rose.cx}px ${rose.cy}px` }}
      >
        <circle
          cx={rose.cx}
          cy={rose.cy}
          r={rose.r}
          fill="none"
          stroke={BRASS}
          strokeWidth="0.75"
          opacity="0.5"
        />
        <circle
          cx={rose.cx}
          cy={rose.cy}
          r={rose.r - 12}
          fill="none"
          stroke={BRASS}
          strokeWidth="0.5"
          opacity="0.35"
        />
        {/* degree ticks */}
        {Array.from({ length: 72 }, (_, i) => {
          const a = (i / 72) * Math.PI * 2;
          const r1 = rose.r - 12;
          const r2 = i % 2 === 0 ? rose.r - 4 : rose.r - 8;
          return (
            <line
              key={`t${i}`}
              x1={rose.cx + Math.cos(a) * r1}
              y1={rose.cy + Math.sin(a) * r1}
              x2={rose.cx + Math.cos(a) * r2}
              y2={rose.cy + Math.sin(a) * r2}
              stroke={BRASS}
              strokeWidth="0.5"
              opacity="0.4"
            />
          );
        })}
        {spikes.map((s, i) => (
          <path
            key={`s${i}`}
            d={s.d}
            fill={i % 2 === 0 ? BRASS : "#0a1a26"}
            stroke={BRASS}
            strokeWidth="0.6"
            opacity={i % 2 === 0 ? 0.55 : 0.7}
          />
        ))}
        <circle cx={rose.cx} cy={rose.cy} r="6" fill={BRASS} opacity="0.7" />
        <text
          x={rose.cx}
          y={rose.cy - rose.r + 24}
          textAnchor="middle"
          fontSize="15"
          fontWeight="700"
          fill={BRASS}
          style={{ fontFamily: "var(--font-display), serif" }}
        >
          N
        </text>
      </motion.g>
    </svg>
  );
}
