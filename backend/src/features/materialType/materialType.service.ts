import MaterialTypeRepository from "./materialType.repository.js";
import { MaterialTypeModel } from "./materialType.schema.js";

export class MaterialTypeService {
  #repository: MaterialTypeRepository;
  constructor(repository: MaterialTypeRepository) {
    this.#repository = repository;
  }
  addNew(materialType: MaterialTypeModel) {
    return this.#repository.addNew(materialType);
  }
  delete(id: number) {
    return this.#repository.delete(id);
  }
  update(id: number, newValue: MaterialTypeModel) {
    return this.#repository.update(id, newValue);
  }
  getAll() {
    return this.#repository.getAll();
  }
  get(id: number) {
    return this.#repository.get(id);
  }
}

export default new MaterialTypeService(new MaterialTypeRepository());
