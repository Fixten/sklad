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
- **Search OR chain — one unified target.** The query field finds an existing variant and is not
  part of the form. Four target pickers are part of the form and always editable: type (existing
  or new), material (per chosen existing type, or new), variant (free text), unit. No creation
  mode, no seeding from the query, no disabling, no labels that change per state.
- **One target at a time.** Selecting a variant in the query fills the pickers; editing any
  picker clears the query selection and starts a manual chain — and the reverse. Inputs are
  never disabled; exclusivity lives in state.
- **One submit creates only the missing chain**, then the Supply. If the Supply save fails after
  the chain was created, the new variant stays and the save can be retried.
- **The submit is always «Сохранить».**
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

1. The field is the first thing on the page and is always editable. The quiet label is «Поиск»;
   when nothing is selected the field shows the placeholder «Название, тип или вариант»; when
   something is selected it holds the variant name.
2. Typing filters variants by variant, material and type. Results are inline under the field, in a
   capped scrollable list. Each row: variant, type · material, stock, unit.
3. Selecting a result keeps the variant in the field. There is no path, stock or unit hint beneath
   it; editing the field starts a new search, and there is no «Изменить» button.
4. There is no create row. Creating a missing variant goes through the target pickers below.

### Target pickers (part of the form)

Always present, never disabled, one group under the query field:

| Field    | Control                                                |
| -------- | ------------------------------------------------------ |
| Тип      | existing types as options, or a new name typed inline  |
| Материал | options = materials of an existing chosen type; a create row adds a new material under it; new type or no type yet → free text |
| Вариант  | free text                                              |
| Единица  | pieces / meters select                                 |

- Nothing is pre-filled: entering the page the fields are empty; the user states the chain.
- Selecting an existing variant in the query fills the four pickers with its chain; editing any
  picker there clears the query selection and the manual values replace it.
- The supply details' unit follows the target: the picked variant's unit, or the unit chosen for a
  new variant.
- All fields carry no descriptions; validation reports at the field level on submit.

### Details

- Quantity, with the unit from the selected or newly created variant.
- Total purchase price, with a live unit cost.
- Supplier, plain text with suggestions from past suppliers.
- Optional description and URL, visible in the same form.

### Save

- Existing variant (from the query): creates the Supply.
- Manual chain: creates only the missing type/material/variant, then the Supply.
- The submit is always labeled «Сохранить».
- Success returns to Materials, the stock updates, and a short confirmation appears.
- A failure keeps every field and shows one message next to the actions; field errors stay under
  their fields.

## States

- Catalog loading: a spinner at the end of the target field.
- No materials: the target pickers start empty; material stays free text until a type exists.
- No types: the type field is free text from the start.
- No search results: the result list is empty with no hint; the target pickers are the creation
  path.
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
- The search field is the first control and uses the shared `OptionPicker` for inline results;
  catalog loading is a spinner at the end of the field.
- Quantity, price, supplier, description and URL are one form, validated with the reusable
  quantity/price rules.
- Submit stops at a stage status; it does not create a Supply yet (stage 3).
- The old `SupplySheet` and wizard are unreachable from the app but remain until the final purge.
- Stage 2 is the unified target: the query keeps searching existing variants without a create row,
  and the four target pickers (type, material, variant, unit) join the form — always editable,
  mutually exclusive with the query selection by state, never disabled. The submit label becomes
  «Сохранить». Missing-chain creation services and the real save are the next project stages.
