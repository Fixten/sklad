import { integer, text } from "drizzle-orm/sqlite-core";

import {
  getSchema,
  SchemaModel,
  SchemaType,
} from "@/db/schema/createSchema.js";
import { defaultDbFields } from "@/db/schema/defaultFields.js";

import { materialSchema } from "../material/material.schema.js";

export const materialVariantTable = "material_variant";

export const materialVariantSchema = getSchema(materialVariantTable, {
  ...defaultDbFields,
  variant: text().notNull(),
  photo_url: text(),
  material: integer("material_id")
    .references(() => materialSchema.id)
    .notNull(),
  deleted: integer({ mode: "boolean" }),
});

export type MaterialVariantSchema = SchemaType<typeof materialVariantSchema>;
export type MaterialVariantModel = SchemaModel<MaterialVariantSchema>;
