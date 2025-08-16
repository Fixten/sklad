import { Document, ObjectId } from "mongodb";

import CreateAndUpdateRepository from "./CreateAndUpdateRepository/index.js";
import DbCollection from "./DbCollection/index.js";
import Repository from "./repository.js";

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
    test("should throw when item is not found", async () => {
      mockCollection.findOne.mockResolvedValue(null);
      const repository = new Repository<TestItem>(collectionName);
      try {
        await repository.getById(mockId);
      } catch {
        expect(mockCollection.findOne).toHaveBeenCalledWith({
          _id: mockId,
        });
      }
    });
  });

  describe("deleteByValue", () => {
    const filter = { name: "name" };
    test("should call deleteOne with correct filter", async () => {
      const repository = new Repository<TestItem>(collectionName);

      mockCollection.deleteOne.mockResolvedValue({
        acknowledged: true,
      });
      const result = await repository.deleteByValue(filter);
      expect(mockCollection.deleteOne).toHaveBeenCalledWith(filter);
      expect(result).toBe(true);
    });

    test("should throw when result.acknowledged is false", async () => {
      const repository = new Repository<TestItem>(collectionName);
      mockCollection.deleteOne.mockResolvedValue({
        acknowledged: false,
      });
      try {
        await repository.deleteByValue(filter);
      } catch (error) {
        expect(error).toBeTruthy();
      }
    });
  });
});
