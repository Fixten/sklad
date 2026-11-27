import Api from "@/api";

import type {
  ProductTemplateDTO,
  ProductTemplateListQuery,
  ProductTemplatePatchDTO,
} from "./ProductTemplate.model";

export default class ProductTemplateApi {
  private api = new Api("/api/product-template");

  getAll = (params?: ProductTemplateListQuery) => {
    return this.api.getAll(params);
  };

  create = (value: ProductTemplateDTO) => {
    return this.api.post(value);
  };

  update = ({ dto, id }: { dto: ProductTemplatePatchDTO; id: number }) => {
    return this.api.patch(dto, id);
  };

  remove = (id: number) => {
    return this.api.remove(id);
  };

  restore = (id: number) => {
    return this.api.restore(id);
  };
}
