import { ObjectId } from "mongodb";

import materialRepository, {
  VariantRepository,
} from "../material/material.repository/material.repository.js";

import { SupplyModelDTO } from "./supply.model.js";
import supplyRepository from "./supply.repository.js";

export class SupplyService {
  #repository: typeof supplyRepository;
  #variant: VariantRepository;
  constructor(repository: typeof supplyRepository, variant: VariantRepository) {
    this.#repository = repository;
    this.#variant = variant;
  }
  getById(id: string) {
    return this.#repository.getById(new ObjectId(id));
  }
  getAll() {
    return this.#repository.getAll();
  }

  async addNew(supply: SupplyModelDTO) {
    await this.#variant.getById(supply.variantId);
    return this.#repository.addNew({
      ...supply,
      variantId: new ObjectId(supply.variantId),
    });
  }
  async update(id: string, newValue: SupplyModelDTO) {
    await this.#variant.getById(newValue.variantId);
    return this.#repository.updateById(new ObjectId(id), {
      ...newValue,
      variantId: new ObjectId(newValue.variantId),
    });
  }

  delete(id: string) {
    return this.#repository.deleteById(new ObjectId(id));
  }

  deteleAllForVariant(variantId: string) {
    return this.#repository.deleteMany({ variantId: new ObjectId(variantId) });
  }
}

export default new SupplyService(
  supplyRepository,
  materialRepository.variantRepository
);
