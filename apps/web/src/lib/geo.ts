import type { CountryMapEntryDTO, CountryState } from "@atlas/types";
import type { TripWithItinerary } from "./types";

/**
 * Selectors that transform trip/map data into shapes the globe consumes.
 * The Map view renders straight from these — it never keeps its own copy of the
 * itinerary (single source of truth stays the trip data from the API).
 */

export type StateMap = Record<string, CountryState>;

export function countryStatesToMap(entries: CountryMapEntryDTO[]): StateMap {
  const map: StateMap = {};
  for (const e of entries) map[e.code.toUpperCase()] = e.state;
  return map;
}

export interface GeoPoint {
  id: string;
  name: string;
  lat: number;
  lng: number;
  dayIndex: number;
  order: number;
}

export interface GeoArc {
  startLat: number;
  startLng: number;
  endLat: number;
  endLng: number;
}

/**
 * Flatten a trip into an ordered list of geo points — days by position, places
 * by position — keeping only places that have coordinates (manual entries
 * without a location are skipped on the map).
 */
export function tripToPoints(trip: TripWithItinerary): GeoPoint[] {
  const points: GeoPoint[] = [];
  let order = 0;
  const days = [...trip.days].sort((a, b) => a.position - b.position);
  days.forEach((day, dayIndex) => {
    const places = [...day.places].sort((a, b) => a.position - b.position);
    for (const p of places) {
      if (p.latitude == null || p.longitude == null) continue;
      points.push({
        id: p.id,
        name: p.name,
        lat: p.latitude,
        lng: p.longitude,
        dayIndex,
        order: order++,
      });
    }
  });
  return points;
}

/** Route arcs between consecutive points (in itinerary order). */
export function pointsToArcs(points: GeoPoint[]): GeoArc[] {
  const arcs: GeoArc[] = [];
  for (let i = 1; i < points.length; i++) {
    const a = points[i - 1]!;
    const b = points[i]!;
    arcs.push({
      startLat: a.lat,
      startLng: a.lng,
      endLat: b.lat,
      endLng: b.lng,
    });
  }
  return arcs;
}

/** Rough centroid + zoom altitude for framing a set of points on the globe. */
export function pointsView(points: GeoPoint[]): {
  lat: number;
  lng: number;
  altitude: number;
} {
  if (points.length === 0) return { lat: 20, lng: 0, altitude: 2.4 };
  const lat = points.reduce((s, p) => s + p.lat, 0) / points.length;
  const lng = points.reduce((s, p) => s + p.lng, 0) / points.length;

  const latSpread =
    Math.max(...points.map((p) => p.lat)) -
    Math.min(...points.map((p) => p.lat));
  const lngSpread =
    Math.max(...points.map((p) => p.lng)) -
    Math.min(...points.map((p) => p.lng));
  const spread = Math.max(latSpread, lngSpread);

  // Closer for tight itineraries, wider for spread-out ones.
  const altitude = Math.min(2.5, Math.max(0.6, spread / 20 + 0.5));
  return { lat, lng, altitude };
}

/**
 * Chart-style coordinates for marginalia: 64°08′N · 21°56′W. Degrees and
 * minutes, hemisphere letters — the way a sheet's corner is labelled.
 */
export function formatCoordinates(lat: number, lng: number): string {
  const dm = (v: number) => {
    const abs = Math.abs(v);
    const deg = Math.floor(abs);
    const min = Math.round((abs - deg) * 60);
    return `${deg}°${String(min).padStart(2, "0")}′`;
  };
  return `${dm(lat)}${lat >= 0 ? "N" : "S"} · ${dm(lng)}${lng >= 0 ? "E" : "W"}`;
}
