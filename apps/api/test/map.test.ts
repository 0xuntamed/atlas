import { test, before, after } from "node:test";
import assert from "node:assert/strict";
import type { FastifyInstance } from "fastify";
import { buildApp } from "../src/app";
import { prisma } from "../src/db/prisma";

/**
 * Phase 3: the globe's per-country states are derived from trips + saved places
 * + visited countries, with priority visited > planned > wishlist.
 */

const USER = `test_map_${Date.now()}`;
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

async function states() {
  const res = await app.inject({
    method: "GET",
    url: "/api/map/countries",
    headers: asUser,
  });
  assert.equal(res.statusCode, 200);
  const map: Record<string, string> = {};
  for (const e of res.json().data as { code: string; state: string }[]) {
    map[e.code] = e.state;
  }
  return map;
}

test("planned trip → planned; saved-only country → wishlist", async () => {
  // A planned trip in Japan.
  await app.inject({
    method: "POST",
    url: "/api/trips",
    headers: asUser,
    payload: { title: "Japan", countryCode: "JP", status: "PLANNED" },
  });
  // A saved place in France, but no trip there.
  await app.inject({
    method: "POST",
    url: "/api/saved-places",
    headers: asUser,
    payload: { externalPlaceId: "mock:fr-eiffel", name: "Eiffel", countryCode: "FR" },
  });

  const map = await states();
  assert.equal(map.JP, "planned");
  assert.equal(map.FR, "wishlist");
});

test("completed trip → visited (outranks planned/wishlist)", async () => {
  const res = await app.inject({
    method: "POST",
    url: "/api/trips",
    headers: asUser,
    payload: { title: "Italy", countryCode: "IT", status: "COMPLETED" },
  });
  assert.equal(res.statusCode, 201);

  const map = await states();
  assert.equal(map.IT, "visited");
});
