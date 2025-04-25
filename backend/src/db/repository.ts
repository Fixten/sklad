import {
  Collection,
  Document,
  Filter,
  ObjectId,
  OptionalUnlessRequiredId,
  UpdateFilter,
  WithId,
} from "mongodb";

import dbManager from "./dbManager.js";

export default class Repository<NewItem extends Document> {
  #collection: Collection<NewItem>;
  constructor(collectionName: string) {
    this.#collection = dbManager.db.collection<NewItem>(collectionName);
  }
  getAll() {
    return this.#collection.find().toArray();
  }
  getById(_id: ObjectId, projection?: Document) {
    return projection
      ? this.#collection.findOne({ _id } as WithId<NewItem>, { projection })
      : this.#collection.findOne({ _id } as WithId<NewItem>);
  }
  getByValue(value: Filter<NewItem>, projection?: Document) {
    return this.#collection.findOne(value, { projection });
  }
  addNew(newItem: OptionalUnlessRequiredId<NewItem>) {
    return this.#collection.insertOne(newItem);
  }
  updateById(id: ObjectId, updateItem: UpdateFilter<NewItem>) {
    return this.#collection.updateOne(
      { _id: id } as WithId<NewItem>,
      updateItem
    );
  }
  updateByValue(oldValue: Filter<NewItem>, newValue: NewItem) {
    return this.#collection.updateOne(oldValue, newValue);
  }
  deleteById(id: ObjectId) {
    return this.#collection.deleteOne({ _id: id } as WithId<NewItem>);
  }

  deleteByValue(value: Filter<NewItem>) {
    return this.#collection.deleteOne(value);
  }
}
