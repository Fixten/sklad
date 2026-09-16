import Api from "@/api";
import { Variant } from "./Variant.model";

const path = "material/variant";

export default class VariantApi {
  #api: Api<Variant>;
  constructor() {
    this.#api = new Api(path);
  }

  create = (value: Variant) => {
    return this.#api.post<Variant>(value);
  };

  update = (value: Variant, id: string) => {
    return this.#api.post(value, id);
  };

  remove = (variantId: number) => {
    return this.#api.remove(variantId);
  };
}
