import { ObjectId } from "mongodb";

export interface VariantModel {
  variant: string;
  photo_url: string;
  supplies: ObjectId[];
}

export interface MaterialModel {
  name: string;
  description: string;
  materialType: ObjectId;
  variants: VariantModel[];
}
