"use client";

import { useState } from "react";
import Link from "next/link";
import { useAddDay, useAddPlace, useTrip, useTrips } from "@/lib/hooks";
import type { DiscoveredPlaceDTO } from "@/lib/types";
import { Button } from "@/components/ui/primitives";
import { Check } from "@/components/ui/icons";

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
        className="inline-flex items-center gap-1.5 font-mono text-[0.62rem] uppercase tracking-label text-brass-ink hover:underline"
      >
        <Check size={12} />
        Added · open trip
      </Link>
    );
  }

  if (!open) {
    return (
      <Button size="sm" onClick={() => setOpen(true)}>
        Add to trip
      </Button>
    );
  }

  return (
    <div className="flex flex-wrap items-end gap-3 border-l border-brass/60 pl-3">
      {!trips || trips.length === 0 ? (
        <p className="text-xs text-ink/60">
          No trips yet.{" "}
          <Link href="/trips/new" className="underline hover:text-brass-ink">
            Create one
          </Link>
        </p>
      ) : (
        <>
          <label className="block">
            <span className="sr-only">Trip</span>
            <select
              value={tripId}
              onChange={(e) => {
                setTripId(e.target.value);
                setDayId("");
              }}
              className="field w-40 py-1 text-xs"
            >
              <option value="">Choose trip…</option>
              {trips.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.title}
                </option>
              ))}
            </select>
          </label>

          {tripId && trip && trip.days.length > 0 && (
            <label className="block">
              <span className="sr-only">Day</span>
              <select
                value={dayId}
                onChange={(e) => setDayId(e.target.value)}
                className="field w-36 py-1 text-xs"
              >
                <option value="">First day (or pick)…</option>
                {trip.days.map((d, i) => (
                  <option key={d.id} value={d.id}>
                    {d.title ?? `Day ${i + 1}`}
                  </option>
                ))}
              </select>
            </label>
          )}

          <div className="flex gap-2">
            <Button
              size="sm"
              variant="primary"
              onClick={handleAdd}
              disabled={!tripId || busy}
            >
              {busy ? "Adding…" : "Add"}
            </Button>
            <Button size="sm" variant="ghost" onClick={() => setOpen(false)}>
              Cancel
            </Button>
          </div>
        </>
      )}
    </div>
  );
}
