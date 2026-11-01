import { describe, expect, it } from "vitest";
import zod from "zod";

import { createSupplyFormSchema } from "./supplyForm";

import type { SupplyFormValues } from "./supplyForm";

const base: SupplyFormValues = {
  variantId: 100,
  unit: "meters",
  quantity: "8",
  price: "24000",
  supplierName: "Столярный двор",
  description: "",
  url: "",
};

const parse = (patch: Partial<SupplyFormValues> = {}) =>
  createSupplyFormSchema().safeParse({
    ...base,
    ...patch,
  });

const errorsOf = (
  result: ReturnType<typeof parse>,
): Record<string, string[]> =>
  result.success ? {} : zod.flattenError(result.error).fieldErrors;

describe("createSupplyFormSchema", () => {
  it("returns the draft for a filled form", () => {
    expect(parse().data).toEqual({
      variantId: 100,
      unit: "meters",
      quantity: 8,
      purchasePrice: 24000,
      supplierName: "Столярный двор",
      description: undefined,
      url: undefined,
    });
  });

  it("trims the supplier and optional fields", () => {
    const result = parse({
      supplierName: " Столярный двор ",
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
      variantId: null,
      unit: null,
      quantity: "",
      price: "",
      supplierName: "   ",
    });

    expect(errorsOf(result)).toEqual({
      variantId: ["Выберите материал"],
      unit: ["Выберите материал"],
      quantity: ["Укажите количество"],
      price: ["Укажите цену закупки"],
      supplierName: ["Укажите поставщика"],
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

  it("requires whole pieces", () => {
    expect(
      errorsOf(parse({ unit: "pieces", quantity: "2.5" })).quantity,
    ).toEqual(["Количество в штуках должно быть целым"]);
    expect(parse({ unit: "pieces", quantity: "2" }).data?.quantity).toBe(2);
  });

  it("limits meters to three decimal places", () => {
    expect(parse({ quantity: "2.123" }).data?.quantity).toBe(2.123);
    expect(errorsOf(parse({ quantity: "2.1234" })).quantity).toEqual([
      "Не больше трёх знаков после запятой",
    ]);
  });

  it("accepts a free lot and comma decimals", () => {
    expect(parse({ price: "0" }).data?.purchasePrice).toBe(0);
    expect(parse({ quantity: "2,5" }).data?.quantity).toBe(2.5);
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
});
