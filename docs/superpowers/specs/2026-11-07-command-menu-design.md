# Command menu — shared hook seam for CommandPalette and OptionPicker

## Decision

One shared hook owns interaction state and dismissal; each consumer owns its JSX and selection
semantics. No shared JSX components.

- Markup and style reuse lives in `@base/command` primitives (`Command`, `CommandInput`,
  `CommandList`, `CommandEmpty`, `CommandItem`, `CommandGroup`). Consumers compose them directly;
  using shared markup twice is not duplication.
- Behavioral logic that differs between consumers is not generalized. A pass-through component or
  mode flag is rejected until real duplication appears a third time.

## Shared hook

`useCommandMenu` owns the dialog surface: `open` state, `openList`, `close`, the wrapper `ref`, the
guarded Escape keydown, and outside-press dismissal.

```ts
const { open, openList, close, wrapperRef, handleKeyDown } = useCommandMenu({
  onClose,
});
```

- The hook owns and closes the `open` state itself; programmatic `close()` never runs `onClose`.
  `onClose` is optional consumer cleanup that runs when Escape or an outside press dismisses the
  menu. Query is not hook state: CommandPalette keeps it locally, the picker's query is controlled
  by its parent and must survive close.
- Escape only acts while `open`, and stops propagation (Base UI dialogs listen on `document` and
  ignore `defaultPrevented`; `stopPropagation` is what keeps a wrapping sheet open). The next
  Escape reaches the sheet. Consumers whose list can be open without content guard additionally on
  their render condition so Escape falls through to the sheet while nothing is shown.
- Outside press close-on: `"pointerdown"` (default, overlay lists) or `"click"` (in-flow lists).
  The choice is a property of the consumer's list positioning, not a mode switch.

## Consumers

- **`CommandPalette`** (action menu): owns `query` locally and clears it on dismissal and on row
  selection; `useSlash` stays palette-only.
- **`OptionPicker`** (form combobox): `query` is controlled by the parent; closing does not clear
  it — after selection the query doubles as the displayed value. `shouldFilter={false}`: filtering
  is external (the parent feeds matching options). Rows carry explicit stable cmdk `value`s
  (option id, constant for the create row); dynamic labels must never be inferred by cmdk.
  Selection is driven through controlled `value`/`onValueChange` on the `Command` root, with a
  derived fallback to the default row when the cached row leaves the list — cmdk's unmount
  fallback can otherwise leave a dead selection. The default row is the literal first row: the
  first option when one exists, the create row when nothing matches; the create row therefore
  renders last. `ArrowDown`/`ArrowUp` while closed reopen the list (cmdk's root preventDefaults
  them otherwise). `Tab` close stays local to the picker's field. When the list is closed the
  field's Enter stops propagating so the form submits instead of cmdk preventDefaulting it.

## Screen-reader scope

`aria-expanded` is not corrected; cmdk always reports `true`. Keyboard navigation and focus are in
scope; screen-reader behavior is not.
