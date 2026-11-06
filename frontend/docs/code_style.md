# Code style

Judgment rules that lint and formatting cannot enforce. Code rules apply to project-authored code
(`src/**`); working rules apply to any change.

## Start from the requirement

- Identify the required behavior from the request and relevant product docs. Read existing code
  and tests to understand current behavior, not to assume it is intended.
- Treat existing code, tests and comments as evidence, not requirements. Preserve behavior required
  by docs or the request, or by a confirmed external contract; a test that captures existing
  behavior is not sufficient on its own.
- If docs are silent and an undocumented behavior would materially change the solution, ask rather
  than silently preserving or extending it.

## Working in layers

- Make the smallest coherent change that delivers the required behavior. Add a layer only for a
  documented or explicitly requested need.
- At each layer, check whether existing state, branches and abstractions are still needed; remove
  what is not. Run the gates before continuing.
- Stop when the required behavior is met. Do not add hypothetical requirements or edge cases just
  because they are easy to imagine.

## Existing code

- Before extending a component, hook, prop or type, ask whether it is needed for the required
  behavior. Replace or remove unsupported implementation choices instead of building around them.
- Keep an existing API when it is part of the required behavior or a confirmed external contract;
  update internal callers rather than preserving an unnecessary API. Moving code without
  simplifying responsibilities or data flow is not a refactor.
- Simplify complexity on the path being changed when it blocks the direct solution. Do not expand
  the task into unrelated cleanup.

## Absence is `undefined`, not `null`

- Prefer `undefined` over `null` everywhere in project code. A variable without a value is
  `T | undefined`; `null` is not part of the project's vocabulary outside the boundaries below.
- Return `undefined` for "nothing": hook results, handlers, lookups, optional components.
  `useState<T | null>` becomes `useState<T | undefined>`, with an `undefined` initial state.
- Form values: leave unset optional fields `undefined`; never initialize an input with `null`.
  Convert to the API's nullable shape only when building the DTO.
- Exceptions: generated `src/api/schema.d.ts` stays verbatim; DOM, browser, and third-party
  contracts that already use `null` (event `target`, refs, upstream `@base/*` types) keep it —
  never fight an external API's contract.

## Styling

- Compose styles with `cn()` from the `cn` package; never string-concatenate classes —
  conflicting utilities survive.

## Structure

- Each component lives in its own folder: `Component/index.tsx` inside its parent folder.

## Components

- A file's main component is its default export.
- Declare components with `function`, not as arrow-function consts; keep arrow functions for
  handlers and callbacks.
- A component takes one `props` parameter and reads `props.name`; do not destructure in the
  signature.
- Give every component with props an `interface Props`; do not inline the props type.
  See `src/features/Supply/SupplyCreate/DetailsFields/Calculations.tsx`.
- Keep a component cohesive, but do not split it just because it is large, has "and" in its
  description, or contains separate domain or visual sections. Extract when it isolates a meaningful
  responsibility, enables real reuse, or materially simplifies comprehension or data flow.
- A component does not know the whole form or domain shape; it receives what it renders and calls
  intent-named handlers.
- Reuse domain models and helpers instead of re-declaring their shapes.
- Size is a signal to examine a component, not a reason by itself to split it.

## Hooks

- Keep a hook focused on cohesive behavior. Split independent responsibilities only when the
  boundary simplifies its contract or data flow; do not separate concerns mechanically.
- Use a named, exported interface when it makes the hook's contract clearer to its callers.
- Do not pass data into a state hook only to derive a value; derive where the data lives.

## State and data flow

- Each piece of state has one owner. Put shared state at the lowest common ancestor; keep local
  state local.
- Derive values during render where they are used; do not store what can be derived.
- Do not use refs, effects or form fields to avoid an ownership decision.
- Components do not write form fields directly. Group writes into intent-named functions
  (`commitTarget`, `releaseTarget`) that own the field paths.

## Refactoring

- A refactor should reduce complexity or make responsibilities and data flow simpler. Prefer
  removing unnecessary state, branches, wrappers and options over adding indirection.
- An abstraction must solve a current problem; a wrapper that only duplicates a library primitive
  is a liability.

## Documentation

- Product, UX, design and plan docs record decisions, constraints and expected behavior. Do not
  add implementation detail to them; implementation belongs in code, types and tests.
- Do not commit a doc change that only narrates the current task. Before adding a line, ask
  whether it will still be true and useful after the task.
- Treat implementation notes found in those docs as claims, not requirements. Verify them against
  the code and the original decision; remove them when stale or speculative.
- Code style is the exception: it records conventions and judgment rules, not a design. Keep it
  short and readable; a rule that needs invented mechanics is a design problem.

## Before reporting done

- Confirm the solution is the smallest one that meets the requirement; remove speculative options,
  abstractions and edge-case machinery.
- Check the touched path for unnecessary state, coupling, branches and duplicated writes; verify
  tests cover required behavior, not behavior kept only because it already existed.
- Explain any undocumented behavior intentionally retained and why. Report deviations; never
  present a known gap as done.

## Text

- Render all text through `@ui/Typography`; base `body` carries `type-body`, so raw
  `p`/`span`/`div` inherit the body role (`type-*` wins when set).
