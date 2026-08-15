"use client";

import Link from "next/link";
import { usePassport } from "@/lib/discovery-hooks";
import { PassportStamp } from "@/components/passport-stamp";

export default function PassportPage() {
  const { data: stamps, isLoading } = usePassport();

  return (
    <section className="space-y-8">
      <div>
        <p className="text-sm uppercase tracking-[0.25em] text-ink/40">
          Your passport
        </p>
        <h1 className="mt-1 text-4xl font-semibold tracking-tight">
          Everywhere you&apos;ve been
        </h1>
      </div>

      {isLoading && <p className="text-ink/60">Loading stamps…</p>}

      {stamps && stamps.length === 0 && (
        <div className="rounded-2xl border border-dashed border-ink/20 p-12 text-center">
          <p className="text-lg font-medium">No stamps yet</p>
          <p className="mt-1 text-sm text-ink/60">
            Mark a trip as completed to earn your first passport stamp.
          </p>
          <Link
            href="/trips"
            className="mt-4 inline-block rounded-full bg-ink px-5 py-2.5 text-sm font-medium text-parchment"
          >
            Go to your trips
          </Link>
        </div>
      )}

      {stamps && stamps.length > 0 && (
        <div className="flex flex-wrap gap-6">
          {stamps.map((stamp, i) => (
            <PassportStamp key={stamp.code} stamp={stamp} index={i} />
          ))}
        </div>
      )}
    </section>
  );
}
