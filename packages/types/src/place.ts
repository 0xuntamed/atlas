/**
 * A place returned by the discovery provider (OpenTripMap or the mock). Only
 * the slim fields ATLAS actually needs — enough to render, save, or drop into
 * an itinerary. `externalPlaceId` is namespaced by provider (e.g. "otm:123").
 */
export interface DiscoveredPlaceDTO {
  externalPlaceId: string;
  name: string;
  latitude: number;
  longitude: number;
  category?: string;
  countryCode?: string;
}
