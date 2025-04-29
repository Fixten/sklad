import { Collection, Document } from "mongodb";

import dbManager from "../dbManager.js";
import { WithDb } from "../WithDb.js";

export default class DbCollection<NewItem extends Document> {
  #collection?: Collection<WithDb<NewItem>>;
  collectionName: string;
  constructor(collectionName: string) {
    this.collectionName = collectionName;
  }
  #setCollection() {
    this.#collection = dbManager.db.collection<WithDb<NewItem>>(
      this.collectionName
    );
    return this.#collection;
  }
  get collection() {
    return this.#collection ?? this.#setCollection();
  }
}
