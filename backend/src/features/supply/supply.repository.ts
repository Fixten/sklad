import { ObjectId } from "mongodb";

import Repository from "@/db/repository.js";

import { SupplyModel, SupplyModelDTO } from "./supply.model.js";

const collectionName = "supply";

export class SupplyRepository {
  #baseRepository: Repository<SupplyModel>;

  constructor() {
    this.#baseRepository = new Repository(collectionName);
  }

  getById(id: string) {
    return this.#baseRepository.getById(new ObjectId(id));
  }
  getAll() {
    return this.#baseRepository.getAll();
  }

  addNew(supply: SupplyModelDTO) {
    return this.#baseRepository.addNew({
      ...supply,
      variantId: new ObjectId(supply.variantId),
    });
  }
  update(id: string, newValue: SupplyModelDTO) {
    return this.#baseRepository.updateById(new ObjectId(id), {
      $set: {
        ...newValue,
        variantId: new ObjectId(newValue.variantId),
      },
    });
  }

  delete(id: string) {
    return this.#baseRepository.deleteById(new ObjectId(id));
  }

  deteleAllForVariant(variantId: string) {
    return this.#baseRepository.deleteMany({
      variantId: new ObjectId(variantId),
    });
  }
}

export default new SupplyRepository();
