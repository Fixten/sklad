import type { MaterialModel } from "@/features/Material/Material.model";
import type { MaterialTypeModel } from "@/features/MaterialType/MaterialType.model";
import type { SupplierModel } from "@/features/Supplier/Supplier.model";
import type { SupplyModel } from "@/features/Supply/Supply.model";
import type { VariantModel } from "@/features/Variant/Variant.model";
import { createApiStub } from "@/test/apiStub";
import type { Routes } from "@/test/apiStub";

const createdAt = "2026-01-01T00:00:00.000Z";

export const supplierFixtures: SupplierModel[] = [
  { id: 5, name: "Столярный двор", created_at: createdAt },
  { id: 6, name: "Лесная база", created_at: createdAt },
];

export const supplyFixtures: SupplyModel[] = [
  {
    id: 200,
    material_variant_id: 100,
    unit: "meters",
    quantity: 4.5,
    remaining_quantity: 4.5,
    purchase_price: 450,
    unit_purchase_cost: 100,
    supplier_id: 5,
    description: "Доска для пола",
    url: "https://example.com/supplies/200",
    created_at: "2026-02-01T12:00:00.000Z",
  },
  {
    id: 201,
    material_variant_id: 100,
    unit: "meters",
    quantity: 2.5,
    remaining_quantity: 2.5,
    purchase_price: 375,
    unit_purchase_cost: 150,
    created_at: "2026-03-15T12:00:00.000Z",
  },
  {
    id: 202,
    material_variant_id: 101,
    unit: "pieces",
    quantity: 10,
    remaining_quantity: 8,
    purchase_price: 100,
    unit_purchase_cost: 10,
    supplier_id: 6,
    description: "Саморезы для сборки",
    created_at: "2026-01-20T12:00:00.000Z",
  },
];

const types: MaterialTypeModel[] = [
  { id: 1, name: "Древесина", created_at: createdAt },
  { id: 2, name: "Металл", created_at: createdAt },
];

const materials: MaterialModel[] = [
  { id: 10, name: "Доска сосна", material_type_id: 1, created_at: createdAt },
  { id: 11, name: "Болт", material_type_id: 2, created_at: createdAt },
];

const variants: VariantModel[] = [
  {
    id: 100,
    name: "Доска 100x20",
    unit: "meters",
    material_id: 10,
    created_at: createdAt,
  },
  {
    id: 101,
    name: "Саморез 35",
    unit: "pieces",
    material_id: 11,
    created_at: createdAt,
  },
];

export const suppliesRoutes = {
  "/api/material-type": { get: () => types },
  "/api/material": { get: () => materials },
  "/api/material-variant": { get: () => variants },
  "/api/supplier": { get: () => supplierFixtures },
  "/api/supply": { get: () => supplyFixtures },
} satisfies Routes;

export const stubSuppliesApi = (rows: SupplyModel[] = supplyFixtures) => {
  const originalFetch = window.fetch.bind(window);
  const { fetch } = createApiStub({
    ...suppliesRoutes,
    "/api/supply": { get: () => rows },
  });
  window.fetch = fetch;

  return () => {
    window.fetch = originalFetch;
  };
};
