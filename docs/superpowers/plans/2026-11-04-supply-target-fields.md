# Supply Target Fields Extraction Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Move the «Поиск» picker, its catalog hooks and the search commit logic out of `SupplyCreate` into a self-contained `TargetFields` section that also renders `TargetPickers`.

**Architecture:** `TargetFields` owns `useMaterialSearch`, `useMaterial`, `useMaterialType`, `useVariant`, reads the form via `useFormContext`, and renders the search `OptionPicker` above `TargetPickers`. The two search commit helpers move out of `useSupplyForm` and become local functions in the section, so `onChainEdit` is a local closure and no reset prop/effect/ref exists. `useSupplyForm` keeps form setup and the details watchers.

**Tech Stack:** React 19, react-hook-form 7 (zod resolver), TypeScript, Vitest browser project.

**Spec:** `docs/superpowers/specs/2026-11-04-supply-target-fields-design.md`

## Global Constraints

- **No git write operations** — the user reviews and commits. The plan has no commit steps.
- No comments in code unless the behavior is extraordinary; React Compiler is on (no manual `useMemo`/`useCallback`); UI imports via `@ui/*`.
- Preserve behavior, copy, ids (`supply-query`, `supply-type`, `supply-material`, `supply-variant`), markup structure, and `autoFocus` on the search field.
- Keep `setValue(..., { shouldDirty: true })` only for the search writes; do **not** add `shouldValidate` (Task 2 ruling). Keep `clearErrors(["unit", "typeName", "materialName", "variantName"])`.
- Do not modify `useMaterialSearch.ts`, `TargetPickers/index.tsx`, `DetailsFields/index.tsx`, `supplyForm.ts`, or any test.
- Gates: typecheck, lint and prettier silent; unit 169/169; browser 167/167 (page 12, pickers 15).

## Review Focus

The refactor changes no behavior, so these risks are the regression net; no new tests are added:

1. Search selection fills Тип/Материал/Вариант and seeds Единица — `fills the target pickers from the search selection` (`SupplyPage.browser.test.tsx`).
2. Typing in «Поиск» after a selection releases the variant commit but leaves the fill visible — the visible fill is pinned by `keeps the query selection only while the query holds it`; the release itself is a residual gap (ledger).
3. Editing any picker clears the search query and selection (the internal `onChainEdit`) — `starts a manual chain when a picker is edited after a selection` pins the chain, not the search clearing; the clearing is a residual gap (ledger).
4. An empty catalog still leaves the pickers usable for create intents — `keeps the target pickers usable with an empty catalog`.
5. Submitting uncommitted picker text still reports the four target errors — `reports missing values on submit`.

---

### Task 1: Extract `TargetFields` and move the search commits

**Files:**
- Create: `frontend/src/features/Supply/SupplyCreate/TargetFields/index.tsx`
- Modify: `frontend/src/features/Supply/SupplyCreate/useSupplyForm.ts`
- Modify: `frontend/src/features/Supply/SupplyCreate/index.tsx`

**Interfaces:**
- Consumes: `useMaterialSearch()` → `{ query, selected, results, isLoading, changeQuery, select, clear }`; `useMaterial()` → `{ materials }`; `useMaterialType()` → `{ types }`; `useVariant()` → `{ variants }`; `useFormContext<SupplyFormValues, unknown, SupplyDraft>()` → `{ setValue, clearErrors }`; `MaterialCatalogRow` from `@/features/Material/useMaterialsCatalog`; `TargetPickers` props `{ types, materials, variants, onChainEdit }`.
- Produces: `export default function TargetFields()` with no props; `useSupplyForm()` now returns exactly `{ form, quantity, price, unit, submit }`.

- [ ] **Step 1: Baseline the gates**

Run from `/home/fixten/apps/sklad`:

```bash
pnpm --filter frontend typecheck
pnpm --filter frontend lint
pnpm --filter frontend test
pnpm --filter frontend test:browser
```

Expected: first two silent; unit `169 passed`; browser `167 passed`. If not, stop and report — the refactor must start from green.

- [ ] **Step 2: Create the `TargetFields` section**

Create `frontend/src/features/Supply/SupplyCreate/TargetFields/index.tsx` with this contract:

- `useMaterialSearch()`, `useMaterial()`, `useMaterialType()`, `useVariant()` — move those calls from `SupplyCreate/index.tsx` unchanged.
- `const { setValue, clearErrors } = useFormContext<SupplyFormValues, unknown, SupplyDraft>();`
- Move the search helpers verbatim from the current page (`SupplyCreate/index.tsx:37-47`): `onQueryChange(value)` releases the target only when `material.selected` is set, then calls `material.changeQuery(value)`; `onQuerySelect(row)` calls `setTarget(row)` then `material.select(row)`.
- Add `setTarget(row: MaterialCatalogRow)` and `clearQueryTarget()` by copying the bodies verbatim from `useSupplyForm.ts:20-34` and `:36-38`, replacing `form.setValue` with `setValue` and keeping `{ shouldDirty: true }` on every write plus the four-name `clearErrors`.
- Render, in order: the `OptionPicker` currently at `SupplyCreate/index.tsx:51-62` with the same props (`id="supply-query"`, `label="Поиск"`, `placeholder`, `value={material.query}`, `autoFocus`, `loading={materialLoading}`, `listLabel="Варианты"`, `results={materialOptions}`, `onValueChange={onQueryChange}`, `onSelect={onQuerySelect}`), then `<TargetPickers types={types} materials={materials} variants={variants} onChainEdit={material.clear} />`.
- Move `hasQuery`, `materialLoading` and `materialOptions` from `SupplyCreate/index.tsx:28-35` unchanged.

- [ ] **Step 3: Slim `useSupplyForm`**

In `useSupplyForm.ts`: delete `setTarget` and `clearQueryTarget`, delete the now-unused `MaterialCatalogRow` type import, and return `{ form, quantity, price, unit, submit }`. Leave `supplyFormSchema`, the three `useWatch` calls and `submit` untouched.

- [ ] **Step 4: Rewire `SupplyCreate`**

In `SupplyCreate/index.tsx`: import `TargetFields from "./TargetFields"`; render the `Form` as `<TargetFields />`, then `DetailsFields` (unchanged `control`, `unit ?? undefined`, `unitCost`), then the submit button. Remove the moved imports (`materialPath`, `useMaterial`, `useMaterialType`, `useVariant`, `OptionPicker`, `useMaterialSearch`, `MaterialCatalogRow`), the moved derivations/handlers, and `setTarget`/`clearQueryTarget` from the `useSupplyForm` destructure. Keep `form`, `control`, `quantity`, `price`, `unit`, `unitCost` and `unitCostPreview`.

- [ ] **Step 5: Typecheck, lint and format**

```bash
pnpm --filter frontend typecheck
pnpm --filter frontend lint
pnpm --filter frontend exec prettier --check src/features/Supply/SupplyCreate
```

Expected: all silent. Fix import order with `pnpm --filter frontend exec eslint --fix src/features/Supply/SupplyCreate` if lint reports it, then re-run.

- [ ] **Step 6: Run the focused suites**

```bash
pnpm --filter frontend exec vitest run --project browser src/router/pages/MaterialPage/SupplyPage/SupplyPage.browser.test.tsx src/features/Supply/SupplyCreate/TargetPickers/TargetPickers.browser.test.tsx
```

Expected: page `12 passed`, pickers `15 passed`.

- [ ] **Step 7: Run the full gate**

```bash
pnpm --filter frontend test
pnpm --filter frontend test:browser
```

Expected: unit `169 passed`; browser `167 passed`.

- [ ] **Step 8: Self-review**

Confirm: no test file changed; `useMaterialSearch`, `TargetPickers`, `DetailsFields` and `supplyForm.ts` untouched; `SupplyCreate` no longer references search/catalog code; `TargetFields` has no reset prop/effect/ref; no comments added; no manual memoization; search writes keep `shouldDirty` only; ids and copy unchanged.

Report the outcome without committing.
