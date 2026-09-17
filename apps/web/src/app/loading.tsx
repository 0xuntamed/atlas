import { CompassNeedle } from "@/components/ui/icons";

/** Route-level loading: a compass finding north, in mono marginalia. */
export default function Loading() {
  return (
    <div
      role="status"
      aria-live="polite"
      className="flex min-h-[40vh] items-center justify-center"
    >
      <div className="flex items-center gap-3 font-mono text-[0.68rem] uppercase tracking-label text-ink/70">
        <span className="relative grid h-6 w-6 place-items-center rounded-full border border-brass/70">
          <CompassNeedle size={16} className="compass-sweep text-brass-ink" />
        </span>
        Taking a bearing…
      </div>
    </div>
  );
}
