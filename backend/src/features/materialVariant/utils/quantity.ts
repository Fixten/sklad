import { ErrorMessages } from "@/constants/Errors.js";

import {
  DecimalInput,
  integerToDecimal,
  scaledInteger,
} from "../../../utils/decimal.js";

const QUANTITY_MAX_DECIMALS = 3;

export const MATERIAL_UNITS = ["pieces", "meters"] as const;
export type MaterialUnit = (typeof MATERIAL_UNITS)[number];

const QUANTITY_UNIT_DECIMALS = {
  pieces: 0,
  meters: QUANTITY_MAX_DECIMALS,
} as const satisfies Record<MaterialUnit, number>;

/**
 * Converts a user-entered quantity to its stored integer, rejecting more
 * decimals than the unit allows (a piece is a whole number, a meter 3).
 */
export function toScaledQuantity(
  value: DecimalInput,
  unit: MaterialUnit,
): number {
  return scaledInteger(value, QUANTITY_UNIT_DECIMALS[unit], "reject");
}

/**
 * Converts a stored quantity integer back to the decimal the API exposes.
 */
export function fromScaledQuantity(scaled: number, unit: MaterialUnit): number {
  return integerToDecimal(scaled, QUANTITY_UNIT_DECIMALS[unit]);
}

/**
 * Rejects a stored quantity of zero or less; stock is never zero or negative.
 */
export function assertPositiveQuantity(scaled: number) {
  if (scaled <= 0) throw new Error(ErrorMessages.QUANTITY_NOT_POSITIVE);
}

/**
 * How many stored integers one unit is worth: 1 piece, 1000 millimeters.
 */
export function quantityScale(unit: MaterialUnit): number {
  return 10 ** QUANTITY_UNIT_DECIMALS[unit];
}
