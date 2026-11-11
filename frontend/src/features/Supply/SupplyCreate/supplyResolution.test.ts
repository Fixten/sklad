import { describe, expect, it, vi } from "vitest";

import { ApiError } from "@/api/api-error";
import type { MaterialDTO } from "@/features/Material/Material.model";
import type { SupplierDTO } from "@/features/Supplier/Supplier.model";
import type { VariantDTO } from "@/features/Variant/Variant.model";

import type { SupplyDraft } from "./supplyForm";
import type { SupplyCatalog, SupplyResolutionDeps } from "./supplyResolution";
import { resolveSupplyDto } from "./supplyResolution";

const catalog: SupplyCatalog = {
  types: [{ id: 1, name: "Пиломатериал" }],
  materials: [{ id: 10, name: "Дуб", material_type_id: 1 }],
  variants: [{ id: 100, name: "Доска 40 мм", unit: "meters", material_id: 10 }],
};

const draft: SupplyDraft = {
  target: {
    typeName: "Пиломатериал",
    materialName: "Дуб",
    variantName: "Доска 40 мм",
    unit: "meters",
  },
  quantity: 8,
  purchasePrice: 24000,
  supplierName: "Столярный двор",
};

const makeDeps = (
  overrides: Partial<SupplyResolutionDeps> = {},
): SupplyResolutionDeps => ({
  catalog,
  suppliers: [{ id: 5, name: "Столярный двор" }],
  createType: vi.fn((name: string) => Promise.resolve({ id: 2, name })),
  createMaterial: vi.fn((value: MaterialDTO) =>
    Promise.resolve({ id: 11, ...value }),
  ),
  createVariant: vi.fn((value: VariantDTO) =>
    Promise.resolve({ id: 101, ...value }),
  ),
  createSupplier: vi.fn((value: SupplierDTO) =>
    Promise.resolve({ id: 6, ...value }),
  ),
  listFreshSuppliers: vi.fn(() => Promise.resolve([])),
  ...overrides,
});

describe("resolveSupplyDto", () => {
  it("maps a catalog hit to the variant id without creating anything", async () => {
    const deps = makeDeps();
    const dto = await resolveSupplyDto(deps, draft);

    expect(dto).toEqual({
      material_variant_id: 100,
      supplier_id: 5,
      quantity: 8,
      purchase_price: 24000,
    });
    expect(dto.description).toBeUndefined();
    expect(dto.url).toBeUndefined();
    expect(deps.createType).not.toHaveBeenCalled();
    expect(deps.createMaterial).not.toHaveBeenCalled();
    expect(deps.createVariant).not.toHaveBeenCalled();
    expect(deps.createSupplier).not.toHaveBeenCalled();
  });

  it("trims the target and supplier names before lookup", async () => {
    const deps = makeDeps();
    const dto = await resolveSupplyDto(deps, {
      ...draft,
      target: {
        typeName: " Пиломатериал ",
        materialName: " Дуб ",
        variantName: " Доска 40 мм ",
        unit: "meters",
      },
      supplierName: " Столярный двор ",
    });

    expect(dto).toMatchObject({ material_variant_id: 100, supplier_id: 5 });
    expect(deps.createType).not.toHaveBeenCalled();
    expect(deps.createSupplier).not.toHaveBeenCalled();
  });

  it("creates the type, material and variant on an empty catalog", async () => {
    const deps = makeDeps({
      catalog: { types: [], materials: [], variants: [] },
    });
    const dto = await resolveSupplyDto(deps, draft);

    expect(dto).toMatchObject({ material_variant_id: 101, supplier_id: 5 });
    expect(deps.createType).toHaveBeenCalledWith("Пиломатериал");
    expect(deps.createMaterial).toHaveBeenCalledWith({
      name: "Дуб",
      material_type_id: 2,
    });
    expect(deps.createVariant).toHaveBeenCalledWith({
      name: "Доска 40 мм",
      unit: "meters",
      material_id: 11,
    });
    expect(deps.createSupplier).not.toHaveBeenCalled();
  });

  it("reuses the existing type and material and creates the variant", async () => {
    const deps = makeDeps({ catalog: { ...catalog, variants: [] } });
    const dto = await resolveSupplyDto(deps, draft);

    expect(dto).toMatchObject({ material_variant_id: 101 });
    expect(deps.createType).not.toHaveBeenCalled();
    expect(deps.createMaterial).not.toHaveBeenCalled();
    expect(deps.createVariant).toHaveBeenCalledWith({
      name: "Доска 40 мм",
      unit: "meters",
      material_id: 10,
    });
  });

  it("creates the material under the matching type when the name exists elsewhere", async () => {
    const deps = makeDeps({
      catalog: {
        types: [{ id: 1, name: "Пиломатериал" }],
        materials: [{ id: 10, name: "Дуб", material_type_id: 9 }],
        variants: [],
      },
    });
    const dto = await resolveSupplyDto(deps, draft);

    expect(dto).toMatchObject({ material_variant_id: 101 });
    expect(deps.createType).not.toHaveBeenCalled();
    expect(deps.createMaterial).toHaveBeenCalledWith({
      name: "Дуб",
      material_type_id: 1,
    });
  });

  it("keeps trimmed non-empty details and omits blank ones", async () => {
    const deps = makeDeps();
    const dto = await resolveSupplyDto(deps, {
      ...draft,
      description: "  Доставка до склада  ",
      url: " example.com/dub ",
    });

    expect(dto.description).toBe("Доставка до склада");
    expect(dto.url).toBe("example.com/dub");
  });

  it("omits whitespace-only details as undefined", async () => {
    const deps = makeDeps();
    const dto = await resolveSupplyDto(deps, {
      ...draft,
      description: "   ",
    });

    expect(dto.description).toBeUndefined();
    expect(dto.url).toBeUndefined();
  });

  it("skips supplier resolution for a blank name", async () => {
    const deps = makeDeps();
    const dto = await resolveSupplyDto(deps, {
      ...draft,
      supplierName: "   ",
    });

    expect(dto.supplier_id).toBeUndefined();
    expect(deps.createSupplier).not.toHaveBeenCalled();
    expect(deps.listFreshSuppliers).not.toHaveBeenCalled();
  });

  it("creates a missing supplier", async () => {
    const deps = makeDeps({ suppliers: [] });
    const dto = await resolveSupplyDto(deps, draft);

    expect(dto).toMatchObject({ supplier_id: 6 });
    expect(deps.createSupplier).toHaveBeenCalledWith({
      name: "Столярный двор",
    });
  });

  it("recovers a supplier duplicate race by refetching and matching", async () => {
    const deps = makeDeps({
      suppliers: [],
      createSupplier: vi
        .fn((value: SupplierDTO) => Promise.resolve({ id: 6, ...value }))
        .mockRejectedValueOnce(new ApiError("NAME_ALREADY_EXISTS", 409)),
      listFreshSuppliers: vi.fn(() =>
        Promise.resolve([{ id: 7, name: "Столярный двор" }]),
      ),
    });
    const dto = await resolveSupplyDto(deps, draft);

    expect(dto).toMatchObject({ supplier_id: 7 });
    expect(deps.createSupplier).toHaveBeenCalledTimes(1);
    expect(deps.listFreshSuppliers).toHaveBeenCalledTimes(1);
  });

  it("retries the supplier create once when the refetch finds no match", async () => {
    const deps = makeDeps({
      suppliers: [],
      createSupplier: vi
        .fn((value: SupplierDTO) => Promise.resolve({ id: 6, ...value }))
        .mockRejectedValueOnce(new ApiError("NAME_ALREADY_EXISTS", 409)),
    });
    const dto = await resolveSupplyDto(deps, draft);

    expect(dto).toMatchObject({ supplier_id: 6 });
    expect(deps.createSupplier).toHaveBeenCalledTimes(2);
  });

  it("surfaces the error when the retried supplier create conflicts again", async () => {
    const conflict = new ApiError("NAME_ALREADY_EXISTS", 409);
    const deps = makeDeps({
      suppliers: [],
      createSupplier: vi.fn(() => Promise.reject(conflict)),
    });

    await expect(resolveSupplyDto(deps, draft)).rejects.toBe(conflict);
    expect(deps.createSupplier).toHaveBeenCalledTimes(2);
  });

  it("matches existing names case-insensitively without creating anything", async () => {
    const deps = makeDeps({
      catalog: {
        types: [{ id: 1, name: "пиломатериал" }],
        materials: [{ id: 10, name: "дуб", material_type_id: 1 }],
        variants: [
          {
            id: 100,
            name: "доска 40 мм",
            unit: "meters",
            material_id: 10,
          },
        ],
      },
      suppliers: [{ id: 5, name: "ХДМ" }],
    });
    const dto = await resolveSupplyDto(deps, {
      ...draft,
      supplierName: "хдм",
    });

    expect(dto).toMatchObject({ material_variant_id: 100, supplier_id: 5 });
    expect(deps.createSupplier).not.toHaveBeenCalled();
  });

  it("propagates non-conflict supplier errors without refetching", async () => {
    const failure = new ApiError("INTERNAL", 500);
    const deps = makeDeps({
      suppliers: [],
      createSupplier: vi.fn(() => Promise.reject(failure)),
    });

    await expect(resolveSupplyDto(deps, draft)).rejects.toBe(failure);
    expect(deps.listFreshSuppliers).not.toHaveBeenCalled();
  });
});
