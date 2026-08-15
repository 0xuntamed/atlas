import { z } from "zod";
import { latitudeSchema, longitudeSchema } from "./common";

export const createTripPlaceSchema = z.object({
  name: z.string().trim().min(1, "Name is required").max(160),
  latitude: latitudeSchema.optional(),
  longitude: longitudeSchema.optional(),
  category: z.string().trim().max(40).optional(),
  notes: z.string().trim().max(2000).optional(),
  position: z.number().int().min(0).optional(),
  /** Set when this place originated from an external discovery provider. */
  externalPlaceId: z.string().trim().max(200).optional(),
});

export const updateTripPlaceSchema = z.object({
  name: z.string().trim().min(1).max(160).optional(),
  latitude: latitudeSchema.nullable().optional(),
  longitude: longitudeSchema.nullable().optional(),
  category: z.string().trim().max(40).nullable().optional(),
  notes: z.string().trim().max(2000).nullable().optional(),
  position: z.number().int().min(0).optional(),
  /** Move a place to a different day within the same trip. */
  tripDayId: z.string().min(1).optional(),
});

export type CreateTripPlaceInput = z.infer<typeof createTripPlaceSchema>;
export type UpdateTripPlaceInput = z.infer<typeof updateTripPlaceSchema>;

export interface TripPlaceDTO {
  id: string;
  tripDayId: string;
  externalPlaceId: string | null;
  name: string;
  latitude: number | null;
  longitude: number | null;
  category: string | null;
  notes: string | null;
  position: number;
}
