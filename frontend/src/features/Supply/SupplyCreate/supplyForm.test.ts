import { describe, expect, it } from "vitest";
import zod from "zod";

import { createSupplyFormSchema, supplyFormDefaults } from "./supplyForm";
import type { SupplyFormValues } from "./supplyForm";

const base = {
  ...supplyFormDefaults,
  quantity: "8",
  price: "24000",
  supplierName: "Столярный двор",
};
const committed = {
  ...base,
  type: "Пиломатериал",
  material: "Дуб",
  variant: "Доска 40 мм",
  unit: "meters",
} satisfies SupplyFormValues;
const created = {
  ...committed,
  material: "Ясень",
  variant: "Доска 45 мм",
} satisfies SupplyFormValues;

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
  it("maps a committed target into a draft", () => {
    const result = parse(committed);

    expect(result.data?.target).toEqual({
      typeName: "Пиломатериал",
      materialName: "Дуб",
      variantName: "Доска 40 мм",
      unit: "meters",
    });
    expect(result.data?.purchasePrice).toBe(24000);
    expect(result.data?.description).toBeUndefined();
  });

  it("accepts a full create chain", () => {
    const result = parse(created);

    expect(result.data?.target).toEqual({
      typeName: "Пиломатериал",
      materialName: "Ясень",
      variantName: "Доска 45 мм",
      unit: "meters",
    });
  });

  it("reports missing target levels", () => {
    const result = parse({ ...base, unit: "meters" });

    const errors = errorsOf(result);
    expect(errors.type).toEqual(["Выберите или создайте тип"]);
    expect(errors.material).toEqual(["Выберите или создайте материал"]);
    expect(errors.variant).toEqual(["Выберите или создайте вариант"]);
  });

  it("reports each missing level separately", () => {
    const result = parse({
      ...committed,
      material: "",
    });

    expect(errorsOf(result)).toEqual({
      material: ["Выберите или создайте материал"],
    });
  });

  it("requires the unit", () => {
    const result = parse({
      ...created,
      unit: null,
    });

    expect(errorsOf(result)).toEqual({ unit: ["Выберите единицу"] });
  });

  it("trims optional details", () => {
    const result = parse({
      ...created,
      supplierName: "  Склад  ",
      description: "  Партия  ",
      url: "  https://example.com  ",
    });

    expect(result.data?.supplierName).toBe("Склад");
    expect(result.data?.description).toBe("Партия");
    expect(result.data?.url).toBe("https://example.com");
  });

  it("reports every missing detail value at once", () => {
    const result = parse({
      ...created,
      quantity: "",
      price: "",
    });

    expect(errorsOf(result)).toEqual({
      quantity: ["Укажите количество"],
      price: ["Укажите цену закупки"],
    });
  });

  it("accepts a blank supplier", () => {
    const result = parse({ ...created, supplierName: "   " });

    expect(result.data?.supplierName).toBe("");
  });

  it("rejects a zero or negative quantity", () => {
    expect(errorsOf(parse({ ...committed, quantity: "0" })).quantity).toEqual([
      "Укажите количество",
    ]);
    expect(errorsOf(parse({ ...committed, quantity: "-3" })).quantity).toEqual([
      "Укажите количество",
    ]);
  });

  it("requires whole pieces", () => {
    expect(
      errorsOf(parse({ ...committed, unit: "pieces", quantity: "2.5" }))
        .quantity,
    ).toEqual(["Количество в штуках должно быть целым"]);
    expect(
      parse({ ...committed, unit: "pieces", quantity: "2" }).data?.quantity,
    ).toBe(2);
  });

  it("limits meters to three decimal places", () => {
    expect(parse({ ...committed, quantity: "2.123" }).data?.quantity).toBe(
      2.123,
    );
    expect(
      errorsOf(parse({ ...committed, quantity: "2.1234" })).quantity,
    ).toEqual(["Не больше трёх знаков после запятой"]);
  });

  it("accepts a free lot and comma decimals", () => {
    expect(parse({ ...committed, price: "0" }).data?.purchasePrice).toBe(0);
    expect(parse({ ...committed, quantity: "2,5" }).data?.quantity).toBe(2.5);
  });

  it("rejects empty, non-numeric and negative prices", () => {
    expect(errorsOf(parse({ ...committed, price: "" })).price).toEqual([
      "Укажите цену закупки",
    ]);
    expect(errorsOf(parse({ ...committed, price: "abc" })).price).toEqual([
      "Укажите цену закупки",
    ]);
    expect(errorsOf(parse({ ...committed, price: "-1" })).price).toEqual([
      "Укажите цену закупки",
    ]);
  });
});
