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

const nullError = "Db operation failed";

async function throwIfNull<T>(dbResponse: Promise<T | null>): Promise<T> {
  const result = await dbResponse;
  if (result === null) throw new Error(nullError);
  else return result;
}

export default class CreateAndUpdateRepository<T extends Document> {
  #db: DbCollection<T>;
  #insert: typeof insert;
  #update: typeof update;
  #upsertAndReturn: typeof upsertAndReturn;
  constructor(
    dbCollection: DbCollection<T>,
    insertInjection?: typeof insert,
    updateInjection?: typeof update,
    upsertInjection?: typeof upsertAndReturn
  ) {
    this.#db = dbCollection;
    this.#insert = insertInjection || insert;
    this.#update = updateInjection || update;
    this.#upsertAndReturn = upsertInjection || upsertAndReturn;
  }

  insertDoc(document: OptionalUnlessRequiredId<T>) {
    return throwIfNull(this.#insert(this.#db.collection, document));
  }

  updateDoc(filter: Filter<WithDb<T>>, value: UpdateFilter<T>) {
    return throwIfNull(this.#update(this.#db.collection, filter, value));
  }

  upsert(filter: Filter<WithDb<T>>, update: UpdateFilter<T>) {
    return throwIfNull(
      this.#upsertAndReturn(this.#db.collection, filter, update)
    );
  }
}
