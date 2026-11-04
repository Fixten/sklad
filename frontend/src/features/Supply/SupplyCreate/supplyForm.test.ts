import { describe, expect, it } from "vitest";
import zod from "zod";

import { createSupplyFormSchema } from "./supplyForm";

import type { SupplyFormValues } from "./supplyForm";

const base: SupplyFormValues = {
  variantId: 100,
  typeId: 1,
  typeName: "Пиломатериал",
  materialId: 10,
  materialName: "Дуб",
  variantName: "Доска 40 мм",
  unit: "meters",
  quantity: "8",
  price: "24000",
  supplierName: "Столярный двор",
  description: "",
  url: "",
};

const manualChain: Partial<SupplyFormValues> = {
  variantId: null,
  unit: null,
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
  it("accepts an existing variant draft", () => {
    const result = parse({
      typeId: null,
      typeName: "",
      materialId: null,
      materialName: "",
      variantName: "",
    });

    expect(result.data?.target).toEqual({ kind: "existing", variantId: 100 });
    expect(result.data?.purchasePrice).toBe(24000);
    expect(result.data?.description).toBeUndefined();
  });

  it("accepts a manual chain draft", () => {
    const result = parse({
      ...manualChain,
      typeId: null,
      typeName: "Пиломатериал",
      materialId: null,
      materialName: "Ясень",
      variantName: "Доска 40 мм",
      unit: "meters",
    });

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

  it("keeps existing ids when the query picked type and material", () => {
    const result = parse({
      ...manualChain,
      variantName: "Доска 50 мм",
      unit: "pieces",
    });

    expect(result.data?.target).toMatchObject({
      kind: "new",
      typeId: 1,
      materialId: 10,
      unit: "pieces",
    });
  });

  it("reports the chain as one question when everything is empty", () => {
    const result = parse({
      ...manualChain,
      typeName: "",
      materialName: "",
      variantName: "",
    });

    const errors = errorsOf(result);
    expect(errors.variantId).toEqual(["Выберите материал"]);
    expect(errors.typeName).toBeUndefined();
    expect(errors.materialName).toBeUndefined();
    expect(errors.variantName).toBeUndefined();
    expect(errors.unit).toBeUndefined();
  });

  it("reports missing chain parts per field", () => {
    const result = parse({
      ...manualChain,
      typeId: null,
      typeName: "",
      materialId: null,
      materialName: "",
      variantName: "Доска 40 мм",
    });

    const errors = errorsOf(result);
    expect(errors.variantId).toEqual(["Выберите материал"]);
    expect(errors.typeName).toEqual(["Укажите тип"]);
    expect(errors.materialName).toEqual(["Укажите материал"]);
    expect(errors.variantName).toBeUndefined();
    expect(errors.unit).toEqual(["Укажите единицу"]);
  });

  it("treats typed names as new entities", () => {
    const result = parse({
      ...manualChain,
      typeId: null,
      typeName: "Дуб",
      materialId: null,
      materialName: "Ясень",
      variantName: "Доска",
      unit: "meters",
    });

    expect(result.data?.target).toMatchObject({
      kind: "new",
      typeId: undefined,
      typeName: "Дуб",
      materialId: undefined,
      materialName: "Ясень",
    });
    expect(result.data?.target).toHaveProperty("variantName", "Доска");
  });

  it("reports every missing detail value at once", () => {
    const result = parse({
      ...manualChain,
      typeName: "Пиломатериал",
      materialName: "Ясень",
      variantName: "Доска 40 мм",
      unit: "meters",
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
