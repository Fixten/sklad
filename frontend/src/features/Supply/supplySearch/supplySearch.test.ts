import { describe, expect, it } from "vitest";

import {
  materialPath,
  materialTitle,
  matchRows,
  resolveCreationTarget,
} from "./supplySearch";

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

describe("matchRows", () => {
  it("returns nothing without a query", () => {
    expect(matchRows(rows, "")).toEqual([]);
    expect(matchRows(rows, "   ")).toEqual([]);
  });

  it("matches every variant of a material by its name", () => {
    expect(matchRows(rows, "Дуб")).toEqual([rows[0], rows[1]]);
  });

  it("matches a single variant by its name", () => {
    expect(matchRows(rows, "доска")).toEqual([rows[0]]);
  });

  it("matches by material type", () => {
    expect(matchRows(rows, "листовой")).toEqual([rows[2]]);
  });

  it("ignores surrounding whitespace", () => {
    expect(matchRows(rows, "  дуб ")).toEqual([rows[0], rows[1]]);
  });

  it("returns nothing for an unknown query", () => {
    expect(matchRows(rows, "клён")).toEqual([]);
  });
});

describe("resolveCreationTarget", () => {
  it("returns nothing without a query", () => {
    expect(resolveCreationTarget(rows, " ")).toBeNull();
  });

  it("offers a new material when nothing matches", () => {
    expect(resolveCreationTarget(rows, "Клён")).toEqual({ kind: "material" });
  });

  it("offers a new variant for the matched material", () => {
    expect(resolveCreationTarget(rows, "доска")).toEqual({
      kind: "variant",
      material: oak,
    });
  });

  it("prefers the material named by the query over a variant match", () => {
    expect(resolveCreationTarget([...rows].reverse(), "Фанера")).toEqual({
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
