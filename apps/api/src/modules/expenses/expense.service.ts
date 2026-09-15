import type { CreateExpenseInput, UpdateExpenseInput } from "@atlas/types";
import { ErrorCode } from "@atlas/types";
import { notFound } from "../../lib/errors";
import { tripRepository } from "../trips/trip.repository";
import { expenseRepository } from "./expense.repository";

const expenseNotFound = () =>
  notFound(ErrorCode.EXPENSE_NOT_FOUND, "Expense could not be found");
const tripNotFound = () =>
  notFound(ErrorCode.TRIP_NOT_FOUND, "Trip could not be found");

export const expenseService = {
  async listForTrip(userId: string, tripId: string) {
    // Verify the parent trip is owned before exposing its expenses.
    const trip = await tripRepository.findOwned(userId, tripId);
    if (!trip) throw tripNotFound();
    return expenseRepository.listByTrip(tripId);
  },

  async create(userId: string, tripId: string, input: CreateExpenseInput) {
    const trip = await tripRepository.findOwned(userId, tripId);
    if (!trip) throw tripNotFound();

    return expenseRepository.create({
      tripId,
      amount: input.amount,
      currency: input.currency ?? "USD",
      category: input.category ?? "OTHER",
      description: input.description ?? null,
    });
  },

  async update(userId: string, expenseId: string, input: UpdateExpenseInput) {
    const existing = await expenseRepository.findOwned(userId, expenseId);
    if (!existing) throw expenseNotFound();
    return expenseRepository.update(expenseId, input);
  },

  async remove(userId: string, expenseId: string) {
    const existing = await expenseRepository.findOwned(userId, expenseId);
    if (!existing) throw expenseNotFound();
    await expenseRepository.delete(expenseId);
  },
};
