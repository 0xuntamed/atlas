import type { Prisma } from "@prisma/client";
import { prisma } from "../../db/prisma";

/**
 * Data access for trip expenses. Expenses are always reached through their
 * parent trip; ownership is enforced via the trip -> user relation so a caller
 * can never touch another user's expense.
 */
export const expenseRepository = {
  listByTrip(tripId: string) {
    return prisma.expense.findMany({
      where: { tripId },
      orderBy: { createdAt: "desc" },
    });
  },

  /** Owned if expense -> trip -> user chain matches. */
  findOwned(userId: string, expenseId: string) {
    return prisma.expense.findFirst({
      where: { id: expenseId, trip: { userId } },
    });
  },

  create(data: Prisma.ExpenseUncheckedCreateInput) {
    return prisma.expense.create({ data });
  },

  update(expenseId: string, data: Prisma.ExpenseUpdateInput) {
    return prisma.expense.update({ where: { id: expenseId }, data });
  },

  delete(expenseId: string) {
    return prisma.expense.delete({ where: { id: expenseId } });
  },
};
