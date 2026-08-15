"use client";

import { useState } from "react";
import Link from "next/link";
import { useCountrySearch } from "@/lib/discovery-hooks";

export default function CountriesPage() {
  const [query, setQuery] = useState("");
  const { data: countries, isFetching, isError } = useCountrySearch(query);

  return (
    <section className="space-y-8">
      <div>
        <h1 className="text-3xl font-semibold tracking-tight">Explore</h1>
        <p className="text-sm text-ink/60">
          Search the world — open a country to discover places and plan a trip.
        </p>
      </div>

      <input
        autoFocus
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search countries — try “Japan”"
        className="w-full rounded-xl border border-ink/15 bg-white/60 px-4 py-3 text-lg"
      />

      {query.trim().length < 2 && (
        <p className="text-sm text-ink/50">Type at least two letters.</p>
      )}

      {isFetching && <p className="text-ink/60">Searching…</p>}
      {isError && (
        <p className="text-red-700">Country search is unavailable right now.</p>
      )}

      {countries && countries.length === 0 && query.trim().length >= 2 && (
        <p className="text-ink/60">No countries match “{query}”.</p>
      )}

      <ul className="grid grid-cols-1 gap-2 sm:grid-cols-2">
        {countries?.map((c) => (
          <li key={c.code}>
            <Link
              href={`/countries/${c.code}`}
              className="flex items-center gap-3 rounded-xl border border-ink/10 bg-white/40 px-4 py-3 hover:bg-white/70"
            >
              <span className="text-2xl">{c.flag}</span>
              <span className="min-w-0">
                <span className="block truncate font-medium">{c.name}</span>
                <span className="block text-xs text-ink/50">{c.region}</span>
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
