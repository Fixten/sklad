import { ObjectId } from "mongodb";

export interface NewMaterialType {
  name: string;
}

export interface MaterialTypeModel extends NewMaterialType {
  _id: ObjectId;
  created_at: string;
  updated_at: string;
}
