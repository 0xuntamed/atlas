/**
 * Tiny in-memory TTL cache. Used only for immutable-ish external world data
 * (country metadata, weather) to be gentle on upstreams and speed repeat reads.
 * NOT for user-owned mutable state. This is deliberately not Redis — see the
 * "optimize only after measurement" principle; swap it out if we ever scale to
 * multiple instances.
 */
export class TtlCache<T> {
  private store = new Map<string, { value: T; expires: number }>();

  constructor(private readonly ttlMs: number) {}

  get(key: string): T | undefined {
    const hit = this.store.get(key);
    if (!hit) return undefined;
    if (Date.now() > hit.expires) {
      this.store.delete(key);
      return undefined;
    }
    return hit.value;
  }

  set(key: string, value: T): void {
    this.store.set(key, { value, expires: Date.now() + this.ttlMs });
  }
}
