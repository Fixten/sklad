# Code style

Judgment rules that lint and formatting cannot enforce. They apply to project-authored code
(`src/**`); tooling-enforced rules stay out of this file.

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

## Text

- Render all text through `@ui/Typography`; base `body` carries `type-body`, so raw
  `p`/`span`/`div` inherit the body role (`type-*` wins when set).
