import { Collection } from "mongodb";

import dbManager from "db/dbManager.js";

import { NewSettings } from "./settings.model.js";

const collectionName = "settings";

export class SettingsRepository {
  #collection: Collection<NewSettings>;
  constructor() {
    this.#collection = dbManager.db.collection<NewSettings>(collectionName);
  }
  getConfig() {
    return this.#collection.findOne({});
  }
  updateConfig(updateItem: NewSettings) {
    return this.#collection.updateOne({}, updateItem, { upsert: true });
  }
}

export default new SettingsRepository();
