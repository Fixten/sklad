import { describe, expect, it } from "vitest";

import { ErrorMessages } from "../constants/Errors";

import { ApiError, getServerError, retryApiError } from "./api-error";

describe("ApiError", () => {
  it("exposes message, name and status", () => {
    const error = new ApiError("boom", 500);
    expect(error).toBeInstanceOf(Error);
    expect(error.name).toBe("ApiError");
    expect(error.message).toBe("boom");
    expect(error.status).toBe(500);
  });
});

describe("getServerError", () => {
  it("uses the server message when present", () => {
    const error = getServerError(409, { message: "already exists" });
    expect(error).toBeInstanceOf(ApiError);
    expect(error.message).toBe("already exists");
    expect(error.status).toBe(409);
  });

  it.each([
    ["null body", null],
    ["non-object body", "nope"],
    ["missing message", { detail: "x" }],
    ["non-string message", { message: 42 }],
  ])("falls back to FAILED_REQUEST for %s", (_label, body) => {
    const error = getServerError(400, body);
    expect(error.message).toBe(ErrorMessages.FAILED_REQUEST);
    expect(error.status).toBe(400);
  });
});

describe("retryApiError", () => {
  it.each([0, 500, 503])(
    "retries status %i under the attempt limit",
    (status) => {
      expect(retryApiError(0, new ApiError("x", status))).toBe(true);
      expect(retryApiError(2, new ApiError("x", status))).toBe(true);
    },
  );

  it("stops retrying at the attempt limit", () => {
    expect(retryApiError(3, new ApiError("x", 500))).toBe(false);
  });

  it.each([400, 404, 409])(
    "never retries deterministic 4xx status %i",
    (status) => {
      expect(retryApiError(0, new ApiError("x", status))).toBe(false);
    },
  );
});
