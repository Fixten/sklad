import { ObjectId } from "mongodb";

import { SupplyModel } from "./supply.model.js";
import supplyRepository from "./supply.repository.js";

export class SupplyService {
  #repository: typeof supplyRepository;
  constructor(repository: typeof supplyRepository) {
    this.#repository = repository;
  }
  getById(id: string) {
    return this.#repository.getById(new ObjectId(id));
  }
  getAll() {
    return this.#repository.getAll();
  }

  addNew(supply: SupplyModel) {
    return this.#repository.addNew(supply);
  }
  update(id: string, newValue: SupplyModel) {
    return this.#repository.updateById(new ObjectId(id), newValue);
  }

  delete(id: string) {
    return this.#repository.deleteById(new ObjectId(id));
  }

  deteleAllForVariant(variantId: string) {
    return this.#repository.deleteMany({ variantId: new ObjectId(variantId) });
  }
}

export default new SupplyService(supplyRepository);
