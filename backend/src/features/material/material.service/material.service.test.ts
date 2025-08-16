import { ObjectId, WithId } from "mongodb";

import { objectIdStringMock } from "@/db/repository.mock.js";
import { WithDb } from "@/db/WithDb.js";
import { MaterialTypeModel } from "@/features/materialType/materialType.model.js";

import { materialDTOMock, materialModelMock } from "../material.model.mock.js";
import { MaterialRepository } from "../material.repository/material.repository.js";
import { materialRepositoryMock } from "../material.repository/material.repository.mock.js";

import { MaterialService } from "./material.service.js";
import { VariantService } from "./variant.service.js";
import { variantServiceMock } from "./variant.service.mock.js";
import MaterialTypeRepository from "@/features/materialType/materialType.repository.js";

jest.mock("@/features/materialType/materialType.repository.js");

describe("material service", () => {
  afterEach(() => {
    jest.resetAllMocks();
  });

  const materialTypeRepo = new MaterialTypeRepository();
  describe("material service class", () => {
    const service = new MaterialService(
      materialRepositoryMock as unknown as MaterialRepository,
      variantServiceMock as unknown as VariantService,
      materialTypeRepo
    );
    describe("create", () => {
      it("should check if material type exists", async () => {
        (
          materialTypeRepo.get as jest.MockedFunction<
            typeof materialTypeRepo.get
          >
        ).mockResolvedValueOnce(
          materialModelMock as unknown as WithId<WithDb<MaterialTypeModel>>
        );
        await service.create(materialDTOMock);
        expect(materialTypeRepo.get).toHaveBeenCalled();
        expect(materialRepositoryMock.createMaterial).toHaveBeenCalled();
      });
      it("if no material type throw and dont create material", async () => {
        (
          materialTypeRepo.get as jest.MockedFunction<
            typeof materialTypeRepo.get
          >
        ).mockRejectedValueOnce({});
        try {
          await service.create(materialDTOMock);
        } catch (error) {
          expect(error).toBeTruthy();
          expect(materialRepositoryMock.createMaterial).not.toHaveBeenCalled();
        }
      });
    });

    describe("deleteMaterial", () => {
      const variants = [new ObjectId(), new ObjectId(), new ObjectId()];
      it("call deleteMaterial from repo", async () => {
        materialRepositoryMock.getById.mockResolvedValueOnce(materialModelMock);
        await service.deleteMaterial(objectIdStringMock);
        expect(materialRepositoryMock.deleteMaterial).toHaveBeenCalledWith(
          objectIdStringMock
        );
      });
      it("call variant.service delete for each variant", async () => {
        materialRepositoryMock.getById.mockResolvedValueOnce({
          ...materialModelMock,
          variants,
        });
        await service.deleteMaterial(objectIdStringMock);
        variants.forEach((variant) => {
          expect(variantServiceMock.deleteVariant).toHaveBeenCalledWith(
            objectIdStringMock,
            variant._id.toString()
          );
        });
      });
      it("if no material throw", async () => {
        materialRepositoryMock.getById.mockRejectedValueOnce({});
        try {
          await service.deleteMaterial(objectIdStringMock);
        } catch (error) {
          expect(error).toBeTruthy();
          expect(materialRepositoryMock.deleteMaterial).not.toHaveBeenCalled();
        }
      });
      it("if delete variant failes throw and dont call delete material", async () => {
        materialRepositoryMock.getById.mockResolvedValueOnce({
          ...materialModelMock,
          variants,
        });
        variantServiceMock.deleteVariant.mockRejectedValue({});
        try {
          await service.deleteMaterial(objectIdStringMock);
        } catch (error) {
          expect(error).toBeTruthy();
          expect(materialRepositoryMock.deleteMaterial).not.toHaveBeenCalled();
        }
      });
    });
  });
});
