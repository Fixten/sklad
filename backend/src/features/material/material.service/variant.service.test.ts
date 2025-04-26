import { ObjectId } from "mongodb";

import { supplyModelMock } from "../../supply/supply.model.mock.js";
import { SupplyService } from "../../supply/supply.service.js";
import { supplyServiceMock } from "../../supply/supply.service.mock.js";
import { VariantModel } from "../material.model.js";
import { variantRepositoryMock } from "../material.repository/material.repository.mock.js";

import { VariantService } from "./variant.service.js";

import type { VariantRepository } from "../material.repository/index.js";

const materialId = new ObjectId();

describe("VariantService", () => {
  let variantService: VariantService;

  beforeEach(() => {
    jest.clearAllMocks();
    variantService = new VariantService(
      variantRepositoryMock as unknown as VariantRepository,
      supplyServiceMock as unknown as SupplyService
    );
  });

  const variantName = "Red";
  describe("deleteVariant", () => {
    test("should delete variant when it exists and has no supplies", async () => {
      variantRepositoryMock.deleteVariant.mockResolvedValue(true);
      await variantService.deleteVariant(materialId, variantName);
      expect(variantRepositoryMock.deleteVariant).toHaveBeenCalledWith(
        materialId,
        variantName
      );
    });
    test("should throw error when repository resolves to false", async () => {
      const materialId = new ObjectId();
      variantRepositoryMock.deleteVariant.mockResolvedValue(false);
      await expect(
        variantService.deleteVariant(materialId, "Red")
      ).rejects.toThrow("Did not delete variant");
    });
  });

  describe("updateVariant", () => {
    test("should update variant when it exists", async () => {
      const materialId = new ObjectId();
      const newVariant: VariantModel = {
        variant: "Dark Red",
        photo_url: "dark-red.jpg",
        supplies: [],
      };
      variantRepositoryMock.updateVariant.mockResolvedValue(true);
      await variantService.updateVariant(materialId, newVariant);
      expect(variantRepositoryMock.updateVariant).toHaveBeenCalledWith(
        materialId,
        { variant: "Dark Red", photo_url: "dark-red.jpg" }
      );
    });
    test("should throw error when variant is not found", async () => {
      const materialId = new ObjectId();
      const newVariant: VariantModel = {
        variant: "Dark Red",
        photo_url: "dark-red.jpg",
        supplies: [],
      };
      variantRepositoryMock.updateVariant.mockResolvedValue(false);
      await expect(
        variantService.updateVariant(materialId, newVariant)
      ).rejects.toThrow("Did not update variant");
    });
  });

  describe("supply methods", () => {
    const materialMock = {};
    describe("addSupply", () => {
      test("should call methods with correct args", async () => {
        supplyServiceMock.addNew.mockResolvedValue(supplyModelMock);
        variantRepositoryMock.addSupply.mockResolvedValue({});
        const result = await variantService.addSupply(
          materialId,
          variantName,
          supplyModelMock
        );

        expect(supplyServiceMock.addNew).toHaveBeenCalledWith(supplyModelMock);
        expect(variantRepositoryMock.addSupply).toHaveBeenCalledWith(
          materialId,
          variantName,
          result.supply?._id
        );
      });
      test("should return correct data", async () => {
        supplyServiceMock.addNew.mockResolvedValue(supplyModelMock);
        variantRepositoryMock.addSupply.mockResolvedValue(materialMock);
        const result = await variantService.addSupply(
          materialId,
          variantName,
          supplyModelMock
        );

        expect(result).toEqual({
          material: materialMock,
          supply: supplyModelMock,
        });
      });
    });
    describe("deleteSupply", () => {
      test("should return material value if both mocks resolve value", async () => {
        variantRepositoryMock.deleteSupply.mockResolvedValue(materialMock);
        supplyServiceMock.delete.mockResolvedValue(true);
        const result = await variantService.deleteSupply(
          materialId,
          variantName,
          new ObjectId()
        );
        expect(result).toBe(materialMock);
      });
      test("should return null if mocks fail", async () => {
        variantRepositoryMock.deleteSupply.mockResolvedValue(null);
        supplyServiceMock.delete.mockResolvedValue(false);
        const result = await variantService.deleteSupply(
          materialId,
          variantName,
          new ObjectId()
        );
        expect(result).toBe(null);
      });
    });
  });
});
