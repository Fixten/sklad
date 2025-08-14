import { ObjectId } from "mongodb";

import Repository from "@/db/repository.js";

import { supplyModelMock } from "./supply.model.mock.js";
import { SupplyService } from "./supply.service.js";

import type { SupplyModel } from "./supply.model.js";

jest.mock("./supply.repository.js", () => ({}));

const mockRepository = {
  getById: jest.fn(),
  addNew: jest.fn(),
  deleteById: jest.fn(),
  updateById: jest.fn(),
  getAll: jest.fn(),
} as unknown as Repository<SupplyModel>;

describe("SupplyService", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("addNew", () => {
    test("should add new item", async () => {
      const supplyService = new SupplyService(mockRepository);
      await supplyService.addNew(supplyModelMock);
      expect(mockRepository.addNew).toHaveBeenCalledWith(supplyModelMock);
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
      await supplyService.update(id, supplyModelMock);
      expect(mockRepository.updateById).toHaveBeenCalledWith(
        id,
        supplyModelMock
      );
    });
  });

  describe("getById", () => {
    test("should return unit from repository", async () => {
      const supplyService = new SupplyService(mockRepository);
      (mockRepository.getById as jest.Mock).mockResolvedValue(supplyModelMock);
      const id = new ObjectId();
      const result = await supplyService.getById(id);
      expect(mockRepository.getById).toHaveBeenCalled();
      expect(result).toEqual(supplyModelMock);
    });
  });

  describe("getAll", () => {
    test("should return all units from repository", async () => {
      const resolvedValue = [supplyModelMock, supplyModelMock];
      const supplyService = new SupplyService(mockRepository);
      (mockRepository.getAll as jest.Mock).mockResolvedValue(resolvedValue);
      const result = await supplyService.getAll();
      expect(mockRepository.getAll).toHaveBeenCalled();
      expect(result).toEqual(resolvedValue);
    });
  });
});
