# Epic 7 — Manage Product Status

## Goal

Allow the user to manage the lifecycle state of individual Product Items.

## Scope

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

## Enables

This provides the operational lifecycle for physical products, including sales, reservations, repairs, and returns.
