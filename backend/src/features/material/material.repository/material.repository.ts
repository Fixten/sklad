import { ObjectId, OptionalUnlessRequiredId, UpdateFilter } from "mongodb";

import Repository from "@/db/repository.js";

import { MaterialModel, VariantModel } from "../material.model.js";

const collectionName = "material";

export class VariantRepository {
  #baseRepository: Repository<VariantModel>;
  constructor(collectionName: string) {
    this.#baseRepository = new Repository(collectionName);
  }

  getById(id: string) {
    return this.#baseRepository.getByValue({ "variants._id": { $eq: id } });
  }

  createVariant(id: string, variant: VariantModel) {
    return this.#baseRepository.updateByValue(
      { _id: new ObjectId(id), "variants.variant": { $ne: variant.variant } },
      {
        $addToSet: {
          variants: { _id: new ObjectId(), ...variant },
        },
      }
    );
  }
  deleteVariant(id: string, variantId: string) {
    return this.#baseRepository.updateById(new ObjectId(id), {
      $pull: {
        variants: { _id: { $eq: variantId } },
      },
    });
  }

  updateVariant(id: string, variantId: string, newVariant: VariantModel) {
    return this.#baseRepository.updateByValue(
      { _id: new ObjectId(id), "variants._id": variantId },
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

  getById(id: string) {
    return this.#baseRepository.getById(new ObjectId(id));
  }

  getAll() {
    return this.#baseRepository.getAll();
  }
  updateById(id: string, updateItem: UpdateFilter<MaterialModel>) {
    return this.#baseRepository.updateById(new ObjectId(id), {
      $set: updateItem,
    });
  }
  async deleteMaterial(id: string) {
    return this.#baseRepository.deleteById(new ObjectId(id));
  }
  async createMaterial(
    material: OptionalUnlessRequiredId<Omit<MaterialModel, "variants">>
  ) {
    return this.#baseRepository.addNew({ ...material, variants: [] });
  }
}

export default new MaterialRepository(collectionName);
