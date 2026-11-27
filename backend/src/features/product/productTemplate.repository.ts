import { eq, inArray } from "drizzle-orm";

import singleton, { Db } from "@/db/index.js";
import Repository from "@/db/repository.js";
import { createSingleton } from "@/utils/createSingleton.js";

import { materialVariantSchema } from "../materialVariant/materialVariant.schema.js";

import { productItemSchema } from "./productItem.schema.js";
import { productTemplateSchema } from "./productTemplate.schema.js";
import { templateMaterialSchema } from "./templateMaterial.schema.js";

import type { ProductTemplateModel } from "./productTemplate.schema.js";
import type { TemplateMaterialSchema } from "./templateMaterial.schema.js";
import type { MaterialUnit } from "../materialVariant/utils/quantity.js";

export interface VariantReference {
  id: number;
  unit: MaterialUnit;
  deleted_at: Date | null;
}

export interface TemplateMaterialInput {
  material_variant_id: number;
  default_quantity: number;
}

export interface TemplateMaterialRead extends TemplateMaterialSchema {
  unit: MaterialUnit;
}

export class ProductTemplateRepository {
  static getSingleton = createSingleton(() => new ProductTemplateRepository());
  private baseRepository;
  private schema = productTemplateSchema;

  constructor(private db: Db<Record<string, unknown>> = singleton) {
    this.baseRepository = new Repository(this.schema, db);
  }

  private selectMaterials() {
    return this.db.client
      .select({
        id: templateMaterialSchema.id,
        product_template_id: templateMaterialSchema.product_template_id,
        material_variant_id: templateMaterialSchema.material_variant_id,
        default_quantity: templateMaterialSchema.default_quantity,
        created_at: templateMaterialSchema.created_at,
        updated_at: templateMaterialSchema.updated_at,
        deleted_at: templateMaterialSchema.deleted_at,
        unit: materialVariantSchema.unit,
      })
      .from(templateMaterialSchema)
      .innerJoin(
        materialVariantSchema,
        eq(
          templateMaterialSchema.material_variant_id,
          materialVariantSchema.id,
        ),
      );
  }

  getMaterials(templateId: number): TemplateMaterialRead[] {
    return this.selectMaterials()
      .where(eq(templateMaterialSchema.product_template_id, templateId))
      .all();
  }

  getMaterialsFor(templateIds: number[]): Map<number, TemplateMaterialRead[]> {
    const grouped = new Map<number, TemplateMaterialRead[]>();
    if (templateIds.length === 0) return grouped;
    const rows = this.selectMaterials()
      .where(inArray(templateMaterialSchema.product_template_id, templateIds))
      .all();
    for (const row of rows) {
      const materials = grouped.get(row.product_template_id) ?? [];
      materials.push(row);
      grouped.set(row.product_template_id, materials);
    }
    return grouped;
  }

  getVariantReference(variantId: number): VariantReference | undefined {
    return this.db.client
      .select({
        id: materialVariantSchema.id,
        unit: materialVariantSchema.unit,
        deleted_at: materialVariantSchema.deleted_at,
      })
      .from(materialVariantSchema)
      .where(eq(materialVariantSchema.id, variantId))
      .get();
  }

  hasProductItems(templateId: number): boolean {
    return (
      this.db.client
        .select({ id: productItemSchema.id })
        .from(productItemSchema)
        .where(eq(productItemSchema.product_template_id, templateId))
        .get() !== undefined
    );
  }

  getById(id: number) {
    return this.baseRepository.getById(id);
  }

  getAll() {
    return this.baseRepository.getAll();
  }

  getAllActive() {
    return this.baseRepository.getAllActive();
  }

  createWithMaterials(
    value: ProductTemplateModel,
    materials: TemplateMaterialInput[],
  ) {
    return this.baseRepository.transaction(() => {
      const created = this.baseRepository.addNew(value);
      this.insertMaterials(created.id, materials);
      return created;
    });
  }

  updateWithMaterials(
    id: number,
    value: Partial<ProductTemplateModel>,
    materials?: TemplateMaterialInput[],
  ) {
    return this.baseRepository.transaction(() => {
      const updated = this.baseRepository.updateById(id, value);
      if (materials !== undefined) {
        this.db.client
          .delete(templateMaterialSchema)
          .where(eq(templateMaterialSchema.product_template_id, id))
          .run();
        this.insertMaterials(id, materials);
      }
      return updated;
    });
  }

  private insertMaterials(
    templateId: number,
    materials: TemplateMaterialInput[],
  ) {
    if (materials.length === 0) return;
    this.db.client
      .insert(templateMaterialSchema)
      .values(
        materials.map((material) => ({
          ...material,
          product_template_id: templateId,
        })),
      )
      .run();
  }

  softDelete(id: number) {
    return this.baseRepository.softDelete(id);
  }

  hardDelete(id: number) {
    return this.baseRepository.transaction(() => {
      this.db.client
        .delete(templateMaterialSchema)
        .where(eq(templateMaterialSchema.product_template_id, id))
        .run();
      return this.baseRepository.deleteById(id);
    });
  }

  restore(id: number) {
    return this.baseRepository.restore(id);
  }
}
