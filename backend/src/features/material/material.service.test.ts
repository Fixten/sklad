import { ObjectId } from "mongodb";

import { MaterialModel, VariantModel } from "./material.model.js";
import {
  MaterialRepository,
  VariantRepository,
} from "./material.repository.js";
import { MaterialService, VariantService } from "./material.service.js";

jest.mock("./material.repository.js", () => ({}));

const mockMaterialRepository = {
  createMaterial: jest.fn(),
  updateById: jest.fn(),
  updateByValue: jest.fn(),
  deleteMaterial: jest.fn(),
  getAll: jest.fn(),
  deleteVariant: jest.fn(),
  updateVariant: jest.fn(),
};

describe("VariantService", () => {
  let variantService: VariantService;

  beforeEach(() => {
    jest.clearAllMocks();
    variantService = new VariantService(
      mockMaterialRepository as unknown as VariantRepository
    );
  });

  describe("deleteVariant", () => {
    test("should delete variant when it exists and has no supplies", async () => {
      const materialId = new ObjectId();
      mockMaterialRepository.deleteVariant.mockResolvedValue(true);
      await variantService.deleteVariant(materialId, "Red");
      expect(mockMaterialRepository.deleteVariant).toHaveBeenCalledWith(
        materialId,
        "Red"
      );
    });
    test("should throw error when repository resolves to false", async () => {
      const materialId = new ObjectId();
      mockMaterialRepository.deleteVariant.mockResolvedValue(false);
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
      mockMaterialRepository.updateVariant.mockResolvedValue(true);
      await variantService.updateVariant(materialId, newVariant);
      expect(mockMaterialRepository.updateVariant).toHaveBeenCalledWith(
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
      mockMaterialRepository.updateVariant.mockResolvedValue(false);
      await expect(
        variantService.updateVariant(materialId, newVariant)
      ).rejects.toThrow("Did not update variant");
    });
  });

  describe("MaterialService", () => {
    let materialService: MaterialService;
    beforeEach(() => {
      jest.clearAllMocks();
      materialService = new MaterialService(
        mockMaterialRepository as unknown as MaterialRepository
      );
    });
    describe("create", () => {
      const newMaterial: MaterialModel = {
        name: "Cotton",
        description: "Soft fabric",
        materialType: new ObjectId(),
        variants: [],
      };
      test("should create a new material when it does not exist", async () => {
        mockMaterialRepository.createMaterial.mockResolvedValue(true);
        await materialService.create(newMaterial);
        expect(mockMaterialRepository.createMaterial).toHaveBeenCalledWith(
          {
            name: newMaterial.name,
            materialType: newMaterial.materialType,
          },
          newMaterial
        );
      });
      test("should throw error when material already exists", async () => {
        mockMaterialRepository.createMaterial.mockResolvedValue(false);
        await expect(materialService.create(newMaterial)).rejects.toThrow(
          "Did not create material"
        );
        expect(mockMaterialRepository.createMaterial).toHaveBeenCalledWith(
          {
            name: newMaterial.name,
            materialType: newMaterial.materialType,
          },
          newMaterial
        );
      });
    });
    describe("deleteMaterial", () => {
      test("should delete material when it exists and has no variants", async () => {
        const materialId = new ObjectId();
        mockMaterialRepository.deleteMaterial.mockResolvedValue(true);
        await materialService.deleteMaterial(materialId);
        expect(mockMaterialRepository.deleteMaterial).toHaveBeenCalledWith(
          materialId
        );
      });
      test("should throw error when method resolves to false", async () => {
        const materialId = new ObjectId();
        mockMaterialRepository.deleteMaterial.mockResolvedValue(false);
        await expect(
          materialService.deleteMaterial(materialId)
        ).rejects.toThrow("Material was not deleted");
      });
    });
    describe("updateMaterial", () => {
      test("should update material properties", async () => {
        const materialId = new ObjectId();
        const materialType = new ObjectId();
        const updatedMaterial: MaterialModel = {
          name: "Silk",
          description: "Luxurious fabric",
          materialType: materialType,
          variants: [],
        };
        const expectedUpdate = {
          name: "Silk",
          description: "Luxurious fabric",
          materialType: materialType,
        };
        mockMaterialRepository.updateById.mockResolvedValue({
          modifiedCount: 1,
        });
        const result = await materialService.updateMaterial(
          materialId,
          updatedMaterial
        );
        expect(mockMaterialRepository.updateById).toHaveBeenCalledWith(
          materialId,
          expectedUpdate
        );
        expect(result).toEqual({ modifiedCount: 1 });
      });
    });
    describe("getAll", () => {
      test("should return all materials", async () => {
        const materials = [
          {
            _id: new ObjectId(),
            name: "Cotton",
            description: "Soft fabric",
            materialType: "Fabric",
            variants: [],
          },
          {
            _id: new ObjectId(),
            name: "Silk",
            description: "Luxurious fabric",
            materialType: "Fabric",
            variants: [],
          },
        ];
        mockMaterialRepository.getAll.mockResolvedValue(materials);
        const result = await materialService.getAll();
        expect(mockMaterialRepository.getAll).toHaveBeenCalled();
        expect(result).toEqual(materials);
      });
    });
  });
});
