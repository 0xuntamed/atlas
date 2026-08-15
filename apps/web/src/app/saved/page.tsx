"use client";

import Link from "next/link";
import { useDeleteSavedPlace, useSavedPlaces } from "@/lib/discovery-hooks";

export default function SavedPage() {
  const { data: places, isLoading, isError } = useSavedPlaces();
  const deletePlace = useDeleteSavedPlace();

  return (
    <section className="space-y-8">
      <div>
        <h1 className="text-3xl font-semibold tracking-tight">Saved places</h1>
        <p className="text-sm text-ink/60">Places you want to visit.</p>
      </div>

      {isLoading && <p className="text-ink/60">Loading…</p>}
      {isError && <p className="text-red-700">Couldn&apos;t load saved places.</p>}

      {places && places.length === 0 && (
        <div className="rounded-2xl border border-dashed border-ink/20 p-10 text-center">
          <p className="text-lg font-medium">Nothing saved yet</p>
          <p className="mt-1 text-sm text-ink/60">
            Discover places from a country and save the ones you love.
          </p>
          <Link
            href="/countries"
            className="mt-4 inline-block rounded-full bg-ink px-5 py-2.5 text-sm font-medium text-parchment"
          >
            Explore countries
          </Link>
        </div>
      )}

      <ul className="space-y-2">
        {places?.map((p) => (
          <li
            key={p.id}
            className="flex items-center justify-between rounded-xl border border-ink/10 bg-white/40 px-4 py-3"
          >
            <div className="min-w-0">
              <p className="truncate font-medium">{p.name}</p>
              <p className="text-xs text-ink/50">
                {[p.countryCode, p.category].filter(Boolean).join(" · ")}
              </p>
            </div>
            <div className="flex shrink-0 items-center gap-3">
              {p.countryCode && (
                <Link
                  href={`/countries/${p.countryCode}`}
                  className="text-xs text-ink/50 hover:underline"
                >
                  View country
                </Link>
              )}
              <button
                onClick={() => deletePlace.mutate(p.id)}
                className="text-xs text-ink/40 hover:text-red-700"
              >
                Remove
              </button>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}
