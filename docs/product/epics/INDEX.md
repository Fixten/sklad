# Sklad — Epics Index

One file per epic, each holding its Goal, Scope, and Enables. Use the tables below to pick the file for your task.

These epics form the high-level product-development structure for Sklad.

They are intentionally defined at the business-flow level rather than as technical work or CRUD operations. Each epic represents a meaningful product capability and is ordered to establish the dependencies needed by later capabilities.

## Development Order

The order below is the intended development progression for a small team. It is a dependency-oriented sequence, not a requirement that every epic be completed in isolation before work on the next one begins.

1. **Manage Material Catalog**
2. **Manage Material Supplies**
3. **Manage Product Templates**
4. **Configure Labor Cost**
5. **Manage Product Items**
6. **Manage Product Inventory**
7. **Manage Product Status**
8. **Manage Product Costs**

## Epic Dependency Spine

The central dependency chain is:

**Material Catalog → Material Supplies → Product Items**

and:

**Material Catalog → Product Templates → Product Items**

with:

**Labor Cost → Product Item Cost**

and:

**Product Items → Product Inventory → Product Status / Sales**

## Epics

Each epic file holds **Goal**, **Scope**, **Enables**, and **User Stories**, and links to the PRD chapter(s) it implements. `User Stories` exists only where the epic has been broken down (currently Epic 1).

| # | File | Epic | PRD | User Stories |
|---|---|---|---|---|
| 1 | `1-manage-material-catalog.md` | Manage Material Catalog | `../prd/materials.md` | yes |
| 2 | `2-manage-material-supplies.md` | Manage Material Supplies | `../prd/materials.md` | — |
| 3 | `3-manage-product-templates.md` | Manage Product Templates | `../prd/products.md` | — |
| 4 | `4-configure-labor-cost.md` | Configure Labor Cost | `../prd/costing.md` | — |
| 5 | `5-manage-product-items.md` | Manage Product Items | `../prd/products.md` | — |
| 6 | `6-manage-product-inventory.md` | Manage Product Inventory | `../prd/inventory.md` | — |
| 7 | `7-manage-product-status.md` | Manage Product Status | `../prd/sales-and-status.md` | — |
| 8 | `8-manage-product-costs.md` | Manage Product Costs | `../prd/costing.md` | — |

## Concepts

| Concept | Epic |
|---|---|
| Material Type / Material / Material Variant | 1 — `1-manage-material-catalog.md` |
| Supply, Supplier, unit, material stock | 2 — `2-manage-material-supplies.md` |
| Product Template | 3 — `3-manage-product-templates.md` |
| Hourly labor cost setting | 4 — `4-configure-labor-cost.md` |
| Product Item creation, material consumption, batch creation | 5 — `5-manage-product-items.md` |
| Product inventory grouped by template | 6 — `6-manage-product-inventory.md` |
| Statuses, sale information, customer/channel free text | 7 — `7-manage-product-status.md` |
| Product Item cost and recalculation rules | 8 — `8-manage-product-costs.md` |