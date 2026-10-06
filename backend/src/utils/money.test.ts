import { ErrorMessages } from "@/constants/Errors.js";

import { kopecksToRub, rubToKopecks, unitPurchaseCostRub } from "./money.js";

describe("money", () => {
  describe("rubToKopecks", () => {
    test("converts rub to kopecks", () => {
      expect(rubToKopecks("125.50")).toBe(12550);
      expect(rubToKopecks(120)).toBe(12000);
      expect(rubToKopecks(0)).toBe(0);
      expect(rubToKopecks(1.15)).toBe(115);
    });

    test("rounds down to the smaller monetary value", () => {
      expect(rubToKopecks("10.124")).toBe(1012);
      expect(rubToKopecks("10.125")).toBe(1012);
      expect(rubToKopecks("10.129")).toBe(1012);
      expect(rubToKopecks("10.999")).toBe(1099);
    });

    test("rejects negative amounts", () => {
      expect(() => {
        rubToKopecks("-0.01");
      }).toThrow(ErrorMessages.PRICE_NEGATIVE);
    });
  });

  describe("kopecksToRub", () => {
    test("converts kopecks back to rub", () => {
      expect(kopecksToRub(12550)).toBe(125.5);
      expect(kopecksToRub(12000)).toBe(120);
      expect(kopecksToRub(1)).toBe(0.01);
    });
  });

  describe("unitPurchaseCostRub", () => {
    test("divides the purchase price by the supplied quantity", () => {
      expect(unitPurchaseCostRub(12000, 10, "pieces")).toBe(12);
      expect(unitPurchaseCostRub(0, 5, "pieces")).toBe(0);
    });

    test("keeps sub-kopeck precision for fractional quantities", () => {
      expect(unitPurchaseCostRub(12550, 3000, "meters")).toBe(41.8333);
    });

    test("returns zero instead of dividing by a zero quantity", () => {
      expect(unitPurchaseCostRub(12550, 0, "meters")).toBe(0);
    });
  });
});
