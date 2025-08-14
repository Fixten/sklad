import { ObjectId } from "mongodb";

import { UnitModel } from "./unit.model.js";
import unitRepository from "./unit.repository.js";

import type { UnitRepositoryType } from "./unit.repository.js";

export class UnitService {
  #repository: UnitRepositoryType;
  constructor(repository: UnitRepositoryType) {
    this.#repository = repository;
  }
  addNew(unit: UnitModel) {
    return this.#repository.addNew(unit);
  }
  delete(id: string) {
    return this.#repository.deleteById(new ObjectId(id));
  }
  update(id: string, value: UnitModel) {
    return this.#repository.updateById(new ObjectId(id), value);
  }
  getAll() {
    return this.#repository.getAll();
  }
}

export default new UnitService(unitRepository);
