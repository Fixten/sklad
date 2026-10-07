import { eq } from "drizzle-orm";

import singleton from "@/db/index.js";
import Repository from "@/db/repository.js";
import { createSingleton } from "@/utils/createSingleton.js";

import { materialTypeSchema } from "../materialType/materialType.schema.js";

import { MaterialModel, materialSchema } from "./material.schema.js";

import type { Db } from "@/db/index.js";

export interface TypeReference {
  id: number;
  deleted_at: Date | null;
}

export class MaterialRepository {
  static getSingleton = createSingleton(() => new MaterialRepository());
  private baseRepository;
  private schema = materialSchema;

  constructor(private db: Db<Record<string, unknown>> = singleton) {
    this.baseRepository = new Repository(this.schema, db);
  }

  getTypeReference(materialTypeId: number): TypeReference | undefined {
    return this.db.client
      .select({
        id: materialTypeSchema.id,
        deleted_at: materialTypeSchema.deleted_at,
      })
      .from(materialTypeSchema)
      .where(eq(materialTypeSchema.id, materialTypeId))
      .get();
  }

  getById(id: number) {
    return this.baseRepository.getById(id);
  }
  getAllActive() {
    return this.baseRepository.getAllActive();
  }
  getByType(materialTypeId: number) {
    return this.baseRepository.getByValue(
      eq(this.schema.material_type_id, materialTypeId),
    );
  }
  getActiveByType(materialTypeId: number) {
    return this.baseRepository.getActiveByValue(
      eq(this.schema.material_type_id, materialTypeId),
    );
  }
  create(material: MaterialModel) {
    return this.baseRepository.addNew(material);
  }
  update(id: number, newValue: Partial<MaterialModel>) {
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
