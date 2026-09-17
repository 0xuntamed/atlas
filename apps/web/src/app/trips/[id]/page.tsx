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
import clsx from "clsx";
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
import { formatCoordinates, pointsToArcs, tripToPoints } from "@/lib/geo";
import { PassportStamp } from "@/components/passport-stamp";
import { ExpensesPanel } from "@/components/trip/expenses-panel";
import { TripStatusMark, TRIP_STATUS_LABEL } from "@/components/trip/status-mark";
import {
  Button,
  ButtonLink,
  EmptyState,
  Note,
  PageHeader,
  Plate,
} from "@/components/ui/primitives";
import { Check, Close, Grip, Plus } from "@/components/ui/icons";

type TripView = "journey" | "map" | "expenses";
const TRIP_VIEWS: { key: TripView; label: string }[] = [
  { key: "journey", label: "Journey" },
  { key: "map", label: "Map" },
  { key: "expenses", label: "Ledger" },
];

const TripGlobe = dynamic(() => import("@/components/globe/trip-globe"), {
  ssr: false,
  loading: () => (
    <div className="flex h-full items-center justify-center font-mono text-[0.68rem] uppercase tracking-label text-parchment/60">
      Plotting the route…
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

function formatRange(start: string | null, end: string | null) {
  if (!start) return null;
  const s = new Date(start).toLocaleDateString(undefined, {
    day: "2-digit",
    month: "short",
  });
  if (!end) return s;
  const e = new Date(end).toLocaleDateString(undefined, {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
  return `${s} — ${e}`;
}

function TripDetail() {
  const params = useParams<{ id: string }>();
  const tripId = params.id;
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const viewParam = searchParams.get("view");
  const view: TripView =
    viewParam === "map" || viewParam === "expenses" ? viewParam : "journey";

  const { data: trip, isLoading, isError, error } = useTrip(tripId);
  const addDay = useAddDay(tripId);
  const updateTrip = useUpdateTrip(tripId);
  const country = useCountry(trip?.countryCode ?? "");
  const [celebrate, setCelebrate] = useState(false);

  const setView = (next: TripView) =>
    router.replace(next === "journey" ? pathname : `${pathname}?view=${next}`, {
      scroll: false,
    });

  const complete = () =>
    updateTrip.mutate(
      { status: "COMPLETED" },
      { onSuccess: () => setCelebrate(true) },
    );

  if (isLoading) return <Note>Opening the log…</Note>;
  if (isError)
    return (
      <Note tone="error">
        {(error as Error).message}{" "}
        <Link href="/trips" className="underline">
          Back to trips
        </Link>
      </Note>
    );
  if (!trip) return null;

  const isCompleted = trip.status === "COMPLETED";
  const range = formatRange(trip.startDate, trip.endDate);
  const placeCount = trip.days.reduce((n, d) => n + d.places.length, 0);

  return (
    <section className="space-y-8">
      <PageHeader
        back={{ href: "/trips", label: "All trips" }}
        corner={
          country.data?.latitude != null && country.data?.longitude != null
            ? formatCoordinates(country.data.latitude, country.data.longitude)
            : undefined
        }
        title={trip.title}
        marginalia={
          <>
            {country.data?.name ?? trip.countryCode}
            {" · "}
            {TRIP_STATUS_LABEL[trip.status]}
            {range && ` · ${range}`}
          </>
        }
        action={
          isCompleted ? (
            <span className="inline-flex items-center gap-2 border border-visited/50 px-3 py-2 font-mono text-[0.68rem] uppercase tracking-label text-ink/80">
              <Check size={14} className="text-visited" />
              Completed
            </span>
          ) : (
            <Button
              variant="primary"
              cartouche
              onClick={complete}
              disabled={updateTrip.isPending}
            >
              {updateTrip.isPending ? "Stamping…" : "Mark completed"}
            </Button>
          )
        }
      />

      <div className="flex flex-wrap items-center justify-between gap-4">
        <ViewTabs view={view} onChange={setView} />
        {view === "journey" && (
          <div className="flex items-center gap-4">
            {trip.days.length > 0 && (
              <span className="hidden font-mono text-[0.62rem] uppercase tracking-label text-ink/60 sm:block">
                {trip.days.length} {trip.days.length === 1 ? "day" : "days"} ·{" "}
                {placeCount} {placeCount === 1 ? "place" : "places"}
              </span>
            )}
            <Button
              size="sm"
              onClick={() =>
                addDay.mutate({ title: `Day ${(trip.days.length ?? 0) + 1}` })
              }
              disabled={addDay.isPending}
            >
              <Plus size={12} />
              Add day
            </Button>
          </div>
        )}
      </div>

      {view === "map" ? (
        <TripMapView trip={trip} />
      ) : view === "expenses" ? (
        <ExpensesPanel tripId={tripId} />
      ) : trip.days.length === 0 ? (
        <EmptyState
          title="No days written yet"
          body="Add your first day to start laying out the itinerary — places, notes, the order you'll take them."
          action={
            <Button
              variant="primary"
              cartouche
              onClick={() => addDay.mutate({ title: "Day 1" })}
              disabled={addDay.isPending}
            >
              Add day one
            </Button>
          }
        />
      ) : (
        <ol className="border-t border-ink/15">
          {trip.days.map((day, i) => (
            <DayEntry key={day.id} tripId={tripId} day={day} index={i} />
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
      className="fixed inset-0 z-50 flex flex-col items-center justify-center gap-6 bg-chart/80 backdrop-blur-sm"
    >
      <motion.p
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="font-mono text-[0.72rem] uppercase tracking-[0.3em] text-brass-bright"
      >
        Trip completed · stamped
      </motion.p>
      <div className="relative bg-parchment p-8 shadow-[0_24px_60px_-20px_rgba(0,0,0,0.6)]">
        <PassportStamp stamp={stamp} size="lg" />
      </div>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.9 }}
        className="flex gap-3"
      >
        <ButtonLink
          href="/passport"
          className="bg-brass-bright text-chart hover:bg-brass-light"
        >
          Open passport
        </ButtonLink>
        <Button
          onClick={onClose}
          className="border-parchment/40 text-parchment hover:border-parchment hover:text-parchment"
        >
          Close
        </Button>
      </motion.div>
    </motion.div>
  );
}

function ViewTabs({
  view,
  onChange,
}: {
  view: TripView;
  onChange: (v: TripView) => void;
}) {
  return (
    <div role="tablist" className="flex gap-1 border-b border-ink/15">
      {TRIP_VIEWS.map((v) => {
        const active = view === v.key;
        return (
          <button
            key={v.key}
            role="tab"
            aria-selected={active}
            onClick={() => onChange(v.key)}
            className={clsx(
              "relative -mb-px px-3 py-2 font-mono text-[0.68rem] font-medium uppercase tracking-label transition",
              active ? "text-brass-ink" : "text-ink/70 hover:text-ink",
            )}
          >
            {v.label}
            <span
              aria-hidden
              className={clsx(
                "absolute inset-x-3 bottom-0 h-px bg-brass-ink transition-opacity",
                active ? "opacity-100" : "opacity-0",
              )}
            />
          </button>
        );
      })}
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
      <EmptyState
        title="Nothing to plot yet"
        body={
          <>
            Add places with a location — for example from{" "}
            <Link href="/countries" className="underline hover:text-brass-ink">
              Explore
            </Link>{" "}
            — and your route will be drawn across the globe.
          </>
        }
      />
    );
  }

  return (
    <div className="space-y-3">
      <Plate tone="chart" padded={false} className="h-[62vh] w-full overflow-hidden">
        <TripGlobe points={points} arcs={arcs} />
      </Plate>
      <dl className="flex flex-wrap gap-x-6 gap-y-1 font-mono text-[0.62rem] uppercase tracking-label text-ink/60">
        <div className="flex gap-2">
          <dt>Places</dt>
          <dd className="tabular-nums text-ink">{points.length}</dd>
        </div>
        <div className="flex gap-2">
          <dt>Legs</dt>
          <dd className="tabular-nums text-ink">{arcs.length}</dd>
        </div>
        {skipped > 0 && (
          <div className="flex gap-2">
            <dt>Unlocated</dt>
            <dd className="tabular-nums text-ink">{skipped}</dd>
          </div>
        )}
      </dl>
    </div>
  );
}

function DayEntry({
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

  const ordinal = `Day ${String(index + 1).padStart(2, "0")}`;
  const dateLabel = day.date
    ? new Date(day.date).toLocaleDateString(undefined, {
        weekday: "short",
        day: "2-digit",
        month: "short",
      })
    : null;
  const heading = day.title && day.title !== ordinal ? day.title : null;

  const submitPlace = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    addPlace.mutate(
      { dayId: day.id, input: { name: name.trim() } },
      { onSuccess: () => setName("") },
    );
  };

  return (
    <li className="grid gap-x-8 gap-y-3 border-b border-ink/15 py-6 sm:grid-cols-[9rem_1fr]">
      {/* Margin column: the day's mark */}
      <div className="flex items-baseline justify-between gap-3 sm:block">
        <div>
          <p className="font-mono text-[0.68rem] font-medium uppercase tracking-label text-brass-ink">
            {ordinal}
          </p>
          {dateLabel && (
            <p className="mt-1 font-mono text-[0.62rem] uppercase tracking-label text-ink/60">
              {dateLabel}
            </p>
          )}
          {heading && (
            <p className="mt-1 text-sm font-medium text-ink/80">{heading}</p>
          )}
        </div>
        <button
          onClick={() => {
            if (confirm("Remove this day and its places?"))
              deleteDay.mutate(day.id);
          }}
          className="font-mono text-[0.62rem] uppercase tracking-label text-ink/70 transition hover:text-[#9b2c2c] sm:mt-3"
        >
          Remove
        </button>
      </div>

      {/* The day's places, ruled */}
      <div>
        {ordered.length > 0 ? (
          <Reorder.Group
            axis="y"
            values={ordered}
            onReorder={handleReorder}
            as="ol"
            className="divide-y divide-ink/10"
          >
            {ordered.map((place, i) => (
              <PlaceRow
                key={place.id}
                tripId={tripId}
                place={place}
                index={i}
                onDragEnd={persistOrder}
              />
            ))}
          </Reorder.Group>
        ) : (
          <p className="py-2 text-sm text-ink/60">Nothing planned yet.</p>
        )}

        <form onSubmit={submitPlace} className="mt-2 flex items-end gap-3">
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Add a place — e.g. Tokyo"
            aria-label={`Add a place to ${ordinal}`}
            className="field text-sm"
          />
          <Button
            type="submit"
            size="sm"
            disabled={addPlace.isPending || !name.trim()}
            className="shrink-0"
          >
            Add
          </Button>
        </form>
      </div>
    </li>
  );
}

function PlaceRow({
  tripId,
  place,
  index,
  onDragEnd,
}: {
  tripId: string;
  place: TripPlaceDTO;
  index: number;
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
      className="group flex items-center gap-3 bg-parchment py-2.5"
    >
      <span
        onPointerDown={(e) => controls.start(e)}
        title="Drag to reorder"
        className="cursor-grab touch-none select-none text-ink/50 transition hover:text-ink/70 active:cursor-grabbing"
      >
        <Grip size={14} />
      </span>
      <span className="w-6 shrink-0 font-mono text-[0.62rem] tabular-nums text-ink/60">
        {String(index + 1).padStart(2, "0")}
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
          className="field flex-1 py-1 text-sm"
        />
      ) : (
        <button
          onClick={() => setEditing(true)}
          title="Click to rename"
          className="min-w-0 flex-1 truncate text-left text-sm transition hover:text-brass-ink"
        >
          {place.name}
          {place.category && (
            <span className="ml-2 font-mono text-[0.62rem] uppercase tracking-label text-ink/60">
              {place.category}
            </span>
          )}
        </button>
      )}
      <button
        onClick={() => deletePlace.mutate(place.id)}
        aria-label={`Remove ${place.name}`}
        className="p-1 text-ink/50 transition hover:text-[#9b2c2c]"
      >
        <Close size={13} />
      </button>
    </Reorder.Item>
  );
}
