import { ObjectId } from "mongodb";

import { MaterialDTO, MaterialModel, VariantModel } from "./material.model.js";
import { objectIdStringMock } from "@/db/repository.mock.js";

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

export const materialDTOMock: MaterialDTO = {
  ...materialModelMock,
  materialType: objectIdStringMock,
};
