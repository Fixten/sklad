import { ObjectId, WithId } from "mongodb";

export interface VariantModel {
  variant: string;
  photo_url?: string;
}

export interface MaterialModelBase {
  name: string;
  description: string;
  variants: WithId<VariantModel>[];
}

export interface MaterialModel extends MaterialModelBase {
  materialType: ObjectId;
}

export interface MaterialDTO extends MaterialModelBase {
  materialType: string;
}
