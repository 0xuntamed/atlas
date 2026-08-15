"use client";

import {
  useParams,
  usePathname,
  useRouter,
  useSearchParams,
} from "next/navigation";
import Link from "next/link";
import { Suspense, useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import {
  AnimatePresence,
  Reorder,
  motion,
  useDragControls,
} from "framer-motion";
import {
  useAddDay,
  useAddPlace,
  useDeleteDay,
  useDeletePlace,
  useTrip,
  useUpdatePlace,
  useUpdateTrip,
} from "@/lib/hooks";
import { useCountry } from "@/lib/discovery-hooks";
import type {
  TripDayWithPlaces,
  TripPlaceDTO,
  TripWithItinerary,
} from "@/lib/types";
import { pointsToArcs, tripToPoints } from "@/lib/geo";
import { PassportStamp } from "@/components/passport-stamp";

const TripGlobe = dynamic(() => import("@/components/globe/trip-globe"), {
  ssr: false,
  loading: () => (
    <div className="flex h-full items-center justify-center text-parchment/60">
      Loading map…
    </div>
  ),
});

export default function TripDetailPage() {
  return (
    <Suspense fallback={null}>
      <TripDetail />
    </Suspense>
  );
}

function TripDetail() {
  const params = useParams<{ id: string }>();
  const tripId = params.id;
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const view = searchParams.get("view") === "map" ? "map" : "journey";

  const { data: trip, isLoading, isError, error } = useTrip(tripId);
  const addDay = useAddDay(tripId);
  const updateTrip = useUpdateTrip(tripId);
  const country = useCountry(trip?.countryCode ?? "");
  const [celebrate, setCelebrate] = useState(false);

  const setView = (next: "journey" | "map") =>
    router.replace(next === "map" ? `${pathname}?view=map` : pathname, {
      scroll: false,
    });

  const complete = () =>
    updateTrip.mutate(
      { status: "COMPLETED" },
      { onSuccess: () => setCelebrate(true) },
    );

  if (isLoading) return <p className="text-ink/60">Loading trip…</p>;
  if (isError)
    return (
      <p className="text-red-700">
        {(error as Error).message}{" "}
        <Link href="/trips" className="underline">
          Back to trips
        </Link>
      </p>
    );
  if (!trip) return null;

  const isCompleted = trip.status === "COMPLETED";

  return (
    <section className="space-y-8">
      <div>
        <Link href="/trips" className="text-sm text-ink/50 hover:underline">
          ← All trips
        </Link>
        <div className="mt-2 flex items-start justify-between gap-4">
          <div>
            <h1 className="text-4xl font-semibold tracking-tight">
              {trip.title}
            </h1>
            <p className="mt-1 text-sm text-ink/60">
              {trip.countryCode} · {trip.status.toLowerCase()}
            </p>
          </div>
          {isCompleted ? (
            <span className="shrink-0 rounded-full bg-emerald-800/10 px-3 py-1.5 text-sm font-medium text-emerald-800">
              ✓ Completed
            </span>
          ) : (
            <button
              onClick={complete}
              disabled={updateTrip.isPending}
              className="shrink-0 rounded-full border border-ink/20 px-4 py-2 text-sm font-medium hover:bg-ink/5 disabled:opacity-50"
            >
              {updateTrip.isPending ? "Completing…" : "Mark completed"}
            </button>
          )}
        </div>
      </div>

      <div className="flex items-center justify-between">
        <ViewToggle view={view} onChange={setView} />
        {view === "journey" && (
          <button
            onClick={() =>
              addDay.mutate({ title: `Day ${(trip.days.length ?? 0) + 1}` })
            }
            disabled={addDay.isPending}
            className="rounded-full border border-ink/20 px-4 py-2 text-sm font-medium disabled:opacity-50"
          >
            + Add day
          </button>
        )}
      </div>

      {view === "map" ? (
        <TripMapView trip={trip} />
      ) : trip.days.length === 0 ? (
        <p className="rounded-xl border border-dashed border-ink/20 p-8 text-center text-ink/60">
          No days yet. Add your first day to start building the itinerary.
        </p>
      ) : (
        <ol className="space-y-6">
          {trip.days.map((day, i) => (
            <DayCard key={day.id} tripId={tripId} day={day} index={i} />
          ))}
        </ol>
      )}

      <AnimatePresence>
        {celebrate && (
          <CompletionOverlay
            stamp={{
              code: trip.countryCode,
              name: country.data?.name ?? trip.countryCode,
              flag: country.data?.flag,
              firstVisitedAt: new Date().toISOString(),
              visitCount: 1,
            }}
            onClose={() => setCelebrate(false)}
          />
        )}
      </AnimatePresence>
    </section>
  );
}

function CompletionOverlay({
  stamp,
  onClose,
}: {
  stamp: React.ComponentProps<typeof PassportStamp>["stamp"];
  onClose: () => void;
}) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
      className="fixed inset-0 z-50 flex flex-col items-center justify-center gap-6 bg-black/60 backdrop-blur-sm"
    >
      <motion.p
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="text-sm uppercase tracking-[0.3em] text-parchment/80"
      >
        Trip completed
      </motion.p>
      <div className="rounded-3xl bg-parchment p-8 shadow-2xl">
        <PassportStamp stamp={stamp} size="lg" />
      </div>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.9 }}
        className="flex gap-3"
      >
        <Link
          href="/passport"
          className="rounded-full bg-parchment px-5 py-2 text-sm font-medium text-ink"
        >
          View passport
        </Link>
        <button
          onClick={onClose}
          className="rounded-full border border-parchment/40 px-5 py-2 text-sm font-medium text-parchment"
        >
          Close
        </button>
      </motion.div>
    </motion.div>
  );
}

function ViewToggle({
  view,
  onChange,
}: {
  view: "journey" | "map";
  onChange: (v: "journey" | "map") => void;
}) {
  return (
    <div className="inline-flex rounded-full border border-ink/15 bg-white/50 p-0.5 text-sm">
      {(["journey", "map"] as const).map((v) => (
        <button
          key={v}
          onClick={() => onChange(v)}
          className={
            "rounded-full px-4 py-1.5 font-medium capitalize transition " +
            (view === v ? "bg-ink text-parchment" : "text-ink/60")
          }
        >
          {v}
        </button>
      ))}
    </div>
  );
}

function TripMapView({ trip }: { trip: TripWithItinerary }) {
  // Derived straight from the trip — the map keeps no separate copy.
  const points = tripToPoints(trip);
  const arcs = pointsToArcs(points);
  const totalPlaces = trip.days.reduce((n, d) => n + d.places.length, 0);
  const skipped = totalPlaces - points.length;

  if (points.length === 0) {
    return (
      <p className="rounded-xl border border-dashed border-ink/20 p-8 text-center text-ink/60">
        No mapped places yet. Add places with a location — e.g. from{" "}
        <Link href="/countries" className="underline">
          Explore
        </Link>{" "}
        — to see your route on the globe.
      </p>
    );
  }

  return (
    <div className="space-y-2">
      <div className="relative h-[62vh] w-full overflow-hidden rounded-3xl bg-[#0a0e13]">
        <TripGlobe points={points} arcs={arcs} />
      </div>
      <p className="text-xs text-ink/50">
        {points.length} places · {arcs.length} legs
        {skipped > 0 && ` · ${skipped} without a location not shown`}
      </p>
    </div>
  );
}

function DayCard({
  tripId,
  day,
  index,
}: {
  tripId: string;
  day: TripDayWithPlaces;
  index: number;
}) {
  const deleteDay = useDeleteDay(tripId);
  const addPlace = useAddPlace(tripId);
  const updatePlace = useUpdatePlace(tripId);
  const [name, setName] = useState("");

  // Local order for drag-and-drop; re-synced whenever the server data changes.
  const [ordered, setOrdered] = useState(day.places);
  const orderedRef = useRef(day.places);
  useEffect(() => {
    setOrdered(day.places);
    orderedRef.current = day.places;
  }, [day.places]);

  const handleReorder = (list: TripPlaceDTO[]) => {
    setOrdered(list);
    orderedRef.current = list;
  };

  // Persist only the places whose position actually changed.
  const persistOrder = () => {
    orderedRef.current.forEach((p, i) => {
      const original = day.places.find((x) => x.id === p.id);
      if (original && original.position !== i) {
        updatePlace.mutate({ placeId: p.id, input: { position: i } });
      }
    });
  };

  const label =
    day.title ??
    (day.date
      ? new Date(day.date).toLocaleDateString(undefined, {
          weekday: "long",
          day: "numeric",
          month: "short",
        })
      : `Day ${String(index + 1).padStart(2, "0")}`);

  const submitPlace = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    addPlace.mutate(
      { dayId: day.id, input: { name: name.trim() } },
      { onSuccess: () => setName("") },
    );
  };

  return (
    <li className="rounded-2xl border border-ink/10 bg-white/40 p-5">
      <div className="flex items-center justify-between">
        <h3 className="text-xs font-semibold uppercase tracking-[0.15em] text-ink/50">
          {label}
        </h3>
        <button
          onClick={() => {
            if (confirm("Delete this day and its places?"))
              deleteDay.mutate(day.id);
          }}
          className="text-xs text-ink/40 hover:text-red-700"
        >
          Remove day
        </button>
      </div>

      {ordered.length > 0 ? (
        <Reorder.Group
          axis="y"
          values={ordered}
          onReorder={handleReorder}
          as="ul"
          className="mt-3 space-y-2"
        >
          {ordered.map((place) => (
            <PlaceItem
              key={place.id}
              tripId={tripId}
              place={place}
              onDragEnd={persistOrder}
            />
          ))}
        </Reorder.Group>
      ) : (
        <p className="mt-3 text-sm text-ink/40">No places yet.</p>
      )}

      <form onSubmit={submitPlace} className="mt-3 flex gap-2">
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Add a place (e.g. Tokyo)"
          className="flex-1 rounded-lg border border-ink/15 bg-white/60 px-3 py-2 text-sm"
        />
        <button
          type="submit"
          disabled={addPlace.isPending}
          className="rounded-lg bg-ink px-4 py-2 text-sm font-medium text-parchment disabled:opacity-50"
        >
          Add
        </button>
      </form>
    </li>
  );
}

function PlaceItem({
  tripId,
  place,
  onDragEnd,
}: {
  tripId: string;
  place: TripPlaceDTO;
  onDragEnd: () => void;
}) {
  const controls = useDragControls();
  const updatePlace = useUpdatePlace(tripId);
  const deletePlace = useDeletePlace(tripId);
  const [editing, setEditing] = useState(false);
  const [value, setValue] = useState(place.name);

  const save = () => {
    const next = value.trim();
    if (next && next !== place.name) {
      updatePlace.mutate({ placeId: place.id, input: { name: next } });
    }
    setEditing(false);
  };

  return (
    <Reorder.Item
      value={place}
      dragListener={false}
      dragControls={controls}
      onDragEnd={onDragEnd}
      as="li"
      className="flex items-center gap-2 rounded-lg bg-parchment/60 px-3 py-2"
    >
      <span
        onPointerDown={(e) => controls.start(e)}
        title="Drag to reorder"
        className="cursor-grab select-none px-1 text-ink/30 hover:text-ink/60"
      >
        ⠿
      </span>
      {editing ? (
        <input
          autoFocus
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onBlur={save}
          onKeyDown={(e) => {
            if (e.key === "Enter") save();
            if (e.key === "Escape") {
              setValue(place.name);
              setEditing(false);
            }
          }}
          className="flex-1 rounded border border-ink/20 bg-white px-2 py-1 text-sm"
        />
      ) : (
        <button
          onClick={() => setEditing(true)}
          className="flex-1 text-left text-sm"
        >
          {place.name}
        </button>
      )}
      <button
        onClick={() => deletePlace.mutate(place.id)}
        className="text-xs text-ink/40 hover:text-red-700"
      >
        ✕
      </button>
    </Reorder.Item>
  );
}
