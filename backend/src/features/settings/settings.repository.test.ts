import { ErrorMessages } from "@/constants/Errors.js";
import Repository from "@/db/repository.js";

import SettingsRepository from "./settings.repository.js";
import { defaultSettings, settingsSchema } from "./settings.schema.js";

jest.mock("@/db/repository.js");

describe("SettingsRepository", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });
  let repo: jest.Mocked<Repository<typeof settingsSchema>>;
  beforeEach(() => {
    repo =
      new Repository(settingsSchema) as jest.Mocked<
        Repository<typeof settingsSchema>
      >;
  });

  test("getConfig returns the settings row when it exists", async () => {
    const row = {
      id: 1,
      work_hour_cost: 500,
    } as unknown as (typeof settingsSchema)["$inferSelect"];
    repo.getById.mockResolvedValue(row);
    const service = new SettingsRepository(repo);
    await expect(service.getConfig()).resolves.toEqual(row);
  });

  test("getConfig returns defaultSettings when the row is missing", async () => {
    repo.getById.mockRejectedValue(new Error(ErrorMessages.ITEM_NOT_FOUND));
    const service = new SettingsRepository(repo);
    await expect(service.getConfig()).resolves.toEqual(defaultSettings);
  });

  test("getConfig propagates unrelated errors", async () => {
    repo.getById.mockRejectedValue(new Error(ErrorMessages.WRONG_UNIT));
    const service = new SettingsRepository(repo);
    await expect(service.getConfig()).rejects.toThrow(ErrorMessages.WRONG_UNIT);
  });
});