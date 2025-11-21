import Api from "@/api";

import { VariantDTO, VariantModel } from "../Material.model";

const path = "/material/variant";

export default class VariantApi {
  #api: Api<VariantModel>;
  constructor() {
    this.#api = new Api(path);
  }

  create = (value: VariantDTO) => {
    return this.#api.post<VariantModel>(value);
  };

  //   update = (value: MaterialDTO, id: string) => {
  //     return this.#api.post(value, id);
  //   };

  remove = (params: { materialId: string; variantId: string }) => {
    return this.#api.remove(params.materialId, params.variantId);
  };
}
