import type {
  TripDTO,
  TripDayDTO,
  TripPlaceDTO,
  CountryDTO,
  CountrySummaryDTO,
  DiscoveredPlaceDTO,
  WeatherDTO,
  SavedPlaceDTO,
  ExpenseDTO,
  ExpenseTotal,
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
  ExpenseDTO,
  ExpenseTotal,
};

export type TripDayWithPlaces = TripDayDTO & { places: TripPlaceDTO[] };

export type TripWithItinerary = TripDTO & {
  days: TripDayWithPlaces[];
};
