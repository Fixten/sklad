# Material Catalog Management

## Purpose

The user maintains the material catalog — Material Types, Materials, and Material Variants — after it has grown. These entities are normally created inline during supply creation; this page is the utility for finding, fixing, renaming, reassigning, deleting, and restoring them. It is a secondary flow, not the product's main path.

## User flow

1. The Materials page itself is the catalog. It opens directly as a list of cards, with the command palette kept at the top of the page.
2. By default the cards are Material Variants.
3. The user finds the card to fix using the search box, which matches the names of the card's entity and of its parents (for variants: variant, material, and type names).
4. The user edits a card in place, deletes it, or restores it if hidden.
5. Changes apply immediately from the card; there are no dialogs. The user leaves the page when done.

## Behavior

### List

- A level switcher chooses what the cards represent: Варианты (default), Материалы, Типы.
- A Variant card shows the variant's name, its unit, and its Material and Type as context.
- A Material card shows the name, description, and its Type.
- A Type card shows the name and description.
- The search box filters cards by any of the names shown on them; it does not create anything.
- The list is not a table; cards are the unit of display and interaction.

### Inline card editing

- An edit action on a card switches only that card into edit mode; the rest of the list stays readable. "Готово" saves and returns the card to view mode; "Отмена" discards changes without saving.
- Editing a Variant card changes: name, unit, and the Material it belongs to.
- Editing a Material card changes: name, description, and the Type it belongs to.
- Editing a Type card changes: name and description.
- The unit of a Variant is shown read-only once the variant has supplies or production usage; until then it can be changed. When locked, the card indicates the unit cannot change.
- Saving with missing or invalid values shows the problem inside the card and does not save.

### Creating

- "Добавить" places a new card in edit mode at the top of the list, following the same inline pattern.
- Creating a Variant requires a name, a unit, and a Material; creating a Material requires a name and a Type; creating a Type requires a name.
- Description is optional for Types and Materials.
- Cancelling a new card removes it; nothing is created.

### Deleting

- A delete action is available on a card in view mode, without entering edit mode.
- The first delete press asks for confirmation inside the card; confirming performs the deletion, cancelling returns the card to normal.
- Deleting an entity that nothing references removes it permanently.
- Deleting an entity that other records still reference hides it instead. The user is told it was hidden because it is still referenced, and that it can be restored.

### Hidden entities

- A "показать скрытые" toggle reveals hidden cards, marked as hidden.
- Hidden cards cannot be edited.
- A hidden card offers a restore action. Restoring makes it a normal card again.
- Restoring can fail when another active entity now uses the same name (hidden entities release their name). The card shows that the name is taken and the entity stays hidden.
- A hidden parent does not prevent a child from being visible, and restoring a child does not restore its parent; each entity is restored separately.

## Important cases

- The exact entity is known: the user searches and edits the card in place.
- An entity is in the wrong place: the user reassigns it — a Variant to another Material, a Material to another Type — without deleting anything.
- The entity is no longer needed and unreferenced: the user deletes it permanently after inline confirmation.
- The entity is referenced by supplies, production, or templates: deletion hides it; restore brings it back.
- The name of a hidden entity was reused while it was hidden: restore fails with an inline explanation; the user must rename the active entity or pick a different outcome.
- A variant has historical usage: its unit is locked; changing it requires creating a different variant.
- The catalog is empty: the page shows an empty state with "Добавить" as the way to create the first Type.
- Optional fields are left empty: Type and Material descriptions may stay empty.

## Out of scope

- Creating supplies and inline catalog creation during supply creation (covered by supply creation).
- Stock levels and any stock display on the catalog cards.
- Suppliers and their management.
- Product Templates.
- Viewing consumption or usage history of an entity.
