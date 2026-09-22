import Repository from "@/db/repository.js";
import { createSingleton } from "@/utils/createSingleton.js";

import {
  MaterialTypeModel,
  materialTypeSchema,
} from "./materialType.schema.js";

export default class MaterialTypeRepository {
  static getSingleton = createSingleton(() => new MaterialTypeRepository());
  private repository;
  constructor() {
    this.repository = new Repository(materialTypeSchema);
  }
  create(materialType: MaterialTypeModel) {
    return this.repository.addNew(materialType);
  }
  softDelete(id: number) {
    return this.repository.softDelete(id);
  }
  hardDelete(id: number) {
    return this.repository.deleteById(id);
  }
  update(id: number, newValue: Partial<MaterialTypeModel>) {
    return this.repository.updateById(id, newValue);
  }
  getAllActive() {
    return this.repository.getAllActive();
  }
  getById(id: number) {
    return this.repository.getById(id);
  }
}