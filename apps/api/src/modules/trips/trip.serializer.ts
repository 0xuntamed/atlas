import type {
  Trip,
  TripDay,
  TripPlace,
} from "@prisma/client";
import type { TripDayDTO, TripDTO, TripPlaceDTO } from "@atlas/types";

/**
 * Prisma returns Date objects; the API contract exposes ISO strings. These
 * serializers are the single boundary where that conversion happens.
 */

const iso = (d: Date | null) => (d ? d.toISOString() : null);

export function serializeTrip(t: Trip): TripDTO {
  return {
    id: t.id,
    userId: t.userId,
    title: t.title,
    countryCode: t.countryCode,
    startDate: iso(t.startDate),
    endDate: iso(t.endDate),
    status: t.status,
    coverImage: t.coverImage,
    createdAt: t.createdAt.toISOString(),
    updatedAt: t.updatedAt.toISOString(),
  };
}

export function serializeTripPlace(p: TripPlace): TripPlaceDTO {
  return {
    id: p.id,
    tripDayId: p.tripDayId,
    externalPlaceId: p.externalPlaceId,
    name: p.name,
    latitude: p.latitude,
    longitude: p.longitude,
    category: p.category,
    notes: p.notes,
    position: p.position,
  };
}

export function serializeTripDay(
  d: TripDay & { places?: TripPlace[] },
): TripDayDTO & { places: TripPlaceDTO[] } {
  return {
    id: d.id,
    tripId: d.tripId,
    date: iso(d.date),
    title: d.title,
    notes: d.notes,
    position: d.position,
    places: (d.places ?? []).map(serializeTripPlace),
  };
}

export function serializeTripWithItinerary(
  t: Trip & { days: (TripDay & { places: TripPlace[] })[] },
) {
  return {
    ...serializeTrip(t),
    days: t.days.map(serializeTripDay),
  };
}
