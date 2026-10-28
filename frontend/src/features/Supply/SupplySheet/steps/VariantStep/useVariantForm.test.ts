import { expect, test } from "vitest";
import zod from "zod";

import { variantFormDefaults, variantFormSchema } from "./useVariantForm";

const errorsOf = (
  result: ReturnType<typeof variantFormSchema.safeParse>,
): Record<string, string[]> =>
  result.success ? {} : zod.flattenError(result.error).fieldErrors;

test("requires a variant name and trims it", () => {
  expect(errorsOf(variantFormSchema.safeParse(variantFormDefaults))).toEqual({
    name: ["Укажите название варианта"],
  });

  expect(
    variantFormSchema.safeParse({ ...variantFormDefaults, name: " Доска " })
      .data,
  ).toEqual({ name: "Доска", unit: "meters" });
});

test("accepts the supported units and rejects anything else", () => {
  expect(
    variantFormSchema.safeParse({ ...variantFormDefaults, name: "Доска" }).data,
  ).toEqual({ name: "Доска", unit: "meters" });
  expect(
    variantFormSchema.safeParse({
      ...variantFormDefaults,
      name: "Доска",
      unit: "pieces",
    }).data,
  ).toEqual({ name: "Доска", unit: "pieces" });
  expect(
    errorsOf(
      variantFormSchema.safeParse({
        ...variantFormDefaults,
        name: "Доска",
        unit: "kilograms",
      }),
    ).unit,
  ).toHaveLength(1);
});
