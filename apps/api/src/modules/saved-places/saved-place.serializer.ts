import type { SavedPlace } from "@prisma/client";
import type { SavedPlaceDTO } from "@atlas/types";

export function serializeSavedPlace(p: SavedPlace): SavedPlaceDTO {
  return {
    id: p.id,
    userId: p.userId,
    externalPlaceId: p.externalPlaceId,
    name: p.name,
    countryCode: p.countryCode,
    latitude: p.latitude,
    longitude: p.longitude,
    category: p.category,
    createdAt: p.createdAt.toISOString(),
  };
}
