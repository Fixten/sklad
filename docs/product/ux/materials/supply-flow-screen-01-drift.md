# Supply flow — design ↔ code drift

Scope: Penpot `Materials` page → `supply-flow`. Screen `01-pick-material-col` is reviewed in full;
screens `02`–`08` were reviewed for gaps after the Penpot connection came back. `material-flow` and
`type-flow` remain out of scope.

**Status.** Code work is finished — three edits, listed under [Code changed this session](#code-changed-this-session).
Nothing in Penpot was touched: every remaining canvas action is the checklist in
[Penpot to-do](#penpot-to-do-deferred--nothing-below-was-applied). VRT goldens are being refreshed by
hand.

Sources

| Side   | Source                                                                                                                                                                                 | Notes                                                                                                                                                                                          |
| ------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Design | Penpot page `Materials`, board `supply-flow`, screen `01-pick-material-col` (1440 × 964, inner frame 1440 × 900)                                                                       | Tokens: set `sklad` (116 tokens, active). Colours resolved from Penpot bindings, not eyedropped.                                                                                               |
| Code   | `src/router/pages/MaterialPage/index.tsx` → `features/Supply/SupplySheet/**`, `components/ui/Sheet`, `ui/OptionPicker`, `base/dialog`, `base/field`, `base/input-group`, `base/button` | Values from `src/styles/tailwind.css` (dark theme). Rendered reference: `features/Supply/SupplySheet/__screenshots__/index.vrt.test.tsx/renders-the-empty-material-step-1-chromium-linux.png`. |
| Spec   | `docs/product/ux/materials/workflow.md`                                                                                                                                                | Referenced only where it conflicts with both sides.                                                                                                                                            |

Method: tree + style read of every node in the screen, `shape.tokens` per node, Penpot token
bindings resolved to values, `oklch` dark tokens converted to sRGB hex for comparison, and the
committed VRT screenshot of the same state compared against the exported design frame.

## Muting declared by the user — excluded from the diff

These are intentional, not gaps:

- `material-flow` and `type-flow` boards are muted.
- `appLayout` inside screen 01 is `hidden` (node `2d6f5dfc-…-d1e6b1441a80`). The page behind the
  dialog is therefore unpainted in the export: the scrim reads as flat grey over white. Nothing
  about the page shell, header, nav or page body is comparable on this screen.
- `content-slot` (page-body placeholder) and the `Field` `Description` node are hidden inside
  their components.

The dialog surface itself **is** painted, so the sheet is fully comparable.

## Verdict

| Dimension               | Result                                                                                                                     |
| ----------------------- | -------------------------------------------------------------------------------------------------------------------------- |
| Colour                  | 0 drift — every bound colour resolves to the exact code token value                                                        |
| Typography              | 0 drift — all four roles (title, label, input, body) match size/weight/line-height/tracking                                |
| Spacing                 | 0 drift — 24 pad, 24 gap, 12 field gap, 40 control height all match                                                        |
| Radius / borders        | 0 drift — `radius.none` everywhere, 1px `color.border` separators                                                          |
| Structure               | **resolved** — the extra footer rule was code drift, removed (D1)                                                          |
| Content                 | **resolved** — the hint keeps its always-on `↑↓` text run (D2, D3)                                                         |
| Alignment / compositing | **resolved** — counter baseline stays top-aligned (D4); the backdrop is the dialog's one recipe, not a sheet decision (D5) |

Findings: **screen 01** — 0 Critical · 0 Major · 0 Minor · 5 resolved. **Screens 02–08** — 0 Critical
· 0 Major · 0 Minor open · 8 resolved · 1 withdrawn (G1–G9 below).

## Findings

### D1 — Footer rule: removed, air instead of a line (resolved — the design was right)

|                         |                                                                                                                                                                                                                                                                       |
| ----------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Decision (2026-10-27)   | **Air, not a line.** The lineless footer the design shows on screen 01 is correct; the code carried the extra rule.                                                                                                                                                   |
| Design node             | `supply-sheet` — a single `Separator`, under the header                                                                                                                                                                                                               |
| Code element            | `components/ui/Sheet/index.tsx` — a second `<Separator />` between the body and the footer                                                                                                                                                                            |
| Authority               | `DESIGN.md` §Sheet already documented one rule (`sheet-header` → separator → `content` → optional `sheet-footer`); §Shapes says surfaces separate by tone, not by lines                                                                                               |
| Why the line read badly | This screen's body ends on a full-width input underline, so a full-width `--border` rule 34 px below it drew a second parallel line of near-equal extent. The rule was also doing two jobs — separating, and marking the scroll edge — and only the first was wanted. |
| Resolution              | The second `Separator` is gone. The sheet's own 24 px gap separates the footer on every step, and a scrolling body clips against that gap, so content never reaches the actions. `DESIGN.md` §Sheet now states it (the new **One rule per sheet** entry).             |
| Rejected                | Tonal footer band (`bg-card`): a second surface step inside a popover — 1.19:1, invisible on a short sheet and heavy on the details step. Weaker rule (`--border-hairline`): reserved for specimen swatches.                                                          |

**Design-file follow-ups** (document only — Penpot was not reachable this session):

1. Screens `02`–`08` still draw the footer rule and are now off-spec; remove their second `Separator` too. Only screen `01` was lineless.
2. Screen `01`'s sheet is 248 tall but still placed at `y = 314`, the position of its 273-tall form, so it floats 12 px above centre. Re-centre the frame.
3. Because `D2`/`D3` are still open, the code's footer carries the keyboard hint that screens `01` and `03`–`08` do not draw — see D2.

### D2 — Keyboard hint: always shown (resolved in favour of the code)

|                                       |                                                                                                                                                |
| ------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------- |
| Decision (2026-10-27)                 | **Always show the hint.** Conditional visibility is not worth the state plumbing; the footer keeps one shape on every step.                    |
| Design node                           | `sheet-footer` — the hint is drawn on screen `02` only                                                                                         |
| Code element                          | `SupplySheetContent` → `Sheet hint={…}` (`features/Supply/SupplySheet/index.tsx`) — passed unconditionally                                     |
| Resolution                            | No code change. The always-on hint is the intended behaviour, not drift.                                                                       |
| Design-file follow-up (document only) | Add the hint to the footer of every screen except `02`, which already has it: `01`, `03`, `04`, `05`, `06`, `06-details-supplier`, `07`, `08`. |

Because the hint now renders in every state, how it is built matters everywhere — see D3.

### D3 — Hint built from `↑↓` glyphs (resolved in favour of the code)

|                                       |                                                                                                                                                                                                                      |
| ------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Decision (2026-10-27)                 | **Keep the text hint.** The glyph version reads better than the icon version; the Penpot file originally matched the code and was changed to icons by experiment.                                                    |
| Design node                           | screen `02` — `hint` board: two 24×24 chevron icons (stroke `color.foreground`) + `ВЫБРАТЬ · ENTER` in `color.muted-foreground`, gap 4                                                                               |
| Code element                          | `<Typography variant="label">↑↓ Выбрать · Enter</Typography>` in `text-muted-foreground`                                                                                                                             |
| Resolution                            | No code change. `↑↓` here denotes the literal arrow keys on a caps hint line, so it is typographic rather than an icon standing in for the icon system — that is the argument that keeps it off the craft-floor ban. |
| Design-file follow-up (document only) | Revert screen `02`'s hint to the single text run `↑↓ ВЫБРАТЬ · ENTER` in `typography.label` / `color.muted-foreground`, and drop the two `Icon` instances from the board.                                            |

### D4 — Step counter: top-aligned (resolved in favour of the code)

|                                        |                                                                                                                                                                                                                                                                                                    |
| -------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Decision (2026-10-27)                  | **Keep `items-start`.** A few px on a metadata label is below the threshold, and top alignment is the safer default if a title ever wraps.                                                                                                                                                         |
| Design node                            | `sheet-header` — `alignItems: center`; `step` sits at y = 6 in a 23 px row                                                                                                                                                                                                                         |
| Code element                           | `Sheet` header row: `flex items-start justify-between gap-6`                                                                                                                                                                                                                                       |
| Resolution                             | No code change.                                                                                                                                                                                                                                                                                    |
| Colour — already settled               | Not open in this review: `docs/design-system-penpot-code-gap-report.md` **M-02** moved the code to `text-foreground` to match `DESIGN.md`, and Penpot's `Sheet/step-counter` renders `#D9E1D3` as well.                                                                                            |
| Design-file follow-ups (document only) | 1. Screen `01`'s `step` instance overrides the fill to `color.muted-foreground` (`#9DAA92`); re-inherit the component's `color.foreground` so the instance matches the code and `DESIGN.md`. 2. The header rows are drawn counter-centred; either accept the few px or set the row to align start. |

### D5 — Backdrop blur (resolved — one recipe, not two)

|                             |                                                                                                                                                                                                                                                                                     |
| --------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Decision (2026-10-27)       | **Not a drift, and not a sheet concern.** The scrim belongs to the dialog recipe; a sheet inherits it.                                                                                                                                                                              |
| Design node                 | `scrim` — fill `color.overlay`, 20 % black, no blur                                                                                                                                                                                                                                 |
| Code element                | `DialogOverlay` — the app's only backdrop (`bg-overlay` + `backdrop-blur-sm`), rendered by `DialogContent`, which `Sheet` goes through                                                                                                                                              |
| Resolution                  | No code change. `DESIGN.md` §Dialog carries the single recipe: `--overlay` at 20 % with a small backdrop blur. The sheet-specific backdrop clause was deleted from §Sheet — it invented a second decision that does not exist and blamed a "penpot realisation" for the difference. |
| Penpot note (document only) | The `scrim` shape carries no blur, so the canvas differs from the app by fidelity alone. Optional: give the shape a background blur if the frame should read exactly as it ships.                                                                                                   |

## Findings — screens 02–08

`appLayout` is still `hidden` on all nine screens, so the page behind the sheet remains out of scope.
What follows was read from each screen's `supply-sheet` subtree against the code for that step:
`OptionPicker`/`OptionList`, `VariantStep`, `MaterialStep`, `DetailsStep`, `SupplierPicker`,
`SelectField`/`base/select`, `Panel`.

| #   | Screens         | Dimension  | Design                                                                                                 | Code                                                                        | Severity  |
| --- | --------------- | ---------- | ------------------------------------------------------------------------------------------------------ | --------------------------------------------------------------------------- | --------- |
| G1  | 03, 04, 05      | structure  | a `МАТЕРИАЛ` field (512×100) above the panel, carrying the committed value                             | the pick step is unmounted; the step renders the panel only                 | resolved  |
| G2  | 02–05           | content    | field description `Поиск по названию, типу и варианту.` visible                                        | `PickStep` passes no `hint`; no description anywhere                        | resolved  |
| G3  | 03, 04, 05      | state      | selects show `Выберите` / `Выберите тип` in `muted-foreground`                                         | every select always holds a value (`метр`, the first type or `+ Новый тип`) | resolved  |
| G4  | 03, 04, 05      | visual     | select chevron 24×24, stroke `color.foreground`                                                        | `size-3.5` (14 px), `text-muted-foreground`                                 | resolved  |
| G5  | 07, 08          | typography | error capsule bound to `typography.label` — 12/600 uppercase, 20 px tall                               | `FieldError` is `type-body` — 16/500 sentence case, ≈32 px tall             | resolved  |
| G6  | 08              | structure  | footer column `align end`: capsule right-aligned, gap 8 to the actions                                 | capsule sits left (`w-fit` in a stretch column), `gap-4` (16)               | resolved  |
| G7  | 06, 06b         | structure  | formula right-aligned under the value — **identical to code**                                          | same                                                                        | withdrawn |
| G8  | 06, 06b, 07, 08 | structure  | sheet-level rule 24 px below the unit-cost block                                                       | `<Separator />` flush under it, inside `DetailsStep`                        | resolved  |
| G9  | 06b             | content    | supplier rows are material variants (`Брусок 60 × 60`, `Рейка 20 × 40`) with meta `ПИЛОМАТЕРИАЛ · ДУБ` | `SupplierPicker` rows are supplier names with no meta                       | resolved  |

### G1 — The search field survives into the panel steps (resolved — canvas fix)

|                                       |                                                                                                                                                                                                                                       |
| ------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Decision (2026-10-27)                 | **Delete the field from screens 03/04/05.** It repeats the material and pretends to search.                                                                                                                                           |
| Design nodes                          | screens `03`/`04`/`05` — a `Field` (512×100, label `МАТЕРИАЛ`, value `Дуб`/`Клён`, underline `color.input`) above the panel                                                                                                           |
| Code                                  | `VariantStep` and `MaterialStep` return only the `Panel`; `PickStep` is unmounted, so nothing sits above it                                                                                                                           |
| Why the canvas is wrong               | The material is already named twice over: by the panel's `note` (`ПИЛОМАТЕРИАЛ · ДУБ`) on `03`, and by the panel's own `МАТЕРИАЛ` input holding the same value on `04`/`05`. The extra field looks searchable but no longer searches. |
| Resolution                            | No code change.                                                                                                                                                                                                                       |
| Design-file follow-up (document only) | Remove the field from `03`, `04` and `05`, together with the description underneath it (see G2).                                                                                                                                      |

### G2 — The search description (resolved — delete it)

|                                       |                                                                                                                                                                                                                                                                                                                             |
| ------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Decision (2026-10-27)                 | **Delete the description.** It repeats the placeholder and costs the tightest screen 36 px.                                                                                                                                                                                                                                 |
| Design nodes                          | screen `02` — `Поиск по названию, типу и варианту.` visible under the pick field; screen `01` — the same slot hidden with different copy (`Начните вводить — варианты появятся сразу.`)                                                                                                                                     |
| Code                                  | `PickStep` passes no `hint`, so `InputField` draws no `FieldDescription` — today the slot is unused                                                                                                                                                                                                                         |
| Why delete rather than add            | The field's own placeholder already reads `Название, тип или вариант`. Keeping both states the same thing twice and grows step 1 from 248 to 284 px, on the screen where the sheet is most cramped. What actually teaches the field is the list on the first keystroke, whose row meta already shows the type and material. |
| Resolution                            | No code change. My earlier recommendation (bind it in code) is withdrawn — the duplication only became visible when comparing against the placeholder.                                                                                                                                                                      |
| Design-file follow-up (document only) | Remove the description from `02` and the hidden copy from `01`.                                                                                                                                                                                                                                                             |

### G3 — Placeholder selects that the code cannot reach (resolved — design supplies the defaults)

|                                       |                                                                                                                                                                             |
| ------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Decision (2026-10-27)                 | **The code is right; the canvas shows the real defaults.** Both fields have one obvious default, so an empty state would add a validation error without adding information. |
| Design nodes                          | screen `04` — `Тип` = `Выберите тип`; screens `03`/`04`/`05` — `Единица` = `Выберите`, both in `color.muted-foreground`                                                     |
| Code                                  | `MaterialStep`: `typeId = selectedTypeId ?? (types[0]?.id ?? "new-type")`; `unit` starts at `meters`; `SelectValue` always paints the committed value in `--foreground`     |
| Resolution                            | No code change. Screen `05`'s `Тип` already shows `+ Новый тип` and is correct.                                                                                             |
| Design-file follow-up (document only) | Draw the committed values: `Единица` = `метр` on 03/04/05, `Тип` = the first type's name on 04 — both in `color.foreground`, not `color.muted-foreground`.                  |

### G4 — Select chevron size and ink (resolved — canvas fix)

|                                       |                                                                                                                                                                                                                                                                      |
| ------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Decision (2026-10-27)                 | **The shipped 14 px muted caret is right; the canvas is drawn at twice its size.**                                                                                                                                                                                   |
| Design nodes                          | screens `03`/`04`/`05` — `icon-chevron-down`, 24×24 frame, 12×6 path, stroke `color.foreground`                                                                                                                                                                      |
| Code                                  | `SelectTrigger` → `ChevronDownIcon` at `size-3.5` (14 px) in `text-muted-foreground`                                                                                                                                                                                 |
| Why the code wins                     | At 24 px and full ink the caret reads as a control of its own rather than an affordance marker, and it is the only glyph in the form at that weight beside a 16 px value. `[&_svg]:size-3.5` is the system's icon size across buttons, input addons and the trigger. |
| Resolution                            | No code change.                                                                                                                                                                                                                                                      |
| Design-file follow-up (document only) | Resize the chevron to 14 px and bind its stroke to `color.muted-foreground`.                                                                                                                                                                                         |

### G5 — Error capsule typography (resolved — the code follows `DESIGN.md`)

|                                       |                                                                                                                                                                                                                                                       |
| ------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Decision (2026-10-27)                 | **Errors are reading text.** The capsule keeps `type-body`; the canvas adopts it.                                                                                                                                                                     |
| Design nodes                          | screen `07` — two `Error` boards (173×20, 177×20, `px-2 py-1`); screen `08` — `error` (185×20). All bound to `typography.label`: 12/600, uppercase, tracking 0.96.                                                                                    |
| Code                                  | `FieldError` in `base/field.tsx` — `bg-destructive text-destructive-foreground type-body w-fit px-2 py-1`, 16/500 sentence case, ≈32 px tall                                                                                                          |
| Authority                             | `DESIGN.md` §Typography role map: "`Field` hints and errors → `typography.body`"                                                                                                                                                                      |
| Why the code wins                     | It is the only sentence in the system set as 12 px caps, while every other reading role is 14–16 px sentence case; caps is the structural voice (labels, titles), not the message voice. An error has to be read at a glance on a phone at the bench. |
| Resolution                            | No code change.                                                                                                                                                                                                                                       |
| Design-file follow-up (document only) | Bind the three capsules to `typography.body`, drop the uppercase, let them take their natural height; the Ember fill and `forest.950` label stay.                                                                                                     |

### G6 — Sheet-level message: alignment and gap (resolved — right, 16)

|                                       |                                                                                                                                                                                                                                |
| ------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Decision (2026-10-27)                 | **Each side takes the other's half: the code adopts the canvas's alignment, the canvas adopts the code's gap.**                                                                                                                |
| Design node                           | screen `08` — `sheet-footer` is a column with `align end`: capsule right-aligned, **8 px** above the actions                                                                                                                   |
| Code element                          | `Sheet` footer — `flex flex-col gap-4` with a `w-fit` capsule, which the stretch column left at the **left**, **16 px** above                                                                                                  |
| Why right wins                        | The footer already speaks in two zones: left is navigation (back, hint), right is commit (cancel, save). An error belongs to the commit — left-aligned it sat directly above `Назад` and attached itself to the wrong control. |
| Why 16 px wins                        | Server messages pass through verbatim and the capsule wraps at `max-w-full`; at 8 px a second line lands almost against the buttons.                                                                                           |
| Resolution                            | Code: `self-end` added to the capsule, `gap-4` kept. `DESIGN.md` §Sheet records the rule — **A failure lands on the commit edge**.                                                                                             |
| Design-file follow-up (document only) | Keep `align end`; change the footer column gap from 8 to 16.                                                                                                                                                                   |

### G7 — Where the unit-cost formula sits (withdrawn — I misread it)

My probe returned the `formula` node's geometry (`x = 0`, `w = 512`) but not its `align`, because that
node _is_ a text node rather than a board containing one, so the follow-up query that collected the
other texts came back empty for it. I filled the gap with an inference — full-width at `x = 0` means
left-aligned — and reported it without checking. Looking at the screen, the formula is right-aligned
under the value, matching the code's `items-end text-right` block.

The one residual difference is 12 px of bottom padding (`py-3` closes the code's block, the canvas
ends on the formula), which is not worth an item.

Withdrawn. No action on either side. This was the only finding in the pass built on an inference
rather than a read value — every other finding quotes a property, a token or a size from the tree.

### G8 — `DetailsStep` still ends on a rule (resolved — deleted)

|                       |                                                                                                                                                                   |
| --------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Decision (2026-10-27) | **Delete the code-side rule.** Both sides drew a rule in the same gap, 24 px apart, so one had to go — and D1 already decided that region carries no rule at all. |
| Code element          | `steps/DetailsStep/index.tsx:108` — `<Separator />`, the last child of the details grid: flush under the unit-cost block, 24 px above the footer                  |
| Design element        | screen `06-details-col` — the sheet-level `Separator` between `sheet-body` and `sheet-footer`, 24 px **below** the same block                                     |
| Resolution            | The `<Separator />` and its import are gone. The details step now ends on the 24 px sheet gap like the other seven, and no step carries a line above its footer.  |
| Design-file follow-up | Already covered by D1 follow-up 1: screens `02`–`08` must drop their second `Separator`.                                                                          |

### G9 — The supplier list is filled with material rows (resolved — canvas fix)

|                                       |                                                                                                                                                                                                 |
| ------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Decision (2026-10-27)                 | **Two supplier lists worth of problems, one answer: the canvas is wrong, and the meta goes.**                                                                                                   |
| Design nodes                          | screen `06b` — rows `Лесоторг`, `Брусок 60 × 60`, `Рейка 20 × 40`, each with meta `ПИЛОМАТЕРИАЛ · ДУБ`                                                                                          |
| Code                                  | `SupplierPicker` maps suppliers to `{ label: supplier.name }` — no meta; `SupplierOption` carries `id` and `name` only                                                                          |
| Why the canvas is wrong twice         | The two variant rows are material variants copied from screen `02`, not suppliers; and the meta is a material path, which says nothing about a supplier.                                        |
| Resolution                            | No code change. Widening `SupplierOption` to feed a meta would touch a picker shared by two flows — a bigger decision than the row content, and one nothing in the current UI needs.            |
| Design-file follow-up (document only) | Replace the two variant rows with real supplier names and hide `meta` on all three rows. If a meta is ever wanted, `Supplier.contact` is the natural candidate (`ЛЕСОТОРГ · +7 900 000-00-00`). |

## Penpot to-do (deferred — nothing below was applied)

The file was not edited this session. Every remaining action is on the canvas; the rationale for each
lives in the finding it came from, referenced in brackets. Grouped by where you will be standing when
you do it.

**Component library**

- [ ] `Sheet` main — bind the `step-counter` fill to `color.foreground`; it is a raw `#D9E1D3` today
      (overlaps **M-02** in `docs/design-system-penpot-code-gap-report.md`). [D4]

**All nine screens**

- [ ] Remove the second `Separator` — the one between `sheet-body` and `sheet-footer`. Screen `01` is
      already lineless; `02`–`08` still draw it. [D1]
- [ ] `step` text — drop the instance override (`color.muted-foreground`) so it inherits the
      component's foreground. All nine instances carry the override. [D4]
- [ ] Footer — add the hint to `01`, `03`, `04`, `05`, `06`, `06b`, `07`, `08`; `02` already has it but
      needs the text form below. [D2]
- [ ] Re-centre the sheet in the 1440×900 frame: `02` y 145 → **188**, `06` 76 → **79**, `07` 50 →
      **63**, `08` 62 → **65**. `03`/`04`/`05` are already centred. `06b` cannot be centred — at 872 px
      it is taller than the frame, which is exactly the state that needs a scrolling body. [hygiene]

**01-pick-material**

- [ ] Delete the hidden `Description` (`Начните вводить — варианты появятся сразу.`). [G2]

**02-search-results**

- [ ] Replace the `hint` board's two `Icon` instances with one text run: `↑↓ ВЫБРАТЬ · ENTER`, bound to
      `typography.label` / `color.muted-foreground`. [D3]
- [ ] Delete the `Description` (`Поиск по названию, типу и варианту.`). [G2]
- [ ] Bind `typography.caption` on the three `meta` texts — they carry a fill binding only, leaving a
      raw 14/400. [hygiene]

**03-new-variant / 04-new-material / 05-new-type**

- [ ] Delete the `МАТЕРИАЛ` field above the panel, together with its hidden `Description`
      (`Nome do material`). [G1]
- [ ] `Единица` — show `метр` in `color.foreground` instead of `Выберите` in muted. [G3]
- [ ] `04` only — `Тип` shows `Выберите тип`; replace with the first type's name in `color.foreground`.
      `05` is already correct with `+ Новый тип`. [G3]
- [ ] Select chevrons — 24 px frame at full ink → 14 px with stroke `color.muted-foreground`. [G4]
- [ ] Panel `actions` row — 36 px → 40 px so it matches its button and the code. [hygiene]

**06-details / 06b-details-supplier**

- [ ] Bind `context-strip` to `color.card`; it uses `color.muted` today. Same `#1B2016`, so invisible,
      but code and `DESIGN.md` say card. [hygiene]
- [ ] `06b` — replace the rows `Брусок 60 × 60` and `Рейка 20 × 40` with real supplier names, and hide
      `meta` on all three rows. [G9]
- [ ] `06b` — grow `results` from 105 to its natural 192 so the four rows are not clipped. [hygiene]

**07-details-invalid / 08-details-error**

- [ ] Rebind the three error capsules (`07` ×2, `08` ×1) to `typography.body`, drop the uppercase, let
      them take their natural height; the Ember fill and `forest.950` label stay. [G5]
- [ ] `08` — footer column gap 8 → 16. [G6]

**Deliberately not on this list**

- The unit-cost formula block. G7 claimed the formula was left-aligned; it is right-aligned under the
  value, identical to the code. Withdrawn — do not change it.
- The header baseline. `items-start` in code is the decision; the canvas' counter-centred rows can stay
  as they are. [D4]

## Verified matches — screen 01

Checked value by value; listed so the absence of a finding is explicit.

| Surface                      | Design                                                                                                                                       | Code                                                                      | Result                                                                |
| ---------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------- | --------------------------------------------------------------------- |
| Sheet width                  | 560                                                                                                                                          | `sm:max-w-[560px]` (render confirms 560)                                  | match                                                                 |
| Sheet padding / child gap    | 24 / 24 (`space.6`)                                                                                                                          | `p-6` / `gap-6`                                                           | match                                                                 |
| Sheet surface                | `color.popover` = `#202918`                                                                                                                  | `--popover` `oklch(0.267 0.033 131)` = `#202918`                          | match (token-bound both sides)                                        |
| Sheet radius / shadow / ring | none                                                                                                                                         | `rounded-none`, no shadow, no ring                                        | match                                                                 |
| Title                        | 20 / 600 / 1.15 / 1 px, uppercase, `color.popover-foreground` `#D9E1D3`                                                                      | `type-title` + `DialogTitle`, `text-popover-foreground`                   | match                                                                 |
| Step label                   | 12 / 600 / 1 / 0.96 px, uppercase; component and `DESIGN.md` = `--foreground`, the screen instance is overridden to `color.muted-foreground` | `type-label` + `text-foreground`                                          | match to `DESIGN.md`; the instance override is a design-file nit (D4) |
| Header separator             | 1 px `color.border` `#323A2B`                                                                                                                | `Separator` → `bg-border`                                                 | match                                                                 |
| Field label                  | 12 / 600 uppercase, `color.foreground` `#D9E1D3`                                                                                             | `FieldLabel` → `type-label`, inherits `--foreground`                      | match                                                                 |
| Label → control gap          | 12 (`space.3`)                                                                                                                               | `Field` `gap-3`                                                           | match                                                                 |
| Control height               | 40 (`size.control.md`)                                                                                                                       | `InputGroup` `h-10`                                                       | match                                                                 |
| Placeholder                  | 16 / 500 / 1.5, `color.muted-foreground`                                                                                                     | `type-input` + `placeholder:text-muted-foreground`                        | match                                                                 |
| Underline (focused)          | 1 px `color.ring` `#EAD297`                                                                                                                  | `focus-visible:border-b-ring`; `autoFocus` on `PickStep` keeps it focused | match                                                                 |
| Body gap (picker)            | 24 (`space.6`)                                                                                                                               | `OptionPicker` `gap-6`                                                    | match                                                                 |
| Cancel button                | 104 × 40, px 24, `foundation.transparent`, label 12 / 600 uppercase `foreground`                                                             | ghost variant, `h-10 px-6`, `type-label`, no text-colour override         | match                                                                 |
| No close affordance          | none                                                                                                                                         | no `DialogClose` in `Sheet`                                               | match                                                                 |
| Scrim                        | `color.overlay` 20 % black                                                                                                                   | `bg-overlay` `oklch(0% 0 0 / 20%)`                                        | match                                                                 |
| Sheet centring               | `y = 314` — 12 px above centre for the 248-tall sheet                                                                                        | `top-1/2 -translate-y-1/2`, exact centre                                  | design-canvas offset only, see D1 follow-up 2                         |
| Content column               | 848 (`size.shell.column`)                                                                                                                    | `max-w-4xl` 896 − 2 × `sm:px-6` 24 = 848                                  | match, modelled differently                                           |

Colour cross-check (design binding → code token → hex): `background` `#080B06`, `foreground`
`#D9E1D3`, `muted-foreground` `#9DAA92`, `border` `#323A2B`, `ring` `#EAD297`, `popover` `#202918`.
All six are identical on both sides. Text case is literal uppercase in the design and CSS
`text-transform` in code — a rendering difference, not drift.

## State coverage (pick step)

| State                                            | Design            | Code                           |
| ------------------------------------------------ | ----------------- | ------------------------------ |
| Sheet open, field focused, empty                 | screen `01`       | `PickStep` + `autoFocus`       |
| Results list open with creation row              | screen `02`       | `OptionPicker` / `OptionList`  |
| New variant                                      | screen `03`       | `VariantStep`                  |
| New material                                     | screen `04`       | `MaterialStep`                 |
| New type                                         | screen `05`       | `MaterialStep` (`+ Новый тип`) |
| Details / supplier list / invalid / server error | screens `06`–`08` | `DetailsStep`                  |

Every design state has a code counterpart. Gaps inside those states are out of scope here.

## Not comparable while muted

- Page shell behind the dialog: header, nav, page body, dimming of the page, palette underneath.
  The design declares nav items `Главная / Настройки / Материалы`; the code renders `Материалы` plus
  `Настройки` behind the `settings` flag (`App.layout.tsx`), with the brand acting as home. This is
  **not** counted as a finding — it cannot be verified while `appLayout` is hidden.
- `content-slot` placeholder (`Page content — Outlet, max-w-4xl column`) is a shell artifact inside
  the `appLayout` component, hidden on this screen. It has no code counterpart by design.

## Documentation conflicts noticed in passing

Not part of the design↔code diff, but both sides disagree with `workflow.md`:

- Copy: the design and the code both use «Поставка материала» / «Сделать поставку»;
  `workflow.md` §2 specifies «Приход материала» / «Записать приход». Unresolved — both sides agree
  with each other and disagree with the approved UX doc.

## Record of decisions

| Item | Decision                                                    | Landed in                                       |
| ---- | ----------------------------------------------------------- | ----------------------------------------------- |
| D1   | The sheet carries one rule; the footer is separated by air  | **code** — `Sheet` · `DESIGN.md`                |
| D2   | The keyboard hint is always shown                           | canvas — add it to 8 screens                    |
| D3   | The hint stays a `↑↓` text run                              | canvas — revert screen `02`                     |
| D4   | The counter stays `items-start`; its fill is `--foreground` | canvas — drop the instance override             |
| D5   | One backdrop recipe, owned by the dialog                    | `DESIGN.md` — clause removed from §Sheet        |
| G1   | The search field does not belong on the panel steps         | canvas — delete from `03`–`05`                  |
| G2   | The field description is dropped                            | canvas — delete from `01`, `02`                 |
| G3   | Selects always hold a value                                 | canvas — draw the defaults                      |
| G4   | The caret is 14 px and muted                                | canvas — resize and rebind                      |
| G5   | Errors are `type-body`, not a caps label                    | canvas — rebind three capsules                  |
| G6   | Failure sits on the commit edge, 16 px above it             | **code** — `Sheet` · `DESIGN.md` · canvas (gap) |
| G7   | Withdrawn — I misread the formula's alignment               | nothing                                         |
| G8   | No rule above the details footer                            | **code** — `DetailsStep`                        |
| G9   | Supplier rows are suppliers, with no meta                   | canvas — fix rows and hide meta                 |

## Code changed this session

Three edits, all verified with `tsc --noEmit`, `eslint src/` and the impeccable detector (`[]`):

1. `components/ui/Sheet/index.tsx` — second `<Separator />` removed (D1).
2. `components/ui/Sheet/index.tsx` — `self-end` on the failure capsule (G6).
3. `features/Supply/SupplySheet/steps/DetailsStep/index.tsx` — trailing `<Separator />` and its import
   removed (G8).

`frontend/DESIGN.md` §Sheet gained **One rule per sheet** and **A failure lands on the commit edge**, and
lost the sheet-specific backdrop clause.

## Not done, by decision

- **Penpot** — untouched this session; every canvas action is the checklist above.
- **VRT goldens** — stale for step 1 (after D1), the details step (after G8) and the error state (after
  G6). Being refreshed by hand.
