import { ErrorMessages } from "@/constants/Errors.js";

import {
  type MaterialUnit,
  quantityScale,
} from "../features/materialVariant/utils/quantity.js";

import {
  DecimalInput,
  divideTruncated,
  integerToDecimal,
  scaledInteger,
} from "./decimal.js";

export const MONEY_DECIMALS = 2;
export const MONEY_SCALE = 10 ** MONEY_DECIMALS;

const UNIT_COST_DECIMALS = 4;

export function rubToKopecks(value: DecimalInput): number {
  const kopecks = scaledInteger(value, MONEY_DECIMALS, "truncate");
  if (kopecks < 0) throw new Error(ErrorMessages.PRICE_NEGATIVE);
  return kopecks;
}

export function kopecksToRub(kopecks: number): number {
  return integerToDecimal(kopecks, MONEY_DECIMALS);
}

/**
 * Cost of a single unit in RUB: total price divided by quantity, truncated
 * below the kopeck. Amounts are already in kopecks and scaled integers, so the
 * ratio is normalized by both scales before the division.
 */
export function unitPurchaseCostRub(
  purchasePriceKopecks: number,
  quantityScaled: number,
  unit: MaterialUnit,
): number {
  return divideTruncated(
    purchasePriceKopecks * quantityScale(unit),
    quantityScaled * MONEY_SCALE,
    UNIT_COST_DECIMALS,
  );
}
