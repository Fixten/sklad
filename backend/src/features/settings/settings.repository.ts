import { ErrorMessages } from "@/constants/Errors.js";
import Repository from "@/db/repository.js";
import { createSingleton } from "@/utils/createSingleton.js";

import {
  defaultSettings,
  settingsId,
  SettingsModel,
  settingsSchema,
} from "./settings.schema.js";

export default class SettingsRepository {
  static getSingleton = createSingleton(() => new SettingsRepository());

  constructor(private repository = new Repository(settingsSchema)) {}

  getConfig() {
    try {
      return this.repository.getById(settingsId);
    } catch (error: unknown) {
      if (
        error instanceof Error &&
        error.message === (ErrorMessages.ITEM_NOT_FOUND as string)
      )
        return defaultSettings;
      throw error;
    }
  }

  updateConfig(updateItem: SettingsModel) {
    const rows = this.repository.upsert(settingsId, updateItem);
    return rows[0];
  }
}
