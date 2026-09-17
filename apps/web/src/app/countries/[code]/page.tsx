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
import { TripStatusMark } from "@/components/trip/status-mark";
import {
  ButtonLink,
  Note,
  Plate,
  Section,
} from "@/components/ui/primitives";
import { ArrowLeft, ArrowRight } from "@/components/ui/icons";
import { CountryMark } from "@/components/country-mark";
import { formatCoordinates } from "@/lib/geo";

export default function CountryPage() {
  const params = useParams<{ code: string }>();
  const code = params.code?.toUpperCase();

  const { data: country, isLoading, isError } = useCountry(code);
  const weather = useWeather(code);
  const discover = useDiscoverPlaces({ country: code });
  const { data: saved } = useSavedPlaces(code);
  const { data: trips } = useTrips();

  if (isLoading) return <Note>Finding it on the chart…</Note>;
  if (isError || !country)
    return (
      <Note tone="error">
        Couldn&apos;t load this country.{" "}
        <Link href="/countries" className="underline">
          Back to Explore
        </Link>
      </Note>
    );

  const tripsHere = trips?.filter((t) => t.countryCode === code) ?? [];
  const facts = [
    country.capital,
    country.subregion ?? country.region,
    weather.data &&
      `${Math.round(weather.data.temperatureC ?? 0)}°C ${weather.data.description}`,
  ].filter(Boolean);

  return (
    <section className="space-y-10">
      {/* Header: the country's cartouche */}
      <header className="space-y-3">
        <div className="flex items-center justify-between gap-4">
          <Link
            href="/countries"
            className="inline-flex items-center gap-1.5 font-mono text-[0.68rem] uppercase tracking-label text-ink/70 transition hover:text-brass-ink"
          >
            <ArrowLeft size={14} />
            Explore
          </Link>
          {country.latitude != null && country.longitude != null && (
            <span className="font-mono text-[0.62rem] tabular-nums tracking-[0.12em] text-ink/60">
              {formatCoordinates(country.latitude, country.longitude)}
            </span>
          )}
        </div>
        <div className="flex flex-wrap items-end justify-between gap-x-6 gap-y-4 border-b border-brass/60 pb-5">
          <div className="flex min-w-0 items-center gap-5">
            <CountryMark code={country.code} size="lg" />
            <div className="min-w-0">
              <h1 className="font-display text-[clamp(1.85rem,4vw,2.5rem)] font-semibold leading-[1.1] tracking-[0.025em] text-ink [text-wrap:balance]">
                {country.name}
              </h1>
              {country.nativeName && country.nativeName !== country.name && (
                <p className="mt-1 text-lg text-ink/70">{country.nativeName}</p>
              )}
              {facts.length > 0 && (
                <p className="mt-2 font-mono text-[0.68rem] uppercase tracking-label text-ink/70">
                  {facts.join(" · ")}
                </p>
              )}
            </div>
          </div>
          <ButtonLink
            href={`/trips/new?country=${country.code}&title=${encodeURIComponent(country.name)}`}
            variant="primary"
            cartouche
          >
            Plan a trip
          </ButtonLink>
        </div>
      </header>

      {tripsHere.length > 0 && (
        <Section heading="Your trips here" aside={tripsHere.length}>
          <ul className="divide-y divide-ink/10">
            {tripsHere.map((t) => (
              <li key={t.id}>
                <Link
                  href={`/trips/${t.id}`}
                  className="group flex items-center gap-3 py-3 transition hover:text-brass-ink"
                >
                  <TripStatusMark status={t.status} />
                  <span className="min-w-0 flex-1 truncate font-medium">
                    {t.title}
                  </span>
                  <ArrowRight
                    size={14}
                    className="shrink-0 text-ink/50 transition group-hover:translate-x-0.5 group-hover:text-brass-ink"
                  />
                </Link>
              </li>
            ))}
          </ul>
        </Section>
      )}

      {saved && saved.length > 0 && (
        <Section heading="Saved here" aside={saved.length}>
          <ul className="divide-y divide-ink/10">
            {saved.map((p) => (
              <li key={p.id} className="flex items-baseline gap-3 py-3">
                <span className="font-medium">{p.name}</span>
                {p.category && (
                  <span className="font-mono text-[0.62rem] uppercase tracking-label text-ink/60">
                    {p.category}
                  </span>
                )}
              </li>
            ))}
          </ul>
        </Section>
      )}

      <Section
        heading="Places to discover"
        aside={discover.data ? `${discover.data.length} found` : undefined}
      >
        {discover.isFetching && <Note>Finding places…</Note>}
        {discover.isError && (
          <Plate dashed className="text-center">
            <Note>
              Discovery is unavailable right now — the rest of ATLAS still works.
            </Note>
          </Plate>
        )}
        {discover.data && discover.data.length === 0 && (
          <Note>No places found for this country yet.</Note>
        )}

        {discover.data && discover.data.length > 0 && (
          <ul className="divide-y divide-ink/10">
            {discover.data.map((place) => (
              <DiscoveredPlaceCard key={place.externalPlaceId} place={place} />
            ))}
          </ul>
        )}
      </Section>
    </section>
  );
}
