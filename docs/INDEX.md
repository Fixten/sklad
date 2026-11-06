# Docs Index

Documentation for Sklad. Binding requirements live in `product/prd/` and `tech/`; other docs are
guides or records.

## Doc authority

- **`product/prd/` — binding business requirements.** They define what the product must do and stay
  implementation-agnostic.
- **`product/epics/` — planned scope and user stories.** They define what an epic covers, not UI
  mechanics.
- **`product/ux/` — UX flow guides, not specifications.** They describe the intended journey,
  states, information the user needs, and success/failure outcomes. Exact control type, copy, field
  values, persistence, placement, and interaction mechanics are prototype examples, not
  requirements, unless the same constraint is also stated in `product/prd/` or `tech/`. Use the
  flow, then choose the simplest implementation that delivers it.
- **`tech/` — binding technical requirements and constraints.**

## Product

| File                        | Covers                                                                                                                                                                                         |
| --------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `product/prd/INDEX.md`      | Product requirements, split by concern (materials, products, inventory, sales, costing). Read its index first to pick the right file.                                                          |
| `product/epics/INDEX.md`    | Epics, one file per epic, plus purpose, development order, and dependency spine. Each epic file holds its Goal, Scope, Enables, and User Stories. Read its index first to pick the right file. |
| `product/ux/**/workflow.md` | UX flow guides and disposable prototypes. Read [doc authority](#doc-authority): they define flow, not exact UI.                                                                                |

## Tech

| File                    | Covers                                                                |
| ----------------------- | --------------------------------------------------------------------- |
| `tech/architecture.md`  | System components, module boundaries, frontend/backend communication. |
| `tech/data modeling.md` | Persisted data, relations, derived data, integrity rules.             |
