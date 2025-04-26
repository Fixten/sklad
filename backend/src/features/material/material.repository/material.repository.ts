import {
  Collection,
  Filter,
  ObjectId,
  OptionalUnlessRequiredId,
  UpdateFilter,
  UpdateOptions,
  WithId,
} from "mongodb";

import dbManager from "db/dbManager.js";
import Repository from "db/repository.js";

import { MaterialModel, VariantModel } from "../material.model.js";

const collectionName = "material";

export class VariantRepository {
  #collection: Collection<MaterialModel>;
  #baseRepository: Repository<MaterialModel>;
  constructor(collectionName: string) {
    this.#collection = dbManager.db.collection<MaterialModel>(collectionName);
    this.#baseRepository = new Repository(collectionName);
  }
  async createVariant(id: ObjectId, variant: VariantModel) {
    const result = await this.#collection.updateOne(
      { _id: id, "variants.variant": { $ne: variant.variant } },
      {
        $addToSet: {
          variants: variant,
        },
      }
    );
    return !!result.modifiedCount;
  }
  async deleteVariant(id: ObjectId, variantName: VariantModel["variant"]) {
    const result = await this.#collection.updateOne(
      { _id: id } as WithId<MaterialModel>,
      {
        $pull: {
          variants: { variant: { $eq: variantName }, supplies: { $size: 0 } },
        },
      }
    );
    return !!result.modifiedCount;
  }
  async updateVariant(id: ObjectId, newVariant: Partial<VariantModel>) {
    const result = await this.#collection.updateOne(
      { _id: id, "variants.variant": newVariant.variant },
      {
        $set: { "variants.$": newVariant },
      }
    );
    return !!result.modifiedCount;
  }

  addSupply(
    materialId: ObjectId,
    variantName: VariantModel["variant"],
    supplyId: ObjectId
  ) {
    return this.#baseRepository.updateByValue(
      {
        _id: materialId,
        "variants.variant": variantName,
      },
      {
        $push: {
          "variants.$.supplies": supplyId,
        },
      }
    );
  }
  deleteSupply(
    materialId: ObjectId,
    variantName: VariantModel["variant"],
    supplyId: ObjectId
  ) {
    return this.#baseRepository.updateByValue(
      {
        _id: materialId,
        "variants.variant": variantName,
      },
      {
        $pull: {
          "variants.$.supplies": supplyId,
        },
      }
    );
  }
}

export class MaterialRepository {
  #collection: Collection<MaterialModel>;
  variantRepository: VariantRepository;
  constructor(collectionName: string) {
    this.#collection = dbManager.db.collection<MaterialModel>(collectionName);
    this.variantRepository = new VariantRepository(collectionName);
  }
  getAll() {
    return this.#collection.find().toArray();
  }
  updateById(
    id: ObjectId,
    updateItem: UpdateFilter<MaterialModel>,
    options?: UpdateOptions
  ) {
    return options
      ? this.#collection.updateOne(
          { _id: id } as WithId<MaterialModel>,
          updateItem,
          options
        )
      : this.#collection.updateOne(
          { _id: id } as WithId<MaterialModel>,
          updateItem
        );
  }
  async deleteMaterial(id: ObjectId) {
    const result = await this.#collection.deleteOne({
      _id: id,
      variants: { $size: 0 },
    });
    return !!result.deletedCount;
  }
  async createMaterial(
    value: Filter<MaterialModel>,
    material: OptionalUnlessRequiredId<MaterialModel>
  ) {
    const result = await this.#collection.updateOne(
      value,
      {
        $setOnInsert: material,
      },
      { upsert: true }
    );
    return !!result.modifiedCount;
  }
}

export default new MaterialRepository(collectionName);
