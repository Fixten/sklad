import { ErrorMessages } from "@/constants/Errors.js";

import {
  divideTruncated,
  integerToDecimal,
  scaledInteger,
  toPlainDecimal,
} from "./decimal.js";

describe("decimal", () => {
  describe("toPlainDecimal", () => {
    test("keeps plain decimal input and trims strings", () => {
      expect(toPlainDecimal(" 10.125 ")).toBe("10.125");
      expect(toPlainDecimal(10.125)).toBe("10.125");
      expect(toPlainDecimal(-0.5)).toBe("-0.5");
      expect(toPlainDecimal(".5")).toBe(".5");
      expect(toPlainDecimal(1e-7)).toBe("0.0000001");
    });

    test("rejects input that is not a decimal number", () => {
      for (const value of [
        Number.NaN,
        Number.POSITIVE_INFINITY,
        "10,50",
        "1e5",
        "abc",
        "",
        " ",
      ]) {
        expect(() => toPlainDecimal(value as number)).toThrow(
          ErrorMessages.INVALID_DECIMAL_VALUE,
        );
      }
    });
  });

  describe("scaledInteger", () => {
    test("scales the fraction to the requested precision", () => {
      expect(scaledInteger("10.125", 3, "reject")).toBe(10125);
      expect(scaledInteger("10.1", 3, "reject")).toBe(10100);
      expect(scaledInteger(10, 3, "reject")).toBe(10000);
      expect(scaledInteger(".5", 2, "reject")).toBe(50);
      expect(scaledInteger(-1.5, 2, "reject")).toBe(-150);
    });

    test("rejects more decimal places than allowed", () => {
      expect(() => scaledInteger("1.2500", 3, "reject")).toThrow(
        ErrorMessages.INVALID_DECIMAL_PRECISION,
      );
      expect(() => scaledInteger(10.129, 2, "reject")).toThrow(
        ErrorMessages.INVALID_DECIMAL_PRECISION,
      );
      expect(() => scaledInteger(1.5, 0, "reject")).toThrow(
        ErrorMessages.INVALID_DECIMAL_PRECISION,
      );
    });

    test("drops extra decimal places in truncate mode", () => {
      expect(scaledInteger("10.124", 2, "truncate")).toBe(1012);
      expect(scaledInteger("10.125", 2, "truncate")).toBe(1012);
      expect(scaledInteger("10.129", 2, "truncate")).toBe(1012);
      expect(scaledInteger(1.15, 2, "truncate")).toBe(115);
      expect(scaledInteger("10.9", 2, "truncate")).toBe(1090);
    });
  });

  describe("integerToDecimal", () => {
    test("restores the decimal value", () => {
      expect(integerToDecimal(12000, 2)).toBe(120);
      expect(integerToDecimal(12550, 2)).toBe(125.5);
      expect(integerToDecimal(5, 0)).toBe(5);
      expect(integerToDecimal(5, 3)).toBe(0.005);
      expect(integerToDecimal(-12550, 2)).toBe(-125.5);
    });
  });

  describe("divideTruncated", () => {
    test("divides with integer arithmetic and truncates", () => {
      expect(divideTruncated(12000 * 1000, 10000 * 100, 4)).toBe(12);
      expect(divideTruncated(12550 * 1000, 3000 * 100, 4)).toBe(41.8333);
      expect(divideTruncated(1, 3, 4)).toBe(0.3333);
    });

    test("returns zero for a zero denominator", () => {
      expect(divideTruncated(100, 0, 2)).toBe(0);
    });
  });
});
