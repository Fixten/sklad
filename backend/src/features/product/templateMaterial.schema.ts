import { sql } from "drizzle-orm";
import { check, integer, uniqueIndex } from "drizzle-orm/sqlite-core";

import {
  getSchema,
  SchemaModel,
  SchemaType,
} from "@/db/schema/createSchema.js";
import { defaultDbFields } from "@/db/schema/defaultFields.js";

import { materialVariantSchema } from "../materialVariant/materialVariant.schema.js";

import { productTemplateSchema } from "./productTemplate.schema.js";

export const templateMaterialTable = "template_materials";

export const templateMaterialSchema = getSchema(
  templateMaterialTable,
  {
    ...defaultDbFields,
    product_template_id: integer("product_template_id")
      .references(() => productTemplateSchema.id, { onDelete: "cascade" })
      .notNull(),
    material_variant_id: integer("material_variant_id")
      .references(() => materialVariantSchema.id, { onDelete: "restrict" })
      .notNull(),
    default_quantity: integer("default_quantity").notNull(),
  },
  (table) => [
    uniqueIndex("template_materials_template_variant_unique").on(
      table.product_template_id,
      table.material_variant_id,
    ),
    check(
      "template_materials_default_quantity_positive",
      sql`${table.default_quantity} > 0`,
    ),
  ],
);

export type TemplateMaterialSchema = SchemaType<typeof templateMaterialSchema>;
export type TemplateMaterialModel = SchemaModel<TemplateMaterialSchema>;
