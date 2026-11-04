# SupplyCreate stage 2 — unified target (search + type/material/variant/unit pickers)

## Intent and why

Stage 1 proved the flat supply page with a search picker and an always-present «Создать» row whose
mode never opened. Stage 2 replaces the mode approach — after user review, the contract was
revised (see `docs/product/ux/materials/supply-create/workflow.md`, «Target pickers»): both search
and creation are always visible, in one form, with no mode branching, no seeding and no disabling.
This is the live-code prototype layer for the can't-find-chain case; like stage 1 it is reviewed
through Storybook and browser tests.

## Goals

- Query (OptionPicker) finds existing variants; it is not part of the form; no create row.
- Four target pickers are part of the form: Тип (existing-or-new), Материал (per existing chosen
  type via picker + create row; free text when the type is new or absent), Вариант (free text),
  Единица (pieces/meters).
- Selecting a query result fills the pickers with the chain; editing any picker state-clears the
  query selection (mutual exclusion, never disabled).
- Details' unit follows the target: picked variant's unit, or the picked «Единица».
- Submit label becomes «Сохранить»; still a stage prototype (resolve + report draft, no API).
- All this in one RHF form; `createSupplyFormSchema` grows the target fields (variantId stays the
  resolution target; draft carries the typed chain).

## Non-goals

- Real save, chain creation mutations, supplier resolution (stage 3).
- Editing/deleting variants; batch entry; supplier management.
- Any disabling of form fields.

## Approaches

- **A (chosen): unified always-visible target.** One form, zero modes, case table collapses; the
  user states the chain or searches it — simplest mental model, agreed by the user.
- **B (rejected): creation mode under the target field, query-seeded.** The original contract's
  three-case table; rejected in review as invisible inference + mode branching, submit/cancel
  labels changing per state.
- **C (rejected): wizard panels** (old flow's shape) — nested forms and step scoping, already
  superseded.

## Constraints

- Reuse `OptionPicker` for Тип and Материал; reuse `FormInputField`/`FormSelectField` contracts.
- Keep UI copy out of hooks; hooks stay narrow; details/DraftFields extract stays.
- No disabled fields anywhere; pending state uses the `@ui/Button pending` convention.
- Schema stays a module-level factory; unit/quantity rules from `supplyFormRules`.
- Old `SupplySheet` stays untouched and unreachable.

## Left to the builder

- Exact picker ergonomics for «existing-or-new» (typing filters options; create row labeled for
  type/material explicitly, e.g. «Создать тип»).
- How chain values serialize into the draft (`SupplyDraft`) for stage 3's resolver.
- Story/test list (form states, query-selection fill/clear, cascade, validation).

## Verification

- typecheck, lint, unit, browser green; stories for: empty, search-selected (pickers filled),
  manual chain typed, mixed (select then edit picker clears), no-type catalog, save-button «Сохранить».

## Status

Awaiting approval.
