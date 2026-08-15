"use client";

import { useState } from "react";
import Link from "next/link";
import { useAddDay, useAddPlace, useTrip, useTrips } from "@/lib/hooks";
import type { DiscoveredPlaceDTO } from "@/lib/types";

/**
 * Compact picker to drop a discovered place into an itinerary: choose a trip,
 * then a day (auto-creating "Day 1" if the trip has none), then add. Reuses the
 * same trip-place endpoint as manual entry — the external id is preserved.
 */
export function AddToTrip({ place }: { place: DiscoveredPlaceDTO }) {
  const [open, setOpen] = useState(false);
  const [tripId, setTripId] = useState("");
  const [dayId, setDayId] = useState("");
  const [done, setDone] = useState<string | null>(null);

  const { data: trips } = useTrips();
  const { data: trip } = useTrip(tripId);
  const addDay = useAddDay(tripId);
  const addPlace = useAddPlace(tripId);

  const busy = addDay.isPending || addPlace.isPending;

  async function handleAdd() {
    if (!tripId) return;
    let targetDay = dayId;
    if (!targetDay) {
      const created = await addDay.mutateAsync({ title: "Day 1" });
      targetDay = created.id;
    }
    await addPlace.mutateAsync({
      dayId: targetDay,
      input: {
        name: place.name,
        latitude: place.latitude,
        longitude: place.longitude,
        category: place.category,
        externalPlaceId: place.externalPlaceId,
      },
    });
    setDone(tripId);
    setOpen(false);
  }

  if (done) {
    return (
      <Link
        href={`/trips/${done}`}
        className="text-xs font-medium text-emerald-700 hover:underline"
      >
        Added ✓ view trip
      </Link>
    );
  }

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        className="rounded-full border border-ink/20 px-3 py-1 text-xs font-medium hover:bg-ink/5"
      >
        Add to trip
      </button>
    );
  }

  return (
    <div className="flex flex-col gap-2 rounded-lg border border-ink/15 bg-white/70 p-2">
      {!trips || trips.length === 0 ? (
        <p className="text-xs text-ink/60">
          No trips yet.{" "}
          <Link href="/trips/new" className="underline">
            Create one
          </Link>
        </p>
      ) : (
        <>
          <select
            value={tripId}
            onChange={(e) => {
              setTripId(e.target.value);
              setDayId("");
            }}
            className="rounded border border-ink/20 bg-white px-2 py-1 text-xs"
          >
            <option value="">Choose trip…</option>
            {trips.map((t) => (
              <option key={t.id} value={t.id}>
                {t.title}
              </option>
            ))}
          </select>

          {tripId && trip && trip.days.length > 0 && (
            <select
              value={dayId}
              onChange={(e) => setDayId(e.target.value)}
              className="rounded border border-ink/20 bg-white px-2 py-1 text-xs"
            >
              <option value="">First day (or pick)…</option>
              {trip.days.map((d, i) => (
                <option key={d.id} value={d.id}>
                  {d.title ?? `Day ${i + 1}`}
                </option>
              ))}
            </select>
          )}

          <div className="flex gap-2">
            <button
              onClick={handleAdd}
              disabled={!tripId || busy}
              className="rounded-full bg-ink px-3 py-1 text-xs font-medium text-parchment disabled:opacity-50"
            >
              {busy ? "Adding…" : "Add"}
            </button>
            <button
              onClick={() => setOpen(false)}
              className="rounded-full px-3 py-1 text-xs text-ink/60"
            >
              Cancel
            </button>
          </div>
        </>
      )}
    </div>
  );
}
