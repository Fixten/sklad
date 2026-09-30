# Manage Products

Products are divided into:

- **Product Template** — reusable definition of a product.
- **Product Item** — one physical product based on a Product Template.

A Product Template does not represent physical inventory.

## Product Templates

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

## Product Items

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

## Creating Product Items

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

## Batch Production

The user can create multiple Product Items from the same Product Template in one operation.

Supplies are selected for the whole batch. Each resulting Product Item is an independent record and can be edited individually afterward.
