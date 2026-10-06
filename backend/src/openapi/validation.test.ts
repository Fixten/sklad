import { z } from "zod";

import { queryOf, validateQuery } from "./validation.js";

import type { NextFunction, Request, Response } from "express";

const querySchema = z.object({
  material_variant_id: z.coerce.number().int().optional(),
});

/**
 * Express 5 defines `req.query` as a getter that re-parses on every access, so
 * the fake mirrors that: reading it twice yields two different objects.
 */
function fakeRequest(query: unknown): Request {
  const req = { url: "/api/supply" } as unknown as Request;
  Object.defineProperty(req, "query", {
    get: () => structuredClone(query),
  });
  return req;
}

function fakeResponse(): Response {
  const res = {
    statusCode: 200,
    locals: {},
    json: jest.fn(),
  } as unknown as Response;
  res.status = jest.fn().mockReturnValue(res);
  return res;
}

describe("validateQuery", () => {
  test("rejects an invalid query with 400", () => {
    const req = fakeRequest({ material_variant_id: "abc" });
    const res = fakeResponse();
    const next = jest.fn() as NextFunction;

    validateQuery(querySchema)(req, res, next);

    expect(next).not.toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(400);
    expect(queryOf(res)).toBeUndefined();
  });

  test("exposes the coerced numbers, not the raw query strings", () => {
    const req = fakeRequest({ material_variant_id: "42" });
    const res = fakeResponse();
    const next = jest.fn() as NextFunction;

    validateQuery(querySchema)(req, res, next);

    expect(next).toHaveBeenCalled();
    expect(queryOf(res)).toEqual({ material_variant_id: 42 });
  });

  test("passes an absent filter through as undefined", () => {
    const req = fakeRequest({});
    const res = fakeResponse();
    const next = jest.fn() as NextFunction;

    validateQuery(querySchema)(req, res, next);

    expect(queryOf(res)).toEqual({ material_variant_id: undefined });
  });
});
