import mongoose from "mongoose";

import { SupplyModel } from "./supply.model.js";

export const supplySchema = new mongoose.Schema<SupplyModel>({
  description: String,
  supplier: String,
  supply_url: String,
  unit: String,
  price: Number,
  count: Number,
  variantId: mongoose.SchemaTypes.ObjectId,
});
