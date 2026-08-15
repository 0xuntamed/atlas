import type { Config } from "tailwindcss";

/**
 * Phase 1 keeps styling intentionally minimal — a calm, editorial base we can
 * build the "travel journal / passport / atlas" identity onto in Phase 4.
 */
const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
      },
      colors: {
        ink: "#12100e",
        parchment: "#f6f3ec",
      },
    },
  },
  plugins: [],
};

export default config;
