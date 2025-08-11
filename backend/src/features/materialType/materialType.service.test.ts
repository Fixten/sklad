import { ObjectId } from "mongodb";

import { MaterialTypeRepositoryType } from "./materialType.repository.js";
import { MaterialTypeService } from "./materialType.service.js";

import type { MaterialTypeModel } from "./materialType.model.js";

jest.mock("./materialType.repository.js", () => ({}));

const mockRepository = {
  getByValue: jest.fn(),
  addNew: jest.fn(),
  deleteById: jest.fn(),
  updateByValue: jest.fn(),
  getAll: jest.fn(),
};

describe("MaterialTypeService", () => {
  let service: MaterialTypeService;

  beforeEach(() => {
    jest.clearAllMocks();
    service = new MaterialTypeService(
      mockRepository as unknown as MaterialTypeRepositoryType
    );
  });

  const newItem: MaterialTypeModel = { name: "meter" };
  describe("addNew", () => {
    test("should add new item when it does not exist", async () => {
      mockRepository.getByValue.mockResolvedValue(null);
      await service.addNew(newItem);
      expect(mockRepository.getByValue).toHaveBeenCalledWith(newItem);
      expect(mockRepository.addNew).toHaveBeenCalledWith(newItem);
    });

    test("should throw error when item already exists", async () => {
      mockRepository.getByValue.mockResolvedValue(newItem);
      await expect(service.addNew(newItem)).rejects.toThrow(
        "This material type already exists"
      );
      expect(mockRepository.getByValue).toHaveBeenCalledWith(newItem);
      expect(mockRepository.addNew).not.toHaveBeenCalled();
    });
  });

  describe("delete", () => {
    test("should call repository deleteById", async () => {
      const id = "abcabcabcabcabcabcabcabc";
      const objectId = new ObjectId(id);
      await service.delete(id);
      expect(mockRepository.deleteById).toHaveBeenCalledWith(objectId);
    });
  });

  describe("update", () => {
    test("should call repository updateByValue with correct parameters", async () => {
      const oldItem: MaterialTypeModel = { name: "abc" };
      await service.update(oldItem, newItem);
      expect(mockRepository.updateByValue).toHaveBeenCalledWith(
        oldItem,
        newItem
      );
    });
  });

  describe("getAll", () => {
    test("should return all items from repository", async () => {
      const items = [newItem, { name: "kilogram" }];
      mockRepository.getAll.mockResolvedValue(items);
      const result = await service.getAll();
      expect(mockRepository.getAll).toHaveBeenCalled();
      expect(result).toEqual(items);
    });
  });
});
