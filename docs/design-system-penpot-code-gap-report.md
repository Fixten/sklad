# Penpot ↔ Frontend Design-System Gap Report

**Audit date:** 2026-10-27  
**Penpot scope:** `Design system` page, local component library, active `sklad` token set  
**Code scope:** `frontend/src/styles/tailwind.css`, `frontend/src/components/ui/**`, `frontend/src/layout/App.layout.tsx`, Storybook stories, and `frontend/DESIGN.md`  
**Authority:** Penpot for visual values and component specs; code for behavior and semantic APIs.

## Summary

- Penpot contains **116 tokens** in one active set: 63 color, 12 spacing, 10 sizing, 9 border-radius, 7 typography, 7 font-size, 3 font-weight, 3 letter-spacing, 1 font-family, and 1 text-case token.
- The local library contains **21 component groups** and **147 component assets/variants**, with 934 inspected shape nodes and 1,200 token bindings. No duplicate/invalid variant combinations were found.
- Findings: **19 total** — 4 Critical, 10 Major, 5 Minor. **All 19 reviewed and decided on 2026-10-27** (see Decision log): 3 changed code, 5 corrected docs, 11 closed without action.
- **Penpot is retired as a design source.** Findings whose only remedy was editing saved Penpot assets are closed without action; the review became a code-versus-docs check, and where code contradicted `frontend/DESIGN.md` the doc won unless the doc was the mistake.
- All 72 Penpot icon names are available from the frontend's Lucide exports. All Penpot component groups map to a frontend module or primitive; gaps are in state/size coverage, styling, and one code-only visual component.
- The resolved solid colors in the active `.dark` theme match Penpot's palette. **Color alias-name differences are intentionally not reported.** Actual RGBA values are compared instead.

## Method and limits

Penpot tokens were resolved through references, preserving alpha rather than relying on Penpot's alpha-stripping `resolvedValue` for color tokens. All 21 component groups and 147 assets were structurally inspected, including variant axes, shape tokens, fills, strokes, dimensions, and shadows. Frontend CSS values were normalized from OKLCH and `rem` to sRGB and px; typography tracking was compared after converting `em` to px.

Visual inspection covered the Penpot `Components`, `Custom components`, `Sheet`, `OptionRow`, and `OptionPicker` boards and 10 representative Storybook stories. The full 147-asset inventory was checked structurally, not by exporting every variant screenshot. Interactive states were mapped from component source and stories; a state listed as code-only below is not a claim that the running app lacks that state unless the finding says so.

The code's light `:root` palette is documented as inactive; color comparison uses the active `.dark` theme. This was a design-system/code review, not a full WCAG audit.

## Token comparison

| Token family                                      |                             Penpot | Code mapping                                                        | Result                                                                                                                                      |
| ------------------------------------------------- | ---------------------------------: | ------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------- |
| Color                                             | 63 names / 26 resolved RGBA values | `.dark` semantic variables, `@theme inline`, palette in `DESIGN.md` | Base solid colors and named role values match by value. No alias-name mismatch is reported. See actual derived-color gaps below.            |
| Border radius                                     |                                  9 | `--radius` and Tailwind radius ladder                               | Values match: 0, 6, 8, 10, 14, 18, 22, 26px.                                                                                                |
| Spacing                                           |                                 12 | Tailwind spacing utilities and `DESIGN.md` scale                    | Shared values match; code defines/uses 40px (`space.10`) but Penpot has no matching token. Code also has un-tokenized micro-spacing values. |
| Sizing                                            |                                 10 | Tailwind sizing utilities and component classes                     | Saved sizes map by value, including 28/36/40/44px controls and the 848px shell content width.                                               |
| Typography                                        |                                  7 | `type-*` utilities and `Typography`                                 | Sizes, weights, line heights, and tracking match after unit normalization, except tabular numerals in `typography.data`.                    |
| Font family                                       |                                  1 | `--font-sans` / `--font-heading`                                    | `Manrope` and `Manrope Variable` normalize to the same family; treated as a match.                                                          |
| Font sizes / weights / letter spacing / text case |                      7 / 3 / 3 / 1 | `type-*` utilities                                                  | Values match after normalization.                                                                                                           |

### Actual color-value coverage

All active solid values in the frontend `.dark` palette—including forest, brass, ember, chart colors, hover tones, and semantic roles—are present among Penpot's resolved colors. In particular, code `--primary-hover` / `--destructive-hover` resolve to Penpot palette values `#DCC17F` / `#AD785F`; these different names are not a gap.

| Actual value                                                       | Where it exists                                                       | Coverage note                                                  |
| ------------------------------------------------------------------ | --------------------------------------------------------------------- | -------------------------------------------------------------- |
| `#FFFFFF`                                                          | Penpot `foundation.white`; frontend light-only `:root` palette        | Present in code, but not an active `.dark` semantic value.     |
| `#EAD297 @ 10%`                                                    | Penpot `opacity.brass.10`; frontend `DESIGN.md` palette documentation | Documented, but no active UI style uses this exact RGBA value. |
| `#000000 @ 20%`, `#323A2B @ 60%`, `#BC8369 @ 10%`, `#EAD297 @ 30%` | Penpot tokens and code theme/utilities                                | Exact resolved values are represented.                         |

The following **code-rendered RGBA combinations do not have an exact saved Penpot color-token value**. They are derived from existing code colors rather than separate hex literals; this is not an alias-name finding.

| Code value                    | Code location / use                                                          | Penpot comparison                                                                         |
| ----------------------------- | ---------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------- |
| `#1B2016 @ 50%`               | `base/field.tsx` muted hover                                                 | No exact saved RGBA token.                                                                |
| `#323A2B @ 50%`               | `base/command.tsx`, `base/select.tsx` separators                             | Penpot has the same base at 60%, not 50%.                                                 |
| `#9DAA92 @ 10%`               | `base/input-group.tsx` keyboard-key background                               | No exact saved RGBA token.                                                                |
| `#C5AE75 @ 5%, 10%, 20%, 30%` | `base/field.tsx` checked/focused field-label styles                          | No exact matches; Penpot's brass alpha tokens use `#EAD297`, not `#C5AE75`.               |
| Approximately `#4A5442`       | `base/button.tsx` secondary hover (`color-mix` of secondary + 5% foreground) | No saved color token or Button hover variant. The mix recipe is described in `DESIGN.md`. |

## Component mapping and coverage

| Penpot component | Frontend counterpart                          | Coverage / note                                                                        |
| ---------------- | --------------------------------------------- | -------------------------------------------------------------------------------------- |
| `OptionPicker`   | `ui/OptionPicker`, `InputField`, `OptionList` | Open/create behavior maps; no saved idle-state variant.                                |
| `Sheet`          | `ui/Sheet`, base `Dialog` / `Separator`       | Structure maps; step-counter color and divider alpha differ.                           |
| `Input`          | base `input` / `input-group`, `ui/InputField` | Core states/addon alignment map; base group also exposes extra block alignments.       |
| `OptionRow`      | `ui/OptionPicker/OptionList`                  | New/default/selected row behavior maps.                                                |
| `Icon`           | `ui/Icon` (Lucide exports)                    | All 72 named Penpot icons are available.                                               |
| `Link`           | `ui/Link`                                     | Default/hover map; code also has focus styling not shown as a Penpot state.            |
| `Header`         | `ui/Header`                                   | Maps to header and nav composition.                                                    |
| `Dialog`         | base `dialog`                                 | Maps to responsive dialog primitive.                                                   |
| `Spinner`        | base `spinner`                                | `Size=sm` maps to 16px; one vector stroke is not token-bound.                          |
| `Command`        | base `command`, `ui/CommandPalette`           | Open/closed maps; shadow differs.                                                      |
| `Button`         | base `button`, `ui/Button` re-export          | Six variant values match; code has more sizes and states than the saved Penpot matrix. |
| `NavLink`        | named export from `ui/Link`                   | Default/hover/current map; code also has focus styling not shown in Penpot.            |
| `Label`          | base `label`                                  | Default/disabled behavior maps.                                                        |
| `Textarea`       | base `textarea`                               | States map; default height differs.                                                    |
| `FieldError`     | base `field`                                  | Error capsule composition maps.                                                        |
| `Card`           | base `card`                                   | Default/sm sizes map; code shadow is absent in Penpot.                                 |
| `IconButton`     | `ui/IconButton` over base `Button`            | Default/hover/focus map; disabled cannot be passed through the wrapper.                |
| `appLayout`      | `layout/App.layout` + `ui/Header`             | Responsive shell maps; desktop content width resolves to 848px.                        |
| `Field`          | base `field`                                  | Vertical/horizontal and error states map; code adds responsive orientation.            |
| `Separator`      | base `separator`                              | Horizontal/vertical map; the Sheet use has an alpha mismatch.                          |
| `FieldSelect`    | `ui/SelectField` + base `select` / `field`    | Default/focus/invalid map; disabled is not exposed by the wrapper.                     |

Additional code-side note: `Panel` is a visual component used by SupplySheet steps but has no dedicated Penpot library asset. `Typography` is represented by the Penpot type-scale specimens/tokens rather than a component asset. `Form` is a non-visual wrapper and does not require a visual component counterpart.

## Findings

### Critical

#### C-01 — Button states are not represented in the saved Penpot variant matrix

Penpot's `Button` matrix covers 6 `Variant` values × 4 `Size` values (24 combinations) but has no `State` axis. Code implements hover, focus-visible, active, disabled, and `aria-invalid` styles in `frontend/src/components/ui/base/button.tsx:5-19`. `frontend/DESIGN.md` describes these recipes, but the saved Penpot component does not expose corresponding states.

**Impact:** incomplete design-side state coverage for an interactive component, especially focus. This is a Penpot spec gap; the code does implement a focus ring.  
**Reconciliation:** add a `State` axis/representative states in Penpot, or explicitly mark these states as code-only in the component specification. Include focus and disabled at minimum (WCAG 2.4.7 / 2.4.11 reference).  
**Decision:** No action. Interactive states are code-defined in `frontend/DESIGN.md` and `base/button.tsx`; Penpot is no longer maintained, so there is nothing to reconcile. Closed.

#### C-02 — Link and NavLink focus states are missing from Penpot

Penpot `Link` has `Default`/`Hover`; `NavLink` has `Default`/`Hover`/`Current`. Both code implementations add `focus-visible:outline-2 focus-visible:outline-offset-2` in `frontend/src/components/ui/Link/index.tsx:10,28,47`, but no Penpot Focus state is present.

**Impact:** code has a keyboard-focus visual state that the saved component spec does not describe; this is not a claim that the runtime focus style is absent.  
**Reconciliation:** add Focus states to the Penpot Link and NavLink component sets or document the focus treatment as a design-system state (WCAG 2.4.7 / 2.4.11 reference).  
**Decision:** No action. Focus rings are code-defined in `ui/Link` and are required for keyboard accessibility; Penpot is no longer maintained. Closed.

#### C-03 — IconButton exposes a disabled design state that the code wrapper cannot receive

Penpot has `IconButton State=Disabled`. The frontend wrapper only accepts `children` and `onClick`, then forwards neither arbitrary props nor `disabled` to base Button (`frontend/src/components/ui/IconButton/index.tsx:3-12`). Base Button itself supports disabled styling, but the wrapper does not expose it.

**Impact:** consumers cannot reach a state present in the design component.  
**Reconciliation:** expose and forward `disabled` (or native button props) through `IconButton`, or remove the design state after review.  
**Decision:** No action for now. No app consumer needs a disabled `IconButton` yet; the wrapper stays intentionally minimal. Revisit if a "disabled while busy" icon action appears. Closed.

#### C-04 — FieldSelect exposes a disabled design state that the code wrapper cannot receive

Penpot `FieldSelect` includes `State=Disabled`. `ui/SelectField` has no `disabled` prop and does not pass one to base `Select`/`SelectTrigger` (`frontend/src/components/ui/SelectField/index.tsx:18-25,40-56`). The lower-level primitive supports disabled, but the mapped public wrapper does not.

**Impact:** the designed disabled state is unavailable through the corresponding frontend component.  
**Reconciliation:** add/forward a disabled prop through `SelectField`, or remove the state from the design component after review.  
**Decision:** No action for now. Nothing disables a `SelectField` today; revisit when a form needs it (note it would also restore symmetry with `InputField`, which already supports `disabled`). Closed.

### Major

#### M-01 — Textarea default height is 32px shorter in code

Penpot's default `Textarea` asset is **320 × 96px**. The default Storybook render computes to **64px high**; the implementation sets `min-h-16` (64px) and `field-sizing-content` (`frontend/src/components/ui/base/textarea.tsx:8-10`).

**Delta:** code − design = **−32px** at the default state. Width is fluid in code and is not treated as a mismatch.  
**Reconciliation:** align the default minimum to the 96px design height (or revise the Penpot default if 64px is intended).  
**Decision:** Aligned code to design — `base/textarea.tsx` now uses `min-h-24` (96px), and `frontend/DESIGN.md` gained `height: "96px"` on the `textarea` entry so the value is documented. Closed.

#### M-02 — Sheet step-counter color differs from the design

Penpot `Sheet/step-counter` renders **`#D9E1D3`** (foreground; currently a raw, unbound fill). Code applies `text-muted-foreground`, which resolves to **`#9DAA92`** (`frontend/src/components/ui/Sheet/index.tsx:38-41`). Per-channel delta (code − design) is **−60/−55/−65**. On the `#202918` popover, the contrast is approximately **6.18:1** in code vs **11.25:1** in Penpot; both pass normal-text AA, but the visual color is different. `frontend/DESIGN.md` specifies the step counter as foreground.

**Reconciliation:** bind the Penpot fill to `color.foreground` and use `text-foreground` in the Sheet implementation.

#### M-03 — Sheet divider uses 100% opacity in code instead of Penpot's 60%

Penpot `Sheet/sheet-separator` is bound to `color.border-hairline`: **`#323A2B @ 60%`**. The frontend's shared Separator uses opaque `bg-border` (`#323A2B`) (`frontend/src/components/ui/base/separator.tsx:15-17`, used by `ui/Sheet/index.tsx`). Over the `#202918` popover, the Penpot alpha fill composites to approximately `#2B3323`; code remains `#323A2B`.

**Reconciliation:** use the border-hairline treatment (or `bg-border/60`) for the Sheet divider, while keeping other Separator uses unchanged if their spec is full-opacity.  
**Decision:** Not a code defect — the Penpot sheet invented its own `sheet-separator` asset instead of instancing the shared `Separator`. The code correctly reuses `base/separator` (full-opacity `--border`). The only correction is documentation: `frontend/DESIGN.md` sketched the sheet separator as `--border-hairline`; updated to `--border`. Closed, no code change.

#### M-04 — Card has a code-only shadow

Neither Penpot Card variant has a shadow. Code applies `shadow-card` to every Card (`frontend/src/components/ui/base/card.tsx:13-15`): a black 40% 1×2px layer plus a black 50% 10×24px/−14px layer, defined in `tailwind.css:138-139`.

**Conflict:** `frontend/DESIGN.md` says Card uses `shadow-card`, while the actual Penpot Card assets are flat. Per the agreed authority split, Penpot is the visual source of truth; confirm whether the asset or the code/docs should change.  
**Reconciliation:** remove the code shadow to match Penpot, or add the documented shadow to Penpot after design approval.  
**Decision:** Remove the shadow. On a dark ladder a black-on-black shadow renders as nothing, so it was never doing work — depth is tonal only. Applied to code and docs: `base/card.tsx` dropped `shadow-card`, `tailwind.css` dropped the `--shadow-card` token, `DESIGN.md` lost the shadow vocabulary and the Layer-Before-Shadow rule (now the Tone-Only Rule), `frontend/AGENTS.md` and the `.impeccable/design.json` sidecar updated to match. Closed.

#### M-05 — Command has a Penpot-only two-layer shadow

Penpot Command's root and Results board have two black 10% shadows (offsets 0×4px / 0×2px, blur 6px / 4px, spread −1px / −2px). Code's open CommandList computes to `box-shadow: none`; neither `base/command.tsx` nor `ui/CommandPalette` applies a shadow.

**Reconciliation:** add the matching shadow to the open command surface in code, or remove it from the Penpot Command asset after review.  
**Decision:** No action — same Penpot-side error as M-04. The palette is a tier-3 floater and shadows are no longer part of the token set, so code's `box-shadow: none` is correct. Closed.

#### M-06 — Code exposes four Button sizes absent from the Penpot Button matrix

Penpot sizes are `default`, `sm`, `lg`, and `icon`. Code additionally exposes `xs`, `icon-xs`, `icon-sm`, and `icon-lg` (`frontend/src/components/ui/base/button.tsx:21-30`). The values correspond to existing sizing tokens, but these size values and their combinations with all six variants are not shown in the saved Button component set.

**Reconciliation:** add the missing size variants to Penpot, or constrain the public code API to the approved design sizes.  
**Decision:** No action, no doc change — the four compact sizes stay as upstream `@base` internals (`InputGroup`'s addon button already defaults to `xs`), not as advertised system sizes. Pruning them would break `InputGroup` and need re-patching after every `shadcn add`. Closed.

#### M-07 — Code uses 40px spacing without a saved Penpot token

The code design scale documents `space.10 = 40px`, and `FieldGroup` uses `gap-10` (`frontend/src/components/ui/base/field.tsx:38-47`). The Penpot `sklad` spacing set has no `space.10` token.

**Reconciliation:** add the 40px spacing token to Penpot or revise the FieldGroup gap to a saved spacing token.  
**Decision:** No action — a Penpot token-set gap only. `DESIGN.md:686` already specifies `FieldGroup` at `gap-10` and Tailwind's dynamic scale supplies 40px, so code and docs agree. Closed.

#### M-08 — `typography.data` lacks the tabular-numeral feature in Penpot

Code's `type-data` utility applies `font-variant-numeric: tabular-nums` (`frontend/src/styles/tailwind.css:187-193`). The Penpot `typography.data` token and specimen have no tabular-numeral/font-variant setting; the specimen annotation says “tabular digits,” but the text shape itself has no such property. `frontend/DESIGN.md` also records `fontFeature: tnum`, so the code documentation and Penpot asset disagree.

**Reconciliation:** persist the tabular-number feature in Penpot if intended, otherwise remove it from code; confirm the intended source before changing either side.  
**Decision:** No action — a Penpot specimen flaw. Code (`type-data`) and the `DESIGN.md` `typography.data` frontmatter both set `tnum` deliberately; only the saved specimen omits the property while annotating it. Closed.

#### M-09 — OptionPicker has no saved idle-state variant

The Penpot OptionPicker is a single component asset showing the open list and has no state axis. Code Storybook covers Open, Idle, and Create-only states; `frontend/DESIGN.md` also describes the list-hidden idle state.

**Reconciliation:** add an idle/closed design state (or a note that the component asset intentionally shows only the open composition).

#### M-10 — Panel is a used visual code component with no Penpot asset

`ui/Panel` is used by SupplySheet Material and Variant steps. It has a distinct `bg-card`, 16px padding, and 16px gap recipe (`frontend/src/components/ui/Panel/index.tsx`), but no dedicated Penpot component. The existing Card asset uses 32px/20px spacing and is not an exact match.

**Reconciliation:** add a Penpot Panel asset or document the code Panel as a deliberate feature-specific Card composition.  
**Decision:** Documented, no visual change. `DESIGN.md` gained a §Components ▸ Panel entry describing the dense in-sheet slab (`bg-card`, 16px padding/gap, muted caps header, never nested, no ring). Panel stays a distinct component rather than folding into `Card size="sm"`, which would change 16px → 20px padding on both supply steps. Closed.

### Minor

#### m-01 — Code derives several exact color values not saved as Penpot color tokens

The code-side combinations listed in **Actual color-value coverage** are absent as exact RGBA values in the Penpot token set. Most are alpha utilities for generic base controls; the Button secondary hover is a color-mix recipe. These do not indicate missing base palette colors, but there is no saved Penpot value for each combination.

**Reconciliation:** add explicit Penpot state colors only where they are intended to be named design tokens; otherwise document the derived treatments as implementation recipes.  
**Decision:** No action — these are alpha utilities and one already-documented `color-mix` recipe on existing palette colors, not missing tokens. Base values match in both systems. Closed.

#### m-02 — Some code spacing utilities are off the 4px grid and have no Penpot spacing token

The UI source uses **2px, 6px, 10px, and 14px** values (for example `mt-0.5`, `gap-1.5`/`p-1.5`, `gap-2.5`, and `pt-3.5`/`pb-3.5`). These are not in the saved Penpot spacing scale and are not multiples of 4. They occur in base Select, Command, Dialog, and InputGroup internals.

**Reconciliation:** align these to approved 4px-grid values or record the specific micro-spacing exceptions in the design system.  
**Decision:** Documented the exception, no code change. All off-grid values live in upstream `@base` primitives (`Select`, `Command`, `Dialog`, `InputGroup`), which `AGENTS.md` keeps verbatim; `DESIGN.md` §Layout ▸ Rhythm now scopes 2/6/10/14px to those internals only. Closed.

#### m-03 — `--measure-prose: 65ch` is code-only

The CSS token is used by Card, Dialog, Field, and Command descriptions (`frontend/src/styles/tailwind.css:134`), but there is no corresponding Penpot layout token.

**Reconciliation:** add/document a matching text-measure token in Penpot, or explicitly classify it as a code-only prose constraint.  
**Decision:** No action — a code-only prose constraint, already specified by `DESIGN.md` §Typography ▸ The Measure Rule (the cap belongs to the prose slots, never `type-body`). Penpot has no layout token for it and is not being maintained. Closed.

#### m-04 — Code exposes extra Field and InputGroup variants not represented in Penpot

Code supports `Field orientation=responsive` in addition to Penpot's vertical/horizontal orientations. Base `InputGroupAddon` also supports `block-start` and `block-end`; Penpot Input's Addon axis only has None/Start/End.

**Reconciliation:** add those options to Penpot if they are supported product states, or mark them implementation-only.  
**Decision:** No action — unused upstream `@base` capability. No feature uses `orientation="responsive"` or `block-start`/`block-end` addons, so they are neither shipped patterns nor worth documenting. Closed.

#### m-05 — Six other Penpot shapes hardcode a color despite an existing token

Outside the Sheet step-counter already covered in M-02, **six** library shapes use raw `#D9E1D3` without a `color.foreground` binding: the Sheet title fill and five SVG path strokes (Spinner, Button outline icon, and Button ghost icon). The actual value matches the token, but the shapes will not follow a token value change.

**Reconciliation:** bind those fills/strokes to `color.foreground`.  
**Decision:** No action — a Penpot authoring defect with no code consequence. The literal `#D9E1D3` matches `color.foreground` today, and code icons use `currentColor` through Lucide. Closed.

## State coverage matrix

| Component    | State / axis value                                      | Penpot | Code | Result                                     |
| ------------ | ------------------------------------------------------- | :----: | :--: | ------------------------------------------ |
| Button       | Default                                                 |   ✓    |  ✓   | Match                                      |
| Button       | Hover                                                   |   —    |  ✓   | Penpot state missing (C-01)                |
| Button       | Focus                                                   |   —    |  ✓   | Penpot state missing (C-01)                |
| Button       | Active/Pressed                                          |   —    |  ✓   | Penpot state missing (C-01)                |
| Button       | Disabled                                                |   —    |  ✓   | Penpot state missing (C-01)                |
| Button       | Invalid                                                 |   —    |  ✓   | Penpot state missing (C-01)                |
| Link         | Default, Hover                                          |   ✓    |  ✓   | Match                                      |
| Link         | Focus                                                   |   —    |  ✓   | Penpot state missing (C-02)                |
| NavLink      | Default, Hover, Current                                 |   ✓    |  ✓   | Match                                      |
| NavLink      | Focus                                                   |   —    |  ✓   | Penpot state missing (C-02)                |
| IconButton   | Default, Hover, Focus                                   |   ✓    |  ✓   | Match                                      |
| IconButton   | Disabled                                                |   ✓    |  —   | Code wrapper gap (C-03)                    |
| FieldSelect  | Default, Focus, Invalid                                 |   ✓    |  ✓   | Match                                      |
| FieldSelect  | Disabled                                                |   ✓    |  —   | Code wrapper gap (C-04)                    |
| Input        | Default, Focus, Invalid, Disabled; Addon None/Start/End |   ✓    |  ✓   | Core states and inline add-ons map         |
| Textarea     | Default, Focus, Invalid, Disabled                       |   ✓    |  ✓   | Match; height aligned to 96px (M-01)       |
| OptionRow    | New, Default, Selected                                  |   ✓    |  ✓   | Match                                      |
| OptionPicker | Open                                                    |   ✓    |  ✓   | Open state maps                            |
| OptionPicker | Idle / closed list                                      |   —    |  ✓   | Penpot state missing (M-09)                |
| Command      | `isOpen=false/true`                                     |   ✓    |  ✓   | Match; Penpot shadow was an error (M-05)   |
| Field        | Vertical/Horizontal; Default/WithError                  |   ✓    |  ✓   | Core variants map                          |
| Field        | Responsive orientation                                  |   —    |  ✓   | Code-only option (m-04)                    |
| Card         | Default/Small                                           |   ✓    |  ✓   | Match; code shadow removed (M-04)          |
| Spinner      | Size=sm                                                 |   ✓    |  ✓   | Match                                      |
| Separator    | Horizontal/Vertical                                     |   ✓    |  ✓   | Match; sheet divider stays 100% (M-03)     |

## Decision log (2026-10-27)

Penpot is retired, so "fix the design file" is not an option. Every finding was re-read as either a code defect or a documentation defect.

| Finding | Decision      | Change made                                                                                                                         |
| ------- | ------------- | ----------------------------------------------------------------------------------------------------------------------------------- |
| C-01    | No action     | Button states are code-defined; nothing to reconcile.                                                                                |
| C-02    | No action     | Link/NavLink focus rings are code-defined and required for a11y.                                                                     |
| C-03    | Deferred      | No consumer needs a disabled `IconButton` yet; wrapper stays minimal.                                                                |
| C-04    | Deferred      | No consumer needs a disabled `SelectField` yet; revisit to restore symmetry with `InputField`.                                       |
| M-01    | Code + doc    | `base/textarea.tsx` `min-h-16` → `min-h-24`; `DESIGN.md` gained `textarea.height: 96px`.                                             |
| M-02    | Code          | `ui/Sheet` step counter `text-muted-foreground` → `text-foreground` (matches `DESIGN.md`).                                           |
| M-03    | Doc           | Penpot invented a `sheet-separator` instead of instancing `Separator`; code is correct. `DESIGN.md` now says `--border`.              |
| M-04    | Code + docs   | Shadow removed: `card.tsx`, `--shadow-card` token, `DESIGN.md` shadow vocabulary → Tone-Only Rule, `AGENTS.md`, `.impeccable/design.json`. |
| M-05    | No action     | Same shadow error in the Penpot Command asset; code's no-shadow palette is correct.                                                  |
| M-06    | No action     | Extra compact sizes stay as upstream `@base` internals (`InputGroup` depends on `xs`).                                               |
| M-07    | No action     | 40px gap is documented (`DESIGN.md:686`); only the Penpot spacing set lacked the step.                                               |
| M-08    | No action     | Tabular numerals are intended in code and frontmatter; the specimen omitted the property.                                            |
| M-09    | No action     | Penpot shows only the open composition; idle is documented and storied.                                                              |
| M-10    | Doc           | `DESIGN.md` gained a §Components ▸ Panel entry (dense in-sheet slab).                                                                |
| m-01    | No action     | Derived alphas and the documented hover mix need no tokens.                                                                          |
| m-02    | Doc           | `DESIGN.md` §Layout ▸ Rhythm now scopes 2/6/10/14px to upstream `@base` internals.                                                   |
| m-03    | No action     | `--measure-prose` is a code-only constraint covered by The Measure Rule.                                                             |
| m-04    | No action     | `orientation="responsive"` and block addons are unused upstream capability.                                                          |
| m-05    | No action     | Six unbound Penpot fills render the correct value; no code consequence.                                                              |

Follow-ups: re-run `frontend/vrt:update` for the Card and Textarea snapshots, and regenerate `.impeccable/design.json` with impeccable `document` (edited by hand here).

## Review notes

- No Penpot component group was wholly unmapped to code; the Panel is an additional code-only visual component.
- The audit itself changed no code or canvas. The decisions above did: three code changes (Card shadow, Textarea height, Sheet step counter) and doc corrections in `frontend/DESIGN.md`, `frontend/AGENTS.md`, and the impeccable sidecar.
- The recurring pattern: where Penpot and code disagreed, the Penpot asset was the mistake in every case except the Card shadow — and there the shadow was correct-by-doc but doing nothing visually, so it was removed from both sides.
