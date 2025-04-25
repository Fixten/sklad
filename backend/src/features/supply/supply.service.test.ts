import { ObjectId } from "mongodb";

import Repository from "db/repository.js";

import { SupplyService } from "./supply.service.js";

import type { SupplyModel } from "./supply.model.js";

jest.mock("./supply.repository.js", () => ({}));

const mockRepository = {
  getById: jest.fn(),
  addNew: jest.fn(),
  deleteById: jest.fn(),
  updateById: jest.fn(),
} as unknown as Repository<SupplyModel>;

const newSupply: SupplyModel = {
  description: "description",
  supplier: "supplier",
  supply_url: "supply_url",
  unit: "unit",
  price: 100,
  count: 10,
};
describe("SupplyService", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("addNew", () => {
    test("should add new item", async () => {
      const supplyService = new SupplyService(mockRepository);
      await supplyService.addNew(newSupply);
      expect(mockRepository.addNew).toHaveBeenCalledWith(newSupply);
    });
  });

  describe("delete", () => {
    test("should call repository deleteById", async () => {
      const supplyService = new SupplyService(mockRepository);
      const id = new ObjectId();
      await supplyService.delete(id);
      expect(mockRepository.deleteById).toHaveBeenCalledWith(id);
    });
  });

  describe("update", () => {
    test("should call repository updateByValue with correct parameters", async () => {
      const supplyService = new SupplyService(mockRepository);
      const id = new ObjectId();
      await supplyService.update(id, newSupply);
      expect(mockRepository.updateById).toHaveBeenCalledWith(id, newSupply);
    });
  });

  describe("getById", () => {
    test("should return all units from repository", async () => {
      const supplyService = new SupplyService(mockRepository);
      (mockRepository.getById as jest.Mock).mockResolvedValue(newSupply);
      const id = new ObjectId();
      const result = await supplyService.getById(id);
      expect(mockRepository.getById).toHaveBeenCalled();
      expect(result).toEqual(newSupply);
    });
  });
});
