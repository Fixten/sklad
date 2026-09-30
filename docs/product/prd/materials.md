# Manage Materials

Materials are organized into the following hierarchy:

**Material Type → Material → Material Variant → Supply**

A Material Variant represents one specific version of a Material. A Supply represents a purchased quantity of a Material Variant.

Stock is represented by Supplies; Material Types, Materials, and Material Variants do not have independent stock quantities.

## Material Types

The user can create, view, edit, and delete Material Types when permitted by existing data relationships.

## Materials

A Material belongs to a Material Type.

A Material has a name and description.

The user can create, view, edit, and delete Materials when permitted by existing data relationships.

## Material Variants

A Material Variant belongs to a Material and distinguishes a specific version of that Material, such as a color.

The user can create, view, edit, and delete Material Variants when permitted by existing data relationships.

## Supplies

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

## Stock

Available stock for a Material Variant is the sum of the remaining quantities of its Supplies.

The user must not edit Material stock directly. Stock changes through new, edited, or corrected Supply quantities and through material consumption during Product Item production.
