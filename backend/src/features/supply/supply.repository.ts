import { and, eq, isNull, SQL, sql } from "drizzle-orm";

import { ErrorMessages } from "@/constants/Errors.js";
import singleton from "@/db/index.js";
import Repository from "@/db/repository.js";
import { createSingleton } from "@/utils/createSingleton.js";

import { materialVariantSchema } from "../materialVariant/materialVariant.schema.js";
import { supplierSchema } from "../supplier/supplier.schema.js";
import { supplyConsumptionSchema } from "../supplyConsumption/supplyConsumption.schema.js";

import { SupplyModel, SupplySchema, supplySchema } from "./supply.schema.js";

import type { Db } from "@/db/index.js";
import type { MaterialUnit } from "@/features/materialVariant/utils/quantity.js";

export interface SupplyFilter {
  material_variant_id?: number;
  supplier_id?: number;
}

export interface SupplyView extends SupplySchema {
  unit: MaterialUnit;
  consumed_quantity: number;
}

export interface VariantReference {
  id: number;
  unit: MaterialUnit;
  deleted_at: Date | null;
}

export interface SupplierReference {
  id: number;
  deleted_at: Date | null;
}

export class SupplyRepository {
  static getSingleton = createSingleton(() => new SupplyRepository());
  private baseRepository;
  private schema = supplySchema;

  constructor(private db: Db<Record<string, unknown>> = singleton) {
    this.baseRepository = new Repository(this.schema, db);
  }

  private selectView() {
    return this.db.client
      .select({
        id: this.schema.id,
        description: this.schema.description,
        purchase_price: this.schema.purchase_price,
        quantity: this.schema.quantity,
        url: this.schema.url,
        material_variant_id: this.schema.material_variant_id,
        supplier_id: this.schema.supplier_id,
        created_at: this.schema.created_at,
        updated_at: this.schema.updated_at,
        deleted_at: this.schema.deleted_at,
        unit: materialVariantSchema.unit,
        consumed_quantity: sql<number>`coalesce(sum(${supplyConsumptionSchema.consumed_quantity}), 0)`,
      })
      .from(this.schema)
      .innerJoin(
        materialVariantSchema,
        eq(this.schema.material_variant_id, materialVariantSchema.id),
      )
      .leftJoin(
        supplyConsumptionSchema,
        and(
          eq(supplyConsumptionSchema.supply_id, this.schema.id),
          isNull(supplyConsumptionSchema.deleted_at),
        ),
      )
      .groupBy(this.schema.id);
  }

  getViewById(id: number): SupplyView | undefined {
    return this.selectView().where(eq(this.schema.id, id)).get();
  }

  requireViewById(id: number): SupplyView {
    const view = this.getViewById(id);
    if (!view) throw new Error(ErrorMessages.ITEM_NOT_FOUND);
    return view;
  }

  getFilteredViews(filter: SupplyFilter = {}): SupplyView[] {
    const conditions: SQL[] = [isNull(this.schema.deleted_at)];
    if (filter.material_variant_id !== undefined)
      conditions.push(
        eq(this.schema.material_variant_id, filter.material_variant_id),
      );
    if (filter.supplier_id !== undefined)
      conditions.push(eq(this.schema.supplier_id, filter.supplier_id));
    return this.selectView()
      .where(and(...conditions))
      .all();
  }

  getVariantReference(materialVariantId: number): VariantReference | undefined {
    return this.db.client
      .select({
        id: materialVariantSchema.id,
        unit: materialVariantSchema.unit,
        deleted_at: materialVariantSchema.deleted_at,
      })
      .from(materialVariantSchema)
      .where(eq(materialVariantSchema.id, materialVariantId))
      .get();
  }

  getSupplierReference(supplierId: number): SupplierReference | undefined {
    return this.db.client
      .select({
        id: supplierSchema.id,
        deleted_at: supplierSchema.deleted_at,
      })
      .from(supplierSchema)
      .where(eq(supplierSchema.id, supplierId))
      .get();
  }

  hasConsumptions(supplyId: number): boolean {
    return (
      this.db.client
        .select({ id: supplyConsumptionSchema.id })
        .from(supplyConsumptionSchema)
        .where(eq(supplyConsumptionSchema.supply_id, supplyId))
        .get() !== undefined
    );
  }

  getAllByVariant(variantId: number) {
    return this.baseRepository.getByValue(
      eq(this.schema.material_variant_id, variantId),
    );
  }

  getAllBySupplier(supplierId: number) {
    return this.baseRepository.getByValue(
      eq(this.schema.supplier_id, supplierId),
    );
  }

  create(supply: SupplyModel) {
    return this.baseRepository.addNew(supply);
  }

  private update(id: number, newValue: Partial<SupplyModel>) {
    return this.baseRepository.updateById(id, newValue);
  }

  updateAtomically(
    id: number,
    decide: (current: SupplyView) => Partial<SupplyModel>,
  ): SupplyView {
    return this.baseRepository.transaction(() => {
      const current = this.requireViewById(id);
      this.update(id, decide(current));
      return this.requireViewById(id);
    });
  }

  softDelete(id: number) {
    return this.baseRepository.softDelete(id);
  }

  hardDelete(id: number) {
    return this.baseRepository.deleteById(id);
  }

  restore(id: number) {
    return this.baseRepository.restore(id);
  }
}
