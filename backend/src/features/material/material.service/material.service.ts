import { MaterialModel } from "../material.model.js";
import materialRepository from "../material.repository/index.js";

import variantService, { VariantService } from "./variant.service.js";

import type { MaterialRepository } from "../material.repository/index.js";

export class MaterialService {
  #repository: MaterialRepository;
  variant: VariantService;
  constructor(repository: MaterialRepository, variant: VariantService) {
    this.#repository = repository;
    this.variant = variant;
  }
  create(material: MaterialModel) {
    return this.#repository.createMaterial(material);
  }
  deleteMaterial(id: string) {
    return this.#repository.deleteMaterial(id);
  }
  updateMaterial(id: string, newMaterial: MaterialModel) {
    return this.#repository.updateById(id, {
      name: newMaterial.name,
      description: newMaterial.description,
      materialType: newMaterial.materialType,
    });
  }
  getAll() {
    return this.#repository.getAll();
  }
}

export default new MaterialService(materialRepository, variantService);
