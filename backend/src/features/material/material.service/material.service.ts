import { ObjectId } from "mongodb";

import supplyService from "../../supply/supply.service.js";
import { MaterialModel } from "../material.model.js";
import materialRepository from "../material.repository/index.js";

import { VariantService } from "./variant.service.js";

import type { MaterialRepository } from "../material.repository/index.js";

export class MaterialService {
  #repository: MaterialRepository;
  variant: VariantService;
  constructor(repository: MaterialRepository) {
    this.#repository = repository;
    this.variant = new VariantService(
      repository.variantRepository,
      supplyService
    );
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
