import { ObjectId, OptionalUnlessRequiredId, UpdateFilter } from "mongodb";

import Repository from "@/db/repository.js";

import { MaterialModel, VariantModel } from "../material.model.js";

const collectionName = "material";

export class VariantRepository {
  #baseRepository: Repository<VariantModel>;
  constructor(collectionName: string) {
    this.#baseRepository = new Repository(collectionName);
  }

  createVariant(id: ObjectId, variant: VariantModel) {
    return this.#baseRepository.updateByValue(
      { _id: id, "variants.variant": { $ne: variant.variant } },
      {
        $addToSet: {
          variants: { _id: new ObjectId(), ...variant },
        },
      }
    );
  }
  deleteVariant(id: ObjectId, variantId: ObjectId) {
    return this.#baseRepository.updateById(id, {
      $pull: {
        variants: { _id: { $eq: variantId } },
      },
    });
  }

  updateVariant(id: ObjectId, variantId: ObjectId, newVariant: VariantModel) {
    return this.#baseRepository.updateByValue(
      { _id: id, "variants._id": variantId },
      {
        $set: { "variants.$": newVariant },
      }
    );
  }
}

export class MaterialRepository {
  variantRepository: VariantRepository;
  #baseRepository: Repository<MaterialModel>;
  constructor(collectionName: string) {
    this.variantRepository = new VariantRepository(collectionName);
    this.#baseRepository = new Repository(collectionName);
  }

  getAll() {
    return this.#baseRepository.getAll();
  }
  updateById(id: ObjectId, updateItem: UpdateFilter<MaterialModel>) {
    return this.#baseRepository.updateById(id, updateItem);
  }
  async deleteMaterial(id: ObjectId) {
    return this.#baseRepository.deleteByValue({
      _id: id,
      variants: { $size: 0 },
    });
  }
  async createMaterial(material: OptionalUnlessRequiredId<MaterialModel>) {
    return this.#baseRepository.addNew(material);
  }
}

export default new MaterialRepository(collectionName);
