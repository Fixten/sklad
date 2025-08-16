import { objectIdStringMock } from "@/db/repository.mock.js";
import { SupplyRepository } from "@/features/supply/supply.repository.js";

import { VariantRepository } from "../material.repository/material.repository.js";

import { VariantService } from "./variant.service.js";

jest.mock("@/features/supply/supply.repository.js");
jest.mock("../material.repository/material.repository.js");

describe("VariantService", () => {
  const supplyRepo = new SupplyRepository();
  const variantRepo = new VariantRepository("collection");
  const variantService = new VariantService(variantRepo, supplyRepo);
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("deleteVariant", () => {
    test("should call deteleAllForVariant from supply service", async () => {
      await variantService.deleteVariant(
        objectIdStringMock,
        objectIdStringMock
      );
      expect(supplyRepo.deteleAllForVariant).toHaveBeenCalled();
    });
  });
});
