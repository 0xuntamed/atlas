import type { Expense } from "@prisma/client";
import type { ExpenseDTO, ExpenseTotal } from "@atlas/types";

/**
 * Prisma returns `amount` as a Decimal and `createdAt` as a Date; the API
 * contract exposes a plain number and an ISO string. This serializer is the
 * single boundary where that conversion happens.
 */
export function serializeExpense(e: Expense): ExpenseDTO {
  return {
    id: e.id,
    tripId: e.tripId,
    amount: e.amount.toNumber(),
    currency: e.currency,
    category: e.category,
    description: e.description,
    createdAt: e.createdAt.toISOString(),
  };
}

/** Sum expenses grouped by currency; currencies don't get blindly added. */
export function totalsByCurrency(expenses: Expense[]): ExpenseTotal[] {
  const byCurrency = new Map<string, number>();
  for (const e of expenses) {
    byCurrency.set(e.currency, (byCurrency.get(e.currency) ?? 0) + e.amount.toNumber());
  }
  return [...byCurrency.entries()]
    .map(([currency, total]) => ({ currency, total: Math.round(total * 100) / 100 }))
    .sort((a, b) => b.total - a.total);
}
