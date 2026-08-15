"use client";

import dynamic from "next/dynamic";
import { useCountryStates } from "@/lib/discovery-hooks";
import { countryStatesToMap } from "@/lib/geo";
import { LEGEND_ORDER, STATE_COLOR, STATE_LABEL } from "@/lib/globe-colors";

const WorldGlobe = dynamic(
  () => import("@/components/globe/world-globe"),
  {
    ssr: false,
    loading: () => (
      <div className="flex h-full items-center justify-center text-parchment/60">
        Loading globe…
      </div>
    ),
  },
);

export default function WorldPage() {
  const { data } = useCountryStates();
  const states = countryStatesToMap(data ?? []);

  return (
    <section className="space-y-5">
      <div>
        <h1 className="text-3xl font-semibold tracking-tight">The world</h1>
        <p className="text-sm text-ink/60">
          Every place you&apos;ve been and everywhere you&apos;re going. Click a
          country to explore it.
        </p>
      </div>

      <div className="relative h-[70vh] w-full overflow-hidden rounded-3xl bg-[#0a0e13]">
        <WorldGlobe states={states} />

        <div className="pointer-events-none absolute bottom-4 left-4 flex flex-col gap-1.5 rounded-xl bg-black/30 px-3 py-2 backdrop-blur">
          {LEGEND_ORDER.map((s) => (
            <div key={s} className="flex items-center gap-2 text-xs text-parchment/90">
              <span
                className="inline-block h-2.5 w-2.5 rounded-full"
                style={{ backgroundColor: STATE_COLOR[s] }}
              />
              {STATE_LABEL[s]}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
