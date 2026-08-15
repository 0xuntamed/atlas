import { z } from "zod";
import { countryCodeSchema, isoDateSchema } from "./common";
import { tripStatusSchema } from "./enums";

/**
 * Trip request contracts. Response shapes are inferred by the frontend from
 * these plus server-managed fields (id, timestamps).
 */

export const createTripSchema = z
  .object({
    title: z.string().trim().min(1, "Title is required").max(120),
    countryCode: countryCodeSchema,
    startDate: isoDateSchema.optional(),
    endDate: isoDateSchema.optional(),
    status: tripStatusSchema.default("DRAFT"),
    coverImage: z.string().url().optional(),
  })
  .refine(
    (v) => !v.startDate || !v.endDate || v.endDate >= v.startDate,
    { message: "endDate must be on or after startDate", path: ["endDate"] },
  );

export const updateTripSchema = z
  .object({
    title: z.string().trim().min(1).max(120).optional(),
    countryCode: countryCodeSchema.optional(),
    startDate: isoDateSchema.nullable().optional(),
    endDate: isoDateSchema.nullable().optional(),
    status: tripStatusSchema.optional(),
    coverImage: z.string().url().nullable().optional(),
  })
  .refine(
    (v) =>
      !v.startDate || !v.endDate || v.startDate === null || v.endDate === null
        ? true
        : v.endDate >= v.startDate,
    { message: "endDate must be on or after startDate", path: ["endDate"] },
  );

export type CreateTripInput = z.infer<typeof createTripSchema>;
export type UpdateTripInput = z.infer<typeof updateTripSchema>;

export interface TripDTO {
  id: string;
  userId: string;
  title: string;
  countryCode: string;
  startDate: string | null;
  endDate: string | null;
  status: z.infer<typeof tripStatusSchema>;
  coverImage: string | null;
  createdAt: string;
  updatedAt: string;
}
