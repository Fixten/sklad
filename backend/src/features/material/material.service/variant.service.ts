import { SupplyService } from "@/features/supply/supply.service.js";

import { VariantModel } from "../material.model.js";
import { VariantRepository } from "../material.repository/material.repository.js";

export class VariantService {
  #repository: VariantRepository;
  #supplyService: SupplyService;
  constructor(repository: VariantRepository, supplyService: SupplyService) {
    this.#repository = repository;
    this.#supplyService = supplyService;
  }

  async createVariant(id: string, variant: VariantModel) {
    return this.#repository.createVariant(id, variant);
  }
  async deleteVariant(id: string, variantId: string) {
    await this.#supplyService.deteleAllForVariant(variantId);
    return this.#repository.deleteVariant(id, variantId);
  }

  async updateVariant(id: string, variantId: string, newVariant: VariantModel) {
    return this.#repository.updateVariant(id, variantId, newVariant);
  }
}
