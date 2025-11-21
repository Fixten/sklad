import { ApiModel } from "../../api/api.model";

export interface VariantModel {
  variant: string;
  photo_url?: string;
}

export interface VariantDTO {
  materialId: string;
  variant: VariantModel;
}

export interface MaterialModelBase {
  name: string;
  description?: string;
  variants: (ApiModel & VariantModel)[];
}

export interface MaterialModel extends MaterialModelBase {
  materialType: string;
}

export type MaterialDTO = Omit<MaterialModel, "variants">;
