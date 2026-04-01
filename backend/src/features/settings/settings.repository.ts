import db from "@/db/index.js";
import {
  settingsId,
  SettingsModel,
  settingsSchema,
} from "./settings.schema.js";

export class SettingsRepository {
  private db = db;
  private table = settingsSchema;

  getConfig() {
    return this.db
      .select()
      .from(this.table)
      .limit(1)
      .execute()
      .then((rows) => rows[0]);
  }

  updateConfig(updateItem: SettingsModel) {
    return this.db
      .insert(this.table)
      .values({ ...updateItem, id: settingsId })
      .onConflictDoUpdate({ target: this.table.id, set: updateItem })
      .returning()
      .execute()
      .then((rows) => rows[0]);
  }
}

export default new SettingsRepository();
