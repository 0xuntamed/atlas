import type { DiscoveredPlaceDTO } from "@atlas/types";
import { env } from "../../env";
import { fetchJson } from "../http";
import type { PlacesProvider, PlacesSearchParams } from "./places.provider";

/**
 * OpenTripMap adapter (https://opentripmap.io). Requires OPENTRIPMAP_API_KEY.
 * Flow: resolve a coordinate (from params or a geoname lookup), then fetch POIs
 * within a radius. Maps to the slim DiscoveredPlaceDTO.
 */

const BASE = "https://api.opentripmap.com/0.1/en/places";

interface RawGeoname {
  name?: string;
  lat?: number;
  lon?: number;
  country?: string;
}

interface RawRadiusFeature {
  xid?: string;
  name?: string;
  point?: { lat?: number; lon?: number };
  kinds?: string;
}

function firstKind(kinds?: string): string | undefined {
  if (!kinds) return undefined;
  const first = kinds.split(",")[0];
  return first ? first.replace(/_/g, " ") : undefined;
}

async function geoname(name: string): Promise<RawGeoname | null> {
  const url = `${BASE}/geoname?name=${encodeURIComponent(name)}&apikey=${env.OPENTRIPMAP_API_KEY}`;
  const raw = await fetchJson<RawGeoname>(url);
  if (typeof raw.lat !== "number" || typeof raw.lon !== "number") return null;
  return raw;
}

export const openTripMapProvider: PlacesProvider = {
  name: "opentripmap",

  async search(params: PlacesSearchParams): Promise<DiscoveredPlaceDTO[]> {
    let { latitude, longitude, countryCode } = params;
    const limit = Math.min(params.limit ?? 20, 50);

    // Resolve a coordinate from the query if none was supplied.
    if ((latitude === undefined || longitude === undefined) && params.query) {
      const geo = await geoname(params.query);
      if (!geo) return [];
      latitude = geo.lat;
      longitude = geo.lon;
      countryCode = countryCode ?? geo.country;
    }

    if (latitude === undefined || longitude === undefined) return [];

    const url =
      `${BASE}/radius?radius=15000&lon=${longitude}&lat=${latitude}` +
      `&rate=2&format=json&limit=${limit}&apikey=${env.OPENTRIPMAP_API_KEY}`;
    const features = await fetchJson<RawRadiusFeature[]>(url);

    return features
      .filter((f) => f.xid && f.name && f.point?.lat != null && f.point?.lon != null)
      .map((f) => ({
        externalPlaceId: `otm:${f.xid}`,
        name: f.name!,
        latitude: f.point!.lat!,
        longitude: f.point!.lon!,
        category: firstKind(f.kinds),
        countryCode: countryCode?.toUpperCase(),
      }));
  },
};
