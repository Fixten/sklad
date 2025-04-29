import { ObjectId } from "mongodb";

import { MaterialModel } from "../material.model.js";
import { materialRepositoryMock } from "../material.repository/material.repository.mock.js";

import { MaterialService } from "./material.service.js";

import type { MaterialRepository } from "../material.repository/index.js";

jest.mock("../material.repository/index.js", () => ({}));

describe("MaterialService", () => {
  let materialService: MaterialService;
  beforeEach(() => {
    jest.clearAllMocks();
    materialService = new MaterialService(
      materialRepositoryMock as unknown as MaterialRepository
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
      materialRepositoryMock.createMaterial.mockResolvedValue(true);
      await materialService.create(newMaterial);
      expect(materialRepositoryMock.createMaterial).toHaveBeenCalledWith(
        {
          name: newMaterial.name,
          materialType: newMaterial.materialType,
        },
        newMaterial
      );
    });
    test("should throw error when material already exists", async () => {
      materialRepositoryMock.createMaterial.mockResolvedValue(false);
      await expect(materialService.create(newMaterial)).rejects.toThrow(
        "Did not create material"
      );
      expect(materialRepositoryMock.createMaterial).toHaveBeenCalledWith(
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
      materialRepositoryMock.deleteMaterial.mockResolvedValue(true);
      await materialService.deleteMaterial(materialId);
      expect(materialRepositoryMock.deleteMaterial).toHaveBeenCalledWith(
        materialId
      );
    });
    test("should throw error when method resolves to false", async () => {
      const materialId = new ObjectId();
      materialRepositoryMock.deleteMaterial.mockResolvedValue(false);
      await expect(materialService.deleteMaterial(materialId)).rejects.toThrow(
        "Material was not deleted"
      );
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
      materialRepositoryMock.updateById.mockResolvedValue({
        modifiedCount: 1,
      });
      const result = await materialService.updateMaterial(
        materialId,
        updatedMaterial
      );
      expect(materialRepositoryMock.updateById).toHaveBeenCalledWith(
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
      materialRepositoryMock.getAll.mockResolvedValue(materials);
      const result = await materialService.getAll();
      expect(materialRepositoryMock.getAll).toHaveBeenCalled();
      expect(result).toEqual(materials);
    });
  });
});
