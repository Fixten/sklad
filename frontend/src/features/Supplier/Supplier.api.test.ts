import { afterEach, describe, expect, it, vi } from "vitest";

import { stubRoutes } from "@/test/apiStub.vitest";

import SupplierApi from "./Supplier.api";

import type {
  SupplierDTO,
  SupplierModel,
  SupplierPatchDTO,
} from "./Supplier.model";

const createdAt = "2026-01-01T00:00:00Z";

const supplier: SupplierModel = {
  id: 5,
  name: "Столярный двор",
  created_at: createdAt,
};

const supplierBody: SupplierDTO = { name: "Столярный двор" };

const patchBody: SupplierPatchDTO = { contact: "+7 900 000-00-00" };

const stubApi = () =>
  stubRoutes({
    "/api/supplier": {
      get: () => [supplier],
      post: () => supplier,
    },
    "/api/supplier/{id}": {
      get: () => supplier,
      patch: () => supplier,
      delete: () => ({ message: "Поставщик удалён" }),
    },
    "/api/supplier/restore/{id}": {
      post: () => supplier,
    },
  });

afterEach(() => {
  vi.unstubAllGlobals();
});

describe("SupplierApi", () => {
  const api = new SupplierApi();

  it("getAll() lists suppliers", async () => {
    const requests = stubApi();

    await expect(api.getAll()).resolves.toEqual([supplier]);

    expect(requests.at(-1)).toMatchObject({
      path: "/api/supplier",
      method: "GET",
    });
  });

  it("get() requests a supplier by id", async () => {
    const requests = stubApi();

    await expect(api.get(5)).resolves.toEqual(supplier);

    expect(requests.at(-1)).toMatchObject({
      path: "/api/supplier/5",
      method: "GET",
    });
  });

  it("create() posts the supplier body", async () => {
    const requests = stubApi();

    await expect(api.create(supplierBody)).resolves.toEqual(supplier);

    expect(requests.at(-1)).toMatchObject({
      path: "/api/supplier",
      method: "POST",
      body: supplierBody,
    });
  });

  it("update() patches the supplier by id", async () => {
    const requests = stubApi();

    await expect(api.update(patchBody, 5)).resolves.toEqual(supplier);

    expect(requests.at(-1)).toMatchObject({
      path: "/api/supplier/5",
      method: "PATCH",
      body: patchBody,
    });
  });

  it("remove() deletes the supplier by id", async () => {
    const requests = stubApi();

    await api.remove(5);

    expect(requests.at(-1)).toMatchObject({
      path: "/api/supplier/5",
      method: "DELETE",
    });
  });

  it("restore() posts to the restore endpoint", async () => {
    const requests = stubApi();

    await expect(api.restore(5)).resolves.toEqual(supplier);

    expect(requests.at(-1)).toMatchObject({
      path: "/api/supplier/restore/5",
      method: "POST",
    });
  });
});
