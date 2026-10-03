# Sklad — PRD Index

Product requirements for Sklad, split by concern. Start with `overview.md`, then use the tables below to find the file for your task.

This doc is business requirements only. It doesn't concern itself with technical implementations that can look completely different. This are user facing requirements and mostly related to frontend.

## Files

| File                  | Was chapter | Covers                                                                  |
| --------------------- | ----------- | ----------------------------------------------------------------------- |
| `overview.md`         | 1–2         | Product scope, non-goals, working-day flow, mobile/web requirement      |
| `materials.md`        | 3           | Material types, materials, variants, supplies, material stock rules     |
| `products.md`         | 4           | Product templates, product items, item creation, batch production       |
| `inventory.md`        | 5           | Product inventory view, availability by status                          |
| `sales-and-status.md` | 6           | Statuses and transitions, sale information, customer/channel free text  |
| `costing.md`          | 7–8         | Material/labor/additional cost, recalculation rules, labor cost setting |

## Concepts

| Concept                                         | File                  |
| ----------------------------------------------- | --------------------- |
| Product scope, non-goals, working-day flow      | `overview.md`         |
| Feature flags                                   | `overview.md`         |
| Material Type                                   | `materials.md`        |
| Material                                        | `materials.md`        |
| Material Variant                                | `materials.md`        |
| Supply                                          | `materials.md`        |
| Supplier                                        | `materials.md`        |
| Unit, unit purchase cost                        | `materials.md`        |
| Material stock (derived, never edited directly) | `materials.md`        |
| Product Template                                | `products.md`         |
| Product Item                                    | `products.md`         |
| Product Item creation, material consumption     | `products.md`         |
| Batch production                                | `products.md`         |
| Product inventory (grouped by template)         | `inventory.md`        |
| Statuses (In stock / Sold / Repair / Reserved)  | `sales-and-status.md` |
| Sale date, sale price, customer, sales channel  | `sales-and-status.md` |
| Product Item cost calculation                   | `costing.md`          |
| Hourly labor cost setting                       | `costing.md`          |
