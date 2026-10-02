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
