import { ObjectId } from "mongodb";

export interface NewMaterial {
  name: string;
  description: string;
  supplier: string;
  supply_url: string;
  photo_url: string;
  unit: string;
  price: number;
  count: number;
}

export interface MaterialModel extends NewMaterial {
  _id: ObjectId;
  created_at: string;
  updated_at: string;
}
