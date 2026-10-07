import Api from "../../../api";

import type { MaterialTypeDTO, MaterialTypeModel } from "./MaterialType.model";

const path = "material-type";

export default class MaterialTypeApi {
  private api: Api<MaterialTypeModel>;
  constructor() {
    this.api = new Api(path);
  }

  get = (id: number) => {
    return this.api.get(id);
  };

  getAll = () => {
    return this.api.getAll();
  };

  create = (value: MaterialTypeDTO) => {
    return this.api.post<MaterialTypeModel>(value);
  };

  remove = (id: number) => {
    return this.api.remove(id);
  };
}
