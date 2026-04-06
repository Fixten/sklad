import { integer, text } from "drizzle-orm/sqlite-core";

import {
  getSchema,
  SchemaModel,
  SchemaType,
} from "@/db/schema/createSchema.js";
import { defaultDbFields } from "@/db/schema/defaultFields.js";

import { materialTypeSchema } from "../materialType/materialType.schema.js";

export const materialTable = "material";

export const materialSchema = getSchema(materialTable, {
  ...defaultDbFields,
  name: text().notNull().unique(),
  description: text(),
  materialType: integer("material_type_id").references(
    () => materialTypeSchema.id,
  ),
  deleted: integer({ mode: "boolean" }).default(false),
});

export type MaterialSchema = SchemaType<typeof materialSchema>;
export type MaterialModel = SchemaModel<MaterialSchema>;
