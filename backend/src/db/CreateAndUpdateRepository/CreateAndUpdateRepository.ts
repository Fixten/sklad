import {
  Collection,
  Document,
  OptionalUnlessRequiredId,
  ObjectId,
  UpdateFilter,
  Filter,
  WithId,
} from "mongodb";

import DbCollection from "../DbCollection/index.js";
import { WithDb } from "../WithDb.js";

import { upsertAndReturn } from "./upsertAndReturn.js";

export async function insert<T extends Document>(
  collection: Collection<WithDb<T>>,
  document: OptionalUnlessRequiredId<T>
): Promise<WithDb<T> | null> {
  const docToInsert = {
    ...document,
    _id: new ObjectId(),
    createdAt: new Date(),
    updatedAt: new Date(),
  } as WithDb<T>;
  const result = await collection.insertOne(
    docToInsert as unknown as OptionalUnlessRequiredId<WithDb<T>>
  );

  return result.acknowledged ? docToInsert : null;
}

export async function update<T extends Document>(
  collection: Collection<WithDb<T>>,
  filter: Filter<WithDb<T>>,
  value: UpdateFilter<T>
): Promise<WithId<WithDb<T>> | null> {
  const actualUpdate = {
    ...value,
    updatedAt: new Date(),
  };

  return await collection.findOneAndUpdate(filter, actualUpdate, {
    returnDocument: "after",
  });
}

export default class CreateAndUpdateRepository<T extends Document> {
  #db: DbCollection<T>;
  constructor(dbCollection: DbCollection<T>) {
    this.#db = dbCollection;
  }

  insertDoc(document: OptionalUnlessRequiredId<T>) {
    return insert(this.#db.collection, document);
  }

  updateDoc(filter: Filter<WithDb<T>>, value: UpdateFilter<T>) {
    return update(this.#db.collection, filter, value);
  }

  upsert(filter: Filter<WithDb<T>>, update: UpdateFilter<T>) {
    return upsertAndReturn(this.#db.collection, filter, update);
  }
}
