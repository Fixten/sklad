# Supply Management

## Purpose

The user reviews recorded material purchases, checks what remains available, and fixes or removes supplies that were recorded incorrectly.

## User flow

1. From the Materials page, the user opens "Поставки" in the command palette to see all supplies. A Material Variant page also links directly to the supplies of that variant.
2. The supplies page shows each recorded supply as a detailed card. When opened for a variant, it shows only that variant's supplies and its remaining stock.
3. The user finds a supply by searching its description, supplier, or Material Variant, Material, and Type names. When viewing one variant, the user can return to all supplies.
4. The user opens a supply's page to view or edit it. The user can also delete a supply or restore it if hidden.
5. To record another purchase, the user starts "Сделать поставку". When viewing one variant, that variant is already selected in the creation flow.

## Behavior

### List

- A supply card shows the Material Variant and its Material and Type, supplied quantity, remaining quantity, unit, unit purchase cost, supplier name, description, link, and recording date. Selecting the card opens its page.
- Quantity and remaining quantity are shown in the Material Variant's unit.
- A variant with no supplies has zero stock.
- Searching only filters existing supplies; it does not create anything.
- When no supplies match, the page shows an empty result rather than creating a supply.
- The list is not a table; cards are the unit of display and interaction.

### Supply page and editing

- A supply page shows its full details and its Material Variant, Material, and Type as context.
- Editing happens on the supply's page, not in the list. Cancelling discards changes.
- The user can change quantity, total purchase price, supplier, description, link, and Material Variant.
- Quantity must be greater than zero. Pieces are whole numbers; meters allow up to three decimal places.
- Purchase price is the total for the supplied quantity. It may be zero but not negative. The unit purchase cost is calculated from quantity and price.
- The unit comes from the selected Material Variant and cannot be edited on the supply.
- Quantity cannot be reduced below the amount already consumed. An invalid correction explains the problem on the page and is not saved.
- Changing the Material Variant keeps the user on the supply's page and clearly states that it was moved to the new variant. On the next reload of the supplies, it appears only in the new variant's supplies.

### Creating

- "Сделать поставку" opens the existing supply creation flow.
- When started from a single variant's supplies, that variant is preselected and can be changed in the creation flow.

### Deleting

- A delete action is available on the supply card in the list and on the supply's page.
- The user confirms in place before deletion; there are no dialogs. Cancelling leaves the supply unchanged.
- A supply with no historical references is removed permanently.
- A supply that is still referenced is hidden instead. The user is told it was hidden because it is still referenced and can be restored.
- Deleting a supply does not change historical material consumption.

### Hidden supplies

- A "показать скрытые" toggle reveals hidden supply cards, marked as hidden.
- Hidden supplies cannot be edited; their pages offer restore only.
- Restoring makes a supply active again and returns its remaining quantity to stock.
- If restoring fails, the page explains the problem and the supply stays hidden.

## Important cases

- The user needs the purchase history of one variant: they follow the supplies link from its Variant page.
- The user needs a purchase but does not remember its variant: they search all supplies.
- A quantity or price was recorded incorrectly: the user corrects it on the supply's page.
- A supply was recorded against the wrong variant: the user changes its variant and sees where it was moved.
- A correction would invalidate recorded consumption: it is rejected with an explanation.
- A supply is no longer needed and unreferenced: it is deleted permanently after confirmation.
- A referenced supply is deleted: it is hidden and can be restored later.
- A variant has no supplies: its supplies view is empty and offers to create the first supply.

## Out of scope

- The detailed supply creation flow (covered by supply creation).
- Managing the material catalog.
- Managing suppliers themselves (covered by supplier management).
- Viewing consumption or usage history.
- Editing stock directly; stock changes only through supplies and consumption.
