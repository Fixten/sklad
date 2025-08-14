import { getRepositoryMock, objectIdStringMock } from "@/db/repository.mock.js";

import { VariantRepository } from "../material/material.repository/material.repository.js";
import { variantRepositoryMock } from "../material/material.repository/material.repository.mock.js";

import { SupplyModel } from "./supply.model.js";
import { supplyDTOMock } from "./supply.model.mock.js";
import { SupplyService } from "./supply.service.js";

const repositoryMock = getRepositoryMock<SupplyModel>();

const variantMock = variantRepositoryMock as unknown as VariantRepository;

describe("supply service", () => {
  afterEach(() => {
    jest.resetAllMocks();
  });
  describe("create", () => {
    it("variant id should be validated in variant service", async () => {
      const service = new SupplyService(repositoryMock, variantMock);
      await service.addNew(supplyDTOMock);
      expect(variantRepositoryMock.getById).toHaveBeenCalledWith(
        supplyDTOMock.variantId
      );
    });
    it("if variant id is wrong throw error", async () => {
      variantRepositoryMock.getById.mockRejectedValue({});
      const service = new SupplyService(repositoryMock, variantMock);
      try {
        await service.addNew(supplyDTOMock);
      } catch (error) {
        expect(error).toBeTruthy();
      }
    });
  });

  describe("update", () => {
    it("variant id should be validated in variant service", async () => {
      const service = new SupplyService(repositoryMock, variantMock);
      await service.update(objectIdStringMock, supplyDTOMock);
      expect(variantRepositoryMock.getById).toHaveBeenCalledWith(
        supplyDTOMock.variantId
      );
    });
    it("if variant id is wrong throw error", async () => {
      variantRepositoryMock.getById.mockRejectedValue({});
      const service = new SupplyService(repositoryMock, variantMock);
      try {
        await service.addNew(supplyDTOMock);
      } catch (error) {
        expect(error).toBeTruthy();
      }
    });
  });
});
