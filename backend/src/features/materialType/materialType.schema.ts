import mongoose from "mongoose";

import { MaterialTypeModel } from "./materialType.model.js";

export const materialTypeSchema = new mongoose.Schema<MaterialTypeModel>({
  name: Number,
});
