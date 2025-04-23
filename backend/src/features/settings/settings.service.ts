import { NewSettings } from "./settings.model.js";
import settingsRepository from "./settings.repository.js";

import type { SettingsRepository } from "./settings.repository.js";

export class SettingsService {
  #repository: SettingsRepository;
  constructor() {
    this.#repository = settingsRepository;
  }
  update(newValue: NewSettings) {
    return this.#repository.updateConfig(newValue);
  }
  getConfig() {
    return this.#repository.getConfig();
  }
}

export default new SettingsService();
