import { afterEach, describe, expect, it, vi } from "vitest";

import { stubRoutes } from "@/test/apiStub.vitest";

import MaterialApi from "./Material.api";

import type { MaterialDTO, MaterialModel } from "./Material.model";

const createdAt = "2026-01-01T00:00:00Z";

const material: MaterialModel = {
  id: 10,
  name: "Дуб",
  material_type_id: 1,
  created_at: createdAt,
};

const materialBody: MaterialDTO = { name: "Дуб", material_type_id: 1 };

const patchBody: MaterialDTO = { name: "Ясень", material_type_id: 2 };

const stubApi = () =>
  stubRoutes({
    "/api/material": {
      get: () => [material],
      post: () => material,
    },
    "/api/material/{id}": {
      patch: () => material,
      delete: () => ({ message: "Материал удалён" }),
    },
    "/api/material/restore/{id}": {
      post: () => material,
    },
  });

afterEach(() => {
  vi.unstubAllGlobals();
});

describe("MaterialApi", () => {
  const api = new MaterialApi();

  it("getAll() lists materials", async () => {
    const requests = stubApi();

    await expect(api.getAll()).resolves.toEqual([material]);

    expect(requests.at(-1)).toMatchObject({
      path: "/api/material",
      method: "GET",
    });
  });

  it("create() posts the material body", async () => {
    const requests = stubApi();

    await expect(api.create(materialBody)).resolves.toEqual(material);

    expect(requests.at(-1)).toMatchObject({
      path: "/api/material",
      method: "POST",
      body: materialBody,
    });
  });

  it("update() patches the material by id", async () => {
    const requests = stubApi();

    await expect(api.update(patchBody, 10)).resolves.toEqual(material);

    expect(requests.at(-1)).toMatchObject({
      path: "/api/material/10",
      method: "PATCH",
      body: patchBody,
    });
  });

  it("remove() deletes the material by id", async () => {
    const requests = stubApi();

    await api.remove(10);

    expect(requests.at(-1)).toMatchObject({
      path: "/api/material/10",
      method: "DELETE",
    });
  });

  it("restore() posts to the restore endpoint", async () => {
    const requests = stubApi();

    await expect(api.restore(10)).resolves.toEqual(material);

    expect(requests.at(-1)).toMatchObject({
      path: "/api/material/restore/10",
      method: "POST",
    });
  });
});
