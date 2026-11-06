# SupplyCreate stage 2b (target pickers commit) Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make the three target fields true pickers — text filters, a result row commits an existing entity, a create row commits a new name — so nothing the user merely typed is ever submitted.

**Architecture:** `supplyForm.ts` gains three query strings and validates a level as committed when it holds an id **or** a create-intent name; the draft keeps its stage-2 shape. `TargetPickers` renders three `OptionPicker`s (results + explicit create row) over the committed targets, owns the type → material → variant → unit cascade, and reports edits to the page so the search selection clears. The search field keeps committing the whole chain.

**Tech Stack:** React 19, react-hook-form + zod (`@ui/Form`), `@ui/OptionPicker`, `@ui/SelectField`, `@ui/InputFieldGroup`, Vitest unit/browser, Storybook.

**Spec:** `docs/superpowers/specs/2026-11-04-supply-target-pickers-design.md`

## Global Constraints

- UI copy is Russian and pinned: create rows «Создать тип «X»», «Создать материал «X»», «Создать вариант «X»»; missing targets «Выберите или создайте тип» / «…материал» / «…вариант»; missing unit «Выберите единицу». Submit stays «Сохранить».
- A picker's text is a query: it is never submitted and never becomes a value without a click. A level is committed iff `*Id !== null || *Name !== ""`; exactly one of them is set.
- **No field is ever disabled.** No modes, no extra chrome, no hint lines under the pickers.
- No transforming fields in the zod schema (zod v4 aborts chained checks) — all conditional rules stay in one object-level `superRefine`; the draft transform converts at the end.
- React Compiler on — no manual `useMemo`/`useCallback`. `undefined` over `null` outside RHF discriminator fields (`frontend/docs/code_style.md`).
- Field grouping follows `frontend/docs/form_conventions.md`: `FieldGroup` from `@ui/InputFieldGroup`, `FormField` for composite values, `TargetPickers` reads the form via `useFormContext` (no `form` prop).
- **No git operations.** The user reviews and commits; there are no commit steps in this plan.
- Stage 3 (real save) is out of scope; `useSupplyForm.submit` stays a no-op.

## Review Focus

- **Enter on the create row must create, not submit.** With the list open and only the create row matching, Enter commits the creation and leaves the form unsubmitted.
- **An existing name in another case must not offer a create row.** Typing «пиломатериал» over «Пиломатериал» shows only the option — no duplicate name can reach the 409.
- **Re-picking the same existing type must keep the linked material.** Same-id re-pick is a no-op (stage-2 review regression).
- **Typing in «Поиск» must not release a chain built through the pickers.** The search only releases what the search itself set (`selected`).
- **Changing Единица after picking an existing variant must release that variant** (a variant has one unit), leaving an uncommitted name, not a mismatched pair.

## File Structure

- `SupplyCreate/supplyForm.ts` — values, defaults, commit validation, draft. Task 1.
- `SupplyCreate/supplyForm.test.ts` — the contract, unit-level. Task 1.
- `SupplyCreate/TargetPickers/index.tsx` — three committed pickers, cascade, unit rule. Task 2.
- `SupplyCreate/TargetPickers/TargetPickers.browser.test.tsx` — picker behavior with committed-value probes. Task 2.
- `SupplyCreate/useSupplyForm.ts` — search-driven commits (`setTarget`, `clearQueryTarget`). Task 2.
- `SupplyCreate/useMaterialSearch.ts` — `clear()` for picker edits. Task 2.
- `SupplyCreate/index.tsx` — sources (`materials`, `types`, `variants`), wiring, search picker. Task 2.
- `SupplyPage/SupplyPage.browser.test.tsx` — page journeys. Task 3.
- `SupplyCreate/SupplyCreate.stories.tsx` — story states. Task 3.
- `docs/product/ux/materials/supply-create/workflow.md`, `frontend/docs/form_conventions.md` — contract and convention. Task 3.

---

### Task 1: Form contract — query fields, commit validation, draft

**Files:**
- Modify: `frontend/src/features/Supply/SupplyCreate/supplyForm.ts`
- Modify: `frontend/src/features/Supply/SupplyCreate/supplyForm.test.ts`
- Modify (copy assertions only, logic untouched): `frontend/src/features/Supply/SupplyCreate/TargetPickers/TargetPickers.browser.test.tsx`, `frontend/src/router/pages/MaterialPage/SupplyPage/SupplyPage.browser.test.tsx`

**Interfaces:**
- Consumes: `Unit`/`UnitSchema` (`@/features/units`), `decimalPlaces`/`parseAmount` (`supplyFormRules`).
- Produces (Task 2 consumes):
  - `SupplyFormValues = { typeQuery: string; typeId: number | null; typeName: string; materialQuery: string; materialId: number | null; materialName: string; variantQuery: string; variantId: number | null; variantName: string; unit: Unit | null; quantity: string; price: string; supplierName: string; description: string; url: string }`
  - `supplyFormDefaults` — queries `""`, ids `null`, names `""`, unit `null`, details as today.
  - `SupplyDraft` / `TargetDraft` unchanged except `TargetDraft["new"]["materialName"]` becomes `string | undefined` (a name exists only when that level is being created).
  - `createSupplyFormSchema()` — same signature.

- [ ] **Step 1: Rewrite `supplyForm.test.ts` to the commit contract (RED)**

Keep the existing `parse` helper style and replace the cases with these (all use a shared base):

```ts
const base = {
  ...supplyFormDefaults,
  quantity: "8",
  price: "24000",
  supplierName: "Столярный двор",
};
const existing = {
  ...base,
  typeQuery: "Пиломатериал", typeId: 1,
  materialQuery: "Дуб", materialId: 10,
  variantQuery: "Доска 40 мм", variantId: 100,
  unit: "meters",
} satisfies SupplyFormValues;
const created = {
  ...base,
  typeQuery: "Пиломатериал", typeName: "Пиломатериал",
  materialQuery: "Ясень", materialName: "Ясень",
  variantQuery: "Доска 40 мм", variantName: "Доска 40 мм",
  unit: "meters",
} satisfies SupplyFormValues;
```

Tests (name → assertion):

1. `accepts an existing variant draft` — `parse(existing).success` → `target` equals `{ kind: "existing", variantId: 100 }`, `purchasePrice 24000`, `description undefined`.
2. `accepts a full create chain` — `parse(created)` → `target` equals `{ kind: "new", typeId: undefined, typeName: "Пиломатериал", materialId: undefined, materialName: "Ясень", variantName: "Доска 40 мм", unit: "meters" }`.
3. `keeps existing levels while creating the variant` — `{ ...created, typeId: 1, typeName: "", materialId: 10, materialName: "", variantName: "Доска 45 мм" }` → `target.kind "new"`, `typeId 1`, `typeName undefined`, `materialId 10`, `materialName undefined`, `variantName "Доска 45 мм"`.
4. `rejects query text without a commit` — `{ ...base, typeQuery: "Пиломатериал", materialQuery: "Ясень", variantQuery: "Доска 40 мм", unit: "meters" }` → fails with issues on `typeName`, `materialName`, `variantName` carrying «Выберите или создайте тип» / «…материал» / «…вариант».
5. `reports each missing level separately` — `{ ...existing, materialId: null, materialQuery: "Ясень" }` → only `materialName` fails, with «Выберите или создайте материал».
6. `requires the unit` — `{ ...created, unit: null }` → fails on `unit` with «Выберите единицу».
7. `never puts query text into the draft` — `{ ...existing, typeQuery: "zzz", materialQuery: "zzz", variantQuery: "zzz" }` → same `target` as case 1.
8. `trims committed names` — `{ ...created, materialName: "  Ясень  " }` → `target.materialName "Ясень"`.
9. `keeps the detail rules` — the stage-1 cases: empty quantity → «Укажите количество»; empty price → «Укажите цену закупки»; empty supplier → «Укажите поставщика»; `unit: "pieces"` with `"1.5"` → «Количество в штуках должно быть целым»; `unit: "meters"` with `"1.2345"` → «Не больше трёх знаков после запятой».

- [ ] **Step 2: Run the unit test to verify it fails**

Run: `pnpm --filter frontend exec vitest run --project unit src/features/Supply/SupplyCreate/supplyForm.test.ts`
Expected: FAIL — unknown fields / wrong messages.

- [ ] **Step 3: Implement the contract in `supplyForm.ts`**

- Extend `SupplyFormValues`, `supplyFormDefaults`, and the zod object with the three `*Query` fields (`zod.string()`), keeping the `*Id` (`zod.number().int().nullable()`) and `*Name` (`zod.string().trim()`) pairs.
- Replace the stage-2 chain branch in `superRefine` with:

```ts
const isCommitted = (id: number | null, name: string) =>
  id !== null || name.trim().length > 0;

if (!isCommitted(values.typeId, values.typeName))
  context.addIssue({ code: "custom", path: ["typeName"], message: "Выберите или создайте тип" });
if (!isCommitted(values.materialId, values.materialName))
  context.addIssue({ code: "custom", path: ["materialName"], message: "Выберите или создайте материал" });
if (!isCommitted(values.variantId, values.variantName))
  context.addIssue({ code: "custom", path: ["variantName"], message: "Выберите или создайте вариант" });
if (values.unit === null)
  context.addIssue({ code: "custom", path: ["unit"], message: "Выберите единицу" });
```

- Keep the detail fields as plain string refines and the quantity/price/supplier/unit-scale rules and their copy exactly as they are; nothing may transform.
- Keep the transform shape; only the draft typing changes:

```ts
target:
  values.variantId !== null
    ? { kind: "existing", variantId: values.variantId }
    : {
        kind: "new",
        typeId: values.typeId ?? undefined,
        typeName: values.typeName || undefined,
        materialId: values.materialId ?? undefined,
        materialName: values.materialName || undefined,
        variantName: values.variantName,
        unit: draftUnit(values.unit),
      },
```

- [ ] **Step 4: Run the unit test to verify it passes**

Run: `pnpm --filter frontend exec vitest run --project unit src/features/Supply/SupplyCreate/supplyForm.test.ts`
Expected: PASS (9 tests).

- [ ] **Step 5: Update only the pinned copy in the two browser suites**

Old component still binds text to values, so behavior tests keep passing; only messages changed:

- `TargetPickers.browser.test.tsx` — «Укажите материал» → «Выберите или создайте материал»; «Укажите тип» → «Выберите или создайте тип» (all occurrences, including the `not.toBeInTheDocument` assertions); in `clears the query selection when a picker changes` assert absence with `screen.getByText(/Выберите или создайте/)`.
- `SupplyPage.browser.test.tsx` — in `reports missing values on submit`, replace the «Выберите материал» assertion with «Выберите или создайте вариант» and the «Укажите единицу» absence with a «Выберите единицу» presence.

- [ ] **Step 6: Verify the whole gate**

Run: `pnpm --filter frontend typecheck && pnpm --filter frontend lint && pnpm --filter frontend test && pnpm --filter frontend test:browser`
Expected: typecheck and lint silent; unit 169/169 (167 − 12 + 14); browser 160/160.

---

### Task 2: TargetPickers commit only picked values

**Files:**
- Modify: `frontend/src/features/Supply/SupplyCreate/TargetPickers/index.tsx`
- Modify: `frontend/src/features/Supply/SupplyCreate/TargetPickers/TargetPickers.browser.test.tsx`
- Modify: `frontend/src/features/Supply/SupplyCreate/index.tsx`
- Modify: `frontend/src/features/Supply/SupplyCreate/useSupplyForm.ts`
- Modify: `frontend/src/features/Supply/SupplyCreate/useMaterialSearch.ts`

**Interfaces:**
- Consumes (Task 1): `SupplyFormValues` with `*Query`/`*Id`/`*Name`, `createSupplyFormSchema`, `supplyFormDefaults`.
- Produces:
  - `TargetPickers({ types, materials, variants, onChainEdit }: { types: { id: number; name: string }[]; materials: { id: number; name: string; material_type_id: number }[]; variants: { id: number; name: string; material_id: number; unit: Unit }[]; onChainEdit: () => void })` — still reads the form through `useFormContext<SupplyFormValues, unknown, SupplyDraft>()`.
  - `useMaterialSearch()` adds `clear: () => void` (empties `query`, drops `selected`).
  - `useSupplyForm().setTarget(row: MaterialCatalogRow)` commits all three levels as existing (queries = names, names = `""`) plus the unit; `clearQueryTarget()` sets `variantId = null` only (keeps the visible variant query).

- [ ] **Step 1: Rewrite `TargetPickers.browser.test.tsx` (RED)**

Harness: one form, `TargetPickers` with fixture rows, `onChainEdit={() => undefined}`, and read-only probes for every committed value:

```tsx
const types = [{ id: 1, name: "Пиломатериал" }, { id: 2, name: "Химия" }];
const materials = [
  { id: 10, name: "Дуб", material_type_id: 1 },
  { id: 11, name: "Ясень", material_type_id: 1 },
  { id: 20, name: "Краситель", material_type_id: 2 },
];
const variants = [
  { id: 100, name: "Доска 40 мм", material_id: 10, unit: "meters" },
  { id: 102, name: "Рейка 20 × 40", material_id: 10, unit: "pieces" },
];
```

Render probes `data-testid="type-id" | "type-name" | "material-id" | "material-name" | "variant-id" | "variant-name" | "unit"` from watched values (`String(value ?? "")`).

Tests (name → assertion):

1. `filters existing types and labels the create row with the typed name` — click Тип; option «Пиломатериал» visible; fill «Ясень» → option «Создать тип «Ясень»» visible, «Пиломатериал» gone.
2. `hides the create row when an existing name is typed in another case` — fill «пиломатериал» → option «Пиломатериал» visible, `Создать тип` absent.
3. `does not commit typed text` — fill Тип «Пиломатериал», Материал «Дуб», Вариант «Доска 40 мм»; probes all `""`; submit → «Выберите или создайте тип», «…материал», «…вариант», «Выберите единицу».
4. `commits a picked result and drops it on edit` — pick «Пиломатериал» → `type-id` `"1"`, field value «Пиломатериал»; fill Тип «Пиломатериал 2» → `type-id` `""`, `type-name` `""`.
5. `commits a create row` — fill Тип «Металл» → click «Создать тип «Металл»» → `type-name` `"Металл"`, `type-id` `""`.
6. `scopes materials to the picked type and keeps them on a same-id re-pick` — no type → no material options; pick «Пиломатериал» → «Дуб», «Ясень»; pick «Дуб» → `material-id` `"10"`; re-pick «Пиломатериал» → `material-id` still `"10"`.
7. `scopes variants to the picked material and seeds the unit` — pick type + Дуб → variant options «Доска 40 мм», «Рейка 20 × 40»; pick «Доска 40 мм» → `variant-id` `"100"`, `unit` `"meters"`.
8. `type change clears material and variant` — commit type/material/variant; pick «Химия» → `material-id`, `variant-id`, `material-name`, `variant-name` all `""`.
9. `material change clears the variant only` — commit type/material/variant; pick «Ясень» → `material-id` `"11"`, `variant-id` `""`, `type-id` `"1"`.
10. `unit change releases an existing variant but keeps a create intent` — commit an existing variant, change Единица → `variant-id` `""`, variant field empty; commit variant via create row, change Единица → `variant-name` stays.
11. `creates from an empty catalog` — render with no types/materials/variants; type into each field and commit the create rows → names committed, ids empty, no crash.
12. `revalidates after a failed submit` — submit empty → errors; pick type → «Выберите или создайте тип» gone.
13. `commits the create row on Enter instead of submitting` — fill Тип «Металл», press Enter → `type-name` `"Металл"`; «Укажите количество» absent.

- [ ] **Step 2: Run the browser suite to verify it fails**

Run: `pnpm --filter frontend exec vitest run --project browser src/features/Supply/SupplyCreate/TargetPickers`
Expected: FAIL on the new commit/cascade assertions.

- [ ] **Step 3: Implement the pickers in `TargetPickers/index.tsx`**

Keep `matches(name, text)` and add `hasExact(rows, text)` (`normalizeName` equality). State comes from nine `useWatch` calls (`*Query`, `*Id`, `*Name`). Every write uses `setValue(..., { shouldDirty: true, shouldValidate: true })`, and every handler ends with `onChainEdit()`.

Handler contracts (exact writes; `set` means the three-field group):

| Handler | Writes |
| --- | --- |
| `chooseType(type)` | no-op when `type.id === typeId && typeName === ""`; `typeId = type.id`, `typeName = ""`, `typeQuery = type.name`; if the id actually changed, clear material + variant |
| `editType(text)` | no-op when `text === typeQuery`; `typeQuery = text`, `typeId = null`, `typeName = ""`; if the level was committed before the edit, clear material + variant |
| `createType()` | `name = typeQuery.trim()`; no-op when empty or already `typeName === name`; `typeId = null`, `typeName = name`; if the level was committed before, clear material + variant |
| `chooseMaterial(row)` | no-op when `row.id === materialId && materialName === ""`; `materialId = row.id`, `materialName = ""`, `materialQuery = row.name`; if the id actually changed, clear the variant group |
| `editMaterial(text)` / `createMaterial()` | same shape as the type pair, clearing the variant group |
| `chooseVariant(row)` | no-op when `row.id === variantId && variantName === ""`; `variantId = row.id`, `variantName = ""`, `variantQuery = row.name`, `unit = row.unit` |
| `editVariant(text)` | no-op when `text === variantQuery`; `variantQuery = text`, `variantId = null`, `variantName = ""` |
| `createVariant()` | `variantName = variantQuery.trim()` (no-op when empty or already committed), `variantId = null` |
| `changeUnit(unit)` | `unit = unit`; if `variantId !== null`, also `variantId = null`, `variantName = ""`, `variantQuery = ""` (a create-intent variant stays) |

Clear material = `materialQuery = ""`, `materialId = null`, `materialName = ""`. Clear variant = `variantQuery = ""`, `variantId = null`, `variantName = ""`. No handler writes `unit` except `chooseVariant` and `changeUnit`.

Unit handler: `setValue("unit", unit)`; if `variantId !== null`, clear `variantId` and `variantName` and `variantQuery`; if the variant is a create intent, leave it.

Render three `OptionPicker`s bound as `value={*Query}`, `error` from a `FormField` on `*Name`, `inputRef={field.ref}`:

```tsx
create={query.trim() && !hasExact(rows, query)
  ? { createLabel: `Создать тип «${query.trim()}»`, onCreate: createType }
  : undefined}
```

- Тип results: `types.filter((t) => matches(t.name, typeQuery))`.
- Материал results: `typeId === null ? [] : materials.filter((m) => m.material_type_id === typeId).filter((m) => matches(m.name, materialQuery))`.
- Вариант results: `materialId === null ? [] : variants.filter((v) => v.material_id === materialId).filter((v) => matches(v.name, variantQuery))`.
- Единица stays `FormSelectField` with `UnitOptions` and the unit handler.
- Delete the plain-text material fallback (`FormInputField` branch).
- Keep the `FieldGroup className="grid gap-5 sm:grid-cols-2"` grid.

- [ ] **Step 4: Wire the page (`useMaterialSearch`, `useSupplyForm`, `SupplyCreate`)**

- `useMaterialSearch`: add `const clear = () => { setQuery(""); setSelected(null); };` and return it.
- `useSupplyForm.setTarget`: also set `typeQuery` / `materialQuery` / `variantQuery` to the row names and each `*Name` to `""`; keep unit and error clearing.
- `useSupplyForm.clearQueryTarget`: only `setValue("variantId", null)`.
- `SupplyCreate`: add `const { variants } = useVariant();`; render `<TargetPickers types={types} materials={materials} variants={variants} onChainEdit={material.clear} />`; render the search picker directly (no `FormField`: its text is page state, not a form value — the form's `variantQuery` is owned by the pickers); keep `handleQueryChange` releasing the target only when `material.selected` is set.

- [ ] **Step 5: Run the picker suite and the page suite**

Run: `pnpm --filter frontend exec vitest run --project browser src/features/Supply/SupplyCreate/TargetPickers src/router/pages/MaterialPage/SupplyPage`
Expected: picker suite PASS (13); page suite PASS unchanged. Two stage-2 page assertions still check for «Выберите материал», a message that no longer exists — they pass vacuously and Task 3 replaces them with the variant error; do not rewrite them here.

- [ ] **Step 6: Verify the whole gate**

Run: `pnpm --filter frontend typecheck && pnpm --filter frontend lint && pnpm --filter frontend test && pnpm --filter frontend test:browser`
Expected: silent typecheck/lint; unit 169/169; browser green.

---

### Task 3: Page journeys, stories, and the written contract

**Files:**
- Modify: `frontend/src/router/pages/MaterialPage/SupplyPage/SupplyPage.browser.test.tsx`
- Modify: `frontend/src/features/Supply/SupplyCreate/SupplyCreate.stories.tsx`
- Modify: `docs/product/ux/materials/supply-create/workflow.md`
- Modify: `frontend/docs/form_conventions.md`

**Interfaces:**
- Consumes: the Task 2 picker behavior and Task 1 copy; no new production interfaces.

- [ ] **Step 1: Update and extend the page suite**

Keep the passing stage-2 journeys; change/add:

1. `fills the target pickers from the search selection` — after selecting «Доска 40 мм», Тип/Материал/Вариант show the chain names and Единица shows «метр».
2. `keeps the query selection only while the query holds it` — edit «Поиск» → pickers keep the names; submit → «Выберите или создайте вариант».
3. `keeps a chain built through the pickers when the search field is typed into` — commit type/material/variant through the pickers, type into «Поиск» without selecting, submit → no target errors (details errors only).
4. `does not submit typed but unpicked names` — fill all three pickers by typing only, submit → «Выберите или создайте тип/материал/вариант» and «Выберите единицу», no details errors suppressed.
5. `creates the variant through the create row` — pick type and material, type «Доска 45 мм», click «Создать вариант «Доска 45 мм»», pick Единица, submit with details → no target errors.
6. `keeps the target pickers usable with an empty catalog` — create rows commit all three levels.

- [ ] **Step 2: Run the page suite**

Run: `pnpm --filter frontend exec vitest run --project browser src/router/pages/MaterialPage/SupplyPage`
Expected: PASS.

- [ ] **Step 3: Update the stories**

Replace `ManualDraft` (which types without picking) and add:

- `TypedNotCommitted` — play types into all three fields and leaves them uncommitted; screenshot shows no selected state.
- `Committed` — play picks «Пиломатериал» → «Дуб» → «Доска 40 мм»; unit seeded.
- `CreateIntent` — play types «Химия», commits «Создать тип «Химия»» and likewise material/variant.
- Keep `Default`, `Loading`, `Search`, `Selected`, `Validation`, `NoResults`, `Empty`; update `Validation` to submit the empty form (four target errors + details).

- [ ] **Step 4: Verify the story states render**

Run: `pnpm --filter frontend storybook` (leave running), then open
`http://localhost:6006/?path=/story/features-supply-supplycreate--committed` and the three new stories.
Expected: each picker shows committed names for `Committed`/`CreateIntent`; `TypedNotCommitted` shows the typed text with no committed chain; no console errors.

- [ ] **Step 5: Rewrite the target-picker contract in `workflow.md`**

Replace the picker table and its bullets with the commit model:

| Field    | Control |
| -------- | ------- |
| Тип      | options of existing types + «Создать тип «X»» when the typed name is new |
| Материал | options scoped to a picked existing type + «Создать материал «X»»; a new or absent type offers only the create row |
| Вариант  | options scoped to a picked existing material + «Создать вариант «X»» |
| Единица  | pieces / meters select |

Add the rules: text is a query, never a value; a level is committed only by a result row or a create row; editing clears that commit and its dependants (type → material → variant); changing Единица releases an existing variant; typing in «Поиск» releases only a search selection; the search selection fills the three pickers as committed existing values. Update the States bullets: no types / no materials mean “only create rows”, not free text. Update the project-prototype paragraph to name this behavior (pickers commit; typed text is not a value) instead of the stage-2 free-text wording.

- [ ] **Step 6: Add the picker rule to `form_conventions.md`**

One bullet under the field rules: a picker's input is a query/filter and never the submitted value; the form keeps the committed selection separately (id + create-intent name), and a create action is an explicit row, not submit-time inference.

- [ ] **Step 7: Verify the whole gate**

Run: `pnpm --filter frontend typecheck && pnpm --filter frontend lint && pnpm --filter frontend test && pnpm --filter frontend test:browser`
Expected: silent typecheck/lint; unit 169/169; browser green with the updated page suite.
