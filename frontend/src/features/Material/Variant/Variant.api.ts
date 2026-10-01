import Api from "@/api";

import { VariantModel } from "./Variant.model";

const path = "material/variant";

export default class VariantApi {
  #api: Api<VariantModel>;
  constructor() {
    this.#api = new Api(path);
  }

  create = (value: VariantModel) => {
    return this.#api.post<VariantModel>(value);
  };

  update = (value: VariantModel, id: string) => {
    return this.#api.post(value, id);
  };

  remove = (variantId: number) => {
    return this.#api.remove(variantId);
  };
}
