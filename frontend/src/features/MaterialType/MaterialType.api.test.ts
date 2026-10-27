import { afterEach, describe, expect, it, vi } from "vitest";

import { stubRoutes } from "@/test/apiStub";

import MaterialTypeApi from "./MaterialType.api";

import type {
  MaterialTypeDTO,
  MaterialTypeModel,
  MaterialTypePatchDTO,
} from "./MaterialType.model";

const createdAt = "2026-01-01T00:00:00Z";

const materialType: MaterialTypeModel = {
  id: 1,
  name: "Пиломатериал",
  created_at: createdAt,
};

const typeBody: MaterialTypeDTO = { name: "Пиломатериал" };

const patchBody: MaterialTypePatchDTO = { description: "Доски и бруски" };

const stubApi = () =>
  stubRoutes({
    "/api/material-type": {
      get: () => [materialType],
      post: () => materialType,
    },
    "/api/material-type/{id}": {
      get: () => materialType,
      patch: () => materialType,
      delete: () => ({ message: "Тип материала удалён" }),
    },
    "/api/material-type/restore/{id}": {
      post: () => materialType,
    },
  });

afterEach(() => {
  vi.unstubAllGlobals();
});

describe("MaterialTypeApi", () => {
  const api = new MaterialTypeApi();

  it("getAll() lists material types", async () => {
    const requests = stubApi();

    await expect(api.getAll()).resolves.toEqual([materialType]);

    expect(requests.at(-1)).toMatchObject({
      path: "/api/material-type",
      method: "GET",
    });
  });

  it("get() requests a material type by id", async () => {
    const requests = stubApi();

    await expect(api.get(1)).resolves.toEqual(materialType);

    expect(requests.at(-1)).toMatchObject({
      path: "/api/material-type/1",
      method: "GET",
    });
  });

  it("create() posts the material type body", async () => {
    const requests = stubApi();

    await expect(api.create(typeBody)).resolves.toEqual(materialType);

    expect(requests.at(-1)).toMatchObject({
      path: "/api/material-type",
      method: "POST",
      body: typeBody,
    });
  });

  it("update() patches the material type by id", async () => {
    const requests = stubApi();

    await expect(api.update(patchBody, 1)).resolves.toEqual(materialType);

    expect(requests.at(-1)).toMatchObject({
      path: "/api/material-type/1",
      method: "PATCH",
      body: patchBody,
    });
  });

  it("remove() deletes the material type by id", async () => {
    const requests = stubApi();

    await api.remove(1);

    expect(requests.at(-1)).toMatchObject({
      path: "/api/material-type/1",
      method: "DELETE",
    });
  });

  it("restore() posts to the restore endpoint", async () => {
    const requests = stubApi();

    await expect(api.restore(1)).resolves.toEqual(materialType);

    expect(requests.at(-1)).toMatchObject({
      path: "/api/material-type/restore/1",
      method: "POST",
    });
  });
});
