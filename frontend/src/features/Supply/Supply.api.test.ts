import { afterEach, describe, expect, it, vi } from "vitest";

import { stubRoutes } from "@/test/apiStub";

import SupplyApi from "./Supply.api";

import type {
  SupplyDTO,
  SupplyModel,
  SupplyPatchDTO,
  SupplyStock,
} from "./Supply.model";

const createdAt = "2026-01-01T00:00:00Z";

const supply: SupplyModel = {
  id: 30,
  description: null,
  purchase_price: 24000,
  quantity: 8,
  unit: "meters",
  remaining_quantity: 8,
  unit_purchase_cost: 3000,
  url: null,
  material_variant_id: 100,
  supplier_id: 5,
  created_at: createdAt,
};

const stock: SupplyStock = {
  material_variant_id: 100,
  unit: "meters",
  quantity: 8,
};

const supplyBody: SupplyDTO = {
  material_variant_id: 100,
  quantity: 8,
  purchase_price: 24000,
};

const patchBody: SupplyPatchDTO = { description: "Новая партия" };

const stubApi = () =>
  stubRoutes({
    "/api/supply": {
      get: () => [supply],
      post: () => supply,
    },
    "/api/supply/{id}": {
      get: () => supply,
      patch: () => supply,
      delete: () => ({ message: "Поставка удалена" }),
    },
    "/api/supply/stock/{id}": {
      get: () => stock,
    },
    "/api/supply/restore/{id}": {
      post: () => supply,
    },
  });

afterEach(() => {
  vi.unstubAllGlobals();
});

describe("SupplyApi", () => {
  const api = new SupplyApi();

  it("getAll() lists supplies with the query params", async () => {
    const requests = stubApi();

    await expect(api.getAll({ supplier_id: 5 })).resolves.toEqual([supply]);

    expect(requests.at(-1)).toMatchObject({
      path: "/api/supply",
      search: "?supplier_id=5",
      method: "GET",
    });
  });

  it("get() requests a supply by id", async () => {
    const requests = stubApi();

    await expect(api.get(30)).resolves.toEqual(supply);

    expect(requests.at(-1)).toMatchObject({
      path: "/api/supply/30",
      method: "GET",
    });
  });

  it("getStock() requests the stock of a material variant", async () => {
    const requests = stubApi();

    await expect(api.getStock(100)).resolves.toEqual(stock);

    expect(requests.at(-1)).toMatchObject({
      path: "/api/supply/stock/100",
      method: "GET",
    });
  });

  it("create() posts the supply body", async () => {
    const requests = stubApi();

    await expect(api.create(supplyBody)).resolves.toEqual(supply);

    expect(requests.at(-1)).toMatchObject({
      path: "/api/supply",
      method: "POST",
      body: supplyBody,
    });
  });

  it("update() patches the supply by id", async () => {
    const requests = stubApi();

    await expect(api.update(patchBody, 30)).resolves.toEqual(supply);

    expect(requests.at(-1)).toMatchObject({
      path: "/api/supply/30",
      method: "PATCH",
      body: patchBody,
    });
  });

  it("remove() deletes the supply by id", async () => {
    const requests = stubApi();

    await api.remove(30);

    expect(requests.at(-1)).toMatchObject({
      path: "/api/supply/30",
      method: "DELETE",
    });
  });

  it("restore() posts to the restore endpoint", async () => {
    const requests = stubApi();

    await expect(api.restore(30)).resolves.toEqual(supply);

    expect(requests.at(-1)).toMatchObject({
      path: "/api/supply/restore/30",
      method: "POST",
    });
  });
});
