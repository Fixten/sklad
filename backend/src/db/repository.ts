import {
  Collection,
  Document,
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
  getAll = () => this.#collection.find().toArray();
  get = (_id: ObjectId) => this.#collection.findOne({ _id } as WithId<NewItem>);
  addNew = (newItem: OptionalUnlessRequiredId<NewItem>) =>
    this.#collection.insertOne(newItem);
  update = (updateItem: NewItem, id: ObjectId) =>
    this.#collection.updateOne({ _id: id } as WithId<NewItem>, updateItem);
  deleteMaterial = (id: ObjectId) =>
    this.#collection.deleteOne({ _id: id } as WithId<NewItem>);
}
