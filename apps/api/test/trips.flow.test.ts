import { test, before, after } from "node:test";
import assert from "node:assert/strict";
import type { FastifyInstance } from "fastify";
import { buildApp } from "../src/app";
import { prisma } from "../src/db/prisma";

/**
 * Integration test for the Phase 1 completion flow. Runs against the dev
 * Postgres using mock auth (AUTH_MODE=mock) and Fastify's in-process inject, so
 * no network or Clerk is involved. Each run uses a unique mock user and cleans
 * up after itself.
 */

const USER_A = `test_a_${Date.now()}`;
const USER_B = `test_b_${Date.now()}`;
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

test("full trip lifecycle: create → day → place → edit → delete", async () => {
  // Create "Japan 2026"
  let res = await app.inject({
    method: "POST",
    url: "/api/trips",
    headers: asA,
    payload: { title: "Japan 2026", countryCode: "jp" },
  });
  assert.equal(res.statusCode, 201);
  const trip = res.json().data;
  assert.equal(trip.title, "Japan 2026");
  assert.equal(trip.countryCode, "JP"); // normalized/uppercased

  // Add a day
  res = await app.inject({
    method: "POST",
    url: `/api/trips/${trip.id}/days`,
    headers: asA,
    payload: { title: "October 12" },
  });
  assert.equal(res.statusCode, 201);
  const day = res.json().data;

  // Add Tokyo
  res = await app.inject({
    method: "POST",
    url: `/api/trip-days/${day.id}/places`,
    headers: asA,
    payload: { name: "Tokyo" },
  });
  assert.equal(res.statusCode, 201);
  const place = res.json().data;
  assert.equal(place.name, "Tokyo");
  assert.equal(place.position, 0);

  // Edit Tokyo
  res = await app.inject({
    method: "PATCH",
    url: `/api/trip-places/${place.id}`,
    headers: asA,
    payload: { name: "Tokyo (Shibuya)" },
  });
  assert.equal(res.statusCode, 200);
  assert.equal(res.json().data.name, "Tokyo (Shibuya)");

  // Trip detail reflects the nested itinerary
  res = await app.inject({
    method: "GET",
    url: `/api/trips/${trip.id}`,
    headers: asA,
  });
  assert.equal(res.statusCode, 200);
  const full = res.json().data;
  assert.equal(full.days.length, 1);
  assert.equal(full.days[0].places[0].name, "Tokyo (Shibuya)");

  // Delete Tokyo
  res = await app.inject({
    method: "DELETE",
    url: `/api/trip-places/${place.id}`,
    headers: asA,
  });
  assert.equal(res.statusCode, 204);

  // Delete the trip
  res = await app.inject({
    method: "DELETE",
    url: `/api/trips/${trip.id}`,
    headers: asA,
  });
  assert.equal(res.statusCode, 204);

  // Gone
  res = await app.inject({
    method: "GET",
    url: `/api/trips/${trip.id}`,
    headers: asA,
  });
  assert.equal(res.statusCode, 404);
  assert.equal(res.json().error.code, "TRIP_NOT_FOUND");
});

test("ownership: user B cannot see or mutate user A's trip", async () => {
  // A creates
  let res = await app.inject({
    method: "POST",
    url: "/api/trips",
    headers: asA,
    payload: { title: "Private trip", countryCode: "FR" },
  });
  const trip = res.json().data;

  // B's list does not include it
  res = await app.inject({ method: "GET", url: "/api/trips", headers: asB });
  const bTrips = res.json().data as { id: string }[];
  assert.ok(!bTrips.some((t) => t.id === trip.id));

  // B cannot fetch it
  res = await app.inject({
    method: "GET",
    url: `/api/trips/${trip.id}`,
    headers: asB,
  });
  assert.equal(res.statusCode, 404);

  // B cannot delete it
  res = await app.inject({
    method: "DELETE",
    url: `/api/trips/${trip.id}`,
    headers: asB,
  });
  assert.equal(res.statusCode, 404);
  assert.equal(res.json().error.code, "TRIP_NOT_FOUND");

  // A can still delete it (cleanup)
  res = await app.inject({
    method: "DELETE",
    url: `/api/trips/${trip.id}`,
    headers: asA,
  });
  assert.equal(res.statusCode, 204);
});

test("validation: missing title is rejected with an envelope", async () => {
  const res = await app.inject({
    method: "POST",
    url: "/api/trips",
    headers: asA,
    payload: { countryCode: "JP" },
  });
  assert.equal(res.statusCode, 400);
  assert.equal(res.json().error.code, "VALIDATION_ERROR");
});
