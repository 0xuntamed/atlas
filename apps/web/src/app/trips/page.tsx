"use client";

import Link from "next/link";
import { useDeleteTrip, useTrips } from "@/lib/hooks";
import type { TripDTO } from "@/lib/types";

function formatRange(trip: TripDTO): string {
  if (!trip.startDate) return "Dates not set";
  const start = new Date(trip.startDate).toLocaleDateString(undefined, {
    day: "numeric",
    month: "short",
  });
  if (!trip.endDate) return start;
  const end = new Date(trip.endDate).toLocaleDateString(undefined, {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
  return `${start} — ${end}`;
}

export default function TripsPage() {
  const { data: trips, isLoading, isError, error } = useTrips();
  const deleteTrip = useDeleteTrip();

  return (
    <section className="space-y-8">
      <div className="flex items-end justify-between">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight">My Trips</h1>
          <p className="text-sm text-ink/60">Everywhere you&apos;re going.</p>
        </div>
        <Link
          href="/trips/new"
          className="rounded-full bg-ink px-5 py-2.5 text-sm font-medium text-parchment"
        >
          New trip
        </Link>
      </div>

      {isLoading && <p className="text-ink/60">Loading trips…</p>}

      {isError && (
        <p className="text-red-700">
          Couldn&apos;t load trips: {(error as Error).message}
        </p>
      )}

      {trips && trips.length === 0 && (
        <div className="rounded-2xl border border-dashed border-ink/20 p-10 text-center">
          <p className="text-lg font-medium">No trips yet</p>
          <p className="mt-1 text-sm text-ink/60">
            Start with your first journey.
          </p>
          <Link
            href="/trips/new"
            className="mt-4 inline-block rounded-full bg-ink px-5 py-2.5 text-sm font-medium text-parchment"
          >
            Create a trip
          </Link>
        </div>
      )}

      <ul className="space-y-3">
        {trips?.map((trip) => (
          <li
            key={trip.id}
            className="flex items-center justify-between rounded-xl border border-ink/10 bg-white/40 px-5 py-4"
          >
            <Link href={`/trips/${trip.id}`} className="min-w-0 flex-1">
              <div className="flex items-baseline gap-3">
                <span className="truncate text-lg font-medium">
                  {trip.title}
                </span>
                <span className="text-xs uppercase tracking-wide text-ink/40">
                  {trip.countryCode}
                </span>
              </div>
              <div className="mt-0.5 flex items-center gap-2 text-sm text-ink/60">
                <span>{formatRange(trip)}</span>
                <span aria-hidden>·</span>
                <span>{trip.status.toLowerCase()}</span>
              </div>
            </Link>
            <button
              onClick={() => {
                if (confirm(`Delete "${trip.title}"?`))
                  deleteTrip.mutate(trip.id);
              }}
              className="ml-4 shrink-0 text-sm text-ink/50 hover:text-red-700"
            >
              Delete
            </button>
          </li>
        ))}
      </ul>
    </section>
  );
}
