"use client";

import Link from "next/link";
import { useDeleteTrip, useTrips } from "@/lib/hooks";
import type { TripDTO } from "@/lib/types";
import {
  ButtonLink,
  EmptyState,
  Note,
  PageHeader,
} from "@/components/ui/primitives";
import { ArrowRight, Close } from "@/components/ui/icons";
import { TripStatusMark } from "@/components/trip/status-mark";

function formatRange(trip: TripDTO): string {
  if (!trip.startDate) return "Dates not set";
  const start = new Date(trip.startDate).toLocaleDateString(undefined, {
    day: "2-digit",
    month: "short",
  });
  if (!trip.endDate) return start;
  const end = new Date(trip.endDate).toLocaleDateString(undefined, {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
  return `${start} — ${end}`;
}

export default function TripsPage() {
  const { data: trips, isLoading, isError, error } = useTrips();
  const deleteTrip = useDeleteTrip();

  const completed = trips?.filter((t) => t.status === "COMPLETED").length ?? 0;

  return (
    <section className="space-y-8">
      <PageHeader
        corner="Sheet 01 · Trips"
        title="Trips"
        marginalia={
          trips
            ? `${trips.length} ${trips.length === 1 ? "journey" : "journeys"} · ${completed} completed`
            : "Everywhere you're going"
        }
        action={
          <ButtonLink href="/trips/new" variant="primary" cartouche>
            New trip
          </ButtonLink>
        }
      />

      {isLoading && <Note>Opening the log…</Note>}

      {isError && (
        <Note tone="error">
          Couldn&apos;t load trips: {(error as Error).message}
        </Note>
      )}

      {trips && trips.length === 0 && (
        <EmptyState
          title="The log is blank"
          body="Every journey starts as a line in this book. Write the first one."
          action={
            <ButtonLink href="/trips/new" variant="primary" cartouche>
              Create a trip
            </ButtonLink>
          }
        />
      )}

      {trips && trips.length > 0 && (
        <ol className="border-t border-ink/15">
          {trips.map((trip) => (
            <li
              key={trip.id}
              className="group grid grid-cols-[1fr_auto] items-center gap-x-4 border-b border-ink/15 sm:grid-cols-[9rem_1fr_auto]"
            >
              <div className="hidden py-4 font-mono text-[0.68rem] uppercase tracking-label text-ink/70 sm:block">
                {trip.countryCode}
                <span className="mt-1 block normal-case tracking-normal text-ink/60">
                  {formatRange(trip)}
                </span>
              </div>
              <Link
                href={`/trips/${trip.id}`}
                className="flex min-w-0 items-center gap-3 py-4 transition hover:text-brass-ink"
              >
                <TripStatusMark status={trip.status} />
                <span className="min-w-0">
                  <span className="block truncate text-lg font-medium leading-tight">
                    {trip.title}
                  </span>
                  <span className="mt-0.5 block font-mono text-[0.62rem] uppercase tracking-label text-ink/60 sm:hidden">
                    {trip.countryCode} · {formatRange(trip)}
                  </span>
                </span>
                <ArrowRight
                  size={14}
                  className="ml-auto shrink-0 text-ink/50 transition group-hover:translate-x-0.5 group-hover:text-brass-ink"
                />
              </Link>
              <button
                onClick={() => {
                  if (confirm(`Delete "${trip.title}"?`))
                    deleteTrip.mutate(trip.id);
                }}
                aria-label={`Delete ${trip.title}`}
                title="Delete trip"
                className="p-2 text-ink/50 transition hover:text-[#9b2c2c]"
              >
                <Close size={14} />
              </button>
            </li>
          ))}
        </ol>
      )}
    </section>
  );
}
