# Command menu hook + OptionPicker migration Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Extract `useCommandMenu` (open state + dismissal) as the shared seam, refit `CommandPalette` onto it, and migrate `OptionPicker` off its custom active-cursor machinery onto `useCommandMenu` + `@base/command` primitives.

**Architecture:** One shared hook owns `open`, dismissal (Escape guarded by `open` with `stopPropagation`, outside press) and the wrapper ref; a dismissal-only optional `onClose` lets consumers add cleanup. Consumers own their JSX and compose `@base/command`. The picker drops `useOptionPickerOpen`/`useOptionPickerActive`/`OptionList` — cmdk owns navigation.

**Tech Stack:** React 19, cmdk 1.1.1, `@base/command` / `@base/field` / `@base/input-group`, Vitest browser mode.

**Spec:** `docs/superpowers/specs/2026-11-07-command-menu-design.md`

## Global Constraints

- **No git operations.** The user commits; steps end at verified tests.
- Russian UI copy is fixed; do not touch user-facing strings except where tests already define them.
- No comments in code.
- React Compiler is on: no manual `useMemo`/`useCallback`.
- Accessibility scope: keyboard navigation and focus are required; screen-reader support is not. Do not add or remove AT machinery; keep `aria-expanded` on the picker's plain input as-is (palette's is already accepted as cmdk's fixed `true`).
- `@base/*` imports only inside `src/components/ui/`; cross-module imports use aliases (`@ui/CommandMenu`).
- All commands run as `pnpm --filter frontend <script>` from the repo root.
- cmdk facts this plan relies on (verified in cmdk 1.1.1 source): root `[cmdk-root]` div owns ArrowUp/Down/Home/End/Enter keydown; `Enter` always `preventDefault`s inside the root; `CommandList` renders `role="listbox"` with `aria-label` from its `label` prop and a generated id; with `shouldFilter={false}` items always render and selection resets to the first item only when the selected item unmounts; `Command` root overrides nothing the consumer spreads except ids.

## Review Focus

- **Arrow keys while closed** must reopen the list (old picker did; cmdk does not). Expected: ArrowDown/Up on a closed field opens it. Pinned by "opens on the arrow keys while closed" (Task 3).
- **Selection across query changes** with `shouldFilter={false}`: selection persists while the option remains, resets to the first item when the active option disappears. Pinned by the rewritten "keeps the selection while the option remains after a query change" and "falls back to the first result when the active result disappears" (Task 3).
- **Wrap navigation with a create row**: create row is first, cmdk defaults activation to it, `loop` wraps from the last option back to it. Pinned by the rewritten "moves the active option with the arrow keys and wraps" (Task 3).
- **Late returning query**: Escape closes, the query text survives, the next keystroke reopens. Pinned by existing "reopens on the next keystroke after escape" (Task 1 host test asserts the hook allows this).
- **Closed-field Enter** no longer submits the form (cmdk preventDefaults Enter inside the root). Accepted delta — the form submits via «Сохранить» — no test; listed here so a reviewer expects it.

---

### Task 1: `@ui/CommandMenu` — `useCommandMenu` hook

**Files:**

- Create: `frontend/src/components/ui/CommandMenu/useCommandMenu.ts`
- Create: `frontend/src/components/ui/CommandMenu/index.ts`
- Test: `frontend/src/components/ui/CommandMenu/useCommandMenu.browser.test.tsx`

**Interfaces:**

- Consumes: `useOutsidePress` from `@/lib/useOutsidePress/useOutsidePress` (existing; `closeOn` option `"pointerdown" | "click"`).
- Produces (Tasks 2–3 depend on this exactly):

```ts
// useCommandMenu.ts
import { useRef, useState } from "react";
import type { KeyboardEvent, RefObject } from "react";

import { useOutsidePress } from "@/lib/useOutsidePress/useOutsidePress";

interface Props {
  /** Extra cleanup after the hook closes the menu on Escape or an outside press. */
  onClose?: () => void;
  closeOnOutside?: "pointerdown" | "click";
}

export interface UseCommandMenuResult {
  wrapperRef: RefObject<HTMLDivElement | null>;
  open: boolean;
  openList: () => void;
  close: () => void;
  handleKeyDown: (event: KeyboardEvent<HTMLDivElement>) => void;
}

export function useCommandMenu(props: Props): UseCommandMenuResult;
```

Semantics (the contract later tasks rely on):

- `close` sets `open` false only. Programmatic `close` never calls `onClose`.
- Escape and outside-press dismissal set `open` false **and** call `props.onClose?.()`.
- `handleKeyDown` guards on `open` and `event.key === "Escape"`; only then `preventDefault()`, `stopPropagation()`, dismiss. When closed it returns untouched — parent sheets receive Escape.

- [ ] **Step 1: Write the failing tests**

Host component for the tests:

```tsx
function Host(props: { onClose?: () => void }) {
  const menu = useCommandMenu({
    onClose: props.onClose,
    closeOnOutside: "click",
  });
  return (
    <div onKeyDown={menu.handleKeyDown} ref={menu.wrapperRef}>
      <input
        data-testid="menu-input"
        onClick={menu.openList}
        onFocus={menu.openList}
        readOnly
      />
      {menu.open ? <div data-testid="menu-list" /> : null}
    </div>
  );
}
```

Tests (`useCommandMenu.browser.test.tsx`, a parent `<div onKeyDown={(event) => parent(event)}>` wraps the Host in the propagation tests):

1. `opens and closes` — click input → `menu-list` rendered.
2. `closes on escape while open and stops propagation` — click input, `{Escape}` → `menu-list` absent **and** `parent` mock not called.
3. `leaves escape to parents when closed` — Host closed; `{Escape}` → `parent` called once with `event.defaultPrevented === false` and `menu-list` still absent.
4. `closes on an outside click and runs onClose` — render with `onClose: vi.fn()`; click input, click a `<button>Снаружи</button>` outside the wrapper → `menu-list` absent and `onClose` called once.

- [ ] **Step 2: Run tests to verify they fail**

Run: `pnpm --filter frontend test:browser -- useCommandMenu`
Expected: FAIL (module `@ui/CommandMenu` not found / `useCommandMenu` not exported).

- [ ] **Step 3: Implement the hook**

`useCommandMenu.ts` per the Interfaces block. Body shape: three `useState`-free helpers (`openList`, `close`), `useOutsidePress({ ref: wrapperRef, active: open, closeOn: closeOnOutside ?? "pointerdown", onOutside: dismiss })` where `dismiss = () => { setOpen(false); onClose?.(); }`; `handleKeyDown` per semantics. `index.ts` re-exports `useCommandMenu` and its result type.

- [ ] **Step 4: Run tests to verify they pass**

Run: `pnpm --filter frontend test:browser -- useCommandMenu`
Expected: PASS.

- [ ] **Step 5: Lint and format**

Run: `pnpm --filter frontend exec eslint src/components/ui/CommandMenu && pnpm --filter frontend exec prettier --check src/components/ui/CommandMenu`
Expected: clean.

---

### Task 2: Refit `CommandPalette` onto the hook

**Files:**

- Modify: `frontend/src/components/ui/CommandPalette/index.tsx`

**Interfaces:**

- Consumes: `useCommandMenu` from `@ui/CommandMenu` (Task 1 exact API).
- Produces: no public API change; existing `CommandPalette` browser tests must pass unchanged.

- [ ] **Step 1: Refit the component**

Replace local `open` state, `useRef` wrapper, `useOutsidePress` import/call and `handleKeyDown` with the hook. Keep everything else byte-identical (`useSlash`, `Command` root, items, `keywords`, overlay classes, `data-testid`).

```tsx
const [query, setQuery] = useState("");
const { open, openList, close, wrapperRef, handleKeyDown } = useCommandMenu({
  onClose: () => setQuery(""),
});

const onSelect = () => {
  close();
  setQuery("");
};
```

Note: `onClose` is dismissal-only cleanup (clear query); row selection uses its own `onSelect` because rows must close too. Escape now goes: `preventDefault` + `stopPropagation` + close + clear — same observable behavior as the current code (the palette's `preventDefault` moves into the hook).

Wrapper div: `onKeyDown={handleKeyDown}` replaces the local one.

- [ ] **Step 2: Run existing tests — expect green without edits**

Run: `pnpm --filter frontend test:browser -- CommandPalette`
Expected: 169/169 pass, zero test edits.

- [ ] **Step 3: Lint, typecheck, format**

Run: `pnpm --filter frontend exec eslint src/components/ui/CommandPalette src/components/ui/CommandMenu && pnpm --filter frontend typecheck && pnpm --filter frontend exec prettier --check src/components/ui/CommandPalette`
Expected: clean.

---

### Task 3: Migrate `OptionPicker` to the hook + `@base/command`

**Files:**

- Modify: `frontend/src/components/ui/OptionPicker/index.tsx`
- Test: `frontend/src/components/ui/OptionPicker/OptionPicker.browser.test.tsx`
- Delete: `frontend/src/components/ui/OptionPicker/useOptionPickerOpen.ts`
- Delete: `frontend/src/components/ui/OptionPicker/useOptionPickerActive.ts`
- Delete: `frontend/src/components/ui/OptionPicker/OptionList/` (whole folder: `index.tsx`, `OptionRow/index.tsx`, `OptionList.stories.tsx`)
- `OptionPicker.stories.tsx` stays as-is: it uses only public props, which are unchanged.

**Interfaces:**

- Consumes: `useCommandMenu` (Task 1), `@base/command` `Command`/`CommandItem`/`CommandList`, `@ui/InputField`, `@ui/Icon`, `@ui/Typography`.
- Produces: `OptionPicker` public `Props` unchanged; all consumers (`TargetPickers`, `SearchField`, `SupplySheet` steps) need no edits.

**Behavior deltas locked in (these drive the test rewrites):**

- Create row stays first (create, option₁, option₂ order preserved); cmdk defaults activation to the **first item = create row** (accepted decision).
- Arrow keys wrap with `loop` on the root.
- Selection persists by value across query changes while the option remains; resets when the active option unmounts (cmdk item cleanup).
- `aria-controls` and document-id lookups are dropped from tests: cmdk generates the list id; screen-reader scope is out.
- Enter in a closed field no longer submits (cmdk always preventDefaults Enter inside the root). Accepted delta.
- Escape focus retention, Tab close, outside click, in-flow list, reopen-on-type/click, loading pass-through, field contract — unchanged test expectations.

- [ ] **Step 1: Rewrite the browser tests (failing first)**

In `OptionPicker.browser.test.tsx`, keep `baseProps`, `options`, `createRowLabel` and these tests untouched: `stays a bare field while closed`, `forwards the loading state to the field`, `places the create row first`, `shows only the create row when there are no results`, `routes the create row to onCreate only`, `closes the list on escape and keeps focus`, `leaves escape to the sheet once the list is closed`, `reopens on the next keystroke after escape`, `reopens on a click after escape`, `keeps the list in the flow`, `closes on an outside click`, `closes when tabbing away`, `closes after selecting an option`, `passes the field contract through`.

Rewrite:

1. `wires the field to the list and its active option` — drop the `aria-controls` assertion and the `document.getElementById("supply-material-list")` check; keep `aria-expanded`/`aria-autocomplete="list"`, the `aria-label` ("Варианты") on the listbox, and the first-option-selected assertion becomes: after opening, `getByRole("option", { name: "Новый вариант в «Дуб»" })` has `aria-selected="true"` (create row first, cmdk defaults to it).
2. `selects the active option on enter` — after click, press `{ArrowDown}` once (to «Доска 40 мм»), then `{Enter}` → `onSelect` called with `100`.
3. `moves the active option with the arrow keys and wraps` — after click: create selected; `{ArrowDown}` → «Доска 40 мм»; `{ArrowDown}` → «Брусок 60 × 60»; `{ArrowDown}` wraps → «Новый вариант в «Дуб»»; `{ArrowUp}` → «Брусок 60 × 60».
4. Replace `resets the active option when the input value changes` with `keeps the selection while the option remains after a query change` — click, `{ArrowDown}` (Доска), rerender with `query="Брусок"`, same `options` → «Доска 40 мм» still `aria-selected="true"`.
5. `falls back to the first result when the active result disappears` — keep, but with create-first order the trace is: click, `{ArrowDown}` (Доска), `{ArrowDown}` (Брусок), rerender `options={options.slice(0, 1)}` → «Доска 40 мм» selected.
6. Add `opens on the arrow keys while closed` — click combobox, `{Escape}` (closed), then `{ArrowDown}` → listbox present.

- [ ] **Step 2: Run tests to verify they fail**

Run: `pnpm --filter frontend test:browser -- OptionPicker`
Expected: FAIL (current implementation still custom list; create-row default, aria-selected on Command attributes etc. do not hold).

- [ ] **Step 3: Implement the new `OptionPicker/index.tsx`**

Delete the old hooks/OptionList first, then write:

```tsx
import type { ComponentProps, KeyboardEvent, Ref } from "react";

import { Command, CommandItem, CommandList } from "@base/command";
import { useCommandMenu } from "@ui/CommandMenu";
import { PlusIcon } from "@ui/Icon";
import { InputField } from "@ui/InputField";
import Typography from "@ui/Typography";

export interface OptionItem<T extends string | number> {
  value: T;
  label: string;
  meta?: string;
}

interface Props<T extends string | number> {
  id: string;
  label: string;
  query: string;
  name?: string;
  placeholder?: string;
  hint?: string;
  error?: string;
  loading?: boolean;
  autoFocus?: boolean;
  inputRef?: Ref<HTMLInputElement>;
  onQueryChange: (value: string) => void;
  onSelect: (value: T) => void;
  onBlur?: ComponentProps<"input">["onBlur"];
  options: OptionItem<T>[];
  listLabel: string;
  create?: {
    createLabel: string;
    onCreate: () => void;
  };
}

const rowClassName =
  "h-12 cursor-pointer gap-3 px-4 data-selected:bg-muted data-selected:shadow-[inset_2px_0_0_0_var(--primary)] [&>svg:last-child]:hidden";

export default function OptionPicker<T extends string | number>(
  props: Props<T>,
) {
  const {
    id,
    label,
    query,
    name,
    placeholder,
    hint,
    error,
    loading,
    autoFocus,
    inputRef,
    onQueryChange,
    onSelect,
    onBlur,
    options,
    create,
    listLabel,
  } = props;
  const { open, openList, close, wrapperRef, handleKeyDown } = useCommandMenu({
    closeOnOutside: "click",
  });
  const expanded = open && (options.length > 0 || Boolean(create));

  const handleWrapperKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (!open && (event.key === "ArrowDown" || event.key === "ArrowUp")) {
      event.preventDefault();
      openList();
    }
    handleKeyDown(event);
  };

  const handleFieldKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Tab") close();
  };

  const handleQueryChange = (event: ComponentProps<"input">["onChange"]) => {
    openList();
    onQueryChange(event.currentTarget.value);
  };

  return (
    <div
      ref={wrapperRef}
      className="flex flex-col gap-6"
      onKeyDown={handleWrapperKeyDown}
      onFocus={openList}
    >
      <Command shouldFilter={false} loop className="bg-transparent">
        <InputField
          id={id}
          ref={inputRef}
          name={name}
          label={label}
          placeholder={placeholder}
          hint={hint}
          error={error}
          loading={loading}
          autoFocus={autoFocus}
          value={query}
          onBlur={onBlur}
          role="combobox"
          aria-expanded={expanded}
          aria-autocomplete="list"
          onChange={handleQueryChange}
          onClick={openList}
          onKeyDown={handleFieldKeyDown}
        />
        {expanded ? (
          <CommandList label={listLabel} className="list-none">
            {create ? (
              <CommandItem
                key="create"
                value="create"
                className={rowClassName}
                onSelect={() => {
                  close();
                  create.onCreate();
                }}
              >
                <PlusIcon />
                <Typography variant="body" className="min-w-0 truncate">
                  {create.createLabel}
                </Typography>
              </CommandItem>
            ) : null}
            {options.map((option) => (
              <CommandItem
                key={String(option.value)}
                value={String(option.value)}
                className={rowClassName}
                onSelect={() => {
                  close();
                  onSelect(option.value);
                }}
              >
                <Typography variant="body" className="min-w-0 truncate">
                  {option.label}
                </Typography>
                {option.meta ? (
                  <Typography
                    variant="caption"
                    className="text-muted-foreground ml-auto shrink-0 uppercase"
                  >
                    {option.meta}
                  </Typography>
                ) : undefined}
              </CommandItem>
            ))}
          </CommandList>
        ) : null}
      </Command>
    </div>
  );
}

export type { Props as OptionPickerProps };
```

Notes the implementer must honor:

- `Command` root `className="bg-transparent"` neutralizes `@base` `bg-popover` behind the field; the wrapper keeps the old `gap-6` rhythm.
- `handleWrapperKeyDown` order: arrow-open check first (cmdk's root preventDefaults arrows before the event reaches the wrapper; opening inside our own handler is unaffected), then the hook's Escape handler.
- `closeOnOutside: "click"` because the list is in flow (unmounting on `pointerdown` would move content under the pointer).
- `value="create"` and `String(option.value)` are cmdk identities; never let cmdk infer from text.
- `[&>svg:last-child]:hidden` hides `@base` `CommandItem`'s trailing `CheckIcon` placeholder so rows have no phantom gap.

- [ ] **Step 4: Run tests to verify they pass**

Run: `pnpm --filter frontend test:browser -- OptionPicker`
Expected: PASS.

- [ ] **Step 5: Verify no dangling references**

Run: `grep -rn "useOptionPicker\|OptionList\|listDomId" frontend/src || true`
Expected: no output.

- [ ] **Step 6: Lint, typecheck, format**

Run: `pnpm --filter frontend exec eslint src/components/ui/OptionPicker src/components/ui/CommandPalette src/components/ui/CommandMenu && pnpm --filter frontend typecheck && pnpm --filter frontend exec prettier --check src/components/ui/OptionPicker`
Expected: clean.

---

### Task 4: Sweep + design-record sync

**Files:**

- Modify: `docs/superpowers/specs/2026-11-07-command-menu-design.md`

**Interfaces:**

- Produces: a design record matching what shipped.

- [ ] **Step 1: Update the design record's "Shared hook" section to the as-built contract**

Replace the `onClose` bullet with:

```markdown
- `onClose` is optional cleanup that runs after the hook closes the menu when Escape or an outside
  press dismisses it. The hook owns and closes the open state itself; a programmatic `close()` does
  not run `onClose`. Query stays consumer state.
- Outside press close-on: `"pointerdown"` (default, overlay lists) or `"click"` (in-flow lists).
  The hook takes the choice; it is a property of the consumer's list positioning, not a mode switch.
```

And under Consumers, add to the picker bullet: `ArrowDown`/`ArrowUp` while closed reopen the list (cmdk does not); `Tab` close stays local to the picker.

- [ ] **Step 2: Full verification**

Run: `pnpm --filter frontend fullcheck`
Expected: typecheck, lint, unit, browser, vrt all green. If the vrt project fails, stop and ask the user — do not investigate or regenerate screenshots unprompted.

- [ ] **Step 3: Report the deltas**

Summarize to the user: create row now receives initial activation (cmdk default), closed-field Enter no longer submits, and row visuals now come from `CommandItem` + `rowClassName` port — flag these for a quick look.
