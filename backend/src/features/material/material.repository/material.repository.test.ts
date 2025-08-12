import {
  Collection,
  DeleteResult,
  ObjectId,
  UpdateResult,
  WithId,
} from "mongodb";

import dbManager from "@/db/dbManager.js";

import { MaterialModel, VariantModel } from "../material.model.js";

import {
  MaterialRepository,
  VariantRepository,
} from "./material.repository.js";

jest.mock("@/db/dbManager.js", () => ({
  db: {
    collection: jest.fn(),
  },
}));

const collectionName = "material";

const newItem: MaterialModel = {
  name: "Test",
  description: "description",
  materialType: new ObjectId(),
  variants: [],
};
const mockId = new ObjectId();
const mockItem = { ...newItem, _id: mockId };
const mockItems = [mockItem];
const mockCollection = {
  find: jest.fn().mockReturnValue({
    toArray: jest.fn().mockResolvedValue(mockItems),
  }),
  findOne: jest.fn(),
  insertOne: jest.fn(),
  updateOne: jest.fn(),
  deleteOne: jest.fn(),
} as unknown as jest.Mocked<Collection<MaterialModel>>;

(dbManager.db.collection as jest.Mock).mockReturnValue(mockCollection);

describe("Variant repository", () => {
  const mockVariant: VariantModel = {
    variant: "variant",
    photo_url: "photo_url",
  };
  describe("createVariant", () => {
    test("returns true if modifiedCount is 1", async () => {
      const variantRepository = new VariantRepository(collectionName);
      mockCollection.updateOne.mockResolvedValue({
        modifiedCount: 1,
      } as UpdateResult);
      const result = await variantRepository.createVariant(
        new ObjectId(),
        mockVariant
      );
      expect(result).toBe(true);
    });
    test("returns false if modifiedCount is 0", async () => {
      const variantRepository = new VariantRepository(collectionName);
      mockCollection.updateOne.mockResolvedValue({
        modifiedCount: 0,
      } as UpdateResult);
      const result = await variantRepository.createVariant(
        new ObjectId(),
        mockVariant
      );
      expect(result).toBe(false);
    });
    test("pass correct args", async () => {
      const variantRepository = new VariantRepository(collectionName);
      mockCollection.updateOne.mockResolvedValue({
        modifiedCount: 1,
      } as UpdateResult);
      const id = new ObjectId();
      await variantRepository.createVariant(id, mockVariant);
      expect(mockCollection.updateOne).toHaveBeenCalled();
    });
  });
  describe("deleteVariant", () => {
    test("returns true if modifiedCount is 1", async () => {
      const variantRepository = new VariantRepository(collectionName);
      mockCollection.updateOne.mockResolvedValue({
        modifiedCount: 1,
      } as UpdateResult);
      const result = await variantRepository.deleteVariant(
        new ObjectId(),
        new ObjectId()
      );
      expect(result).toBe(true);
    });
    test("returns false if modifiedCount is 0", async () => {
      const variantRepository = new VariantRepository(collectionName);
      mockCollection.updateOne.mockResolvedValue({
        modifiedCount: 0,
      } as UpdateResult);
      const result = await variantRepository.deleteVariant(
        new ObjectId(),
        new ObjectId()
      );
      expect(result).toBe(false);
    });
    test("pass correct args", async () => {
      const variantRepository = new VariantRepository(collectionName);
      mockCollection.updateOne.mockResolvedValue({
        modifiedCount: 1,
      } as UpdateResult);
      const id = new ObjectId();
      const variantId = new ObjectId();
      await variantRepository.deleteVariant(id, variantId);
      expect(mockCollection.updateOne).toHaveBeenCalledWith(
        { _id: id } as WithId<MaterialModel>,
        {
          $pull: {
            variants: {
              _id: { $eq: variantId },
            },
          },
        }
      );
    });
  });
  describe("updateVariant", () => {
    test("returns true if modifiedCount is 1", async () => {
      const variantRepository = new VariantRepository(collectionName);
      mockCollection.updateOne.mockResolvedValue({
        modifiedCount: 1,
      } as UpdateResult);
      const result = await variantRepository.updateVariant(
        new ObjectId(),
        new ObjectId(),
        mockVariant
      );
      expect(result).toBe(true);
    });
    test("returns false if modifiedCount is 0", async () => {
      const variantRepository = new VariantRepository(collectionName);
      mockCollection.updateOne.mockResolvedValue({
        modifiedCount: 0,
      } as UpdateResult);
      const result = await variantRepository.updateVariant(
        new ObjectId(),
        new ObjectId(),
        mockVariant
      );
      expect(result).toBe(false);
    });
    test("pass correct args", async () => {
      const variantRepository = new VariantRepository(collectionName);
      mockCollection.updateOne.mockResolvedValue({
        modifiedCount: 1,
      } as UpdateResult);
      const id = new ObjectId();
      const variantId = new ObjectId();
      await variantRepository.updateVariant(id, variantId, mockVariant);
      expect(mockCollection.updateOne).toHaveBeenCalledWith(
        { _id: id, "variants._id": variantId },
        {
          $set: { "variants.$": mockVariant },
        }
      );
    });
  });
});

describe("MaterialRepository", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("constructor", () => {
    test("should get the correct collection from dbManager", () => {
      new MaterialRepository(collectionName);
      expect(dbManager.db.collection).toHaveBeenCalledWith(collectionName);
    });
  });
  describe("getAll", () => {
    test("should return results of toArray", async () => {
      (mockCollection.find().toArray as jest.Mock).mockResolvedValue(mockItems);
      const repository = new MaterialRepository(collectionName);
      const allItems = await repository.getAll();

      expect(mockCollection.find).toHaveBeenCalled();
      expect(mockCollection.find().toArray).toHaveBeenCalled();
      expect(allItems).toEqual(mockItems);
    });
  });

  describe("createMaterial", () => {
    test("should call insertOne with correct item", async () => {
      const repository = new MaterialRepository(collectionName);
      mockCollection.updateOne.mockResolvedValue({
        modifiedCount: 1,
      } as UpdateResult);
      const filter = { name: newItem.name };
      await repository.createMaterial(filter, newItem);
      expect(mockCollection.updateOne).toHaveBeenCalledWith(
        filter,
        {
          $setOnInsert: newItem,
        },
        { upsert: true }
      );
    });
  });

  describe("updateById", () => {
    test("should call updateOne with correct id and item", async () => {
      const repository = new MaterialRepository(collectionName);
      const mockResult = {
        acknowledged: true,
        matchedCount: 1,
        modifiedCount: 1,
        upsertedCount: 0,
        upsertedId: null,
      };
      mockCollection.updateOne.mockResolvedValue(mockResult);
      const result = await repository.updateById(mockId, newItem);
      expect(mockCollection.updateOne).toHaveBeenCalledWith(
        { _id: mockId },
        newItem
      );
      expect(result).toEqual(mockResult);
    });
  });

  describe("deleteMaterial", () => {
    test("should call deleteOne with correct value", async () => {
      const repository = new MaterialRepository(collectionName);
      mockCollection.deleteOne.mockResolvedValue({
        deletedCount: 1,
      } as DeleteResult);
      const result = await repository.deleteMaterial(mockId);
      expect(mockCollection.deleteOne).toHaveBeenCalledWith({
        _id: mockId,
        variants: { $size: 0 },
      });
      expect(result).toEqual(true);
    });
    test("should return deleteCount 0 when item not found", async () => {
      const repository = new MaterialRepository(collectionName);

      mockCollection.deleteOne.mockResolvedValue({
        deletedCount: 0,
      } as DeleteResult);
      const result = await repository.deleteMaterial(mockId);
      expect(mockCollection.deleteOne).toHaveBeenCalledWith({
        _id: mockId,
        variants: { $size: 0 },
      });
      expect(result).toBe(false);
    });
  });
});
