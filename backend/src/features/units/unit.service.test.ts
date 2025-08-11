import { ObjectId } from "mongodb";

import { UnitRepositoryType } from "./unit.repository.js";
import { UnitService } from "./unit.service.js";

import type { UnitModel } from "./unit.model.js";

jest.mock("./unit.repository.js", () => ({}));

const mockUnitRepository = {
  getByValue: jest.fn(),
  addNew: jest.fn(),
  deleteById: jest.fn(),
  updateByValue: jest.fn(),
  getAll: jest.fn(),
};

describe("UnitService", () => {
  let unitService: UnitService;

  beforeEach(() => {
    jest.clearAllMocks();
    unitService = new UnitService(
      mockUnitRepository as unknown as UnitRepositoryType
    );
  });

  const newUnit: UnitModel = { name: "meter" };
  describe("addNew", () => {
    test("should add new unit when it does not exist", async () => {
      mockUnitRepository.getByValue.mockResolvedValue(null);
      await unitService.addNew(newUnit);
      expect(mockUnitRepository.getByValue).toHaveBeenCalledWith(newUnit);
      expect(mockUnitRepository.addNew).toHaveBeenCalledWith(newUnit);
    });

    test("should throw error when unit already exists", async () => {
      mockUnitRepository.getByValue.mockResolvedValue(newUnit);
      await expect(unitService.addNew(newUnit)).rejects.toThrow(
        "This unit already exists"
      );
      expect(mockUnitRepository.getByValue).toHaveBeenCalledWith(newUnit);
      expect(mockUnitRepository.addNew).not.toHaveBeenCalled();
    });
  });

  describe("delete", () => {
    test("should call repository deleteById", async () => {
      const id = "abcabcabcabcabcabcabcabc";
      const objectId = new ObjectId(id);
      await unitService.delete(id);
      expect(mockUnitRepository.deleteById).toHaveBeenCalledWith(objectId);
    });
  });

  describe("update", () => {
    test("should call repository updateByValue with correct parameters", async () => {
      const oldUnit: UnitModel = { name: "abc" };
      await unitService.update(oldUnit, newUnit);
      expect(mockUnitRepository.updateByValue).toHaveBeenCalledWith(
        oldUnit,
        newUnit
      );
    });
  });

  describe("getAll", () => {
    test("should return all units from repository", async () => {
      const units = [newUnit, { name: "kilogram" }];
      mockUnitRepository.getAll.mockResolvedValue(units);
      const result = await unitService.getAll();
      expect(mockUnitRepository.getAll).toHaveBeenCalled();
      expect(result).toEqual(units);
    });
  });
});
