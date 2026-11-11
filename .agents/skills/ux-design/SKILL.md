---
name: ux-design
description: develop UX design and prototype it
---

# UX Design Skill

## Purpose

Design clear, task-oriented user experiences grounded in user goals and real workflows.

The goal is not to turn domain models into screens or produce polished mockups. The goal is to understand what users need to accomplish, design the simplest sufficient workflow, and describe its expected behavior clearly enough that another agent can implement and test it.

**Core principle: Think deeply. Write minimally.**

Explore the problem thoroughly, but document only what matters.

## Core principles

### 1. Start with user goals, not domain entities

Always reason in this order:

**User goal → Task → Workflow → Interaction → UI**

Never derive screens, forms, or navigation directly from database entities, domain models, or CRUD operations.

Domain models and PRDs provide context and constraints. They do not dictate the user experience.

Ask:

- What is the user trying to accomplish?
- Why and when do they need to do it?
- What information do they have when they start?
- What decisions must they make?
- What is the simplest way to help them succeed?

### 2. Understand the whole task

Do not start designing UI after identifying the main action.

Understand the task from its starting point to its completion. In particular, investigate how users discover and identify the information or objects they need.

A workflow is incomplete if it explains what happens after an object is selected but not how the user finds the correct object.

Consider these aspects:

- **Entry:** Where and how does the user start? What context do they already have?
- **Discovery:** How do they find the information or object they need?
- **Selection:** How do they recognize the correct choice? Do they understand the terminology?
- **Action:** What information must they provide? What decisions must they make?
- **Alternatives:** What happens when required information or a prerequisite does not exist?
- **Completion:** What happens after success? Where does the user go next? What has changed?

These are reasoning prompts, not mandatory sections or flows. Explore what is relevant to the task.

### 3. Account for different starting conditions

Do not assume every user starts with everything ready.

For workflows involving existing domain objects, consider relevant situations such as:

- The exact object already exists.
- A related object exists, but the required detail or variant does not.
- The required object does not exist at all.
- The user does not know exactly which object they need.
- The user has incomplete or uncertain information.

Ask whether users can resolve missing prerequisites within the workflow, and whether they can do so without losing their current progress.

Do not assume that because an entity exists in the domain model, users can easily find or recognize it.

Do not assume users understand internal entity names or relationships. Use the language and mental model that make sense to the user.

Only include scenarios that are relevant to the actual task. Do not invent hypothetical complexity.

### 4. Challenge unnecessary complexity

Prefer the simplest workflow that fully supports the user's goal.

- Do not create a screen for every entity.
- Do not expose internal domain structure unless users need it.
- Do not add steps, options, or decisions without a clear reason.
- Do not solve hypothetical edge cases that are outside the task.
- Do not preserve complexity merely because it exists in the current system.
- Prefer familiar, direct interactions and sensible defaults where appropriate.

Challenge assumptions in the PRD or proposed solution when they create unnecessary user effort.

### 5. Do not invent missing behavior

When an important decision is unclear, ask the user.

Do not silently decide:

- How users find or identify objects.
- Whether users can create missing prerequisites.
- Which values are required or optional.
- What happens to existing progress when an alternative path is taken.
- What happens after an action succeeds or fails.
- Which business rules apply.

You may propose a reasonable option, but distinguish it from confirmed requirements.

Ask only questions that materially affect the workflow. Ask them progressively, not as a large questionnaire.

## Process

Work in stages. Do not skip approval gates.

### Stage 1: Understand the task

Read the relevant PRD, domain model, and available project context.

Identify:

- The user and their goal.
- The task they need to perform.
- The context in which it starts.
- Relevant business rules and constraints.
- What is already known and what remains uncertain.

Treat the domain model as supporting context, not as a blueprint for UI.

### Stage 2: Discover the workflow

Explore the complete task, from entry to completion.

Pay particular attention to discovery and selection:

- How does the user reach the task?
- How do they find the right information or object?
- What helps them recognize the correct choice?
- What if the expected choice is missing?
- Can they resolve that situation without abandoning their task?
- What happens after each important action?

Use an iterative conversation:

1. Present your current understanding.
2. Identify the most important uncertainty.
3. Ask one focused question.
4. Update the workflow based on the answer.
5. Explore the next important uncertainty.
6. Repeat until the workflow is sufficiently understood.

Do not ask questions whose answers would not materially change the design.

Do not produce a final behavior specification while important workflow questions remain unresolved.

### Stage 3: Propose and challenge the flow

Present the proposed workflow in plain language.

Make sure it covers the relevant path from the user's starting point through successful completion.

Call out important assumptions or unresolved decisions separately. Explain meaningful trade-offs when there are multiple viable approaches.

Challenge unnecessary steps and complexity. Do not mistake a comprehensive workflow for a complicated one.

Get the user's approval of the workflow before moving on.

### Stage 4: Write `behavior.md`

Once the workflow is approved, create or update `behavior.md`.

This is the durable, authoritative UX artifact.

It describes what the product should do from the user's perspective. It is not a technical specification or a record of the design exploration.

Use the structure below, omitting sections that are irrelevant:

```markdown
# Feature name

## Purpose

What the user wants to accomplish and why.

## User flow

The essential steps from entry to completion.

## Behavior

Expected product responses, required information, decisions, and relevant business rules.

## Important cases

Relevant alternative paths, missing prerequisites, and significant exceptional situations.

## Out of scope

Related functionality explicitly excluded from this task.
```

#### Writing rules

- Be clear, concise, and implementation-independent.
- Describe user actions and observable product behavior.
- Explain how users find and identify what they need.
- Include relevant business rules and consequences.
- State what is required, optional, or conditional when it matters.
- Describe important alternative paths without documenting every imaginable edge case.
- Use familiar user-facing language.
- Make the document understandable without seeing a prototype.

Avoid:

- Component names, component hierarchies, and UI library references.
- Frameworks, libraries, APIs, hooks, functions, and event handlers.
- Database schemas, technical relationships, and implementation details.
- CSS, styling instructions, and pixel-level layout descriptions.
- File structures and architecture.
- Test implementation details.
- Rejected alternatives and lengthy exploration notes.

Describe behavior, not implementation.

For example:

**Too technical:**
"MaterialVariantForm uses a controlled select. On mutation success, the supply is created and the materialId foreign key is updated."

**Appropriate:**
"When creating a supply, the user must select the material variant being purchased. The new supply is associated with that variant."

### Stage 5: Review the behavior specification

Before presenting `behavior.md`, check:

- Can the user reach the task from a clear starting point?
- Is it clear how they find and recognize what they need?
- Have you assumed knowledge the user may not have?
- Have you considered what happens when required information does not exist?
- Are relevant starting conditions and alternative paths covered?
- Are important actions and their consequences clear?
- Is the expected behavior understandable without implementation details?
- Does every documented detail contribute to the user's task?

If an important question remains unanswered, return to discovery rather than filling the gap with an assumption.

Present the document for user review and approval.

### Stage 6: Create a disposable HTML prototype

Only after the behavior specification is approved, create a low-fidelity HTML prototype to validate the workflow and interactions.

The prototype is a validation aid, not a deliverable or source of truth.

Guidelines:

- Focus on the essential workflow and interaction.
- Include enough behavior to evaluate the decisions made in the specification.
- Keep it simple and disposable.
- Do not spend time polishing visual design.
- Do not introduce new product behavior without discussing it.
- Do not treat prototype limitations as product requirements.

Use the prototype to discover problems in the workflow, not to replace the behavior specification.

### Stage 7: Validate and finalize

Review the prototype against `behavior.md`.

Check whether:

- The workflow is understandable.
- Users can find and identify the right information.
- Important decisions are clear.
- Missing prerequisites are handled appropriately.
- The task can be completed without unnecessary friction.
- The prototype reflects the approved behavior.

Discuss findings with the user. If the workflow changes, update `behavior.md` and get approval again.

Once validated, ensure `behavior.md` reflects the final approved behavior.

## Relationship to implementation and testing

`behavior.md` is the source of truth for expected frontend behavior.

A separate implementation or testing agent should be able to derive a frontend test suite inventory from it.

That inventory should contain **test names only**, not test bodies or implementation details.

Every proposed test must map to behavior or an important case explicitly described in `behavior.md`.

If a test requires behavior that is not documented, the agent must ask for clarification rather than invent expected behavior.

The UX skill must not write implementation code, prescribe technical architecture, or define test implementation.

## Boundaries and handoff

This skill owns:

- Task and workflow discovery.
- Interaction design.
- Behavior specification.
- Disposable HTML prototyping.
- UX validation.

This skill does not own:

- Production UI implementation.
- Technical architecture.
- Component selection or implementation.
- Automated test implementation.
- Visual design in Penpot.

After final UX approval, hand off the approved `behavior.md` and any useful prototype context to the visual design or implementation workflow.

Do not automatically move into Penpot or production implementation. Those are separate stages with their own skills and approval processes.

## Final quality standard

A good result is not the longest specification or the most elaborate prototype.

It is a well-understood user task, a complete and appropriately simple workflow, and a concise behavior specification that leaves no important user-facing behavior ambiguous.

**Explore comprehensively. Decide deliberately. Document selectively.**
