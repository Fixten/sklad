# Sklad — Product Epics

## Purpose

These epics form the high-level product-development structure for Sklad.

They are intentionally defined at the business-flow level rather than as technical work or CRUD operations. Each epic represents a meaningful product capability and is ordered to establish the dependencies needed by later capabilities.

This document stops at the **epic level**. User stories and technical planning will be defined separately.

## Development Order

The order below is the intended development progression for a small team. It is a dependency-oriented sequence, not a requirement that every epic be completed in isolation before work on the next one begins.

---

## Epic 1 — Manage Material Catalog

### Goal

Allow the user to define and maintain the materials used by the business.

### Scope

The material catalog consists of:

- Material Types
- Materials
- Material Variants

The user can create, view, edit, and delete these entities when permitted by existing data relationships.

Material Variants are the concrete variants used elsewhere in the application. A Material belongs to a Material Type, and a Material Variant belongs to a Material.

### Enables

This epic establishes the material definitions required for:

- Material Supplies
- Product Templates
- Product production

---

## Epic 2 — Manage Material Supplies

### Goal

Allow the user to record purchased material and maintain the material stock derived from those purchases.

### Scope

A Supply represents a physical purchased quantity of a Material Variant.

The user can:

- Record a new Supply.
- View Supplies and their current remaining stock.
- Edit a Supply.
- Correct an incorrectly recorded Supply.
- Delete a Supply when required.
- Associate a Supplier with a Supply.
- See which Product Items used a Supply.

Stock is represented by the remaining quantity of Supplies. The user does not directly edit Material Variant stock.

A Supply uses one unit selected when the Supply is created:

- Pieces
- Meters

A Material Variant uses one unit consistently. Unit conversion is not required.

Editing or deleting a Supply does not change the historical material consumption recorded on Product Items.

### Enables

This epic establishes actual material stock that can later be consumed during product creation.

---

## Epic 3 — Manage Product Templates

### Goal

Allow the user to define reusable product definitions from which physical Product Items can be created.

### Scope

A Product Template contains:

- Name
- Description
- Production instructions
- Required Material Variants and default quantities
- Expected production work hours
- Development work hours
- Drawing description

Each required Material Variant occurs once in a Product Template.

The Product Template references an exact Material Variant. If a product needs a different variant, the user can create/copy a template and change the required variant.

The user can create, view, edit, and delete Product Templates when permitted by existing Product Items.

Changes to a Product Template affect future Product Item creation only. Existing Product Items are not changed by later template edits.

### Enables

This epic establishes reusable product definitions required for creating physical Product Items.

---

## Epic 4 — Configure Labor Cost

### Goal

Allow the user to configure the hourly labor cost used for Product Item cost calculations.

### Scope

The application has one configured hourly labor cost.

The user can view and change this value through application settings.

The configured value is used together with actual production work hours when calculating Product Item cost.

Changes to the configured labor cost affect future Product Items and Product Items that are still in stock. Sold Product Items are not recalculated from later labor-cost changes.

### Enables

This provides the labor-cost input required when creating and calculating Product Items.

---

## Epic 5 — Manage Product Items

### Goal

Allow the user to create and maintain individual physical Product Items.

### Scope

A Product Item represents one physical product and references a Product Template.

Product Items can be created in two ways within the same product flow:

1. **Produce a new Product Item**
   - Select a Product Template.
   - Use the template's material requirements as defaults.
   - Adjust the actual quantity consumed for each required Material Variant when necessary.
   - Select the Supplies from which material should be consumed.
   - The application determines how much to consume from each selected Supply.
   - If a Supply does not contain enough material, the application consumes its remaining amount and continues with the next selected Supply.
   - Production cannot be completed if the selected Supplies do not contain enough material in total.
   - Enter actual production work hours and additional costs.
   - Calculate the Product Item cost.
   - Reduce the remaining stock of the consumed Supplies.
   - Create the Product Item.

2. **Record an existing physical Product Item**
   - Use the same Product Item creation flow and product information.
   - Determine its cost from the selected Supplies and entered labor/additional cost information.
   - Do not consume or reduce Supply stock.

The flow also supports batch creation of multiple Product Items from the same Product Template. Supplies are selected for the batch, while each resulting Product Item remains an independent record.

The user can edit Product Item information after creation. Product Item deletion is intended for correcting erroneous records.

### Enables

This epic establishes the physical Product Items that form product inventory and later participate in status changes and sales.

---

## Epic 6 — Manage Product Inventory

### Goal

Allow the user to quickly understand and access the physical products currently available in stock.

### Scope

The main inventory view presents products grouped by Product Template, showing how many Product Items are currently in stock.

The user can access the individual Product Items belonging to a product grouping.

A Product Item is considered available in product inventory when its status is `In stock`.

Material inventory is handled separately through the Material Supplies experience.

### Enables

This provides the main operational view of available finished products and the entry point for managing individual Product Items.

---

## Epic 7 — Manage Product Status

### Goal

Allow the user to manage the lifecycle state of individual Product Items.

### Scope

A Product Item can have one of the following statuses:

- In stock
- Sold
- Repair
- Reserved

All status transitions are possible.

Each non-default state can contain state-specific information:

- **Sold** — sale information.
- **Repair** — free-text notes.
- **Reserved** — free-text notes.

Recording a sale is part of this epic. When changing a Product Item to `Sold`, the user records:

- Sale date
- Sale price
- Customer
- Sales channel / place
- Optional notes

The customer and sales-channel values remain flexible/free-text information rather than separate business entities.

A Product Item can subsequently be returned to `In stock`. Previous state information, including sale information, is retained at the data level, while the UI makes clear that the Product Item is no longer in that state.

Changing a Product Item's status determines whether it is currently included in product inventory.

### Enables

This provides the operational lifecycle for physical products, including sales, reservations, repairs, and returns.

---

## Epic 8 — Manage Product Costs

### Goal

Allow the user to understand Product Item cost and ensure that applicable costs remain consistent with the underlying material and labor data.

### Scope

Product Item cost is based on:

- Actual material quantities consumed from Supplies.
- The purchase cost of the Supplies from which the material was consumed.
- Actual production work hours multiplied by the configured hourly labor cost.
- Additional costs recorded on the Product Item.

Development work hours are tracked separately and are not included in Product Item cost.

Material cost can combine consumption from multiple Supplies.

Cost is recalculated automatically when relevant underlying values change.

Changes to Supply data affect the cost of Product Items that depend on that Supply, subject to the product's status. Changes to the configured labor cost likewise affect applicable Product Items.

Sold Product Items retain their historical cost and are not recalculated from later Supply or labor-cost changes.

Product costs are visible both on individual Product Item views and in product inventory.

### Enables

This provides the business with the cost information needed to understand the economics of its physical products.

---

## Epic Dependency Spine

The intended progression is:

1. **Manage Material Catalog**
2. **Manage Material Supplies**
3. **Manage Product Templates**
4. **Configure Labor Cost**
5. **Manage Product Items**
6. **Manage Product Inventory**
7. **Manage Product Status**
8. **Manage Product Costs**

The central dependency chain is:

**Material Catalog → Material Supplies → Product Items**

and:

**Material Catalog → Product Templates → Product Items**

with:

**Labor Cost → Product Item Cost**

and:

**Product Items → Product Inventory → Product Status / Sales**
