# Supply Creation

## Purpose

The user records a purchase of a material so that its quantity becomes available stock for production.

## User flow

1. From the Materials page, the user starts "Сделать поставку" in the command palette.
2. The new supply form opens.
3. The user finds the Material Variant being purchased:
   - The user can search across the whole catalog, or fill the Type, Material, and Variant fields directly.
   - Each of these three fields accepts an existing value (searchable) or a new one.
   - The overall search only finds existing matches and fills the three fields; it cannot create anything.
4. The user enters the quantity and the total purchase price for that quantity.
5. Optionally, the user adds a supplier, a description, and a link.
6. The user saves the supply.
7. A confirmation toast appears, the user returns to the Materials page, and the selected Material Variant's stock increases by the entered quantity.

## Behavior

- The Material Variant is required.
- The unit is shown from the selected Material Variant. The user does not choose a unit for an existing variant.
- Entering a new Material Variant requires the user to set its unit.
- Quantity must be greater than zero. Pieces are whole numbers; meters allow up to three decimal places.
- Purchase price is the total for the entered quantity. It may be zero but not negative. The unit purchase cost is calculated from it.
- Supplier, description, and link are optional.
- The supplier field accepts an existing supplier (searchable) or a new name. A new supplier is created with just a name.
- Entering a new catalog value or supplier does not lose data already entered. The new entry is created together with the supply when the user saves.
- Saving with missing or invalid values shows the problem and does not create the supply.
- After a successful save, the form closes and the user is back on the Materials page.

## Important cases

- The exact Material Variant exists: the user finds it through the overall search or the Type, Material, and Variant fields.
- The Material exists, but the Variant does not: the user enters a new Variant name and sets its unit.
- The Material does not exist: the user enters a new Material name, and a new Type name if needed.
- The user does not know the exact name: the user searches across the catalog.
- Optional fields are left empty: the supply is still created.

## Out of scope

- Viewing, editing, correcting, or deleting supplies.
- Managing the material catalog outside the inline creation needed for the supply.
- Managing suppliers outside picking or creating one for the supply.
- Stock levels and their correction.
