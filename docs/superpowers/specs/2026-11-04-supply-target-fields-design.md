# Supply target fields extraction — design

## Intent

`SupplyCreate` currently owns the search field end to end: `useMaterialSearch`, the three catalog
hooks, the query/loading/options derivation, the search handlers and the picker JSX. That is most
of the page file, and it is also the only place that wires the search to the three pickers through
`onChainEdit={material.clear}`. Extract it into a `TargetFields` section, sibling of
`DetailsFields`, so the page reads as form + target + details + submit.

## Goals

- `TargetFields` owns `useMaterialSearch`, `useMaterial`, `useMaterialType`, `useVariant`, the
  search derivation and handlers, the search commit/release writes, and renders the «Поиск»
  `OptionPicker` above `TargetPickers`.
- `onChainEdit` becomes internal (`material.clear`); no reset prop, effect, ref or key-remount.
- `SupplyCreate` keeps only `useSupplyForm`, `unitCost`, `<TargetFields />`,
  `<DetailsFields … />` and the submit button.
- No change to behavior, copy, ids, markup structure, or test expectations.

## Non-goals

- `useMaterialSearch`, `TargetPickers`, `DetailsFields` and `supplyForm.ts` keep their current API
  and behavior.
- No new tests or stories; the existing page (12) and picker (15) browser suites are the coverage,
  because the extraction moves wiring without changing what a user or test observes.
- No visual or accessibility change.

## Anti-goal

A prop/effect/ref API that lets the page reset the search after a picker edit. Needing one means the
extraction left the coupling in place.

## Approaches

- **A (chosen): section owns the form writes.** `TargetFields` reads the form through
  `useFormContext`, the same way `TargetPickers` already does. The search commit (write
  type/material/variant ids and queries plus unit, clear the four target errors) and the release on
  typing (`variantId = null`) move out of `useSupplyForm` into the section, beside the search that
  calls them. The page passes no target props.
- **B (rejected): keep the commits in `useSupplyForm` and pass them to `TargetFields`.** The page
  would still destructure and wire two callbacks, and the section would not be self-contained; the
  only gain is keeping form-shape writes in one hook, which `TargetPickers` already does not.

## The change

- New `frontend/src/features/Supply/SupplyCreate/TargetFields/index.tsx` (folder per the
  `DetailsFields` and `TargetPickers` convention).
- Move `setTarget` and `clearQueryTarget` out of `useSupplyForm` into `TargetFields`, keeping the
  exact writes and flags: `setValue(..., { shouldDirty: true })` only (no `shouldValidate`, per the
  Task 2 ruling) and `clearErrors(["unit", "typeName", "materialName", "variantName"])`.
  `useSupplyForm` returns `{ form, quantity, price, unit, submit }`.
- `SupplyCreate` renders `Form` → `TargetFields` → `DetailsFields` → button, and drops the catalog,
  search and picker imports, the derived values and the two handlers.
- `TargetPickers` is untouched; `onChainEdit={material.clear}` moves into `TargetFields`.

## Constraints

- Project rules: no comments unless extraordinary; React Compiler on (no manual memoization);
  `@ui/*` imports only; import grouping per lint.
- Pinned copy, ids (`supply-query`, `supply-type`, `supply-material`, `supply-variant`) and the
  `autoFocus` on the search field stay as they are.
- No git operations; the user reviews and commits.

## Left to the builder

- Whether the two commit helpers stay as local functions in `TargetFields/index.tsx` (default; the
  file lands around 90 lines, in line with `TargetPickers`) or become a small `useTargetCommit` in
  the same folder. Default keeps one fewer file and no new hook API.

## Verification

Typecheck, lint and prettier silent; unit 169/169; browser 167/167 with no test edits.
