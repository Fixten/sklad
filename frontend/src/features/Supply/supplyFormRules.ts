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
