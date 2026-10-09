import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { ErrorMessages } from "../constants/Errors";

import { ApiError } from "./api-error";
import {
  applySearchParams,
  fetchApi,
  getApiUrl,
  pickCorrectBase,
} from "./helpers";

const TEST_ORIGIN = "http://test.local";

const fetchMock = vi.fn();

const mockFetchJson = (
  data: unknown,
  init: { ok?: boolean; status?: number } = {},
) => {
  const response = {
    ok: init.ok ?? true,
    status: init.status ?? 200,
    json: vi.fn().mockResolvedValue(data),
  };
  fetchMock.mockResolvedValue(response);
  return response;
};

const mockFetch = () => {
  const response = {
    ok: true,
    status: 200,
    json: vi.fn(),
  };
  fetchMock.mockResolvedValue(response);
  return response;
};

beforeEach(() => {
  vi.stubGlobal("fetch", fetchMock);
});

afterEach(() => {
  fetchMock.mockReset();
  vi.unstubAllGlobals();
  vi.unstubAllEnvs();
});

describe("pickCorrectBase", () => {
  it("returns VITE_BACKEND_URL when configured", () => {
    vi.stubEnv("VITE_BACKEND_URL", "https://api.example.com/api");
    expect(pickCorrectBase()).toBe("https://api.example.com/api");
  });

  it("falls back to localhost with the backend port", () => {
    vi.stubEnv("VITE_BACKEND_URL", undefined);
    vi.stubEnv("VITE_BACKEND_PORT", "1100");
    expect(pickCorrectBase()).toBe("http://localhost:1100");
  });
});

describe("getApiUrl", () => {
  beforeEach(() => {
    vi.stubEnv("VITE_BACKEND_URL", `${TEST_ORIGIN}/api`);
  });

  it("strips the leading /api/ segment and resolves against the base", () => {
    expect(getApiUrl("/api/material").toString()).toBe(
      `${TEST_ORIGIN}/api/material`,
    );
  });

  it("accepts a path without the /api/ prefix", () => {
    expect(getApiUrl("material").toString()).toBe(
      `${TEST_ORIGIN}/api/material`,
    );
  });

  it("resolves a bare /api/ to the base root", () => {
    expect(getApiUrl("/api/").toString()).toBe(`${TEST_ORIGIN}/api/`);
  });
});

describe("applySearchParams", () => {
  it("sets stringified values on the url", () => {
    const url = new URL("http://test.local/items");
    applySearchParams(url, { page: 2, name: "steel" });
    expect(url.searchParams.get("page")).toBe("2");
    expect(url.searchParams.get("name")).toBe("steel");
  });

  it("skips null and undefined values", () => {
    const url = new URL("http://test.local/items");
    applySearchParams(url, { a: null, b: undefined, c: 1 });
    expect(url.searchParams.has("a")).toBe(false);
    expect(url.searchParams.has("b")).toBe(false);
    expect(url.searchParams.get("c")).toBe("1");
  });

  it("keeps falsy but defined values", () => {
    const url = new URL("http://test.local/items");
    applySearchParams(url, { zero: 0, flag: false, empty: "" });
    expect(url.searchParams.get("zero")).toBe("0");
    expect(url.searchParams.get("flag")).toBe("false");
    expect(url.searchParams.get("empty")).toBe("");
  });

  it.each([
    ["undefined", undefined],
    ["null", null],
    ["string", "nope"],
    ["number", 7],
  ])("ignores non-object params (%s)", (_label, params) => {
    const url = new URL("http://test.local/items");
    applySearchParams(url, params as never);
    expect(url.search).toBe("");
  });

  it("appends without clearing existing params", () => {
    const url = new URL("http://test.local/items?keep=1");
    applySearchParams(url, { added: 2 });
    expect(url.searchParams.get("keep")).toBe("1");
    expect(url.searchParams.get("added")).toBe("2");
  });
});

describe("fetchApi", () => {
  const url = new URL("http://test.local/items");

  it("passes url, method, body and headers and returns parsed json", async () => {
    const data = { id: 1 };
    mockFetchJson(data);

    await expect(fetchApi(url, "POST", '{"a":1}')).resolves.toEqual(data);

    expect(fetchMock).toHaveBeenCalledWith(url, {
      method: "POST",
      body: '{"a":1}',
      headers: { "Content-Type": "application/json" },
    });
  });

  it("sends no body for a GET", async () => {
    mockFetchJson([]);

    await fetchApi(url, "GET");

    expect(fetchMock).toHaveBeenCalledWith(url, {
      method: "GET",
      body: undefined,
      headers: { "Content-Type": "application/json" },
    });
  });

  it("throws FAILED_REQUEST with status 0 when fetch rejects", async () => {
    fetchMock.mockRejectedValue(new Error("network down"));

    await expect(fetchApi(url, "GET")).rejects.toMatchObject({
      name: "ApiError",
      message: ErrorMessages.FAILED_REQUEST,
      status: 0,
    });
  });

  it("throws INVALID_JSON_RESPONSE when the body is not JSON", async () => {
    const response = mockFetch();
    response.json.mockRejectedValue(new Error("bad json"));

    await expect(fetchApi(url, "GET")).rejects.toMatchObject({
      message: ErrorMessages.INVALID_JSON_RESPONSE,
      status: 200,
    });
  });

  it("throws INVALID_JSON_RESPONSE when the body is null", async () => {
    mockFetchJson(null);

    await expect(fetchApi(url, "GET")).rejects.toMatchObject({
      message: ErrorMessages.INVALID_JSON_RESPONSE,
      status: 200,
    });
  });

  it("surfaces the server message on a failed response", async () => {
    mockFetchJson({ message: "not found" }, { ok: false, status: 404 });

    let error: unknown;
    try {
      await fetchApi(url, "GET");
    } catch (caught) {
      error = caught;
    }
    expect(error).toBeInstanceOf(ApiError);
    expect(error).toMatchObject({ message: "not found", status: 404 });
  });

  it("falls back to FAILED_REQUEST on a failed response without a message", async () => {
    mockFetchJson({ detail: "x" }, { ok: false, status: 500 });

    await expect(fetchApi(url, "GET")).rejects.toMatchObject({
      message: ErrorMessages.FAILED_REQUEST,
      status: 500,
    });
  });
});
