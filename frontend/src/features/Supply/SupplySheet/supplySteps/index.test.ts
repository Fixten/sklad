import { describe, expect, it } from "vitest";

import {
  stepLabel,
  supplyBackStep,
  supplyInitialStep,
  SupplyStepKind,
  type SupplyStep,
} from "./index";

const detailsStep: SupplyStep = {
  kind: SupplyStepKind.Details,
  row: {
    variantId: 100,
    variantName: "Доска 40 мм",
    unit: "meters",
    material: { id: 10, name: "Дуб", materialTypeName: "Пиломатериал" },
  },
};

describe("supply flow", () => {
  it("starts on the pick step", () => {
    expect(supplyInitialStep).toEqual({ kind: SupplyStepKind.Pick });
  });

  it("returns to the pick step from any secondary step", () => {
    expect(supplyBackStep).toEqual({ kind: SupplyStepKind.Pick });
  });

  it("labels the pick step as the first of two", () => {
    expect(stepLabel(supplyInitialStep)).toBe("01 / 02");
    expect(
      stepLabel({
        kind: SupplyStepKind.Variant,
        material: detailsStep.row.material,
      }),
    ).toBe("01 / 02");
    expect(stepLabel({ kind: SupplyStepKind.Material })).toBe("01 / 02");
  });

  it("labels the details step as the second of two", () => {
    expect(stepLabel(detailsStep)).toBe("02 / 02");
  });
});
