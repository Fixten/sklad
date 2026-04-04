import {
  getSchema,
  SchemaModel,
  SchemaType,
} from "@/db/schema/createSchema.js";
import { defaultDbFields } from "@/db/schema/defaultFields.js";
import { text } from "drizzle-orm/sqlite-core";

export const materialTypeTable = "material_type";

export const materialTypeSchema = getSchema(materialTypeTable, {
  ...defaultDbFields,
  name: text().notNull(),
});

export type MaterialTypeSchema = SchemaType<typeof materialTypeSchema>;
export type MaterialTypeModel = SchemaModel<MaterialTypeSchema>;
