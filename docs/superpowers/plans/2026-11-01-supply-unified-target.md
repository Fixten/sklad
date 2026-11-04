# SupplyCreate Stage 2 (Unified Target) Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the «Создать»-row mode with a unified target — the query picker finds existing variants only, and four always-editable form pickers (Тип, Материал, Вариант, Единица) let the user state a missing chain, mutually exclusive with the query selection by state, never disabled, submit always «Сохранить».

**Architecture:** The schema (`supplyForm.ts`) grows the chain fields (typeId/typeName, materialId/materialName, variantName) and produces a discriminated `SupplyDraft` (`existing` vs `new` chain) for stage 3's resolver. A new `TargetPickers` component owns the four form pickers, the material cascade (options scoped to the chosen type; free text when the type is new or absent) and the exclusion rule (any picker edit sets `variantId` to `null`). `useMaterialsCatalog` exposes `materials`; `useMaterialSearch` returns them; `useSupplyForm` gains `unit` watch and query-set/clear helpers.

**Tech Stack:** RHF + Zod (`@ui/Form`), `@ui/OptionPicker`, `@ui/InputField`, `@ui/SelectField`, Vitest unit/browser, react-hook-form `Control`/`useWatch`.

**Spec:** `docs/superpowers/specs/2026-11-01-supply-unified-target-design.md`; contract `docs/product/ux/materials/supply-create/workflow.md` (already rewritten).

## Global Constraints

- UI copy in Russian, pinned verbatim below; field labels: «Материал» (query), «Тип», «Материал», «Вариант», «Единица»; create rows: «Создать тип», «Создать материал»; submit «Сохранить».
- **No field is ever disabled** — not for pending, not for consistency.
- **No temporary UI code** — no status Typography block; stage-2 submit stays a no-op required by `@ui/Form`.
- `@ui/InputFieldGroup` stays unused in SupplyCreate; hooks stay narrow; no god hook.
- React Compiler on — no manual `useMemo`/`useCallback`; `undefined` over `null` per `frontend/docs/code_style.md`.
- Old `SupplySheet` stays untouched and unreachable.

## Review Focus

- Editing the query after a selection (partial retyping, e.g. deleting two characters) must not resurrect a chain as a *selected* variant — the pickers keep the fill but no variantId. Pinned by Task 2 test "keeps the query selection only while the query holds it" — file `SupplyPage.browser.test.tsx`.
- An exactly-typed existing type/material name must not silently become a new entity with the same name on submit (duplicate-name guard is stage 3's resolver; prototype must still require an explicit pick — typed text alone leaves `typeId` null and serializes as a *new* type). Pinned by Task 1 unit test "treats typed names as new entities".
- Typing a variant name over a query-selected variant must not leave unit/qty decoupled from the (now manual) chain — unit select stays filled and is the chain's unit. Pinned by Task 2 test "keeps the unit as the manual chain's unit after the selection is cleared".
- Empty catalog: no types → type free text; no materials → material list empty while typing filters nothing (no crash). Pinned by Task 2 test "keeps the target pickers usable with an empty catalog".
- Enter in the closed query picker submits the whole form (chain validated) — stage-1 behavior must survive. Pinned by Task 2 test "submits on enter once the query list is closed".

---

### Task 1: Schema and draft for the unified target

**Files:**
- Modify: `frontend/src/features/Supply/SupplyCreate/supplyForm.ts`
- Modify: `frontend/src/features/Supply/SupplyCreate/supplyForm.test.ts`

**Interfaces:**
- Consumes: `Unit`/`UnitSchema` (`@/features/units`), `amountField`/`decimalPlaces` (`supplyFormRules`).
- Produces (Task 2 consumes):
  - `SupplyFormValues = { variantId: number | null; typeId: number | null; typeName: string; materialId: number | null; materialName: string; variantName: string; unit: Unit | null; quantity/price/supplierName/description/url: string }`
  - `SupplyDraft = { target: TargetDraft; quantity: number; purchasePrice: number; supplierName: string; description?; url? }` where `TargetDraft = { kind: "existing"; variantId: number } | { kind: "new"; typeId: number | undefined; typeName: string | undefined; materialId: number | undefined; materialName: string; variantName: string; unit: Unit }`
  - `supplyFormDefaults` (new fields empty defaults), `createSupplyFormSchema()` factory unchanged signature. Module-level `supplyFormSchema = createSupplyFormSchema()` stays (hoisted before `useSupplyForm` uses it — Task 2 file already does).

- [ ] **Step 1: Rewrite `supplyForm.test.ts` to the new contract (RED)**

Test cases (name → assertion), one `describe` per block, using `createSupplyFormSchema().safeParse`:

1. `accepts an existing variant draft` — `{ variantId: 100, unit: "meters", quantity: "8", price: "24000", supplierName: "Столярный двор", ...empty chain fields }` → `target = { kind: "existing", variantId: 100 }`, `purchasePrice 24000`, `description undefined`.
2. `accepts a manual chain draft` — `variantId null`, `typeName "Пиломатериал"`, `materialName "Ясень"`, `variantName "Доска 40 мм"`, `unit "meters"` → `target.kind "new"`, `target.typeId undefined`, `target.typeName "Пиломатериал"`, no purchasePrice confusion.
3. `keeps existing ids when the query picked type and material` — variantId null, `typeId 1`, `typeName "Пиломатериал"`, `materialId 10`, `materialName "Дуб"`, `variantName "Доска 50 мм"`, unit pieces → `target.kind "new"`, `typeId 1`, `materialId 10`, `unit "pieces"`.
4. `reports the chain as one question when everything is empty` — all chain fields empty + variantId null → variant error `Выберите материал` and **no** `Укажите тип`/`Укажите материал`/`Укажите вариант`/`Укажите единицу` errors.
5. `reports missing chain parts per field` — variantId null, any chain field present (e.g. `variantName "Доска 40 мм"` only) → errors: `Укажите тип` at typeName, `Укажите материал` at materialName, `Укажите единицу` at unit; variant error `Выберите материал` also present.
6. `treats typed names as new entities` — variantId null, `typeName "Дуб"` (matches an existing name but no typeId), `materialName "Ясень"`, `variantName "Доска"`, unit meters → `target.typeId undefined`, `target.typeName "Дуб"` (no silent id).
7. quantity/price/supplier + unit-scale rules unchanged from stage 1 (pieces integer, meters 3 decimals) — keep the existing stage-1 cases, updated with `unit` in values where required.

- [ ] **Step 2: Run to verify RED**

Run: `pnpm --filter frontend exec vitest run --project unit src/features/Supply/SupplyCreate/supplyForm.test.ts`
Expected: FAIL — new fields unknown to current schema (TS/parse errors).

- [ ] **Step 3: Implement the schema in `supplyForm.ts`**

Structure (messages are the pinned contract):
- `SupplyFormValues` per Produces; `supplyFormDefaults` zero values.
- Chain check inside `superRefine`: when `variantId === null` — if **all** of `typeName/materialName/variantName/unit` are empty → error `Выберите материал` at `variantId` only; otherwise per-missing-part errors: `typeId === null && !typeName.trim()` → `Укажите тип` at `typeName`; `materialId === null && !materialName.trim()` → `Укажите материал` at `materialName`; `!variantName.trim()` → `Укажите вариант` at `variantName`; `unit === null` → `Укажите единицу` at `unit`.
- Keep `variantId`'s refine message `Выберите материал` and the quantity/price/supplier rules as-is.
- Transform → `SupplyDraft`: `variantId !== null` → `{ kind: "existing", variantId }`; else chain fields: `typeId ?? undefined`, `typeName || undefined`, `materialId ?? undefined`, `materialName` (trimmed), `variantName` (trimmed), `unit` (non-null at this point).

- [ ] **Step 4: Run to verify GREEN**

Run: `pnpm --filter frontend exec vitest run --project unit src/features/Supply/SupplyCreate/supplyForm.test.ts`
Expected: PASS (all cases).

Note: `SupplyCreate/page tests` may break until Task 2 wires the new fields — the task's gate is the unit file; page-browser red is recorded as expected (ledger ruling), fixed in Task 2.

- [ ] **Step 5: Commit**

```bash
git add frontend/src/features/Supply/SupplyCreate/supplyForm.ts frontend/src/features/Supply/SupplyCreate/supplyForm.test.ts
git commit -m "feat: unified-target schema and draft for supply create"
```

(Git permitted? ask/handle at execution — see handoff; if user re-imposed no-git, this and Task 2's commit are skipped and recorded in the ledger.)

---

### Task 2: TargetPickers, catalog materials, wiring, tests and stories

**Files:**
- Modify: `frontend/src/features/Material/useMaterialsCatalog.ts` (add `materials` to return: `(material.query.data ?? []).filter(r => !r.deleted_at)` typed as the material schema row)
- Create: `frontend/src/features/Supply/SupplyCreate/TargetPickers/index.tsx`
- Modify: `frontend/src/features/Supply/SupplyCreate/useMaterialSearch.ts` (return `materials`, `types` from the catalog)
- Modify: `frontend/src/features/Supply/SupplyCreate/useSupplyForm.ts` (`setTarget(row: MaterialCatalogRow)` fills chain display values; `clearQueryTarget()` only nulls `variantId`; `useWatch` `unit`; return `unit`)
- Modify: `frontend/src/features/Supply/SupplyCreate/index.tsx` (remove `createTarget`/`create` prop; render `TargetPickers`; unit from form watch; submit label «Сохранить»)
- Modify: `frontend/src/router/pages/MaterialPage/SupplyPage/SupplyPage.browser.test.tsx`
- Modify: `frontend/src/features/Supply/SupplyCreate/SupplyCreate.stories.tsx`
- Test: `frontend/src/features/Supply/SupplyCreate/TargetPickers/TargetPickers.browser.test.tsx`

**Interfaces:**
- Consumes: Task 1's `SupplyFormValues`/`SupplyDraft`; `OptionPicker` (`results`, `create={createLabel, onCreate}`, `onValueChange`, `onSelect`); `FormInputField`/`FormSelectField` (`@ui/...`, connected `control`); `UnitOptions` (`@/features/units`); `useZodForm`; catalog `types`/`materials` rows.
- Produces: `TargetPickers` default export:

```tsx
interface Props {
  form: UseFormReturn<SupplyFormValues, unknown, SupplyDraft>;
  types: { id: number; name: string }[];
  materials: { id: number; name: string; material_type_id: number }[];
}
```

Renders fields in one `grid grid-cols-2 gap-4` (stage-1 rhythm) above `DetailsFields`, **all inside the single form**:
- «Тип» — `FormField` name `typeName` renders `OptionPicker id="supply-type"`, options = `types` filtered case-insensitively by the field text, `create={createLabel: "Создать тип"}`; `onSelect(type)` → `setValue typeId, typeName` + clear variantId; text change → `typeName = text`, `typeId = null` (unless it equals the selected type's name), clear variantId.
- «Материал» — when `typeId` is watched non-null: `FormField` name `materialName` renders `OptionPicker id="supply-material-new"`, options = `materials` of that type filtered by text, `create={createLabel: "Создать материал"}`; same select/change rules for `materialId`. When `typeId` is null: plain `FormInputField name="materialName"` (free text) — **the material combobox must not exist in this state**.
- «Вариант» — `FormInputField name="variantName"`; change sets `variantName`, clears `variantId`.
- «Единица» — `FormSelectField name="unit"`, options `UnitOptions`; change clears `variantId`.

`useSupplyForm` additions: `setTarget(row)` sets `variantId, unit, typeId=material.id, typeName=material.materialTypeName, materialId, materialName=material.name, variantName` (clearErrors on those + `variantId`); `clearQueryTarget()` sets `variantId: null` only; expose `unit` via `useWatch`.

- [ ] **Step 1: Write the failing unit/cascade tests**

**`TargetPickers.browser.test.tsx`** — renders `<Form>` + `TargetPickers` with the full `supplyFormSchema` (no submit) inside `QueryClientProvider` + `MemoryRouterStub not needed` (no Link inside). Harness:

```tsx
const renderPickers = async (types, materials) => {
  const form = ... useZodForm in a wrapper component (RenderPickers harness inside the test file,
  defaultValues with typeName pre-populated)  // render with render()
};
```

Tests:
1. `lists existing types and creates a typed one` — open «Тип»: options «Пиломатериал»; type «Ясень»; create row «Создать тип»; select option → typeId-watch observable via the material combobox appearing.
2. `scopes materials to the chosen type` — pick «Пиломатериал» → open «Материал»: option «Дуб» + «Создать материал»; select «Дуб».
3. `keeps material free text when the type is new` — type «Ясень» into «Тип» (no select) → «Материал» is a plain input: `expect.element(getByLabelText("Материал")).not.toHaveAttribute("role", "combobox")`.
4. `reports missing parts on validation` — fill only `variantName` + `unit`, submit → errors `Укажите тип`/`Укажите материал` present.
5. `clears the query selection when a picker changes` — defaults with `variantId: 100` (preset via `form.setValue`) → change «Вариант» text → submit → **no** `Выберите материал` error (variantId was cleared; chain then validates normally).

**`useMaterialsCatalog` unit test** (if a unit file exists — extend it): `returns materials` — assert `materials.length` after stubbing the three queries; if the file doesn't exist, cover via the page suite instead (allowed; note in ledger).

- [ ] **Step 2: Run to verify RED**

Run: `pnpm --filter frontend exec vitest run --project browser src/features/Supply/SupplyCreate/TargetPickers`
Expected: FAIL — component missing.

- [ ] **Step 3: Implement `TargetPickers` + catalog/search/form edits per Interfaces**

- [ ] **Step 4: Run to verify GREEN**

Run: `pnpm --filter frontend exec vitest run --project browser src/features/Supply/SupplyCreate/TargetPickers`
Expected: PASS (5 tests).

- [ ] **Step 5: Wire `SupplyCreate` and rewrite the page tests (RED then GREEN)**

`index.tsx`: drop `createTarget`; render:

```tsx
<TargetPickers form={form} types={material.types} materials={material.materials} />
<DetailsFields control={control} unit={unit} unitCost={unitCost} />
```

`unit` now watched from the form (`useSupplyForm()` return); `handleQueryChange` uses `clearQueryTarget()`; `handleSelect` uses the new `setTarget(row)`; button label `Сохранить`; `FormField` name `variantId` keeps `label="Материал"`, placeholder and stage-1 loading/no-hint behavior; **no `create` prop**.

`SupplyPage.browser.test.tsx`: delete `offers create immediately` and `keeps create available when nothing matches`; in `reports missing values on submit` submit button → «Сохранить» and expected errors per the Review-Focus case (all empty → only `Выберите материал`); `submits the form on enter…` keeps Enter flow (button role name «Сохранить»). Add:

1. `fills the target pickers from the search selection` — «Материал» query → select «Доска 40 мм» → expect «Тип» input value `Пиломатериал`, «Материал» value `Дуб`, «Вариант» value `Доска 40 мм`, unit select value `м`.
2. `keeps the query selection only while the query holds it` — select, then clear the query field chars one by one → pickers keep values; press «Сохранить» → no `Выберите материал` error.
3. `starts a manual chain when a picker is edited after a selection` — select «Доска 40 мм», set «Вариант» to `Доска 50 мм`, click «Сохранить» → no `Выберите материал` error; «Тип»/«Материал» keep values.
4. `keeps the unit as the manual chain's unit after the selection is cleared` — select (unit `м`), edit «Вариант», assert unit select still shows `м` and details unit label is `м`.
5. `keeps the target pickers usable with an empty catalog` — stub empty routes (`/api/material-type`, `/api/material`, `/api/material-variant` → `[]`; add `supplyPageEmptyRoutes` to `testFixtures.ts`): focus «Тип» typed text accepted; «Материал» stays plain text; no crash.
6. `submits on enter once the query list is closed` — unchanged stage-1 flow with «Сохранить».

Run the page suite first (its new cases are RED — `TargetPickers` is not on the page yet), then wire `index.tsx`, `useSupplyForm` and `useMaterialSearch` per Interfaces, and re-run: GREEN.

- [ ] **Step 6: Run the full gates**

Run: `pnpm --filter frontend typecheck && pnpm --filter frontend lint && pnpm --filter frontend test && pnpm --filter frontend test:browser`
Expected: silent/silent; unit = 163 baseline ± changes from `supplyForm.test.ts` rewrite; browser = baseline (+~11 new) report actuals.

Note: `DetailsFields` needs no change except that `unit` may now be non-null while `material.selected` is null — assert via the page suite.

- [ ] **Step 7: Stories**

`SupplyCreate.stories.tsx` redefine: `Default` (empty page, pickers visible), `Search` (options open), `Selected` (query-selected AND pickers filled), `ManualDraft` (chain typed: Ясень / Доска 40 мм / шт), `Loading` (pending stub), `Empty`. Keep the page story untouched except its own body text.

- [ ] **Step 8: Commit**

```bash
git add frontend/src/features/Supply/SupplyCreate frontend/src/features/Material/useMaterialsCatalog.ts frontend/src/router/pages/MaterialPage/SupplyPage docs/product/ux/materials/supply-create/workflow.md docs/superpowers/specs/2026-11-01-supply-unified-target-design.md docs/superpowers/plans/2026-11-01-supply-unified-target.md
git commit -m "feat: unified target pickers for supply create"
```
