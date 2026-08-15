import { env } from "../../env";
import type { PlacesProvider } from "./places.provider";
import { openTripMapProvider } from "./opentripmap.provider";
import { mockPlacesProvider } from "./mock.provider";

/**
 * Selects the active discovery provider:
 *   - "opentripmap" / "mock" force a specific provider
 *   - "auto" (default) uses OpenTripMap when a key is set, else the mock
 */
export function getPlacesProvider(): PlacesProvider {
  switch (env.PLACES_PROVIDER) {
    case "opentripmap":
      return openTripMapProvider;
    case "mock":
      return mockPlacesProvider;
    case "auto":
    default:
      return env.OPENTRIPMAP_API_KEY ? openTripMapProvider : mockPlacesProvider;
  }
}

export type { PlacesProvider } from "./places.provider";
