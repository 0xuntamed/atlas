import { ErrorCode } from "@atlas/types";
import { AppError } from "../lib/errors";

interface FetchJsonOptions {
  timeoutMs?: number;
  /** When true, an upstream 404 resolves to null instead of throwing. */
  allowNotFound?: boolean;
  headers?: Record<string, string>;
}

const upstreamDown = (message: string) =>
  new AppError(503, ErrorCode.UPSTREAM_UNAVAILABLE, message);

/**
 * Fetch JSON from an external provider with a hard timeout. Any failure
 * (network, timeout, non-2xx) becomes a 503 UPSTREAM_UNAVAILABLE so callers can
 * degrade gracefully — external outages never surface as 500s.
 */
export async function fetchJson<T>(
  url: string,
  opts: FetchJsonOptions = {},
): Promise<T> {
  const { timeoutMs = 8000, headers } = opts;
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const res = await fetch(url, {
      signal: controller.signal,
      headers: { accept: "application/json", ...headers },
    });
    if (res.status === 404 && opts.allowNotFound) {
      return null as T;
    }
    if (!res.ok) {
      throw upstreamDown(`Upstream responded ${res.status}`);
    }
    return (await res.json()) as T;
  } catch (err) {
    if (err instanceof AppError) throw err;
    if (err instanceof Error && err.name === "AbortError") {
      throw upstreamDown("Upstream request timed out");
    }
    throw upstreamDown("Upstream request failed");
  } finally {
    clearTimeout(timer);
  }
}
