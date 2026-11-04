# Form conventions

General project rules only. Feature schemas, fields, and tests define feature-specific behavior.

## Foundation

- Forms use React Hook Form + Zod through `@ui/Form`; feature code never renders `<form>` or imports
  field primitives from `@base/*`.
- RHF owns values, errors, touched state, and submission. Zod owns parsing, validation, and
  transformations. Never mirror them with `useState` or manual error maps.
- Feature step hooks own API mutations and reference resolution; workflow orchestration owns step
  transitions and server-level failures.

## Field integration

- Standalone controls stay usable without RHF. Export their connected counterpart beside them.
- Connected controls accept an explicit `control={form.control}` so field names stay type-safe.
- Composite form sections read the form through RHF context
  (`useFormContext<Values, Context, Draft>()`) instead of receiving the full `form` instance as a
  prop; only isolated, reusable controls keep taking `control`.
- A connected control maps `value`, `onChange`, `onBlur`, `name`, and `ref`, composes caller
  handlers, and forwards field errors.
- Composite values that cannot use a native input contract use `FormField`.
- Group fields with the Field wrappers, never with bare layout `<div>`s: a labelled group uses
  `@ui/InputFieldGroup`, an unlabelled group uses `FieldGroup` from `@ui/InputFieldGroup` — the
  layout (grid/columns) belongs in its `className`, which `cn()` resolves against the wrapper
  defaults.
- A labelled group of fields uses `@ui/InputFieldGroup`; it composes `FieldSet`, `FieldLegend` and
- A new control without a connected form version is incomplete.

## Form modules

- `use<Step>Form` owns form creation, schema selection, busy state. It may
  call `use<Step>Step`.
- `use<Step>Step` owns mutations, entity resolution, and step navigation.
- The step component is rendering only: layout, labels, copy, and field placement.
- The submit handler awaits the mutation path so RHF `isSubmitting` is accurate.
- Keep schemas co-located with their form module. Use a schema factory when rules depend on runtime
  data or another field.

## Values and schemas

- Field values use `z.input`; validated submit data uses `z.output`.
- Schemas parse raw strings, trim text, and return a feature draft. They do not build API DTOs.
- Generated OpenAPI-derived types remain the transport source of truth.
- Validation rules must come from product docs, architecture docs, or the API contract. Backend
  validation remains authoritative; do not duplicate business invariants as a second source of
  truth.
- Validate on submit, then revalidate invalid fields on change. Shared `Form` uses `noValidate`.

## Errors and submission

- Field errors stay in RHF. API/workflow failures stay in the workflow error surface. Preserve
  entered values after request failures.
- Map server failures to fields only if the API supplies field-level errors.
- Keep one submission path. For actions outside the form, use `type="submit"` with a stable `form`
  ID; never add a callback registry or custom submit bridge.
- Never disable a control for pending work. Use `@ui/Button pending` with `pendingLabel`, keep the
  action enabled, and guard repeated activation in the handler or flow.
- `Button` defaults to `type="button"`; submission requires an explicit `type="submit"`.

## Accessibility

- Use the field wrappers' error state so `data-invalid`, `aria-invalid`, and `aria-describedby`
  stay linked.
- Forward refs from connected and composite controls so RHF can focus the first invalid field.
- Set `aria-busy` on the active form or action while work is pending.
