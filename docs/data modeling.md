# Sklad — Data Modeling Decisions

## Purpose

This document captures the agreed conceptual and relational data-modeling decisions for Sklad.

It defines what information is persisted, how records relate, what is historical, what is derived, and the main integrity rules.

The document intentionally stops short of implementation-specific Drizzle code.

---

# 1. Modeling Principles

- Use a normalized relational model.
- Prefer normalization wherever possible and avoid duplicated source-of-truth data.
- Denormalization during reads is acceptable.
- Persist historical relationships when later changes must not erase the fact they represent.
- Business concepts do not necessarily map 1:1 to SQL tables.
- Keep the model pragmatic for a small SQLite application.
- Avoid introducing abstractions without a concrete requirement.
- Business rules belong primarily in the backend service/domain layer.
- Fundamental data invariants should also be protected with database constraints where practical.
- Multi-record business operations must be transactionally consistent.
- Integer IDs are sufficient for all entities.
- The database is the source of truth for persisted application state.

---

# 2. Material Model

```text
Material Type
    └─< Material
        └─< Material Variant
            └─< Supply ── Supplier
````

## 2.1 Material Type

A reusable classification of materials.

Fields:

* Name
* Description
* `created_at`
* `updated_at`
* `deleted_at`

Material Types support create, view, edit, and delete operations.

Material Types use soft deletion when they have historical relationships.

Active names should be unique.

---

## 2.2 Material

A Material belongs to one Material Type.

Fields:

* Material Type
* Name
* Description
* `created_at`
* `updated_at`
* `deleted_at`

Active Material names should be unique within their Material Type.

Materials use soft deletion when historically referenced.

---

## 2.3 Material Variant

A Material Variant represents one specific version of a Material, such as a color.

Fields:

* Material
* Name
* Unit
* `created_at`
* `updated_at`
* `deleted_at`

Supported units:

* `pieces`
* `meters`

The Material Variant owns the unit definition.

The unit is **not duplicated on Supply**.

Each Material Variant uses one unit consistently.

### Unit immutability

The unit cannot be changed once the Material Variant has historical usage.

A Material Variant must not change from, for example:

```text
meters → pieces
```

after it has associated Supplies or Product Item Material Usage records.

If a different unit is required, a new Material Variant must be created.

Active Variant names should be unique within their Material.

---

# 3. Supplier

Supplier is a separate managed entity.

Fields:

* Name
* Description
* URL
* Additional contact information as free text
* `created_at`
* `updated_at`
* `deleted_at`

Supplier information is not an accounting/customer entity.

Active Supplier names should be unique.

Suppliers use soft deletion when historically referenced by Supplies.

---

# 4. Supply

A Supply represents one specific purchase of a Material Variant.

```text
Material Variant
    └─< Supply
          └── Supplier
```

Fields:

* Material Variant
* Supplier
* Description
* Quantity
* Purchase price
* URL
* `created_at`
* `updated_at`
* `deleted_at`

The Supply does **not** contain a unit field because the unit is defined by its Material Variant.

## 4.1 Quantity

Supply quantity must be greater than zero.

Quantity precision depends on the Material Variant unit:

### Pieces

* Whole numbers only.

### Meters

* Up to 3 decimal places.

All persisted decimal quantities use scaled integer representation.

Meters are therefore stored in thousandths.

The API exposes normal decimal values; conversion to/from the scaled persistence representation happens in the backend service/domain layer.

## 4.2 Purchase Price

Purchase price is stored as integer kopecks.

Purchase price may be zero.

Unit purchase cost is derived from:

```text
purchase price / supplied quantity
```

It is not stored independently.

## 4.3 Remaining Quantity

Remaining Supply quantity is derived:

```text
supplied quantity
-
sum of Supply Consumption quantities
```

There is no independently editable `remaining_quantity` field.

Material stock for a Material Variant is the sum of remaining quantities of its active Supplies.

## 4.4 Supply Corrections

The user may correct Supply quantity and purchase price after consumption.

Correcting a Supply does not modify historical Supply Consumption records.

A Supply quantity cannot be corrected below the amount already consumed.

Changes to Supply purchase price affect Product Items that are not currently Sold.

Sold Product Items retain their historical cost snapshot.

## 4.5 Supply Deletion

Supplies use soft deletion.

Deleted Supplies:

* are excluded from normal active inventory;
* cannot be selected for new consumption;
* remain available to historical relationships;
* remain available for historical cost calculation;
* retain their original information.

A Supply with historical consumption cannot be physically removed.

---

# 5. Product Model

```text
Product Template
    ├─< Template Material ── Material Variant
    └─< Product Item
```

A Product Template is a reusable product definition.

A Product Item is one physical product.

---

# 6. Product Template

Fields:

* Name
* Description
* Production instructions
* Drawing description
* Expected production work hours
* Development work hours
* Template Materials
* `created_at`
* `updated_at`
* `deleted_at`

Active Product Template names should be unique.

## 6.1 Expected Production Hours

Expected production hours are a default value used when creating Product Items.

They are copied to the Product Item as its initial actual production hours.

Changing the Product Template later does not change existing Product Items.

## 6.2 Development Hours

Development hours are informational.

They are not included in Product Item cost.

## 6.3 Template Changes

Product Template changes affect future Product Items only.

Existing Product Items retain their own actual production and material information.

A Product Item continues referencing its original Product Template even if the template is later modified or soft-deleted.

No separate snapshot of Product Template name or description is required.

## 6.4 Template Deletion

Product Templates use soft deletion when referenced by Product Items.

A Product Template with Product Items cannot be physically deleted.

---

# 7. Template Material

A Template Material defines one required Material Variant and its default quantity.

```text
Product Template
    └─< Template Material
            └── Material Variant
```

Fields:

* Product Template
* Material Variant
* Default quantity
* `created_at`
* `updated_at`

Rules:

* A Material Variant can occur at most once in a Product Template.
* `(product_template_id, material_variant_id)` is unique.
* Default quantity must be greater than zero.
* Quantity follows the Material Variant precision.

A Template Material can be removed or changed without modifying existing Product Items.

---

# 8. Product Item

A Product Item represents one physical product.

Fields:

* Product Template
* Notes
* Modifications
* Actual production work hours
* Additional cost
* Material Usages
* Status History
* Historical cost snapshot
* `created_at`
* `updated_at`

There is no separate production/physical creation date.

`created_at` is sufficient.

There is no separate `creation_source` field.

---

# 9. Product Item Creation

When creating a Product Item:

1. The user selects a Product Template.
2. All Template Materials are copied into Material Usage records.
3. Template quantities become the initial actual quantities.
4. The user may change the actual quantities.
5. Zero quantity is allowed.
6. Negative quantity is not allowed.
7. The user selects Supplies and their order.
8. The application determines Supply allocation quantities.
9. Actual production hours are entered, initially defaulting to the Template's expected production hours.
10. Additional cost is entered, defaulting to zero.
11. The operation is executed transactionally.

For an existing physical Product Item:

* the same Product Item data is recorded;
* Material Usage is recorded;
* Supply Consumption is not created;
* existing stock is therefore not consumed.

---

# 10. Material Usage

Material Usage represents what a specific Product Item actually used.

```text
Product Item
    └─< Material Usage
            └── Material Variant
```

Fields:

* Product Item
* Material Variant
* Actual quantity
* `created_at`
* `updated_at`

Every Template Material produces one Material Usage when the Product Item is created.

The Material Variant itself does not change.

If a different Material Variant is required for an otherwise similar product, the user should create a separate Product Template.

## 10.1 Actual Quantity

The Template quantity is only a default.

The user can change it for the individual Product Item.

Allowed values:

* `0`
* positive quantities

Negative values are invalid.

Zero-valued Material Usage records are intentionally retained for clarity and consistency.

---

# 11. Supply Consumption

Supply Consumption represents which Supply provided material for a Material Usage.

```text
Product Item
    └─< Material Usage
            └─< Supply Consumption
                    └── Supply
```

Fields:

* Material Usage
* Supply
* Consumed quantity
* `created_at`
* `updated_at`

One Material Usage may consume from multiple Supplies.

One Supply may provide material to multiple Product Items.

Supply Consumption is the historical relationship required for:

* stock calculation;
* material cost calculation;
* traceability;
* editing consumption;
* historical analysis.

---

# 12. Supply Selection and Allocation

The user controls:

* which Supplies are selected;
* the order of selected Supplies.

The user does **not** manually allocate quantities to individual Supplies.

The application determines allocation quantities.

Example:

```text
Required: 8 m

Selected:
Supply A
Supply B

Allocation:
Supply A → 5 m
Supply B → 3 m
```

If a selected Supply does not contain enough material, the application consumes its remaining quantity and continues with the next selected Supply.

If selected Supplies cannot provide the requested quantity, the complete operation fails.

---

# 13. Editing Material Consumption

Editing Material Usage follows the same user flow as initial consumption.

Existing values are pre-populated.

The user may:

* change the required quantity;
* change selected Supplies;
* change Supply order.

Existing Supply Consumption is treated as temporarily released while calculating the new allocation.

Example:

```text
Supply A
available stock: 5 m
existing consumption: 6 m

New requested consumption: 7 m
```

The existing 6 m is first returned conceptually:

```text
5 + 6 = 11 m available
```

The new 7 m is then allocated:

```text
11 - 7 = 4 m available
```

The same logic applies across multiple Supplies.

If Supply selection changes, previous allocations are returned to their original Supplies and the new selection is allocated.

All changes occur in one database transaction.

---

# 14. Quantity Precision

Scaled integer storage is used for decimal quantities.

## 14.1 Material Quantities

### Pieces

Whole numbers only.

### Meters

Maximum precision:

```text
3 decimal places
```

Example:

```text
1.250 m
```

is valid.

Values with more than three decimal places are rejected.

## 14.2 Work Hours

The following use the same three-decimal precision:

* Expected production hours
* Development hours
* Actual production hours

Values with more than three decimal places are rejected.

The backend service performs conversion between API decimal values and scaled integer persistence.

---

# 15. Money

Currency is RUB.

All monetary values are stored as integer kopecks.

Example:

```text
125.50 RUB → 12550
```

Monetary fields include:

* Supply purchase price
* Product Item additional cost
* Sale price
* Labor rate
* Cost snapshot values

The API exposes normal decimal monetary values.

Conversion between API values and integer persistence happens in the backend service/domain layer.

## 15.1 Monetary Input Precision

External input may contain more than two decimal places.

The backend rounds **down** to the smaller monetary value.

Examples:

```text
10.124 → 10.12
10.125 → 10.12
10.129 → 10.12
```

Decimal arithmetic should be used rather than floating-point arithmetic.

This rounding behavior applies wherever monetary conversion is required.

---

# 16. Product Item Cost

```text
Material Cost
+
Labor Cost
+
Additional Cost
=
Total Product Cost
```

## 16.1 Material Cost

Material cost is calculated from actual Material Usage and Supply Consumption.

For each Supply Consumption:

```text
consumed quantity × applicable Supply unit cost
```

Total Material Cost is the sum of all allocations.

Consumption from multiple Supplies is therefore calculated independently rather than using an averaged Supply cost.

## 16.2 Labor Cost

```text
Actual Production Hours
×
Applicable Labor Rate
```

Development hours are excluded.

Actual production hours are committed to the Product Item's final cost.

## 16.3 Additional Cost

Product Item has one additional monetary cost field.

It is:

* stored in kopecks;
* initialized to zero;
* included in Product Item cost;
* editable while the Product Item is not Sold.

No separate additional-cost entity is required at this stage.

---

# 17. Dynamic and Historical Cost

Product Item cost is dynamic while the Product Item is not Sold.

Therefore:

* Supply purchase-price changes affect unsold Product Items.
* Labor-rate changes affect unsold Product Items.
* Material Consumption changes affect unsold Product Items.
* Additional cost changes affect unsold Product Items.

When the Product Item enters `Sold`, its cost becomes historical.

---

# 18. Sold Cost Snapshot

When a Product Item enters `Sold`, the current cost is snapshotted.

The snapshot contains:

* Material Cost
* Labor Cost
* Additional Cost
* Total Cost
* Labor Rate used

The snapshot is stored on the Product Item.

All monetary snapshot values are stored in kopecks.

The snapshot is the historical source of truth while the Product Item is Sold.

Later changes to:

* Supplies;
* Supply purchase prices;
* Labor rate;
* other dynamic cost inputs

do not change the Sold Product Item's historical cost.

---

# 19. Returning a Sold Item to Stock

When:

```text
Sold → In stock
```

the historical cost snapshot is no longer authoritative.

The Product Item becomes dynamically costed again.

If the Product Item is later Sold again:

* a new Sold period is created;
* a new cost snapshot is created;
* the previous sale remains in status history.

---

# 20. Cost Editing While Sold

Cost-driving Product Item fields cannot be changed while the Product Item is Sold.

This includes relevant:

* Material Usage
* Supply Consumption
* Actual production hours
* Additional cost

After returning to `In stock`, these fields become editable again.

---

# 21. Product Item Status

Product Items use these statuses:

* `In stock`
* `Sold`
* `Repair`
* `Reserved`

All transitions are allowed.

```text
In stock
   ↕
Sold
   ↕
Repair
   ↕
Reserved
```

Any status may transition directly to any other status.

---

# 22. Status History

Status history is persisted separately from current state.

```text
Product Item
    └─< Status History
```

Each status period contains:

* Product Item
* Status
* `started_at`
* `ended_at`
* `created_at`
* `updated_at`

The current status is represented by the single open period:

```text
ended_at IS NULL
```

There must be exactly one open status period per Product Item.

Status periods must not overlap.

Status transitions:

1. Close the current status period.
2. Create the new status period.
3. Create/update corresponding status-specific information.
4. Perform all changes transactionally.

Status history is not directly edited by users.

---

# 23. Status-Specific Information

Status-specific information is stored separately from the generic status history.

```text
Status History
    ├─ Sold Details
    ├─ Repair Details
    └─ Reserved Details
```

Each Status History record has at most one corresponding detail record.

## 23.1 Sold Details

Fields:

* Sale date
* Sale price
* Customer
* Sales channel/place
* Notes

Customer and Sales Channel remain free-text fields.

They are not separate business entities.

`sale_date` is a business date and is distinct from the status period's technical timestamps.

A Product Item may have multiple Sold periods during its lifetime.

Each Sold period retains its own Sale Details.

## 23.2 Repair Details

Fields:

* Notes

## 23.3 Reserved Details

Fields:

* Notes

---

# 24. Inventory

Inventory is derived rather than stored as independent stock quantities.

## 24.1 Material Inventory

Material stock is derived from Supplies:

```text
Supply quantity
-
Supply Consumption
=
Supply remaining quantity
```

Material Variant stock is the sum of remaining quantities of its Supplies.

There is no independent editable Material Variant stock quantity.

## 24.2 Product Inventory

Product inventory is derived from Product Items whose current status is:

```text
In stock
```

Product Items in:

* Sold
* Repair
* Reserved

are excluded from available product inventory.

Product inventory can group Product Items by Product Template.

No separate product-stock entity is required.

---

# 25. Batch Production

Batch production is an application operation.

The user can create multiple Product Items from one Product Template.

Supplies are selected for the batch.

Each resulting Product Item:

* is an independent record;
* receives its own Material Usage;
* receives its own production hours;
* receives its own cost;
* receives its own status history.

There is no persisted Batch entity or Batch ID.

---

# 26. Deletion Strategy

General rule:

> If something is related to somewhere or has historical value, use soft delete. Otherwise use hard delete.

## 26.1 Soft Delete

Soft deletion uses:

```text
deleted_at
```

where:

```text
NULL       = active
timestamp  = deleted
```

Soft-deleted records remain available for historical relationships.

They are excluded from normal active selections.

Soft-deleted records may be restored by clearing `deleted_at`.

Soft deletion applies where historical relationships exist to:

* Material Types
* Materials
* Material Variants
* Supplies
* Suppliers
* Product Templates

Soft-deleted records do not prevent creation of new records with the same business name.

## 26.2 Hard Delete

Product Items are hard-deleted.

A Product Item represents a physical item. Deleting it means the physical record itself is considered erroneous or no longer exists in the application.

Dependent records are deleted transactionally:

```text
Product Item
├── Material Usage
│   └── Supply Consumption
└── Status History
    ├── Sold Details
    ├── Repair Details
    └── Reserved Details
```

These dependent records have no independent lifecycle.

Unused entities without historical relationships may also be hard-deleted.

---

# 27. Foreign Key Deletion Behavior

The database should use the following behavior:

| Relationship                           | `ON DELETE` | Reason                                          |
| -------------------------------------- | ----------- | ----------------------------------------------- |
| Materials → Material Types             | `RESTRICT`  | Material has its own lifecycle                  |
| Material Variants → Materials          | `RESTRICT`  | Variant has its own lifecycle                   |
| Supplies → Material Variants           | `RESTRICT`  | Supply is historical                            |
| Supplies → Suppliers                   | `RESTRICT`  | Supply retains supplier history                 |
| Template Materials → Product Templates | `CASCADE`   | Template child has no independent lifecycle     |
| Template Materials → Material Variants | `RESTRICT`  | Existing template definition must not disappear |
| Product Items → Product Templates      | `RESTRICT`  | Template reference is historical                |
| Material Usages → Product Items        | `CASCADE`   | No independent lifecycle                        |
| Material Usages → Material Variants    | `RESTRICT`  | Historical usage reference                      |
| Supply Consumptions → Material Usages  | `CASCADE`   | No independent lifecycle                        |
| Supply Consumptions → Supplies         | `RESTRICT`  | Historical consumption                          |
| Status History → Product Items         | `CASCADE`   | No independent lifecycle                        |
| Sold Details → Status History          | `CASCADE`   | Detail belongs exclusively to status period     |
| Repair Details → Status History        | `CASCADE`   | Detail belongs exclusively to status period     |
| Reserved Details → Status History      | `CASCADE`   | Detail belongs exclusively to status period     |

---

# 28. Timestamps

Persistent entities use:

* `created_at`
* `updated_at`

Technical timestamps are distinct from business dates.

Status history uses:

* `started_at`
* `ended_at`

Sale information uses:

* `sale_date`

There is no separate production date.

The application uses one configured timezone.

Technical timestamps are stored consistently in UTC.

The configured timezone is used for business/UI presentation.

---

# 29. IDs

All entities use SQLite integer IDs.

UUIDs are not required.

---

# 30. Labor Cost Setting

There is one configured hourly labor cost.

Conceptually:

```text
Labor Cost Setting
    ├── hourly rate
    ├── created_at
    └── updated_at
```

The initial hourly rate is:

```text
0
```

No configuration gate is required before creating Product Items.

Changing the labor rate affects Product Items that are not Sold.

Sold Product Items retain the labor rate used in their cost snapshot.

There is no labor-rate history table.

---

# 31. Normalization and Derived Data

The model avoids duplicated source-of-truth data wherever possible.

Examples:

* Supply unit is derived from Material Variant.
* Product Item current status is derived from the open Status History period.
* Supply remaining quantity is derived from Supply quantity minus Supply Consumption.
* Supply unit cost is derived from purchase price and quantity.
* Current Product Item cost is derived from Material Usage, Supply Consumption, Supply cost, labor hours, labor rate, and additional cost while the item is not Sold.
* Product inventory is derived from Product Items.
* Material inventory is derived from Supplies.

Read queries may denormalize these values for API responses or UI presentation.

Intentional historical denormalization exists where necessary to preserve facts that must not change.

The primary example is the Sold Product Item cost snapshot.

---

# 32. Historical Records

The following relationships represent historical facts and therefore must be persisted:

* Product Item → Material Usage
* Material Usage → Supply Consumption
* Product Item → Status History
* Status History → Sold Details
* Status History → Repair Details
* Status History → Reserved Details

Changes to referenced source entities must not erase these historical relationships.

---

# 33. Transactional Operations

The following operations must execute within database transactions:

* Product Item creation with material consumption
* Existing Product Item creation without consumption
* Batch Product Item creation
* Material Usage changes
* Supply Consumption replacement
* Supply quantity corrections
* Product Item status changes
* Sold cost snapshot creation
* Product Item deletion and dependent record deletion

A transaction must contain the complete logical business operation rather than individual database writes.

---

# 34. Validation Responsibility

## Database Constraints

The database should enforce fundamental invariants such as:

* Required fields
* Foreign keys
* Non-negative quantities
* Supply quantity greater than zero
* Template Material quantity greater than zero
* Uniqueness constraints
* One Template Material per `(product_template_id, material_variant_id)`
* One status detail per Status History record
* Valid enum values where practical

## Backend Service / Domain Layer

The backend is responsible for business validation including:

* Pieces must be whole numbers.
* Meters support up to three decimal places.
* Work hours support up to three decimal places.
* Excessive quantity precision is rejected.
* Supply quantity must be greater than zero.
* Product Item Material Usage may be zero but not negative.
* Supply Consumption cannot exceed available Supply quantity.
* Material Usage must correspond to a Material Variant defined by the Product Template.
* Material Variant unit cannot change after historical usage exists.
* Cost-driving Product Item fields cannot be changed while Sold.
* Status transitions must maintain valid status history.
* Exactly one status period may be open.
* Status periods must not overlap.
* Cost snapshots are created when entering Sold.
* Decimal conversion uses scaled integer representation.
* Monetary conversion rounds down to the smaller monetary value.
* All persistence-specific decimal/money conversion occurs in the backend service/domain layer.

---

# 35. Relational Model Overview

```text
material_types
    │
    └──< materials
            │
            └──< material_variants
                    │
                    ├──< supplies >── suppliers
                    │
                    ├──< template_materials >── product_templates
                    │
                    └──< material_usages
                              │
                              └──< supply_consumptions >── supplies


product_templates
    │
    ├──< template_materials
    │
    └──< product_items
              │
              ├──< material_usages
              │
              └──< product_item_status_history
                        │
                        ├── sold_details
                        ├── repair_details
                        └── reserved_details


product_items
    └── historical cost snapshot

labor_cost_setting
    └── current labor rate
```

---

# 36. Final Agreed Table Set

The conceptual model maps to the following relational tables:

```text
material_types
materials
material_variants
suppliers
supplies

product_templates
template_materials
product_items

material_usages
supply_consumptions

product_item_status_history
sold_details
repair_details
reserved_details

labor_cost_setting
```

This is the agreed conceptual relational model before implementing the exact Drizzle schema.

The next modeling/implementation step is to define the exact SQLite column types, constraints, indexes, defaults, and Drizzle definitions.