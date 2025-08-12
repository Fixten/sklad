import { ObjectId, WithId } from "mongodb";

export interface VariantModel {
  variant: string;
  photo_url: string;
}

export interface MaterialModel {
  name: string;
  description: string;
  materialType: ObjectId;
  variants: WithId<VariantModel>[];
}
