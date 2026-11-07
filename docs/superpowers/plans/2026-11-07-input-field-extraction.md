# InputField Extraction Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Separate the standalone `InputField` renderer from its React Hook Form adapter without changing behavior or public imports.

**Architecture:** Move `InputField` and `InputFieldProps` into `InputField.tsx`. Keep `FormInputField` in `index.tsx`, where it imports the extracted component and re-exports the existing API.

**Tech Stack:** React 19, TypeScript, React Hook Form, Vitest browser tests.

**Spec:** The approved design in this conversation: move the renderer and its props together, preserve public exports and behavior, and avoid unrelated changes.

## Global Constraints

- Preserve the default and named exports from `@ui/InputField`.
- Keep current field behavior, accessibility attributes, styling, and React Hook Form wiring unchanged.
- Do not change consumers or add unrelated abstractions.

## Review Focus

- Existing browser tests cover the renderer behavior; the frontend typecheck verifies the form adapter and public type exports still compose.
- No newly introduced input cases are expected from this file-only extraction.

---

### Task 1: Extract the standalone renderer

**Files:**
- Create: `frontend/src/components/ui/InputField/InputField.tsx`
- Modify: `frontend/src/components/ui/InputField/index.tsx`
- Test: `frontend/src/components/ui/InputField/InputField.browser.test.tsx` (run existing tests; no test edits expected)

**Interfaces:**
- `InputField.tsx` exports the `InputField` component as both default and named export, and exports `InputFieldProps` as a type.
- `index.tsx` retains the current public default `InputField`, named `InputField` and `FormInputField`, and `FormInputFieldProps` / `InputFieldProps` type exports.

- [ ] **Step 1: Move the existing renderer and `InputFieldProps` into `InputField.tsx` unchanged.** Keep its imports, derived IDs, ARIA relationships, number-input handling, and markup intact.
- [ ] **Step 2: Keep the form adapter in `index.tsx`.** Import the renderer and its props type from `./InputField`, and preserve the current default, named, and type exports.
- [ ] **Step 3: Run focused verification.** From `frontend/`, run `pnpm test:browser -- src/components/ui/InputField/InputField.browser.test.tsx`, `pnpm typecheck`, and `pnpm exec eslint src/components/ui/InputField`. All must pass.
