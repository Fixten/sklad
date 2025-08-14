import { ObjectId } from "mongodb";

import { MaterialModel, VariantModel } from "./material.model.js";

export const variantModelMock: VariantModel = {
  variant: "variant",
  photo_url: "url",
};

export const materialModelMock: MaterialModel = {
  name: "name",
  description: "string",
  materialType: new ObjectId(),
  variants: [],
};
