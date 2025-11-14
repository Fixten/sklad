import Api from "../../api";
import MaterialTypeApi from "./MaterialType/MaterialType.api";
import type { MaterialDTO, MaterialModel } from "./Material.model";

const path = "/material";

export default class MaterialApi {
  #api: Api<MaterialModel>;
  #materialTypeApi: MaterialTypeApi;
  constructor() {
    this.#api = new Api(path);
    this.#materialTypeApi = new MaterialTypeApi();
  }

  getAll = async () => {
    const [material, materialType] = await Promise.all([
      this.#api.getAll(),
      this.#materialTypeApi.getAll(),
    ]);
    const map = materialType.reduce((acc, current) => {
      acc.set(current._id, current.name);
      return acc;
    }, new Map());

    return material.map((m) => ({
      ...m,
      materialType: map.get(m.materialType),
    }));
  };

  create = (value: MaterialDTO) => {
    return this.#api.post<MaterialModel>(value);
  };

  update = (value: MaterialDTO, id: string) => {
    return this.#api.post(value, id);
  };

  remove = (id: string) => {
    return this.#api.remove(id);
  };
}
