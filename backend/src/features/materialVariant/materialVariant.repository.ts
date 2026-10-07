import { eq } from "drizzle-orm";

import singleton from "@/db/index.js";
import Repository from "@/db/repository.js";
import { createSingleton } from "@/utils/createSingleton.js";

import { materialSchema } from "../material/material.schema.js";

import {
  MaterialVariantModel,
  materialVariantSchema,
} from "./materialVariant.schema.js";

import type { Db } from "@/db/index.js";

export interface MaterialReference {
  id: number;
  deleted_at: Date | null;
}

export class MaterialVariantRepository {
  static getSingleton = createSingleton(() => new MaterialVariantRepository());
  private baseRepository;
  private schema = materialVariantSchema;

  constructor(private db: Db<Record<string, unknown>> = singleton) {
    this.baseRepository = new Repository(this.schema, db);
  }

  getMaterialReference(materialId: number): MaterialReference | undefined {
    return this.db.client
      .select({
        id: materialSchema.id,
        deleted_at: materialSchema.deleted_at,
      })
      .from(materialSchema)
      .where(eq(materialSchema.id, materialId))
      .get();
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
  getActiveByMaterial(materialId: number) {
    return this.baseRepository.getActiveByValue(
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
  restore(id: number) {
    return this.baseRepository.restore(id);
  }
}
