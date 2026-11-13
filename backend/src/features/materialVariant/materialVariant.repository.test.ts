import { getTestDbWithMigrations } from "@/db/dbTestHelpers.js";

import { materialSchema } from "../material/material.schema.js";
import { materialTypeSchema } from "../materialType/materialType.schema.js";
import { materialUsageSchema } from "../materialUsage/materialUsage.schema.js";
import { productItemSchema } from "../product/productItem.schema.js";
import { productTemplateSchema } from "../product/productTemplate.schema.js";

import { MaterialVariantRepository } from "./materialVariant.repository.js";
import { materialVariantSchema } from "./materialVariant.schema.js";

import type { TestDbWithMigrations } from "@/db/dbTestHelpers.js";

describe("MaterialVariantRepository.hasUsage", () => {
  let db: TestDbWithMigrations;
  let repository: MaterialVariantRepository;
  let variantId: number;
  let otherVariantId: number;
  let templateSeq = 0;

  beforeEach(() => {
    db = getTestDbWithMigrations();
    repository = new MaterialVariantRepository(db);
    templateSeq = 0;

    const [materialType] = db.client
      .insert(materialTypeSchema)
      .values({ name: "Wood" })
      .returning()
      .all();
    const [material] = db.client
      .insert(materialSchema)
      .values({ name: "Birch", material_type_id: materialType!.id })
      .returning()
      .all();
    const [variant] = db.client
      .insert(materialVariantSchema)
      .values({ name: "2 m", material_id: material!.id, unit: "meters" })
      .returning()
      .all();
    const [other] = db.client
      .insert(materialVariantSchema)
      .values({ name: "3 m", material_id: material!.id, unit: "meters" })
      .returning()
      .all();
    variantId = variant!.id;
    otherVariantId = other!.id;
  });

  afterEach(() => {
    db.close();
  });

  function addUsage(forVariantId: number) {
    templateSeq += 1;
    const [template] = db.client
      .insert(productTemplateSchema)
      .values({ name: `Shelf ${String(templateSeq)}` })
      .returning()
      .all();
    const [item] = db.client
      .insert(productItemSchema)
      .values({ product_template_id: template!.id })
      .returning()
      .all();
    db.client
      .insert(materialUsageSchema)
      .values({
        product_item_id: item!.id,
        material_variant_id: forVariantId,
        actual_quantity: 1,
      })
      .returning()
      .all();
  }

  test("returns false when the variant has no usages", () => {
    expect(repository.hasUsage(variantId)).toBe(false);
  });

  test("returns true with one usage and stays true with several", () => {
    addUsage(variantId);
    expect(repository.hasUsage(variantId)).toBe(true);
    addUsage(variantId);
    expect(repository.hasUsage(variantId)).toBe(true);
  });

  test("does not count usages of another variant", () => {
    addUsage(otherVariantId);
    expect(repository.hasUsage(variantId)).toBe(false);
    expect(repository.hasUsage(otherVariantId)).toBe(true);
  });
});
