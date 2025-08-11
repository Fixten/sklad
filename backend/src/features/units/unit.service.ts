import { ObjectId } from "mongodb";

import { UnitModel } from "./unit.model.js";
import unitRepository from "./unit.repository.js";

import type { UnitRepositoryType } from "./unit.repository.js";

export class UnitService {
  #repository: UnitRepositoryType;
  constructor(repository: UnitRepositoryType) {
    this.#repository = repository;
  }
  async addNew(unit: UnitModel) {
    const current = await this.#repository.getByValue(unit);
    if (current) throw new Error("This unit already exists");
    else return this.#repository.addNew(unit);
  }
  delete(id: string) {
    return this.#repository.deleteById(new ObjectId(id));
  }
  update(oldValue: UnitModel, newValue: UnitModel) {
    return this.#repository.updateByValue(oldValue, newValue);
  }
  getAll() {
    return this.#repository.getAll();
  }
}

export default new UnitService(unitRepository);
