import { MaterialTypeModel } from "./materialType.model.js";
import MaterialTypeRepository from "./materialType.repository.js";

export class MaterialTypeService {
  #repository: MaterialTypeRepository;
  constructor(repository: MaterialTypeRepository) {
    this.#repository = repository;
  }
  addNew(materialType: MaterialTypeModel) {
    return this.#repository.addNew(materialType);
  }
  delete(id: string) {
    return this.#repository.delete(id);
  }
  update(id: string, newValue: MaterialTypeModel) {
    return this.#repository.update(id, newValue);
  }
  getAll() {
    return this.#repository.getAll();
  }
}

export default new MaterialTypeService(new MaterialTypeRepository());
