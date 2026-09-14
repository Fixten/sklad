# Sklad — Product Requirements Document

## 1. Product Overview

Sklad is a small-business management application for a handmade bag business.

The application is used to:

- Track purchased materials and available material stock.
- Maintain reusable product templates.
- Record individual physical product items.
- Track production and material consumption.
- Track product sales and status.
- Calculate product costs from actual material usage and labor.
- Provide a graphical interface for daily business operations.

---

## 2. Working Day

The main working-day flow is:

1. Open the application.
2. Review products currently in stock.
3. Record products that have been sold.
4. Record newly purchased materials.
5. Record newly produced product items.
6. Check product costs.

The application should make these operations accessible without requiring the user to navigate through unrelated configuration or technical functionality.

---

# 3. Manage Materials

Materials are organized into the following hierarchy:

**Material Type → Material → Material Variant → Supply**

A material does not contain its own stock quantity. Stock is represented by its supplies.

## 3.1 Material Types

The user can:

- Create a material type.
- View material types.
- Edit a material type.
- Delete a material type when permitted by existing data relationships.

Examples include fabric and hardware.

## 3.2 Materials

A Material belongs to a Material Type.

The user can:

- Create a material.
- View materials.
- Edit a material.
- Delete a material when permitted by existing data relationships.

A material has its own name and description.

Example:

- Type: Fabric
- Material: Cotton fabric

## 3.3 Material Variants

A Material Variant belongs to a Material.

Variants allow the user to distinguish different versions of the same material, such as different colors.

The user can:

- Create a variant.
- View variants.
- Edit a variant.
- Delete a variant when permitted by existing data relationships.

## 3.4 Supplies

A Supply represents a specific purchase of a material variant.

The user can:

- Create a supply.
- View supplies.
- Edit a supply.
- Correct a supply when an entry was recorded incorrectly.
- Delete a supply when required to correct an erroneous record.

A supply records:

- Description.
- Unit.
- Quantity.
- Purchase price.
- Material variant.
- Supplier, when applicable.

Supported units are:

- Pieces.
- Meters.

The unit is selected when the supply is created.

The application calculates the unit purchase cost from the total purchase price and quantity.

### Stock

Available stock for a material variant is derived from its supplies.

The user must not edit material stock directly. Changes to stock are made by creating or correcting supplies.

---

# 4. Manage Products

Products are divided into:

- **Product Template** — reusable definition of a product.
- **Product Item** — one physical product produced from a template.

A Product Template does not represent physical inventory.

## 4.1 Product Templates

A Product Template defines how a product is made.

The user can:

- Create a product template.
- View product templates.
- Edit product templates.
- Delete product templates when permitted by existing product items.

A product template contains:

- Name.
- Description.
- Production instructions.
- Required materials and quantities.
- Expected production work hours.
- Development work hours.
- Drawing description.

Development hours are tracked separately and are not included in product cost.

## 4.2 Product Items

A Product Item represents one physical product.

Each physical item has its own record and references a Product Template.

The user can:

- Create a product item.
- View product items.
- Edit product items.
- Change its status.
- Record sale information.
- Delete an item only to correct an erroneous record.

A product item contains:

- Product template reference.
- Creation date.
- Notes.
- Modifications.
- Actual production work hours.
- Additional costs.
- Status.
- Sale information, when applicable.

Initial product statuses are:

- In stock.
- Sold.
- Repair.
- Reserved.

## 4.3 Produce Product Items

When creating a product item through normal production:

1. The user selects the product template.
2. The application determines the required materials.
3. The user selects the supplies from which the materials should be consumed.
4. The application consumes the required quantity from the selected supplies.
5. The application calculates the product cost.
6. The product item is created.

When a selected supply does not contain enough material, the application consumes the available amount and continues with the next supply selected by the user.

The user chooses which supplies may be used, but does not manually specify how much to consume from each supply.

If the selected supplies do not contain enough material in total, production cannot be completed.

### Adding Existing Physical Items

The same product-item creation flow must allow the user to record an already-existing physical product without consuming material stock.

This allows physical products that were produced before the application was introduced to be recorded.

## 4.4 Batch Production

The user can create multiple Product Items from the same Product Template in one operation.

Each resulting Product Item remains an independent record.

---

# 5. Inventory

Inventory consists of:

- Material stock derived from Supplies.
- Physical Product Items.

The application should allow the user to quickly see which product items are currently in stock.

A Product Item leaves available stock by changing its status, for example from **In stock** to **Sold**, **Repair**, or **Reserved**.

Product Items are not normally deleted when they leave stock.

---

# 6. Cost Calculation

Product cost is based on the actual supplies consumed when the Product Item is produced.

The material cost is calculated from:

- The supplies used.
- The quantity consumed from each supply.
- The recorded purchase price of each supply.

If multiple supplies are consumed, their costs are combined.

Labor cost is calculated using the configured hourly labor cost and the actual production work hours of the Product Item.

Development hours are tracked separately and are not currently included in product cost.

Additional costs and specific labor costs are recorded separately from material costs.

If a supply record is corrected, product costs depending on that supply are recalculated from the corrected data.

---

# 7. Set Labor Cost

The user can set the hourly labor cost used for product cost calculations.

The configured labor cost is applied to actual production work hours when calculating Product Item cost.