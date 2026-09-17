import { Cinzel, JetBrains_Mono } from "next/font/google";

/**
 * The two faces of the ATLAS world, instantiated once and shared by the root
 * layout and the landing so next/font emits a single @font-face set.
 *
 *   display — Cinzel: engraved Roman capitals, the lettering of a map cartouche.
 *   mono    — JetBrains Mono: coordinates, dates, counts, and marginalia —
 *             measurements, not decoration.
 */
export const display = Cinzel({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-display",
});

export const mono = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-mono",
});
