import { ObjectId } from "mongodb";

export interface MaterialModel {
  _id: ObjectId;
  name: string;
  description: string;
  supplier: string;
  supply_url: string;
  photo_url: string;
  unit: string;
  price: number;
  count: number;
  created_at: string;
  updated_at: string;
}
