import { describe, expect, it } from "vitest";

import {
  stepLabel,
  supplyBackStep,
  supplyInitialStep,
  type SupplyStep,
} from "./flow";

const detailsStep: SupplyStep = {
  kind: "details",
  row: {
    variantId: 100,
    variantName: "Доска 40 мм",
    unit: "meters",
    material: { id: 10, name: "Дуб", materialTypeName: "Пиломатериал" },
  },
};

describe("supply flow", () => {
  it("starts on the pick step", () => {
    expect(supplyInitialStep).toEqual({ kind: "pick" });
  });

  it("returns to the pick step from any secondary step", () => {
    expect(supplyBackStep).toEqual({ kind: "pick" });
  });

  it("labels the pick step as the first of two", () => {
    expect(stepLabel(supplyInitialStep)).toBe("01 / 02");
    expect(
      stepLabel({ kind: "variant", material: detailsStep.row.material }),
    ).toBe("01 / 02");
    expect(stepLabel({ kind: "material" })).toBe("01 / 02");
  });

  it("labels the details step as the second of two", () => {
    expect(stepLabel(detailsStep)).toBe("02 / 02");
  });
});
