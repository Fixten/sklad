import { eq } from "drizzle-orm";

import { ErrorMessages } from "@/constants/Errors.js";
import { getTestDbWithMigrations } from "@/db/dbTestHelpers.js";

import { materialSchema } from "../material/material.schema.js";
import { materialTypeSchema } from "../materialType/materialType.schema.js";
import { materialUsageSchema } from "../materialUsage/materialUsage.schema.js";
import { materialVariantSchema } from "../materialVariant/materialVariant.schema.js";
import { productItemSchema } from "../product/productItem.schema.js";
import { productTemplateSchema } from "../product/productTemplate.schema.js";
import { supplierSchema } from "../supplier/supplier.schema.js";
import { supplyConsumptionSchema } from "../supplyConsumption/supplyConsumption.schema.js";

import { SupplyRepository } from "./supply.repository.js";
import { supplySchema } from "./supply.schema.js";

import type { TestDbWithMigrations } from "@/db/dbTestHelpers.js";

describe("SupplyRepository", () => {
  let db: TestDbWithMigrations;
  let repository: SupplyRepository;
  let variantId: number;

  beforeEach(() => {
    db = getTestDbWithMigrations();
    repository = new SupplyRepository(db);

    const [materialType] = db.client
      .insert(materialTypeSchema)
      .values({ name: "Wood" })
      .returning()
      .all();
    const [material] = db.client
      .insert(materialSchema)
      .values({ name: "Birch", material_type_id: materialType.id })
      .returning()
      .all();
    const [variant] = db.client
      .insert(materialVariantSchema)
      .values({ name: "2 m", material_id: material.id, unit: "meters" })
      .returning()
      .all();
    variantId = variant.id;
  });

  afterEach(() => {
    db.close();
  });

  function addSupply(quantity: number) {
    const [supply] = db.client
      .insert(supplySchema)
      .values({
        purchase_price: 12550,
        quantity,
        material_variant_id: variantId,
      })
      .returning()
      .all();
    return supply.id;
  }

  function addConsumption(supplyId: number, consumed: number) {
    const [template] = db.client
      .insert(productTemplateSchema)
      .values({ name: "Shelf" })
      .returning()
      .all();
    const [item] = db.client
      .insert(productItemSchema)
      .values({ product_template_id: template.id })
      .returning()
      .all();
    const [usage] = db.client
      .insert(materialUsageSchema)
      .values({
        product_item_id: item.id,
        material_variant_id: variantId,
        actual_quantity: 1,
      })
      .returning()
      .all();
    const [consumption] = db.client
      .insert(supplyConsumptionSchema)
      .values({
        material_usage_id: usage.id,
        supply_id: supplyId,
        consumed_quantity: consumed,
      })
      .returning()
      .all();
    return consumption.id;
  }

  test("getAllViews derives the variant unit and the consumed quantity", () => {
    const supplyId = addSupply(1250);
    addConsumption(supplyId, 250);

    const [view] = repository.getFilteredViews();

    expect(view.unit).toBe("meters");
    expect(view.consumed_quantity).toBe(250);
    expect(view.quantity).toBe(1250);
  });

  test("getAllViews ignores soft-deleted consumptions", () => {
    const supplyId = addSupply(1250);
    const consumptionId = addConsumption(supplyId, 250);
    db.client
      .update(supplyConsumptionSchema)
      .set({ deleted_at: new Date() })
      .where(eq(supplyConsumptionSchema.id, consumptionId))
      .run();

    const [view] = repository.getFilteredViews();

    expect(view.consumed_quantity).toBe(0);
  });

  test("getAllViews excludes soft-deleted supplies", () => {
    const supplyId = addSupply(1250);
    db.client
      .update(supplySchema)
      .set({ deleted_at: new Date() })
      .where(eq(supplySchema.id, supplyId))
      .run();

    expect(repository.getFilteredViews()).toEqual([]);
  });

  test("getAllViews filters by variant", () => {
    addSupply(1250);

    expect(
      repository.getFilteredViews({ material_variant_id: variantId }),
    ).toHaveLength(1);
    expect(
      repository.getFilteredViews({ material_variant_id: variantId + 1 }),
    ).toEqual([]);
  });

  test("getVariantReference returns the unit owned by the variant", () => {
    expect(repository.getVariantReference(variantId)).toEqual({
      id: variantId,
      unit: "meters",
      deleted_at: null,
    });
  });

  test("getSupplierReference exposes the deletion state of a supplier", () => {
    const [deleted] = db.client
      .insert(supplierSchema)
      .values({ name: "Lumber Co", deleted_at: new Date() })
      .returning()
      .all();
    const [active] = db.client
      .insert(supplierSchema)
      .values({ name: "Timber Co" })
      .returning()
      .all();

    expect(repository.getSupplierReference(active.id)).toEqual({
      id: active.id,
      deleted_at: null,
    });
    expect(repository.getSupplierReference(deleted.id)).toEqual({
      id: deleted.id,
      deleted_at: deleted.deleted_at,
    });
  });

  test("hasConsumptions counts a consumption even when it is soft-deleted", () => {
    const supplyId = addSupply(1250);
    const consumptionId = addConsumption(supplyId, 250);
    db.client
      .update(supplyConsumptionSchema)
      .set({ deleted_at: new Date() })
      .where(eq(supplyConsumptionSchema.id, consumptionId))
      .run();

    expect(repository.hasConsumptions(supplyId)).toBe(true);
    expect(repository.hasConsumptions(addSupply(500))).toBe(false);
  });

  test("hardDelete removes the row entirely", () => {
    const supplyId = addSupply(1250);

    repository.hardDelete(supplyId);

    expect(() => repository.requireViewById(supplyId)).toThrow(
      ErrorMessages.ITEM_NOT_FOUND,
    );
  });

  test("hardDelete throws when the row is missing", () => {
    expect(() => repository.hardDelete(9999)).toThrow(
      ErrorMessages.ITEM_TO_DELETE_NOT_FOUND,
    );
  });

  describe("updateAtomically", () => {
    test("writes what decide returns and re-reads the row", () => {
      const id = addSupply(1250);

      const result = repository.updateAtomically(id, () => ({
        quantity: 3000,
      }));

      expect(result.quantity).toBe(3000);
      expect(repository.requireViewById(id).quantity).toBe(3000);
    });

    test("decide sees the row as it stands", () => {
      const id = addSupply(1250);

      const result = repository.updateAtomically(id, (current) => ({
        quantity: current.quantity + 250,
      }));

      expect(result.quantity).toBe(1500);
    });

    test("rolls the patch back when decide throws", () => {
      const id = addSupply(1250);

      expect(() =>
        repository.updateAtomically(id, () => {
          throw new Error("rejected");
        }),
      ).toThrow("rejected");

      expect(repository.requireViewById(id).quantity).toBe(1250);
    });

    test("throws when the row is missing", () => {
      expect(() =>
        repository.updateAtomically(9999, () => ({ quantity: 100 })),
      ).toThrow(ErrorMessages.ITEM_NOT_FOUND);
    });
  });
});
