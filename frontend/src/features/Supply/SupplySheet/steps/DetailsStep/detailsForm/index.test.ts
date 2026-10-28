import { describe, expect, it } from "vitest";
import zod from "zod";

import { createDetailsFormSchema, formatUnitCost, unitCostPreview } from ".";

import type { DetailsFormValues } from ".";
import type { Unit } from "@/features/units";

const base: DetailsFormValues = {
  quantity: "8",
  price: "24000",
  supplier: { id: 5, name: "Столярный двор" },
  description: "",
  url: "",
};

const parse = (patch: Partial<DetailsFormValues> = {}, unit: Unit = "meters") =>
  createDetailsFormSchema(unit).safeParse({
    ...base,
    ...patch,
  });

const errorsOf = (
  result: ReturnType<typeof parse>,
): Record<string, string[]> =>
  result.success ? {} : zod.flattenError(result.error).fieldErrors;

describe("createDetailsFormSchema", () => {
  it("returns the payload for a filled form", () => {
    expect(parse().data).toEqual({
      quantity: 8,
      purchasePrice: 24000,
      supplierName: "Столярный двор",
      supplierId: 5,
      description: undefined,
      url: undefined,
    });
  });

  it("trims the supplier and optional fields", () => {
    const result = parse({
      supplier: { id: null, name: " Столярный двор " },
      description: " осенняя партия ",
      url: " https://example.com ",
    });

    expect(result.data).toMatchObject({
      supplierName: "Столярный двор",
      description: "осенняя партия",
      url: "https://example.com",
    });
  });

  it("reports every missing value at once", () => {
    const result = parse({
      quantity: "",
      price: "",
      supplier: { id: null, name: "   " },
    });

    expect(errorsOf(result)).toEqual({
      quantity: ["Укажите количество"],
      price: ["Укажите цену закупки"],
      supplier: ["Укажите поставщика"],
    });
  });

  it("rejects a zero or negative quantity", () => {
    expect(errorsOf(parse({ quantity: "0" })).quantity).toEqual([
      "Укажите количество",
    ]);
    expect(errorsOf(parse({ quantity: "-3" })).quantity).toEqual([
      "Укажите количество",
    ]);
  });

  it("rejects a non-numeric quantity", () => {
    expect(errorsOf(parse({ quantity: "abc" })).quantity).toEqual([
      "Укажите количество",
    ]);
  });

  it("accepts a free lot", () => {
    const result = parse({ price: "0" });

    expect(errorsOf(result)).toEqual({});
    expect(result.data?.purchasePrice).toBe(0);
  });

  it("rejects empty, non-numeric and negative prices", () => {
    expect(errorsOf(parse({ price: "" })).price).toEqual([
      "Укажите цену закупки",
    ]);
    expect(errorsOf(parse({ price: "abc" })).price).toEqual([
      "Укажите цену закупки",
    ]);
    expect(errorsOf(parse({ price: "-1" })).price).toEqual([
      "Укажите цену закупки",
    ]);
  });

  it("accepts monetary input with more than two decimal places", () => {
    expect(parse({ price: "10.125" }).data?.purchasePrice).toBe(10.125);
  });

  it("accepts a decimal quantity written with a comma", () => {
    expect(parse({ quantity: "2,5" }).data?.quantity).toBe(2.5);
  });

  it("requires whole pieces", () => {
    expect(errorsOf(parse({ quantity: "2.5" }, "pieces")).quantity).toEqual([
      "Количество в штуках должно быть целым",
    ]);
    expect(parse({ quantity: "2" }, "pieces").data?.quantity).toBe(2);
  });

  it("limits meters to three decimal places", () => {
    expect(parse({ quantity: "2.1" }).data?.quantity).toBe(2.1);
    expect(parse({ quantity: "2.12" }).data?.quantity).toBe(2.12);
    expect(parse({ quantity: "2.123" }).data?.quantity).toBe(2.123);
    expect(errorsOf(parse({ quantity: "2.1234" })).quantity).toEqual([
      "Не больше трёх знаков после запятой",
    ]);
  });
});

describe("unitCostPreview", () => {
  it("divides the lot price by the quantity", () => {
    expect(unitCostPreview(base, "meters")).toEqual({
      value: 3000,
      formula: "24 000 ₽ ÷ 8 м",
    });
  });

  it("stays hidden until both values are present", () => {
    expect(unitCostPreview({ ...base, price: "" }, "meters")).toBeNull();
    expect(unitCostPreview({ ...base, quantity: "" }, "meters")).toBeNull();
    expect(unitCostPreview({ ...base, quantity: "0" }, "meters")).toBeNull();
  });

  it("uses the short label of the variant unit", () => {
    expect(unitCostPreview({ ...base, quantity: "4" }, "pieces")).toEqual({
      value: 6000,
      formula: "24 000 ₽ ÷ 4 шт",
    });
  });
});

describe("formatUnitCost", () => {
  it("prints the cost per unit", () => {
    expect(formatUnitCost(3000, "meters")).toBe("3 000 ₽ / м");
    expect(formatUnitCost(1250.5, "pieces")).toBe("1 250,5 ₽ / шт");
  });
});
