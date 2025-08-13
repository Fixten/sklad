import { ObjectId } from "mongodb";

export interface SupplyModel {
  variantId: ObjectId;
  description: string;
  supplier: string;
  supply_url: string;
  unit: string;
  price: number;
  count: number;
}
