import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import Api from "./index";

const TEST_ORIGIN = "http://test.local";

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

const fetchMock = vi.fn();

const lastCall = () => {
  const [url, init] = fetchMock.mock.calls.at(-1) as [URL, RequestInit];
  return { url, init };
};

beforeEach(() => {
  vi.stubGlobal("fetch", fetchMock);
  vi.stubEnv("VITE_BACKEND_URL", `${TEST_ORIGIN}/api`);
});

afterEach(() => {
  fetchMock.mockReset();
  vi.unstubAllGlobals();
  vi.unstubAllEnvs();
});

describe("Api URL resolution", () => {
  it("strips the /api prefix and keeps the resource path", async () => {
    mockFetchJson([]);
    const api = new Api("/api/material");

    await api.getAll();

    expect(lastCall().url.toString()).toBe(`${TEST_ORIGIN}/api/material`);
  });

  it("strips a trailing /{id} from the constructor path", async () => {
    mockFetchJson([]);
    const api = new Api("/api/material/{id}");

    await api.getAll();

    expect(lastCall().url.toString()).toBe(`${TEST_ORIGIN}/api/material`);
  });
});

describe("Api methods", () => {
  it("get() requests the resource by id", async () => {
    const data = { id: 1 };
    mockFetchJson(data);
    const api = new Api("/api/material");

    await expect(api.get(1)).resolves.toEqual(data);

    const { url, init } = lastCall();
    expect(url.toString()).toBe(`${TEST_ORIGIN}/api/material/1`);
    expect(init.method).toBe("GET");
  });

  it("getAll() sends params, skipping nullish values and stringifying", async () => {
    mockFetchJson([]);
    const api = new Api("/api/material");

    await api.getAll({ page: 2, search: undefined, filter: null } as never);

    const { url, init } = lastCall();
    expect(init.method).toBe("GET");
    expect(url.searchParams.get("page")).toBe("2");
    expect(url.searchParams.has("search")).toBe(false);
    expect(url.searchParams.has("filter")).toBe(false);
  });

  it("post() serializes the body and sets JSON headers", async () => {
    const data = { id: 1 };
    const body = { name: "steel" };
    mockFetchJson(data);
    const api = new Api("/api/material");

    await expect(api.post(body as never)).resolves.toEqual(data);

    const { url, init } = lastCall();
    expect(url.toString()).toBe(`${TEST_ORIGIN}/api/material`);
    expect(init.method).toBe("POST");
    expect(init.body).toBe(JSON.stringify(body));
    expect(init.headers).toEqual({ "Content-Type": "application/json" });
  });

  it("patch() targets the id with a serialized body", async () => {
    const body = { name: "steel" };
    mockFetchJson({ id: 5 });
    const api = new Api("/api/material");

    await api.patch(body, 5);

    const { url, init } = lastCall();
    expect(url.toString()).toBe(`${TEST_ORIGIN}/api/material/5`);
    expect(init.method).toBe("PATCH");
    expect(init.body).toBe(JSON.stringify(body));
  });

  it("remove() deletes the resource by id", async () => {
    mockFetchJson({ id: 7 });
    const api = new Api("/api/material");

    await api.remove(7);

    const { url, init } = lastCall();
    expect(url.toString()).toBe(`${TEST_ORIGIN}/api/material/7`);
    expect(init.method).toBe("DELETE");
    expect(init.body).toBeUndefined();
  });

  it("restore() posts to the restore endpoint", async () => {
    mockFetchJson({ id: 9 });
    const api = new Api("/api/material");

    await api.restore(9);

    const { url, init } = lastCall();
    expect(url.toString()).toBe(`${TEST_ORIGIN}/api/material/restore/9`);
    expect(init.method).toBe("POST");
  });
});
