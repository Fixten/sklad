import { Express } from "express";
import request from "supertest";

import DbSingleton from "@/db/index.js";

import { bodyOf } from "../e2eHelpers.js";
import { bootstrap, truncate } from "../e2eSetup.js";

describe("settings e2e", () => {
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

  test("returns the default labor cost when no settings row exists", async () => {
    const res = await request(app).get("/api/settings");
    expect(res.status).toBe(200);
    expect(bodyOf(res).work_hour_cost).toBe(0);
  });

  test("stores and returns the configured labor cost", async () => {
    const updated = await request(app)
      .post("/api/settings")
      .send({ work_hour_cost: 900 });
    expect(updated.status).toBe(200);

    const readback = await request(app).get("/api/settings");
    expect(readback.status).toBe(200);
    expect(bodyOf(readback).work_hour_cost).toBe(900);
  });

  test("overwrites the configured labor cost", async () => {
    await request(app).post("/api/settings").send({ work_hour_cost: 700 });

    const updated = await request(app)
      .post("/api/settings")
      .send({ work_hour_cost: 1100 });
    expect(updated.status).toBe(200);

    const readback = await request(app).get("/api/settings");
    expect(bodyOf(readback).work_hour_cost).toBe(1100);
  });
});