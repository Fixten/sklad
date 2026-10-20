# UX Design: Material Management

Scope: Epic 1 (material catalog) and Epic 2 (material supplies). Product templates,
production and sales are out of scope here.

## 1. User Goals & Tasks

### Primary: Record a purchase
- Find the material variant the purchase belongs to.
- Enter what was bought and for how much.
- Create the material if the catalog does not have it yet.

### Secondary: See what exists and how much is left
- Scan materials and their stock.
- Open a material to see its variants and the supplies behind the stock.
- Check the unit purchase cost of a batch.

### Tertiary: Correct a mistake
- Locate the supply, fix quantity, price or supplier.
- Remove a supply that should not exist.

### Maintenance: Keep definitions right
- Add, rename, hide and restore materials, variants and types.
- Rename or archive a type.

---

## 2. Approved Workflows

### Surface
One page, top to bottom:

1. Page title «Материалы».
2. The actions palette — one line at rest (`Поиск и действия`, `/` hint).
3. Materials as cards. A card is the material: type as an eyebrow label, name,
   stock on the right, variant count under it.
4. A quiet «Скрытые · n» row at the bottom, only when something is hidden.

There is no table, no column header, no second search field, no primary button,
no catalog page and no per-entity CRUD pages.

### Workflow: Actions palette
**Starting context**: the page, keyboard or pointer.
**Intent**: start something without first finding a row.

1. Closed at rest — one line; no list, no heading.
2. Focus, a click, or `/` opens an absolute overlay under the line; the page does
   not move and is dimmed behind the overlay.
3. Two groups, in this order:
   - `Действия` — «Записать приход», «Новый материал», «Типы материалов»,
     plus «Скрытые записи» when something is hidden.
   - `Материалы` — every visible material, each with type, variant count (or the
     matching variant names) and stock.
4. Typing filters both groups in one pass. A material matches on its name, its type
   or any of its variants.
5. Selecting an action opens its sheet. Selecting a material closes the palette,
   expands that material's card, expands the variants that matched the query, scrolls
   to it and puts focus on the card.
6. Escape, an outside press, or a selection closes the palette and clears the query.

### Workflow: Record a supply
**Starting context**: palette → «Записать приход», or a variant → «Приход».
**Intent**: add a purchased quantity.

1. **Material** (skipped when the variant is known): a search field. The list appears
   on the first keystroke, showing variant, type › material and current stock.
2. **New material** — the last result is always `Новый материал: «X»`. It opens an
   inline panel: type (existing or a new name), material, variant, unit. Creating
   returns to the same sheet with the variant selected.
3. **Details**: quantity (hint «в штуках / в метрах» from the variant), total purchase
   price, supplier with suggestions from past suppliers; the unit purchase cost is
   calculated live. Note or URL sits behind «Заметка или ссылка».
4. **Save** — the card's stock and the variant's supplies update in place, the sheet
   closes with a toast. No navigation, no page reload.

Both steps live in one sheet. «Назад» returns to the material step without losing the
query; the step is skipped entirely when the variant is already known.

### Workflow: Verify stock
**Starting context**: the card list.
**Intent**: know whether there is enough material.

1. Scan cards; stock is shown when all variants of a material share a unit, otherwise
   only the variant count is shown (a sum across units is meaningless).
2. Open a material — variants with their stock and unit.
3. Open a variant — its supplies: supplier, note, quantity, unit purchase cost.
4. Stock is never edited directly; it is the sum of the supplies.

### Workflow: Correct a supply
**Starting context**: variant → supplies.
**Intent**: fix a wrong batch.

1. Selecting a supply opens the same sheet, prefilled, at the details step.
2. Saving recalculates the variant stock and the material total.
3. «Удалить приход» sits in the sheet's footer behind a confirmation; the quantity
   already consumed by product items does not change.

### Workflow: Maintain definitions
- Material: card → «Изменить» (name, type). Type can be an existing one or a new name
  when the catalog has no types yet.
- Variant: card → variant → «Изменить» (name, unit). The unit is locked once the
  variant has supplies — changing it would silently reinterpret the stock.
- Add: «Вариант» on a material card, «Новый материал» in the palette.
- Types: palette → «Типы материалов» — list with material counts, rename in place,
  hide, restore, and one field to add a new type. Types have no page of their own.

### Workflow: Hide, delete, restore
- A material with variants is hidden, not deleted; a material without variants is
  deleted for real.
- A variant with supplies is hidden; without supplies it is deleted.
- A hidden type stays attached to its materials and is no longer offered in picks.
- Hidden materials and variants are collected under «Скрытые · n» at the bottom of the
  page; «Вернуть» restores them in place. A type is restored in the types sheet.
- Hiding never touches supply history or recorded consumption.

### Empty states
- No materials: a short explanation plus «Приход» and «Новый материал».
- Everything hidden: the empty state points at «Скрытые».
- No palette results: «Ничего не нашлось» inside the overlay.
- No variant matches in the supply sheet: only the «Новый материал» result remains.
- A material without variants: the card says «нет вариантов»; the only creation action
  inside is «Вариант».

---

## 3. Interaction Model

- Record a supply — palette or variant → search → details → save: one sheet, two steps.
- Find anything — palette: focus, click or `/`, type, select.
- Verify stock — cards → material → variant → supplies.
- Correct a supply — supply row → the same sheet, prefilled.
- Maintain — inline row actions inside the expanded card; types through the palette.
- Hide/restore — confirmation for defined data, «Скрытые» for restore.

---

## 4. Constraints & Decisions

- **No tables.** Cards and rows without columns, column headers or a grid; the
  material is the unit of the list, not a record in a report.
- **The material is the list.** Type is a property shown as an eyebrow; variants and
  supplies live inside the material. Types do not get a level of navigation.
- **One entry, not four.** The palette is the only way to start an action; the page
  has no primary button and no separate search.
- **The palette needs richer items.** The shipped `CommandPalette` renders a label and
  an action only, and caps the line at `md:w-[28rem]`. This design needs two-line items
  with a trailing value (name / type · count / stock), a line that spans the content
  column at every breakpoint, and a dimmed page while the overlay is open.
- **No CRUD pages, no catalog surface.** Every write is a sheet or an inline form.
- **The unit belongs to the variant** and is locked while supplies exist.
- **Stock is derived** from supplies; there is no stock field to edit.
- **Hide vs delete** is decided by references, never by asking the user to choose.
- **Suppliers stay free text** with suggestions from past supplies; no supplier entity.

---

## 5. Prototype

- File: `prototype.html` — disposable, mocked data, not production code. It is the
  second iteration: `materials.html` is the earlier artifact, kept only for history.
- Status: approved by the user; ready to drive implementation.
- Visual world: `frontend/DESIGN.md` (Forest & Hide, dark, sharp corners, Russian copy)
  inside the shipped shell (`App.layout` header, one `max-w-4xl` column).
- Footer toggle (prototype-only): данные / пусто — validates the empty state.
- Validation walkthrough:
  1. `/` → palette: groups, filter by material and by variant, select → card expands.
  2. Card → variant → supplies → a supply → edit quantity → stock and totals update.
  3. Palette → «Записать приход» → search → details → save; stock grows.
  4. Search with no match → «Новый материал» → create type/material/variant → details →
     save; the new card appears.
  5. Save with an empty quantity, price or supplier → the field reports the error.
  6. Material → «Скрыть» with variants → card disappears → «Скрытые» → «Вернуть».
  7. Types: rename changes the eyebrow on every card of that type; hide and restore.
  8. Empty state, then data again.
  9. Keyboard only: `/`, arrows, Enter, Escape; mobile: sheet from the bottom,
     palette overlay full width.
