---
name: ux-design
description: develop UX design and prototype it
---

# UX Design

Design product UX from user goals and tasks, not from database entities or CRUD operations.

The goal is to reach an approved **user flow and interaction model**, then create a disposable HTML prototype to validate it.

## Fundamental rule

**Do not turn the domain model into screens.**

The domain model describes what exists.

The UX describes what the user is trying to accomplish.

Always reason in this order:

```text
User goal
→ user task
→ workflow
→ interaction model
→ UI structure
```

Never:

```text
Entity
→ CRUD operations
→ pages
```

Entities and their relationships are constraints on the UX, not the UX itself.

---

# Process

Work through these stages sequentially.

## 1. Understand

Read the PRD and relevant domain information.

First identify:

- users
- goals
- tasks
- constraints
- important decisions
- unclear requirements

Ask questions until there is enough understanding to design the workflow.

Do not start designing screens yet.

### Important

When the domain model suggests an obvious CRUD structure, **do not accept it automatically**.

Ask:

> What is the user actually trying to accomplish?

and design around that task.

---

## 2. Design the flow

For each important user goal, describe:

```text
Starting context
→ user intent
→ actions
→ decisions
→ system responses
→ outcome
```

Think about:

- what the user needs to know at each step
- what should remain in context
- where decisions happen
- what happens after each action
- alternative paths
- errors
- empty states
- consequential/destructive actions

Do not introduce pages unless the workflow requires them.

A workflow may result in:

- one page
- several pages
- a contextual editor
- a drawer
- inline interaction
- a modal
- a combination of these
- something else entirely

The workflow comes first.

---

## 3. Challenge the flow

Before presenting the flow as finished, actively look for problems.

Ask:

- Is this really the user's goal?
- Are we making the user manage implementation concepts?
- Are we forcing unnecessary navigation?
- Are related tasks artificially separated?
- Are we making the user repeatedly re-establish context?
- Are we exposing information before it is useful?
- Are important consequences hidden?
- Does this still work with realistic amounts of data?
- What happens when something goes wrong?
- Is there a simpler interaction model?

If there are multiple reasonable approaches, present them as alternatives and explain the trade-offs.

Then discuss them with the user.

---

## 4. Approval gate

Produce a concise text representation of the proposed UX.

Example:

```text
Goal
...

Entry
...

Flow
1. ...
2. ...
3. ...

Alternative paths
...

Important states
...

Open questions
...
```

Do not proceed until the user approves the flow.

Approval means the **behavior** is agreed, not merely that the description looks reasonable.

---

# 5. Prototype

After the flow is approved, create a disposable HTML prototype.

The prototype exists to answer:

> Does this interaction actually make sense when I use it?

Optimize for:

- workflow
- information hierarchy
- context
- discoverability
- realistic data
- state transitions

Do not optimize for:

- visual polish
- branding
- production architecture
- design-system details

Use mocked data when necessary.

Keep the prototype disposable and separate from production code.

---

# 6. Validate

Walk through the important user tasks using the prototype.

Look for:

- confusion
- unnecessary steps
- lost context
- hidden actions
- poor information timing
- problematic states
- unexpected consequences
- workflows that work on paper but fail in practice

When a problem is discovered, determine whether it is:

**Flow problem** → revise the UX flow.

**Interaction problem** → revise the prototype.

**Visual problem** → record it for the visual-design stage.

Do not use visual polish to hide a flow problem.

---

# Completion

The UX stage is complete when:

1. The user goal is understood.
2. The workflow is explicitly defined.
3. Important alternatives and edge cases are addressed.
4. The user approves the flow.
5. A disposable prototype has been created.
6. The prototype has been validated.
7. The user approves the resulting interaction.

Only then hand off to visual design.

---

# Anti-patterns

Avoid these unless the user explicitly chooses them:

```text
Entity → page
Entity → CRUD table
Entity → create/edit/delete screens
Relationship → separate management page
Database structure → navigation structure
```

Also avoid starting with:

> "Let's create a Materials page."

Instead start with:

> "What is the user trying to accomplish with materials?"

The UI should emerge from the answer.
