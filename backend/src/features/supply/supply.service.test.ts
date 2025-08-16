import { objectIdStringMock } from "@/db/repository.mock.js";

import { VariantRepository } from "../material/material.repository/material.repository.js";

import { supplyDTOMock } from "./supply.model.mock.js";
import { SupplyRepository } from "./supply.repository.js";
import { SupplyService } from "./supply.service.js";

jest.mock("../material/material.repository/material.repository.js");
jest.mock("./supply.repository.js");

describe("supply service", () => {
  afterEach(() => {
    jest.resetAllMocks();
  });

  const supplyRepo = new SupplyRepository();
  const variantRepo = new VariantRepository("collection");

  const service = new SupplyService(supplyRepo, variantRepo);

  describe("create", () => {
    it("variant id should be validated in variant service", async () => {
      await service.addNew(supplyDTOMock);
      expect(variantRepo.getById).toHaveBeenCalledWith(supplyDTOMock.variantId);
    });
    it("if variant id is wrong throw error", async () => {
      (
        variantRepo.getById as jest.MockedFunction<typeof variantRepo.getById>
      ).mockRejectedValue({});
      try {
        await service.addNew(supplyDTOMock);
      } catch (error) {
        expect(error).toBeTruthy();
      }
    });
  });

  describe("update", () => {
    it("variant id should be validated in variant service", async () => {
      await service.update(objectIdStringMock, supplyDTOMock);
      expect(variantRepo.getById).toHaveBeenCalledWith(supplyDTOMock.variantId);
    });
    it("if variant id is wrong throw error", async () => {
      (
        variantRepo.getById as jest.MockedFunction<typeof variantRepo.getById>
      ).mockRejectedValue({});
      try {
        await service.addNew(supplyDTOMock);
      } catch (error) {
        expect(error).toBeTruthy();
      }
    });
  });
});
