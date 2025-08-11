import { ObjectId } from "mongodb";

import { SupplyModel } from "../../supply/supply.model.js";
import { SupplyService } from "../../supply/supply.service.js";
import { VariantModel } from "../material.model.js";
import { VariantRepository } from "../material.repository/material.repository.js";

export class VariantService {
  #repository: VariantRepository;
  #supplyService: SupplyService;
  constructor(repository: VariantRepository, supply: SupplyService) {
    this.#repository = repository;
    this.#supplyService = supply;
  }

  async createVariant(id: ObjectId, variant: VariantModel) {
    const result = await this.#repository.createVariant(id, variant);
    if (!result) throw new Error("Variant was not created");
  }
  async deleteVariant(id: ObjectId, variantName: string) {
    const result = await this.#repository.deleteVariant(id, variantName);
    if (!result) throw new Error("Did not delete variant");
  }

  async updateVariant(id: ObjectId, newVariant: VariantModel) {
    const result = await this.#repository.updateVariant(id, {
      variant: newVariant.variant,
      photo_url: newVariant.photo_url,
    });
    if (!result) throw new Error("Did not update variant");
  }
  async addSupply(
    materialId: ObjectId,
    variant: VariantModel["variant"],
    supply: SupplyModel
  ) {
    const addedSupply = await this.#supplyService.addNew(supply);
    const material = await this.#repository.addSupply(
      materialId,
      variant,
      addedSupply._id
    );
    return { material, supply: addedSupply };
  }
  async deleteSupply(
    materialId: ObjectId,
    variant: VariantModel["variant"],
    supplyId: ObjectId
  ) {
    await this.#supplyService.delete(supplyId);
    return this.#repository.deleteSupply(materialId, variant, supplyId);
  }
}
