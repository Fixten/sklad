import { ObjectId } from "mongodb";

import { objectIdStringMock } from "@/db/repository.mock.js";

import { materialModelMock } from "../material.model.mock.js";
import { MaterialRepository } from "../material.repository/material.repository.js";
import { materialRepositoryMock } from "../material.repository/material.repository.mock.js";

import { MaterialService } from "./material.service.js";
import { VariantService } from "./variant.service.js";
import { variantServiceMock } from "./variant.service.mock.js";

describe("material service", () => {
  afterEach(() => {
    jest.resetAllMocks();
  });
  describe("material service class", () => {
    describe("deleteMaterial", () => {
      const service = new MaterialService(
        materialRepositoryMock as unknown as MaterialRepository,
        variantServiceMock as unknown as VariantService
      );
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
        variants.forEach((variant) =>
          { expect(variantServiceMock.deleteVariant).toHaveBeenCalledWith(
            objectIdStringMock,
            variant._id.toString()
          ); }
        );
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
