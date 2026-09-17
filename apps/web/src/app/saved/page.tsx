"use client";

import Link from "next/link";
import { useDeleteSavedPlace, useSavedPlaces } from "@/lib/discovery-hooks";
import {
  ButtonLink,
  EmptyState,
  Note,
  PageHeader,
} from "@/components/ui/primitives";
import { Close } from "@/components/ui/icons";

export default function SavedPage() {
  const { data: places, isLoading, isError } = useSavedPlaces();
  const deletePlace = useDeleteSavedPlace();

  const countries = places
    ? new Set(places.map((p) => p.countryCode).filter(Boolean)).size
    : 0;

  return (
    <section className="space-y-8">
      <PageHeader
        title="Saved places"
        marginalia={
          places && places.length > 0
            ? `${places.length} ${places.length === 1 ? "place" : "places"} · ${countries} ${countries === 1 ? "country" : "countries"}`
            : "Places you mean to see"
        }
      />

      {isLoading && <Note>Gathering your places…</Note>}
      {isError && <Note tone="error">Couldn&apos;t load saved places.</Note>}

      {places && places.length === 0 && (
        <EmptyState
          title="Nothing saved yet"
          body="Open a country in Explore and save the places you want to reach — they collect here until they make it into a trip."
          action={
            <ButtonLink href="/countries" variant="primary" cartouche>
              Explore countries
            </ButtonLink>
          }
        />
      )}

      {places && places.length > 0 && (
        <ul className="border-t border-ink/15">
          {places.map((p) => (
            <li
              key={p.id}
              className="grid grid-cols-[1fr_auto] items-center gap-x-4 border-b border-ink/15 py-3.5 sm:grid-cols-[6rem_1fr_auto]"
            >
              <span className="hidden font-mono text-[0.68rem] uppercase tracking-label text-ink/70 sm:block">
                {p.countryCode ?? "—"}
              </span>
              <div className="min-w-0">
                <p className="truncate font-medium">{p.name}</p>
                <p className="mt-0.5 font-mono text-[0.62rem] uppercase tracking-label text-ink/60">
                  <span className="sm:hidden">{p.countryCode ?? "—"}</span>
                  {p.countryCode && p.category && (
                    <span className="sm:hidden"> · </span>
                  )}
                  {p.category}
                </p>
              </div>
              <div className="flex shrink-0 items-center gap-3">
                {p.countryCode && (
                  <Link
                    href={`/countries/${p.countryCode}`}
                    className="font-mono text-[0.62rem] uppercase tracking-label text-ink/70 transition hover:text-brass-ink"
                  >
                    Country
                  </Link>
                )}
                <button
                  onClick={() => deletePlace.mutate(p.id)}
                  aria-label={`Remove ${p.name}`}
                  title="Remove"
                  className="p-1.5 text-ink/50 transition hover:text-[#9b2c2c]"
                >
                  <Close size={13} />
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
