---
name: sklad
description: >-
  Inventory management SPA with a "Forest & Hide" atelier theme: dark forest
  surfaces, burnished-brass actions, moss and foliage accents, and an editorial
  typographic voice.

colors:
  light:
    background: "oklch(0.982 0.006 128.525)"
    foreground: "oklch(0.325 0.026 132.005)"
    card: "oklch(0.965 0.01 131.358)"
    card-foreground: "oklch(0.325 0.026 132.005)"
    popover: "oklch(1 0 0)"
    popover-foreground: "oklch(0.244 0.027 133.765)"
    primary: "oklch(0.757 0.079 88.436)"
    primary-foreground: "oklch(0.244 0.027 133.765)"
    secondary: "oklch(0.931 0.024 119.514)"
    secondary-foreground: "oklch(0.244 0.027 133.765)"
    muted: "oklch(0.965 0.01 131.358)"
    muted-foreground: "oklch(0.495 0.043 129.483)"
    accent: "oklch(0.931 0.024 119.514)"
    accent-foreground: "oklch(0.757 0.079 88.436)"
    destructive: "oklch(0.506 0.193 27.702)"
    destructive-foreground: "oklch(1 0 0)"
    border: "oklch(0.904 0.032 122.68)"
    input: "oklch(0.904 0.032 122.68)"
    ring: "oklch(0.757 0.079 88.436)"
    sidebar: "oklch(1 0 0)"
    sidebar-foreground: "oklch(0.325 0.026 132.005)"
    sidebar-primary: "oklch(0.757 0.079 88.436)"
    sidebar-primary-foreground: "oklch(0.244 0.027 133.765)"
    sidebar-accent: "oklch(0.965 0.01 131.358)"
    sidebar-accent-foreground: "oklch(0.244 0.027 133.765)"
    sidebar-border: "oklch(0.904 0.032 122.68)"
    sidebar-ring: "oklch(0.757 0.079 88.436)"
  dark:
    background: "oklch(0.204 0.02 135.347)"
    foreground: "oklch(0.889 0.014 88.691)"
    card: "oklch(0.296 0.04 132.577)"
    card-foreground: "oklch(0.889 0.014 88.691)"
    popover: "oklch(0.336 0.046 132.211)"
    popover-foreground: "oklch(0.979 0.005 95.099)"
    primary: "oklch(0.757 0.079 88.436)"
    primary-foreground: "oklch(0.204 0.02 135.347)"
    secondary: "oklch(0.336 0.046 132.211)"
    secondary-foreground: "oklch(0.979 0.005 95.099)"
    muted: "oklch(0.244 0.027 133.765)"
    muted-foreground: "oklch(0.71 0.044 127.169)"
    accent: "oklch(0.296 0.04 132.577)"
    accent-foreground: "oklch(0.757 0.079 88.436)"
    destructive: "oklch(0.838 0.089 26.757)"
    destructive-foreground: "oklch(0.328 0.134 27.32)"
    border: "oklch(0.382 0.052 133.073)"
    input: "oklch(0.382 0.052 133.073)"
    ring: "oklch(0.757 0.079 88.436)"
    sidebar: "oklch(0.244 0.027 133.765)"
    sidebar-foreground: "oklch(0.889 0.014 88.691)"
    sidebar-primary: "oklch(0.757 0.079 88.436)"
    sidebar-primary-foreground: "oklch(0.204 0.02 135.347)"
    sidebar-accent: "oklch(0.336 0.046 132.211)"
    sidebar-accent-foreground: "oklch(0.979 0.005 95.099)"
    sidebar-border: "oklch(0.382 0.052 133.073)"
    sidebar-ring: "oklch(0.757 0.079 88.436)"
  chart:
    light:
      [
        "oklch(0.477 0.064 128.345)",
        "oklch(0.41 0.057 131.762)",
        "oklch(0.34 0.046 132.189)",
        "oklch(0.58 0.067 127.709)",
        "oklch(0.494 0.058 127.848)",
      ]
    dark:
      [
        "oklch(0.823 0.07 126.74)",
        "oklch(0.677 0.069 128.067)",
        "oklch(0.58 0.067 127.709)",
        "oklch(0.494 0.058 127.848)",
        "oklch(0.41 0.057 131.762)",
      ]

typography:
  sans: "'Noto Sans Variable', sans-serif"
  heading: "'Geist Mono Variable', monospace"
  scale:
    body: "text-sm / leading-normal (14px)"
    input: "text-base, md:text-sm"
    label: "text-xs / font-semibold / uppercase / tracking-wide"
    caption: "text-xs"

rounded:
  sera: "0 — every shipped component is rounded-none"
  base: "0.625rem"
  sm: "calc(var(--radius) - 4px)  /* 6px  — small accents */"
  md: "calc(var(--radius) - 2px)  /* 8px  — buttons, inputs, menu items */"
  lg: "var(--radius)              /* 10px — cards, dialogs */"
  xl: "calc(var(--radius) + 4px)  /* 14px */"
  2xl: "calc(var(--radius) * 1.8)  /* 18px */"
  3xl: "calc(var(--radius) * 2.2)  /* 22px */"
  4xl: "calc(var(--radius) * 2.6)  /* 26px */"

spacing:
  base: "0.25rem (4px)"
  steps: "Tailwind dynamic scale — p-1=2px, p-2=4px, p-3=8px, p-4=16px, p-8=32px"
  used: ["gap-2", "gap-3", "gap-4", "gap-6", "gap-8", "px-3", "px-4", "px-6"]

components:
  button:
    base: "inline-flex items-center justify-center gap-1.5 rounded-none text-xs font-semibold uppercase tracking-widest"
    variants: [default, destructive, outline, secondary, ghost, link]
    sizes:
      {
        xs: "h-7 px-3",
        sm: "h-9 px-4",
        default: "h-10 px-6",
        lg: "h-11 px-8",
        icon: "size-10",
        icon-xs: "size-7",
        icon-sm: "size-9",
        icon-lg: "size-11",
      }
    default-variant: outline
  input:
    base: "h-10 w-full rounded-none border-b border-b-input bg-transparent px-0 py-1 text-base md:text-sm"
    focus: "focus-visible:border-b-ring aria-invalid:border-b-destructive"
  card:
    base: "rounded-none bg-card text-sm ring-1 ring-foreground/5 py-(--card-spacing) gap-(--card-spacing) shadow-sm"
---

# Sklad — Design System

Sklad is an inventory manager (materials, material types, variants). The UI is a
Vite + React SPA built on **shadcn/ui with a Base UI base** and Tailwind v4
CSS-variable theming. The theme is **Forest & Hide**: the disciplined serenity of
a leather artisan's atelier — dark forest surfaces, burnished brass actions, moss
and foliage accents — carried on an editorial, typographic "sera" foundation.

This document is the design source of truth. When it disagrees with code, update
the code (per `AGENTS.md`).

## Overview

- **Voice:** calm, matter-of-fact, utilitarian. Russian UI copy.
- **Atmosphere:** grounded in forest slate, lichen, vegetable-tanned hide and
  burnished brass hardware — organic warmth and natural shelter, never cold
  tech-noir or neon.
- **Audience:** independent makers, studio managers and atelier teams balancing
  tactile material craft with inventory counts and batch workflows.
- **Resonance:** quiet confidence and grounded clarity; the UI recedes so
  material textures, product photography and ledger data stay prominent.
- **Canvas:** near-black forest in dark mode (`--background`); near-white
  atelier in light mode.
- **Action color:** burnished brass `--primary` (identical in both modes) with a
  deep forest `--primary-foreground` for text/icon on it.
- **Foliage:** moss/lichen greens (`--secondary`, `--accent`) for structure and
  secondary actions.
- **Charts:** a forest green ramp (`--chart-1…5`) for data visualization.
- **Type:** `Noto Sans Variable` for everything; `Geist Mono Variable` for
  headings/labels (`--font-heading`).

## Colors

Semantic roles only — components never reference raw Tailwind palette colors.
Every role is defined in `:root` and `.dark` in `src/styles/tailwind.css` and
registered in `@theme inline` as a `--color-*` token.

| Role           | Token                  |
| -------------- | ---------------------- |
| Page floor     | `--background`         |
| Body text      | `--foreground`         |
| Card surface   | `--card`               |
| Floating layer | `--popover`            |
| CTA fill       | `--primary`            |
| CTA text       | `--primary-foreground` |
| Secondary fill | `--secondary`          |
| Soft band      | `--muted`              |
| Secondary text | `--muted-foreground`   |
| Hover wash     | `--accent`             |
| Error          | `--destructive`        |
| Hairline       | `--border` / `--input` |
| Focus ring     | `--ring`               |

### Surface architecture

Surfaces layer tonally, from the canvas up to floating layers. Prefer the next
surface level over a shadow to lift content.

| Level     | Role                 | Token          |
| --------- | -------------------- | -------------- |
| Canvas    | Root background      | `--background` |
| Surface 1 | Workspaces, sidebars | `--sidebar`    |
| Surface 2 | Cards, grids         | `--card`       |
| Surface 3 | Nested panels, fills | `--secondary`  |
| Surface 4 | Elevated badges      | `--border`     |

### Linework & accents

- Structural borders are `--border`.
- Interactive borders (focus, active input, premium tags) use `--ring`.
- Foliage accents — damp moss and fresh lichen greens — drive toggle states and
  active tabs (`--accent`) and the secondary action fill (`--secondary`).
- Titles use the editorial ink `--popover-foreground`; body copy uses
  `--foreground`; metadata and inactive icons use `--muted-foreground`.

Chart ramp: `--chart-1…5` moss → lichen greens, per mode (see frontmatter).

### Contrast notes

- `--muted-foreground` on `--background` and on `--muted` is the secondary-text
  pairing; verify it stays ≥ 4.5:1 whenever the neutral ramp is touched.
- `--primary` is brass: text placed **on** it must use `--primary-foreground`
  (deep forest), never `--foreground`.
- `--destructive` is the MD3 error role — use `text-destructive` for error text,
  not `--destructive-foreground` as a text-on-surface color.

## Typography

| Role    | Family                | Usage                                                      |
| ------- | --------------------- | ---------------------------------------------------------- |
| Sans    | `Noto Sans Variable`  | All body copy, controls, tables                            |
| Heading | `Geist Mono Variable` | `--font-heading`; small component titles, technical labels |

- Base body size is `text-sm`; inputs are `text-base` on mobile, `md:text-sm`.
- Labels are `text-xs font-semibold uppercase tracking-wide` (editorial caps).
- Data columns (quantities, counts, prices) use tabular figures so digits align.
- Do **not** introduce serif or additional display faces; the geometry here is
  expressed through mono headings + editorial spacing, not a serif.

## Layout & spacing

- 4px base spacing unit (Tailwind dynamic scale); use `gap-*` for all stacks.
- App shell: `container mx-auto max-w-4xl` with a top `pt-16` offset for the
  header (`src/layout/App.layout.tsx`).
- Forms and filter rows: `flex items-end gap-4` / `gap-8`.
- Field groups: `Field` (`flex w-full flex-col gap-3`) — `FieldLabel` above the
  control; `FieldGroup` stacks fields at `gap-10`.

## Radius & elevation

- Sera is **sharp**: buttons, inputs, cards, dialogs, popovers and separators all
  set `rounded-none`. The `--radius` ladder (frontmatter) stays in tokens for
  surfaces that opt in, but component recipes must not restore rounding.
- Depth is **tonal**, built from surface layering and hairline rings rather than
  heavy drop shadows:
  - **Tier 0 — Root basin** (`--background`): flat canvas.
  - **Tier 1 — Surface containers** (`--sidebar`, `--muted`): tonal only, no
    ring or shadow.
  - **Tier 2 — Cards & tiles** (`--card`): `ring-1 ring-foreground/5` +
    `shadow-sm`.
  - **Tier 3 — Modals & popovers** (`--popover`): `ring-1 ring-foreground/10` +
    `shadow-md`.

## Component recipes

Recipes are `cva` variants in the shadcn components (`@base/*` →
`src/components/ui/base`) and project-authored components (`@ui/*` →
`src/components/ui`). Keep variant names stable so call sites stay standard.

| Recipe               | Component                                        | Notes                                                                            |
| -------------------- | ------------------------------------------------ | -------------------------------------------------------------------------------- |
| Primary action       | `Button` `default`                               | Brass fill + `primary-foreground`                                                |
| Danger               | `Button` `destructive`                           | Soft `bg-destructive/10` + `text-destructive`, not a solid fill                  |
| Secondary action     | `Button` `outline`                               | Border + transparent; **the app's default**                                      |
| Subtle fill          | `Button` `secondary`                             | Moss/lichen neutral fill                                                         |
| Nav / icon action    | `Button` `ghost`                                 | Hover wash only                                                                  |
| Text link            | `Button` `link`                                  | Underlined                                                                       |
| Circular icon action | `Button` `size="icon"` / `IconButton`            | `IconButton` = outline + `size="icon"`                                           |
| Text field           | `Field` + `FieldLabel` + `Input`                 | Label above; `data-invalid` on `Field`, `aria-invalid` on `Input`                |
| Form                 | `Form` + `useForm`/`zodResolver`                 | RHF owns validation; `Form` binds `handleSubmit` + `noValidate`, holds no styles |
| Panel                | `Card`                                           | `CardHeader` / `CardTitle` / `CardDescription` / `CardContent` / `CardAction`    |
| Separator            | `Separator`                                      | `bg-border`, `h-px` (Base UI separator, not a custom div)                        |
| Loading              | `Spinner`                                        | `role="status"`, `size-4 animate-spin`                                           |
| Command palette      | `Command` + `CommandInput/List/Empty/Group/Item` | `cmdk`; parts are flat named exports, not a `Command.*` namespace                |

### Buttons

- **Primary (Brass hardware):** `--primary` background, `--primary-foreground`
  text, `font-semibold`. Hover drops to `bg-primary/80`; active nudges down 1px
  (`translate-y-px`).
- **Secondary (Moss loam):** `--secondary` background, `--secondary-foreground`
  text; hover blends 5% `--foreground` into the fill.
- **Ghost / tertiary:** transparent; hover applies `--muted` background with
  `--foreground` text.
- **Outline (the app default):** `--border` border, transparent fill; hover
  applies `--muted` background.

### Form inputs

- Transparent background with a bottom `border-b --input` underline.
- On focus the underline switches to `--ring`.
- Placeholder `--muted-foreground`; typed text `--foreground`.

### Cards

- `--card` surface, `ring-1 ring-foreground/5`, `shadow-sm`.

**Control heights move together.** Button default `h-10`, `sm` `h-9`, `xs` `h-7`,
`lg` `h-11`; input `h-10`. Change them as a set or forms misalign.

## Do's and Don'ts

**Do**

- Reach for `Button variant="outline"` for the app's default secondary action.
- Keep destructive/confirm actions visually distinct with `variant="destructive"`
  or a Dialog-based confirmation.
- Use `gap-*` stacks and the `max-w-4xl` shell for new pages.
- Keep `--muted-foreground` for secondary text and `--foreground` for body.
- Lift surfaces tonally (next surface level) before reaching for a shadow.

**Don't**

- Don't put `--foreground` text on `--primary`.
- Don't add radius, colors, or fonts outside the token set above.
- Don't override a component's colors via `className`.
- Don't introduce serif/extra display faces.
- Don't bypass semantic tokens with raw palette colors (`text-green-600` etc.).

## UX principles

Design from user goals, not the data model.

```text
User goal → user task → workflow → interaction model → UI structure
```

- Never map entities directly to screens: **no** `Entity → CRUD → pages`.
- A workflow may resolve to one page, a drawer, a modal, or inline interaction —
  the workflow decides, not the entity count.
- Every flow must define its empty state, error state, and destructive-action
  confirmation.
- Current app surface: Materials, Material types, Variants, Settings — each
  should be judged by the user task it serves, not by its CRUD shape.

## Responsive

- Single-column, `max-w-4xl` content column; forms collapse to stacked fields on
  narrow viewports (inputs are `text-base` until `md`).
- No horizontal overflow at 375px or 1280px.
