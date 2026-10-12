---
# DESIGN.md — Sklad
# Generated from the project's live tokens (src/styles/tailwind.css), the shadcn
# preset (style: sera, base: base-ui, baseColor: olive, theme: yellow,
# chartColor: green, icons: lucide, menuAccent: subtle) and the shadcn /
# ux-design skills. Color values are OKLCH, verbatim from tailwind.css.
name: sklad
description: >-
  Inventory management SPA. Editorial, typographic "sera" styling on a
  Base UI (shadcn) foundation. Calm neutrals, a warm yellow action color, a
  green chart ramp, and a mono heading face for technical labels.

colors:
  light:
    background: "oklch(1 0 0)"
    foreground: "oklch(0.153 0.006 107.1)"
    card: "oklch(1 0 0)"
    card-foreground: "oklch(0.153 0.006 107.1)"
    popover: "oklch(1 0 0)"
    popover-foreground: "oklch(0.153 0.006 107.1)"
    primary: "oklch(0.852 0.199 91.936)"
    primary-foreground: "oklch(0.421 0.095 57.708)"
    secondary: "oklch(0.967 0.001 286.375)"
    secondary-foreground: "oklch(0.21 0.006 285.885)"
    muted: "oklch(0.966 0.005 106.5)"
    muted-foreground: "oklch(0.58 0.031 107.3)"
    accent: "oklch(0.966 0.005 106.5)"
    accent-foreground: "oklch(0.228 0.013 107.4)"
    destructive: "oklch(0.577 0.245 27.325)"
    destructive-foreground: "oklch(0.577 0.245 27.325)"
    border: "oklch(0.93 0.007 106.5)"
    input: "oklch(0.93 0.007 106.5)"
    ring: "oklch(0.737 0.021 106.9)"
    sidebar: "oklch(0.988 0.003 106.5)"
    sidebar-foreground: "oklch(0.153 0.006 107.1)"
    sidebar-primary: "oklch(0.681 0.162 75.834)"
    sidebar-primary-foreground: "oklch(0.987 0.026 102.212)"
    sidebar-accent: "oklch(0.966 0.005 106.5)"
    sidebar-accent-foreground: "oklch(0.228 0.013 107.4)"
    sidebar-border: "oklch(0.93 0.007 106.5)"
    sidebar-ring: "oklch(0.737 0.021 106.9)"
  dark:
    background: "oklch(0.153 0.006 107.1)"
    foreground: "oklch(0.988 0.003 106.5)"
    card: "oklch(0.228 0.013 107.4)"
    card-foreground: "oklch(0.988 0.003 106.5)"
    popover: "oklch(0.228 0.013 107.4)"
    popover-foreground: "oklch(0.988 0.003 106.5)"
    primary: "oklch(0.795 0.184 86.047)"
    primary-foreground: "oklch(0.421 0.095 57.708)"
    secondary: "oklch(0.274 0.006 286.033)"
    secondary-foreground: "oklch(0.985 0 0)"
    muted: "oklch(0.286 0.016 107.4)"
    muted-foreground: "oklch(0.737 0.021 106.9)"
    accent: "oklch(0.286 0.016 107.4)"
    accent-foreground: "oklch(0.988 0.003 106.5)"
    destructive: "oklch(0.704 0.191 22.216)"
    destructive-foreground: "oklch(0.637 0.237 25.331)"
    border: "oklch(1 0 0 / 10%)"
    input: "oklch(1 0 0 / 15%)"
    ring: "oklch(0.58 0.031 107.3)"
    sidebar: "oklch(0.228 0.013 107.4)"
    sidebar-foreground: "oklch(0.988 0.003 106.5)"
    sidebar-primary: "oklch(0.795 0.184 86.047)"
    sidebar-primary-foreground: "oklch(0.987 0.026 102.212)"
    sidebar-accent: "oklch(0.286 0.016 107.4)"
    sidebar-accent-foreground: "oklch(0.988 0.003 106.5)"
    sidebar-border: "oklch(1 0 0 / 10%)"
    sidebar-ring: "oklch(0.58 0.031 107.3)"
  chart:
    - "oklch(0.871 0.15 154.449)"
    - "oklch(0.723 0.219 149.579)"
    - "oklch(0.627 0.194 149.214)"
    - "oklch(0.527 0.154 150.069)"
    - "oklch(0.448 0.119 151.328)"

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
Vite + React SPA built on **shadcn/ui with a Base UI base** (`base: base`) and
Tailwind v4 CSS-variable theming. The look is **sera**: editorial and
typographic, with a warm yellow action color on a calm olive-tinted neutral
scale, and a monospace heading face for technical labels.

This document is the design source of truth. When it disagrees with code, update
the code (per `AGENTS.md`).

## Overview

- **Voice:** calm, matter-of-fact, utilitarian. Russian UI copy.
- **Canvas:** near-white (`--background`) in light mode; near-black olive in dark.
- **Action color:** yellow `--primary` (`oklch(0.852 0.199 91.936)` light) with a
  dark amber `--primary-foreground` for text/icon on it.
- **Neutrals:** olive-tinted (hue ≈ 107) greys for muted surfaces and text.
- **Charts:** a single green ramp (`--chart-1…5`) for data visualization.
- **Type:** `Noto Sans Variable` for everything; `Geist Mono Variable` for
  headings/labels (`--font-heading`).

## Colors

Semantic roles only — components never reference raw Tailwind palette colors.
Every role is defined in `:root` and `.dark` in `src/styles/tailwind.css` and
registered in `@theme inline` as a `--color-*` token.

| Role           | Token                  | Light                 | Dark                  |
| -------------- | ---------------------- | --------------------- | --------------------- |
| Page floor     | `--background`         | near-white            | near-black            |
| Body text      | `--foreground`         | `0.153 0.006 107.1`   | `0.988 0.003 106.5`   |
| Card surface   | `--card`               | white                 | `0.228 0.013 107.4`   |
| CTA fill       | `--primary`            | `0.852 0.199 91.936`  | `0.795 0.184 86.047`  |
| CTA text       | `--primary-foreground` | `0.421 0.095 57.708`  | `0.421 0.095 57.708`  |
| Secondary fill | `--secondary`          | `0.967 0.001 286.375` | `0.274 0.006 286.033` |
| Soft band      | `--muted`              | `0.966 0.005 106.5`   | `0.286 0.016 107.4`   |
| Secondary text | `--muted-foreground`   | `0.58 0.031 107.3`    | `0.737 0.021 106.9`   |
| Hover wash     | `--accent`             | `0.966 0.005 106.5`   | `0.286 0.016 107.4`   |
| Error          | `--destructive`        | `0.577 0.245 27.325`  | `0.704 0.191 22.216`  |
| Hairline       | `--border` / `--input` | `0.93 0.007 106.5`    | `oklch(1 0 0 / 10%)`  |
| Focus ring     | `--ring`               | `0.737 0.021 106.9`   | `0.58 0.031 107.3`    |

Chart ramp (identical in both modes): `--chart-1…5` green
(`154.449 → 151.328`).

### Contrast notes

- `--muted-foreground` on `--background` and on `--muted` is intended as the
  secondary-text pairing; verify it stays ≥ 4.5:1 whenever the neutral ramp is
  touched.
- `--primary` is a light yellow: text placed **on** it must use
  `--primary-foreground` (dark amber), never `--foreground`.
- `--destructive-foreground` light equals `--destructive` — do not use it as a
  text-on-surface color; use `text-destructive` for error text.

## Typography

| Role    | Family                | Usage                                                      |
| ------- | --------------------- | ---------------------------------------------------------- |
| Sans    | `Noto Sans Variable`  | All body copy, controls, tables                            |
| Heading | `Geist Mono Variable` | `--font-heading`; small component titles, technical labels |

- Base body size is `text-sm`; inputs are `text-base` on mobile, `md:text-sm`.
- Labels are `text-xs font-semibold uppercase tracking-wide` (sera editorial caps).
- Do **not** introduce serif or additional display faces; sera geometry here is
  expressed through mono headings + editorial spacing, not a serif.

## Layout & spacing

- 4px base spacing unit (Tailwind dynamic scale); use `gap-*` for all stacks.
- App shell: `container mx-auto max-w-4xl` with a top `pt-16` offset for the
  header (`src/layout/App.layout.tsx`).
- Forms and filter rows: `flex items-end gap-4` / `gap-8`.
- Field groups: `Field` (`flex w-full flex-col gap-3`) — `FieldLabel` above the
  control; `FieldGroup` stacks fields at `gap-10`.

## Radius & elevation

- Sera is **sharp**: buttons, inputs, cards, dialogs, popovers and separators all set
  `rounded-none`. The `--radius` ladder (frontmatter) stays in tokens for surfaces that
  opt in, but component recipes must not restore rounding.
- Elevation is minimal: `shadow-sm` on cards, `shadow-md` on dialogs. Underlined inputs
  (`border-b-input`) and card rings (`ring-1 ring-foreground/5`) carry most separation.

## Component recipes

Recipes are `cva` variants in the shadcn components (`@base/*` → `src/components/ui/base`) and
project-authored components (`@ui/*` → `src/components/ui`). Keep variant names stable so
call sites stay standard.

| Recipe               | Component                                        | Notes                                                                            |
| -------------------- | ------------------------------------------------ | -------------------------------------------------------------------------------- |
| Primary action       | `Button` `default`                               | Yellow fill + `primary-foreground`                                               |
| Danger               | `Button` `destructive`                           | Soft `bg-destructive/10` + `text-destructive`, not a solid fill                  |
| Secondary action     | `Button` `outline`                               | Border + transparent; **the app's default**                                      |
| Subtle fill          | `Button` `secondary`                             | Neutral filled                                                                   |
| Nav / icon action    | `Button` `ghost`                                 | Hover wash only                                                                  |
| Text link            | `Button` `link`                                  | Underlined                                                                       |
| Circular icon action | `Button` `size="icon"` / `IconButton`            | `IconButton` = outline + `size="icon"`                                           |
| Text field           | `Field` + `FieldLabel` + `Input`                 | Label above; `data-invalid` on `Field`, `aria-invalid` on `Input`                |
| Form                 | `Form` + `useForm`/`zodResolver`                 | RHF owns validation; `Form` binds `handleSubmit` + `noValidate`, holds no styles |
| Panel                | `Card`                                           | `CardHeader` / `CardTitle` / `CardDescription` / `CardContent` / `CardAction`    |
| Separator            | `Separator`                                      | `bg-border`, `h-px` (Base UI separator, not a custom div)                        |
| Loading              | `Spinner`                                        | `role="status"`, `size-4 animate-spin`                                           |
| Command palette      | `Command` + `CommandInput/List/Empty/Group/Item` | `cmdk`; parts are flat named exports, not a `Command.*` namespace                |

**Control heights move together.** Button default `h-10`, `sm` `h-9`, `xs` `h-7`,
`lg` `h-11`; input `h-10`. Change them as a set or forms misalign.

## Conventions

Enforced by the `shadcn` skill rules; treat as review blockers.

- **Semantic colors only.** `bg-primary text-primary-foreground`,
  `text-muted-foreground` — never `bg-blue-500`, `text-emerald-600`.
- **Variants before custom styles.** `variant="outline"`, `size="sm"` — don't
  hand-roll the same look with utilities.
- **`className` is for layout**, not color/typography overrides.
- **No `space-x-*` / `space-y-*`.** Use `flex` + `gap-*`.
- **`size-*` when width = height** (`size-9`, not `w-9 h-9`).
- **`truncate`** shorthand over three utilities.
- **No manual `dark:` overrides.** Semantic tokens switch automatically.
- **`cn()`** (the `cn` package) for conditional/merged classes.
- **No manual `z-index`** on overlays — they manage their own stacking.
- **Polymorphism:** Base UI base → use `render={<X/>}`; **never `asChild`**
  (that is the Radix API and was removed in this project's Base UI migration).
- **Icons:** `lucide-react`, passed as components (`icon={Check}`), no ad-hoc
  sizing classes inside components.
- **Compose, don't reinvent:** use an existing `@base/*` or `@ui/*` component before
  writing a styled `div`.

## Do's and Don'ts

**Do**

- Reach for `Button variant="outline"` for the app's default secondary action.
- Keep destructive/confirm actions visually distinct with `variant="destructive"`
  or `Alert`-style framing.
- Use `gap-*` stacks and the `max-w-4xl` shell for new pages.
- Keep `--muted-foreground` for secondary text and `--foreground` for body.

**Don't**

- Don't put `--foreground` text on `--primary`.
- Don't add radius, colors, or fonts outside the token set above.
- Don't override a component's colors via `className`.
- Don't introduce serif/extra display faces.
- Don't bypass semantic tokens with status colors (`text-green-600` etc.).

## UX principles

From the `ux-design` skill — design from user goals, not the data model.

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

## Known Gaps

- **Some forms can't submit.** `SelectMaterialType` renders only a label (no control yet),
  so `material_type_id` is never set and `EditMaterial` always fails validation;
  `EditVariant`'s `onSubmit` is still commented out (nothing is sent).
