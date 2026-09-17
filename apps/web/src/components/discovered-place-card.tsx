"use client";

import { useState } from "react";
import { useSavePlace } from "@/lib/discovery-hooks";
import type { DiscoveredPlaceDTO } from "@/lib/types";
import { AddToTrip } from "./add-to-trip";
import { Button } from "@/components/ui/primitives";
import { Check } from "@/components/ui/icons";

/** One gazetteer row: a discovered place with save / add-to-trip actions. */
export function DiscoveredPlaceCard({ place }: { place: DiscoveredPlaceDTO }) {
  const savePlace = useSavePlace();
  const [saved, setSaved] = useState(false);

  return (
    <li className="flex flex-wrap items-center justify-between gap-x-4 gap-y-2 py-3">
      <div className="min-w-0 flex-1">
        <p className="truncate font-medium">{place.name}</p>
        {place.category && (
          <p className="mt-0.5 font-mono text-[0.62rem] uppercase tracking-label text-ink/60">
            {place.category}
          </p>
        )}
      </div>
      <div className="flex shrink-0 flex-wrap items-center gap-2">
        <Button
          size="sm"
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
          disabled={saved || savePlace.isPending}
          className={saved ? "border-visited/60 text-ink/80" : undefined}
        >
          {saved ? (
            <>
              <Check size={12} className="text-visited" />
              Saved
            </>
          ) : savePlace.isPending ? (
            "Saving…"
          ) : (
            "Save"
          )}
        </Button>
        <AddToTrip place={place} />
      </div>
    </li>
  );
}
