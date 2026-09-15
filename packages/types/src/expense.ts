import { z } from "zod";
import { expenseCategorySchema } from "./enums";

/**
 * Money is stored as a Decimal(12,2) in Postgres. Over the wire the contract
 * uses a plain number rounded to cents — the serializer is the single boundary
 * that converts Prisma's Decimal back to a JS number.
 */
const amountSchema = z
  .number()
  .positive("Amount must be greater than zero")
  .max(9_999_999_999, "Amount is too large")
  .refine((n) => Number.isFinite(n), "Amount must be a finite number")
  .transform((n) => Math.round(n * 100) / 100);

const currencySchema = z
  .string()
  .trim()
  .length(3, "Use a 3-letter currency code")
  .transform((s) => s.toUpperCase());

export const createExpenseSchema = z.object({
  amount: amountSchema,
  currency: currencySchema.optional(),
  category: expenseCategorySchema.optional(),
  description: z.string().trim().max(280).optional(),
});

export const updateExpenseSchema = z.object({
  amount: amountSchema.optional(),
  currency: currencySchema.optional(),
  category: expenseCategorySchema.optional(),
  description: z.string().trim().max(280).nullable().optional(),
});

export type CreateExpenseInput = z.infer<typeof createExpenseSchema>;
export type UpdateExpenseInput = z.infer<typeof updateExpenseSchema>;

export interface ExpenseDTO {
  id: string;
  tripId: string;
  amount: number;
  currency: string;
  category: string;
  description: string | null;
  createdAt: string;
}

/** Per-currency roll-up returned alongside the expense list. */
export interface ExpenseTotal {
  currency: string;
  total: number;
}
