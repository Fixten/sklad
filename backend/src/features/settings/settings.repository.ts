import { eq } from "drizzle-orm";

import Repository from "@/db/repository.js";

import {
  settingsId,
  SettingsModel,
  settingsSchema,
} from "./settings.schema.js";
import { createSingleton } from "@/utils/createSingleton.js";

export default class SettingsRepository {
  private schema = settingsSchema;
  repository;
  static getSingleton = createSingleton(() => new SettingsRepository());

  constructor() {
    this.repository = new Repository(this.schema);
  }

  getConfig() {
    return this.repository.getById(settingsId).then((rows) => rows[0]);
  }

  updateConfig(updateItem: SettingsModel) {
    return this.repository
      .upsert(eq(this.schema.id, settingsId), updateItem)
      .then((result) => result[0]);
  }
}
