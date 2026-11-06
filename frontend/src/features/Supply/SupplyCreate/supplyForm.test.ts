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
const existing = {
  ...base,
  typeQuery: "Пиломатериал",
  typeId: 1,
  materialQuery: "Дуб",
  materialId: 10,
  variantQuery: "Доска 40 мм",
  variantId: 100,
  unit: "meters",
} satisfies SupplyFormValues;
const created = {
  ...base,
  typeQuery: "Пиломатериал",
  typeName: "Пиломатериал",
  materialQuery: "Ясень",
  materialName: "Ясень",
  variantQuery: "Доска 40 мм",
  variantName: "Доска 40 мм",
  unit: "meters",
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
  it("accepts an existing variant draft", () => {
    const result = parse(existing);

    expect(result.data?.target).toEqual({ kind: "existing", variantId: 100 });
    expect(result.data?.purchasePrice).toBe(24000);
    expect(result.data?.description).toBeUndefined();
  });

  it("accepts a full create chain", () => {
    const result = parse(created);

    expect(result.data?.target).toEqual({
      kind: "new",
      typeId: undefined,
      typeName: "Пиломатериал",
      materialId: undefined,
      materialName: "Ясень",
      variantName: "Доска 40 мм",
      unit: "meters",
    });
  });

  it("keeps existing levels while creating the variant", () => {
    const result = parse({
      ...created,
      typeId: 1,
      typeName: "",
      materialId: 10,
      materialName: "",
      variantName: "Доска 45 мм",
    });

    expect(result.data?.target).toEqual({
      kind: "new",
      typeId: 1,
      typeName: undefined,
      materialId: 10,
      materialName: undefined,
      variantName: "Доска 45 мм",
      unit: "meters",
    });
  });

  it("rejects query text without a commit", () => {
    const result = parse({
      ...base,
      typeQuery: "Пиломатериал",
      materialQuery: "Ясень",
      variantQuery: "Доска 40 мм",
      unit: "meters",
    });

    const errors = errorsOf(result);
    expect(errors.typeName).toEqual(["Выберите или создайте тип"]);
    expect(errors.materialName).toEqual(["Выберите или создайте материал"]);
    expect(errors.variantName).toEqual(["Выберите или создайте вариант"]);
  });

  it("reports each missing level separately", () => {
    const result = parse({
      ...existing,
      materialId: null,
      materialQuery: "Ясень",
    });

    expect(errorsOf(result)).toEqual({
      materialName: ["Выберите или создайте материал"],
    });
  });

  it("requires the unit", () => {
    const result = parse({
      ...created,
      unit: null,
    });

    expect(errorsOf(result)).toEqual({ unit: ["Выберите единицу"] });
  });

  it("never puts query text into the draft", () => {
    const withQueries = parse({
      ...existing,
      typeQuery: "zzz",
      materialQuery: "zzz",
      variantQuery: "zzz",
    });
    const withoutQueries = parse(existing);

    expect(withQueries.data).toEqual(withoutQueries.data);
  });

  it("trims committed names", () => {
    const result = parse({
      ...created,
      materialName: "  Ясень  ",
    });

    expect(result.data?.target).toHaveProperty("materialName", "Ясень");
  });

  it("reports every missing detail value at once", () => {
    const result = parse({
      ...created,
      quantity: "",
      price: "",
      supplierName: "   ",
    });

    expect(errorsOf(result)).toEqual({
      quantity: ["Укажите количество"],
      price: ["Укажите цену закупки"],
      supplierName: ["Укажите поставщика"],
    });
  });

  it("rejects a zero or negative quantity", () => {
    expect(errorsOf(parse({ ...existing, quantity: "0" })).quantity).toEqual([
      "Укажите количество",
    ]);
    expect(errorsOf(parse({ ...existing, quantity: "-3" })).quantity).toEqual([
      "Укажите количество",
    ]);
  });

  it("requires whole pieces", () => {
    expect(
      errorsOf(parse({ ...existing, unit: "pieces", quantity: "2.5" }))
        .quantity,
    ).toEqual(["Количество в штуках должно быть целым"]);
    expect(
      parse({ ...existing, unit: "pieces", quantity: "2" }).data?.quantity,
    ).toBe(2);
  });

  it("limits meters to three decimal places", () => {
    expect(parse({ ...existing, quantity: "2.123" }).data?.quantity).toBe(
      2.123,
    );
    expect(
      errorsOf(parse({ ...existing, quantity: "2.1234" })).quantity,
    ).toEqual(["Не больше трёх знаков после запятой"]);
  });

  it("accepts a free lot and comma decimals", () => {
    expect(parse({ ...existing, price: "0" }).data?.purchasePrice).toBe(0);
    expect(parse({ ...existing, quantity: "2,5" }).data?.quantity).toBe(2.5);
  });

  it("rejects empty, non-numeric and negative prices", () => {
    expect(errorsOf(parse({ ...existing, price: "" })).price).toEqual([
      "Укажите цену закупки",
    ]);
    expect(errorsOf(parse({ ...existing, price: "abc" })).price).toEqual([
      "Укажите цену закупки",
    ]);
    expect(errorsOf(parse({ ...existing, price: "-1" })).price).toEqual([
      "Укажите цену закупки",
    ]);
  });
});
