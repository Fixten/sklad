import { integer } from "drizzle-orm/sqlite-core";

import {
  getSchema,
  SchemaModel,
  SchemaType,
} from "@/db/schema/createSchema.js";
import { defaultDbFields } from "@/db/schema/defaultFields.js";

import { materialUsageSchema } from "../materialUsage/materialUsage.schema.js";
import { supplySchema } from "../supply/supply.schema.js";

export const supplyConsumptionTable = "supply_consumptions";

export const supplyConsumptionSchema = getSchema(supplyConsumptionTable, {
  ...defaultDbFields,
  material_usage_id: integer("material_usage_id")
    .references(() => materialUsageSchema.id)
    .notNull(),
  supply_id: integer("supply_id")
    .references(() => supplySchema.id, { onDelete: "restrict" })
    .notNull(),
  consumed_quantity: integer().notNull(),
});

export type SupplyConsumptionSchema = SchemaType<
  typeof supplyConsumptionSchema
>;
export type SupplyConsumptionModel = SchemaModel<SupplyConsumptionSchema>;
