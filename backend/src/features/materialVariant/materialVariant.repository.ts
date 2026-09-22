import { eq } from "drizzle-orm";

import Repository from "@/db/repository.js";
import { createSingleton } from "@/utils/createSingleton.js";

import {
  MaterialVariantModel,
  materialVariantSchema,
} from "./materialVariant.schema.js";

export class MaterialVariantRepository {
  static getSingleton = createSingleton(() => new MaterialVariantRepository());
  private baseRepository;
  private schema = materialVariantSchema;

  constructor() {
    this.baseRepository = new Repository(this.schema);
  }

  getById(id: number) {
    return this.baseRepository.getById(id);
  }
  getAllActive() {
    return this.baseRepository.getAllActive();
  }
  getByMaterial(materialId: number) {
    return this.baseRepository.getByValue(
      eq(this.schema.material_id, materialId),
    );
  }
  create(variant: MaterialVariantModel) {
    return this.baseRepository.addNew(variant);
  }
  update(id: number, newValue: Partial<MaterialVariantModel>) {
    return this.baseRepository.updateById(id, newValue);
  }
  softDelete(id: number) {
    return this.baseRepository.softDelete(id);
  }
  hardDelete(id: number) {
    return this.baseRepository.deleteById(id);
  }
}