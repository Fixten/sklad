import {
  Collection,
  Document,
  Filter,
  ObjectId,
  OptionalUnlessRequiredId,
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
  getById(_id: ObjectId) {
    return this.#collection.findOne({ _id } as WithId<NewItem>);
  }
  getByValue(value: Filter<NewItem>) {
    return this.#collection.findOne(value);
  }
  addNew(newItem: OptionalUnlessRequiredId<NewItem>) {
    return this.#collection.insertOne(newItem);
  }
  updateById(updateItem: NewItem, id: ObjectId) {
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
