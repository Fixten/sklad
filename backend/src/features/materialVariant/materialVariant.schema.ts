import { sql } from "drizzle-orm";
import { integer, text, uniqueIndex } from "drizzle-orm/sqlite-core";

import {
  getSchema,
  SchemaModel,
  SchemaType,
} from "@/db/schema/createSchema.js";
import { defaultDbFields } from "@/db/schema/defaultFields.js";

import { materialSchema } from "../material/material.schema.js";

export const materialVariantTable = "material_variants";

export const MATERIAL_VARIANT_UNITS = ["pieces", "meters"] as const;
export type MaterialVariantUnit = (typeof MATERIAL_VARIANT_UNITS)[number];

export const materialVariantSchema = getSchema(
  materialVariantTable,
  {
    ...defaultDbFields,
    name: text().notNull(),
    unit: text().notNull(),
    material_id: integer("material_id")
      .references(() => materialSchema.id, { onDelete: "restrict" })
      .notNull(),
  },
  (table) => [
    uniqueIndex("material_variants_material_name_unique")
      .on(table.material_id, table.name)
      .where(sql`${table.deleted_at} IS NULL`),
  ],
);

export type MaterialVariantSchema = SchemaType<typeof materialVariantSchema>;
export type MaterialVariantModel = SchemaModel<MaterialVariantSchema>;