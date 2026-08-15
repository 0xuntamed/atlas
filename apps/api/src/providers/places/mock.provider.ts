import type { DiscoveredPlaceDTO } from "@atlas/types";
import type { PlacesProvider, PlacesSearchParams } from "./places.provider";

/**
 * Keyless mock discovery provider. Returns curated, realistic-looking POIs so
 * the discovery flow works with zero setup. Selected automatically when no
 * OpenTripMap key is configured. Every place has a stable `mock:` id so saving
 * and re-saving behave exactly like the real provider.
 */

type MockPlace = Omit<DiscoveredPlaceDTO, "externalPlaceId"> & { id: string };

const CURATED: Record<string, MockPlace[]> = {
  JP: [
    { id: "jp-fushimi-inari", name: "Fushimi Inari Taisha", latitude: 34.9671, longitude: 135.7727, category: "shrine", countryCode: "JP" },
    { id: "jp-kinkakuji", name: "Kinkaku-ji (Golden Pavilion)", latitude: 35.0394, longitude: 135.7292, category: "temple", countryCode: "JP" },
    { id: "jp-kiyomizu", name: "Kiyomizu-dera", latitude: 34.9949, longitude: 135.785, category: "temple", countryCode: "JP" },
    { id: "jp-arashiyama", name: "Arashiyama Bamboo Grove", latitude: 35.0176, longitude: 135.6716, category: "natural", countryCode: "JP" },
    { id: "jp-sensoji", name: "Sensō-ji", latitude: 35.7148, longitude: 139.7967, category: "temple", countryCode: "JP" },
    { id: "jp-skytree", name: "Tokyo Skytree", latitude: 35.7101, longitude: 139.8107, category: "tower", countryCode: "JP" },
    { id: "jp-meiji", name: "Meiji Jingu", latitude: 35.6764, longitude: 139.6993, category: "shrine", countryCode: "JP" },
  ],
  FR: [
    { id: "fr-eiffel", name: "Eiffel Tower", latitude: 48.8584, longitude: 2.2945, category: "tower", countryCode: "FR" },
    { id: "fr-louvre", name: "Louvre Museum", latitude: 48.8606, longitude: 2.3376, category: "museum", countryCode: "FR" },
    { id: "fr-notredame", name: "Notre-Dame de Paris", latitude: 48.853, longitude: 2.3499, category: "cathedral", countryCode: "FR" },
  ],
  IT: [
    { id: "it-colosseum", name: "Colosseum", latitude: 41.8902, longitude: 12.4922, category: "historic", countryCode: "IT" },
    { id: "it-stpeters", name: "St. Peter's Basilica", latitude: 41.9022, longitude: 12.4539, category: "basilica", countryCode: "IT" },
    { id: "it-duomo", name: "Florence Cathedral", latitude: 43.7731, longitude: 11.2559, category: "cathedral", countryCode: "IT" },
  ],
  IN: [
    { id: "in-tajmahal", name: "Taj Mahal", latitude: 27.1751, longitude: 78.0421, category: "monument", countryCode: "IN" },
    { id: "in-amber", name: "Amber Fort", latitude: 26.9855, longitude: 75.8513, category: "fort", countryCode: "IN" },
    { id: "in-gateway", name: "Gateway of India", latitude: 18.922, longitude: 72.8347, category: "monument", countryCode: "IN" },
  ],
  US: [
    { id: "us-liberty", name: "Statue of Liberty", latitude: 40.6892, longitude: -74.0445, category: "monument", countryCode: "US" },
    { id: "us-goldengate", name: "Golden Gate Bridge", latitude: 37.8199, longitude: -122.4783, category: "bridge", countryCode: "US" },
    { id: "us-grandcanyon", name: "Grand Canyon", latitude: 36.1069, longitude: -112.1129, category: "natural", countryCode: "US" },
  ],
};

/** Generic nearby POIs for countries without a curated set. */
function generateNear(
  lat: number,
  lon: number,
  countryCode: string | undefined,
  limit: number,
): DiscoveredPlaceDTO[] {
  const templates = [
    { suffix: "Old Town", category: "historic", dLat: 0.01, dLon: 0.01 },
    { suffix: "National Museum", category: "museum", dLat: -0.008, dLon: 0.012 },
    { suffix: "Central Market", category: "market", dLat: 0.014, dLon: -0.006 },
    { suffix: "City Park", category: "natural", dLat: -0.012, dLon: -0.01 },
    { suffix: "Grand Cathedral", category: "cathedral", dLat: 0.006, dLon: 0.016 },
    { suffix: "Riverside Walk", category: "natural", dLat: -0.016, dLon: 0.004 },
  ];
  return templates.slice(0, limit).map((t, i) => ({
    externalPlaceId: `mock:near:${lat.toFixed(3)}:${lon.toFixed(3)}:${i}`,
    name: t.suffix,
    latitude: lat + t.dLat,
    longitude: lon + t.dLon,
    category: t.category,
    countryCode: countryCode?.toUpperCase(),
  }));
}

export const mockPlacesProvider: PlacesProvider = {
  name: "mock",

  async search(params: PlacesSearchParams): Promise<DiscoveredPlaceDTO[]> {
    const limit = Math.min(params.limit ?? 20, 50);
    const q = params.query?.trim().toLowerCase();
    const cc = params.countryCode?.toUpperCase();

    let curated = cc ? CURATED[cc] : undefined;

    // Fall back to any curated set whose place matches the query text.
    if (!curated && q) {
      const all = Object.values(CURATED).flat();
      const matches = all.filter((p) => p.name.toLowerCase().includes(q));
      if (matches.length) curated = matches;
    }

    if (curated) {
      const filtered = q
        ? curated.filter((p) => p.name.toLowerCase().includes(q))
        : curated;
      const chosen = (filtered.length ? filtered : curated).slice(0, limit);
      return chosen.map(({ id, ...rest }) => ({
        externalPlaceId: `mock:${id}`,
        ...rest,
      }));
    }

    // No curated data: synthesize nearby POIs if we have a coordinate.
    if (params.latitude !== undefined && params.longitude !== undefined) {
      return generateNear(params.latitude, params.longitude, cc, limit);
    }

    return [];
  },
};
