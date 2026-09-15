"use client";

import {
  useMutation,
  useQuery,
  useQueryClient,
  type QueryClient,
} from "@tanstack/react-query";
import { useApiCall } from "./use-api-call";
import type {
  CreateTripInput,
  CreateTripDayInput,
  CreateTripPlaceInput,
  CreateExpenseInput,
  UpdateTripInput,
  UpdateTripPlaceInput,
} from "@atlas/types";
import type {
  TripDTO,
  TripDayDTO,
  TripPlaceDTO,
  TripWithItinerary,
  ExpenseDTO,
} from "./types";

const keys = {
  trips: ["trips"] as const,
  trip: (id: string) => ["trips", id] as const,
  expenses: (id: string) => ["trips", id, "expenses"] as const,
};

// Token-bound API caller shared with the discovery hooks.
const useApi = useApiCall;

export function useTrips() {
  const call = useApi();
  return useQuery({
    queryKey: keys.trips,
    queryFn: () => call<TripDTO[]>("/api/trips"),
  });
}

export function useTrip(id: string) {
  const call = useApi();
  return useQuery({
    queryKey: keys.trip(id),
    queryFn: () => call<TripWithItinerary>(`/api/trips/${id}`),
    enabled: Boolean(id),
  });
}

const invalidateTrips = (qc: QueryClient) =>
  qc.invalidateQueries({ queryKey: keys.trips });

export function useCreateTrip() {
  const call = useApi();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (input: CreateTripInput) =>
      call<TripDTO>("/api/trips", { method: "POST", body: input }),
    onSuccess: () => invalidateTrips(qc),
  });
}

export function useUpdateTrip(id: string) {
  const call = useApi();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (input: UpdateTripInput) =>
      call<TripDTO>(`/api/trips/${id}`, { method: "PATCH", body: input }),
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: keys.trip(id) });
      void invalidateTrips(qc);
      // Completing a trip changes the passport, profile stats, and globe.
      void qc.invalidateQueries({ queryKey: ["passport"] });
      void qc.invalidateQueries({ queryKey: ["profile"] });
      void qc.invalidateQueries({ queryKey: ["map"] });
    },
  });
}

export function useDeleteTrip() {
  const call = useApi();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) =>
      call<void>(`/api/trips/${id}`, { method: "DELETE" }),
    onSuccess: () => invalidateTrips(qc),
  });
}

/* ── Days ── */

export function useAddDay(tripId: string) {
  const call = useApi();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (input: CreateTripDayInput) =>
      call<TripDayDTO>(`/api/trips/${tripId}/days`, {
        method: "POST",
        body: input,
      }),
    onSuccess: () => qc.invalidateQueries({ queryKey: keys.trip(tripId) }),
  });
}

export function useDeleteDay(tripId: string) {
  const call = useApi();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (dayId: string) =>
      call<void>(`/api/trip-days/${dayId}`, { method: "DELETE" }),
    onSuccess: () => qc.invalidateQueries({ queryKey: keys.trip(tripId) }),
  });
}

/* ── Places ── */

export function useAddPlace(tripId: string) {
  const call = useApi();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({
      dayId,
      input,
    }: {
      dayId: string;
      input: CreateTripPlaceInput;
    }) =>
      call<TripPlaceDTO>(`/api/trip-days/${dayId}/places`, {
        method: "POST",
        body: input,
      }),
    onSuccess: () => qc.invalidateQueries({ queryKey: keys.trip(tripId) }),
  });
}

export function useUpdatePlace(tripId: string) {
  const call = useApi();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({
      placeId,
      input,
    }: {
      placeId: string;
      input: UpdateTripPlaceInput;
    }) =>
      call(`/api/trip-places/${placeId}`, { method: "PATCH", body: input }),
    onSuccess: () => qc.invalidateQueries({ queryKey: keys.trip(tripId) }),
  });
}

export function useDeletePlace(tripId: string) {
  const call = useApi();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (placeId: string) =>
      call<void>(`/api/trip-places/${placeId}`, { method: "DELETE" }),
    onSuccess: () => qc.invalidateQueries({ queryKey: keys.trip(tripId) }),
  });
}

/* ── Expenses ── */

export function useExpenses(tripId: string) {
  const call = useApi();
  return useQuery({
    queryKey: keys.expenses(tripId),
    // apiFetch unwraps the `{ data }` envelope; totals are derived client-side.
    queryFn: () => call<ExpenseDTO[]>(`/api/trips/${tripId}/expenses`),
    enabled: Boolean(tripId),
  });
}

export function useAddExpense(tripId: string) {
  const call = useApi();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (input: CreateExpenseInput) =>
      call<ExpenseDTO>(`/api/trips/${tripId}/expenses`, {
        method: "POST",
        body: input,
      }),
    onSuccess: () => qc.invalidateQueries({ queryKey: keys.expenses(tripId) }),
  });
}

export function useDeleteExpense(tripId: string) {
  const call = useApi();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (expenseId: string) =>
      call<void>(`/api/expenses/${expenseId}`, { method: "DELETE" }),
    onSuccess: () => qc.invalidateQueries({ queryKey: keys.expenses(tripId) }),
  });
}
