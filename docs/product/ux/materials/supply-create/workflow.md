# UX Design: Supply Creation (alternative fork)

Status: alternative fork of `../workflow.md`, creation only. The approved materials workflow
remains untouched. Prototype: `prototype.html` — disposable, mocked data, not production code.
Current design prototype: **1 of 5 — static anatomy**.
Project prototype: **stage 1 — flat page with real catalog search and validated details, save
stubbed**.

## Goal

Record one purchased batch — one Supply of one Material Variant — including creating a missing
variant and its missing type/material, on one flat page.

## Decisions

- **Dedicated page.** The global action opens it empty; a variant row opens it with that variant
  preselected. Back returns to Materials.
- **The app header is unchanged.** The page content starts with a quiet back link, the page title,
  and the form. No new header bar.
- **One target field, always visible.** It searches type, material and variant together. Results are
  variants: variant name, `type · material`, current stock. A selected variant stays in the editable
  field, with no hint line beneath it. There is no summary card and no «Изменить» reveal.
- **One form, one submit.** No wizard, sheet, dialog, step counter or nested form.
- **Creation is a mode of the target field**, not a separate form. Existing type/material inferred
  from the query are shown as context; only missing levels are editable.
- **One submit creates only the missing chain**, then the Supply. If the Supply save fails after the
  chain was created, the new variant stays selected and the save can be retried.
- **Supplier stays a plain text input** with suggestions. No custom supplier picker.
- **No hint lines.** The target, quantity, price and supplier fields carry no description under
  them. Units sit at the end of the quantity and price fields.
- **No edit/delete, no batch entry, no materials-list changes.**

## Flow

### Entry

1. Materials → «Записать поставку» → `/material/supply`, empty.
2. Variant row → «Поставка» → the same page, variant preselected.
3. «Назад» → Materials.

### Target field

1. The field is the first thing on the page and is always editable. When nothing is selected it
   shows the placeholder «Название, тип или вариант»; when something is selected it holds the
   variant name.
2. Typing filters variants by variant, material and type. Results are inline under the field, in a
   capped scrollable list. Each row: variant, type · material, stock, unit.
3. Selecting a result keeps the variant in the field. There is no path, stock or unit hint beneath
   it; editing the field starts a new search, and there is no «Изменить» button.
4. The result list always starts with «Создать», even before typing and alongside matches. Selecting
   it opens the creation mode; the query seeds the variant name.

### Creating a missing variant

The creation mode is part of the same supply form. It shows the path as context and asks only for
what is missing:

| Case                            | Shown as context | Editable            |
| ------------------------------- | ---------------- | ------------------- |
| Type and material exist         | type · material  | variant, unit       |
| Type exists, material missing   | type             | material, variant, unit |
| Nothing exists                  | —                | type, material, variant, unit |

- The query seeds the variant name; matching type/material names seed the context.
- Context is shown as a read-only path segment the user can change; changing it clears the levels
  below it.
- «Отмена» returns to search without losing quantity, price, supplier or optional fields.
- The primary action becomes «Создать и записать».

### Details

- Quantity, with the unit from the selected or newly created variant.
- Total purchase price, with a live unit cost.
- Supplier, plain text with suggestions from past suppliers.
- Optional description and URL, visible in the same form.

### Save

- Existing variant: creates the Supply.
- New variant chain: creates only the missing type/material/variant, then the Supply.
- Success returns to Materials, the stock updates, and a short confirmation appears.
- A failure keeps every field and shows one message next to the actions; field errors stay under
  their fields.

## States

- Catalog loading: a spinner at the end of the target field.
- No materials: the creation mode can start with empty type/material.
- No types: the creation mode starts at a new type.
- No search results: the create row is the only result; there is no empty hint.
- The create row is always present while the picker is open, including before typing and alongside
  matches.
- Saving: the primary action shows its pending verb and stays available.
- API failure: message above the actions, inputs preserved.
- Empty optional fields: no empty rows, no invented values.

## Out of scope

- Editing, correcting and deleting an existing Supply.
- Supplies history inside a variant.
- Batch entry of several materials from one delivery.
- Materials list, cards, variant maintenance, type management.
- Supplier management.
- Any change to the app header.

## Layers

0. Flow contract — agreed 2026-10-31.
1. Static anatomy with a mocked selected variant — **current**.
2. Search across type/material/variant, selection, empty and preselected entry.
3. Creation mode for the missing variant chain.
4. Validation, one-submit save, API failure, success.
5. Mobile, keyboard/focus, empty catalog, long lists, final walkthrough.

Each layer ends with a runnable prototype and stops for review. Later layers do not start early.

## Project prototype

Project stage 1 is implemented in `frontend/src/router/pages/MaterialPage/SupplyPage/` and
`frontend/src/features/Supply/SupplyCreate/`.

- Route `/material/supply`; the Materials palette action navigates there.
- The material field is the first control and uses the shared `OptionPicker` for inline results;
  catalog loading is a spinner at the end of the field, and the create row is always present.
- Quantity, price, supplier, description and URL are one form, validated with the reusable
  quantity/price rules.
- Submit stops at a stage status; it does not create a Supply yet.
- The old `SupplySheet` and wizard are unreachable from the app but remain until the final purge.
- The create row is always visible; its creation mode is the next project stage.
- Missing variant/type/material creation and the real save are the next project stages.
