import Api from "@/api";

import type { VariantDTO, VariantModel } from "./Variant.model";

export default class VariantApi {
  private api = new Api("/api/material-variant");

  create = (value: VariantDTO) => {
    return this.api.post(value);
  };

  update = (value: VariantModel, id: number) => {
    return this.api.patch(value, id);
  };

  remove = (variantId: number) => {
    return this.api.remove(variantId);
  };
}
