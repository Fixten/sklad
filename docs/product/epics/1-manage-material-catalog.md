# Epic 1 — Manage Material Catalog

## Goal

Allow the user to define and maintain the materials used by the business.

## Scope

The material catalog consists of:

- Material Types
- Materials
- Material Variants

The user can create, view, edit, and delete these entities when permitted by existing data relationships. Deleting an entity that other records still reference hides it instead of removing it, and the user can restore such a hidden entity later; an entity that was removed for real cannot be restored.

Material Variants are the concrete variants used elsewhere in the application. A Material belongs to a Material Type, and a Material Variant belongs to a Material.

## Enables

This epic establishes the material definitions required for:

- Material Supplies
- Product Templates
- Product production

## User Stories

- **Maintain Material Types**
  - Create Material Type
  - View Material Types
  - Edit Material Type
  - Delete Material Type
  - Restore Material Type
  - Appropriate relationship/deletion constraints
- **Maintain Materials**
  - Create Material
  - View Materials
  - Edit Material
  - Delete Material
  - Restore Material
  - Material belongs to a Material Type
  - Appropriate relationship/deletion constraints
- **Maintain Material Variants**
  - Create Material Variant
  - View Material Variants
  - Edit Material Variant
  - Delete Material Variant
  - Restore Material Variant
  - Variant belongs to a Material
  - Appropriate relationship/deletion constraints
