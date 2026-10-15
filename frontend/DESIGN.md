---
name: sklad
description: >-
  Inventory management SPA with a "Forest & Hide" atelier theme: deep forest
  green, warm brown and charcoal neutrals, muted brass actions, olive accents,
  and an editorial typographic voice.

colors:
  dark:
    background: "oklch(0.267 0.033 131)"
    foreground: "oklch(0.979 0.005 95.099)"
    card: "oklch(0.452 0.047 53.927)"
    card-foreground: "oklch(0.979 0.005 95.099)"
    popover: "oklch(0.452 0.047 53.927)"
    popover-foreground: "oklch(0.979 0.005 95.099)"
    primary: "oklch(0.757 0.079 88.436)"
    primary-foreground: "oklch(0.267 0.033 131)"
    secondary: "oklch(0.494 0.058 127.848)"
    secondary-foreground: "oklch(0.979 0.005 95.099)"
    muted: "oklch(0.288 0.009 67.447)"
    muted-foreground: "oklch(0.843 0.028 72.764)"
    accent: "oklch(0.757 0.079 88.436)"
    accent-foreground: "oklch(0.267 0.033 131)"
    destructive: "oklch(0.452 0.047 53.927)"
    destructive-foreground: "oklch(0.979 0.005 95.099)"
    border: "oklch(0.494 0.058 127.848)"
    input: "oklch(0.494 0.058 127.848)"
    ring: "oklch(0.757 0.079 88.436)"
    sidebar: "oklch(0.267 0.033 131)"
    sidebar-foreground: "oklch(0.979 0.005 95.099)"
    sidebar-primary: "oklch(0.757 0.079 88.436)"
    sidebar-primary-foreground: "oklch(0.267 0.033 131)"
    sidebar-accent: "oklch(0.288 0.009 67.447)"
    sidebar-accent-foreground: "oklch(0.979 0.005 95.099)"
    sidebar-border: "oklch(0.494 0.058 127.848)"
    sidebar-ring: "oklch(0.757 0.079 88.436)"
  chart:
    dark:
      [
        "oklch(0.86 0.106 131)",
        "oklch(0.745 0.091 131)",
        "oklch(0.63 0.077 131)",
        "oklch(0.515 0.063 131)",
        "oklch(0.4 0.049 131)",
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
  steps: "Tailwind dynamic scale — p-1=4px, p-2=8px, p-3=12px, p-4=16px, p-8=32px"
  used: ["gap-2", "gap-3", "gap-4", "gap-6", "gap-8", "px-3", "px-4", "px-6"]

sizing:
  control:
    xs: "28px (h-7) / px-3 (12px)"
    sm: "36px (h-9) / px-4 (16px)"
    md: "40px (h-10) / px-6 (24px)"
    lg: "44px (h-11) / px-8 (32px)"
    input: "40px (h-10)"
  icon:
    xs: "28px (size-7)"
    sm: "36px (size-9)"
    md: "40px (size-10)"
    lg: "44px (size-11)"

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
a leather artisan's atelier — deep forest green, warm brown and charcoal
neutrals, burnished-brass actions and olive accents — carried on an editorial,
typographic "sera" foundation.

This document is the design source of truth. When it disagrees with code, update
the code (per `AGENTS.md`).

## Overview

- **Voice:** calm, matter-of-fact, utilitarian. Russian UI copy.
- **Atmosphere:** grounded in forest, warm hide, natural wood, muted brass and
  stone — organic warmth and natural shelter, never cold tech-noir or neon.
- **Audience:** independent makers, studio managers and atelier teams balancing
  tactile material craft with inventory counts and batch workflows.
- **Resonance:** quiet confidence and grounded clarity; the UI recedes so
  material textures, product photography and ledger data stay prominent.
- **Theme:** dark-only. Do not maintain or introduce a light theme unless the
  product requirements explicitly change.
- **Type:** `Noto Sans Variable` for body and controls; `Geist Mono Variable` for
  headings and technical labels (`--font-heading`).

## Semantic colors

Components use semantic tokens only — never raw palette values in component
classes. This section is the single home of the raw values: the frontmatter
repeats them verbatim for tooling, and nothing else in the document restates a
color's meaning. Every role is assigned to its palette color exactly once, in
the token mapping below. The theme is dark-only; the values live in the `.dark`
block of `src/styles/tailwind.css` and are registered in `@theme inline` as a
`--color-*` token.

### Main brand color

| Color           | Value                    | Meaning and purpose                                                                                                                                                                                                  |
| --------------- | ------------------------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Deep Forest** | `oklch(0.267 0.033 131)` | Sklad's main brand color and identity anchor: the app canvas (`--background`) and brand moments, plus the dark text on gold actions. It is the page floor — it anchors the system rather than filling every surface. |

### Palette

Supporting colors, each assigned only once through the tokens in the mapping
below.

| Color          | Value                        | Meaning and purpose                                                                                                                                                                             |
| -------------- | ---------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Warm Off-White | `oklch(0.979 0.005 95.099)`  | Primary readable text and foreground icons on dark, olive and brown surfaces (`--foreground` and every light `-foreground`). Never a large page background.                                     |
| Muted Brass    | `oklch(0.757 0.079 88.436)`  | The action color, reserved for **the most important things only**: the primary CTA, the focus ring and key accent highlights. Always carries Deep Forest text; never a general hover wash.      |
| Deep Olive     | `oklch(0.494 0.058 127.848)` | Secondary actions and interactive/active elements: the secondary button fill, selected states, structural borders and input underlines. Carries Warm Off-White text.                            |
| Warm Brown     | `oklch(0.452 0.047 53.927)`  | **Big surfaces only** — cards, floating layers and the destructive surface; the warm hide that contrasts the brand green. Never an accent, never a small control, never text on a dark surface. |
| Warm Charcoal  | `oklch(0.288 0.009 67.447)`  | Quiet fills: muted bands and the sidebar nav hover — the subdued counterpart to the brown surfaces.                                                                                             |
| Warm Beige     | `oklch(0.843 0.028 72.764)`  | Secondary text, metadata, helper text and inactive icons (`--muted-foreground`). Verify contrast on every surface it sits on (4.60:1 on brown).                                                 |

### Main color palette

A five-step ramp derived from the main brand color — same hue family, stepped in
lightness from dark to light. This is **the main color's own palette**: use it as
such for chart series (`--chart-1…5`), not as general-purpose brand colors.
Distinguishability comes from the lightness steps, not from hue.

| Token       | Value                    |
| ----------- | ------------------------ |
| `--chart-1` | `oklch(0.86 0.106 131)`  |
| `--chart-2` | `oklch(0.745 0.091 131)` |
| `--chart-3` | `oklch(0.63 0.077 131)`  |
| `--chart-4` | `oklch(0.515 0.063 131)` |
| `--chart-5` | `oklch(0.4 0.049 131)`   |

### Token mapping

Every role resolves to one palette entry; no token carries its own value.

| Token                          | Palette color                 |
| ------------------------------ | ----------------------------- |
| `--background`                 | Deep Forest                   |
| `--foreground`                 | Warm Off-White                |
| `--card`                       | Warm Brown                    |
| `--card-foreground`            | Warm Off-White                |
| `--popover`                    | Warm Brown                    |
| `--popover-foreground`         | Warm Off-White                |
| `--primary`                    | Muted Brass                   |
| `--primary-foreground`         | Deep Forest                   |
| `--secondary`                  | Deep Olive                    |
| `--secondary-foreground`       | Warm Off-White                |
| `--muted`                      | Warm Charcoal                 |
| `--muted-foreground`           | Warm Beige                    |
| `--accent`                     | Muted Brass                   |
| `--accent-foreground`          | Deep Forest                   |
| `--destructive`                | Warm Brown                    |
| `--destructive-foreground`     | Warm Off-White                |
| `--border`                     | Deep Olive                    |
| `--input`                      | Deep Olive                    |
| `--ring`                       | Muted Brass                   |
| `--sidebar`                    | Deep Forest                   |
| `--sidebar-foreground`         | Warm Off-White                |
| `--sidebar-primary`            | Muted Brass                   |
| `--sidebar-primary-foreground` | Deep Forest                   |
| `--sidebar-accent`             | Warm Charcoal                 |
| `--sidebar-accent-foreground`  | Warm Off-White                |
| `--sidebar-border`             | Deep Olive                    |
| `--sidebar-ring`               | Muted Brass                   |
| `--chart-1…5`                  | Main color palette, steps 1–5 |

### Surface architecture

Surfaces layer tonally, from the canvas up to floating layers. Prefer the next
surface level over a shadow to lift content.

| Level       | Role                             | Token                   |
| ----------- | -------------------------------- | ----------------------- |
| Canvas      | Root page background             | `--background`          |
| Surface 1   | Sidebars, quiet bands            | `--sidebar` / `--muted` |
| Surface 2   | Cards, grids, callouts           | `--card`                |
| Surface 3   | Floating layers, nested panels   | `--popover`             |
| Interactive | Secondary actions, active states | `--secondary`           |
| Highlight   | Primary CTA, focus               | `--primary` / `--ring`  |

### Linework & accents

- Structural borders are `--border`; control boundaries (input underlines) use
  `--input`.
- Interactive borders (focus, active input) use `--ring`.
- Active/interactive fills — toggle states, secondary buttons — use
  `--secondary` (olive); quiet hover bands use `--muted`.
- Gold (`--primary`, `--accent`) is reserved for the most important moments and
  always carries Deep Forest text.
- Titles use the editorial ink `--popover-foreground`; body copy uses
  `--foreground`; metadata and inactive icons use `--muted-foreground`.

### Color & contrast guidance

- Verify WCAG contrast for every text/background pairing, especially muted text
  and text on gold, olive and brown. `--muted-foreground` on `--background`,
  `--muted` and `--card` is the secondary-text pairing; it stays ≥ 4.5:1
  (4.60:1 on brown) — keep it there whenever the neutral ramp is touched.
- Text on gold always uses `--primary-foreground` / `--accent-foreground` (Deep
  Forest); Warm Off-White on gold is only 2.04:1 and must never be used.
- **Errors are surfaces.** `--destructive` is a brown fill: where the component
  already provides a background (destructive button, alert, badge) use it with
  `--destructive-foreground`. Brown text is allowed only on a light background —
  never on the dark canvas — and there is no red in the palette.
- The invalid input underline (`aria-invalid`) turns brown too; it is subtle on
  purpose, so always pair it with a message or icon. Never communicate status by
  color alone.
- Keep success, warning, destructive and informational states semantically
  distinct from brand accents; add dedicated tokens if the UI ever needs more
  than the destructive role.
- Chart colors come from the main color palette and are told apart by lightness;
  do not add hues to the ramp.
- Never bypass semantic tokens with raw Tailwind palette colors
  (`text-green-600` etc.).

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
| Danger               | `Button` `destructive`                           | Brown fill (`bg-destructive`) + `destructive-foreground` text                    |
| Secondary action     | `Button` `outline`                               | Border + transparent; **the app's default**                                      |
| Subtle fill          | `Button` `secondary`                             | Olive secondary fill                                                             |
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
- **Secondary (Olive):** `--secondary` background, `--secondary-foreground`
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
