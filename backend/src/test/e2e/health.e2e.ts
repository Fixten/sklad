import { Express } from "express";
import request from "supertest";

import DbSingleton from "@/db/index.js";

import { bootstrap } from "../e2eSetup.js";

describe("health e2e", () => {
  let app: Express;

  beforeAll(() => {
    app = bootstrap();
  });

  afterAll(() => {
    DbSingleton.close();
  });

  test("reports ok when the database is reachable", async () => {
    const res = await request(app).get("/api/health");
    expect(res.status).toBe(200);
    expect(res.body).toEqual({ status: "ok" });
  });
});
