"use client";

import dynamic from "next/dynamic";
import { useCountryStates } from "@/lib/discovery-hooks";
import { countryStatesToMap } from "@/lib/geo";
import { LEGEND_ORDER, STATE_COLOR, STATE_LABEL } from "@/lib/globe-colors";
import { CornerTicks, PageHeader, Plate } from "@/components/ui/primitives";

const WorldGlobe = dynamic(
  () => import("@/components/globe/world-globe"),
  {
    ssr: false,
    loading: () => (
      <div className="flex h-full items-center justify-center font-mono text-[0.68rem] uppercase tracking-label text-parchment/60">
        Raising the globe…
      </div>
    ),
  },
);

export default function WorldPage() {
  const { data } = useCountryStates();
  const states = countryStatesToMap(data ?? []);

  const counts = LEGEND_ORDER.map((s) => ({
    state: s,
    n: (data ?? []).filter((c) => c.state === s).length,
  }));
  const total = counts.reduce((a, c) => a + c.n, 0);

  return (
    <section className="space-y-6">
      <PageHeader
        corner="Sheet 02 · The world"
        title="The world"
        marginalia={
          total > 0
            ? `${total} ${total === 1 ? "country" : "countries"} marked · click one to open it`
            : "Click a country to open it"
        }
      />

      <Plate
        tone="chart"
        padded={false}
        className="h-[70vh] w-full overflow-hidden"
      >
        <WorldGlobe states={states} />

        {/* Map key — a legend cartouche, drawn on the chart the way a real one is. */}
        <dl className="pointer-events-none absolute bottom-5 left-5 space-y-1.5 border border-graticule/25 bg-chart/75 px-3.5 py-3">
          <CornerTicks tone="bright" />
          {counts.map(({ state, n }) => (
            <div
              key={state}
              className="flex items-center gap-3 font-mono text-[0.62rem] uppercase tracking-label text-parchment/85"
            >
              <span
                aria-hidden
                className="inline-block h-2 w-2 rounded-full"
                style={{
                  backgroundColor: STATE_COLOR[state],
                  boxShadow: `0 0 8px ${STATE_COLOR[state]}88`,
                }}
              />
              <dt className="w-16">{STATE_LABEL[state]}</dt>
              <dd className="tabular-nums text-parchment">{n}</dd>
            </div>
          ))}
        </dl>
      </Plate>
    </section>
  );
}
