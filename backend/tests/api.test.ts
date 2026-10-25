import { test, describe, before, after } from "node:test";
import assert from "node:assert/strict";
import type { Server } from "node:http";
import { createApp } from "../src/app";

/**
 * Real integration test: starts the actual Express app on an ephemeral port
 * and hits it with genuine HTTP requests via Node's built-in fetch. No mocks,
 * no supertest dependency — this is the real request/response cycle.
 */
let server: Server;
let baseUrl: string;

const validOffer = {
  company: "Acme Corp",
  role: "SDE-1",
  location: "Bengaluru",
  baseSalary: 1200000,
  joiningBonus: 100000,
  performanceBonus: 100000,
  retentionBonus: 0,
  rsus: 800000,
  vestingSchedule: [
    { year: 1, percentage: 25 },
    { year: 2, percentage: 25 },
    { year: 3, percentage: 25 },
    { year: 4, percentage: 25 },
  ],
  employerPF: 43200,
  employeePF: 43200,
  hra: 300000,
  gratuity: 57692,
  specialAllowance: 200000,
  reportedCTC: 2700000,
};

before(async () => {
  const app = createApp();
  await new Promise<void>((resolve) => {
    server = app.listen(0, () => resolve());
  });
  const address = server.address();
  const port = typeof address === "object" && address ? address.port : 0;
  baseUrl = `http://localhost:${port}`;
});

after(async () => {
  await new Promise<void>((resolve) => server.close(() => resolve()));
});

describe("GET /health", () => {
  test("returns 200 ok", async () => {
    const res = await fetch(`${baseUrl}/health`);
    assert.equal(res.status, 200);
    const body = await res.json();
    assert.equal(body.status, "ok");
  });
});

describe("POST /api/calculate", () => {
  test("returns a calculation result for a valid offer", async () => {
    const res = await fetch(`${baseUrl}/api/calculate`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(validOffer),
    });
    assert.equal(res.status, 200);
    const body = await res.json();
    assert.ok(typeof body.monthlyInHand === "number");
    assert.ok(typeof body.recommendedRegime === "string");
    assert.equal(body.yearWiseCompensation.length, 4);
  });

  test("returns 400 with field-level detail for a malformed offer", async () => {
    const res = await fetch(`${baseUrl}/api/calculate`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...validOffer, baseSalary: "not a number" }),
    });
    assert.equal(res.status, 400);
    const body = await res.json();
    assert.equal(body.error, "Invalid request body");
    assert.ok(Array.isArray(body.details));
  });

  test("returns 400 when vesting schedule doesn't sum to 100", async () => {
    const res = await fetch(`${baseUrl}/api/calculate`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...validOffer,
        vestingSchedule: [{ year: 1, percentage: 50 }],
      }),
    });
    assert.equal(res.status, 400);
    const body = await res.json();
    assert.match(body.error, /expected 100/);
  });

  test("returns 400 when required fields are missing entirely", async () => {
    const res = await fetch(`${baseUrl}/api/calculate`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ company: "Acme Corp" }),
    });
    assert.equal(res.status, 400);
  });
});
