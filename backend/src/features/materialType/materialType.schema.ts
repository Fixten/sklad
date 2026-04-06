import { text } from "drizzle-orm/sqlite-core";

import {
  getSchema,
  SchemaModel,
  SchemaType,
} from "@/db/schema/createSchema.js";
import { defaultDbFields } from "@/db/schema/defaultFields.js";

export const materialTypeTable = "material_type";

export const materialTypeSchema = getSchema(materialTypeTable, {
  ...defaultDbFields,
  name: text().notNull().unique(),
});

export type MaterialTypeSchema = SchemaType<typeof materialTypeSchema>;
export type MaterialTypeModel = SchemaModel<MaterialTypeSchema>;
