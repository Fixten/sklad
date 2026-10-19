## Theme

Dark always. The reason to keep as dark in code is that shadcn matches .dark selector. So main theme in selected as dark in theme provider always.

## Components

Import UI components only through `@ui/*` (project-authored components in
`src/components/ui/`). Never import `@base/*` (shadcn, `src/components/ui/base/`) from
outside `src/components/ui/` — if a needed component has no `@ui` entry, add one, even if
it only re-exports the base component.
