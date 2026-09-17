import clsx from "clsx";
import type { TripStatus } from "@atlas/types";

/**
 * Trip status as a small inked mark + mono word. Colors are the globe's own
 * state colors (a completed trip is a visited country; a planned one is
 * planned) so the same hue means the same thing everywhere in ATLAS.
 */
const STYLE: Record<TripStatus, { dot: string; label: string }> = {
  DRAFT: { dot: "bg-ink/35", label: "Draft" },
  PLANNED: { dot: "bg-planned", label: "Planned" },
  ACTIVE: { dot: "bg-planned ring-2 ring-planned/30", label: "Underway" },
  COMPLETED: { dot: "bg-visited", label: "Completed" },
  CANCELLED: { dot: "bg-transparent border border-ink/40", label: "Cancelled" },
};

export function TripStatusMark({
  status,
  withLabel = false,
  className,
}: {
  status: TripStatus;
  withLabel?: boolean;
  className?: string;
}) {
  const s = STYLE[status];
  return (
    <span
      className={clsx("inline-flex items-center gap-2", className)}
      title={s.label}
    >
      <span
        aria-hidden
        className={clsx("inline-block h-2 w-2 shrink-0 rounded-full", s.dot)}
      />
      {withLabel ? (
        <span className="font-mono text-[0.68rem] uppercase tracking-label text-ink/70">
          {s.label}
        </span>
      ) : (
        <span className="sr-only">{s.label}</span>
      )}
    </span>
  );
}

export const TRIP_STATUS_LABEL: Record<TripStatus, string> = Object.fromEntries(
  Object.entries(STYLE).map(([k, v]) => [k, v.label]),
) as Record<TripStatus, string>;
