import type { MaterialModel } from "@/features/Material/Material.model";
import type { MaterialTypeModel } from "@/features/MaterialType/MaterialType.model";
import type { SupplierModel } from "@/features/Supplier/Supplier.model";
import type { SupplyModel } from "@/features/Supply/Supply.model";
import type { VariantModel } from "@/features/Variant/Variant.model";
import { createApiStub, errorResponse } from "@/test/apiStub";

import { supplierFixtures, supplyFixtures } from "./SuppliesPage/fixtures";

export interface PageFixtures {
  materials?: MaterialModel[];
  types?: MaterialTypeModel[];
  variants?: VariantModel[];
  suppliers?: SupplierModel[];
  supplies?: SupplyModel[];
  unitLocked?: boolean;
}

const catalogSupplies: SupplyModel[] = [
  {
    id: 200,
    material_variant_id: 100,
    unit: "meters",
    quantity: 4.5,
    remaining_quantity: 4.5,
    purchase_price: 100,
    unit_purchase_cost: 100,
    created_at: "2026-02-01T00:00:00.000Z",
  },
  {
    id: 201,
    material_variant_id: 100,
    unit: "meters",
    quantity: 2.5,
    remaining_quantity: 2.5,
    purchase_price: 100,
    unit_purchase_cost: 100,
    created_at: "2026-03-15T00:00:00.000Z",
  },
  {
    id: 202,
    material_variant_id: 103,
    unit: "pieces",
    quantity: 1,
    remaining_quantity: 1,
    purchase_price: 50,
    unit_purchase_cost: 50,
    created_at: "2026-01-20T00:00:00.000Z",
  },
];

export const catalogFixtures = {
  types: [
    {
      id: 1,
      name: "Древесина",
      description: "Пиломатериалы",
      created_at: "2026-01-01T00:00:00.000Z",
    },
    { id: 2, name: "Металл", created_at: "2026-01-01T00:00:00.000Z" },
    {
      id: 3,
      name: "Скрытый тип",
      created_at: "2026-01-01T00:00:00.000Z",
      deleted_at: "2026-01-02T00:00:00.000Z",
    },
  ],
  materials: [
    {
      id: 10,
      name: "Доска сосна",
      description: "Сорт первый",
      material_type_id: 1,
      created_at: "2026-01-01T00:00:00.000Z",
    },
    {
      id: 11,
      name: "Болт",
      material_type_id: 2,
      created_at: "2026-01-01T00:00:00.000Z",
    },
    {
      id: 12,
      name: "Скрытый материал",
      material_type_id: 1,
      created_at: "2026-01-01T00:00:00.000Z",
      deleted_at: "2026-01-02T00:00:00.000Z",
    },
    {
      id: 13,
      name: "Фанера",
      material_type_id: 3,
      created_at: "2026-01-01T00:00:00.000Z",
    },
    {
      id: 14,
      name: "Дуб",
      material_type_id: 1,
      created_at: "2026-01-01T00:00:00.000Z",
    },
    {
      id: 15,
      name: "Ясень",
      material_type_id: 1,
      created_at: "2026-01-01T00:00:00.000Z",
    },
    {
      id: 16,
      name: "Шпон",
      material_type_id: 1,
      created_at: "2026-01-01T00:00:00.000Z",
    },
  ],
  variants: [
    {
      id: 100,
      name: "Доска 100x20",
      unit: "meters",
      material_id: 10,
      created_at: "2026-01-01T00:00:00.000Z",
    },
    {
      id: 101,
      name: "Саморез 35",
      unit: "pieces",
      material_id: 11,
      created_at: "2026-01-01T00:00:00.000Z",
    },
    {
      id: 102,
      name: "Скрытый вариант",
      unit: "pieces",
      material_id: 10,
      created_at: "2026-01-01T00:00:00.000Z",
      deleted_at: "2026-01-02T00:00:00.000Z",
    },
    {
      id: 103,
      name: "Фанера 4мм",
      unit: "pieces",
      material_id: 13,
      created_at: "2026-01-01T00:00:00.000Z",
    },
    {
      id: 104,
      name: "Доска 150x30",
      unit: "meters",
      material_id: 10,
      created_at: "2026-01-01T00:00:00.000Z",
    },
    {
      id: 105,
      name: "Брусок 50x50",
      unit: "meters",
      material_id: 10,
      created_at: "2026-01-01T00:00:00.000Z",
    },
    {
      id: 106,
      name: "Шуруп 40",
      unit: "pieces",
      material_id: 10,
      created_at: "2026-01-01T00:00:00.000Z",
    },
  ],
  supplies: catalogSupplies,
} satisfies PageFixtures;

export const suppliesFixtures: PageFixtures = {
  ...catalogFixtures,
  suppliers: supplierFixtures,
  supplies: supplyFixtures,
};

export const pageRoutes = (fixtures: PageFixtures = {}) => {
  const materials = (fixtures.materials ?? []).map((row) => ({ ...row }));
  const types = (fixtures.types ?? []).map((row) => ({ ...row }));
  const variants = (fixtures.variants ?? []).map((row) => ({ ...row }));
  const suppliers = fixtures.suppliers ?? supplierFixtures;
  const supplies = fixtures.supplies ?? [];

  const active = <T extends { deleted_at?: string | null }>(rows: T[]) =>
    rows.filter((row) => !row.deleted_at);

  const list =
    <T extends { deleted_at?: string | null }>(rows: T[]) =>
    ({ search }: { search: URLSearchParams }) =>
      search.get("hidden") === "true" ? rows : active(rows);

  const idFrom = (path: string) => Number(path.split("/").pop());

  return {
    "/api/material": {
      get: list(materials),
      post: ({ body }: { body: Record<string, unknown> }) => {
        const id = Math.max(0, ...materials.map((row) => row.id)) + 1;
        const row: MaterialModel = {
          id,
          name: String(body.name),
          description:
            typeof body.description === "string" ? body.description : null,
          material_type_id: Number(body.material_type_id),
          created_at: "2026-04-01T10:00:00.000Z",
          updated_at: "2026-04-01T10:00:00.000Z",
          deleted_at: null,
        };
        materials.push(row);
        return row;
      },
    },
    "/api/material-type": {
      get: list(types),
      post: ({ body }: { body: Record<string, unknown> }) => {
        const id = Math.max(0, ...types.map((row) => row.id)) + 1;
        const row: MaterialTypeModel = {
          id,
          name: String(body.name),
          description:
            typeof body.description === "string" ? body.description : null,
          created_at: "2026-04-01T10:00:00.000Z",
          updated_at: "2026-04-01T10:00:00.000Z",
          deleted_at: null,
        };
        types.push(row);
        return row;
      },
    },
    "/api/material-variant": {
      get: list(variants),
      post: ({ body }: { body: Record<string, unknown> }) => {
        const id = Math.max(0, ...variants.map((row) => row.id)) + 1;
        const row: VariantModel = {
          id,
          name: String(body.name),
          unit: body.unit === "pieces" ? "pieces" : "meters",
          material_id: Number(body.material_id),
          created_at: "2026-04-01T10:00:00.000Z",
          updated_at: "2026-04-01T10:00:00.000Z",
          deleted_at: null,
        };
        variants.push(row);
        return { ...row, unit_locked: false };
      },
    },
    "/api/material-type/{id}": {
      patch: ({
        body,
        path,
      }: {
        body: Record<string, unknown>;
        path: string;
      }) => {
        const row = types.find((type) => type.id === idFrom(path));
        if (!row) return errorResponse(404, "not found");
        Object.assign(row, body);
        return row;
      },
      delete: ({ path }: { path: string }) => {
        const id = idFrom(path);
        const index = types.findIndex((type) => type.id === id);
        if (index === -1) return errorResponse(404, "not found");
        const row = types[index];
        if (row === undefined) return errorResponse(404, "not found");
        const hasReferences = materials.some(
          (material) => material.material_type_id === id,
        );
        if (hasReferences) {
          row.deleted_at = "2026-04-01T10:00:00.000Z";
        } else {
          types.splice(index, 1);
        }
        return { message: "deleted" };
      },
    },
    "/api/material-type/restore/{id}": {
      post: ({ path }: { path: string }) => {
        const row = types.find((type) => type.id === idFrom(path));
        if (!row) return errorResponse(404, "not found");
        row.deleted_at = null;
        return row;
      },
    },
    "/api/material/{id}": {
      patch: ({
        body,
        path,
      }: {
        body: Record<string, unknown>;
        path: string;
      }) => {
        const row = materials.find((material) => material.id === idFrom(path));
        if (!row) return errorResponse(404, "not found");
        Object.assign(row, body);
        return row;
      },
      delete: ({ path }: { path: string }) => {
        const id = idFrom(path);
        const index = materials.findIndex((material) => material.id === id);
        if (index === -1) return errorResponse(404, "not found");
        const row = materials[index];
        if (row === undefined) return errorResponse(404, "not found");
        const hasReferences = variants.some(
          (variant) => variant.material_id === id,
        );
        if (hasReferences) {
          row.deleted_at = "2026-04-01T10:00:00.000Z";
        } else {
          materials.splice(index, 1);
        }
        return { message: "deleted" };
      },
    },
    "/api/material/restore/{id}": {
      post: ({ path }: { path: string }) => {
        const row = materials.find((material) => material.id === idFrom(path));
        if (!row) return errorResponse(404, "not found");
        row.deleted_at = null;
        return row;
      },
    },
    "/api/material-variant/{id}": {
      get: ({ path }: { path: string }) => {
        const row = variants.find((variant) => variant.id === idFrom(path));
        if (!row) return errorResponse(404, "not found");
        return { ...row, unit_locked: fixtures.unitLocked ?? false };
      },
      patch: ({
        body,
        path,
      }: {
        body: Record<string, unknown>;
        path: string;
      }) => {
        const row = variants.find((variant) => variant.id === idFrom(path));
        if (!row) return errorResponse(404, "not found");
        Object.assign(row, body);
        return { ...row, unit_locked: false };
      },
      delete: ({ path }: { path: string }) => {
        const id = idFrom(path);
        const index = variants.findIndex((variant) => variant.id === id);
        if (index === -1) return errorResponse(404, "not found");
        const row = variants[index];
        if (row === undefined) return errorResponse(404, "not found");
        const hasReferences = supplies.some(
          (supply) => supply.material_variant_id === id,
        );
        if (hasReferences) {
          row.deleted_at = "2026-04-01T10:00:00.000Z";
        } else {
          variants.splice(index, 1);
        }
        return { message: "deleted" };
      },
    },
    "/api/material-variant/restore/{id}": {
      post: ({ path }: { path: string }) => {
        const row = variants.find((variant) => variant.id === idFrom(path));
        if (!row) return errorResponse(404, "not found");
        row.deleted_at = null;
        return { ...row, unit_locked: false };
      },
    },
    "/api/supplier": { get: () => suppliers },
    "/api/supply": {
      get: ({ search }: { search: URLSearchParams }) => {
        const variantId = search.get("material_variant_id");
        return variantId
          ? supplies.filter(
              (supply) => supply.material_variant_id === Number(variantId),
            )
          : supplies;
      },
    },
  };
};

export const stubCatalogApi = (fixtures: PageFixtures = {}) => {
  const originalFetch = window.fetch.bind(window);
  const { fetch } = createApiStub(pageRoutes(fixtures));
  window.fetch = fetch;

  return () => {
    window.fetch = originalFetch;
  };
};
