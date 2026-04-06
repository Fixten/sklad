import { createSingleton } from "@/utils/createSingeton.js";

import { MaterialVariantService } from "../materialVariant/materialVariant.service.js";

import { MaterialRepository } from "./material.repository.js";
import { MaterialModel } from "./material.schema.js";

export class MaterialService {
  static getSingleton = createSingleton(
    () =>
      new MaterialService(
        MaterialRepository.getSingleton(),
        MaterialVariantService.getSingleton(),
      ),
  );
  constructor(
    private repository: MaterialRepository,
    private variantService: MaterialVariantService,
  ) {}
  updateMaterial(id: number, updateItem: MaterialModel) {
    return this.repository.updateById(id, updateItem);
  }
  getAll() {
    return this.repository.getAll();
  }
  async create(material: MaterialModel) {
    return this.repository.createMaterial(material);
  }

  async deleteMaterial(id: number) {
    const deletedVariants =
      await this.variantService.deleteVariantForMaterial(id);
    if (deletedVariants.some((v) => v === "softDelete"))
      return this.repository.softDeleteMaterial(id);
    else {
      return this.repository.deleteMaterial(id);
    }
  }
}
