# OptionPicker — baseline redesign on cmdk

Replaces the OptionPicker parts of `2026-11-07-command-menu-design.md` (§Consumers). The previous
migration was rebuilt from user rulings; those rulings, made in planning on 2026-11-07, are the
design authority here. `useCommandMenu` and the `@base/command` composition survive unchanged.

## User rulings (hard)

1. **Create row first** — in the DOM and on screen; it is also the **default active row** («first
   option = create row»). No DOM/visual order inversion, no CSS reordering, no controlled selection.
2. **The picker owns filtering.** No requirement that a parent filters anything. Consumers pass
   full candidates. Empty text matches everything (simplest rule).
3. **No controlled text.** `query`/`onQueryChange` die. The form stores **values only**
   (`{existing id}` or `{createIntent name}` per level); typed text is the picker's local state.
   SearchField commits the three pickers by **setting values, not texts**.
4. **Everything without a hard reason is removed.** Kept props are audited below.
5. **Baseline first, UX polish later** — e.g. showing a create-intent on draft reopen is the
   picker's own future UX concern, not a form prop.

## The model

```
FORM STORES (per target level: type │ material │ variant │ supplier):
  commitment = {existing: id}  or  {createIntent: name}  or  none      # exactly one arm
  unit (variant level only)

PICKER OWNS:  text (typing state), open (list state)

DERIVED (no state): candidates = options filtered by text over label + meta
                    createRow   = create?.(text)
                    display     = text ≠ "" ? text : labelOf(value, options)
                    expanded    = open ∧ (candidates ∨ createRow)
```

Transitions, one picker:

```
type char      → text ← next ; onTextChange(next)        # release lives in the parent
pick option    → onSelect(id) ; close()                  # parent writes {existing: id}
pick create    → createRow.onCreate() ; close()          # parent writes {createIntent: name}
Escape         → close() ; text kept ; next key reopens
Tab / outside  → close() ; text kept
Enter, closed  → input stopPropagation → form submits
activeRow      → cmdk defaults with create DOM-first: create on open; falls back to row 1
                 (create when present) when the active option leaves the list
```

## Component connection

- **TargetPickers** — three two-state pickers. Scope flows down (material candidates need a
  committed existing type; variant variants need a committed existing material). Commit cascades
  down (release values; display resets by derivation — nothing else to clear). Any picker edit
  clears the search selection. Create visibility per level: text non-empty ∧ no exact normalized
  candidate match (computed by the consumer inside `create`).
- **SearchField** — orchestrates with one picker over catalog rows (`label` = variant name,
  `meta` = «Тип › Материал», which is why the filter covers meta), minus the currently committed
  chain. Commit writes values only: `{typeId, materialId, variantId, unit}`. Typing there releases
  the held selection (via `onTextChange`). No target picker texts are written.
- **SupplierPicker** — standalone, same shape.
- **PickStep** — standalone picker; its `create` rule is genuinely different: exact material
  match → «new variant in that material», else «new material». This is why create stays a
  consumer-supplied callback rather than a picker-internal rule.

## The seam

```ts
export interface OptionItem<T extends string | number> { value: T; label: string; meta?: string }

interface Props<T extends string | number> {
  id: string
  label: string
  value?: T                                          # committed existing id; display derives
  options: OptionItem<T>[]                           # full candidates; the picker filters
  create?: (text: string) => { createLabel: string; onCreate: () => void } | undefined
  onSelect: (value: T) => void
  onTextChange?: (text: string) => void              # release hook + SearchField's rule
  name?: string                                      # RHF registration
  inputRef?: Ref<HTMLInputElement>
  onBlur?: ComponentProps<"input">["onBlur"]
  placeholder?: string
  error?: string
  loading?: boolean
  autoFocus?: boolean
}
```

Removed vs the previous implementation: `query`, `onQueryChange`, `listLabel` (no value), `hint`
(zero consumers), controlled `value`/`onValueChange` on `Command`, the derived active-row
machinery, `order-first` CSS.

## Approaches

- **A (chosen): picker owns filtering and text; cmdk owns selection natively.** Create-first and
  default-active are cmdk's own defaults once the DOM order is create-first and the controlled
  selection machinery is gone. Consumers keep only domain rules (release, cascade, create).
- **B (rejected): keep parent-side filtering.** Encodes an assumption no requirement makes; every
  consumer re-implemented matching (substring or compound) — the same logic a picker must have
  anyway.
- **C (rejected): keep controlled selection.** Existed only to fight cmdk's unmount fallback back
  into «first option active» while create was DOM-first. Once the ruling is create-first-active,
  the fighting disappears with the machinery.

## Form consequences

- Supply draft loses all `*Query` fields. `*Name` keeps its create-intent-only meaning; display
  after remount is derived from candidates (create-intents display blank for now — baseline
  ruling 5).
- Supplier value unifies to the same `{id | name}` commitment shape.
- DTO/resolver path is unchanged: resolver reads `*Id`, else `*Name`.

## Deltas accepted consciously

- Typing in SearchField while it holds a selection blanks the variant field (it previously kept
  the name as visible-but-uncommitted text).
- A create-intent shows blank after a pick-then-remount flow (draft reopen).
- cmdk focus reporting stays as-is; screen-reader support remains out of scope (keyboard
  navigation and focus are requirements).

## Docs to move with the code

- `frontend/DESIGN.md` §OptionPicker: create row first **and first active**; list in flow 24 px
  under the field, pushing the form; no order reversal.
- `docs/superpowers/specs/2026-11-07-command-menu-design.md` §Consumers: OptionPicker bullets
  rewritten to this spec (shouldFilter now means «picker filters its own candidates»; no
  controlled selection).

## Test contract (TDD everywhere)

- Picker: filtering over label+meta; empty text = all; create first and active by default; wrap
  navigation; active falls to row 1 when the active option leaves; commit paths; Escape/Tab/
  outside; closed-enter submits; `value` display derivation; `create?.(text)` visibility.
- Consumers: TargetPickers cascade-on-commit with values; SearchField sets values only (tests
  assert no picker texts are written); SupplierPicker/PickStep with the new seam.
- vrt: SupplySheet goldens are expected to churn; per project rule, stop and ask the user.
