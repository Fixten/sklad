import { eq } from "drizzle-orm";

import { getTestDbWithMigrations } from "@/db/dbTestHelpers.js";

import { materialSchema } from "../material/material.schema.js";
import { materialTypeSchema } from "../materialType/materialType.schema.js";
import { materialVariantSchema } from "../materialVariant/materialVariant.schema.js";
import { productItemSchema } from "../product/productItem.schema.js";

import { ProductTemplateRepository } from "./productTemplate.repository.js";
import { productTemplateSchema } from "./productTemplate.schema.js";
import { templateMaterialSchema } from "./templateMaterial.schema.js";

import type { TemplateMaterialInput } from "./productTemplate.repository.js";
import type { ProductTemplateModel } from "./productTemplate.schema.js";
import type { TestDbWithMigrations } from "@/db/dbTestHelpers.js";

describe("ProductTemplateRepository", () => {
  let db: TestDbWithMigrations;
  let repository: ProductTemplateRepository;
  let piecesVariantId: number;
  let metersVariantId: number;
  let templateSeq = 0;

  beforeEach(() => {
    db = getTestDbWithMigrations();
    repository = new ProductTemplateRepository(db);
    templateSeq = 0;

    const [materialType] = db.client
      .insert(materialTypeSchema)
      .values({ name: "Wood" })
      .returning()
      .all();
    const [material] = db.client
      .insert(materialSchema)
      .values({ name: "Oak", material_type_id: materialType!.id })
      .returning()
      .all();
    const [pieces] = db.client
      .insert(materialVariantSchema)
      .values({ name: "Board", material_id: material!.id, unit: "pieces" })
      .returning()
      .all();
    const [meters] = db.client
      .insert(materialVariantSchema)
      .values({ name: "Strip", material_id: material!.id, unit: "meters" })
      .returning()
      .all();
    piecesVariantId = pieces!.id;
    metersVariantId = meters!.id;
  });

  afterEach(() => {
    db.close();
  });

  function addTemplate(materials: TemplateMaterialInput[] = []) {
    templateSeq += 1;
    const value: ProductTemplateModel = {
      name: `Shelf ${String(templateSeq)}`,
      description: null,
      production_instructions: null,
      drawing_description: null,
      expected_production_work_hours: null,
      development_work_hours: null,
    };
    return repository.createWithMaterials(value, materials);
  }

  test("creates a template and its materials together", () => {
    const created = addTemplate([
      { material_variant_id: piecesVariantId, default_quantity: 4 },
      { material_variant_id: metersVariantId, default_quantity: 1250 },
    ]);

    expect(repository.getById(created.id).name).toBe("Shelf 1");
    expect(repository.getMaterials(created.id)).toEqual([
      expect.objectContaining({
        product_template_id: created.id,
        material_variant_id: piecesVariantId,
        default_quantity: 4,
        unit: "pieces",
      }),
      expect.objectContaining({
        product_template_id: created.id,
        material_variant_id: metersVariantId,
        default_quantity: 1250,
        unit: "meters",
      }),
    ]);
  });

  test("rolls back template creation when a child insert fails", () => {
    expect(() =>
      addTemplate([{ material_variant_id: 999999, default_quantity: 1 }]),
    ).toThrow();

    expect(repository.getAll()).toEqual([]);
  });

  test("replaces materials by adding, changing and removing rows", () => {
    const created = addTemplate([
      { material_variant_id: piecesVariantId, default_quantity: 4 },
    ]);

    repository.updateWithMaterials(created.id, {}, [
      { material_variant_id: metersVariantId, default_quantity: 750 },
    ]);

    expect(repository.getMaterials(created.id)).toEqual([
      expect.objectContaining({
        material_variant_id: metersVariantId,
        default_quantity: 750,
        unit: "meters",
      }),
    ]);

    repository.updateWithMaterials(created.id, {}, []);

    expect(repository.getMaterials(created.id)).toEqual([]);
  });

  test("keeps materials unchanged when an update omits them", () => {
    const created = addTemplate([
      { material_variant_id: piecesVariantId, default_quantity: 4 },
    ]);

    repository.updateWithMaterials(created.id, { description: "updated" });

    expect(repository.getMaterials(created.id)).toHaveLength(1);
  });

  test("rejects a duplicate variant and rolls back the replacement", () => {
    const created = addTemplate([
      { material_variant_id: piecesVariantId, default_quantity: 4 },
    ]);
    const duplicate = {
      material_variant_id: metersVariantId,
      default_quantity: 1250,
    };

    expect(() =>
      repository.updateWithMaterials(created.id, {}, [duplicate, duplicate]),
    ).toThrow();
    expect(repository.getMaterials(created.id)).toEqual([
      expect.objectContaining({
        material_variant_id: piecesVariantId,
        default_quantity: 4,
      }),
    ]);
  });

  test("rejects a zero default quantity through the database check", () => {
    const created = addTemplate();

    expect(() =>
      db.client
        .insert(templateMaterialSchema)
        .values({
          product_template_id: created.id,
          material_variant_id: piecesVariantId,
          default_quantity: 0,
        })
        .run(),
    ).toThrow();
    expect(repository.getMaterials(created.id)).toEqual([]);
  });

  test("groups materials for several templates", () => {
    const first = addTemplate([
      { material_variant_id: piecesVariantId, default_quantity: 4 },
    ]);
    const second = addTemplate([
      { material_variant_id: metersVariantId, default_quantity: 1250 },
    ]);
    addTemplate();

    const grouped = repository.getMaterialsFor([first.id, second.id]);

    expect(grouped.get(first.id)).toHaveLength(1);
    expect(grouped.get(second.id)).toHaveLength(1);
    expect(grouped.size).toBe(2);
    expect(repository.getMaterialsFor([])).toEqual(new Map());
  });

  test("hasProductItems is false without items and true with an item", () => {
    const created = addTemplate();
    expect(repository.hasProductItems(created.id)).toBe(false);

    db.client
      .insert(productItemSchema)
      .values({ product_template_id: created.id })
      .run();

    expect(repository.hasProductItems(created.id)).toBe(true);
  });

  test("hard delete removes the template and its child rows", () => {
    const created = addTemplate([
      { material_variant_id: piecesVariantId, default_quantity: 4 },
    ]);

    repository.hardDelete(created.id);

    expect(
      db.client
        .select()
        .from(productTemplateSchema)
        .where(eq(productTemplateSchema.id, created.id))
        .get(),
    ).toBeUndefined();
    expect(
      db.client
        .select()
        .from(templateMaterialSchema)
        .where(eq(templateMaterialSchema.product_template_id, created.id))
        .all(),
    ).toEqual([]);
  });

  test("cascades child removal when the parent is deleted directly", () => {
    const created = addTemplate([
      { material_variant_id: piecesVariantId, default_quantity: 4 },
    ]);

    db.client
      .delete(productTemplateSchema)
      .where(eq(productTemplateSchema.id, created.id))
      .run();

    expect(
      db.client
        .select()
        .from(templateMaterialSchema)
        .where(eq(templateMaterialSchema.product_template_id, created.id))
        .all(),
    ).toEqual([]);
  });
});
