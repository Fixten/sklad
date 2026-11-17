# Material Catalog Management

## Purpose

The user maintains the material catalog — Material Types, Materials, and Material Variants — and starts supplies from a Variant. The catalog is organized around Materials: a Variant is reached through its Material. Catalog entities are created here, not during supply creation.

## User flow

1. The Materials page is the catalog. Its main list is Materials.
2. The level switcher also offers Variants and Types.
3. The user finds the Material with the search box, which matches Material, Type, and Variant names.
4. The user opens the Material's page. It lists the Material's Variants with their stock and last supply date.
5. The user finds the needed Variant and chooses "Сделать поставку"; supply creation opens with that Variant filled.
6. The user can add, edit, delete, and restore entities from the list and their pages.
7. The user returns to the list when done.

## Behavior

### List

- A card opens its page when selected.
- The Materials list is the default.
- A Material card shows the name, description, its Type, and its Variants: how many and their names.
- A Type card shows the name, description, and its Materials: how many and their names.
- A Variant card shows the name, its Material and Type, its available stock with unit, and the date of its last supply.
- A Variant with no supplies shows zero stock and no last supply date.
- When a card has many children, it summarizes them rather than listing every name.
- Child information shows active children only.
- The search box filters the cards of the current level by the card's own name, its parents' names, and its children's names. Children that a card only summarizes still match. It does not create anything.
- The list is not a table; cards are the unit of display and interaction.

### Card pages

- A page shows the entity's name and description, its parent as context, and its children.
- A Material page lists its Variants and is where the user finds a Variant to supply.
- A Variant card offers "Сделать поставку", which starts supply creation with the Variant filled. It is available both in the Variants list and on the Material page.
- A Variant page lists its supplies and also offers "Сделать поставку".
- A Material page shows its Type; a Variant page shows its Material and Type.

### Creating

- Each list level offers an add action for that level: "Добавить материал" on Materials, "Добавить вариант" on Variants, "Добавить тип" on Types.
- Creating from a list asks for the parent as well: a Material needs a Type; a Variant needs a Material and a unit. A Type needs only its own fields.
- Creating from a parent's page prefills the parent: "Добавить материал" on a Type page, "Добавить вариант" on a Material page.
- A Type needs a name; a Material needs a name; a Variant needs a name and a unit. Description is optional for Types and Materials.
- A Material needs an existing Type; when there is none, the user adds a Type first.
- Creating an entity opens its page.

### Editing

- Editing happens on the card's page, not in the list.
- Editing a Type changes: name and description.
- Editing a Material changes: name, description, and the Type it belongs to.
- Editing a Variant changes: name, unit, and the Material it belongs to.
- A Variant's unit is read-only once the variant has supplies or production usage; the page indicates that the unit cannot change.
- Saving with missing or invalid values shows the problem on the page and does not save. Cancelling discards changes.

### Deleting

- A delete action is available on the card in the list and on the card's page.
- The user confirms before the deletion happens.
- Deleting an entity that nothing references removes it permanently.
- Deleting an entity that other records still reference hides it instead. The user is told it was hidden because it is still referenced, and that it can be restored.

### Hidden entities

- A "показать скрытые" toggle reveals hidden cards in the list, marked as hidden.
- A hidden card offers restore in the list; its page offers rename and restore only. It cannot be given new children.
- Restoring makes it a normal entity again.
- Restoring never fails on a name: a hidden entity's name stays reserved, so no active entity can hold it.
- A hidden parent does not prevent a child from being visible, and restoring a child does not restore its parent; each entity is restored separately.
- A hidden parent is still shown by name as context on its child's page. Hidden children are not included in a card's child information.

## Important cases

- The user needs a supply: find the Material, open it, find the Variant, and choose "Сделать поставку".
- The user knows the Variant name but not the Material: searching the Materials list by the Variant name finds the Material.
- The user adds a Material without leaving the list: the add action asks for the Type.
- The catalog has no Type yet: the user adds a Type first, then a Material.
- The catalog is empty: the Materials list shows an empty state; the user adds a Type, then a Material.
- The user needs a supply and the catalog is incomplete: add a Type, add its Material, open it, add a Variant, then "Сделать поставку".
- An entity is in the wrong place: the user reassigns it from its page — a Variant to another Material, a Material to another Type — without deleting anything.
- The entity is no longer needed and unreferenced: the user deletes it from the list or its page, after confirming.
- The entity is referenced by supplies, production, or templates: deletion hides it; restore brings it back.
- Creating an entity whose name is held by a hidden entity is rejected with a message that points at the hidden entity; the user restores it (via the hidden toggle) or renames it and creates the new entity.
- A variant has historical usage: its unit is locked; changing it requires creating a different variant.
- A Variant has no supplies: its card shows zero stock and no last supply date; "Сделать поставку" is the way to add one.
- A card has many children: it shows a summary rather than every name.
- Optional fields are left empty: Type and Material descriptions may stay empty.

## Out of scope

- Creating, editing, correcting, or deleting Supplies; stock correction. Starting supply creation is covered by supply creation.
- Supplier management.
- Product Templates.
- Viewing material consumption or usage history.
- Stock display beyond a Variant's total and last supply date.
