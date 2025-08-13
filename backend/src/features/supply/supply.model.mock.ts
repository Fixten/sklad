import { ObjectId } from "mongodb";

import { SupplyModel } from "./supply.model.js";

export const supplyModelMock: SupplyModel = {
  variantId: new ObjectId(),
  description: "description",
  supplier: "supplier",
  supply_url: "supply_url",
  unit: "unit",
  price: 100,
  count: 10,
};
