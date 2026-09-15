import type { FastifyInstance } from "fastify";
import { createExpenseSchema, updateExpenseSchema } from "@atlas/types";
import { requireAuth } from "../../middleware/auth";
import { parse } from "../../lib/validate";
import { expenseService } from "./expense.service";
import { serializeExpense, totalsByCurrency } from "./expense.serializer";

/**
 *   GET    /api/trips/:tripId/expenses     (list + per-currency totals)
 *   POST   /api/trips/:tripId/expenses
 *   PATCH  /api/expenses/:expenseId
 *   DELETE /api/expenses/:expenseId
 */
export async function expenseRoutes(app: FastifyInstance) {
  app.addHook("preHandler", app.authenticate);

  app.get("/trips/:tripId/expenses", async (req) => {
    const { userId } = requireAuth(req);
    const { tripId } = req.params as { tripId: string };
    const expenses = await expenseService.listForTrip(userId, tripId);
    return {
      data: expenses.map(serializeExpense),
      totals: totalsByCurrency(expenses),
    };
  });

  app.post("/trips/:tripId/expenses", async (req, reply) => {
    const { userId } = requireAuth(req);
    const { tripId } = req.params as { tripId: string };
    const input = parse(createExpenseSchema, req.body);
    const expense = await expenseService.create(userId, tripId, input);
    return reply.code(201).send({ data: serializeExpense(expense) });
  });

  app.patch("/expenses/:expenseId", async (req) => {
    const { userId } = requireAuth(req);
    const { expenseId } = req.params as { expenseId: string };
    const input = parse(updateExpenseSchema, req.body);
    const expense = await expenseService.update(userId, expenseId, input);
    return { data: serializeExpense(expense) };
  });

  app.delete("/expenses/:expenseId", async (req, reply) => {
    const { userId } = requireAuth(req);
    const { expenseId } = req.params as { expenseId: string };
    await expenseService.remove(userId, expenseId);
    return reply.code(204).send();
  });
}
