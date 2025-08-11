import {
  Document,
  Filter,
  ObjectId,
  OptionalUnlessRequiredId,
  UpdateFilter,
  WithId,
} from "mongodb";

import { throwIfNull } from "./CreateAndUpdateRepository/CreateAndUpdateRepository.js";
import CreateAndUpdateRepository from "./CreateAndUpdateRepository/index.js";
import DbCollection from "./DbCollection/index.js";
import { WithDb } from "./WithDb.js";

export default class Repository<NewItem extends Document> {
  #db: DbCollection<NewItem>;
  #createAndUpdate: CreateAndUpdateRepository<NewItem>;
  constructor(collectionName: string) {
    this.#db = new DbCollection(collectionName);
    this.#createAndUpdate = new CreateAndUpdateRepository(this.#db);
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
    return this.#db.collection.find().toArray();
  }
  getById(_id: ObjectId, projection?: Document) {
    return projection
      ? this.#db.collection.findOne({ _id } as WithId<NewItem>, {
          projection,
        })
      : this.#db.collection.findOne({ _id } as WithId<NewItem>);
  }
  getByValue(value: Filter<WithDb<NewItem>>, projection?: Document) {
    return this.#db.collection.findOne(value, { projection });
  }
  deleteById(id: ObjectId) {
    return throwIfNull(
      this.#db.collection
        .deleteOne({
          _id: id,
        } as WithId<NewItem>)
        .then((result) => result.acknowledged || null)
    );
  }

  deleteByValue(value: Filter<WithDb<NewItem>>) {
    return this.#db.collection.deleteOne(value);
  }
}
