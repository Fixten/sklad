---
name: Sklad
description: >-
  Inventory manager for a small atelier. One forest hue stepped into a tonal
  ladder of surfaces, linework and text; brass hardware for actions; ember for
  signal only.
colors:
  white: "oklch(100% 0 0)"
  transparent: "oklch(0 0 0 / 0)"
  forest-950: "oklch(0.145 0.012 132.1)"
  forest-850: "oklch(0.235 0.020 129.5)"
  forest-800: "oklch(0.267 0.033 131.0)"
  forest-700: "oklch(0.336 0.028 130.7)"
  forest-600: "oklch(0.406 0.032 131.4)"
  forest-500: "oklch(0.538 0.055 130.8)"
  forest-300: "oklch(0.721 0.037 130.6)"
  forest-100: "oklch(0.900 0.021 131.5)"
  forest-50: "oklch(0.971 0.006 128.5)"
  brass-500: "oklch(0.757 0.079 88.4)"
  brass-400: "oklch(0.819 0.090 88.1)"
  brass-300: "oklch(0.870 0.080 88.4)"
  ember-600: "oklch(0.621 0.076 46.1)"
  ember-500: "oklch(0.661 0.080 45.4)"
  forest-60: "oklch(0.336 0.028 130.7 / 60%)"
  brass-30: "oklch(0.870 0.080 88.4 / 30%)"
  brass-10: "oklch(0.870 0.080 88.4 / 10%)"
  ember-10: "oklch(0.661 0.080 45.4 / 10%)"
  black-20: "oklch(0% 0 0 / 20%)"
  chart-1: "oklch(0.861 0.106 130.926)"
  chart-2: "oklch(0.818 0.099 130.979)"
  chart-3: "oklch(0.783 0.094 130.478)"
  chart-4: "oklch(0.75 0.091 130.808)"
  chart-5: "oklch(0.714 0.086 130.86)"
typography:
  display:
    fontFamily: "Manrope Variable, -apple-system, system-ui, sans-serif"
    fontSize: "1.75rem"
    fontWeight: 600
    lineHeight: 1.1
    letterSpacing: "0.05em"
  title:
    fontFamily: "Manrope Variable, -apple-system, system-ui, sans-serif"
    fontSize: "1.25rem"
    fontWeight: 600
    lineHeight: 1.15
    letterSpacing: "0.05em"
  label:
    fontFamily: "Manrope Variable, -apple-system, system-ui, sans-serif"
    fontSize: "0.75rem"
    fontWeight: 600
    lineHeight: 1
    letterSpacing: "0.08em"
  body:
    fontFamily: "Manrope Variable, -apple-system, system-ui, sans-serif"
    fontSize: "1rem"
    fontWeight: 500
    lineHeight: 1.5
  caption:
    fontFamily: "Manrope Variable, -apple-system, system-ui, sans-serif"
    fontSize: "0.875rem"
    fontWeight: 400
    lineHeight: 1.5
  data:
    fontFamily: "Manrope Variable, -apple-system, system-ui, sans-serif"
    fontSize: "1rem"
    fontWeight: 400
    lineHeight: 1.3
    fontFeature: "tnum"
  input:
    fontFamily: "Manrope Variable, -apple-system, system-ui, sans-serif"
    fontSize: "1rem"
    fontWeight: 500
    lineHeight: 1.5
rounded:
  none: "0"
  sm: "calc(var(--radius) - 4px)"
  md: "calc(var(--radius) - 2px)"
  lg: "var(--radius)"
  xl: "calc(var(--radius) + 4px)"
  2xl: "calc(var(--radius) * 1.8)"
  3xl: "calc(var(--radius) * 2.2)"
  4xl: "calc(var(--radius) * 2.6)"
spacing:
  base: "4px"
  1: "4px"
  2: "8px"
  3: "12px"
  4: "16px"
  5: "20px"
  6: "24px"
  8: "32px"
  10: "40px"
  16: "64px"
components:
  button-primary:
    backgroundColor: "{colors.brass-500}"
    textColor: "{colors.forest-950}"
    typography: "{typography.label}"
    rounded: "{rounded.none}"
    padding: "0 24px"
    height: "40px"
  button-primary-hover:
    backgroundColor: "{colors.brass-400}"
    textColor: "{colors.forest-950}"
    typography: "{typography.label}"
    rounded: "{rounded.none}"
    padding: "0 24px"
    height: "40px"
  button-outline:
    backgroundColor: "{colors.transparent}"
    textColor: "{colors.forest-100}"
    typography: "{typography.label}"
    rounded: "{rounded.none}"
    padding: "0 24px"
    height: "40px"
  button-outline-hover:
    backgroundColor: "{colors.forest-60}"
    textColor: "{colors.forest-100}"
    typography: "{typography.label}"
    rounded: "{rounded.none}"
    padding: "0 24px"
    height: "40px"
  button-secondary:
    backgroundColor: "{colors.forest-600}"
    textColor: "{colors.forest-50}"
    typography: "{typography.label}"
    rounded: "{rounded.none}"
    padding: "0 24px"
    height: "40px"
  button-ghost:
    backgroundColor: "{colors.transparent}"
    textColor: "{colors.forest-100}"
    typography: "{typography.label}"
    rounded: "{rounded.none}"
    padding: "0 24px"
    height: "40px"
  button-ghost-hover:
    backgroundColor: "{colors.forest-850}"
    textColor: "{colors.forest-100}"
    typography: "{typography.label}"
    rounded: "{rounded.none}"
    padding: "0 24px"
    height: "40px"
  button-destructive:
    backgroundColor: "{colors.ember-500}"
    textColor: "{colors.forest-950}"
    typography: "{typography.label}"
    rounded: "{rounded.none}"
    padding: "0 24px"
    height: "40px"
  button-destructive-hover:
    backgroundColor: "{colors.ember-600}"
    textColor: "{colors.forest-950}"
    typography: "{typography.label}"
    rounded: "{rounded.none}"
    padding: "0 24px"
    height: "40px"
  button-link:
    backgroundColor: "{colors.transparent}"
    textColor: "{colors.brass-500}"
    typography: "{typography.label}"
    rounded: "{rounded.none}"
    padding: "0"
  button-icon:
    backgroundColor: "{colors.transparent}"
    textColor: "{colors.forest-100}"
    typography: "{typography.label}"
    rounded: "{rounded.none}"
    size: "40px"
  input:
    backgroundColor: "{colors.transparent}"
    textColor: "{colors.forest-100}"
    typography: "{typography.input}"
    rounded: "{rounded.none}"
    padding: "4px 0"
    width: "100%"
    height: "40px"
  textarea:
    backgroundColor: "{colors.transparent}"
    textColor: "{colors.forest-100}"
    typography: "{typography.input}"
    rounded: "{rounded.none}"
    padding: "12px 0"
    width: "100%"
  card:
    backgroundColor: "{colors.forest-850}"
    textColor: "{colors.forest-100}"
    typography: "{typography.body}"
    rounded: "{rounded.none}"
    padding: "32px 32px"
  dialog:
    backgroundColor: "{colors.forest-800}"
    textColor: "{colors.forest-100}"
    typography: "{typography.body}"
    rounded: "{rounded.none}"
    padding: "24px"
    width: "100%"
  command-item:
    backgroundColor: "{colors.transparent}"
    textColor: "{colors.forest-100}"
    typography: "{typography.body}"
    rounded: "{rounded.none}"
    padding: "8px 12px"
    width: "100%"
  command-item-selected:
    backgroundColor: "{colors.forest-850}"
    textColor: "{colors.forest-100}"
    typography: "{typography.body}"
    rounded: "{rounded.none}"
    padding: "8px 12px"
    width: "100%"
  link:
    backgroundColor: "{colors.transparent}"
    textColor: "{colors.forest-100}"
    rounded: "{rounded.none}"
    padding: "0"
  link-hover:
    backgroundColor: "{colors.transparent}"
    textColor: "{colors.brass-500}"
    rounded: "{rounded.none}"
    padding: "0"
  nav-link:
    backgroundColor: "{colors.transparent}"
    textColor: "{colors.forest-300}"
    typography: "{typography.label}"
    padding: "0"
  nav-link-hover:
    backgroundColor: "{colors.transparent}"
    textColor: "{colors.forest-100}"
    typography: "{typography.label}"
    padding: "0"
  field-error:
    backgroundColor: "{colors.ember-500}"
    textColor: "{colors.forest-950}"
    typography: "{typography.body}"
    padding: "4px 8px"
---

# Design System: Sklad

## Overview

**Creative North Star: "The Forest Atelier"**

Sklad is the working tool of a small atelier that builds physical goods by hand and
runs the whole business itself. The world answers to that room: a single forest
green, stepped from a near-black floor to a pale sage ink, holds every surface,
every line and every word. Brass is the only thing that shines.

The system is quiet by construction. Because recording a material receipt or a
batch is a break in the work rather than a sitting-down task, the UI recedes: one
content column, no ornament, no colour competing with the data. Identity is
carried by geometry and material — one sans face in uppercase editorial caps,
sharp unrounded corners, and depth built from tonal steps rather than floating
cards. Hierarchy comes from type weight and from how light a surface is, not from
borders drawn in a second colour.

Reliability here is visual: numbers, counts and costs must be readable at a glance
on a phone at the bench, and a destructive action must never be mistaken for an
ordinary one. Every rule below exists to keep that reading honest.

**Key Characteristics:**

- Dark-only presentation; the light block in `tailwind.css` is documentation, not a shipped mode.
- One hue for the whole world: forest (H≈131), stepped into nine tones that carry floor, surfaces, linework and text.
- Surfaces are tone steps, never a second hue: floor `forest.950` → card `forest.850` → popover `forest.800`.
- Brass has two jobs: hardware at `brass.500` (the CTA), highlight at `brass.300` (accent and focus ring).
- Borders are decoration (1.40–1.67:1); every control edge owns `--control-border` and clears 3:1.
- `rounded-none` on every shipped component — sharp sera geometry.
- Depth by tonal layering plus a card shadow (`shadow-card`); surfaces carry no ring.
- Single-column `max-w-4xl` shell with a 4px spacing rhythm.

## Colors

The palette is one material, not a spectrum: the forest ladder carries everything
structural, brass is hardware and ember is a signal. Exact values live in the
frontmatter — this section carries meaning and role.

### Primary

- **Forest** — the world's one hue (H≈131), from `forest.950` (`#080B06`) as the
  floor to `forest.50` (`#F4F6F2`) as the lightest ink on a filled control. Every
  structural role reads from this ladder: canvas 950, card 850, popover 800,
  border 700, quiet fill 600, control edge 500, secondary text 300, body ink 100.
- **Brass** — the action metal, in two steps that never swap jobs. `brass.500`
  (`#C5AE75`) is hardware: the primary CTA and the one important action on a view,
  always with `forest.950` text (9.13:1). `brass.300` (`#EAD297`) is highlight:
  `--accent`, `--ring` and the focus edge (13.35:1 on the floor). The steps are far
  enough apart that brass is either a surface or a line, never a muddy in-between.

### Secondary

- **`forest.600`** (`#434D3B`) — the secondary action fill (`--secondary`), one
  step below the card: green that reads as "the other button" without leaving the
  ladder. It carries `forest.50` text (8.17:1 against the fill, 15.27:1 on a card). Its own boundary
  against the floor is 2.23:1 — a documented exemption, because the control is
  identified by its filled body and 15:1 label, not by its edge.

### Error

- **Ember** (`ember.500` `#BC8369`, `ember.600` `#AD785F` on hover) — the one
  signal that is neither green nor brass. Destructive fill and error signal only:
  6.21:1 against the floor and 5.21:1 against a card, taking `forest.950` ink
  (6.21:1). Never a surface, never a series colour, never decorative. `ember.10`
  exists for the invalid ring behind a control, not for the error message body.

### Neutral

- **`forest.100`** (`#D9E1D3`) — body ink and foreground icons; 14.76:1 on the
  floor, 12.38:1 on a card.
- **`forest.300`** (`#9DAA92`) — secondary text, metadata, placeholders, inactive
  icons (`--muted-foreground`); 8.11:1 on the floor, 6.80:1 on a card.
- **`forest.950` / `forest.850` / `forest.800`** — canvas, card, popover. A surface
  is a step, never a shadow: card over floor is 1.19:1, popover over card 1.10:1,
  and that is deliberately almost nothing.
- **Overlay** — the dialog scrim is the alpha step `black.20` (20%), carrying the
  alpha rather than a solid black. Black is not a palette tone.
- **White** — absolute lightness, unused by shipped components (framework defaults
  only).
- **Transparent** — the 0 step: control backgrounds and the button's pre-focus
  boundary.

### Main color palette

A five-step tonal ramp of the same forest hue, light to dark: `chart-1` is the
lightest (`oklch(0.861 0.106 130.926)`) and `chart-5` the deepest. This is the
world's own ladder used as data, not a categorical palette; series are told apart
by tone, never by adding hues.

Every step clears 3:1 against every surface a chart can sit on — against `--card`
the ladder runs 11.20 / 9.71 / 8.62 / 7.66 / 6.72 and against the floor
13.35 / 11.58 / 10.28 / 9.14 / 8.01 — so it is monotonic on both, with room to
spare.

Past **three** series the ramp stops carrying meaning: five tones of one hue are no
longer reliably distinguishable at phone size. Label the series directly and vary
the line dash before reaching for a second hue — the palette has no second hue to
give, and Ember is a signal, not a series colour.

### Token mapping

Components use semantic tokens only — never a raw palette value in a component
class. Every role resolves to one palette tone, so no token carries a value of its
own. Values are in the frontmatter and in the `.dark` block of
`src/styles/tailwind.css`; this table is the mapping. Three layers, the same three
everywhere: **palette tones** (frontmatter `colors`, Penpot `palette.*`), **alpha
steps** (frontmatter `-<percent>` entries, Penpot `opacity.*`) and **roles** (the
CSS variables below, Penpot `color.*`). Roles bind; palette tones never do.

| Token                          | Palette tone                  |
| ------------------------------ | ----------------------------- |
| `--background`                 | `forest.950`                  |
| `--foreground`                 | `forest.100`                  |
| `--card`                       | `forest.850`                  |
| `--card-foreground`            | `forest.100`                  |
| `--popover`                    | `forest.800`                  |
| `--popover-foreground`         | `forest.100`                  |
| `--primary`                    | `brass.500`                   |
| `--primary-hover`              | `brass.400`                   |
| `--primary-foreground`         | `forest.950`                  |
| `--secondary`                  | `forest.600`                  |
| `--secondary-foreground`       | `forest.50`                   |
| `--muted`                      | `forest.850`                  |
| `--muted-foreground`           | `forest.300`                  |
| `--accent`                     | `brass.300`                   |
| `--accent-foreground`          | `forest.950`                  |
| `--destructive`                | `ember.500`                   |
| `--destructive-hover`          | `ember.600`                   |
| `--destructive-foreground`     | `forest.950`                  |
| `--invalid`                    | `ember.500`                   |
| `--border`                     | `forest.700`                  |
| `--control-border`             | `forest.500`                  |
| `--input`                      | alias of `--control-border`   |
| `--ring`                       | `brass.300`                   |
| `--overlay`                    | `black.20` (alpha step)       |
| `--sidebar`                    | `forest.950`                  |
| `--sidebar-foreground`         | `forest.100`                  |
| `--sidebar-primary`            | `brass.500`                   |
| `--sidebar-primary-foreground` | `forest.950`                  |
| `--sidebar-accent`             | `forest.850`                  |
| `--sidebar-accent-foreground`  | `forest.100`                  |
| `--sidebar-border`             | `forest.700`                  |
| `--sidebar-ring`               | `brass.300`                   |
| `--border-hairline`            | `forest.700` at 60% (alpha)   |
| `--chart-1…5`                  | Main color palette, steps 1–5 |

`--primary-hover` and `--destructive-hover` are component state roles, not palette
entries: a hover steps one tone up the ramp (brass.500 → brass.400) instead of
dropping the fill's own opacity, which darkens it. `--input` is an alias of
`--control-border`, not a second colour: a text field's
underline and an outline button's edge must carry the same weight of line, or forms
and buttons stop agreeing.

**Penpot and the CSS carry the same values.** The `sklad` token set is what the
values above are read from; the `Colors` frame is its read-out, and the `.dark`
block of `src/styles/tailwind.css` resolves the same ladder. Change one, change all
three — a token edited in only one place is a divergence, not a design decision.

### Opacity steps

Transparency is an alpha step on a palette tone, named `<palette-tone>.<percent>`,
and the set is deliberately **five** steps — every alpha in the system earns a job:

| Opacity value | Role                            | Where used                                        |
| ------------- | ------------------------------- | ------------------------------------------------- |
| `forest.60`   | `--border-hairline`, hover wash | Swatch keyline; outline and icon-button hover     |
| `brass.30`    | `--ring`                        | Focus ring at 30% (and the global outline colour) |
| `brass.10`    | `--primary`                     | Checked field fill                                |
| `ember.10`    | `--invalid`                     | Invalid control ring behind a field               |
| `black.20`    | `--overlay`                     | Dialog scrim                                      |

Any other step is off-system. A colour can back several roles, so the same alpha can
serve more than one token. Element opacity is separate from colour alpha and is not
tokenized: disabled and inactive states use `opacity: 50%`, and the command item
check indicator toggles `0%` → `100%`.

### Surface architecture

Surfaces layer tonally, from the canvas up to floating layers. Prefer the next
surface step over a shadow to lift content.

| Level       | Role                             | Token                       |
| ----------- | -------------------------------- | --------------------------- |
| Canvas      | Root page background             | `forest.950`                |
| Surface 1   | Sidebars, quiet bands            | `forest.950` / `forest.850` |
| Surface 2   | Cards, grids, callouts           | `forest.850`                |
| Surface 3   | Floating layers, nested panels   | `forest.800`                |
| Interactive | Secondary actions, active states | `forest.600`                |
| Highlight   | Primary CTA, focus               | `brass.500` / `brass.300`   |

### Linework & accents

- **Two weights of line, two jobs.** `--border` (`forest.700`) is decoration:
  separators and section outlines at 1.40–1.67:1. `--control-border`
  (`forest.500`) is a control edge: outline buttons, input underlines, icon buttons
  at 3.02–3.96:1. A line that must be _seen_ as an edge is a control border.
- **Surfaces carry no ring.** Cards, dialogs and the command list are delimited by
  their tone step and their shadow only; a border on a surface is a maintenance tax
  that reads as almost nothing at this ladder's contrast. `--border-hairline`
  survives as the specimen keyline on Colors swatches, never as a surface edge.
- Interactive borders (focus, active input) use `--ring`; invalid fields swap the
  underline to `--invalid`.
- Active/interactive fills — toggle states, secondary buttons — use `--secondary`
  (`forest.600`); quiet hover washes use `--muted` (`forest.850`).
- **One hue per surface.** The forest ladder is the only surface family; a second
  hue in a structural role is exactly the competition this system removed.
- **Error is never a coloured ink.** Error is an Ember capsule (`--destructive`
  fill, `forest.950` label) plus an `--invalid` underline: one recipe on the floor
  and on a card alike, because coloured body text would make a signal look like
  copy.
- Titles use the editorial ink `--popover-foreground`; body copy uses
  `--foreground`; metadata and inactive icons use `--muted-foreground`.

### Named Rules

**The One Voice Rule.** Brass is spent on at most one important thing per view.
`brass.500` always carries `forest.950` text; `forest.100` on `brass.500` is 1.62:1
(1.11:1 on the highlight) and must never be used.

**The One Hue Rule.** The world is a single hue (H≈131). Surfaces, linework, text
and charts all step through it; a second hue in a structural role is a bug, not a
flavour. Ember is a signal, never a surface.

**The Border Is Decoration Rule.** `--border` is allowed to whisper (1.40–1.67:1).
Anything a user is expected to see as a boundary — a control edge, an underline, a
focus edge — uses `--control-border`, `--ring` or `--invalid`, all of which clear
3:1 against the surface they sit on.

**The No Raw Palette Rule.** Components reach for semantic tokens. Raw Tailwind
palette colours (`text-green-600`, `bg-amber-500`) are off-system, in components and
in Penpot alike.

**The Error Is Ember Rule.** Destruction and error are Ember: `--invalid` for the
underline, `--destructive` (Ember fill, `forest.950` label) for the button or
capsule that acts. Never `forest.100` on Ember (2.38:1); never Ember as a surface.

**The Contrast Floor Rule.** `--muted-foreground` on any forest surface stays
≥ 4.5:1 (8.11 floor / 6.80 card). A control boundary clears 3:1 against the surface
it actually sits on (`--control-border`: 3.02–3.96). Error and destructive clear
4.5:1 (5.21–6.21). Never communicate status by colour alone.

### Penpot

The Penpot file carries the palette as tokens, never as swatches; the `Colors`
frame (page `Design system`, right of `Components`) is a read-out of that token set
and holds no value of its own. Four blocks: **Tone ramps** (every forest, brass and
ember tone with name and hex; the brass label states which step is
hardware and which is highlight), **Chart ramp** (`palette.chart.1…5`, lightest
step first), **Alpha steps over a popover** (each `opacity.*` step composited over
`color.popover`, so a translucent step is read at the strength it really lands
with) and **Roles** (every `color.*` role with its resolved hex and its contrast
against both `color.background` and `color.card`).

- **The frame binds what it displays.** Each swatch carries the token it names —
  including palette swatches, which is the one place a value token is allowed to
  bind: a specimen of a value is that value. Everywhere else roles bind.
- **Swatches carry a `color.border-hairline` keyline.** The floor and card
  steps are otherwise invisible on the frame's own `color.background`.
- **The numbers are written at build time, not by hand.** Change a token, re-run the
  rebind pass and re-read the frame; never trust a contrast figure that has outlived
  the value it describes.

## Typography

**Display Font:** Manrope Variable (fallback: -apple-system, system-ui, sans-serif)
**Body Font:** Manrope Variable (same family)
**Label Font:** Manrope Variable — the caps label role of the same face
**Mono Font:** system stack — Tailwind default, reserved for shadcn internals
(`kbd`, code slots); there is no designed mono face in this system.

**Character:** One face, two voices: an uppercase caps hierarchy for structure
(display, title, label) and plain sentence-case copy for reading (body, caption,
data). The caps track wide and lead tight, which gives the interface an engraved,
ledger-like calm without a second typeface.

The scale is tuned for the phone on the bench, not for a desktop admin panel: the
reading floor is 1rem, and caps tracking is deliberately absolute-flat — 0.08em at
label size is 0.96px, the same optical weight as 0.05em at heading size (1.0px at
title, 1.4px at display). Tracking must never shrink with the caps.

### Hierarchy

- **Display** (600, 1.75rem, line-height 1.1, tracking 0.05em, uppercase, balanced):
  page and section headings.
- **Title** (600, 1.25rem, line-height 1.15, tracking 0.05em, uppercase, balanced):
  card, dialog and header titles.
- **Label** (600, 0.75rem, line-height 1, tracking 0.08em, uppercase): buttons,
  field labels, nav links, command group headings and shortcuts. Line-height 1 is
  safe only because label text never wraps — buttons carry `whitespace-nowrap`.
- **Body** (500, 1rem, line-height 1.5, `text-wrap: pretty`): default copy and card
  content. Weight 500 is the light-on-dark compensation: Manrope 400 at 1rem on the
  forest canvas and the raised forest cards reads thinner than it does on paper.
  One whole step above caption rather than an axis value between the two, so the
  role renders the same in code and in the Penpot file.
- **Caption** (400, 0.875rem, line-height 1.5, `text-wrap: pretty`): descriptions
  and hints.
- **Data** (400, 1rem, line-height 1.3, tabular figures): quantities, counts,
  prices. The only role with a numeric variant, so columns align.
- **Input** (500, 1rem, line-height 1.5): form controls only, owned by `Input` and
  `Textarea` — never a `Typography` variant. One size at every breakpoint: 1rem is
  both the reading floor and the iOS no-zoom floor, so there is no `md` step.

### The `Typography` component

Type is set exclusively through the `type-*` utilities, reached in features through
`@ui/Typography`. `variant` maps 1:1 onto a token; `tagName` picks the element or
component; `className` carries layout and semantic color only.

| Variant   | Token          | Default tag | Usage                            |
| --------- | -------------- | ----------- | -------------------------------- |
| `display` | `type-display` | `h1`        | Page and section headings        |
| `title`   | `type-title`   | `h2`        | Card, Dialog and header titles   |
| `label`   | `type-label`   | `span`      | Buttons, field labels, nav links |
| `body`    | `type-body`    | `p`         | Default copy, card content       |
| `caption` | `type-caption` | `p`         | Descriptions and hints           |
| `data`    | `type-data`    | `span`      | Quantities, counts, prices       |

### Named Rules

**The One Face Rule.** Manrope everywhere — copy, controls, headings and labels
(`--font-heading` aliases `--font-sans`). No serif, no second display face, no
designed mono. Geometry is expressed through caps headings and editorial spacing.

**The Body Floor Rule.** Unstyled text never lands on preflight defaults: the base
`body` rule carries `type-body`, so raw `p`, `span`, `div` and reset headings inherit
the body role (1rem / 500 / 1.5 / `pretty`) instead of 400-weight browser text. Roles
still come from `Typography` or the matching `type-*` utility, which win the cascade.

**The Token-Or-Nothing Rule.** Never set type with raw utilities (`text-xs`,
`text-sm`, `font-*`, `leading-*`, `tracking-*`) in project components. Go through
`Typography`. Replace, don't layer: Tailwind emits raw size utilities _after_ the
`type-*` utilities, so a leftover `text-sm` wins the cascade — and `cn()` will not
resolve the collision. The scale is exposed as `@utility type-*`, not as `--text-*`
theme keys, because `cn()` classifies unknown `text-*` strings as colors.

**The Measure Rule.** Prose never spans the shell. Copy caps at
`--measure-prose` (65ch) and is applied in the prose slots — `CardDescription`,
`DialogDescription`, `FieldDescription`, `CommandEmpty` — never on `type-body`
itself: the role also covers full-width controls (`InputGroupText`, the command
search field), which must keep their box. At the 1rem floor the `max-w-4xl` shell
would otherwise run copy to ~109 characters per line; 65ch resolves to ~650px
(Manrope's zero advance at 16px is 10px), which lands Cyrillic copy at ~75–79
characters per line.

**The Wrapping Rule.** Caps headings (`type-display`, `type-title`) carry
`text-wrap: balance` so a two- or three-line title breaks evenly instead of
orphaning a word; reading copy (`type-body`, `type-caption`) carries
`text-wrap: pretty`, which stops Russian's short prepositions and conjunctions from
stranding at a line end. Where the property is unsupported the declaration is
simply dropped — no fallback is needed.

### Penpot

The Penpot file mirrors this scale; it never defines it. Each role maps onto a
token of the same name in the `sklad` token set — `type-display` ↔
`typography.display`, and likewise for the other roles.

- **`Typography — Type Scale` is the scale's specimen frame** (page `Design system`,
  right of `Custom components`). One row per role, the specimen text bound to that
  role's token, annotated with its resolved numbers and the primitives it composes.
  Read a role's rendering from there — never retype it, and never reach for a
  typography asset.
- **The input role has one state.** `type-input` holds 1rem at every breakpoint, so
  it maps to the single `typography.input` token. Do not split it into a base/md
  pair — the old `md:0.875rem` step is gone, and only roles with genuinely
  different responsive values earn a pair.
- **Component-level type is the role — never a private token.** `Button` labels and
  the `Command` group heading are caps labels: both take `typography.label` and
  nothing else, in Penpot and in code. `Button`'s `tracking-widest` and `Command`'s
  heading `tracking-wider` are drift to delete in favour of `type-label`; a
  component that wants its own size, weight or tracking is asking for a role in the
  scale, not a local override.
- **Roles are composites of primitives.** Family is `font.heading`; size is a
  `text.*` token, so the input size owns its own `text.input` primitive and never
  tracks `text.body`; plus `weight.*` (400 for caption and data, 500 for body and
  input, 600 for label, title and display), `tracking.*` and `case.uppercase`. Change
  a primitive and every role referencing it follows. These tiers (`font.*`,
  `text.*`, `weight.*`, `tracking.*`, `case.*`) exist only in the Penpot token set —
  the numbers the scale above already names, written once.
- **Tracking tokens are absolute px, not em.** A typography token's `letterSpacing`
  lands on the text as px, so each `tracking.*` primitive holds the px value of the
  em the scale names, at that role's size: `tracking.label` 0.96 (0.08em @12),
  `tracking.title` 1.0 (0.05em @20) and `tracking.display` 1.4 (0.05em @28). Leading
  and other composite numbers stay bare multipliers; only
  `dimension`/`spacing`/`sizing` tokens keep `px`.
- **Bind the composite; never set type by hand.** Apply `typography.*` to a text's
  `typography` property and nothing else — any manual family, size, weight, leading
  or tracking change destroys the binding. Family arrives with the composite, so a
  bound text needs no separate `font.heading` binding.
- **Weights are the hundred steps, never axis values between them.** Penpot's weight
  picker takes 400, 500 or 600, while the browser renders any value on Manrope's
  200–800 axis. A body weight of 450 was therefore renderable in the app but not in
  the Penpot file — the composite silently refused to apply, leaving every bound text
  at its previous size and weight. A role's weight must be a step both surfaces can
  render; body's light-on-dark compensation is therefore 500, one whole step above
  caption.
- **Copy leading is 1.5 everywhere.** Card and Dialog descriptions are `type-body`
  like any other copy, at the role's own 1.5 — never a local `leading-*` override.
  Only `type-data` (1.3, tuned to a row of figures) and the caps roles lead tighter.
- **Frame caption markers take `typography.label`.** They annotate the canvas
  (specimen names, not copy); `typography.caption` stays what the scale means by it
  — 14px copy at weight 400.
- **The `Components` frame's role map** — the mapping every specimen text follows:
  caption markers, `Button`/`Label`/`Dialog` labels, the `Command` group heading and
  its shortcuts → `typography.label`; control-borne text (`Input`/`Textarea`/`Field`
  placeholders, `Input Group` value and addon) → `typography.input`; card, dialog and
  command copy, list content and `Field` hints and errors → `typography.body`; card
  and dialog headings → `typography.title`. Applying a composite consumes any loose
  `fontSize`/`fontWeight` binding on that text, and it is the only way to clear one —
  `tokens` is getter-only and a `delete` is a silent no-op. Bind the composite first,
  never the primitive.
- **`type-data`'s tabular figures have no Penpot equivalent.** A typography token
  has no `font-variant-numeric` field, so `typography.data` carries size, leading and
  weight only; the figure setting must be applied by hand in Penpot.
- **Do not create typography assets.** The Penpot Assets ▸ Typographies list stays
  empty: a library typography is a frozen preset that references no token, so text
  styled by one is off-system, un-themeable and invisible to a token audit. Penpot
  assets are reserved for what tokens cannot express — the `Button` component
  library — not for styles this scale already names.

## Layout

The shell is a single content column, centred, under a static header. Density is
comfortable and rhythmic — 4px base unit, everything on `gap-*` stacks rather than
margins.

- **App shell** (`src/layout/App.layout.tsx`): the shell owns the gutters — header and
  main share `px-4 sm:px-6`, so the wordmark and the content column line up at every
  width. `main` is `mx-auto flex max-w-4xl flex-col gap-8 px-4 pt-6 pb-16 sm:px-6`;
  the header is static, so there is no clearance offset and no `container` utility.
  The column _and_ the standard vertical stack live here; pages do not wrap themselves.
  A surface is added by widening this shell, not by re-inventing the container.
  In Penpot the column width is the `size.shell.column` token (896px), bound to the
  `header` and `main` of the `appLayout` component — the code's `max-w-4xl`.
- **Rhythm:** 4px base spacing unit (Tailwind dynamic scale). Stacks use `gap-*`:
  `gap-2` inside controls, `gap-4` / `gap-6` / `gap-8` between blocks.
- **Header:** `flex items-center justify-between px-4 py-4 sm:px-6`; the nav is a
  `gap-4 sm:gap-8` flex list — the tracked caps fit a 375px viewport at `gap-4`, the
  narrowest width the shell promises. Nav links are `--muted-foreground`, shift to
  `--foreground` on hover, and stay `--foreground` for the current route (`aria-current`).
- **Filter and form rows:** `flex items-end gap-4` (rows of fields + submit), `gap-8`
  between larger groups.
- **Field groups:** `Field` is `flex w-full flex-col gap-3` with the `FieldLabel`
  above the control; `FieldGroup` stacks fields at `gap-10`.
- **Prose:** long copy never runs the width of the column — the prose slots cap at
  `--measure-prose` (see §Typography ▸ The Measure Rule).
- **Responsive:** one column at every width; forms collapse to stacked fields on
  narrow viewports. No horizontal overflow at 375px or 1280px.

### Named Rules

**The One Column Rule.** Content lives in one `max-w-4xl` column. New surfaces
inherit the shell instead of introducing a second grid.

## Elevation & Depth

Depth is **tonal**, not shadowed. The system picks a lighter surface before it
picks a drop shadow: cards sit above the canvas because `forest.850` is a step up
from `forest.950`, and floating layers sit above cards because they move to
`forest.800`. Surfaces carry no ring: tone draws the edge, and the shadow is a
whisper that confirms the lift, never the lift itself.

### Shadow Vocabulary

- **Surface confirmation** (`shadow-card`): a contact plus ambient shadow that
  seats the tier-2 card on the floor. Cards only.
- **Tier-3 floaters carry no shadow.** Furnishing layers (dialog, sheet,
  palette, select content) sit over surfaces close in tone, so the dark
  shadow-on-dark renders as nothing — it is removed at the component sources
  (`DialogContent`, `SelectContent`, the palette panels) and never re-declared
  downstream. A floating layer is identified by its tonal step, and by the
  scrim where one exists: a layer that opens over a scrim lets the scrim do the
  lifting, exactly like the sheet.

### Named Rules

**The Layer-Before-Shadow Rule.** To lift content, move one step up the ladder
(950 → 850 → 800). Only then add `shadow-card` — tier-3 floaters carry no
shadow at all — and never invent a second shadow value. A surface never earns a
ring to prove it was lifted.

## Shapes

Form language is **sharp**: buttons, inputs, textareas, cards, dialogs, popovers,
menu items and separators all set `rounded-none`. Nothing is a pill, nothing is
soft — the geometry is cut, like a leather edge or a brass plate. The `--radius`
ladder (frontmatter `rounded.*`, based on `--radius: 0.625rem`) stays registered in
`tailwind.css` for surfaces that legitimately opt in, but a component recipe must
never restore rounding on its own.

Boundaries are drawn two ways only: a full box border on controls (`Button` carries
`border border-transparent` plus a variant border), and a bottom-only underline on
text fields (`border-b-input`). Surfaces draw neither: they separate by tone and
shadow. Clipping is equally plain — images inside cards are square to the card edge,
no rounded masks, no bleed.

### Named Rules

**The Sharp Sera Rule.** `rounded-none` is the default and the shipped answer. If a
component wants a radius, that is a system-level decision recorded here first — not
a local `rounded-lg`.

## Components

Character: **sharp-edged brass hardware on a forest ladder.** Controls are cut
square, actions are brass or one step of green, and every surface they sit on is a
step in the same hue.

### Buttons

- **Shape:** square (radius 0); `border border-transparent` so variants swap the
  boundary without changing geometry.
- **Width:** buttons hug their label — 24px horizontal padding on the default
  and large sizes, 16px at `sm`; label text is never pinned to a fixed box
  (a pinned label clips any Russian copy that outgrows it). Icon buttons stay
  fixed 40×40.
- **Typography:** `type-label` (uppercase caps) in every variant and size.
- **Primary (brass):** `--primary` fill + `--primary-foreground` text; hover
  `brass.400`; active nudges down 1px (`translate-y-px`).
- **Outline (the app's default secondary action):** `--control-border` edge,
  transparent fill; hover fills with `forest.60` (60% forest linework) — a neutral
  lift, not a brass wash.
- **Secondary (green):** `--secondary` fill + `--secondary-foreground` text; hover
  blends 5% `--foreground` into the fill. The fill itself is 2.23:1 against the
  floor — exempt from the boundary floor because the 8.17:1 label carries the
  control.
- **Ghost / tertiary:** transparent; hover applies `--muted` background with
  `--foreground` text.
- **Destructive:** `--destructive` (Ember) fill + `--destructive-foreground`
  (`forest.950`) label; hover `ember.600`. The only place Ember fills a large
  control, and never a surface.
- **Link:** `--primary` text, underlined, `underline-offset-4`.
- **Focus / invalid:** `focus-visible:border-ring` plus a 2px `ring/30` ring
  (`brass.30`); `aria-invalid` swaps both to `--invalid` — the full-strength edge
  (6.21:1 on the floor) plus an `ember.10` ring.
- **Disabled:** `opacity: 50%`, pointer events off.
- **Icon:** `IconButton` = `variant="outline"` + `size="icon"` (`size-10`), edge on
  `--control-border`, hover on `forest.60`.

### Chips

There is no chip or badge component in the shipped system. Status is carried by
typography and by the surface a value sits in (e.g. a `MaterialTypeLabel` in
`--muted-foreground`). Add a chip only by adding it to this document first.

### OptionRow

A pick row inside a popover tier-3 surface — the atomic choice of supply sheets
and supplier lists. Full-width (512px inside the sheet column), fixed 48px tall,
`px-4 py-3` padding, `flex row align-center` — `space-between` for the two pick
states; New is `start` with a 12px gap (it carries the `Plus` icon and no
trailing meta). Square corners, no edge.

- **Default:** transparent fill; `type-body` label in `--foreground`, optional
  meta at the right edge — a `type-caption` line set `uppercase` (14px, weight
  400, no tracking) in `--muted-foreground` (`ПИЛОМАТЕРИАЛ · ДУБ`).
- **Selected:** fills with `--muted` (`forest.850`, #1b2016) — one step _down_
  from the popover (`forest.800`), the same tonal selection discipline the
  command palette list uses — plus a 2px brass selection bar (`--primary`,
  full row height) flush at the row's left edge. The bar is the non-color state
  cue (the tonal step alone is 1.4:1 in-canvas and cannot carry the state
  alone); it lives in the `Selected` variant main, token-bound to
  `color.primary`, so every instance inherits it. Selection never uses brass
  text or fills — the bar is the only brass element on the row.
- **New:** the create row — `Icon / Plus` (24×24, `--foreground` strokes) and a
  `type-body` label ("новый вариант в «Дуб»", "новый поставщик: «Лесоторг»"),
  laid `start` from the 16px inset, icon first, 12px to the label. The variant
  main carries the literal "+ Новый вариант"; per-screen copy is a label
  override, as with the other states.

In Penpot the three states are one `OptionRow` component with a `State` axis
(`Custom components` section, `OptionRow` container). Instances keep the 512×48
frame; per-screen copy is a label override, and `meta` is hidden when a state has
no right-hand caption.

Lists of these rows stack with no gap; the create row leads the list. The list
surface is the popover itself — no additional shadow. In code the
family renders through one shared renderer, `@ui/OptionList`; the bar is implemented
as an inset 2px `--primary` edge on the active row, so it never shifts the layout.

### OptionPicker

The composite pick — a `Field` plus the `OptionRow` list — used wherever a supply
step asks the user to choose or create a named thing. One `OptionPicker` component
in Penpot (`Custom components`), assembled from `Field` and `OptionRow` instances:
no bespoke shapes, no tokens of its own.

- **Anatomy:** `Field` (label + control + description) then the list. The list opens
  with the create row, then the result rows — order is always `create → results`,
  never results-first.
- **Slots:** the main carries three result slots (one `Selected`, two `Default`) plus
  the create row; a consumer hides the slots it does not use.
- **Active, not chosen:** the open list keeps an active option for keyboard and
  pointer traversal, so a row renders as `Selected` (muted band + brass bar) even
  when nothing has been committed yet. While results exist the first result is
  active, never the create row — `Enter` picks instead of creating by accident; with
  no results the create row is the only row and takes the active state.
- **Idle:** the list is hidden when the field is not focused or has nothing to show.
  The `Field` is content-sized, so hiding its description collapses the picker from 100
  to 64.
- **Placement:** the list always sits in the flow, 24px under the field; it pushes
  the form and the sheet grows with it. There is no overlay variant.
- **Open while focused:** the list is open when the field is focused and has an option
  to show. Typing, focus, a click or `ArrowDown` opens it; an outside click, `Tab`,
  `Escape` or a pick closes it. `Escape` closes the list first, so a second press is
  what reaches the sheet.
- **Not a closed select.** `FieldSelect` shows one committed value behind a chevron;
  the picker stays a text field with a live list, because typing is what filters and
  what offers the create row.

In Penpot the list surface is bound to `color.popover`, the sheet's own tone; in the
flow it is invisible.

In code the composite is `@ui/OptionPicker` — `@ui/InputField` plus `@ui/OptionList`;
the consumer owns filtering and the create row, the picker owns focus, keyboard
traversal and when the list shows.

### Cards / Containers

- **Corner Style:** square (radius 0).
- **Background:** `--card` (`forest.850`), text `--card-foreground`.
- **Shadow Strategy:** `shadow-card` only, no ring (see Elevation).
- **Internal Padding:** `--card-spacing` = 32px by default, 20px at `size="sm"`,
  applied as vertical padding, inter-block `gap` and horizontal padding on
  `CardHeader` / `CardContent` / `CardFooter`.
- **Anatomy:** `CardHeader` (title + optional `CardAction` in the right column) →
  `CardDescription` → `CardContent` → `CardFooter`. `CardTitle` is `type-title`;
  descriptions are `type-body` in `--muted-foreground`. `Separator` (`bg-border`,
  `h-px`) divides, it does not outline.

### Inputs / Fields

- **Style:** transparent background, no box — a single bottom underline in
  `--control-border` (alias of `--input`), `rounded-none`, height 40px,
  `type-input`.
- **Focus:** the underline switches to `--ring`.
- **Placeholder** is `--muted-foreground`; typed text is `--foreground`.
- **Invalid:** the underline switches to `--invalid` and the field carries an Ember
  capsule — `--destructive` fill with `--destructive-foreground` label
  (`FieldError`: `w-fit px-2 py-1`). One recipe on every surface (6.21:1 on the
  floor, 5.21:1 on a card), because the underline alone is too subtle to carry the
  state. It is a fill with dark ink, never Ember text.
- **Disabled:** `opacity: 50%`, cursor not allowed.
- **Composition:** `Field` (vertical, `gap-3`) owns label + control + error;
  `FieldLabel` and `FieldTitle` are `type-label`; `FieldDescription` is `type-body`
  in `--muted-foreground`. `FieldGroup` stacks at `gap-10`.
- **Control heights move together:** button `default` 40px, `sm` 36px, `xs` 28px,
  `lg` 44px; input 40px. Change them as a set or forms misalign.

### Dialog & Popover

Floating layers are tier 3: `--popover` surface (`forest.800`), `rounded-none`,
`gap-6`, 24px padding, `max-w-md` from `sm` up. The backdrop is
`--overlay` at 20% with a small backdrop blur, and open/close transitions are
`duration-100` fade + zoom. The layer carries no ring and no shadow: it is
identified by its tonal step and the scrim, not by its edge.

**A dialog carries no corner ✕.** Its dismissal is a footer control, and that
control is mandatory: `DialogFooter` always renders it — a `DialogClose` on a
ghost button labelled `Закрыть`, ahead of whatever actions the dialog passes — so
every dialog has a way out that a touch screen reader can reach. Escape and an
outside press are bonus paths, never the only ones — the scrim dismisses at every
breakpoint, including the 16px gutter a dialog leaves on a phone. The dismissal
is ghost rather than outline because the dialog's own surface is only 1.10:1 from
the card beneath, so a boundary there would be a whisper anyway; on a raised
surface a control changes pattern instead of leaning on a line. Deleting the ✕ is
a deliberate deviation from upstream shadcn — re-apply it after any `shadcn add`.

### Sheet

The responsive self between tier-2 pages and the tier-3 popover: the column a
supply flow slides into over a foreground scrim (`--overlay` 20% + no blur in the
penpot realisation). A `Sheet` main lives in Penpot (`Custom components`) and is
instantiated per screen.

- **Geometry:** fixed 560px column, `--popover` fill (`forest.800`), square
  corners, no ring. Padding and stack gap are `--spacing-6` (24px) throughout —
  the sheet is a popover at column width, so its padding recipe matches the
  popover, not the card.
- **Elevation note:** the sheet is **flat**, on canvas and in code — no drop
  shadow. It opens over the scrim, so the scrim does the lifting and the
  surface step does the separating: a slab that already dims the world behind
  it does not also cast a shadow. It needs no cancel in code: tier-3 layers
  carry no shadow at all (see Shadow Vocabulary).
- **Anatomy:** `sheet-header` (title `type-title` set uppercase in
  `--foreground`, step counter `type-label` in `--foreground` at the right edge)
  → a 1px `--border-hairline` separator → `content` slot → optional
  `sheet-footer` (`gap-2` row for actions). Like the dialog, a sheet carries **no
  corner ✕** — dismissal is the footer's `Отмена`, `Escape`, or a press on the
  scrim.
- **Content belt:** the body rows are `OptionRow`s (see below) stacked with no
  gap unless the flow dictates whitespace; header-title copy and the counter are
  per-screen overrides, everything else is system.

### Command Palette (signature)

The command palette is the search entry on Home and Materials, and it is the
clearest single expression of the world. It rests as one line on the `--popover`
surface: a `--popover` slab with square corners and no outline of its own, holding
a search icon and a `type-body` placeholder. There is no underline under the field
and no divider to the list — the slab edge is the boundary, and a brass caret is
the only state signal. No list, heading, or item renders at rest. Focus, a click,
or `/` opens it.

The open list is an absolute overlay flush under the line — `top-full`, full width,
`z-50`, the same `--popover` fill, no border and no divider — so the
palette reads as one continuous panel, and surrounding content never moves.
Internals are unchanged: `type-label` group headings in `--muted-foreground`,
`type-body` items at `px-3 py-2` that light up with `data-selected:bg-muted` — a
step _down_ from the popover, since the list already sits on the highest surface —
and `type-label` shortcuts at the right edge. Selection is tonal, not brass; brass
stays reserved. Escape, an outside press, or a selection closes it; the empty
message lives inside the open overlay.

### Links

Both recipes are owned by the component (`@ui/Link`); a consumer's `className` is
for layout only, never for colour.

- **`Link`** — inline navigation inside copy and rows: ink `--foreground`, whose
  underline is the interactive marker at `decoration-primary` /
  `underline-offset-4`, moving to `--primary` ink on hover. The brass is the
  _line_, not the text: brass ink on a card is 7.66:1, but the line is what marks
  a link on a touch screen, and body copy stays in `forest.100` on the canvas and
  on a card alike. `Link` sets no type of its own; the surrounding role carries it.
- **`NavLink`** — a route link for navigation rows: `type-label` in
  `--muted-foreground` shifting to `--foreground` on hover and staying
  `--foreground` for the current route (`aria-current="page"`), with
  `whitespace-nowrap` and a color transition.

### Navigation

The header holds a `type-title` wordmark ("Sklad") and a horizontal nav of
`NavLink`s, `gap-4 sm:gap-8` apart; it lays the list out and carries no link
recipe of its own. The sidebar tokens exist in the palette but the shipped shell
uses the header; if a sidebar appears it takes `--sidebar*` verbatim — all of
which now sit on the same forest ladder.

### Separator & Loading

`Separator` is a Base UI separator on `bg-border` at `h-px` (horizontal) — never a
hand-rolled div; it is decoration, so it takes the decorative border. `Spinner` is
`Loader2Icon` at `size-4` with `animate-spin`, `role="status"`.

## Do's and Don'ts

### Do:

- **Do** reach for `Button variant="outline"` for the app's default secondary
  action, and `variant="default"` (brass) for the one primary CTA on a view.
- **Do** keep destructive/confirm actions visually distinct with
  `variant="destructive"` (Ember fill, `forest.950` label), and pair destructive
  intent with a Dialog confirmation.
- **Do** put `forest.950` text on brass — `--primary-foreground` every time.
- **Do** put every boundary that must be seen — control edges, underlines, focus
  edges — on `--control-border`, `--ring` or `--invalid`.
- **Do** step surfaces up the forest ladder (950 → 850 → 800) before reaching for a
  shadow.
- **Do** use `gap-*` stacks and the `max-w-4xl` shell for new surfaces.
- **Do** keep `--muted-foreground` for secondary text and `--foreground` for body.
- **Do** set all type through `Typography` / the `type-*` tokens.
- **Do** keep `rounded-none` on shipped components.
- **Do** use tabular figures (`type-data`) for any column of numbers.
- **Do** chart with the main color palette: `--chart-1` for a single series, deeper
  steps in order for up to three, and direct labels past that.
- **Do** re-run the rebind pass (`literal → apply token`) after editing a token
  value, in Penpot and in CSS.
- **Do** verify the `--muted-foreground` pairing stays ≥ 4.5:1 when the forest
  ladder changes.

### Don't:

- **Don't** put `--foreground` (`forest.100`) text on `--primary`; it is 1.62:1.
- **Don't** introduce a second hue into surfaces, linework or text — Ember is a
  signal, not a surface, and there is no second material family.
- **Don't** ring a surface (card, dialog, command list) — they separate by tone and
  shadow; a border there is maintenance that reads as almost nothing.
- **Don't** draw a control edge with `--border`; 1.40–1.67:1 is a whisper, not a
  boundary.
- **Don't** render error as a coloured ink — the Ember capsule plus `--invalid`
  underline is the only recipe.
- **Don't** put a corner ✕ on a dialog — dismissal is the footer's ghost `Закрыть`,
  which `DialogFooter` renders for every dialog (upstream shadcn's ✕ is removed on
  purpose).
- **Don't** add radius, colors, fonts or shadow values outside the token set above.
- **Don't** override a component's colors via `className`.
- **Don't** introduce serif, mono or additional display faces, and don't use
  `font-mono` in project components.
- **Don't** bypass semantic tokens with raw palette colors (`text-green-600` etc.).
- **Don't** separate chart series with a second hue or with Ember — the palette is a
  tonal ladder of one hue; label the series or vary the line dash.
- **Don't** communicate status or error by color alone — pair it with a message or
  icon.
- **Don't** style Penpot text with a typography asset or an off-scale face — bind a
  `typography.*` token.
- **Don't** maintain or introduce a light theme unless the product requirements
  explicitly change.

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
- Current app surface: Materials, Material types, Variants, Settings — each should
  be judged by the user task it serves, not by its CRUD shape.
