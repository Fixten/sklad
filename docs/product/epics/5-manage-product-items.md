# Epic 5 — Manage Product Items

## Goal

Allow the user to create and maintain individual physical Product Items.

## Scope

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

## Enables

This epic establishes the physical Product Items that form product inventory and later participate in status changes and sales.
