import type { components } from "@/api/schema";
import { createApiStub } from "@/test/apiStub";
import type { Routes } from "@/test/apiStub";

type Schemas = components["schemas"];

const createdAt = "2026-01-01T00:00:00Z";

const types: Schemas["MaterialType"][] = [
  { id: 1, name: "Пиломатериал", created_at: createdAt },
];

const materials: Schemas["Material"][] = [
  { id: 10, name: "Дуб", material_type_id: 1, created_at: createdAt },
];

const variants: Schemas["MaterialVariant"][] = [
  {
    id: 100,
    name: "Доска 40 мм",
    unit: "meters",
    material_id: 10,
    created_at: createdAt,
  },
  {
    id: 101,
    name: "Брусок 60 × 60",
    unit: "meters",
    material_id: 10,
    created_at: createdAt,
  },
  {
    id: 102,
    name: "Рейка 20 × 40",
    unit: "pieces",
    material_id: 10,
    created_at: createdAt,
  },
];

const suppliers: Schemas["Supplier"][] = [
  { id: 5, name: "Столярный двор", created_at: createdAt },
  { id: 6, name: "Лесная база", created_at: createdAt },
];

export const supplyPageRoutes = {
  "/api/material-type": {
    get: () => types,
  },
  "/api/material": {
    get: () => materials,
  },
  "/api/material-variant": {
    get: () => variants,
  },
  "/api/supplier": {
    get: () => suppliers,
  },
  "/api/supply": {
    get: () => [],
    post: ({ body }) =>
      ({
        id: 1,
        quantity: Number(body.quantity),
        purchase_price: Number(body.purchase_price),
        unit: "meters",
        remaining_quantity: Number(body.quantity),
        unit_purchase_cost: 0,
        material_variant_id: body.material_variant_id,
        supplier_id: body.supplier_id,
        description: body.description,
        url: body.url,
        created_at: createdAt,
      }) satisfies Schemas["Supply"],
  },
} satisfies Routes;

export const supplyPageEmptyRoutes = {
  "/api/material-type": {
    get: () => [],
  },
  "/api/material": {
    get: () => [],
  },
  "/api/material-variant": {
    get: () => [],
  },
  "/api/supplier": {
    get: () => [],
  },
} satisfies Routes;

export const stubSupplyPageApi = () => {
  const originalFetch = window.fetch.bind(window);
  const { fetch } = createApiStub(supplyPageRoutes);
  window.fetch = fetch;

  return () => {
    window.fetch = originalFetch;
  };
};

export const stubEmptySupplyPageApi = () => {
  const originalFetch = window.fetch.bind(window);
  const { fetch } = createApiStub(supplyPageEmptyRoutes);
  window.fetch = fetch;

  return () => {
    window.fetch = originalFetch;
  };
};

const pending = () => new Promise<never>(() => undefined);

export const stubPendingSupplyPageApi = () => {
  const originalFetch = window.fetch.bind(window);
  const { fetch } = createApiStub({
    "/api/material-type": { get: pending },
    "/api/material": { get: pending },
    "/api/material-variant": { get: pending },
    "/api/supplier": { get: pending },
  });
  window.fetch = fetch;

  return () => {
    window.fetch = originalFetch;
  };
};
