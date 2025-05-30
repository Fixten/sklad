import { Collection, ObjectId } from "mongodb";

import { WithDb } from "../WithDb.js";

import { insert, update } from "./CreateAndUpdateRepository.js";
import { upsertAndReturn } from "./upsertAndReturn.js";

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
});
