import { ObjectId } from "mongodb";

import { SupplyModel } from "./supply.model.js";
import supplyRepository from "./supply.repository.js";

import type { SupplyRepositoryType } from "./supply.repository.js";

export class SupplyService {
  #repository: SupplyRepositoryType;
  constructor(repository: SupplyRepositoryType) {
    this.#repository = repository;
  }
  async addNew(supply: SupplyModel) {
    return this.#repository.addNew(supply);
  }
  delete(id: ObjectId) {
    return this.#repository.deleteById(id);
  }
  update(id: ObjectId, newValue: SupplyModel) {
    return this.#repository.updateById(id, newValue);
  }
  getById(id: ObjectId) {
    return this.#repository.getById(id);
  }
}

export default new SupplyService(supplyRepository);
