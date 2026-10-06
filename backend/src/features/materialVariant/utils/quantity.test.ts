import { ErrorMessages } from "@/constants/Errors.js";

import {
  assertPositiveQuantity,
  fromScaledQuantity,
  toScaledQuantity,
} from "./quantity.js";

describe("quantity", () => {
  describe("toScaledQuantity", () => {
    test("stores meters in thousandths", () => {
      expect(toScaledQuantity("1.250", "meters")).toBe(1250);
      expect(toScaledQuantity(2, "meters")).toBe(2000);
    });

    test("rejects meters with more than three decimal places", () => {
      expect(() => toScaledQuantity("1.2500", "meters")).toThrow(
        ErrorMessages.INVALID_DECIMAL_PRECISION,
      );
    });

    test("stores pieces as whole numbers", () => {
      expect(toScaledQuantity(10, "pieces")).toBe(10);
    });

    test("rejects fractional pieces", () => {
      expect(() => toScaledQuantity(1.5, "pieces")).toThrow(
        ErrorMessages.INVALID_DECIMAL_PRECISION,
      );
    });
  });

  describe("fromScaledQuantity", () => {
    test("restores the decimal value per unit", () => {
      expect(fromScaledQuantity(1250, "meters")).toBe(1.25);
      expect(fromScaledQuantity(10, "pieces")).toBe(10);
    });
  });

  describe("assertPositiveQuantity", () => {
    test("accepts positive quantities only", () => {
      expect(() => {
        assertPositiveQuantity(1);
      }).not.toThrow();
      expect(() => {
        assertPositiveQuantity(0);
      }).toThrow(ErrorMessages.QUANTITY_NOT_POSITIVE);
      expect(() => {
        assertPositiveQuantity(-1000);
      }).toThrow(ErrorMessages.QUANTITY_NOT_POSITIVE);
    });
  });
});
