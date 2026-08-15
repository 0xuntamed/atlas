import type { DiscoveredPlaceDTO } from "@atlas/types";

export interface PlacesSearchParams {
  /** Free-text place/area name, e.g. "Kyoto". */
  query?: string;
  latitude?: number;
  longitude?: number;
  countryCode?: string;
  limit?: number;
}

/**
 * Discovery source abstraction. Implemented by OpenTripMap (real) and a keyless
 * mock. The rest of the app depends only on this interface, so providers can be
 * swapped without touching domain logic.
 */
export interface PlacesProvider {
  readonly name: string;
  search(params: PlacesSearchParams): Promise<DiscoveredPlaceDTO[]>;
}
