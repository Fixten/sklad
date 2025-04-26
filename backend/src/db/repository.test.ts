import { Collection, Document, ObjectId } from "mongodb";

import { WithDb } from "./CreateAndUpdateRepository/index.js";
import dbManager from "./dbManager.js";
import Repository from "./repository.js";

jest.mock("./dbManager.js", () => ({
  db: {
    collection: jest.fn(),
  },
}));

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
  let mockCollection: jest.Mocked<Collection<WithDb<TestItem>>>;
  beforeEach(() => {
    mockCollection = {
      find: jest.fn().mockReturnValue({
        toArray: jest.fn().mockResolvedValue(mockItems),
      }),
      findOne: jest.fn(),
      deleteOne: jest.fn(),
    } as unknown as jest.Mocked<Collection<WithDb<TestItem>>>;

    // Set up the collection mock to be returned by dbManager.db.collection
    (dbManager.db.collection as jest.Mock).mockReturnValue(mockCollection);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("constructor", () => {
    test("should get the correct collection from dbManager", () => {
      new Repository<TestItem>(collectionName);
      expect(dbManager.db.collection).toHaveBeenCalledWith(collectionName);
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
