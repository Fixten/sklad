<!-- impeccable:product-schema 1 -->

# Product

Sklad — a small business's own working tool for materials, production and sales of
made goods. This record is UI-centric and covers the whole product, not only the
React package: the frontend is the product's only user-facing surface, and the
backend exists to serve it.

**Requirements are not restated here.** They live in `../docs/` and that is the
source of truth:

| Concern                                                       | File                                      |
| ------------------------------------------------------------- | ----------------------------------------- |
| Scope, non-goals, working-day flow, mobile/web, feature flags | `../docs/product/prd/overview.md`         |
| Material types, materials, variants, supplies, stock rules    | `../docs/product/prd/materials.md`        |
| Product templates, items, creation flow, batch production     | `../docs/product/prd/products.md`         |
| Product inventory and availability by status                  | `../docs/product/prd/inventory.md`        |
| Statuses, transitions, sale information                       | `../docs/product/prd/sales-and-status.md` |
| Cost calculation, recalculation rules, labor cost setting     | `../docs/product/prd/costing.md`          |
| Capability roadmap as epics                                   | `../docs/product/epics/INDEX.md`          |
| Approved UX flows and interaction models                      | `../docs/product/ux/`                     |
| Known gaps between docs and implementation                    | `../docs/todos.md`                        |

When this file and the docs disagree, the docs win; when the docs and code
disagree, the code changes.

## Platform

web

## Users

A small atelier team of 2–5 people who build physical goods by hand and run the
whole business themselves. They share one set of records, but each person enters
data from their own device, so the same data is written from several hands and
several moments in a day.

They are not accountants or inventory specialists, and they do not want to become
either. Recording is a break in the work — after a sale, after a delivery arrives,
after a batch leaves the bench — not a sitting-down task.

The PRD fixes the unit of business as _one_ business, with accounts out of scope
from the start (`../docs/product/prd/overview.md`); it does not name the person
using it. The paragraph above is the team size and situation confirmed for this
product record.

## Product Purpose

Sklad lets one atelier answer the questions it actually has during a working day:
what is in stock right now, what was sold today, what materials arrived, what was
produced, and what did a given item really cost. It replaces the combination of a
spreadsheet and memory that a workshop otherwise runs on.

Success means the day's records get entered as they happen, on a phone, without
the user leaving the page they are on, and the resulting numbers (stock, cost) are
trusted enough to price and sell from.

## Positioning

**Material batches are tracked all the way to the finished item.** A Supply
records one purchase of one variant at one price; when a Product Item is produced,
the user picks which Supplies it consumes and that consumption is recorded on the
item. Cost therefore comes from the batches that actually went into the thing and
the hours actually spent, not from an estimate computed off a bill of materials.

Two consequences a stock-counting tool cannot truthfully copy: an item remembers
its real production history, and a sold item keeps its historical cost while
unsold items are recalculated when supply prices or the hourly rate change.

## Operating Context

- **The working day** is the organising ritual, defined in
  `../docs/product/prd/overview.md` §Working Day. Recording operations must be
  reachable without navigating through configuration.
- **Language and setting.** The UI copy is Russian; users are Russian-speaking
  workshop owners and staff, and the terms are the ones the trade uses (материал,
  приход, партия, себестоимость), not accounting vocabulary.
- **Device.** A web application that must be usable on mobile (PRD requirement).
  In practice it is used on a phone on the bench or at the counter, and on a
  desktop at a table.
- **Environment.** Self-hosted for a single business: one deployment, one
  database. Feature flags are configuration-time, set per deployment, so a
  deployment can ship with unfinished capabilities absent.
- **Sources of truth in use.** Physical samples and photos of the goods
  themselves; supply receipts and supplier pages (a Supply can carry a URL) for
  material prices; the app's own records for stock and cost.

## Capabilities and Constraints

Capabilities, entity rules, statuses, costing and flag semantics are specified in
the PRD files linked above — follow them there rather than reading a second
summary here. What this record adds is the frontend context those docs assume:

- **The React SPA is the only place these requirements surface.** The feature-flag
  rule ("disabled means absent, not disabled-looking") is a UI obligation, and the
  working-day interaction model is designed in `../docs/product/ux/`, ahead of its
  implementation.
- **Custom-built vs. upstream code.** The UI layer is shadcn/ui on Base UI with a
  project-authored `@ui` layer on top; upstream components stay verbatim except
  for token/recipe edits required by `DESIGN.md`.
- **Known state.** The frontend implements a subset — Home (currently a command
  palette, not the working-day page), Materials, Material types, Variants and
  Settings — and is knowingly behind its docs (`../docs/todos.md`).
- **Non-goals are inherited, not re-decided** (auth, roles, payments, accounting,
  reporting, import/export, notifications); customers and sales channels are free
  text, not entities.

## Brand Commitments

- The name is **Sklad** (склад), used as-is in the UI.
- UI copy is Russian, in the calm, matter-of-fact register of a workshop, not a
  corporate one.
- The app runs in a single dark presentation; the visual world itself is recorded
  in `DESIGN.md` and is not restated here.

## Evidence on Hand

- `../docs/product/ux/home/prototype.html` and
  `../docs/product/ux/materials/materials.html` — two disposable, mocked-data
  prototypes whose footers toggle the data-present/empty and feature-flag states.
  Validation artifacts, not production code and not a design system.
- **Absent, and not to be fabricated:** customer testimonials, case studies,
  press, logos, brand marks, product photography, benchmark or pricing claims, and
  any named real business. No such assets exist in the repository.

## Product Principles

1. **Record the working day, don't administer the data model.** Every surface
   answers a question the user has while working; entity-shaped CRUD pages are not
   the shape of the answer.
2. **Cost is a consequence of recorded reality.** Material batches and real hours
   are entered once, and cost falls out of them — never a second, parallel entry.
3. **Batches are the truth; everything above them is derived.**
4. **Capabilities ship behind flags and appear whole.** An unfinished feature is
   absent, not half-present.
5. **Sold means frozen.** Historical cost and prior status information survive
   later data changes, and the UI says so plainly.
