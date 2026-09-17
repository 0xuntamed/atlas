import type { Config } from "tailwindcss";

/**
 * ATLAS tokens. The landing is the night sea-chart (dark); the app interior is
 * the journal's parchment pages. Both share these roles — see DESIGN.md.
 *
 * Brass comes in three weights because the same hue can't serve both grounds:
 *   brass-bright  #d8b25a  on the dark chart only (1.8:1 on parchment)
 *   brass         #a8853a  rules, ticks, hairlines on parchment (3.1:1, non-text)
 *   brass-ink     #7a5c1e  text, links, active states on parchment (5.6:1)
 */
const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
        display: ["var(--font-display)", "Georgia", "serif"],
        mono: [
          "var(--font-mono)",
          "ui-monospace",
          "SFMono-Regular",
          "Menlo",
          "monospace",
        ],
      },
      colors: {
        ink: "#12100e",
        parchment: "#f6f3ec",
        chart: "#081521",
        brass: {
          DEFAULT: "#a8853a",
          bright: "#d8b25a",
          light: "#e6c976",
          ink: "#7a5c1e",
        },
        graticule: "#5fb0c4",
        signal: "#ff5a8a",
        visited: "#34d399",
        planned: "#fbbf24",
        wishlist: "#a78bfa",
      },
      letterSpacing: {
        label: "0.18em",
      },
    },
  },
  plugins: [],
};

export default config;
