import { Collection, Document, Filter, UpdateFilter } from "mongodb";

import { WithDb } from "./WithDb.js";

/**
 * Upserts (inserts or updates) a document and returns the resulting document.
 * Automatically handles _id, createdAt, and updatedAt.
 *
 * @param collection - The MongoDB collection.
 * @param filter - The filter to find the document.
 * @param update - The update object (fields to set).
 * @returns The inserted or updated document.
 */
export async function upsertAndReturn<T extends Document>(
  collection: Collection<WithDb<T>>,
  filter: Filter<WithDb<T>>,
  update: UpdateFilter<T>
) {
  const timestamp = new Date();

  const result = await collection.findOneAndUpdate(
    filter,
    {
      ...update,
      $setOnInsert: {
        createdAt: timestamp,
      } as WithDb<T>,
      updatedAt: timestamp,
    },
    {
      upsert: true,
      returnDocument: "after",
    }
  );
  return result;
}
