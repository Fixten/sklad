import Repository from "@/db/repository.js";
import { createSingleton } from "@/utils/createSingleton.js";

import { MaterialModel, materialSchema } from "./material.schema.js";

export class MaterialRepository {
  static getSingleton = createSingleton(() => new MaterialRepository());
  schema = materialSchema;
  baseRepository = new Repository(this.schema);

  getById(id: number) {
    return this.baseRepository.getById(id);
  }
  getAll() {
    return this.baseRepository.getAll();
  }
  updateById(id: number, updateItem: MaterialModel) {
    return this.baseRepository.updateById(id, updateItem);
  }
  deleteMaterial(id: number) {
    return this.baseRepository.deleteById(id);
  }
  softDeleteMaterial(id: number) {
    return this.baseRepository.updateById(id, { deleted: true });
  }
  createMaterial(value: MaterialModel) {
    return this.baseRepository.addNew(value);
  }
}
