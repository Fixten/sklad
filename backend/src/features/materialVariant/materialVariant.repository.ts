import Repository from "@/db/repository.js";

import {
  MaterialVariantModel,
  materialVariantSchema,
} from "./materialVariant.schema.js";
import { eq } from "drizzle-orm";
import { createSingleton } from "@/utils/createSingeton.js";

export class MaterialVariantRepository {
  static getSingleton = createSingleton(() => new MaterialVariantRepository());
  private baseRepository;
  schema = materialVariantSchema;

  constructor() {
    this.baseRepository = new Repository(this.schema);
  }

  getById(id: number) {
    return this.baseRepository.getById(id);
  }

  getByMeterial(materialId: number) {
    return this.baseRepository.getByValue(eq(this.schema.material, materialId));
  }

  createVariant(variant: MaterialVariantModel) {
    return this.baseRepository.addNew(variant);
  }

  deleteVariant(id: number) {
    return this.baseRepository.deleteById(id);
  }

  softDelete(id: number) {
    return this.baseRepository.updateById(id, { deleted: true });
  }

  softDeleteByMaterial(materialId: number) {
    return this.baseRepository.updateByValue(
      eq(this.schema.material, materialId),
      { deleted: true },
    );
  }

  updateVariant(id: number, newVariant: MaterialVariantModel) {
    return this.baseRepository.updateById(id, newVariant);
  }
}
