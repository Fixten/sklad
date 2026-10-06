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
    repo = new Repository(settingsSchema) as jest.Mocked<
      Repository<typeof settingsSchema>
    >;
  });

  test("getConfig returns the settings row when it exists", () => {
    const row = {
      id: 1,
      work_hour_cost: 500,
    } as unknown as (typeof settingsSchema)["$inferSelect"];
    repo.getById.mockReturnValue(row);
    const service = new SettingsRepository(repo);
    expect(service.getConfig()).toEqual(row);
  });

  test("getConfig returns defaultSettings when the row is missing", () => {
    repo.getById.mockImplementation(() => {
      throw new Error(ErrorMessages.ITEM_NOT_FOUND);
    });
    const service = new SettingsRepository(repo);
    expect(service.getConfig()).toEqual(defaultSettings);
  });

  test("getConfig propagates unrelated errors", () => {
    repo.getById.mockImplementation(() => {
      throw new Error(ErrorMessages.DB_OPERATION_FAILED);
    });
    const service = new SettingsRepository(repo);
    expect(() => service.getConfig()).toThrow(
      ErrorMessages.DB_OPERATION_FAILED,
    );
  });
});
