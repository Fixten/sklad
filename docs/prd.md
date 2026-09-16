# Sklad — Product Requirements Document

## 1. Product Overview

Sklad is a small-business management application for managing materials, products, production, inventory, and sales.

The application is used to:

- Track purchased materials and available material stock.
- Maintain reusable product templates.
- Record individual physical product items.
- Track production and material consumption.
- Track product status and sales.
- Calculate product costs from actual material usage, labor, and additional costs.
- Provide a graphical interface for daily business operations.

The initial application is for a single business. Authentication, roles, payments, accounting, reporting, import/export, and notifications are outside the current scope.

---

## 2. Working Day

The main working-day flow is:

1. Open the application.
2. Review products currently in stock.
3. Record products that have been sold.
4. Record newly purchased materials.
5. Record newly produced or existing physical product items.
6. Check product costs.

These operations should be accessible without requiring the user to navigate through unrelated configuration or technical functionality.

The application is a web application and should be usable on mobile devices.

---

# 3. Manage Materials

Materials are organized into the following hierarchy:

**Material Type → Material → Material Variant → Supply**

A Material Variant represents one specific version of a Material. A Supply represents a purchased quantity of a Material Variant.

Stock is represented by Supplies; Material Types, Materials, and Material Variants do not have independent stock quantities.

## 3.1 Material Types

The user can create, view, edit, and delete Material Types when permitted by existing data relationships.

## 3.2 Materials

A Material belongs to a Material Type.

A Material has a name and description.

The user can create, view, edit, and delete Materials when permitted by existing data relationships.

## 3.3 Material Variants

A Material Variant belongs to a Material and distinguishes a specific version of that Material, such as a color.

The user can create, view, edit, and delete Material Variants when permitted by existing data relationships.

## 3.4 Supplies

A Supply represents a specific purchase of a Material Variant.

A Supply contains:

- Description.
- Unit.
- Quantity.
- Purchase price.
- Material Variant.
- Supplier.
- Supply URL, when applicable.

Supplier is a separate managed entity. The supplier information associated with a Supply is not required to be a separate customer or accounting record.

Supported units are:

- Pieces.
- Meters.

A Material Variant uses one unit consistently. Unit conversion is not required.

The unit is selected when a Supply is created. The application calculates the unit purchase cost from the purchase price and quantity.

The user can create, view, edit, correct, and delete Supplies, including Supplies that have already been consumed by Product Items.

Correcting or deleting a Supply does not change the historical quantity consumed by Product Items. Product Items that used a deleted Supply remain unaffected.

### Stock

Available stock for a Material Variant is the sum of the remaining quantities of its Supplies.

The user must not edit Material stock directly. Stock changes through new, edited, or corrected Supply quantities and through material consumption during Product Item production.

---

# 4. Manage Products

Products are divided into:

- **Product Template** — reusable definition of a product.
- **Product Item** — one physical product based on a Product Template.

A Product Template does not represent physical inventory.

## 4.1 Product Templates

A Product Template defines how a product is made.

A Product Template contains:

- Name.
- Description.
- Production instructions.
- Drawing description.
- Required Material Variants and default quantities.
- Expected production work hours.
- Development work hours.

Each required Material Variant occurs once in a Product Template and references a specific variant. Different variants of an otherwise similar product can be represented by separate Product Templates.

Development work hours are tracked separately and are not included in Product Item cost.

The user can create, view, edit, and delete Product Templates when permitted by existing Product Items.

Changes to a Product Template affect future Product Items only. Existing Product Items are not changed by later template edits.

## 4.2 Product Items

A Product Item represents one physical product and references a Product Template.

A Product Item contains:

- Product Template reference.
- Creation date.
- Notes.
- Modifications.
- Actual material quantities consumed.
- Actual production work hours.
- Additional costs.
- Status.
- Sale information, when applicable.

The user can create, view, edit, and change the status of Product Items. Deletion is intended only for correcting erroneous records.

## 4.3 Creating Product Items

A Product Item can be created as either a newly produced physical product or an existing physical product that was created before it was recorded in Sklad.

For a newly produced Product Item:

1. The user selects a Product Template.
2. The template's required Material Variants and default quantities are loaded.
3. The user can adjust the actual quantity consumed for each required Material Variant.
4. The user selects the Supplies from which the material should be consumed.
5. The user enters actual production work hours and additional costs.
6. The application consumes the required quantities from the selected Supplies and calculates the Product Item cost.
7. The Product Item is created and the remaining quantities of the consumed Supplies are reduced.

The user selects which Supplies may be used but does not manually allocate quantities to individual Supplies. If a selected Supply does not contain enough material, the application consumes its remaining quantity and continues with the next selected Supply. If the selected Supplies do not contain enough material in total, the Product Item cannot be created.

For an existing physical Product Item, the same creation flow is used, including material and labor information, but Supply stock is not consumed.

The user can edit Product Item information after creation, including its material consumption and other cost inputs.

## 4.4 Batch Production

The user can create multiple Product Items from the same Product Template in one operation.

Supplies are selected for the whole batch. Each resulting Product Item is an independent record and can be edited individually afterward.

---

# 5. Inventory

Inventory consists of:

- Material stock derived from Supplies.
- Physical Product Items.

The main inventory view is focused on finished products and groups Product Items by Product Template, showing how many are currently in stock.

Material inventory is managed separately through Supplies.

A Product Item is available in product inventory when its status is **In stock**. Changing its status to **Sold**, **Repair**, or **Reserved** removes it from available product inventory.

Product Items are not normally deleted when they leave stock.

---

# 6. Product Status and Sales

A Product Item can have one of the following statuses:

- In stock.
- Sold.
- Repair.
- Reserved.

All status transitions are possible.

Each status other than **In stock** can have status-specific information:

- **Sold** — sale information.
- **Repair** — free-text notes.
- **Reserved** — free-text notes.

When a Product Item is changed to **Sold**, the user records:

- **Sale date** — the date on which the product was sold.
- **Sale price** — the amount for which the product was sold.
- **Customer** — free-text information identifying or describing the customer.
- **Sales channel / place** — where or through which channel the product was sold.
- **Notes** — optional additional information.

Customer and sales-channel information remains flexible free-text information; they are not separate business entities.

A Product Item can later be returned to **In stock**. Previous status information, including sale information, is retained, but it is no longer treated as the Product Item's current state information. The UI should make this distinction clear.

---

# 7. Cost Calculation

Product Item cost is based on the data recorded for that individual Product Item.

Material cost is calculated from the actual quantities consumed from Supplies and the purchase cost of those Supplies. Consumption from multiple Supplies is combined.

Labor cost is calculated as:

**actual production work hours × configured hourly labor cost**

Additional costs are arbitrary additional monetary costs recorded on the Product Item and are included separately from material and labor costs.

Development work hours are not included in Product Item cost.

Cost is recalculated automatically when relevant Supply or labor-cost data changes.

Changes to Supply data affect Product Items that depend on that Supply only while those Product Items are not sold. Changes to the configured labor cost likewise affect future Product Items and Product Items that are still in stock. Sold Product Items retain their historical cost.

Product cost is visible on individual Product Item views and in product inventory.

---

# 8. Set Labor Cost

The application has one configured hourly labor cost.

The user can view and change the hourly labor cost in application settings.

The configured labor cost is used for Product Item cost calculations based on actual production work hours.
