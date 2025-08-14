import { supplyServiceMock } from "@/features/supply/supply.service.mock.js";

import { variantRepositoryMock } from "../material.repository/material.repository.mock.js";

import { VariantService } from "./variant.service.js";

import type { VariantRepository } from "../material.repository/index.js";


const materialId = "id";

describe("VariantService", () => {
  let variantService: VariantService;

  beforeEach(() => {
    jest.clearAllMocks();
    variantService = new VariantService(
      variantRepositoryMock as unknown as VariantRepository,
      supplyServiceMock
    );
  });

  const variantName = "Red";
  describe("deleteVariant", () => {
    test("should call deteleAllForVariant from supply service", async () => {
      await variantService.deleteVariant(materialId, variantName);
      expect(supplyServiceMock.deteleAllForVariant).toHaveBeenCalled();
    });
  });
});
