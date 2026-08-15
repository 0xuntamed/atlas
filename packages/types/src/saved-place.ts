import { z } from "zod";
import {
  countryCodeSchema,
  latitudeSchema,
  longitudeSchema,
} from "./common";

/**
 * Saving a discovered place creates an internal SavedPlace record. We store
 * only the fields ATLAS needs — never the full upstream response.
 */
export const createSavedPlaceSchema = z.object({
  name: z.string().trim().min(1, "Name is required").max(160),
  externalPlaceId: z.string().trim().max(200).optional(),
  countryCode: countryCodeSchema.optional(),
  latitude: latitudeSchema.optional(),
  longitude: longitudeSchema.optional(),
  category: z.string().trim().max(40).optional(),
});

export type CreateSavedPlaceInput = z.infer<typeof createSavedPlaceSchema>;

export interface SavedPlaceDTO {
  id: string;
  userId: string;
  externalPlaceId: string | null;
  name: string;
  countryCode: string | null;
  latitude: number | null;
  longitude: number | null;
  category: string | null;
  createdAt: string;
}
