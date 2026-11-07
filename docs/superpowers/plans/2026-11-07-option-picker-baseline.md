# OptionPicker baseline Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Rebuild `OptionPicker` on cmdk defaults per `docs/superpowers/specs/2026-11-07-option-picker-baseline-design.md` — create row first and active by default, picker-owned filtering and text, values-only commitments in the forms — and refit all four consumers.

**Architecture:** The picker keeps `text` (typing state) and `open` (`useCommandMenu`, unchanged) locally; everything else is derived. cmdk is uncontrolled and DOM order is create-first, so selection defaults and fallbacks come for free. The forms store `{existing id}` or `{createIntent name}` per level; typed text never reaches the form; parents own releases (cascade, search rule) through `onTextChange`.

**Tech Stack:** React 19, React Compiler on, cmdk 1.1.1, `@base/command`, `@ui/InputField`, `@ui/CommandMenu`, Vitest (unit/browser/vrt), Storybook stories.

**Spec:** `docs/superpowers/specs/2026-11-07-option-picker-baseline-design.md`

## Global Constraints

- **No git operations by agents.** The user performs all commits; every task ends at verified tests and stops. Step numbering below reflects this.
- Russian UI copy is fixed; do not invent or reword user-facing strings except where existing tests already define them.
- No comments in code. React Compiler is on — no manual `useMemo`/`useCallback`. Absence is `undefined`, never `null`, except API/DOM/`@base/*` contracts.
- A component takes one `props` parameter and reads `props.name` (no signature destructuring); components are `function`; one `interface Props` per file. `cn()`, never string class concat. Follow `frontend/docs/code_style.md`.
- A11y scope: keyboard navigation and focus only; no screen-reader machinery.
- `@base/*` imports only inside `src/components/ui/`; cross-module uses aliases.
- cmdk 1.1.1 facts (verified in dist): uncontrolled store starts empty and adopts the first DOM item on item registration (`r.current.value || J()`); when the selected item unmounts the fallback adopts the first DOM item; root always `preventDefault`s Enter and ArrowUp/Down; `shouldFilter={false}` keeps every rendered item visible and selection usable; only `CommandInput` writes the store's `search` (the picker's InputField therefore never triggers cmdk filtering — correct by design).
- Test runners: `pnpm --filter frontend test` (unit), `test:browser` (all), or scoped `pnpm --filter frontend exec vitest run --project browser <path>` / `--project unit <path>`. Full gates via `pnpm --filter frontend fullcheck`.
- If vrt goldens fail: do not investigate. Stop and ask the user.

## Review Focus

- **Enter with the list closed must submit the sheet's form** — InputField `onKeyDown` stops propagation only while `expanded` is true; a reviewer sees «Сохранить» submit in "submits the form on enter once the list is closed" (Task 1).
- **Display falls back to the committed name by derivation, with text empty after every commit** — after picking, the field shows the picked label purely from `value` + `options` (Task 1, "shows the picked name by derivation after a commit").
- **Open list must always have an active row** — with create DOM-first, cmdk's adoption guarantees Enter always reaches a row; a reviewer confirms no "dead Enter" paths (Task 1, "commits the default row on Enter without navigation").
- **Search commit shows chain names via values, never writes picker texts** — Task 2 asserts the three target fields hold ids and the pickers display them beyond — display derivation already proven in Task 1 (Task 2, "commits a result chain through values").
- **vrt: SupplySheet goldens churn** — row order changes (create-first). Do not investigate; surface to the user (Task 4).

---

### Task 1: `OptionPicker` — baseline component

**Files:**

- Modify (rewrite): `frontend/src/components/ui/OptionPicker/index.tsx`
- Modify (rewrite): `frontend/src/components/ui/OptionPicker/OptionPicker.browser.test.tsx`
- Modify: `frontend/src/components/ui/OptionPicker/OptionPicker.stories.tsx`

**Interfaces:**

- Consumes (unchanged): `Command`, `CommandItem`, `CommandList` from `@base/command`; `useCommandMenu` from `@ui/CommandMenu` (`{ open, openList, close, wrapperRef, handleKeyDown }`); `InputField` from `@ui/InputField` (spreads `ComponentProps<"input">` — `value`/`onChange`/`name`/`ref`/`onKeyDown`/`role` all flow); `Typography`, `PlusIcon`.
- Produces (Tasks 2–3 consume exactly this):

```ts
// index.tsx
export interface OptionItem<T extends string | number> {
  value: T;
  label: string;
  meta?: string;
}

export interface OptionPickerProps<T extends string | number> {
  id: string;
  label: string;
  value?: T;
  options: OptionItem<T>[];
  create?: (
    text: string,
  ) => { createLabel: string; onCreate: () => void } | undefined;
  onSelect: (value: T) => void;
  onTextChange?: (text: string) => void;
  name?: string;
  inputRef?: Ref<HTMLInputElement>;
  onBlur?: ComponentProps<"input">["onBlur"];
  placeholder?: string;
  error?: string;
  loading?: boolean;
  autoFocus?: boolean;
}
```

Internal shape: `text` is the only picker state besides the hook's `open` (one `useState<string>("")`). Derived per render: `candidates = options.filter(normalizeName(label+meta).includes(normalizeName(text)))` with empty text matching all — import `normalizeName` from `@/lib/text/text`; `createRow = create?.(text)`; `display = text !== "" ? text : candidatesNamedByValue(options, value)`; `expanded = open && (candidates.length > 0 || createRow !== undefined)`. On commit (option or create) `close()` and reset `text` to `""` — display then derives from `value` alone (or stays blank for create intents, accepted baseline). No controlled `value`/`onValueChange` on `Command`; `Command` keeps `shouldFilter={false}` and `loop`, and the in-flow list classes from the design pass (`gap-6` gap under the field, `max-h-none` list pushing the form, sizer flex-col). Create row stays DOM-first, plain `rowClassName` (no `order-first`).

- [ ] **Step 1: Rewrite the failing test file**

Keep the current file's render helper style (browser project, `render` awaited). Host wrapper: a `<form data-testid="form" onSubmit={...}>` around, so submit-Enter is assertable. Tests to write (names pinned):

```
"filters candidates over label and meta, case-insensitively" — render with options
  {label:"Доска 40 мм", meta:"Пиломатериал · Дуб"}; type "дуб"; list shows rows whose
  label OR meta contains "дуб"; rows without it are not listed.
"shows every candidate while the text is empty" — focus /* no text */; all options listed.
"renders the create row first and activates it by default" — text non-empty so create exists;
  no arrow keys; Enter → the create's onCreate is called, not any option's onSelect.
"moves the active option with the arrow keys and wraps" — ArrowDown ×n, loop wraps from last
  option to create row and back (Enter identifies the row through its commit).
"falls back to the create row when the active option leaves the list" — ArrowDown to option 2,
  type a char filtering it out; Enter → onCreate (row 1 is active again).
"commits a picked option" — navigate to option, Enter → onSelect(id), list closed.
"shows the picked name by derivation after a commit" — after the commit above, the field's value
  equals the option's label even though the internal text is empty.
"commits the create row on Enter instead of submitting" — with all checks: form's onSubmit
  spy NOT called; onCreate called; next Enter (list now closed → submit via Enter path) — the
  form's spy IS called.
"reports typed text and not commit-clears" — type "д"; props.onTextChange called with "д" each
  keystroke; a commit (create) fires no further onTextChange call.
"escape closes the list and keeps the text, reopens on the next key" — Escape → list closed,
  field still shows the text; type again → list reopens.
"escape with an open-but-empty list leaves it to the parent" — host listens on keydown and
  records defaultPrevented-free delivery: with no options and no create (expanded false),
  Escape reaches the host.
"tab closes the list".
"opens on the arrow keys while closed" — ArrowDown on fresh field opens the list.
"loads with a spinner while loading" — loading prop renders through InputField (Spinner visible).
"displays a committed id's name before any typing" — value set + options provided; field shows
  that option's label on first render.
```

- [ ] **Step 2: Run to verify RED**

Run: `pnpm --filter frontend exec vitest run --project browser src/components/ui/OptionPicker`
Expected: the file fails to compile or every new test fails (old props `query`/`onQueryChange` no longer match the new host usage).

- [ ] **Step 3: Implement the new `OptionPicker`**

Rewrite per the Internal shape above; keep `rowClassName` styling tokens from the current file (12 h rows, `px-4`, selected style, `data-selected` inset line), drop `createRowClassName`/`order-first`. Structure: wrapper div (`wrapperRef`, `onFocus=openList`, `onKeyDown` = open-on-Arrow + `handleKeyDown` delegate), `Command shouldFilter={false} loop` with the design-pass list classes, `InputField` `value={display}`, `onChange` → `setText` + `onTextChange`, `onKeyDown` = Tab-close + `stopPropagation` only while `!expanded`. `role="combobox"` + `aria-expanded={expanded}` + `aria-autocomplete="list"` on the input (unchanged from the current implementation, keyboard-only a11y scope).

- [ ] **Step 4: Run to verify GREEN**

Run: `pnpm --filter frontend exec vitest run --project browser src/components/ui/OptionPicker`
Expected: all new tests pass.

- [ ] **Step 5: Update the stories**

`OptionPicker.stories.tsx`: drop the `Controlled` wrapper, `query`/`onQueryChange`/`hint`/`listLabel` usages; story args use `value`, `options`, `create` as a `(text) => ...` function. Copy stays Russian. Verify: `pnpm --filter frontend exec eslint src/components/ui/OptionPicker` + `prettier --check` on the touched files — both clean.

- [ ] **Step 6: Stop for the user to commit. Typecheck is expected RED at consumers until Tasks 2–3; do not run fullcheck here.**

---

### Task 2: SupplyCreate — values-only form, SearchField, TargetPickers

**Files:**

- Modify: `frontend/src/features/Supply/SupplyCreate/supplyForm.ts`
- Modify: `frontend/src/features/Supply/SupplyCreate/supplyForm.test.ts`
- Modify: `frontend/src/features/Supply/SupplyCreate/TargetPickers/index.tsx`
- Modify (rewrite contract): `frontend/src/features/Supply/SupplyCreate/TargetPickers/TargetPickers.browser.test.tsx`
- Modify: `frontend/src/features/Supply/SupplyCreate/TargetFields/SearchField/index.tsx`
- Modify: `frontend/src/features/Supply/SupplyCreate/useMaterialSearch.ts`

**Interfaces:**

- Consumes: `OptionPickerProps` exactly as produced in Task 1.
- Produces: `useMaterialSearch()` → `{ selected: MaterialCatalogRow | undefined, select(row), clear() }` — `query`/`changeQuery` removed. `SupplyFormValues` loses `typeQuery`/`materialQuery`/`variantQuery`; `typeName`/`materialName`/`variantName` keep only their create-intent meaning; schema, defaults, and the RHF field names shrink accordingly. `TargetDraft`/DTO transform unchanged (`*Id` else `*Name`).

- [ ] **Step 1: Rewrite the failing form tests**

In `supplyForm.test.ts`: delete every test/fixture line referencing `*Query` fields; keep validation tests (unit/precision/supplier messages) untouched. New assertions only where names changed meaning: a form whose `typeId` set but `typeName` "" passes the commit-refine (existing behavior, re-checked), an intent-only form sets `*Name`.

- [ ] **Step 2: Run to verify RED** — `pnpm --filter frontend exec vitest run --project unit src/features/Supply/SupplyCreate/supplyForm.test.ts` (compilation errors from the removed fields are the expected RED alongside any semantic fails).

- [ ] **Step 3: Implement the schema change** — remove the three `*Query` keys from `SupplyFormValues`, `supplyFormDefaults`, and the schema object. Nothing else in `createSupplyFormSchema` changes.

- [ ] **Step 4: Run to verify GREEN** (unit file).

- [ ] **Step 5: Rewrite the failing consumer tests**

`TargetPickers.browser.test.tsx` — keep the host/RHF harness and all flip targets; changes:
- Renders pass the new seam: `value={values.typeId ?? undefined}` etc.; `create` becomes `(text) => text.trim() !== "" && !hasExact(name, text) ? { createLabel, onCreate } : undefined` where `onCreate` writes the intent (`typeName: text.trim()`, `typeId: null`).
- Re-assert exactly (existing test bodies adapted where they touched `*Query`):
  - "filters existing types and labels the create row with the typed name" — picker filters now (no consumer `matches()` remains in the file; remove `matches`).
  - "hides the create row when an existing name is typed in another case" — logic identical, computed in `create(text)`.
  - "does not commit typed text" — no `*Query` values written; typing writes nothing to the form except releases.
  - "commits a picked result and drops it on edit" — commit: `typeId` set; typing: `typeId` knocked down to `null` via the release handler.
  - "reports every picker edit to the chain" — `onChainEdit` → `search.clear()`.
  - "commits a create row" — `typeName` set, `typeId` null.
  - "scopes materials to the picked type and keeps them on a same-id re-pick", "scopes variants… seeds the unit" — unchanged pass-throughs.
  - "type change clears material and variant"/"material change clears the variant only" — value writes (`materialId: null`, `materialName: ""`).
  - "offers a create row for a material that exists under another type" / variant twin — hasExact vs the level's own candidate list.
  - "unit change releases an existing variant but keeps a create intent" — unchanged.
  - "creates from an empty catalog", "revalidates after a failed submit", "commits the create row on Enter instead of submitting" — unchanged behavior, updated renders.

- [ ] **Step 6: Run to verify RED** — browser project on the file; expect prop-shape/type errors plus any adapter gaps.

- [ ] **Step 7: Implement TargetPickers + SearchField + useMaterialSearch**

- `TargetPickers`: remove `matches`; each level renders `OptionPicker` with `value`/`onSelect`/`onTextChange`(release handler)/`create(text)`. Releases are intent-named functions writing with `writeOptions`; typing in a level releases that level and, per cascade rules below, the lower chain — same `wasCommitted` guards as the current edit handlers, minus all `*Query` writes:
  - type: `releaseType` → `typeId: null, typeName: ""`; when it was committed: `clearMaterial()` + `clearVariant()`.
  - material: `releaseMaterial` → ids/names as current `editMaterial`, variant twin.
  - variant: `releaseVariant`.
  - `onChainEdit` still wired as `search.clear`.
- `SearchField`: `options = all rows mapped (value: variantId, label: variantName, meta: materialPath) — drop the `queryMaterialRow` filter AND the selected-variant exclusion (list shows the committed chain row; accepted delta)`. `value: search.selected?.variantId`. Commit → existing `setTarget` minus the three `*Query`/clears it wrote. `onTextChange`: the doc rule verbatim — release the variant commitment only when the field currently holds a selection: `if (search.selected) { release variant: variantId → null; search.clear() }`. No create.
- `useMaterialSearch`: `selected`/`select`/`clear` only; `select` writes nothing but selection.

- [ ] **Step 8: Run to verify GREEN**

`pnpm --filter frontend exec vitest run --project browser src/features/Supply/SupplyCreate && pnpm --filter frontend exec vitest run --project unit src/features/Supply/SupplyCreate` — both green; eslint/prettier clean on touched files.

- [ ] **Step 9: Stop for the user to commit.**

---

### Task 3: SupplySheet — SupplierPicker and PickStep on the new seam

**Files:**

- Modify: `frontend/src/features/Supply/SupplySheet/steps/DetailsStep/SupplierPicker/index.tsx`
- Test: its SupplySheet step tests live in `frontend/src/features/Supply/SupplySheet/index.browser.test.tsx` and step stories (`SupplierPicker.stories.tsx`, `PickStep.stories.tsx`) — adapt.

`useDetailsForm` detailsForm tasks: keep the supplier commitment as-is ({id | name}); the value contract to the picker changes only via `SupplierPicker`'s internals.

- Modify: `frontend/src/features/Supply/SupplySheet/steps/PickStep/index.tsx`
- Modify: `frontend/src/features/Supply/SupplySheet/steps/PickStep/usePickStep.ts`

**Interfaces:**

- Consumes: `OptionPickerProps` from Task 1; `materialPath` unchanged.
- Produces: `usePickStep()` → `{ picked: MaterialCatalogRow | undefined; select(row); create(text): row | undefined; release() }` — query state gone; `PickStep` maps into `OptionPickerProps` without local filtering.

- [ ] **Step 1: Write the failing assertions in the existing SupplySheet browser test file** (find the PickStep/SupplierPicker coverage and pin, in current copy where applicable):
  - SupplierPicker: filtering by typed text is the picker's job now — supplier list offers normalized substring matches from the full list; create row when the trimmed typed name has no exact `sameName` match among suppliers; `onTextChange` releases an existing supplier id while typing; persists existing `{id}` after a pick.
  - PickStep: the create row offers «Новый вариант в «X»» when the typed text exactly matches an existing material (`queryMaterialRowWithType` semantics — keep the helper, call inside `create(text)`); otherwise «Новый материал: «X»»; picking a variant commits and navigates per existing test; typing after a pick releases the picked selection.
- [ ] **Step 2: Run to verify RED** — scoped browser run on `src/features/Supply/SupplySheet`.
- [ ] **Step 3: Implement** — `usePickStep` holds `picked` only; `PickStep` renders `value={picked?.variantId}`, `options` = full catalog mapping, `create: (text) => creationFor(rows, text)`, `onTextChange: release`, `onSelect: select`. `SupplierPicker` similarly: `value={value.id ?? undefined}`, `options` = full supplier list, `create: (text) => exact-rule row` (uses `sameName`), `onTextChange` releases `onChange({ id: null, name: "" })`, `onSelect` writes `{id, name: supplier.name}`.
- [ ] **Step 4: Run to verify GREEN** — scoped browser + stories eslint/prettier on the touched files.
- [ ] **Step 5: Stop for the user to commit.**

---

### Task 4: Docs and full check

**Files:**

- Modify: `frontend/DESIGN.md` (§OptionPicker)
- Modify: `docs/superpowers/specs/2026-11-07-command-menu-design.md` (§Consumers)

- [ ] **Step 1: DESIGN.md §OptionPicker** — replace the "create leads visually / first option active while results exist" doctrine with the ruling: create row **first in DOM and screen, first active by default**; filtering is the picker's own (label + meta); list in flow 24 px under the field pushing the form (unchanged). Keep the recipe snippets in token language, no implementation detail.
- [ ] **Step 2: Cross-spec bullets** — in the CommandMenu seam doc, rewrite the OptionPicker bullet to: values-only commitments, picker-owned text and filtering, no controlled selection, and reference the baseline spec.
- [ ] **Step 3: Full gates** — `pnpm --filter frontend fullcheck` (test + test:browser + typecheck + eslint + prettier). vrt runs last; **if goldens mismatch, stop and ask the user** (expected churn: create-first order in SupplySheet screens).
- [ ] **Step 4: Stop for the user to commit.**
