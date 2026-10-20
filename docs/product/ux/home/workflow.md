# UX Design: Home Page (Working-Day Dashboard)

## 1. User Goals & Tasks

The home page is the entry point for the working-day flow (`prd/overview.md`).

### Primary Goal: Run the Working Day From One Place
- **Task**: Review products currently in stock (day step 2).
- **Task**: Record a sale (step 3).
- **Task**: Record a material supply (step 4).
- **Task**: Record produced/existing product items (step 5).
- **Task**: Confirm what was already recorded today (avoid double entry).

### Secondary Goal: Drill Into Detail
- **Task**: Open full inventory from the snapshot.
- **Task**: Check a Product Item's cost (step 6 — lives in item detail, not on home).

### Design Stance
- Mobile-first: single scrollable page, editors open as bottom sheets, user never
  leaves the home page to record something.
- Full target UX designed up front; degrades behind feature flags as epics land.
- Command palette (current `Home`) is kept as the search entry, not the page itself:
  closed by default as a one-line trigger, opening into an absolute overlay.

---

## 2. Approved Workflows

### Layout (top → bottom)
1. **Header** — date + global search (command palette, one line at rest, opens as an
   absolute overlay).
2. **Quick actions** — three verbs: `Продажа` · `Приход материалов` · `Производство`.
3. **Stock snapshot** — total items in stock, counts grouped by Product Template.
4. **Recently sold** — today / this week, with date, price, customer.

### Workflow: Record Sale (global action)
**Starting Context**: `Продажа` quick action (or palette → «Продать изделие»).
**Intent**: Record a sale of an in-stock item.

**Flow**:
1. **Item pick** — in-stock items grouped by template, searchable, each row shows
   item № and себестоимость.
2. **Sale form** — item shown read-only; `Sale date` (prefilled today), `Sale price`,
   `Customer` (free text), `Sales channel/place` (free text), optional `Notes`.
3. **Outcome** — item leaves stock, snapshot count updates, entry appears in
   «Недавно продано», sheet closes with a toast.

**Alternative path**: inventory view → item detail → «Продать» → same form.

### Workflow: Record Supply
**Starting Context**: `Приход материалов` quick action.
**Flow**:
1. **Variant search** — variants as `Type › Material › Variant` with current stock;
   «+ Новый материал» for just-in-time creation (editor itself out of prototype scope).
2. **Supply details** — quantity, unit (шт/м), purchase price, live unit purchase cost,
   supplier (datalist of past suppliers), optional description/URL.
3. **Outcome** — variant stock grows, toast.

### Workflow: Produce Items
**Starting Context**: `Производство` quick action (hidden when the feature flag is off).
**Flow**:
1. **Template pick** — templates with hours and material count.
2. **Production form** — batch quantity, material consumption lines (read-only preview
   in prototype), actual work hours, additional costs.
3. **Outcome** — N Product Items created, snapshot count updates, toast.
4. **Guard** — insufficient Supply stock blocks creation (PRD rule; message only in
   prototype).

### Workflow: Drill-Down (inventory → item → cost)
**Starting Context**: tap a template group in the snapshot, or palette.
**Flow**:
1. **Inventory** — full-screen list of in-stock items of that template (or all),
   each with status badge, creation date, себестоимость.
2. **Item detail** — status, себестоимость, creation date; actions «Продать» / «Изменить».
3. **Cost visibility** — costs are shown only here, never on the home page itself.

### Workflow: Command Palette
**Starting Context**: tap the line, focus it, or press `/`.
- Closed by default: one line under the header, with no list until opened.
- Focus, a click, or `/` opens an absolute overlay under the line, so the page
  content never moves.
- Searches actions, templates, inventory, and sections.
- Escape, an outside press, or a selection closes it; an empty message lives inside
  the open overlay.
- Power-user path to everything above.

---

## 3. Interaction Model Summary

| Goal | Interaction | UI Component |
| :--- | :--- | :--- |
| Record sale | pick → fill → save | Bottom sheet (2 steps) |
| Record supply | search → fill → save | Bottom sheet (2 steps) |
| Produce | pick template → fill → release | Bottom sheet (2 steps) |
| Review stock | summary → grouped rows → full list | Inline card → overlay screen |
| Check cost | inventory → item | Overlay screen |
| Find anything | focus / click / `/` → type → select | Command palette (one line, absolute overlay) |

All sheets are multi-step in place (back returns to the pick step), so context is
never lost and no navigation happens.

---

## 4. Important States

- **Empty (no data)** — snapshot replaced by a guided 4-step chain:
  material → supply → template → first item. `Продажа` disabled (no stock),
  `Приход` still available.
- **Feature flag off** — the action and its sections disappear entirely;
  no placeholders, no disabled ghosts. Palette filters the same way.
- **Nothing sold yet** — «Недавно продано» section is omitted, not shown empty.

---

## 5. Constraints & Decisions

- **No dashboard-as-report**: home shows only what the working day needs;
  no costs, no charts, no activity feed.
- **No activity feed** — Supplies have no date field in the PRD, so a generic
  "recent activity" is not feasible; «Недавно продано» uses Sale date instead.
- **Snapshot ≠ inventory page** — home carries a summary; the full inventory view
  with statuses stays a drill-down.
- **Settings/management pages** reachable only via palette/header, never as
  quick actions.
- **Guided chain is temporary** — it exists only for the empty state and is
  removed once data exists.

---

## 6. Prototype

- File: `prototype.html` (disposable, mocked data, not production code).
- Footer toggles (prototype-only): data present/empty, `производство` flag on/off —
  for validating degradation states.
- Validation walkthrough: sale, no-double-entry check, supply, batch production,
  drill-to-cost, palette, empty state, flag-off state.
