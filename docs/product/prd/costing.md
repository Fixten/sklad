# Cost Calculation

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

## Set Labor Cost

The application has one configured hourly labor cost.

The user can view and change the hourly labor cost in application settings.

The configured labor cost is used for Product Item cost calculations based on actual production work hours.
