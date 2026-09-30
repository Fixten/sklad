# Epic 2 — Manage Material Supplies

## Goal

Allow the user to record purchased material and maintain the material stock derived from those purchases.

## Scope

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

## Enables

This epic establishes actual material stock that can later be consumed during product creation.
