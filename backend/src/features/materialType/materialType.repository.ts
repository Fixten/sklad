import Repository from "@/db/repository.js";
import {
  MaterialTypeModel,
  materialTypeSchema,
} from "./materialType.schema.js";

class MaterialTypeRepository {
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

export default MaterialTypeRepository;
