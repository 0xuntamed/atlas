import type {
  TripDTO,
  TripDayDTO,
  TripPlaceDTO,
  CountryDTO,
  CountrySummaryDTO,
  DiscoveredPlaceDTO,
  WeatherDTO,
  SavedPlaceDTO,
} from "@atlas/types";

export type {
  TripDTO,
  TripDayDTO,
  TripPlaceDTO,
  CountryDTO,
  CountrySummaryDTO,
  DiscoveredPlaceDTO,
  WeatherDTO,
  SavedPlaceDTO,
};

export type TripDayWithPlaces = TripDayDTO & { places: TripPlaceDTO[] };

export type TripWithItinerary = TripDTO & {
  days: TripDayWithPlaces[];
};
