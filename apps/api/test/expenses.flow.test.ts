import { test, before, after } from "node:test";
import assert from "node:assert/strict";
import type { FastifyInstance } from "fastify";
import { buildApp } from "../src/app";
import { prisma } from "../src/db/prisma";

/**
 * Integration test for the trip-expenses flow. Runs against the dev Postgres
 * under mock auth via Fastify's in-process inject — no network or Clerk. Each
 * run uses unique mock users and cleans up after itself.
 */

const USER_A = `exp_a_${Date.now()}`;
const USER_B = `exp_b_${Date.now()}`;
const asA = { "x-mock-user": USER_A };
const asB = { "x-mock-user": USER_B };

let app: FastifyInstance;

before(async () => {
  app = await buildApp();
  await app.ready();
});

after(async () => {
  await prisma.user.deleteMany({
    where: { clerkId: { in: [USER_A, USER_B] } },
  });
  await app.close();
  await prisma.$disconnect();
});

test("expenses lifecycle: add → list + totals → edit → delete", async () => {
  // A trip to attach expenses to
  let res = await app.inject({
    method: "POST",
    url: "/api/trips",
    headers: asA,
    payload: { title: "Italy 2026", countryCode: "IT" },
  });
  assert.equal(res.statusCode, 201);
  const trip = res.json().data;

  // Add a flight (USD) and a dinner (EUR)
  res = await app.inject({
    method: "POST",
    url: `/api/trips/${trip.id}/expenses`,
    headers: asA,
    payload: { amount: 620.5, category: "FLIGHT", description: "Round trip" },
  });
  assert.equal(res.statusCode, 201);
  const flight = res.json().data;
  assert.equal(flight.amount, 620.5);
  assert.equal(flight.currency, "USD"); // defaulted
  assert.equal(flight.category, "FLIGHT");

  res = await app.inject({
    method: "POST",
    url: `/api/trips/${trip.id}/expenses`,
    headers: asA,
    payload: { amount: 45, currency: "eur", category: "FOOD" },
  });
  assert.equal(res.statusCode, 201);
  assert.equal(res.json().data.currency, "EUR"); // uppercased

  // List reflects both, with per-currency totals
  res = await app.inject({
    method: "GET",
    url: `/api/trips/${trip.id}/expenses`,
    headers: asA,
  });
  assert.equal(res.statusCode, 200);
  const body = res.json();
  assert.equal(body.data.length, 2);
  const usd = body.totals.find((t: { currency: string }) => t.currency === "USD");
  const eur = body.totals.find((t: { currency: string }) => t.currency === "EUR");
  assert.equal(usd.total, 620.5);
  assert.equal(eur.total, 45);

  // Edit the flight amount
  res = await app.inject({
    method: "PATCH",
    url: `/api/expenses/${flight.id}`,
    headers: asA,
    payload: { amount: 700 },
  });
  assert.equal(res.statusCode, 200);
  assert.equal(res.json().data.amount, 700);

  // Delete the flight
  res = await app.inject({
    method: "DELETE",
    url: `/api/expenses/${flight.id}`,
    headers: asA,
  });
  assert.equal(res.statusCode, 204);

  res = await app.inject({
    method: "GET",
    url: `/api/trips/${trip.id}/expenses`,
    headers: asA,
  });
  assert.equal(res.json().data.length, 1);

  // Cleanup
  await app.inject({
    method: "DELETE",
    url: `/api/trips/${trip.id}`,
    headers: asA,
  });
});

test("validation: non-positive amount is rejected", async () => {
  const res = await app.inject({
    method: "POST",
    url: "/api/trips",
    headers: asA,
    payload: { title: "Bad expense trip", countryCode: "FR" },
  });
  const trip = res.json().data;

  const bad = await app.inject({
    method: "POST",
    url: `/api/trips/${trip.id}/expenses`,
    headers: asA,
    payload: { amount: -10 },
  });
  assert.equal(bad.statusCode, 400);
  assert.equal(bad.json().error.code, "VALIDATION_ERROR");

  await app.inject({ method: "DELETE", url: `/api/trips/${trip.id}`, headers: asA });
});

test("ownership: user B cannot add to or read user A's expenses", async () => {
  let res = await app.inject({
    method: "POST",
    url: "/api/trips",
    headers: asA,
    payload: { title: "Private", countryCode: "JP" },
  });
  const trip = res.json().data;

  // A adds an expense
  res = await app.inject({
    method: "POST",
    url: `/api/trips/${trip.id}/expenses`,
    headers: asA,
    payload: { amount: 100 },
  });
  const expense = res.json().data;

  // B cannot list A's trip expenses
  res = await app.inject({
    method: "GET",
    url: `/api/trips/${trip.id}/expenses`,
    headers: asB,
  });
  assert.equal(res.statusCode, 404);

  // B cannot add to A's trip
  res = await app.inject({
    method: "POST",
    url: `/api/trips/${trip.id}/expenses`,
    headers: asB,
    payload: { amount: 5 },
  });
  assert.equal(res.statusCode, 404);

  // B cannot delete A's expense
  res = await app.inject({
    method: "DELETE",
    url: `/api/expenses/${expense.id}`,
    headers: asB,
  });
  assert.equal(res.statusCode, 404);
  assert.equal(res.json().error.code, "EXPENSE_NOT_FOUND");

  await app.inject({ method: "DELETE", url: `/api/trips/${trip.id}`, headers: asA });
});
