import { test, before, after } from "node:test";
import assert from "node:assert/strict";
import type { FastifyInstance } from "fastify";
import { buildApp } from "../src/app";
import { prisma } from "../src/db/prisma";

/**
 * Phase 4: completing a trip stamps the passport (records a VisitedCountry) and
 * feeds the travel-profile stats.
 */

const USER = `test_pp_${Date.now()}`;
const asUser = { "x-mock-user": USER };
let app: FastifyInstance;

before(async () => {
  app = await buildApp();
  await app.ready();
});

after(async () => {
  await prisma.user.deleteMany({ where: { clerkId: USER } });
  await app.close();
  await prisma.$disconnect();
});

test("completing a trip creates a passport stamp; re-completing does not double it", async () => {
  // Create a planned trip with two located places (a measurable route).
  let res = await app.inject({
    method: "POST",
    url: "/api/trips",
    headers: asUser,
    payload: { title: "Japan", countryCode: "JP", status: "PLANNED" },
  });
  const trip = res.json().data;
  res = await app.inject({
    method: "POST",
    url: `/api/trips/${trip.id}/days`,
    headers: asUser,
    payload: { title: "Day 1" },
  });
  const day = res.json().data;
  for (const p of [
    { name: "Kyoto", latitude: 35.0116, longitude: 135.7681 },
    { name: "Tokyo", latitude: 35.6762, longitude: 139.6503 },
  ]) {
    await app.inject({
      method: "POST",
      url: `/api/trip-days/${day.id}/places`,
      headers: asUser,
      payload: p,
    });
  }

  // Passport is empty before completion.
  res = await app.inject({ method: "GET", url: "/api/passport", headers: asUser });
  assert.equal(res.json().data.length, 0);

  // Complete the trip.
  res = await app.inject({
    method: "PATCH",
    url: `/api/trips/${trip.id}`,
    headers: asUser,
    payload: { status: "COMPLETED" },
  });
  assert.equal(res.statusCode, 200);

  // A JP stamp now exists.
  res = await app.inject({ method: "GET", url: "/api/passport", headers: asUser });
  const stamps = res.json().data as {
    code: string;
    name: string;
    visitCount: number;
  }[];
  assert.equal(stamps.length, 1);
  assert.equal(stamps[0].code, "JP");
  assert.equal(stamps[0].name, "Japan");
  assert.equal(stamps[0].visitCount, 1);

  // Re-saving an already-completed trip must not bump the count.
  await app.inject({
    method: "PATCH",
    url: `/api/trips/${trip.id}`,
    headers: asUser,
    payload: { status: "COMPLETED", title: "Japan (again)" },
  });
  res = await app.inject({ method: "GET", url: "/api/passport", headers: asUser });
  assert.equal(res.json().data[0].visitCount, 1);
});

test("profile stats reflect the completed trip", async () => {
  const res = await app.inject({
    method: "GET",
    url: "/api/profile/stats",
    headers: asUser,
  });
  assert.equal(res.statusCode, 200);
  const s = res.json().data;
  assert.equal(s.countriesVisited, 1);
  assert.equal(s.tripsCompleted, 1);
  assert.ok(s.citiesVisited >= 2); // Kyoto + Tokyo
  assert.ok(s.distanceKm > 300); // Kyoto→Tokyo ~370km
  assert.equal(s.mostVisitedCountry.code, "JP");
});
