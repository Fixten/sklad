import { ObjectId } from "mongodb";
import mongoose from "mongoose";

const variantSchema = new mongoose.Schema({
  variant: String,
  photo_url: String,
});

export const materialSchema = new mongoose.Schema({
  name: String,
  description: String,
  materialType: ObjectId,
  variants: [variantSchema],
});
