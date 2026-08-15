import { z } from "zod";

/**
 * Domain enums. These are the single source of truth for the API contract and
 * are mirrored (by name/value) in the Prisma schema. Keep the two in sync.
 */

export const TripStatus = {
  DRAFT: "DRAFT",
  PLANNED: "PLANNED",
  ACTIVE: "ACTIVE",
  COMPLETED: "COMPLETED",
  CANCELLED: "CANCELLED",
} as const;
export type TripStatus = (typeof TripStatus)[keyof typeof TripStatus];
export const tripStatusSchema = z.nativeEnum(TripStatus);

export const ExpenseCategory = {
  FLIGHT: "FLIGHT",
  HOTEL: "HOTEL",
  FOOD: "FOOD",
  TRANSPORT: "TRANSPORT",
  ACTIVITY: "ACTIVITY",
  SHOPPING: "SHOPPING",
  OTHER: "OTHER",
} as const;
export type ExpenseCategory =
  (typeof ExpenseCategory)[keyof typeof ExpenseCategory];
export const expenseCategorySchema = z.nativeEnum(ExpenseCategory);

/**
 * Place categories are looser than expenses (they also come from external
 * discovery providers later), so this is an open string with a suggested set.
 */
export const PlaceCategory = {
  SIGHT: "SIGHT",
  FOOD: "FOOD",
  LODGING: "LODGING",
  TRANSPORT: "TRANSPORT",
  ACTIVITY: "ACTIVITY",
  NATURE: "NATURE",
  OTHER: "OTHER",
} as const;
export type PlaceCategory =
  (typeof PlaceCategory)[keyof typeof PlaceCategory];
