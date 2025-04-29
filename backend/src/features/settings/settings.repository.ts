import Repository from "@/db/repository.js";

import { SettingsModel } from "./settings.model.js";

const collectionName = "settings";

export class SettingsRepository {
  #baseRepository: Repository<SettingsModel>;

  constructor() {
    this.#baseRepository = new Repository(collectionName);
  }
  getConfig() {
    return this.#baseRepository.getByValue({});
  }
  updateConfig(updateItem: SettingsModel) {
    return this.#baseRepository.upsert({}, updateItem);
  }
}

export default new SettingsRepository();
