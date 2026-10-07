import { existsSync } from "node:fs";

import { Express } from "express";
import request from "supertest";

import { ErrorMessages } from "@/constants/Errors.js";
import DbSingleton from "@/db/index.js";
import { specJsonPath } from "@/openapi/specPath.js";

import { bootstrap, truncate } from "../e2eSetup.js";

describe("docs e2e", () => {
  let app: Express;

  beforeAll(() => {
    if (!existsSync(specJsonPath)) {
      throw new Error(ErrorMessages.OPENAPI_NOT_FOUND);
    }
    app = bootstrap();
  });

  afterAll(() => {
    DbSingleton.close();
  });

  beforeEach(() => {
    truncate();
  });

  test("serves the swagger-ui page", async () => {
    const res = await request(app).get("/api/docs/");
    expect(res.status).toBe(200);
    expect(res.type).toBe("text/html");
    expect(res.text).toContain("swagger-ui");
    expect(res.text).toContain("swagger-initializer.js");
  });

  test("serves the initializer wired to the local spec", async () => {
    const res = await request(app).get("/api/docs/swagger-initializer.js");
    expect(res.status).toBe(200);
    expect(res.type).toBe("application/javascript");
    expect(res.text).toContain("/api/docs/spec.json");
  });

  test("serves a valid OpenAPI 3.0 spec describing every catalog and supply operation", async () => {
    const res = await request(app).get("/api/docs/spec.json");
    expect(res.status).toBe(200);
    expect((res.body as { openapi?: unknown }).openapi).toBe("3.0.3");

    const paths =
      (res.body as { paths?: Record<string, Record<string, unknown>> }).paths ??
      {};
    const path = (p: string, method: string) => {
      expect(paths[p]![method]!).toBeDefined();
    };
    path("/api/material-type", "get");
    path("/api/material-type", "post");
    path("/api/material-type/{id}", "get");
    path("/api/material-type/{id}", "patch");
    path("/api/material-type/{id}", "delete");
    path("/api/material-type/{id}/restore", "post");
    path("/api/material", "get");
    path("/api/material", "post");
    path("/api/material/{id}", "get");
    path("/api/material/{id}", "patch");
    path("/api/material/{id}", "delete");
    path("/api/material/{id}/restore", "post");
    path("/api/material-variant", "get");
    path("/api/material-variant", "post");
    path("/api/material-variant/{id}", "get");
    path("/api/material-variant/{id}", "patch");
    path("/api/material-variant/{id}", "delete");
    path("/api/material-variant/{id}/restore", "post");
    path("/api/supply", "get");
    path("/api/supply", "post");
    path("/api/supply/{id}", "get");
    path("/api/supply/{id}", "patch");
    path("/api/supply/{id}", "delete");
    path("/api/supply/{id}/restore", "post");
    path("/api/supply/stock/{id}", "get");
    path("/api/supplier", "get");
    path("/api/supplier", "post");
    path("/api/supplier/{id}", "get");
    path("/api/supplier/{id}", "patch");
    path("/api/supplier/{id}", "delete");
    path("/api/supplier/{id}/restore", "post");
    path("/api/settings", "get");
    path("/api/settings", "post");
  });

  test("advertises id params with a usable pattern and no regex flags", async () => {
    const res = await request(app).get("/api/docs/spec.json");
    expect(res.status).toBe(200);

    const paths =
      (res.body as { paths?: Record<string, Record<string, unknown>> }).paths ??
      {};
    const restore = paths["/api/material-type/{id}/restore"] as
      { post?: { parameters?: unknown[] } } | undefined;
    const parameters = (restore?.post?.parameters ?? []) as {
      in?: string;
      schema?: { pattern?: string };
    }[];
    const id = parameters.find((param) => param.in === "path");

    expect(id?.schema?.pattern).toBe("^\\d+$");
    expect(new RegExp(id?.schema?.pattern ?? "").test("42")).toBe(true);
  });

  test("serves the swagger-ui assets", async () => {
    const res = await request(app).get("/api/docs/swagger-ui.css");
    expect(res.status).toBe(200);
    expect(res.type).toBe("text/css");
  });
});
