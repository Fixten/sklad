import { Collection } from "mongodb";

import dbManager from "db/dbManager.js";

import { SettingsModel } from "./settings.model.js";

const collectionName = "settings";

export class SettingsRepository {
  #collection: Collection<SettingsModel>;
  constructor() {
    this.#collection = dbManager.db.collection<SettingsModel>(collectionName);
  }
  getConfig() {
    return this.#collection.findOne({});
  }
  updateConfig(updateItem: SettingsModel) {
    return this.#collection.updateOne({}, updateItem, { upsert: true });
  }
}

export default new SettingsRepository();
