# Sklad — Epic 1 Implementation Plan: Manage Material Catalog

> Assembled from: `docs/product/prd.md`, `docs/product/epics.md`, `docs/tech/architecture.md`, `docs/tech/data modeling.md`.

## A. Goal & Position

- **Purpose:** Let the user define and maintain the materials used by the business (epics.md §1).
- Epic 1 is the **root epic** — the foundation of the dependency spine:
  - `Material Catalog → Material Supplies → Product Items`
  - `Material Catalog → Product Templates → Product Items`
- **Enables:** Material Supplies (Epic 2), Product Templates (Epic 3), Product production (Epic 5).

## B. Scope & Hierarchy

```text
Material Type → Material → Material Variant → Supply (Epic 2)
```

- **Supply is OUT of scope** for Epic 1 (it is Epic 2, epic dependency spine).
- Catalog entities are reusable definitions. Stock is NOT stored on catalog entities:
  - available material stock derives from the remaining quantities of Supplies
  - Material Types, Materials, and Material Variants have **no independent stock quantity**
  - there is no separate `remaining_quantity` field
- Units are **not** part of Epic 1 catalog UI: the unit is selected when a Supply is created, and a Material Variant owns its unit consistently.

## C. Entities, CRUD & Business Rules

### C.1 Material Type
- Fields: Name, Description, `created_at`, `updated_at`, `deleted_at` (data model §31 table, arch §27).
- CRUD: create / view / edit / delete (prd.md §3.1, data model §2.1, arch §29).
- Deletion is permitted only when permitted by existing data relationships (prd.md §3.1, epics.md §1: "when permitted by existing data relationships").
- Hard deletion is blocked while Materials reference it. Soft-delete applies when historically referenced (data model §36, §11.1).
- Active Material Type names must be unique (data model §2.1, arch §5).
- Description is optional.

### C.2 Material
- A Material belongs to one Material Type.
- Fields: Material Type, Name, Description, `created_at`, `updated_at`, `deleted_at` (data model §31, arch §28).
- CRUD: create / view / edit / delete (prd.md §3.2, data model §2.2, arch §28).
- Deletion is permitted only when permitted by existing data relationships.
- Active Material names must be unique within their Material Type (data model §2.2).
- Description is optional.

### C.3 Material Variant
- A Material Variant belongs to one Material and distinguishes a specific version of that Material (e.g., color).
- Fields: Material, Name, Unit, `created_at`, `updated_at`, `deleted_at` (data model §30, arch §26).
- Supported units: Pieces, Meters (prd.md §3.4, data model §31).
- **Each Material Variant uses one unit consistently. Unit is defined on the Variant, not on the Supply.**
- Unit conversion is not required.
- CRUD: create / view / edit / delete (prd.md §3.3, data model §2.3, arch §26).
- Deletion is permitted only when permitted by existing data relationships.
- Active Material Variant names must be unique within their Material (data model §2.3).
- **Unit immutability:** a Variant's unit cannot be changed once it has historical relationships (Supplies, Product Template Materials, Material Usages). If a different unit is needed, create a new Variant (data model §31, §12).

## D. Deletion Strategy for Epic 1

- Use **soft deletion** for all three catalog entities (data model §34, arch §13, §21).
- Soft deletion is required because Materials/Variants can be historically referenced by Supplies, Product Templates, and Product Item Material Usage (data model §35, §13).
- Soft deletion rule (data model §26, arch §13):
  - `deleted_at` NULL = active; set = deleted.
  - Soft-deleted records are excluded from normal active selections.
  - Soft-deleted records remain available to historical relationships and retain their original information.
  - Soft-deleted records may be restored by clearing `deleted_at`.
  - Soft-deleted records do **not** prevent creation of new records with the same active name (data model §26).
- Blocking rule for deletion: if a record has existing data relationships (e.g., a Material under a Material Type, a Variant under a Material), deletion is not permitted in the UI — enforce via backend (block with a clear error).

## E. Enabling Concepts (context, not implemented in Epic 1)

- Supplies are historical and use soft deletion (Epic 2).
- Supply quantity/unit are the source of material stock.
- Product Templates reference Variants with default quantities (Epic 3); changing a Template does not affect existing Product Items (data model §6.3).
- Product Items use actual material quantities and track material usage (Epic 5); historical relationships must not be erased by later changes to referenced entities (data model §32).

## F. Cross-Cutting / Non-Functional Requirements

### F.1 Working-Day Flow & Navigation
- Main working-day flow (prd.md §2): open app → review stock → record sales → record purchased materials → record produced items → check costs.
- These operations must be accessible **without requiring the user to navigate through unrelated configuration or technical functionality** (prd.md §2).
- Catalog management (Types/Materials/Variants) is a configuration-like maintenance area; it should be reached cleanly from the main flows without breaking the working-day experience.
- Product Templates are reusable definitions and are **not** part of the catalog maintenance flow in Epic 1 (they are Epic 3).

### F.2 Platform / Architecture Constraints
- Single business; **no authentication, roles, payments, accounting, import/export, notifications** in the current scope (prd.md §1, arch §2).
- Frontend/backend are feature-based; business rules live in the **backend service/domain layer** (arch §5, §10, §20).
- The frontend is **not** the source of truth for business rules; validation is a UX convenience only (arch §15, §18).
- Mobile-friendly web app (responsive) (prd.md §2, arch §21).
- Config via environment variables (arch §16).
- Use a transaction for operations that might modify multiple records; catalog CRUD is simple but be transaction-aware where relationships are changed (arch §20 "Database is the source of truth", §13).

## G. Data/API Design Considerations (not to be finalized now)

- This plan captures the Epic 1 functional scope. Detailed field-level API/schema/table design (Drizzle schema, REST routes, React components/screens) is the next step and will be defined in the implementation phase.
- Keep API clean for future authentication to be added without redesigning domain modules (arch §17).
- Money stored as integer kopecks (arch §20) — not needed for Epic 1 (no monetary fields on catalog entities), but keep in mind for consistency (data model §15).

## H. Open Questions to Resolve During Implementation Planning

1. Confirm exact delete rule semantics for the UI flows (hard-block with error vs. soft-delete) for Type/Material/Variant — resolved to soft-delete per data model §26/§34.
2. Confirm that "delete when permitted by existing data relationships" means the user is prevented from deleting a record that is referenced — yes, enforce via backend.
3. Unit placement: defined on Variant only (per data model §31), not on Supply or elsewhere — confirmed.

## I. Deliverable Definition (Epic 1)

The user can maintain a Material Catalog with:

- Material Types: create, view, edit, delete.
- Materials (belonging to Types): create, view, edit, delete.
- Material Variants (belonging to Materials): create, view, edit, delete.

with:

- uniqueness constraints as above,
- soft-delete with history-preservation,
- unit ownership on Variants,
- deletion blocked where relationships require it.
