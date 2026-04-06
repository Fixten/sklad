import { MaterialVariantRepository } from "./materialVariant.repository.js";
import { MaterialVariantModel } from "./materialVariant.schema.js";
import { createSingleton } from "@/utils/createSingeton.js";
import SupplyService from "../supply/supply.service.js";

export class MaterialVariantService {
  static getSingleton = createSingleton(
    () =>
      new MaterialVariantService(
        SupplyService.getSingleton(),
        MaterialVariantRepository.getSingleton(),
      ),
  );
  updateVariant;
  constructor(
    private supply: SupplyService,
    private repository: MaterialVariantRepository,
  ) {
    this.updateVariant = this.repository.updateVariant;
  }

  async createVariant(variant: MaterialVariantModel) {
    return this.repository.createVariant(variant);
  }
  async deleteVariant(variantId: number) {
    const supplies = await this.supply.getForVariant(variantId);
    if (supplies.length > 0) {
      await this.repository.softDelete(variantId);
      return "softDelete";
    } else {
      await this.repository.deleteVariant(variantId);
      return "hardDelete";
    }
  }

  async deleteVariantForMaterial(materialId: number) {
    const variants = await this.repository.getByMeterial(materialId);
    return Promise.all(variants.map((v) => this.deleteVariant(v.id)));
  }
}
