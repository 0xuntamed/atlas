"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type {
  CreateSavedPlaceInput,
  CountryMapEntryDTO,
  PassportStampDTO,
  ProfileStatsDTO,
} from "@atlas/types";
import { useApiCall } from "./use-api-call";
import type {
  CountryDTO,
  DiscoveredPlaceDTO,
  SavedPlaceDTO,
  WeatherDTO,
} from "./types";

const keys = {
  countrySearch: (q: string) => ["countries", "search", q] as const,
  country: (code: string) => ["countries", code] as const,
  weather: (key: string) => ["weather", key] as const,
  discover: (params: string) => ["places", "discover", params] as const,
  saved: (country?: string) => ["saved-places", country ?? "all"] as const,
};

export function useCountrySearch(query: string) {
  const call = useApiCall();
  const q = query.trim();
  return useQuery({
    queryKey: keys.countrySearch(q),
    queryFn: () =>
      call<CountryDTO[]>(`/api/countries?search=${encodeURIComponent(q)}`),
    enabled: q.length >= 2,
  });
}

export function useCountry(code: string) {
  const call = useApiCall();
  return useQuery({
    queryKey: keys.country(code),
    queryFn: () => call<CountryDTO>(`/api/countries/${code}`),
    enabled: Boolean(code),
  });
}

export function useWeather(country?: string) {
  const call = useApiCall();
  return useQuery({
    queryKey: keys.weather(country ?? ""),
    queryFn: () => call<WeatherDTO>(`/api/weather?country=${country}`),
    enabled: Boolean(country),
    retry: 0, // discovery degrades quietly
  });
}

export function useDiscoverPlaces(params: {
  country?: string;
  q?: string;
  lat?: number;
  lon?: number;
  enabled?: boolean;
}) {
  const call = useApiCall();
  const search = new URLSearchParams();
  if (params.country) search.set("country", params.country);
  if (params.q) search.set("q", params.q);
  if (params.lat !== undefined) search.set("lat", String(params.lat));
  if (params.lon !== undefined) search.set("lon", String(params.lon));
  const qs = search.toString();

  return useQuery({
    queryKey: keys.discover(qs),
    queryFn: () => call<DiscoveredPlaceDTO[]>(`/api/places/search?${qs}`),
    enabled: params.enabled ?? Boolean(params.country || params.q),
    retry: 0,
  });
}

export function useCountryStates() {
  const call = useApiCall();
  return useQuery({
    queryKey: ["map", "countries"],
    queryFn: () => call<CountryMapEntryDTO[]>("/api/map/countries"),
  });
}

export function usePassport() {
  const call = useApiCall();
  return useQuery({
    queryKey: ["passport"],
    queryFn: () => call<PassportStampDTO[]>("/api/passport"),
  });
}

export function useProfileStats() {
  const call = useApiCall();
  return useQuery({
    queryKey: ["profile", "stats"],
    queryFn: () => call<ProfileStatsDTO>("/api/profile/stats"),
  });
}

export function useSavedPlaces(country?: string) {
  const call = useApiCall();
  return useQuery({
    queryKey: keys.saved(country),
    queryFn: () =>
      call<SavedPlaceDTO[]>(
        `/api/saved-places${country ? `?country=${country}` : ""}`,
      ),
  });
}

export function useSavePlace() {
  const call = useApiCall();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (input: CreateSavedPlaceInput) =>
      call<SavedPlaceDTO>("/api/saved-places", {
        method: "POST",
        body: input,
      }),
    onSuccess: () =>
      qc.invalidateQueries({ queryKey: ["saved-places"] }),
  });
}

export function useDeleteSavedPlace() {
  const call = useApiCall();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) =>
      call<void>(`/api/saved-places/${id}`, { method: "DELETE" }),
    onSuccess: () =>
      qc.invalidateQueries({ queryKey: ["saved-places"] }),
  });
}
