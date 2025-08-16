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
    return this.#repository.getById(id);
  }
  getAll() {
    return this.#repository.getAll();
  }

  async addNew(supply: SupplyModelDTO) {
    await this.#variant.getById(supply.variantId);
    return this.#repository.addNew(supply);
  }
  async update(id: string, newValue: SupplyModelDTO) {
    await this.#variant.getById(newValue.variantId);
    return this.#repository.update(id, newValue);
  }

  delete(id: string) {
    return this.#repository.delete(id);
  }

  deteleAllForVariant(variantId: string) {
    return this.#repository.deteleAllForVariant(variantId);
  }
}

export default new SupplyService(
  supplyRepository,
  materialRepository.variantRepository
);
