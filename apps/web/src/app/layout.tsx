import type { Metadata } from "next";
import { AuthProvider } from "@/components/auth";
import { SiteHeader } from "@/components/app-shell/site-header";
import { SiteFooter } from "@/components/app-shell/site-footer";
import { display, mono } from "@/lib/fonts";
import { Providers } from "./providers";
import "./globals.css";

export const metadata: Metadata = {
  title: "ATLAS — Your personal map of the world",
  description:
    "Plan journeys, collect places, and preserve everywhere you've been.",
};

/*
  ───────────────────────────────────────────────────────────────────────────
  IMPECCABLE DIRECTION CONTRACT — ATLAS interior (Operate)   extends 59422312
  THESIS:  The app is the journal behind the night chart: parchment pages you
           write in, ruled like a log book. Refuses the admin-panel default —
           card grids, stat tiles, pill chrome — and the SaaS dashboard shell.
  OWN-WORLD: Parchment ground under a top light — the paper carries no lattice;
           the cyan graticule lives only on the dark chart plate (a map surface).
           Engraved Cinzel titles over brass rules; JetBrains Mono marginalia
           for every measurement (dates, codes, counts, coordinates, sheet no.);
           ruled lists and ledgers instead of cards; one cartouche plate
           (hairline + brass corner ticks) as the only container; drawn 1.5px
           icons; brass in three weights (bright on ink, plain for rules,
           brass-ink for text on parchment).
  STORY:   The traveler opens their atlas, reads its index like a log, writes
           the next journey on a ruled line, and watches the passport fill.
  FIRST VIEWPORT: chart title strip (compass + ATLAS wordmark, mono nav, brass
           underscore on the active sheet) → engraved page title on a brass
           rule with mono marginalia → the page's ruled content; the one
           primary action per page wears the cartouche ticks.
  FORM:    Ship's log / field journal (interior extension of the sea-chart).
  FINISH:  unreviewed and undocumented is unfinished; this build ends with the
           finish review, the verdict, and DESIGN.md.
  ───────────────────────────────────────────────────────────────────────────
*/

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthProvider>
      <html lang="en" className={`${display.variable} ${mono.variable}`}>
        <body className="flex min-h-full flex-col">
          <Providers>
            <SiteHeader />
            <main
              data-impeccable-seed="59422312-interior"
              className="mx-auto w-full max-w-4xl flex-1 px-5 py-10 sm:px-6"
            >
              {children}
            </main>
            <SiteFooter />
          </Providers>
        </body>
      </html>
    </AuthProvider>
  );
}
