import { ObjectId } from "mongodb";

import supplyRepository from "@/features/supply/supply.repository.js";

import { VariantModel } from "../material.model.js";
import materialRepository, {
  VariantRepository,
} from "../material.repository/material.repository.js";

export class VariantService {
  #repository: VariantRepository;
  #supply: typeof supplyRepository;
  constructor(repository: VariantRepository, supply: typeof supplyRepository) {
    this.#repository = repository;
    this.#supply = supply;
  }

  async createVariant(id: string, variant: VariantModel) {
    return this.#repository.createVariant(id, variant);
  }
  async deleteVariant(id: string, variantId: string) {
    await this.#supply.deleteMany({ variantId: new ObjectId(variantId) });
    return this.#repository.deleteVariant(id, variantId);
  }

  async updateVariant(id: string, variantId: string, newVariant: VariantModel) {
    return this.#repository.updateVariant(id, variantId, newVariant);
  }
}

export default new VariantService(
  materialRepository.variantRepository,
  supplyRepository
);
