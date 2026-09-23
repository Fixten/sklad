import { Express } from "express";
import request from "supertest";

import DbSingleton from "@/db/index.js";
import { ErrorResponseZ } from "@/openapi/common.zod.js";

import { bootstrap, truncate } from "../e2eSetup.js";

function expectError(res: request.Response, status: number) {
  expect(res.status).toBe(status);
  expect(res.type).toBe("application/json");
  expect(ErrorResponseZ.safeParse(res.body).success).toBe(true);
}

describe("contract e2e", () => {
  let app: Express;

  beforeAll(() => {
    app = bootstrap();
  });

  afterAll(() => {
    DbSingleton.close();
  });

  beforeEach(() => {
    truncate();
  });

  test("list routes answer 200 with a JSON array", async () => {
    const paths = [
      "/api/material-type",
      "/api/material",
      "/api/material-variant",
      "/api/supply",
      "/api/supplier",
    ];
    for (const path of paths) {
      const res = await request(app).get(path);
      expect(res.status).toBe(200);
      expect(res.type).toBe("application/json");
      expect(Array.isArray(res.body)).toBe(true);
    }
  });

  test("missing resources answer 404 with a validated error body", async () => {
    const paths = [
      "/api/material-type/999",
      "/api/material/999",
      "/api/material-variant/999",
    ];
    for (const path of paths) {
      const res = await request(app).get(path);
      expectError(res, 404);
    }
  });

  test("unknown request fields are rejected with 400 on body routes", async () => {
    const posts = [
      ["/api/material-type", { name: "Wood", extra: true }],
      ["/api/material", { name: "Oak", material_type_id: 1, extra: true }],
      [
        "/api/material-variant",
        { name: "Oak plank", unit: "pieces", material_id: 1, extra: true },
      ],
      ["/api/supply", { variant: 1, extra: true }],
      ["/api/supplier", { supplier: "Timber Co", extra: true }],
      ["/api/settings", { work_hour_cost: 100, extra: true }],
    ] as const;
    for (const [path, body] of posts) {
      const res = await request(app).post(path).send(body);
      expectError(res, 400);
    }
  });

  test("malformed JSON bodies answer 400 with a validated error body", async () => {
    const res = await request(app)
      .post("/api/settings")
      .set("Content-Type", "application/json")
      .send("{not json");
    expectError(res, 400);
  });

  test("malformed ids answer 400 instead of 404", async () => {
    for (const path of ["/api/material-type/abc", "/api/material/abc"]) {
      const res = await request(app).get(path);
      expectError(res, 400);
    }
  });

  test("success responses match the documented row schema", async () => {
    const res = await request(app)
      .post("/api/settings")
      .send({ work_hour_cost: 500 });
    expect(res.status).toBe(200);

    const readback = await request(app).get("/api/settings");
    expect(readback.status).toBe(200);
    expect("work_hour_cost" in readback.body).toBe(true);
    expect("created_at" in readback.body).toBe(true);
  });
});