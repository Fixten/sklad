import { getTestDbWithMigrations } from "@/db/dbTestHelpers.js";
import Repository from "@/db/repository.js";

import SettingsRepository from "./settings.repository.js";
import { settingsSchema } from "./settings.schema.js";
import SettingsService from "./settings.service.js";

import type { TestDbWithMigrations } from "@/db/dbTestHelpers.js";

describe("SettingsRepository with the real database", () => {
  let db: TestDbWithMigrations;
  let service: SettingsService;

  beforeEach(() => {
    db = getTestDbWithMigrations();
    service = new SettingsService(
      new SettingsRepository(new Repository(settingsSchema, db)),
    );
  });

  afterEach(() => {
    db.close();
  });

  test("updateConfig persists the value into the single settings row", () => {
    const updated = service.updateConfig({ work_hour_cost: 750 });

    expect(updated).toMatchObject({ id: 1, work_hour_cost: 750 });
    expect(service.getConfig()).toEqual(updated);
    expect(db.client.select().from(settingsSchema).all()).toHaveLength(1);
  });
});
