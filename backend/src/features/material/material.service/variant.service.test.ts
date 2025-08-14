import { getRepositoryMock, objectIdStringMock } from "@/db/repository.mock.js";
import { SupplyModel } from "@/features/supply/supply.model.js";

import { variantRepositoryMock } from "../material.repository/material.repository.mock.js";

import { VariantService } from "./variant.service.js";

import type { VariantRepository } from "../material.repository/index.js";

const repositoryMock = getRepositoryMock<SupplyModel>();

describe("VariantService", () => {
  let variantService: VariantService;

  beforeEach(() => {
    jest.clearAllMocks();
    variantService = new VariantService(
      variantRepositoryMock as unknown as VariantRepository,
      repositoryMock
    );
  });

  describe("deleteVariant", () => {
    test("should call deteleAllForVariant from supply service", async () => {
      await variantService.deleteVariant(
        objectIdStringMock,
        objectIdStringMock
      );
      expect(repositoryMock.deleteMany).toHaveBeenCalled();
    });
  });
});
