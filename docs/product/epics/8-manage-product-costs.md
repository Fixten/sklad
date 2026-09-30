# Epic 8 — Manage Product Costs

## Goal

Allow the user to understand Product Item cost and ensure that applicable costs remain consistent with the underlying material and labor data.

## Scope

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

## Enables

This provides the business with the cost information needed to understand the economics of its physical products.
