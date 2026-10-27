import { afterEach, describe, expect, it, vi } from "vitest";

import { stubRoutes } from "@/test/apiStub";

import VariantApi from "./Variant.api";

import type {
  VariantDTO,
  VariantModel,
  VariantPatchDTO,
} from "./Variant.model";

const createdAt = "2026-01-01T00:00:00Z";

const variant: VariantModel = {
  id: 100,
  name: "Доска 40 мм",
  unit: "meters",
  material_id: 10,
  created_at: createdAt,
};

const variantBody: VariantDTO = {
  name: "Доска 40 мм",
  unit: "meters",
  material_id: 10,
};

const patchBody: VariantPatchDTO = { name: "Доска 50 мм" };

const stubApi = () =>
  stubRoutes({
    "/api/material-variant": {
      get: () => [variant],
      post: () => variant,
    },
    "/api/material-variant/{id}": {
      get: () => variant,
      patch: () => variant,
      delete: () => ({ message: "Вариант удалён" }),
    },
    "/api/material-variant/restore/{id}": {
      post: () => variant,
    },
  });

afterEach(() => {
  vi.unstubAllGlobals();
});

describe("VariantApi", () => {
  const api = new VariantApi();

  it("getAll() lists variants", async () => {
    const requests = stubApi();

    await expect(api.getAll()).resolves.toEqual([variant]);

    expect(requests.at(-1)).toMatchObject({
      path: "/api/material-variant",
      method: "GET",
    });
  });

  it("get() requests a variant by id", async () => {
    const requests = stubApi();

    await expect(api.get(100)).resolves.toEqual(variant);

    expect(requests.at(-1)).toMatchObject({
      path: "/api/material-variant/100",
      method: "GET",
    });
  });

  it("create() posts the variant body", async () => {
    const requests = stubApi();

    await expect(api.create(variantBody)).resolves.toEqual(variant);

    expect(requests.at(-1)).toMatchObject({
      path: "/api/material-variant",
      method: "POST",
      body: variantBody,
    });
  });

  it("update() patches the variant by id", async () => {
    const requests = stubApi();

    await expect(api.update(patchBody, 100)).resolves.toEqual(variant);

    expect(requests.at(-1)).toMatchObject({
      path: "/api/material-variant/100",
      method: "PATCH",
      body: patchBody,
    });
  });

  it("remove() deletes the variant by id", async () => {
    const requests = stubApi();

    await api.remove(100);

    expect(requests.at(-1)).toMatchObject({
      path: "/api/material-variant/100",
      method: "DELETE",
    });
  });

  it("restore() posts to the restore endpoint", async () => {
    const requests = stubApi();

    await expect(api.restore(100)).resolves.toEqual(variant);

    expect(requests.at(-1)).toMatchObject({
      path: "/api/material-variant/restore/100",
      method: "POST",
    });
  });
});
