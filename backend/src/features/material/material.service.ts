import materialRepository from "./material.repository.js";

import type { MaterialRepositoryType } from "./material.repository.js";

export class MaterialService {
  #repository: MaterialRepositoryType;
  constructor(repository: MaterialRepositoryType) {
    this.#repository = repository;
  }
}

export default new MaterialService(materialRepository);
