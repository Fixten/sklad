import { createSingleton } from "@/utils/createSingleton.js";

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

  async delete(id: number) {
    const variants = await this.variantService.getByMaterial(id);
    if (variants.length > 0) return this.repository.softDelete(id);
    else return this.repository.hardDelete(id);
  }

  getAll() {
    return this.repository.getAllActive();
  }
  get(id: number) {
    return this.repository.getById(id);
  }
  getByType(materialTypeId: number) {
    return this.repository.getByType(materialTypeId);
  }
  create(material: MaterialModel) {
    return this.repository.create(material);
  }
  update(id: number, newValue: Partial<MaterialModel>) {
    return this.repository.update(id, newValue);
  }
}