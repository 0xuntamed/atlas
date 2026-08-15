import { test, before, after } from "node:test";
import assert from "node:assert/strict";
import type { FastifyInstance } from "fastify";
import { buildApp } from "../src/app";
import { prisma } from "../src/db/prisma";

/**
 * Phase 2 integration: country/place discovery, saving external places, and
 * dropping a discovered place into an itinerary. Countries + places run fully
 * offline (world-countries dataset + mock provider); the weather check tolerates
 * an upstream outage so the suite stays deterministic.
 */

const USER = `test_disc_${Date.now()}`;
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

test("country search + detail", async () => {
  let res = await app.inject({
    method: "GET",
    url: "/api/countries?search=japan",
    headers: asUser,
  });
  assert.equal(res.statusCode, 200);
  const list = res.json().data as { code: string; name: string }[];
  assert.ok(list.some((c) => c.code === "JP"));

  res = await app.inject({
    method: "GET",
    url: "/api/countries/JP",
    headers: asUser,
  });
  assert.equal(res.statusCode, 200);
  const jp = res.json().data;
  assert.equal(jp.code, "JP");
  assert.equal(jp.capital, "Tokyo");
  assert.equal(jp.nativeName, "日本");
});

test("short country search returns empty (no upstream hit)", async () => {
  const res = await app.inject({
    method: "GET",
    url: "/api/countries?search=j",
    headers: asUser,
  });
  assert.equal(res.statusCode, 200);
  assert.deepEqual(res.json().data, []);
});

test("place discovery returns slim places", async () => {
  const res = await app.inject({
    method: "GET",
    url: "/api/places/search?country=JP&q=kyoto",
    headers: asUser,
  });
  assert.equal(res.statusCode, 200);
  const places = res.json().data as { externalPlaceId: string; name: string }[];
  assert.ok(places.length > 0);
  for (const p of places) {
    assert.ok(p.externalPlaceId);
    assert.ok(p.name);
  }
});

test("save external place is idempotent, then deletable", async () => {
  const payload = {
    externalPlaceId: "mock:jp-kinkakuji",
    name: "Kinkaku-ji",
    countryCode: "JP",
    latitude: 35.0394,
    longitude: 135.7292,
    category: "temple",
  };

  let res = await app.inject({
    method: "POST",
    url: "/api/saved-places",
    headers: asUser,
    payload,
  });
  assert.equal(res.statusCode, 201);
  const saved = res.json().data;

  // Re-saving the same external place is a no-op (200, same row).
  res = await app.inject({
    method: "POST",
    url: "/api/saved-places",
    headers: asUser,
    payload,
  });
  assert.equal(res.statusCode, 200);
  assert.equal(res.json().data.id, saved.id);

  res = await app.inject({
    method: "GET",
    url: "/api/saved-places?country=JP",
    headers: asUser,
  });
  assert.equal(res.json().data.length, 1);

  res = await app.inject({
    method: "DELETE",
    url: `/api/saved-places/${saved.id}`,
    headers: asUser,
  });
  assert.equal(res.statusCode, 204);
});

test("add a discovered place directly into an itinerary", async () => {
  // Set up a trip + day.
  let res = await app.inject({
    method: "POST",
    url: "/api/trips",
    headers: asUser,
    payload: { title: "Japan 2026", countryCode: "JP" },
  });
  const trip = res.json().data;
  res = await app.inject({
    method: "POST",
    url: `/api/trips/${trip.id}/days`,
    headers: asUser,
    payload: { title: "Day 1" },
  });
  const day = res.json().data;

  // Add an external place (the slim discovery fields).
  res = await app.inject({
    method: "POST",
    url: `/api/trip-days/${day.id}/places`,
    headers: asUser,
    payload: {
      externalPlaceId: "mock:jp-fushimi-inari",
      name: "Fushimi Inari Taisha",
      latitude: 34.9671,
      longitude: 135.7727,
      category: "shrine",
    },
  });
  assert.equal(res.statusCode, 201);

  // It shows up in the itinerary with the external id preserved.
  res = await app.inject({
    method: "GET",
    url: `/api/trips/${trip.id}`,
    headers: asUser,
  });
  const place = res.json().data.days[0].places[0];
  assert.equal(place.name, "Fushimi Inari Taisha");
  assert.equal(place.externalPlaceId, "mock:jp-fushimi-inari");

  await app.inject({
    method: "DELETE",
    url: `/api/trips/${trip.id}`,
    headers: asUser,
  });
});

test("weather endpoint is wired (data or graceful 503)", async () => {
  const res = await app.inject({
    method: "GET",
    url: "/api/weather?country=JP",
    headers: asUser,
  });
  assert.ok([200, 503].includes(res.statusCode));
  if (res.statusCode === 200) {
    const w = res.json().data;
    assert.ok("temperatureC" in w);
    assert.ok("description" in w);
  } else {
    assert.equal(res.json().error.code, "UPSTREAM_UNAVAILABLE");
  }
});
