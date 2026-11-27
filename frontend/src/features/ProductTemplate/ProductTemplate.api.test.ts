import { afterEach, describe, expect, it, vi } from "vitest";

import { stubRoutes, takeUnhandledRequests } from "@/test/apiStub.vitest";

import ProductTemplateApi from "./ProductTemplate.api";
import type {
  ProductTemplateDTO,
  ProductTemplateModel,
  ProductTemplatePatchDTO,
} from "./ProductTemplate.model";

const createdAt = "2026-01-01T00:00:00Z";

const productTemplate: ProductTemplateModel = {
  id: 10,
  name: "Стол",
  description: null,
  production_instructions: "Собрать столешницу",
  drawing_description: null,
  expected_production_work_hours: 1.25,
  development_work_hours: null,
  materials: [{ material_variant_id: 100, quantity: 2.5 }],
  created_at: createdAt,
  deleted_at: null,
};

const productTemplateBody: ProductTemplateDTO = {
  name: "Стол",
  description: null,
  production_instructions: "Собрать столешницу",
  drawing_description: null,
  expected_production_work_hours: "1.250",
  development_work_hours: null,
  materials: [{ material_variant_id: 100, quantity: "2.500" }],
};

const patchBody: ProductTemplatePatchDTO = {
  name: "Обеденный стол",
  production_instructions: null,
  expected_production_work_hours: 0,
  materials: [],
};

const stubApi = () =>
  stubRoutes({
    "/api/product-template": {
      get: () => [productTemplate],
      post: () => productTemplate,
    },
    "/api/product-template/{id}": {
      patch: () => productTemplate,
      delete: () => ({ message: "Шаблон удалён" }),
    },
    "/api/product-template/restore/{id}": {
      post: () => productTemplate,
    },
  });

afterEach(() => {
  vi.unstubAllGlobals();
});

describe("ProductTemplateApi", () => {
  const api = new ProductTemplateApi();

  it("getAll() lists hidden-inclusive product templates", async () => {
    const requests = stubApi();

    await expect(api.getAll({ hidden: "true" })).resolves.toEqual([
      productTemplate,
    ]);

    expect(requests.at(-1)).toMatchObject({
      path: "/api/product-template",
      method: "GET",
      search: "?hidden=true",
    });
    expect(takeUnhandledRequests()).toEqual([]);
  });

  it("create() posts the product template body", async () => {
    const requests = stubApi();

    await expect(api.create(productTemplateBody)).resolves.toEqual(
      productTemplate,
    );

    expect(requests.at(-1)).toMatchObject({
      path: "/api/product-template",
      method: "POST",
      body: productTemplateBody,
    });
    expect(takeUnhandledRequests()).toEqual([]);
  });

  it("update() patches the product template by id", async () => {
    const requests = stubApi();

    await expect(api.update({ dto: patchBody, id: 10 })).resolves.toEqual(
      productTemplate,
    );

    expect(requests.at(-1)).toMatchObject({
      path: "/api/product-template/10",
      method: "PATCH",
      body: patchBody,
    });
    expect(takeUnhandledRequests()).toEqual([]);
  });

  it("remove() deletes the product template by id", async () => {
    const requests = stubApi();

    await api.remove(10);

    expect(requests.at(-1)).toMatchObject({
      path: "/api/product-template/10",
      method: "DELETE",
    });
    expect(takeUnhandledRequests()).toEqual([]);
  });

  it("restore() posts to the restore endpoint", async () => {
    const requests = stubApi();

    await expect(api.restore(10)).resolves.toEqual(productTemplate);

    expect(requests.at(-1)).toMatchObject({
      path: "/api/product-template/restore/10",
      method: "POST",
    });
    expect(takeUnhandledRequests()).toEqual([]);
  });
});
