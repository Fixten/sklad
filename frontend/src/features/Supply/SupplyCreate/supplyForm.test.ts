import { describe, expect, it } from "vitest";
import zod from "zod";

import { createSupplyFormSchema, supplyFormDefaults } from "./supplyForm";
import type { SupplyFormValues } from "./supplyForm";

const base: SupplyFormValues = {
  ...supplyFormDefaults,
  typeId: "1",
  materialId: "10",
  variantId: "100",
  unit: "meters",
  quantity: "8",
  price: "24000",
  supplierId: "5",
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
  it("maps valid form values into a draft", () => {
    const result = parse();

    expect(result.data?.variantId).toBe(100);
    expect(result.data?.quantity).toBe(8);
    expect(result.data?.purchasePrice).toBe(24000);
    expect(result.data?.supplierId).toBe(5);
    expect(result.data?.description).toBeUndefined();
    expect(result.data?.url).toBeUndefined();
  });

  it("requires a variant", () => {
    const result = parse({ variantId: "" });

    expect(errorsOf(result).variantId).toEqual(["Выберите"]);
  });

  it("accepts an empty supplier", () => {
    const result = parse({ supplierId: "" });

    expect(result.data?.supplierId).toBeUndefined();
  });

  it("trims optional details", () => {
    const result = parse({
      description: "  Партия  ",
      url: "  https://example.com  ",
    });

    expect(result.data?.description).toBe("Партия");
    expect(result.data?.url).toBe("https://example.com");
  });

  it("reports every missing detail value at once", () => {
    const result = parse({ quantity: "", price: "" });

    expect(errorsOf(result)).toEqual({
      quantity: ["Укажите количество"],
      price: ["Укажите цену закупки"],
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
