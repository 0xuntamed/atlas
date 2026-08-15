import { z } from "zod";

/** ISO 3166-1 alpha-2 country code, uppercased (e.g. "JP"). */
export const countryCodeSchema = z
  .string()
  .trim()
  .length(2, "Country code must be a 2-letter ISO code")
  .transform((s) => s.toUpperCase());

export const latitudeSchema = z
  .number()
  .min(-90, "Latitude must be >= -90")
  .max(90, "Latitude must be <= 90");

export const longitudeSchema = z
  .number()
  .min(-180, "Longitude must be >= -180")
  .max(180, "Longitude must be <= 180");

/** Accepts a date-only ("2026-10-12") or full ISO string; yields a Date. */
export const isoDateSchema = z.coerce.date();

export const cuidSchema = z.string().min(1);
