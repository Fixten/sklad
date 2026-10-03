import { integer } from "drizzle-orm/sqlite-core";

import {
  getSchema,
  SchemaModel,
  SchemaType,
} from "@/db/schema/createSchema.js";
import { defaultDbFields } from "@/db/schema/defaultFields.js";

import { materialVariantSchema } from "../materialVariant/materialVariant.schema.js";
import { productItemSchema } from "../product/productItem.schema.js";

export const materialUsageTable = "material_usages";

export const materialUsageSchema = getSchema(materialUsageTable, {
  ...defaultDbFields,
  product_item_id: integer("product_item_id")
    .references(() => productItemSchema.id)
    .notNull(),
  material_variant_id: integer("material_variant_id")
    .references(() => materialVariantSchema.id)
    .notNull(),
  actual_quantity: integer().notNull(),
});

export type MaterialUsageSchema = SchemaType<typeof materialUsageSchema>;
export type MaterialUsageModel = SchemaModel<MaterialUsageSchema>;
