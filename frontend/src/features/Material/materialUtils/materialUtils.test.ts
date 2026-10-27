import { describe, expect, it } from "vitest";

import {
  materialPath,
  materialTitle,
  queryMaterialRow,
  queryMaterialRowWithType,
} from "./materiaUtils";

import type {
  MaterialCatalogRow,
  MaterialTarget,
} from "@/features/Material/useMaterialsCatalog";

const oak: MaterialTarget = {
  id: 10,
  name: "Дуб",
  materialTypeName: "Пиломатериал",
};

const plywood: MaterialTarget = {
  id: 11,
  name: "Фанера",
  materialTypeName: "Листовой",
};

const rows: MaterialCatalogRow[] = [
  {
    variantId: 100,
    variantName: "Доска 40 мм",
    unit: "meters",
    material: oak,
  },
  {
    variantId: 101,
    variantName: "Брусок 60 × 60",
    unit: "meters",
    material: oak,
  },
  {
    variantId: 102,
    variantName: "Лист 2 мм",
    unit: "pieces",
    material: plywood,
  },
];

describe("queryMaterialRow", () => {
  it("returns nothing without a query", () => {
    expect(queryMaterialRow(rows, "")).toEqual([]);
    expect(queryMaterialRow(rows, "   ")).toEqual([]);
  });

  it("matches every variant of a material by its name", () => {
    expect(queryMaterialRow(rows, "Дуб")).toEqual([rows[0], rows[1]]);
  });

  it("matches a single variant by its name", () => {
    expect(queryMaterialRow(rows, "доска")).toEqual([rows[0]]);
  });

  it("matches by material type", () => {
    expect(queryMaterialRow(rows, "листовой")).toEqual([rows[2]]);
  });

  it("ignores surrounding whitespace", () => {
    expect(queryMaterialRow(rows, "  дуб ")).toEqual([rows[0], rows[1]]);
  });

  it("returns nothing for an unknown query", () => {
    expect(queryMaterialRow(rows, "клён")).toEqual([]);
  });
});

describe("queryMaterialRowWithType", () => {
  it("returns nothing without a query", () => {
    expect(queryMaterialRowWithType(rows, " ")).toBeNull();
  });

  it("offers a new material when nothing matches", () => {
    expect(queryMaterialRowWithType(rows, "Клён")).toEqual({
      kind: "material",
    });
  });

  it("offers a new variant for the matched material", () => {
    expect(queryMaterialRowWithType(rows, "доска")).toEqual({
      kind: "variant",
      material: oak,
    });
  });

  it("prefers the material named by the query over a variant match", () => {
    expect(queryMaterialRowWithType([...rows].reverse(), "Фанера")).toEqual({
      kind: "variant",
      material: plywood,
    });
  });
});

describe("material labels", () => {
  it("joins the type and the material with a separator", () => {
    expect(materialPath(oak)).toBe("Пиломатериал › Дуб");
    expect(materialTitle(oak)).toBe("Пиломатериал · Дуб");
  });

  it("falls back to the material name when the type is unknown", () => {
    const material = { id: 12, name: "Клён", materialTypeName: "" };

    expect(materialPath(material)).toBe("Клён");
    expect(materialTitle(material)).toBe("Клён");
  });
});
