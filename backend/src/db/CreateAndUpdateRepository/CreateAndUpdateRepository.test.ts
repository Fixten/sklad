import { Collection, ObjectId } from "mongodb";

import { WithDb } from "../WithDb.js";

import CreateAndUpdateRepository, {
  insert,
  update,
} from "./CreateAndUpdateRepository.js";
import { upsertAndReturn } from "./upsertAndReturn.js";
import DbCollection from "../DbCollection/index.js";

interface ValueType {
  name: string;
}

const mockCollection = {
  insertOne: jest.fn(),
  findOneAndUpdate: jest.fn(),
};

describe("CreateAndUpdateRepository", () => {
  const mockValue: ValueType = {
    name: "name",
  };
  describe("insert", () => {
    test("return doc", async () => {
      mockCollection.insertOne.mockResolvedValue({ acknowledged: true });
      const result = await insert<ValueType>(
        mockCollection as unknown as Collection<WithDb<ValueType>>,
        mockValue
      );
      expect(result).toEqual({
        _id: expect.any(ObjectId),
        createdAt: expect.any(Date),
        updatedAt: expect.any(Date),
        ...mockValue,
      });
    });
    test("return null if not acknowledged", async () => {
      mockCollection.insertOne.mockResolvedValue({ acknowledged: false });
      await expect(
        insert<ValueType>(
          mockCollection as unknown as Collection<WithDb<ValueType>>,
          mockValue
        )
      ).resolves.toBe(null);
    });
  });
  describe("update", () => {
    const mockResult = { ...mockValue, updatedAt: expect.any(Date) };
    it("return updated doc", async () => {
      mockCollection.findOneAndUpdate.mockResolvedValue(mockResult);
      const result = await update<ValueType>(
        mockCollection as unknown as Collection<WithDb<ValueType>>,
        mockValue,
        mockValue
      );
      expect(result).toEqual(mockResult);
    });
    it("return null", async () => {
      mockCollection.findOneAndUpdate.mockResolvedValue(null);
      const result = await update<ValueType>(
        mockCollection as unknown as Collection<WithDb<ValueType>>,
        mockValue,
        mockValue
      );
      expect(result).toEqual(null);
    });
  });
  describe("upsert", () => {
    const mockResult = { ...mockValue, updatedAt: expect.any(Date) };

    it("return updated doc", async () => {
      mockCollection.findOneAndUpdate.mockResolvedValue(mockResult);
      const result = await upsertAndReturn<ValueType>(
        mockCollection as unknown as Collection<WithDb<ValueType>>,
        mockValue,
        mockValue
      );
      expect(result).toEqual(mockResult);
    });
    test("called with correct args", async () => {
      mockCollection.findOneAndUpdate.mockResolvedValue(mockResult);
      await upsertAndReturn<ValueType>(
        mockCollection as unknown as Collection<WithDb<ValueType>>,
        mockValue,
        mockValue
      );
      expect(mockCollection.findOneAndUpdate).toHaveBeenCalledWith(
        mockValue,
        {
          $set: {
            ...mockValue,
            updatedAt: expect.any(Date),
          },
          $setOnInsert: {
            createdAt: expect.any(Date),
          },
        },
        {
          upsert: true,
          returnDocument: "after",
        }
      );
    });
  });

  describe("class isntance", () => {
    const mockDbCollection = {
      collection: mockCollection,
    } as unknown as DbCollection<ValueType>;
    const mockInsert = jest.fn();
    const mockUpdate = jest.fn();
    const mockUpsertAndReturn = jest.fn();
    const instance = new CreateAndUpdateRepository(
      mockDbCollection,
      mockInsert,
      mockUpdate,
      mockUpsertAndReturn
    );

    describe("insertDoc", () => {
      test("throw if not acknowledged", async () => {
        mockInsert.mockResolvedValue(null);
        await expect(instance.insertDoc(mockValue)).rejects.toBeTruthy();
      });
    });
    describe("updateDoc", () => {
      it("throw if update failed", async () => {
        mockUpdate.mockResolvedValue(null);
        await expect(
          instance.updateDoc(mockValue, mockValue)
        ).rejects.toBeTruthy();
      });
    });
    describe("upsert", () => {
      it("throw if no value returned", async () => {
        mockUpsertAndReturn.mockResolvedValue(null);
        await expect(
          instance.upsert(mockValue, mockValue)
        ).rejects.toBeTruthy();
      });
    });
  });
});
