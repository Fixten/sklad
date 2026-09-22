import { sql } from "drizzle-orm";
import { integer, text, uniqueIndex } from "drizzle-orm/sqlite-core";

import {
  getSchema,
  SchemaModel,
  SchemaType,
} from "@/db/schema/createSchema.js";
import { defaultDbFields } from "@/db/schema/defaultFields.js";

import { materialTypeSchema } from "../materialType/materialType.schema.js";

export const materialTable = "materials";

export const materialSchema = getSchema(
  materialTable,
  {
    ...defaultDbFields,
    name: text().notNull(),
    description: text(),
    material_type_id: integer("material_type_id")
      .references(() => materialTypeSchema.id, { onDelete: "restrict" })
      .notNull(),
  },
  (table) => [
    uniqueIndex("materials_type_name_unique")
      .on(table.material_type_id, table.name)
      .where(sql`${table.deleted_at} IS NULL`),
  ],
);

export type MaterialSchema = SchemaType<typeof materialSchema>;
export type MaterialModel = SchemaModel<MaterialSchema>;