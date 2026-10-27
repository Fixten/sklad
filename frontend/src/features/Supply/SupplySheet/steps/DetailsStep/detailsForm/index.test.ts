import { describe, expect, it } from "vitest";

import { formatUnitCost, parseDetails, unitCostPreview } from ".";

import type { DetailsForm } from ".";

const base: DetailsForm = {
  quantity: "8",
  price: "24000",
  supplierId: 5,
  supplierName: "Столярный двор",
  description: "",
  url: "",
};

describe("parseDetails", () => {
  it("returns the payload for a filled form", () => {
    expect(parseDetails(base)).toEqual({
      errors: {},
      payload: {
        quantity: 8,
        purchasePrice: 24000,
        supplierName: "Столярный двор",
        supplierId: 5,
        description: undefined,
        url: undefined,
      },
    });
  });

  it("trims the optional fields and keeps them when filled", () => {
    const { payload } = parseDetails({
      ...base,
      description: " осенняя партия ",
      url: " https://example.com ",
    });

    expect(payload).toMatchObject({
      description: "осенняя партия",
      url: "https://example.com",
    });
  });

  it("reports every missing value at once", () => {
    const { errors, payload } = parseDetails({
      quantity: "",
      price: "",
      supplierId: null,
      supplierName: "   ",
      description: "",
      url: "",
    });

    expect(payload).toBeNull();
    expect(errors).toEqual({
      quantity: "Укажите количество",
      price: "Укажите цену закупки",
      supplier: "Укажите поставщика",
    });
  });

  it("rejects a zero or negative quantity", () => {
    expect(parseDetails({ ...base, quantity: "0" }).errors.quantity).toBe(
      "Укажите количество",
    );
    expect(parseDetails({ ...base, quantity: "-3" }).errors.quantity).toBe(
      "Укажите количество",
    );
  });

  it("accepts a free lot", () => {
    const { errors, payload } = parseDetails({ ...base, price: "0" });

    expect(errors).toEqual({});
    expect(payload?.purchasePrice).toBe(0);
  });

  it("accepts a decimal quantity written with a comma", () => {
    const { payload } = parseDetails({ ...base, quantity: "2,5" });

    expect(payload?.quantity).toBe(2.5);
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
