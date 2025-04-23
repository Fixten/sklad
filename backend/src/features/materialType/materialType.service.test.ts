import { MaterialTypeService } from "./materialType.service.js";
import type { NewMaterialType } from "./materialType.model.js";

jest.mock("./materialType.repository.js", () => {});

const mockRepository = {
  getByValue: jest.fn(),
  addNew: jest.fn(),
  deleteByValue: jest.fn(),
  updateByValue: jest.fn(),
  getAll: jest.fn(),
};

describe("MaterialTypeService", () => {
  let service: MaterialTypeService;

  beforeEach(() => {
    jest.clearAllMocks();
    service = new MaterialTypeService(mockRepository);
  });

  const newItem: NewMaterialType = { name: "meter" };
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
    test("should call repository deleteByValue", () => {
      service.delete(newItem);
      expect(mockRepository.deleteByValue).toHaveBeenCalledWith(newItem);
    });
  });

  describe("update", () => {
    test("should call repository updateByValue with correct parameters", () => {
      const oldItem: NewMaterialType = { name: "abc" };
      service.update(oldItem, newItem);
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
