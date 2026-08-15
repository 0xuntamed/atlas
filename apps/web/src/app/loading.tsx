export default function Loading() {
  return (
    <div className="flex min-h-[40vh] items-center justify-center">
      <div className="flex items-center gap-3 text-sm text-ink/50">
        <span className="h-4 w-4 animate-spin rounded-full border-2 border-ink/20 border-t-ink/60" />
        Loading…
      </div>
    </div>
  );
}
