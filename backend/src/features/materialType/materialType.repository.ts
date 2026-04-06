import Repository from "@/db/repository.js";

import {
  MaterialTypeModel,
  materialTypeSchema,
} from "./materialType.schema.js";
import { createSingleton } from "@/utils/createSingeton.js";

export default class MaterialTypeRepository {
  static getSingleton = createSingleton(() => new MaterialTypeRepository());
  private repository;
  constructor() {
    this.repository = new Repository(materialTypeSchema);
  }
  addNew(materialType: MaterialTypeModel) {
    return this.repository.addNew(materialType);
  }
  delete(id: number) {
    return this.repository.deleteById(id);
  }
  update(id: number, newValue: MaterialTypeModel) {
    return this.repository.updateById(id, newValue);
  }
  getAll() {
    return this.repository.getAll();
  }
  get(id: number) {
    return this.repository.getById(id);
  }
}
