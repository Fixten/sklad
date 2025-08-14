import { ObjectId } from "mongodb";

import { objectIdStringMock } from "@/db/repository.mock.js";

import { SupplyModel, SupplyModelDTO } from "./supply.model.js";

export const supplyModelMock: SupplyModel = {
  variantId: new ObjectId(),
  description: "description",
  supplier: "supplier",
  supply_url: "supply_url",
  unit: "unit",
  price: 100,
  count: 10,
};

export const supplyDTOMock: SupplyModelDTO = {
  ...supplyModelMock,
  variantId: objectIdStringMock,
};
