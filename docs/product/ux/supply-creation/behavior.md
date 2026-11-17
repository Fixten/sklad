# Supply Creation

## Purpose

The user records a purchase of a material so that its quantity becomes available stock for production.

## User flow

1. The user starts "Сделать поставку" from one of:
   - the Materials page command palette — the form opens blank;
   - a Material Variant card's supply action — Type, Material, Variant, and unit are filled from that variant;
   - a Supplier card's supply action — the supplier is filled from that supplier.
2. The supply form opens.
3. The user sets the Material Variant being purchased:
   - The user can search across the whole catalog, or choose the Type, Material, and Variant fields in order.
   - Only existing catalog entries can be chosen. The form does not create any.
4. The user enters the quantity and the total purchase price for that quantity.
5. Optionally, the user adds or changes a supplier, a description, and a link.
6. The user saves the supply.
7. A confirmation toast appears, the user returns to the Materials page, and the selected Material Variant's stock increases by the entered quantity.

## Behavior

- The Material Variant is required.
- Type, Material, Variant, and Supplier are chosen from existing records only. The form never creates catalog entities or suppliers.
- The overall search finds existing variants and fills the Type, Material, and Variant fields. It cannot create anything.
- Prefilled values can still be changed before saving.
- The unit is shown from the selected Material Variant. The user does not choose a unit.
- Quantity must be greater than zero. Pieces are whole numbers; meters allow up to three decimal places.
- Purchase price is the total for the entered quantity. It may be zero but not negative. The unit purchase cost is calculated from it.
- Supplier, description, and link are optional.
- Saving with missing or invalid values shows the problem and does not create the supply.
- After a successful save, the form closes and the user is on the Materials page.

## Important cases

- The exact Material Variant is known and exists: the user starts from its card and only fills the purchase details.
- The variant exists but the user is not sure which one: the user starts from the command palette and searches.
- The variant does not exist: the user creates it in the material catalog, then uses its card's supply action. The supply form does not offer to create it.
- The Material or Type does not exist: the user creates it in the catalog, then its Variant, then starts the supply from that card.
- The supplier does not exist: the user creates it in supplier management, or saves the supply without a supplier. The supply form does not offer to create one.
- The search finds nothing: the form shows no options; the user tries another search or leaves. It does not suggest creating anything.
- The user leaves the form to create a missing entity: the entered values are discarded after a warning.
- Optional fields are left empty: the supply is still created.

## Out of scope

- Viewing, editing, correcting, or deleting supplies.
- Managing the material catalog (Types, Materials, Variants), including creating them.
- Managing suppliers, including creating them.
- Stock levels and their correction.
