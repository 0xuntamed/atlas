import { z } from "zod";
import { isoDateSchema } from "./common";

export const createTripDaySchema = z.object({
  date: isoDateSchema.optional(),
  title: z.string().trim().max(120).optional(),
  notes: z.string().trim().max(2000).optional(),
  /** Optional explicit ordering; when omitted the server appends. */
  position: z.number().int().min(0).optional(),
});

export const updateTripDaySchema = z.object({
  date: isoDateSchema.nullable().optional(),
  title: z.string().trim().max(120).nullable().optional(),
  notes: z.string().trim().max(2000).nullable().optional(),
  position: z.number().int().min(0).optional(),
});

export type CreateTripDayInput = z.infer<typeof createTripDaySchema>;
export type UpdateTripDayInput = z.infer<typeof updateTripDaySchema>;

export interface TripDayDTO {
  id: string;
  tripId: string;
  date: string | null;
  title: string | null;
  notes: string | null;
  position: number;
}
