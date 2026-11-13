import { sql } from "drizzle-orm";
import { text, uniqueIndex } from "drizzle-orm/sqlite-core";

import {
  getSchema,
  SchemaModel,
  SchemaType,
} from "@/db/schema/createSchema.js";
import { defaultDbFields } from "@/db/schema/defaultFields.js";

export const materialTypeTable = "material_types";

export const materialTypeSchema = getSchema(
  materialTypeTable,
  {
    ...defaultDbFields,
    name: text().notNull(),
    description: text(),
  },
  (table) => [
    // shortcut: index trim()/NOCASE cover only spaces and ASCII A-Z; the service trim/toLowerCase is the real gate
    uniqueIndex("material_types_name_unique").on(
      sql`trim(${table.name}) COLLATE NOCASE`,
    ),
  ],
);

export type MaterialTypeSchema = SchemaType<typeof materialTypeSchema>;
export type MaterialTypeModel = SchemaModel<MaterialTypeSchema>;
