import { ObjectId } from "mongodb";

import { MaterialModel, VariantModel } from "./material.model.js";
import materialRepository from "./material.repository.js";

import type {
  MaterialRepository,
  VariantRepository,
} from "./material.repository.js";

export class VariantService {
  #repository: VariantRepository;
  constructor(repository: VariantRepository) {
    this.#repository = repository;
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
}

export class MaterialService {
  #repository: MaterialRepository;
  variant: VariantService;
  constructor(repository: MaterialRepository) {
    this.#repository = repository;
    this.variant = new VariantService(repository.variantRepository);
  }
  async create(material: MaterialModel) {
    const result = await this.#repository.createMaterial(
      {
        name: material.name,
        materialType: material.materialType,
      },
      material
    );
    if (!result) throw new Error("Did not create material");
  }
  async deleteMaterial(id: ObjectId) {
    const result = await this.#repository.deleteMaterial(id);
    if (!result) throw new Error("Material was not deleted");
  }
  updateMaterial(id: ObjectId, newMaterial: MaterialModel) {
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

export default new MaterialService(materialRepository);
