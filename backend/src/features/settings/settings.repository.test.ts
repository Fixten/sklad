import { Collection } from "mongodb";

import dbManager from "db/dbManager.js";

import { NewSettings } from "./settings.model.js";
import { SettingsRepository } from "./settings.repository.js";

jest.mock("db/dbManager.js", () => ({
  db: {
    collection: jest.fn(),
  },
}));

const mockSettings = { work_hour_cost: 500 };

const mockCollection: jest.Mocked<Collection<NewSettings>> = {
  findOne: jest.fn(),
  updateOne: jest.fn(),
} as unknown as jest.Mocked<Collection<NewSettings>>;

(dbManager.db.collection as jest.Mock).mockReturnValue(mockCollection);

describe("SettingsRepository", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("constructor", () => {
    test("should get the correct collection from dbManager", () => {
      new SettingsRepository();
      expect(dbManager.db.collection).toHaveBeenCalledWith("settings");
    });
  });

  describe("getConfig", () => {
    test("should call findOne with empty object", async () => {
      const settingsRepository = new SettingsRepository();
      mockCollection.findOne.mockResolvedValue(mockSettings);
      const result = await settingsRepository.getConfig();
      expect(mockCollection.findOne).toHaveBeenCalledWith({});
      expect(result).toEqual(mockSettings);
    });

    test("should return null when no settings found", async () => {
      mockCollection.findOne.mockResolvedValue(null);
      const settingsRepository = new SettingsRepository();
      const result = await settingsRepository.getConfig();
      expect(mockCollection.findOne).toHaveBeenCalledWith({});
      expect(result).toBeNull();
    });
  });

  describe("updateConfig", () => {
    test("should call updateOne with empty filter and provided settings", async () => {
      const mockResult = {
        acknowledged: true,
        matchedCount: 1,
        modifiedCount: 1,
        upsertedCount: 0,
        upsertedId: null,
      };
      mockCollection.updateOne.mockResolvedValue(mockResult);
      const settingsRepository = new SettingsRepository();

      const result = await settingsRepository.updateConfig(mockSettings);
      expect(mockCollection.updateOne).toHaveBeenCalledWith({}, mockSettings, {
        upsert: true,
      });
      expect(result).toEqual(mockResult);
    });
  });
});
