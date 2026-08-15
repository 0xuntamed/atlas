"use client";

import { useState } from "react";
import { useSavePlace } from "@/lib/discovery-hooks";
import type { DiscoveredPlaceDTO } from "@/lib/types";
import { AddToTrip } from "./add-to-trip";

export function DiscoveredPlaceCard({ place }: { place: DiscoveredPlaceDTO }) {
  const savePlace = useSavePlace();
  const [saved, setSaved] = useState(false);

  return (
    <li className="flex items-center justify-between gap-3 rounded-xl border border-ink/10 bg-white/40 px-4 py-3">
      <div className="min-w-0">
        <p className="truncate font-medium">{place.name}</p>
        {place.category && (
          <p className="text-xs uppercase tracking-wide text-ink/50">
            {place.category}
          </p>
        )}
      </div>
      <div className="flex shrink-0 items-center gap-2">
        <button
          onClick={() =>
            savePlace.mutate(
              {
                externalPlaceId: place.externalPlaceId,
                name: place.name,
                countryCode: place.countryCode,
                latitude: place.latitude,
                longitude: place.longitude,
                category: place.category,
              },
              { onSuccess: () => setSaved(true) },
            )
          }
          disabled={saved}
          className="rounded-full border border-ink/20 px-3 py-1 text-xs font-medium hover:bg-ink/5 disabled:opacity-60"
        >
          {saved ? "Saved ✓" : "Save"}
        </button>
        <AddToTrip place={place} />
      </div>
    </li>
  );
}
