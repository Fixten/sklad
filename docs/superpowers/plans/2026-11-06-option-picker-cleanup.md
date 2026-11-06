# OptionPicker Cleanup Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Remove active-option plumbing from the input and split the picker interaction hook without changing public props or keyboard behavior.

**Architecture:** `OptionPicker` builds rows with per-row `onSelect` and passes `activeIndex` to `OptionList`. Two focused hooks own open state and the active cursor; keyboard mapping stays in `OptionPicker`. `OptionList` renders active rows and reports pointer activation.

**Tech Stack:** React 19, TypeScript, Vitest browser tests, Storybook.

**Spec:** `frontend/DESIGN.md` §OptionPicker, `frontend/AGENTS.md` accessibility scope, `frontend/docs/code_style.md`.

## Global Constraints

- No git operations.
- Keep the public `OptionPicker` props and `OptionItem<T>` generic.
- Keep `id`, `name`, `hint`, `listLabel`, `onBlur`, and `inputRef`.
- Keep `aria-controls`, `aria-expanded`, `aria-autocomplete`, list `aria-label`, `role`, and `aria-selected`.
- Behavior must not change: keyboard, focus, typing, create/result order, active reset/fallback, close rules.
- Run typecheck, ESLint, Prettier, unit and browser tests after each task.

---

### Task 1: Move active rendering into `OptionList`

**Files:**

- Modify: `frontend/src/components/ui/OptionPicker/OptionList/index.tsx`
- Modify: `frontend/src/components/ui/OptionPicker/OptionList/OptionRow/index.tsx`
- Modify: `frontend/src/components/ui/OptionPicker/OptionPicker.browser.test.tsx`
- Modify: `frontend/src/components/ui/OptionPicker/OptionList/OptionList.stories.tsx`
- Modify: `frontend/src/features/Supply/SupplySheet/index.browser.test.tsx`

**Interfaces:**

- Consumes: existing `OptionItem<T> { value, label, meta? }`.
- Produces: `OptionListRow { label, meta?, icon?, onSelect }`; `OptionList` props `{ id, ariaLabel, rows, activeIndex, onActivate }`; `OptionRow` props `{ label, meta?, icon?, active, onActivate, onSelect }`.

- [ ] **Step 1: Update `OptionListRow`, `OptionList`, and `OptionRow`**

`OptionListRow` loses `active` and gains required `onSelect: () => void`.
`OptionList` drops `onSelect(index)`, gains `activeIndex: number`, renders `active={index === props.activeIndex}`, and calls `row.onSelect` directly.
`OptionRow` drops `id` and keeps `role="option"`, `aria-selected`, `onMouseMove`, and `onClick`.

- [ ] **Step 2: Update `OptionPicker` row construction**

Drop `OptionItem.icon` and its mapping; keep `OptionListRow.icon` for the create row.

Build one `OptionListRow[]`:

- create row: `onSelect: () => { close(); create.onCreate(); }`
- option row: `onSelect: () => { close(); onSelect(option.value); }`

Pass `activeIndex` to `OptionList`. Delete `optionsOffset`, `selectRow(index)`, and the active-flag map.

- [ ] **Step 3: Update the browser contract**

In `OptionPicker.browser.test.tsx`, remove `aria-activedescendant` assertions and keep `aria-controls`, `aria-expanded`, `aria-autocomplete`, list `aria-label`, and active-row `aria-selected` assertions.
In `SupplySheet/index.browser.test.tsx`, replace the `aria-activedescendant` assertion with `aria-selected` on the first option.

- [ ] **Step 4: Update `OptionList.stories.tsx`**

Rows get `onSelect`; the story passes `activeIndex` and keeps `id` and `ariaLabel`.

- [ ] **Step 5: Run gates**

Run:

```bash
pnpm --filter frontend typecheck
pnpm --filter frontend exec eslint src/components/ui/OptionPicker
pnpm --filter frontend exec prettier --check src/components/ui/OptionPicker
pnpm --filter frontend test
pnpm --filter frontend test:browser
```

Expected: all pass; no visual/snapshot change.

---

### Task 2: Remove active-descendant plumbing from the hook

**Files:**

- Modify: `frontend/src/components/ui/OptionPicker/useOptionPicker.ts`
- Modify: `frontend/src/components/ui/OptionPicker/index.tsx`

**Interfaces:**

- Produces: `useOptionPicker` no longer accepts `listId` and no longer returns `activeDescendantId`.

- [ ] **Step 1: Remove `listId` and `activeDescendantId`**

Delete the `optionDomId` import and `activeDescendantId` derivation. Keep `listDomId(id)` in `OptionPicker` for `aria-controls`.

- [ ] **Step 2: Run gates**

Run:

```bash
pnpm --filter frontend typecheck
pnpm --filter frontend exec eslint src/components/ui/OptionPicker
pnpm --filter frontend exec prettier --check src/components/ui/OptionPicker
pnpm --filter frontend test
pnpm --filter frontend test:browser
```

Expected: all pass.

---

### Task 3: Split the interaction hook

**Files:**

- Create: `frontend/src/components/ui/OptionPicker/useOptionPickerOpen.ts`
- Create: `frontend/src/components/ui/OptionPicker/useOptionPickerActive.ts`
- Delete: `frontend/src/components/ui/OptionPicker/useOptionPicker.ts`
- Modify: `frontend/src/components/ui/OptionPicker/index.tsx`

**Interfaces:**

- `useOptionPickerOpen(): { wrapperRef, isOpen, open, close }`
- `useOptionPickerActive({ query, count, defaultIndex }): { activeIndex, activate, moveActive }`

- [ ] **Step 1: Create `useOptionPickerOpen`**

Move `isOpen`, `wrapperRef`, `open`, `close`, and `useOutsidePress` from the old hook.

- [ ] **Step 2: Create `useOptionPickerActive`**

Move `ActiveRequest`, `resolveActiveIndex`, `activate`, `moveActive`, and the query-scoped request. Keep the existing fallback and wrap behavior.

- [ ] **Step 3: Update `OptionPicker`**

Compose the two hooks. Derive `expanded = isOpen && entries.length > 0`. Keep the keyboard handler in the component:

- arrows: prevent default; open when closed, otherwise `moveActive`
- Enter: `entries[activeIndex]?.onSelect()`
- Escape: close and stop propagation when expanded
- Tab: close

Use `defaultIndex = create ? 1 : 0`.

- [ ] **Step 4: Delete `useOptionPicker.ts`**

Confirm no imports remain.

- [ ] **Step 5: Run gates**

Run:

```bash
pnpm --filter frontend typecheck
pnpm --filter frontend exec eslint src/components/ui/OptionPicker
pnpm --filter frontend exec prettier --check src/components/ui/OptionPicker
pnpm --filter frontend test
pnpm --filter frontend test:browser
```

Expected: all pass.

---

## Review Focus

- Keyboard navigation must still wrap and still select the active row on Enter.
- Query changes must reset the active row to the default result, not the create row when results exist.
- Missing active rows must fall back to the default row.
- Escape must close only the list first; the sheet must receive the next Escape.
- Selecting a row must close the list before invoking create/select.
