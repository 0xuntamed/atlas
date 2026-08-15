"use client";

import { useParams } from "next/navigation";
import Link from "next/link";
import { useTrips } from "@/lib/hooks";
import {
  useCountry,
  useDiscoverPlaces,
  useSavedPlaces,
  useWeather,
} from "@/lib/discovery-hooks";
import { DiscoveredPlaceCard } from "@/components/discovered-place-card";

export default function CountryPage() {
  const params = useParams<{ code: string }>();
  const code = params.code?.toUpperCase();

  const { data: country, isLoading, isError } = useCountry(code);
  const weather = useWeather(code);
  const discover = useDiscoverPlaces({ country: code });
  const { data: saved } = useSavedPlaces(code);
  const { data: trips } = useTrips();

  if (isLoading) return <p className="text-ink/60">Loading country…</p>;
  if (isError || !country)
    return (
      <p className="text-red-700">
        Couldn&apos;t load this country.{" "}
        <Link href="/countries" className="underline">
          Back to explore
        </Link>
      </p>
    );

  const tripsHere = trips?.filter((t) => t.countryCode === code) ?? [];

  return (
    <section className="space-y-10">
      {/* Header */}
      <div className="space-y-3">
        <Link href="/countries" className="text-sm text-ink/50 hover:underline">
          ← Explore
        </Link>
        <div className="flex items-center gap-4">
          <span className="text-5xl">{country.flag}</span>
          <div>
            <h1 className="text-4xl font-semibold tracking-tight">
              {country.name}
            </h1>
            {country.nativeName && country.nativeName !== country.name && (
              <p className="text-lg text-ink/60">{country.nativeName}</p>
            )}
          </div>
        </div>
        <p className="text-sm text-ink/60">
          {[country.capital, country.subregion ?? country.region]
            .filter(Boolean)
            .join(" · ")}
          {weather.data &&
            ` · ${Math.round(weather.data.temperatureC ?? 0)}°C ${weather.data.description}`}
        </p>
        <Link
          href={`/trips/new?country=${country.code}&title=${encodeURIComponent(country.name)}`}
          className="inline-block rounded-full bg-ink px-5 py-2.5 text-sm font-medium text-parchment"
        >
          Plan a trip
        </Link>
      </div>

      {/* Trips here */}
      {tripsHere.length > 0 && (
        <div className="space-y-3">
          <h2 className="text-xl font-medium">Your trips here</h2>
          <ul className="space-y-2">
            {tripsHere.map((t) => (
              <li key={t.id}>
                <Link
                  href={`/trips/${t.id}`}
                  className="flex items-center justify-between rounded-xl border border-ink/10 bg-white/40 px-4 py-3 hover:bg-white/70"
                >
                  <span className="font-medium">{t.title}</span>
                  <span className="text-xs text-ink/50">
                    {t.status.toLowerCase()}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Saved here */}
      {saved && saved.length > 0 && (
        <div className="space-y-3">
          <h2 className="text-xl font-medium">Saved places here</h2>
          <ul className="space-y-2">
            {saved.map((p) => (
              <li
                key={p.id}
                className="rounded-xl border border-ink/10 bg-white/40 px-4 py-3"
              >
                <span className="font-medium">{p.name}</span>
                {p.category && (
                  <span className="ml-2 text-xs uppercase tracking-wide text-ink/50">
                    {p.category}
                  </span>
                )}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Discover */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-medium">Places to discover</h2>
          {discover.data && (
            <span className="text-xs text-ink/40">
              {discover.data.length} found
            </span>
          )}
        </div>

        {discover.isFetching && <p className="text-ink/60">Finding places…</p>}
        {discover.isError && (
          <p className="rounded-xl border border-dashed border-ink/20 p-6 text-center text-ink/60">
            Discovery is unavailable right now — the rest of ATLAS still works.
          </p>
        )}
        {discover.data && discover.data.length === 0 && (
          <p className="text-ink/60">No places found for this country yet.</p>
        )}

        <ul className="space-y-2">
          {discover.data?.map((place) => (
            <DiscoveredPlaceCard key={place.externalPlaceId} place={place} />
          ))}
        </ul>
      </div>
    </section>
  );
}
