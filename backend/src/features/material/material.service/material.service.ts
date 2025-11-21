import MaterialTypeRepository from "@/features/materialType/materialType.repository.js";

import { MaterialDTO } from "../material.model.js";
import materialRepository from "../material.repository/material.repository.js";

import variantService, { VariantService } from "./variant.service.js";

import type { MaterialRepository } from "../material.repository/material.repository.js";

export class MaterialService {
  #repository: MaterialRepository;
  #materialType: MaterialTypeRepository;
  variant: VariantService;
  constructor(
    repository: MaterialRepository,
    variant: VariantService,
    materialType: MaterialTypeRepository
  ) {
    this.#repository = repository;
    this.#materialType = materialType;
    this.variant = variant;
  }
  async create(material: Omit<MaterialDTO, "variants">) {
    if (material.name) {
      const materialType = await this.#materialType.get(material.materialType);
      return this.#repository.createMaterial({
        ...material,
        materialType: materialType._id,
      });
    } else return Promise.reject(new Error("name is required"));
  }

  async deleteMaterial(id: string) {
    const material = await this.#repository.getById(id);
    const deletedVariants = material.variants.map((variant) =>
      this.variant.deleteVariant(id, variant._id.toString())
    );
    if (deletedVariants.length > 0) await Promise.all(deletedVariants);
    return this.#repository.deleteMaterial(id);
  }

  async updateMaterial(id: string, newMaterial: MaterialDTO) {
    const materialType = await this.#materialType.get(newMaterial.materialType);
    return this.#repository.updateById(id, {
      name: newMaterial.name,
      description: newMaterial.description,
      materialType: materialType._id,
    });
  }
  getAll() {
    return this.#repository.getAll();
  }
}

export default new MaterialService(
  materialRepository,
  variantService,
  new MaterialTypeRepository()
);
