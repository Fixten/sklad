import { eq } from "drizzle-orm";

import Repository from "@/db/repository.js";
import { createSingleton } from "@/utils/createSingleton.js";

import { MaterialModel, materialSchema } from "./material.schema.js";

export class MaterialRepository {
  static getSingleton = createSingleton(() => new MaterialRepository());
  private baseRepository;
  private schema = materialSchema;

  constructor() {
    this.baseRepository = new Repository(this.schema);
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
}