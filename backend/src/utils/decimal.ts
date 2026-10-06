import { ErrorMessages } from "@/constants/Errors.js";

export type DecimalInput = number | string;

const decimalPattern = /^[+-]?(\d+(\.\d*)?|\.\d+)$/;

/**
 * Renders a number in plain notation, expanding exponent form (`1e-7`) that
 * `String()` would produce and that the decimal pattern rejects.
 */
function numberToPlainString(value: number) {
  const raw = String(value);
  return /[eE]/.test(raw)
    ? value.toFixed(20).replace(/0+$/, "").replace(/\.$/, "")
    : raw;
}

export function toPlainDecimal(value: DecimalInput): string {
  if (typeof value === "number" && !Number.isFinite(value))
    throw new Error(ErrorMessages.INVALID_DECIMAL_VALUE);
  const raw =
    typeof value === "number" ? numberToPlainString(value) : value.trim();
  if (!decimalPattern.test(raw))
    throw new Error(ErrorMessages.INVALID_DECIMAL_VALUE);
  return raw;
}

/**
 * Converts a decimal to its integer at the given scale. Reject mode refuses a
 * fraction wider than the scale, truncate mode discards the excess.
 */
export function scaledInteger(
  value: DecimalInput,
  decimals: number,
  mode: "reject" | "truncate",
): number {
  const raw = toPlainDecimal(value);
  const negative = raw.startsWith("-");
  const [integer = "", fraction = ""] = raw.replace(/^[+-]/, "").split(".");
  if (mode === "reject" && fraction.length > decimals)
    throw new Error(ErrorMessages.INVALID_DECIMAL_PRECISION);
  const digits = integer + fraction.slice(0, decimals).padEnd(decimals, "0");
  return digits === "" ? 0 : Number(negative ? `-${digits}` : digits);
}

export function integerToDecimal(value: number, decimals: number): number {
  return value / 10 ** decimals;
}

/**
 * Divides two integers and truncates the quotient to the given number of
 * decimals, always toward zero. A zero denominator yields 0 because no stored
 * quantity may be zero after validation.
 */
export function divideTruncated(
  numerator: number,
  denominator: number,
  decimals: number,
): number {
  if (denominator === 0) return 0;
  const factor = 10 ** decimals;
  return Math.trunc((numerator * factor) / denominator) / factor;
}
