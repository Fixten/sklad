import zod from "zod";

import { UnitShortLabels, type Unit } from "@/features/units";
import { formatAmount, parseAmount } from "@/lib/amount";

export interface UnitCostValues {
  quantity: string;
  price: string;
}

export interface UnitCostPreview {
  value: number;
  formula: string;
}

/**
 * Builds a zod string field that parses a formatted amount and reports
 * `message` when the input is not a number.
 */
export const amountField = (message: string) =>
  zod.string().transform((raw, context) => {
    const value = parseAmount(raw);

    if (value === null) {
      context.addIssue({ code: "custom", message });

      return zod.NEVER;
    }

    return value;
  });

/**
 * Counts the fractional digits of a number, including exponent notation
 * (for example, `1e-7` has seven).
 */
export const decimalPlaces = (value: number) => {
  const [coefficient = "", exponentText] = String(value)
    .toLowerCase()
    .split("e");
  const fractionLength = coefficient.split(".")[1]?.length ?? 0;
  const exponent = exponentText === undefined ? 0 : Number(exponentText);

  return Math.max(0, fractionLength - exponent);
};

/**
 * Builds the quantity schema: a positive amount, whole for `pieces` and at most
 * three decimal places otherwise.
 */
export const quantityField = (unit: Unit) =>
  amountField("Укажите количество")
    .refine((value) => value > 0, "Укажите количество")
    .refine(
      (value) =>
        unit === "pieces" ? Number.isInteger(value) : decimalPlaces(value) <= 3,
      unit === "pieces"
        ? "Количество в штуках должно быть целым"
        : "Не больше трёх знаков после запятой",
    );

/**
 * Derives the price per unit and its formula from a lot's total price and
 * quantity.
 *
 * @param values - the lot's quantity and total price as form strings.
 * @param unit - the unit the quantity is measured in.
 * @returns the price per unit and formula, or `undefined` when a value is
 * missing or the quantity is not positive.
 */
export function unitCostPreview(
  values: UnitCostValues,
  unit: Unit,
): UnitCostPreview | undefined {
  const quantity = parseAmount(values.quantity);
  const price = parseAmount(values.price);

  if (price === null || quantity === null || quantity <= 0) return undefined;

  return {
    value: price / quantity,
    formula: `${formatAmount(price)} ₽ ÷ ${formatAmount(quantity)} ${UnitShortLabels[unit]}`,
  };
}

/**
 * Formats a price-per-unit value with the unit's short label.
 */
export const formatUnitCost = (value: number, unit: Unit) =>
  `${formatAmount(value)} ₽ / ${UnitShortLabels[unit]}`;
