import Api from "../../api";

import { MaterialTypeModel } from "./materialType.model";

const path = "/material-type";

export default class MaterialTypeApi {
  #api: Api<MaterialTypeModel[]>;
  constructor() {
    this.#api = new Api(path);
  }

  getAll = () => {
    return this.#api.get();
  };

  create = (name: string) => {
    return this.#api.post({ name });
  };
}
