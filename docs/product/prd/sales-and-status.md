# Product Status and Sales

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
