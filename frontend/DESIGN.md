---
name: sklad
description: >-
  Inventory management SPA with a "Forest & Hide" atelier theme: deep forest
  green, warm brown and charcoal neutrals, muted brass actions, olive accents,
  and an editorial typographic voice.

colors:
  foundation:
    black: "oklch(0% 0 0)"
    white: "oklch(100% 0 0)"
    transparent: "oklch(0 0 0 / 0)"
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
    overlay: "oklch(0% 0 0)"
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
  sans: "'Manrope Variable', sans-serif"
  heading: "'Manrope Variable', sans-serif — aliases sans, one face"
  mono: "system stack — Tailwind default, shadcn internals only"
  component: "@ui/Typography — variant maps 1:1 to the scale below"
  scale:
    display: "type-display — Manrope / 24px / 600 / 0.05em / uppercase"
    title: "type-title — Manrope / 18px / 600 / 0.05em / uppercase"
    label: "type-label — Manrope / 12px / 600 / 0.025em / uppercase"
    body: "type-body — Manrope / 14px / 400 / normal"
    caption: "type-caption — Manrope / 12px / 400 / normal"
    data: "type-data — Manrope / 14px / 400 / tabular-nums"
    input: "type-input — Manrope / 16px, md:14px / 400 / normal — form controls only"

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
    base: "inline-flex items-center justify-center gap-1.5 rounded-none type-label"
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
    base: "rounded-none bg-card text-sm ring-1 ring-border/60 py-(--card-spacing) gap-(--card-spacing) shadow-sm"
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
- **Type:** `Manrope Variable` for everything — body, controls, headings and
  technical labels (`--font-sans` == `--font-heading`).

## Semantic colors

Components use semantic tokens only — never raw palette values in component
classes. This section is the single home of the raw values: the frontmatter
repeats them verbatim for tooling, and nothing else in the document restates a
color's meaning. Every role is assigned to its palette color
exactly once, in the token mapping below. The theme is dark-only; the values live
in the `.dark` block of `src/styles/tailwind.css` and are registered in
`@theme inline` as a `--color-*` token.

### Foundation

The non-theme primitives the palette sits on: black, white and transparent.
They are not palette colors, and only black has been given a role — it backs
`--overlay` (see the token mapping below) so no component ever names it
directly. White and transparent carry no registration at all and appear only as
CSS keywords or framework defaults.

| Color       | Value              | Meaning and purpose                                                                                                                                                                             |
| ----------- | ------------------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Black       | `oklch(0% 0 0)`    | Absolute darkness, deliberately kept out of the palette — Deep Forest and Warm Brown carry every dark surface instead. Registered only as `--overlay`, used at `black.20` for the dialog scrim. |
| White       | `oklch(100% 0 0)`  | Absolute lightness. Warm Off-White is the light ink for every surface, so pure white is unused by shipped components and is reserved for framework defaults (e.g. the ring offset color).       |
| Transparent | `oklch(0 0 0 / 0)` | The 0 step: fills and borders that must not paint — control backgrounds (`bg-transparent`) and the button's pre-focus boundary (`border-transparent`).                                          |

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

Every role resolves to one palette entry — or, for `--overlay`, to the black
foundation primitive; no token carries its own value.

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
| `--overlay`                    | Black                         |
| `--sidebar`                    | Deep Forest                   |
| `--sidebar-foreground`         | Warm Off-White                |
| `--sidebar-primary`            | Muted Brass                   |
| `--sidebar-primary-foreground` | Deep Forest                   |
| `--sidebar-accent`             | Warm Charcoal                 |
| `--sidebar-accent-foreground`  | Warm Off-White                |
| `--sidebar-border`             | Deep Olive                    |
| `--sidebar-ring`               | Muted Brass                   |
| `--chart-1…5`                  | Main color palette, steps 1–5 |

### Opacity steps

Transparency is an alpha step on a palette or foundation color, named
`<semantic-color>.<percent>` — e.g. `deep-olive.60` is Deep Olive at 60% alpha
(names are the kebab-case of the palette or foundation entry).
Percentages are the only axis; there is no separate opacity scale. The complete
set in use is **5, 10, 20, 30, 50, 60, 80, 90**; any other step is off-system.
A color can back several roles, so the same alpha can serve more than one token —
the `Role` column says which. Dark theme is active, so a step marked _(dark)_ is
the one that renders.

| Opacity value      | Role                  | Where used                                                          |
| ------------------ | --------------------- | ------------------------------------------------------------------- |
| `deep-olive.30`    | `--input`             | Outline button hover fill _(dark)_                                  |
| `deep-olive.50`    | `--border`            | Command palette separator                                           |
| `deep-olive.60`    | `--border`            | Card hairline ring (Tier 2)                                         |
| `muted-brass.5`    | `--primary`           | Checked field fill _(light)_                                        |
| `muted-brass.10`   | `--primary`           | Checked field fill _(dark)_                                         |
| `muted-brass.20`   | `--primary`           | Checked field border _(dark)_                                       |
| `muted-brass.30`   | `--primary`, `--ring` | Checked field border _(light)_; focus rings                         |
| `muted-brass.50`   | `--ring`              | Global `outline` color (`@layer base` in `src/styles/tailwind.css`) |
| `muted-brass.80`   | `--primary`           | Primary button hover fill                                           |
| `warm-beige.10`    | `--muted-foreground`  | Kbd chip fill inside input groups                                   |
| `warm-brown.20`    | `--destructive`       | Invalid-state ring on buttons                                       |
| `warm-brown.90`    | `--destructive`       | Destructive button hover fill                                       |
| `warm-charcoal.50` | `--muted`             | Ghost button hover _(dark)_ and field hover wash                    |
| `warm-off-white.5` | `--foreground`        | Mixed into Deep Olive for the secondary button hover                |
| `black.20`         | `--overlay`           | Dialog scrim (see [Foundation](#foundation))                        |

Element opacity is separate from color alpha and is not tokenized: disabled and
inactive states use `opacity: 50%` (buttons, inputs, labels, command items), and
the command item check indicator toggles `opacity: 0%` → `100%`. Fully
transparent fills and borders are the 0 step (see [Foundation](#foundation)) and
are not listed per color.

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
  `--input`. Surface hairline rings on lifted layers are the same token — cards
  at `ring-border/60`, modals and popovers at full `ring-border` — never a
  `--foreground` tint.
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

Type is set exclusively through the `type-*` utilities defined in
`src/styles/tailwind.css`, reached through the `Typography` component
(`@ui/Typography`). The component and the tokens are the only sanctioned way to set
family, size, weight, leading or tracking.

### `Typography`

```tsx
<Typography variant="title">Материалы</Typography>
<Typography variant="label" tagName={Link} to="/material">Материал</Typography>
```

| Prop        | Default     | Notes                                                      |
| ----------- | ----------- | ---------------------------------------------------------- |
| `variant`   | `body`      | One of the six variants below; maps 1:1 onto a token       |
| `tagName`   | per variant | Polymorphic element or component; rest props are forwarded |
| `className` | —           | Layout and semantic color only — never type overrides      |

| Variant   | Token          | Default tag | Usage                            |
| --------- | -------------- | ----------- | -------------------------------- |
| `display` | `type-display` | `h1`        | Page and section headings        |
| `title`   | `type-title`   | `h2`        | Card, Dialog and header titles   |
| `label`   | `type-label`   | `span`      | Buttons, field labels, nav links |
| `body`    | `type-body`    | `p`         | Default copy, card content       |
| `caption` | `type-caption` | `p`         | Descriptions and hints           |
| `data`    | `type-data`    | `span`      | Quantities, counts, prices       |

- Features render text through `<Typography variant>` — never write `type-*` or
  raw type utilities (`text-*`, `font-*`, `leading-*`, `tracking-*`) at the call
  site.
- Keep `type-input` for form controls: `Input`/`Textarea` own their size, so it is
  not a `Typography` variant.

### Scale

| Token          | Family  | Size / leading   | Weight | Tracking | Transform | Usage                                        |
| -------------- | ------- | ---------------- | ------ | -------- | --------- | -------------------------------------------- |
| `type-display` | Manrope | 24px / 1.2       | 600    | 0.05em   | uppercase | Page and section headings                    |
| `type-title`   | Manrope | 18px / 1         | 600    | 0.05em   | uppercase | Card, Dialog and header titles               |
| `type-label`   | Manrope | 12px / 1         | 600    | 0.025em  | uppercase | Buttons, field labels, nav links             |
| `type-body`    | Manrope | 14px / 1.5       | 400    | normal   | —         | Default copy, card content                   |
| `type-caption` | Manrope | 12px / 1.5       | 400    | normal   | —         | Descriptions and hints                       |
| `type-data`    | Manrope | 14px / 1.25      | 400    | normal   | —         | Quantities, counts, prices (tabular figures) |
| `type-input`   | Manrope | 16px, `md:` 14px | 400    | normal   | —         | Input and Textarea                           |

- Use the token for the role; never set type with raw utilities (`text-xs`,
  `text-sm`, `font-*`, `leading-*`, `tracking-*`) in project components — go
  through `Typography` instead.
- Replace, don't layer: Tailwind emits raw size utilities _after_ the `type-*`
  tokens, so a leftover `text-sm`/`text-lg` wins over the token's size in the
  cascade (family, weight and tracking still come from the token). `cn()` does
  not resolve these collisions — remove the utility you are replacing.
- `src/components/ui/base/**` is upstream shadcn code and is exempt until it is
  migrated onto the tokens — never pull it out of style.
- The scale is exposed as `@utility type-*`, **not** `--text-*` theme keys:
  `cn()` classifies unknown `text-*` strings as colors, so a size token placed
  next to `text-muted-foreground` gets dropped.
- One face only: Manrope, for copy, controls, headings and labels
  (`--font-heading` aliases `--font-sans`). Do **not** introduce serif, mono or
  additional display faces; the geometry is expressed through caps headings +
  editorial spacing.
- `--font-mono` is a plain system stack (Tailwind default) and exists only for
  shadcn internals that reach for `font-mono` (`kbd`, code slots). Project
  components must not use `font-mono` — there is no intentionally designed mono
  face in this system.
- Data columns use tabular figures so digits align (`type-data`).
- New tokens are added to `tailwind.css` and listed here and in the frontmatter
  `typography.scale` — keep the three in sync.
- Typography is self-contained to this file, `tailwind.css` and the tokens above.
  The shadcn [Typography](https://ui.shadcn.com/docs/components/base/typography)
  demo page and `@tailwindcss/typography` (`prose`) are deliberately **not** used:
  they ship a competing untokenized scale (negative tracking, `text-3xl`/`4xl`
  headings, larger body leading) and none of their guidance is borrowed here. If a
  long-form surface ever appears, it gets its own `type-prose` token in this scale
  (mostly a vertical-rhythm recipe for p/list/blockquote/table), defined in
  `tailwind.css` and documented like the others — never a third-party style layer.

### Penpot

The Penpot file mirrors this scale; it never defines it. Each role maps onto a token
of the same name in the `sklad` token set — `type-display` ↔ `typography.display`,
and likewise for the other roles.

- **The input is the only role with two states.** `type-input` is also the only
  utility carrying an `md:` override, so it maps to a base/md pair:
  `typography.input.base` (16px, the mobile-first `text-base`) and
  `typography.input.md` (14px, `text-sm`). Bind `typography.input.md` on frames
  ≥768px and `typography.input.base` below. The pair exists only because Penpot has
  no media queries — do not invent state pairs for the other six roles.
- **Component-level type is the role — never a private token.** `Button` labels and the
  `Command` group heading are caps labels: both take `typography.label` and nothing
  else, in Penpot and in code. `Button`'s `tracking-widest` and `Command`'s heading
  `tracking-wider` are drift to delete in favour of `type-label`; a component that wants
  its own size, weight or tracking is asking for a role in the scale, not a local
  override.
- **Roles are composites of primitives.** Family is `font.heading`; size is a `text.*`
  token, so the input sizes own their own `text.input.base` / `text.input.md`
  primitives and never track `text.body`; plus `weight.*`, `tracking.*` and
  `case.uppercase`. Change a primitive and every role referencing it follows. These
  tiers (`font.*`, `text.*`, `weight.*`, `tracking.*`, `case.*`) exist only in the
  Penpot token set — the numbers the scale above already names, written once.
- **Tracking tokens are absolute px, not em.** A typography token's `letterSpacing`
  lands on the text as px, so each `tracking.*` primitive holds the px value of the em
  the scale names, at that role's size: `tracking.label` 0.3 (0.025em @12),
  `tracking.title` 0.9 (0.05em @18) and `tracking.display` 1.2 (0.05em @24). Leading and
  other composite numbers stay bare multipliers; only
  `dimension`/`spacing`/`sizing` tokens keep `px`.
- **Bind the composite; never set type by hand.** Apply `typography.*` to a text's
  `typography` property and nothing else — any manual family, size, weight, leading or
  tracking change on that text destroys the binding and leaves the literal behind.
  Family arrives with the composite, so a bound text needs no separate `font.heading`
  binding.
- **Copy leading is 1.5 everywhere.** Card and Dialog descriptions are `type-body` like
  any other copy; the `leading-relaxed` (1.625) on them in
  `src/components/ui/base/{card,dialog}.tsx` is code drift to remove.
- **The frame's caption markers take `typography.label`.** They annotate the canvas
  (specimen names, not copy) and are set in the caps label role; `typography.caption`
  stays what the scale means by it — 12px copy at weight 400.
- **`type-data`'s tabular figures have no Penpot equivalent.** A typography token has
  no `font-variant-numeric` field, so `typography.data` carries size, leading and
  weight only; the figure setting must be applied by hand in Penpot.
- **Do not create typography assets.** The Penpot Assets ▸ Typographies list stays
  empty: a library typography is a frozen preset that references no token, so text
  styled by one is off-system, un-themeable and invisible to a token audit. Penpot
  assets are reserved for what tokens cannot express — the `Button` component
  library — not for styles this scale already names.

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
  - **Tier 2 — Cards & tiles** (`--card`): `ring-1 ring-border/60` +
    `shadow-sm`.
  - **Tier 3 — Modals & popovers** (`--popover`): `ring-1 ring-border` +
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
- On error the underline switches to `--destructive` and the message renders as a brown
  strip (`bg-destructive` + `--destructive-foreground`) — the underline alone is too subtle
  to carry the state.

### Cards

- `--card` surface, `ring-1 ring-border/60`, `shadow-sm`.

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
- Don't style Penpot text with a typography asset or an off-scale face — bind a
  `typography.*` token (see Penpot above).

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
