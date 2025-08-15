import { ObjectId } from "mongodb";

import { MaterialDTO } from "../material.model.js";
import materialRepository from "../material.repository/index.js";

import variantService, { VariantService } from "./variant.service.js";

import type { MaterialRepository } from "../material.repository/index.js";
import materialTypeRepository from "@/features/materialType/materialType.repository.js";

export class MaterialService {
  #repository: MaterialRepository;
  #materialType: typeof materialTypeRepository;
  variant: VariantService;
  constructor(
    repository: MaterialRepository,
    variant: VariantService,
    materialType: typeof materialTypeRepository
  ) {
    this.#repository = repository;
    this.#materialType = materialType;
    this.variant = variant;
  }
  async create(material: Omit<MaterialDTO, "variants">) {
    const materialType = await this.#materialType.getById(
      new ObjectId(material.materialType)
    );
    return this.#repository.createMaterial({
      ...material,
      materialType: materialType._id,
    });
  }

  async deleteMaterial(id: string) {
    const material = await this.#repository.getById(id);
    const deletedVariants = material?.variants.map((variant) =>
      this.variant.deleteVariant(id, variant._id.toString())
    );
    if (deletedVariants) await Promise.all(deletedVariants);
    return this.#repository.deleteMaterial(id);
  }

  async updateMaterial(id: string, newMaterial: MaterialDTO) {
    const materialType = await this.#materialType.getById(
      new ObjectId(newMaterial.materialType)
    );
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
  materialTypeRepository
);
