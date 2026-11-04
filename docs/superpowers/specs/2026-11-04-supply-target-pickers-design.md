# SupplyCreate stage 2b — target pickers commit a value

## Intent and why

A picker's input is a query, not a value. It exists to help the user find or state a target; what
the form submits must be something the user explicitly committed — an existing entity or an
explicit “create this” row. Stage 2 shipped the opposite: Тип and Материал bound their filter text
straight to the form value, Вариант was a bare text input, and the two create rows were no-ops.
Any name typed and never picked was serialized as a new entity on submit, so a typo or an
already-existing name either created a duplicate or failed with the backend's
«Name already exists» (409).

This revision makes all three target fields true pickers: text filters, a result row commits an
existing entity, a create row commits a new name. It lands before stage 3's real save, so the
resolver there consumes committed targets only and needs no name matching.

## Goals

- Each of Тип, Материал, Вариант is a query field over its own option list with an explicit create
  row; its text is never submitted.
- The form stores only committed targets: an existing id **or** a create-intent name, per level,
  plus the unit.
- Submit with uncommitted text is a field error, not a creation.
- Existing targets are reused by identity; new names are created only from a create row.
- Cascade and mutual exclusion keep the chain consistent (type → material → variant → unit).
- The search field («Поиск») keeps its behavior: picking a result commits the whole chain; editing
  any picker releases the search selection.

## Non-goals

- The real save, mutation ordering, supplier resolution, success/error feedback (stage 3).
- Any disabled field, any mode switch, any extra “Изменить”/summary chrome.
- Editing/deleting entities, batch entry, supplier management.
- Server-side duplicate lookup beyond the lists already loaded.

## Approaches

- **A (chosen): two-state picker.** The visible field owns a query string; the form owns a
  committed value. Result rows and create rows are the only transitions into the committed value.
  The search field already works this way (`query` + `selected`), so the page becomes internally
  consistent and the resolver stays trivial.
- **B (rejected): id-only pickers.** The field shows only the committed entity and «Создать» opens
  a separate inline name cell. Cleaner state, but it adds a second micro-UI per picker and two
  steps to create anything; A reaches the same guarantees with no new control type.
- **C (rejected): keep text-as-value and validate on submit.** A submit-time resolver could match
  names and refuse duplicates, but it still lets the form carry a value the user never chose — the
  exact behavior this revision removes.

## The model

Per level (`type`, `material`, `variant`) the form holds three things:

| Field          | Meaning                                                        |
| -------------- | -------------------------------------------------------------- |
| `*Query`       | filter text, also what the field displays; never submitted      |
| `*Id`          | committed existing entity id, or `null`                         |
| `*Name`        | committed create-intent name, or `""`                           |

A level is **committed** iff `*Id !== null || *Name !== ""`. Exactly one of the two is set.

Transitions, all driven by the picker:

- **Type a character** → `*Query` updated; commit cleared (`*Id = null`, `*Name = ""`).
- **Pick a result row** → `*Id = row.id`, `*Name = ""`, `*Query = row.name`.
- **Pick the create row** → `*Id = null`, `*Name = query.trim()`, `*Query` keeps the text.
- **Query unchanged** (typing the same string, re-picking the same id) → no state change.

Cascade, because lower levels are scoped by higher ones:

- Type commit changes (different id or new name) → clear material and variant commits **and**
  their queries.
- Material commit changes → clear the variant commit and query.
- Variant commit changes → nothing upstream.
- The cascade never changes `unit`: the unit chosen or seeded stays the chain's unit until the
  user changes it (stage-2 rule, kept).

Unit:

- Picking an existing variant seeds `unit` from that variant.
- Changing `unit` while an existing variant is committed releases that variant: `variantId = null`,
  `variantName = ""`, and the variant query is cleared. A variant has one unit; changing it means
  the user is describing a different (new) variant. A create-intent variant has no unit of its own,
  so changing `unit` keeps it committed.
- Changing `unit` never touches type or material.

Search field (`«Поиск»`):

- Selecting a result commits all three levels as existing plus the unit; the three pickers show
  the chain names.
- Typing in the search field releases the variant commit **only when the search field currently
  holds a selection** (`useMaterialSearch.selected`); the variant field keeps the name as
  uncommitted text, so the fill stays visible but is not a value (stage-2 rule, kept). Typing in
  the search field does not touch a chain assembled through the pickers.
- Editing any picker calls the page's `onChainEdit`, which clears the search query and selection.

Options and the create row:

- Options are the active rows of the level's list, filtered by case-insensitive substring — the
  existing `matches`/`normalizeName` behavior.
- Material options are scoped to a committed **existing** type; variant options to a committed
  **existing** material. A create-intent or uncommitted parent yields no options.
- The create row appears only when `query.trim()` is non-empty **and** no option has the same
  normalized name. An existing exact match therefore hides the create row, so the user can only
  pick it — the frontend never offers a name the backend will reject with 409.
- Create-row labels name the typed text: `«Создать тип «{query}»»`, and likewise for material and
  variant.

## Copy

| Where                | Copy                                   |
| -------------------- | -------------------------------------- |
| Тип field            | label «Тип», placeholder «Тип»          |
| Материал field       | label «Материал», placeholder «Материал» |
| Вариант field        | label «Вариант», placeholder «Вариант»  |
| Create rows          | «Создать тип «X»», «Создать материал «X»», «Создать вариант «X»» |
| Missing target       | «Выберите или создайте тип» / «…материал» / «…вариант» |
| Missing unit         | «Выберите единицу»                     |

The single missing-target message covers both an empty field and text without a commit; one copy
per field, no state-dependent wording.

## Schema and draft

`SupplyFormValues` keeps the stage-2 id/name pairs, adds the three query strings, and narrows the
meaning of the names to create intents:

```ts
interface SupplyFormValues {
  typeQuery: string;
  typeId: number | null;
  typeName: string;
  materialQuery: string;
  materialId: number | null;
  materialName: string;
  variantQuery: string;
  variantId: number | null;
  variantName: string;
  unit: Unit | null;
  quantity: string;
  price: string;
  supplierName: string;
  description: string;
  url: string;
}
```

Validation (inside the single object-level `superRefine`, no transforming fields — zod v4 abort
semantics):

- `typeId === null && typeName === ""` → issue on `typeName`.
- Same for `materialName` and `variantName`.
- `unit === null` → issue on `unit`.
- The existing quantity/price/supplier/unit-scale rules and their copy stay unchanged.

`SupplyDraft` is unchanged:

- `variantId !== null` → `{ kind: "existing", variantId }`; the cascade guarantees type and
  material are existing too.
- Otherwise `{ kind: "new", typeId | undefined, typeName | undefined, materialId | undefined,
  materialName, variantName, unit }` where each id/name reflects its committed choice.

Stage 3's resolver therefore only creates the levels whose `*Id` is `undefined`, in order, and uses
ids as-is.

## What this supersedes

- Stage-2 spec's picker goals («free text when the type is new or absent», «Вариант (free text)»).
- Stage-2 plan's review-focus line «typed names as new entities» and its create-row no-ops.
- `docs/product/ux/materials/supply-create/workflow.md` target-picker table and the “No types /
  No materials” states, which describe free text.

The stage-2 id/name state, cascade direction, unit seeding and the draft shape survive; only the
commit boundary and the query fields are new.

## Constraints

- Nothing disabled, no modes, submit stays «Сохранить».
- Reuse `OptionPicker` (results + `create` row) for all three levels; no new control type.
- Query text lives in the form (three string fields) so pickers stay in sync with
  search-driven commits and validation can reference committed state; the draft excludes it.
- React Compiler on — no manual memoization.
- `undefined` over `null` outside RHF discriminator fields, per `frontend/docs/code_style.md`.
- Old `SupplySheet` stays untouched and unreachable.

## Left to the builder

- Component decomposition: one reusable committed-picker for the three levels versus three
  inline blocks; keep the `useFormContext` read and the `FieldGroup` grid.
- Where the cascade and `onChainEdit` wiring live (`useSupplyForm` helpers vs the picker).
- Whether option rows show the unit/material meta; variant rows currently show only the name.
- Story and test inventory for the states below.

## Verification

- Typecheck and lint silent; unit, browser and VRT suites green.
- Schema unit tests: each level required independently; committed id passes; create-intent name
  passes; query-only text fails with the copy above; draft encodes existing vs new correctly.
- Browser tests, TargetPickers: typing does not commit; picking a row commits and shows the name;
  the create row commits a create-intent and hides on an exact match; type change clears
  material/variant; material change clears variant; unit change releases an existing variant only;
  empty catalog still allows create rows.
- Browser tests, page: search selection fills all four pickers; editing a picker clears the search
  field and keeps its text; submit with uncommitted text shows the field error and saves nothing.
- Stories: empty, typed-not-committed, existing chain committed, create intents committed,
  search-selected, validation errors, no catalog.
