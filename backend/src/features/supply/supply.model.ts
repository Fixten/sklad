import { ObjectId } from "mongodb";

interface SupplyModelBase {
  description: string;
  supplier: string;
  supply_url: string;
  unit: string;
  price: number;
  count: number;
}

export interface SupplyModel extends SupplyModelBase {
  variantId: ObjectId;
}

export interface SupplyModelDTO extends SupplyModelBase {
  variantId: string;
}
