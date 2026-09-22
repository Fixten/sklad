import { eq } from "drizzle-orm";

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
  private schema = settingsSchema;
  static getSingleton = createSingleton(() => new SettingsRepository());

  constructor(private repository = new Repository(settingsSchema)) {}

  getConfig() {
    return this.repository.getById(settingsId).catch((error: unknown) => {
      if (
        error instanceof Error &&
        error.message === (ErrorMessages.ITEM_NOT_FOUND as string)
      )
        return defaultSettings;
      throw error;
    });
  }

  updateConfig(updateItem: SettingsModel) {
    return this.repository
      .upsert(eq(this.schema.id, settingsId), updateItem)
      .then((result) => result[0]);
  }
}
