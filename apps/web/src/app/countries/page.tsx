"use client";

import { useState } from "react";
import Link from "next/link";
import { useCountrySearch } from "@/lib/discovery-hooks";
import { Note, PageHeader } from "@/components/ui/primitives";
import { ArrowRight } from "@/components/ui/icons";
import { CountryMark } from "@/components/country-mark";

export default function CountriesPage() {
  const [query, setQuery] = useState("");
  const { data: countries, isFetching, isError } = useCountrySearch(query);
  const ready = query.trim().length >= 2;

  return (
    <section className="space-y-8">
      <PageHeader
        title="Explore"
        marginalia={
          ready && countries
            ? `${countries.length} ${countries.length === 1 ? "match" : "matches"} for “${query.trim()}”`
            : "Search the gazetteer — open a country to discover places and plan a trip"
        }
      />

      <label className="block">
        <span className="sr-only">Search countries</span>
        <input
          autoFocus
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search countries — try “Japan”"
          className="field font-display text-2xl font-medium tracking-[-0.01em] placeholder:font-sans placeholder:text-lg placeholder:font-normal sm:text-3xl"
        />
      </label>

      {!ready && query.length > 0 && <Note>Type at least two letters.</Note>}
      {isFetching && <Note>Searching…</Note>}
      {isError && (
        <Note tone="error">Country search is unavailable right now.</Note>
      )}
      {ready && countries && countries.length === 0 && !isFetching && (
        <Note>No countries match “{query}”.</Note>
      )}

      {countries && countries.length > 0 && (
        <ul className="grid grid-cols-1 border-t border-ink/15 sm:grid-cols-2 sm:gap-x-10">
          {countries.map((c) => (
            <li key={c.code} className="border-b border-ink/15">
              <Link
                href={`/countries/${c.code}`}
                className="group flex items-center gap-4 py-3.5 transition hover:text-brass-ink"
              >
                <CountryMark code={c.code} />
                <span className="min-w-0 flex-1">
                  <span className="block truncate font-medium">{c.name}</span>
                  <span className="mt-0.5 block font-mono text-[0.62rem] uppercase tracking-label text-ink/60">
                    {c.region}
                  </span>
                </span>
                <ArrowRight
                  size={14}
                  className="shrink-0 text-ink/50 transition group-hover:translate-x-0.5 group-hover:text-brass-ink"
                />
              </Link>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
