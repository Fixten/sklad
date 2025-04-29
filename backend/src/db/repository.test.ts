import { Document, ObjectId } from "mongodb";

import CreateAndUpdateRepository from "./CreateAndUpdateRepository/index.js";
import Repository from "./repository.js";
import DbCollection from "./DbCollection/index.js";

const mockCollection = {
  find: jest.fn(),
  findOne: jest.fn(),
  deleteOne: jest.fn(),
};

jest.mock("./DbCollection/index.js", () => {
  return jest.fn().mockImplementation(() => {
    return {
      collection: mockCollection,
    };
  });
});

const DbCollectionMock = DbCollection as jest.MockedClass<typeof DbCollection>;

jest.mock("./CreateAndUpdateRepository/index.js");
const CreateAndUpdateRepositoryMock = CreateAndUpdateRepository as jest.Mock;

const collectionName = "testCollection";

interface TestItem extends Document {
  name: string;
  value: number;
}

const newItem: TestItem = { name: "Test", value: 123 };
const mockId = new ObjectId();
const mockItem = { ...newItem, _id: mockId };
const mockItems = [mockItem];

describe("Repository", () => {
  beforeEach(() => {
    mockCollection.find.mockReturnValue({
      toArray: jest.fn().mockResolvedValue(mockItems),
    });
  });
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("constructor", () => {
    test("DbCollection called with collectionName", () => {
      new Repository<TestItem>(collectionName);
      expect(DbCollectionMock).toHaveBeenCalledWith(collectionName);
    });

    test("CreateAndUpdateRepository should get instance of DbCollection", () => {
      new Repository<TestItem>(collectionName);
      expect(CreateAndUpdateRepositoryMock).toHaveBeenCalledWith(
        new DbCollectionMock(collectionName)
      );
    });
  });
  describe("getAll", () => {
    test("should return results of toArray", async () => {
      (mockCollection.find().toArray as jest.Mock).mockResolvedValue(mockItems);
      const repository = new Repository<TestItem>(collectionName);
      const allItems = await repository.getAll();

      expect(mockCollection.find).toHaveBeenCalled();
      expect(mockCollection.find().toArray).toHaveBeenCalled();
      expect(allItems).toEqual(mockItems);
    });
  });
  describe("get", () => {
    test("should call findOne with correct id", async () => {
      mockCollection.findOne.mockResolvedValue(mockItem);
      const repository = new Repository<TestItem>(collectionName);
      const result = await repository.getById(mockId);
      expect(mockCollection.findOne).toHaveBeenCalledWith({ _id: mockId });
      expect(result).toEqual(mockItem);
    });
    test("should return null when item is not found", async () => {
      mockCollection.findOne.mockResolvedValue(null);
      const repository = new Repository<TestItem>(collectionName);
      const result = await repository.getById(mockId);
      expect(mockCollection.findOne).toHaveBeenCalledWith({
        _id: mockId,
      });
      expect(result).toBeNull();
    });
  });

  describe("deleteById", () => {
    test("should call deleteOne with correct id", async () => {
      const repository = new Repository<TestItem>(collectionName);

      const mockResult = {
        acknowledged: true,
        deletedCount: 1,
      };
      mockCollection.deleteOne.mockResolvedValue(mockResult);
      const result = await repository.deleteById(mockId);
      expect(mockCollection.deleteOne).toHaveBeenCalledWith({ _id: mockId });
      expect(result).toEqual(mockResult.acknowledged);
    });
    test("should return deleteCount 0 when item not found", async () => {
      const repository = new Repository<TestItem>(collectionName);

      const mockResult = {
        acknowledged: true,
        deletedCount: 0,
      };
      mockCollection.deleteOne.mockResolvedValue(mockResult);
      const result = await repository.deleteById(mockId);
      expect(mockCollection.deleteOne).toHaveBeenCalledWith({ _id: mockId });
      expect(result).toBe(true);
    });
  });
});
