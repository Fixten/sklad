import {
  Collection,
  Filter,
  ObjectId,
  OptionalUnlessRequiredId,
  UpdateFilter,
  UpdateOptions,
  WithId,
} from "mongodb";

import dbManager from "@/db/dbManager.js";

import { MaterialModel, VariantModel } from "../material.model.js";

const collectionName = "material";

export class VariantRepository {
  #collection: Collection<MaterialModel>;
  constructor(collectionName: string) {
    this.#collection = dbManager.db.collection<MaterialModel>(collectionName);
  }
  async createVariant(id: ObjectId, variant: VariantModel) {
    const result = await this.#collection.updateOne(
      { _id: id, "variants.variant": { $ne: variant.variant } },
      {
        $addToSet: {
          variants: { _id: new ObjectId(), ...variant },
        },
      }
    );
    return result.modifiedCount > 0;
  }
  async deleteVariant(id: ObjectId, variantId: ObjectId) {
    const result = await this.#collection.updateOne(
      { _id: id } as WithId<MaterialModel>,
      {
        $pull: {
          variants: { _id: { $eq: variantId } },
        },
      }
    );
    return result.modifiedCount > 0;
  }
  async updateVariant(
    id: ObjectId,
    variantId: ObjectId,
    newVariant: VariantModel
  ) {
    const result = await this.#collection.updateOne(
      { _id: id, "variants._id": variantId },
      {
        $set: { "variants.$": newVariant },
      }
    );
    return result.modifiedCount > 0;
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
