# UX Design: Material Management

## 1. User Goals & Tasks

### Primary Goal: Acquire New Materials (Add Supply)
The most frequent operation: recording a purchase of materials from a supplier.
- **Task**: Find the material variant.
- **Task**: Enter purchase details (quantity, price, supplier).
- **Task**: Create new material/variant if it doesn't exist.

### Secondary Goal: Verify Material Availability
Checking stock levels before starting production.
- **Task**: Search for a material variant.
- **Task**: View aggregate stock.
- **Task**: Inspect specific supply batches.

### Tertiary Goal: Correct Inventory Errors
Fixing mistakes in recorded supply data.
- **Task**: Locate the erroneous supply record.
- **Task**: Update quantity or price.

---

## 2. Approved Workflows

### Workflow: Add Supply (The "One-Stop" Entry)
**Starting Context**: Global "Add Supply" action.
**Intent**: Record a new purchase.

**Flow**:
1. **Material Selection**:
   - User types in a search/combobox.
   - System suggests `Material Variants` with hierarchy context: `Type > Material > Variant`.
   - **Exception**: If no match is found, user selects "Add New Material" $\rightarrow$ Contextual editor for `Type/Material/Variant` $\rightarrow$ Return to search.
2. **Supply Details**:
   - Once variant is selected, the `Unit` is pre-filled.
   - User enters `Quantity`, `Purchase Price`, `Supplier` (free-text entry allowed), and optional `Description/URL`.
   - System calculates `Unit Purchase Cost` in real-time.
3. **Outcome**: Supply created $\rightarrow$ Variant aggregate stock updated.

### Workflow: Stock Verification & Discovery
**Starting Context**: Inventory View.
**Intent**: Check if material is available.

**Flow**:
1. **Discovery**:
   - User uses a flat, searchable list of all `Material Variants`.
   - List is filterable by `Type` or `Material`.
2. **Verification**:
   - User sees **Total Available Stock** for the variant.
3. **Drill-down**:
   - User expands the variant to see a list of individual `Supplies` (batches) making up that total.

### Workflow: Inventory Correction
**Starting Context**: Material Variant detail (from Drill-down).
**Intent**: Fix a data entry error.

**Flow**:
1. **Action**: User edits a specific `Supply` record.
2. **Update**: User changes `Quantity` or `Price`.
3. **Outcome**: Total stock for the variant is updated automatically.

---

## 3. Interaction Model Summary

| Goal | Interaction | UI Component |
| :--- | :--- | :--- |
| **Add Supply** | Search $\rightarrow$ Fill $\rightarrow$ Save | Modal or Drawer |
| **New Material** | Just-in-time creation | Nested Contextual Editor |
| **Find Material** | Flat search with hierarchy tags | Searchable Table / List |
| **Verify Stock** | Aggregate $\rightarrow$ Detail | Expandable Row |
| **Correct Stock** | Inline edit of supply batch | Row Edit / Modal |

## 4. Constraints & Decisions
- **No CRUD Pages**: No separate "Materials Page" or "Supplies Page". All actions emerge from search and inventory views.
- **Flattened Hierarchy**: The 4-level hierarchy is used for organization/context in search, not for navigation.
- **Supplier Entry**: Handled as free-text/suggested within the Add Supply flow to minimize navigation.
- **Stock Calculation**: Only Supplies have quantity; Variants/Materials are aggregate views.

---

## 5. Prototype

- File: `prototype.html` — disposable, mocked data, not production code. Unlike the earlier
  `materials.html`, it is set in the shipped visual world of `frontend/DESIGN.md`
  (Forest & Hide: dark, sharp corners, brass/olive/brown on the forest floor, Russian copy) and
  inside the shipped shell: `App.layout` header (wordmark, «Главная · Настройки · Материалы») over
  one `max-w-4xl` column.
- One page, as in `materials.html`: a search field that filters the list in place, one primary
  action («Приход») and the palette trigger (a plain «Действия» button, `/` hint). No sections
  or tabs — everything else opens as a dialog over the list.
- Command palette — the app's `Command` pattern, opened from the toolbar or `/`. Actions only
  (record a supply, open the catalog, add type/material/variant): searching entities is the page
  field's job, so the palette never competes with it.
- Surfaces, in the order the working day needs them:
  - Inventory — flat list of variants with hierarchy context and aggregate stock; a row opens
    the variant's batches.
  - `Каталог` — a wide dialog with types → materials → variants; add, edit, hide and restore,
    plus the «Скрытые» block. Hiding, rather than deleting, keeps referenced entities intact.
  - `Приход материала` — variant search (the list appears once you type, so the whole form fits),
    just-in-time creation of type/material/variant, unit from the variant, live unit purchase
    cost, supplier suggestions.
  - `Партии` — the variant's supplies with quantity, unit cost, inline correction and a
    destructive delete behind a confirmation.
- Footer toggle (prototype-only): данные / пусто — validates the empty state.
- Validation walkthrough: filter the list in place and clear it, record a supply from the toolbar
  and from the palette, create a material by just-in-time search, open the catalog from the
  palette, edit an entity, hide a referenced variant, restore it, correct and delete a batch,
  empty state, keyboard only (palette arrows, Enter, `/`, Esc).
- `materials.html` stays as the earlier disposable validation artifact.

