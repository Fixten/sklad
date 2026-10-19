---
name: Sklad
description: >-
  Inventory manager for a small atelier. Forest & Hide: deep forest green, warm
  brown and charcoal neutrals, brass actions, olive accents, sharp sera geometry.
colors:
  black: "oklch(0% 0 0)"
  white: "oklch(100% 0 0)"
  transparent: "oklch(0 0 0 / 0)"
  deep-forest: "oklch(0.267 0.033 131)"
  warm-off-white: "oklch(0.979 0.005 95.099)"
  muted-brass: "oklch(0.757 0.079 88.436)"
  deep-olive: "oklch(0.539 0.057 127.665)"
  ember: "oklch(0.661 0.08 45.402)"
  warm-brown: "oklch(0.452 0.047 53.927)"
  warm-charcoal: "oklch(0.288 0.009 67.447)"
  warm-beige: "oklch(0.843 0.028 72.764)"
  muted-brass-5: "oklch(0.757 0.079 88.436 / 5%)"
  muted-brass-10: "oklch(0.757 0.079 88.436 / 10%)"
  muted-brass-20: "oklch(0.757 0.079 88.436 / 20%)"
  muted-brass-30: "oklch(0.757 0.079 88.436 / 30%)"
  muted-brass-50: "oklch(0.757 0.079 88.436 / 50%)"
  muted-brass-80: "oklch(0.757 0.079 88.436 / 80%)"
  deep-olive-30: "oklch(0.539 0.057 127.665 / 30%)"
  deep-olive-50: "oklch(0.539 0.057 127.665 / 50%)"
  deep-olive-60: "oklch(0.539 0.057 127.665 / 60%)"
  ember-10: "oklch(0.661 0.08 45.402 / 10%)"
  ember-30: "oklch(0.661 0.08 45.402 / 30%)"
  ember-90: "oklch(0.661 0.08 45.402 / 90%)"
  warm-charcoal-50: "oklch(0.288 0.009 67.447 / 50%)"
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
    backgroundColor: "{colors.muted-brass}"
    textColor: "{colors.deep-forest}"
    typography: "{typography.label}"
    rounded: "{rounded.none}"
    padding: "0 24px"
    height: "40px"
  button-primary-hover:
    backgroundColor: "{colors.muted-brass-80}"
    textColor: "{colors.deep-forest}"
    typography: "{typography.label}"
    rounded: "{rounded.none}"
    padding: "0 24px"
    height: "40px"
  button-outline:
    backgroundColor: "{colors.transparent}"
    textColor: "{colors.foreground}"
    typography: "{typography.label}"
    rounded: "{rounded.none}"
    padding: "0 24px"
    height: "40px"
  button-outline-hover:
    backgroundColor: "{colors.deep-olive-30}"
    textColor: "{colors.warm-off-white}"
    typography: "{typography.label}"
    rounded: "{rounded.none}"
    padding: "0 24px"
    height: "40px"
  button-secondary:
    backgroundColor: "{colors.deep-olive}"
    textColor: "{colors.warm-off-white}"
    typography: "{typography.label}"
    rounded: "{rounded.none}"
    padding: "0 24px"
    height: "40px"
  button-ghost:
    backgroundColor: "{colors.transparent}"
    textColor: "{colors.warm-off-white}"
    typography: "{typography.label}"
    rounded: "{rounded.none}"
    padding: "0 24px"
    height: "40px"
  button-ghost-hover:
    backgroundColor: "{colors.warm-charcoal-50}"
    textColor: "{colors.warm-off-white}"
    typography: "{typography.label}"
    rounded: "{rounded.none}"
    padding: "0 24px"
    height: "40px"
  button-destructive:
    backgroundColor: "{colors.ember}"
    textColor: "{colors.deep-forest}"
    typography: "{typography.label}"
    rounded: "{rounded.none}"
    padding: "0 24px"
    height: "40px"
  button-destructive-hover:
    backgroundColor: "{colors.ember-90}"
    textColor: "{colors.deep-forest}"
    typography: "{typography.label}"
    rounded: "{rounded.none}"
    padding: "0 24px"
    height: "40px"
  button-link:
    backgroundColor: "{colors.transparent}"
    textColor: "{colors.muted-brass}"
    typography: "{typography.label}"
    rounded: "{rounded.none}"
    padding: "0"
  button-icon:
    backgroundColor: "{colors.transparent}"
    textColor: "{colors.foreground}"
    typography: "{typography.label}"
    rounded: "{rounded.none}"
    size: "40px"
  input:
    backgroundColor: "{colors.transparent}"
    textColor: "{colors.warm-off-white}"
    typography: "{typography.input}"
    rounded: "{rounded.none}"
    padding: "4px 0"
    width: "100%"
    height: "40px"
  textarea:
    backgroundColor: "{colors.transparent}"
    textColor: "{colors.warm-off-white}"
    typography: "{typography.input}"
    rounded: "{rounded.none}"
    padding: "12px 0"
    width: "100%"
  card:
    backgroundColor: "{colors.warm-brown}"
    textColor: "{colors.warm-off-white}"
    typography: "{typography.body}"
    rounded: "{rounded.none}"
    padding: "32px 32px"
  dialog:
    backgroundColor: "{colors.warm-brown}"
    textColor: "{colors.warm-off-white}"
    typography: "{typography.body}"
    rounded: "{rounded.none}"
    padding: "24px"
    width: "100%"
  command-item:
    backgroundColor: "{colors.transparent}"
    textColor: "{colors.warm-off-white}"
    typography: "{typography.body}"
    rounded: "{rounded.none}"
    padding: "8px 12px"
    width: "100%"
  command-item-selected:
    backgroundColor: "{colors.warm-charcoal}"
    textColor: "{colors.warm-off-white}"
    typography: "{typography.body}"
    rounded: "{rounded.none}"
    padding: "8px 12px"
    width: "100%"
  link:
    backgroundColor: "{colors.transparent}"
    textColor: "{colors.warm-off-white}"
    rounded: "{rounded.none}"
    padding: "0"
  link-hover:
    backgroundColor: "{colors.transparent}"
    textColor: "{colors.muted-brass}"
    rounded: "{rounded.none}"
    padding: "0"
  nav-link:
    backgroundColor: "{colors.transparent}"
    textColor: "{colors.warm-beige}"
    typography: "{typography.label}"
    padding: "0"
  nav-link-hover:
    backgroundColor: "{colors.transparent}"
    textColor: "{colors.warm-off-white}"
    typography: "{typography.label}"
    padding: "0"
  field-error:
    backgroundColor: "{colors.ember-10}"
    textColor: "{colors.warm-off-white}"
    typography: "{typography.body}"
    padding: "4px 8px"
---

# Design System: Sklad

## Overview

**Creative North Star: "The Forest & Hide Atelier"**

Sklad is the working tool of a small atelier that builds physical goods by hand
and runs the whole business itself. The visual world answers to that room: deep
forest green as the page floor, warm hide and charcoal as the surfaces, muted
brass as the only thing that shines. It is the disciplined serenity of a leather
artisan's workshop translated into an interface — organic warmth and natural
shelter, never cold tech-noir, never neon, never a glowing dashboard.

The system is quiet by construction. Because recording a material receipt or a
batch is a break in the work rather than a sitting-down task, the UI recedes:
one content column, no ornament, no color competing with the data. What carries
the identity is not decoration but geometry and material — a single sans face
set in uppercase editorial caps, sharp unrounded corners on every shipped
element, and depth built from tonal surface steps rather than floating cards.
Hierarchy comes from type weight and from how light a surface is, not from
borders drawn in a second color.

Reliability here is visual: numbers, counts and costs must be readable at a
glance on a phone at the bench, and a destructive action must never be mistaken
for an ordinary one. Every rule below exists to keep that reading honest.

**Key Characteristics:**

- Dark-only presentation; the light block in `tailwind.css` is documentation, not a shipped mode.
- One typeface (Manrope) in an uppercase-caps editorial hierarchy, at a 1rem reading floor with a 65ch prose measure.
- Brass is rare and always carries Deep Forest text; brown is a surface, never an accent.
- `rounded-none` on every shipped component — sharp sera geometry.
- Depth by tonal layering plus hairline `--border` rings; shadows only as a whisper (`shadow-sm`, `shadow-md`).
- Single-column `max-w-4xl` shell with a 4px spacing rhythm.

## Colors

The palette is material, not chromatic: two greens, a hide brown, a stone
neutral and one brass accent, all sharing low chroma so nothing ever shouts.
Exact values live in the frontmatter — this section carries meaning and role.

### Primary

- **Deep Forest** — the main brand color and identity anchor. It is the app canvas
  (`--background`) and every brand moment, and it is the text color on brass. It is
  the page floor: the system is anchored by it, not filled with it.
- **Muted Brass** — the action color, reserved for the most important things only:
  the primary CTA, the focus ring and key highlights. Always carries Deep Forest
  text. It is never a general hover wash.

### Secondary

- **Deep Olive** — secondary actions and interactive/active elements: the secondary
  button fill, selected states, structural borders and input underlines. Carries
  Warm Off-White text. Its lightness is set so a control boundary clears the floor
  against Deep Forest (3.03:1) — do not darken it back toward the brand green. It
  is a _floor-only_ material: on brown surfaces linework and olive controls lose
  their boundary (see §Linework & accents).

### Tertiary

- **Warm Brown** — big surfaces only: cards and floating layers. The warm hide that
  contrasts the brand green. Never an accent, never a small control, never text on
  a dark surface — and never an action fill: a brown control on a brown surface has
  no boundary at all (1.00:1).

### Error

- **Ember** — the one signal in the system that is neither green nor brass. It is
  both the destructive action fill and the error signal, because brown could not do
  that job: as surface _and_ destructive fill it made the action invisible on cards
  and dialogs (1.00:1) and weak on the floor (2.02:1). Ember is 4.73:1 on Deep
  Forest and takes Deep Forest text (4.73:1); Warm Off-White on Ember is 3.00:1 and
  is forbidden. Ember is never a surface and never decorative.

### Neutral

- **Warm Off-White** — primary readable text and foreground icons on dark, olive
  and brown surfaces (`--foreground` and every light `-foreground`). Never a large
  page background.
- **Warm Charcoal** — quiet fills: muted bands, ghost and hover washes, the sidebar
  nav hover. The subdued counterpart to the brown surfaces.
- **Warm Beige** — secondary text, metadata, helper text, inactive icons
  (`--muted-foreground`).
- **Black** — absolute darkness, deliberately kept out of the palette; registered
  only as `--overlay`, and the dialog scrim is the alpha step `black.20` (20%) —
  the token carries the alpha, not the solid black.
- **White** — absolute lightness; unused by shipped components (framework defaults
  such as the ring offset color only).
- **Transparent** — the 0 step: control backgrounds (`bg-transparent`) and the
  button's pre-focus boundary (`border-transparent`).

### Main color palette

A five-step **tonal ramp of the main brand color**: one hue (≈131, Deep Forest's own),
stepped in lightness from **light to dark** — `chart-1` is the lightest
(`oklch(0.861 0.106 130.926)`, the design's chart color) and `chart-5` the deepest. This is
**the main color's own palette**, meant for chart series, not a set of general-purpose
brand colors and not a categorical palette. Series are told apart by tone, never by
adding hues.

`chart-1` is the step to reach for: a single-series chart, or the first series, is
`--chart-1`. Every step clears 3:1 against the lightest surface a chart can sit on
(`--card`: 5.04 / 4.37 / 3.88 / 3.45 / 3.02) and clears it with room on the canvas
(10.18 / 8.82 / 7.83 / 6.96 / 6.11), so the ladder is monotonic on both surfaces and
neighbouring steps read as one family.

Past **three** series the ramp stops carrying meaning: five tones of one hue are no
longer reliably distinguishable at phone size. Label the series directly (legend text or
direct labels) and vary the line dash before reaching for a second hue — the palette has
no second hue to give, and Ember is a signal, not a series colour.

### Token mapping

Components use semantic tokens only — never a raw palette value in a component
class. Every role resolves to one palette entry, so no token carries a value of its
own. Values are in the frontmatter and in the `.dark` block of
`src/styles/tailwind.css`; this table is the mapping. Three layers, the same three
everywhere: **palette values** (frontmatter `colors`, Penpot `palette.*`), **alpha
steps** (frontmatter `-<percent>` entries, Penpot `opacity.*`) and **roles** (the
CSS variables below, Penpot `color.*`). Roles bind; palette values never do.

**Penpot and the CSS carry the same values.** The `sklad` token set is what the values
above are read from. The `.dark` block of `src/styles/tailwind.css` mirrors it: the lifted
olive on `--border`, `--input`, `--secondary` and `--sidebar-border`, Ember on
`--destructive` and `--invalid` with a Deep Forest label, `--overlay` as `black.20`, and
the current chart ramp.

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
| `--destructive`                | Ember                         |
| `--destructive-foreground`     | Deep Forest                   |
| `--invalid`                    | Ember                         |
| `--border`                     | Deep Olive                    |
| `--input`                      | Deep Olive                    |
| `--ring`                       | Muted Brass                   |
| `--overlay`                    | Black, step `black.20`        |
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

Transparency is an alpha step on a palette color, named
`<palette-color>.<percent>` — `deep-olive.60` is Deep Olive at 60% alpha (names
are the kebab-case of the palette entry). Percentages are the only
axis; there is no separate opacity scale. The complete set in use is **5, 10, 20,
30, 50, 60, 80, 90**; any other step is off-system. A color can back several
roles, so the same alpha can serve more than one token.

| Opacity value      | Role                  | Where used                                                          |
| ------------------ | --------------------- | ------------------------------------------------------------------- |
| `deep-olive.30`    | `--input`             | Outline button hover fill                                           |
| `deep-olive.50`    | `--border`            | Command palette separator                                           |
| `deep-olive.60`    | `--border`            | Card hairline ring (Tier 2)                                         |
| `muted-brass.5`    | `--primary`           | Checked field fill _(light block only)_                             |
| `muted-brass.10`   | `--primary`           | Checked field fill                                                  |
| `muted-brass.20`   | `--primary`           | Checked field border                                                |
| `muted-brass.30`   | `--primary`, `--ring` | Checked field border _(light block only)_; focus rings              |
| `muted-brass.50`   | `--ring`              | Global `outline` color (`@layer base` in `src/styles/tailwind.css`) |
| `muted-brass.80`   | `--primary`           | Primary button hover fill                                           |
| `warm-beige.10`    | `--muted-foreground`  | Kbd chip fill inside input groups                                   |
| `ember.10`         | `--invalid`           | Error tint behind a message or field, on any surface                |
| `ember.30`         | `--invalid`           | Invalid control ring, paired with a full-strength `--invalid` edge  |
| `ember.90`         | `--destructive`       | Destructive button hover fill                                       |
| `warm-charcoal.50` | `--muted`             | Ghost/outline button hover and field hover wash                     |
| `warm-off-white.5` | `--foreground`        | Mixed into Deep Olive for the secondary button hover                |
| `black.20`         | `--overlay`           | Dialog scrim                                                        |

Element opacity is separate from color alpha and is not tokenized: disabled and
inactive states use `opacity: 50%` (buttons, inputs, labels, command items), and
the command item check indicator toggles `opacity: 0%` → `100%`.

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
  `--input`. Surface hairline rings on lifted layers are the same token — cards at
  `border/60`, modals and popovers at full `border` strength — never a
  `--foreground` tint.
- Interactive borders (focus, active input) use `--ring`.
- Active/interactive fills — toggle states, secondary buttons — use `--secondary`
  (olive); quiet hover bands use `--muted`.
- **Olive is floor-only.** `--border`, `--input` and `--secondary` are tuned against
  Deep Forest (3.03:1). On brown they collapse — `--border` on `--card` is 1.50:1
  and an olive control stroke on a dialog is 1.24:1 — so olive linework and olive
  controls never sit on a brown surface. Raised surfaces separate tonally, and a
  control that must appear there changes pattern (ghost action, filled brass)
  instead of leaning on a line.
- **Error is never a coloured ink.** Only the light neutrals clear 4.5:1 on brown,
  and Ember ink on brown is 2.34:1, so error is carried by an `ember.10` tint plus
  `--foreground` text everywhere — on the floor and on a raised surface alike — with
  the underline in `--invalid` (4.73:1 on the floor) doing the pointing. One recipe,
  no surface to get wrong.
- Titles use the editorial ink `--popover-foreground`; body copy uses
  `--foreground`; metadata and inactive icons use `--muted-foreground`.

### Named Rules

**The One Voice Rule.** Muted Brass is spent on at most one important thing per
view. It always carries Deep Forest text; Warm Off-White on brass is 2.04:1 and
must never be used.

**The Brown Is A Surface Rule.** Warm Brown fills big surfaces only. It is never an
accent, never a small control, never text on the dark canvas, and never an action
fill — brown on brown is 1.00:1, which is exactly how the destructive button used to
disappear on cards and dialogs.

**The No Raw Palette Rule.** Components reach for semantic tokens. Raw Tailwind
palette colors (`text-green-600`, `bg-amber-500`) are off-system, in components and
in Penpot alike.

**The Error Is Ember Rule.** Destruction and error are Ember: `--invalid` for the
underline and the error tint; `--destructive` (Ember fill, Deep Forest label) on the
button that acts. Never Warm Off-White on Ember (3.00:1); never Ember as a surface.

**The Floor-Only Olive Rule.** Deep Olive is tuned against Deep Forest and stays
there. On a brown surface olive linework is a whisper and an olive control is
invisible — lift the surface or change the pattern, never darken the token.

**The Contrast Floor Rule.** `--muted-foreground` on `--background`, `--muted` and
`--card` is the secondary-text pairing and stays ≥ 4.5:1 (4.60:1 on brown) whenever
the neutral ramp is touched. A control boundary clears 3:1 against the surface it
actually sits on (`--input`/`--border`/`--secondary` on the floor: 3.03:1) and error
ink clears 4.5:1 (`--invalid`: 4.73:1). Never communicate status by color alone.

### Penpot

The Penpot file carries the palette as tokens, never as swatches; the `Colors` frame
(page `Design system`, right of `Components`) is a read-out of that token set and
holds no value of its own. Four blocks: **Palette values** (the eight non-chart
values, one swatch per `palette.*` token), **Chart ramp** (`palette.chart.1`…`5` — the
tonal ladder in order, lightest step first),
**Alpha steps over a card** (each `opacity.*` step composited over `color.card`, so a
translucent step is read at the strength it really lands with) and **Roles** (every
`color.*` role with its resolved hex and its contrast against `color.background`).
Swatch labels carry the token name the swatch displays, so the frame is readable as a
ledger: name, value, and — for roles — the contrast it lands with.

- **The frame binds what it displays.** Each swatch carries the token it names —
  including the palette swatches, which is the one place a value token is allowed to
  bind: a specimen of a value is that value. Everywhere else roles bind (§Token
  mapping).
- **Swatches carry a `color.border-hairline` keyline.** Deep Forest, Warm Charcoal and
  the dark chart steps are otherwise invisible on the frame's `color.background`.
- **The numbers are written at build time, not by hand.** Change a token and re-read
  the frame; never trust a contrast figure that has outlived the value it describes.

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
  deep forest canvas and the hide-brown cards reads thinner than it does on paper.
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

Depth is **tonal**, not shadowed. The system chooses a lighter surface before it
chooses a drop shadow: cards sit visibly above the canvas because Warm Brown is a
step up from Deep Forest, and floating layers sit above cards because they swap
surface for `--popover` plus a full-strength ring. Hairline `--border` rings draw
the edge; shadows are a whisper that confirms the lift, never the lift itself.

### Shadow Vocabulary

- **Surface confirmation** (`shadow-sm`): the tier-2 card ring companion. Cards
  only.
- **Floating confirmation** (`shadow-md`): tier-3 modals, popovers and the command
  palette.

### Named Rules

**The Layer-Before-Shadow Rule.** To lift content, move one surface level up the
tonal ladder (canvas → Surface 1 → Surface 2 → Surface 3) and add the matching
`border` ring. Only then add `shadow-sm` / `shadow-md`, and never invent a third
shadow value.

## Shapes

Form language is **sharp**: buttons, inputs, textareas, cards, dialogs, popovers,
menu items and separators all set `rounded-none`. Nothing is a pill, nothing is
soft — the geometry is cut, like a leather edge or a brass plate. The `--radius`
ladder (frontmatter `rounded.*`, based on `--radius: 0.625rem`) stays registered in
`tailwind.css` for surfaces that legitimately opt in, but a component recipe must
never restore rounding on its own.

Boundaries are drawn two ways only: a full box border on controls (`Button` carries
`border border-transparent` plus a variant border), and a bottom-only underline on
text fields (`border-b-input`). Clipping is equally plain — images inside cards are
square to the card edge, no rounded masks, no bleed.

### Named Rules

**The Sharp Sera Rule.** `rounded-none` is the default and the shipped answer. If a
component wants a radius, that is a system-level decision recorded here first — not
a local `rounded-lg`.

## Components

Character: **sharp-edged brass hardware on tonal hide.** Controls are cut square,
actions are brass or olive, and every surface they sit on is a step in the hide
palette.

### Buttons

- **Shape:** square (radius 0); `border border-transparent` so variants can swap the
  boundary without changing geometry.
- **Typography:** `type-label` (uppercase caps) in every variant and size.
- **Primary (brass):** `--primary` fill + `--primary-foreground` text; hover drops to
  `primary/80`; active nudges down 1px (`translate-y-px`).
- **Outline (the app's default secondary action):** `--border` border, transparent
  fill; hover fills with `--input` at 30% (a deep-olive wash, `deep-olive.30`).
- **Secondary (olive):** `--secondary` fill + `--secondary-foreground` text; hover
  blends 5% `--foreground` into the fill.
- **Ghost / tertiary:** transparent; hover applies `--muted` background with
  `--foreground` text.
- **Destructive:** `--destructive` (Ember) fill + `--destructive-foreground` (Deep
  Forest) label; hover `ember.90`. This is the only place Ember is a fill, and it is
  never a surface.
- **Link:** `--primary` text, underlined, `underline-offset-4`.
- **Focus / invalid:** `focus-visible:border-ring` plus a 2px `ring/30` ring
  (`muted-brass.30`); `aria-invalid` swaps both to `--invalid` — the 1px edge at full
  strength (4.73:1 on the floor) and the ring at `ember.30`, the same role the error
  message uses.
- **Disabled:** `opacity: 50%`, pointer events off.
- **Icon:** `IconButton` = `variant="outline"` + `size="icon"` (`size-10`).

### Chips

There is no chip or badge component in the shipped system. Status is carried by
typography and by the surface a value sits in (e.g. a `MaterialTypeLabel` in
`--muted-foreground`). Add a chip only by adding it to this document first.

### Cards / Containers

- **Corner Style:** square (radius 0).
- **Background:** `--card` (Warm Brown), text `--card-foreground`.
- **Shadow Strategy:** `ring-1 ring-border/60` + `shadow-sm` (see Elevation).
- **Internal Padding:** `--card-spacing` = 32px by default, 20px at `size="sm"`,
  applied as vertical padding, inter-block `gap` and horizontal padding on
  `CardHeader` / `CardContent` / `CardFooter`.
- **Anatomy:** `CardHeader` (title + optional `CardAction` in the right column) →
  `CardDescription` → `CardContent` → `CardFooter`. `CardTitle` is `type-title`;
  descriptions are `type-body` in `--muted-foreground`. `Separator` (`bg-border`,
  `h-px`) divides, it does not outline.

### Inputs / Fields

- **Style:** transparent background, no box — a single bottom underline in
  `--input`, `rounded-none`, height 40px, `type-input`.
- **Focus:** the underline switches to `--ring`.
- **Placeholder** is `--muted-foreground`; typed text is `--foreground`.
- **Invalid:** the underline switches to `--invalid` (Ember, 4.73:1 on the floor) and
  the field carries an error strip: the `ember.10` tint with `--foreground` text
  (`FieldError`: `w-fit px-2 py-1`). One recipe on every surface — the tint holds
  `--foreground` at 13.4:1 on the floor and 7.05:1 on a card, where Ember ink would
  be 2.34:1 and is never used; the underline alone is too subtle to carry the state
  on its own.
- **Disabled:** `opacity: 50%`, cursor not allowed.
- **Composition:** `Field` (vertical, `gap-3`) owns label + control + error;
  `FieldLabel` and `FieldTitle` are `type-label`; `FieldDescription` is `type-body`
  in `--muted-foreground`. `FieldGroup` stacks at `gap-10`.
- **Control heights move together:** button `default` 40px, `sm` 36px, `xs` 28px,
  `lg` 44px; input 40px. Change them as a set or forms misalign.

### Dialog & Popover

Floating layers are tier 3: `--popover` surface, `ring-1 ring-border`, `shadow-md`,
`rounded-none`, `gap-6`, 24px padding, `max-w-md` from `sm` up. The backdrop is
`--overlay` at 20% with a small backdrop blur, and open/close transitions are
`duration-100` fade + zoom.

**A dialog carries no corner ✕.** Its dismissal is a footer control, and that
control is mandatory: `DialogFooter` always renders it — a `DialogClose` on a
ghost button labelled `Закрыть`, ahead of whatever actions the dialog passes — so
every dialog has a way out that a touch screen reader can reach. Escape and an
outside press are bonus paths, never the only ones, and the 16px scrim a dialog
leaves on a phone is not a dismissal target. The dismissal is ghost rather than
outline because an olive boundary on the brown surface is 1.50:1; on a raised
surface a control changes pattern instead of leaning on a line. Deleting the ✕ is
a deliberate deviation from upstream shadcn — re-apply it after any `shadcn add`.

### Command Palette (signature)

The home surface is a `cmdk` command palette, and it is the clearest single
expression of the world: a bordered, `shadow-md` panel, a search field built on the
same underline `InputGroup`, `type-label` group headings in `--muted-foreground`,
`type-body` items at `px-3 py-2` that light up with `data-selected:bg-muted`, and
`type-label` shortcuts at the right edge. Selection is a tonal wash, not a brass
highlight — brass stays reserved.

### Links

Both recipes are owned by the component (`@ui/Link`); a consumer's `className` is
for layout only, never for colour.

- **`Link`** — inline navigation inside copy and rows: ink `--foreground`, whose
  underline is the interactive marker at `decoration-primary` /
  `underline-offset-4`, moving to `--primary` ink on hover. The brass is the
  _line_, not the text, because brass ink on a brown surface is 3.45:1 while Warm
  Off-White keeps the 4.5:1 body floor on the canvas and on a card alike — and it
  is the line, not a colour state, that marks a link on a touch screen. `Link`
  sets no type of its own; the surrounding role carries it.
- **`NavLink`** — a route link for navigation rows: `type-label` in
  `--muted-foreground` shifting to `--foreground` on hover and staying
  `--foreground` for the current route (`aria-current="page"`), with
  `whitespace-nowrap` and a color transition.

### Navigation

The header holds a `type-title` wordmark ("Sklad") and a horizontal nav of
`NavLink`s, `gap-4 sm:gap-8` apart; it lays the list out and carries no link
recipe of its own. The sidebar tokens exist in the palette but the shipped shell
uses the header; if a sidebar appears it takes `--sidebar*` verbatim.

### Separator & Loading

`Separator` is a Base UI separator on `bg-border` at `h-px` (horizontal) — never a
hand-rolled div. `Spinner` is `Loader2Icon` at `size-4` with `animate-spin`,
`role="status"`.

## Do's and Don'ts

### Do:

- **Do** reach for `Button variant="outline"` for the app's default secondary
  action, and `variant="default"` (brass) for the one primary CTA on a view.
- **Do** keep destructive/confirm actions visually distinct with
  `variant="destructive"` (Ember fill, Deep Forest label), and pair destructive
  intent with a Dialog confirmation.
- **Do** put Deep Forest text on brass — `--primary-foreground` every time.
- **Do** use `gap-*` stacks and the `max-w-4xl` shell for new surfaces.
- **Do** keep `--muted-foreground` for secondary text and `--foreground` for body.
- **Do** lift surfaces tonally (next surface level) before reaching for a shadow.
- **Do** set all type through `Typography` / the `type-*` tokens.
- **Do** keep `rounded-none` on shipped components.
- **Do** use tabular figures (`type-data`) for any column of numbers.
- **Do** chart with the main color palette: `--chart-1` for a single series, deeper steps
  in order for up to three, and direct labels past that.
- **Do** verify the `--muted-foreground` pairing stays ≥ 4.5:1 when the neutral ramp
  changes.

### Don't:

- **Don't** put `--foreground` (Warm Off-White) text on `--primary`; it is 2.04:1.
- **Don't** use Warm Brown as an accent, a small control, as text on the dark
  canvas, or as the destructive fill.
- **Don't** put olive linework or an olive control on a brown surface, and don't
  render error as a coloured ink — the `ember.10` tint plus light text is the only
  recipe, with `--invalid` left to the underline.
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
