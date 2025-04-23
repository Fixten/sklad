import { NewUnit } from "./unit.model.js";
import unitRepository from "./unit.repository.js";

import type { UnitRepositoryType } from "./unit.repository.js";

export class UnitService {
  #repository: UnitRepositoryType;
  constructor(repository: UnitRepositoryType) {
    this.#repository = repository;
  }
  async addNew(unit: NewUnit) {
    const current = await this.#repository.getByValue(unit);
    if (current) throw new Error("This unit already exists");
    else return this.#repository.addNew(unit);
  }
  delete(unit: NewUnit) {
    return this.#repository.deleteByValue(unit);
  }
  update(oldValue: NewUnit, newValue: NewUnit) {
    return this.#repository.updateByValue(oldValue, newValue);
  }
  getAll() {
    return this.#repository.getAll();
  }
}

export default new UnitService(unitRepository);
