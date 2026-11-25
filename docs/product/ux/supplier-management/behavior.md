# Supplier Management

## Purpose

The user maintains the suppliers referenced by material purchases so their names and contact details stay accurate and reusable.

## User flow

1. From the Materials page, the user opens "Поставщики" in the command palette.
2. The suppliers subpage shows suppliers as cards.
3. The user finds a supplier by searching its name.
4. The user opens a supplier's page to view or edit it. The user can also add, delete, or restore suppliers.
5. The user returns to the list when done.

## Behavior

### List

- A supplier card shows its name, description, link, and contact information. Selecting the card opens its page.
- The search box filters cards by supplier name; it does not create anything.
- The list is not a table; cards are the unit of display and interaction.

### Supplier page and editing

- A supplier page shows its name, description, link, and contact information.
- Editing happens on the supplier's page, not in the list. Cancelling discards changes.
- Name is required. Description, link, and contact information are optional.
- Saving with missing or invalid values shows the problem on the page and does not save.
- Editing a supplier updates the supplier information shown for its supplies without changing those supplies.

### Creating

- "Добавить" creates a supplier with its name and optional details.
- A supplier can be created with only a name.
- Creating a supplier opens its page.

### Deleting

- A delete action is available on the supplier card in the list and on the supplier's page.
- The user confirms in place before deletion; there are no dialogs. Cancelling leaves the supplier unchanged.
- A supplier that no supply references is removed permanently.
- A supplier referenced by supplies is hidden instead. The user is told it was hidden because it is still referenced and can be restored.
- Hiding a supplier does not change existing supplies or their supplier history.

### Hidden suppliers

- A "показать скрытые" toggle reveals hidden supplier cards, marked as hidden.
- Hidden suppliers cannot be edited and cannot be selected for new supplies; their pages offer restore only.
- Restoring makes a supplier available for supplies again.
- Restoring can fail when another active supplier now uses the same name. The page explains that the name is taken and the supplier stays hidden.

## Important cases

- The supplier already exists: the user finds it by name and opens its page to edit it.
- Only contact details changed: the user updates them without affecting supplies.
- A supplier is unreferenced: deleting removes it permanently after confirmation.
- A supplier is referenced by supplies: deleting hides it; restoring brings it back.
- The name of a hidden supplier was reused: restore fails with an explanation.

## Out of scope

- Picking or creating a supplier while recording a supply (covered by supply creation).
- Managing supplies or the material catalog.
- Accounting, customer records, or purchase-payment tracking.
