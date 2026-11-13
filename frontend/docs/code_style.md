# Core principles

- Unix principal: something you build does one thing and does it well
- Less is more: do as little as you can. Make minimal test suit, use minimal css rules, write as little logic as possible.
- Deep modules with minimal seam: hide as much implementation as possible behind a seam. The seam should be tight, remove any extra.
- Dry: reuse as much as possible.
- System first. Create well designed system, no ad-hoc solutions.

## Requiremnets

- Docs and user request is the requirement, current code and implemenation is not.
- Do not treat tests as requirement, analyse if they actually fit docs and user request. Prefer to refactor\delete tests if they don't match the task.

## Working in layers

- Prefer to do less, leave as much out as possible. Take the essential core of the feature and only work on that. Postpone everything else for latter. Don't bother with edge cases and polishing.
- When the core is implemented and approved by the user, you can extend it. Follow the same logic for every extension you do, minimal execution only, edge cases out. Drive minimal working solution.
- Do not invent requirements. Cut requirements. Cut as much as you can, question everything, analyse against docs and remove if they are not critical.

## code

- Before extending a component, hook, prop or type, question whether it's exsiting is truly motivated. Raise this question to user if not sure.
- Use deep modules principle, focus on keeping high level seam steady. Inner structure can be reworked as much as needed.

- Prefer `undefined` over `null` everywhere in project code.
- Each component lives in its own folder: `Component/index.tsx` inside its parent folder.
- Use default export first as main export. Named export can be used for secondary entities.
- Prefer function declaration for explicit return.
- A component takes one `props` parameter and reads `props.name`; do not destructure in the
  signature.
- Give every component with props an `interface Props`; do not inline the props type.
- Use single responsibility principle for components\hooks\functions.
- Big module is a hard smell and the candidate for refactor.
- Put shared state at the lowest common ancestor.
- Derive values during render where they are used; do not store what can be derived.
- A refactor should reduce complexity or make responsibilities and data flow simpler. Prefer
  removing unnecessary state, branches, wrappers and options over adding indirection.
- Product, UX, design and plan docs record decisions, constraints and expected behavior. Do not
  add implementation detail to them; implementation belongs in code.
- Render all text through `@ui/Typography`; base `body` carries `type-body`, so raw
  `p`/`span`/`div` inherit the body role (`type-*` wins when set).
- use if\else for multiline conditions
- Prefer using ui/* components, if there is something missing do one of this:
  - check if one of component should be extended
  - check if there are ui/base components that can be used to build ui/ component
  - look for a component in shadcn library (use shadcn skill)
  - look for a component in base ui library
