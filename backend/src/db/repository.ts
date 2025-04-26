import {
  Collection,
  Document,
  Filter,
  ObjectId,
  OptionalUnlessRequiredId,
  UpdateFilter,
  WithId,
} from "mongodb";

import CreateAndUpdateRepository from "./CreateAndUpdateRepository/index.js";
import dbManager from "./dbManager.js";

import type { WithDb } from "./CreateAndUpdateRepository/index.js";

export default class Repository<NewItem extends Document> {
  #collection: Collection<WithDb<NewItem>>;
  #createAndUpdate: CreateAndUpdateRepository<NewItem>;

  constructor(collectionName: string) {
    this.#collection = dbManager.db.collection<WithDb<NewItem>>(collectionName);
    this.#createAndUpdate = new CreateAndUpdateRepository(this.#collection);
  }
  addNew(newItem: OptionalUnlessRequiredId<NewItem>) {
    return this.#createAndUpdate.insertDoc(newItem);
  }

  updateById(id: ObjectId, updateItem: UpdateFilter<NewItem>) {
    return this.#createAndUpdate.updateDoc(
      { _id: id } as WithId<NewItem>,
      updateItem
    );
  }
  updateByValue(filter: Filter<WithDb<NewItem>>, value: UpdateFilter<NewItem>) {
    return this.#createAndUpdate.updateDoc(filter, value);
  }
  upsert(filter: Filter<WithDb<NewItem>>, update: UpdateFilter<NewItem>) {
    return this.#createAndUpdate.upsert(filter, update);
  }
  getAll() {
    return this.#collection.find().toArray();
  }
  getById(_id: ObjectId, projection?: Document) {
    return projection
      ? this.#collection.findOne({ _id } as WithId<NewItem>, { projection })
      : this.#collection.findOne({ _id } as WithId<NewItem>);
  }
  getByValue(value: Filter<WithDb<NewItem>>, projection?: Document) {
    return this.#collection.findOne(value, { projection });
  }
  async deleteById(id: ObjectId) {
    const result = await this.#collection.deleteOne({
      _id: id,
    } as WithId<NewItem>);
    return result.acknowledged;
  }

  deleteByValue(value: Filter<WithDb<NewItem>>) {
    return this.#collection.deleteOne(value);
  }
}
