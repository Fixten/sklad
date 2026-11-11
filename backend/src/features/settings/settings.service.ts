import { createSingleton } from "@/utils/createSingleton.js";

import SettingsRepository from "./settings.repository.js";
import { SettingsModel } from "./settings.schema.js";

export default class SettingsService {
  static getSingleton = createSingleton(
    () => new SettingsService(SettingsRepository.getSingleton()),
  );
  constructor(private repository: SettingsRepository) {}

  getConfig() {
    return this.repository.getConfig();
  }

  updateConfig(updateItem: SettingsModel) {
    return this.repository.updateConfig(updateItem);
  }
}
