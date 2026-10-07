---
name: agent-md-sync
description: AGENTS.md updates. Used for any changes to the file.
---

# AGENTS.md Sync

Package-level `AGENTS.md` files are read at the start of _every_ future session in that
package. Their value is inversely proportional to their length — a bloated file gets
skimmed or ignored, a tight one gets fully absorbed. This skill's job is to extract
what's actually worth an agent's limited attention span from a session, and merge it
into the file without letting it grow unbounded.

**Core principle: this is a compression task, not an append task.** Every run re-evaluates
the _entire_ file against the budget, not just the new content.

## Step 1: Locate the target file and its budget

1. Determine which package the session's work belongs to (infer from files touched;
   ask if ambiguous across multiple packages).
2. Read `<package>/AGENTS.md`.
3. Look for a budget marker at the top of the file:
   ```
   <!-- agent-md-sync: max-lines=120 -->
   ```
   If absent, default to **120 lines** and add the marker so future runs (and the user)
   can see and tune the limit explicitly.

## Step 2: Extract candidates from the session

Scan the conversation (not the diff — the _discussion_) for durable, non-obvious
information. Good candidates:

- **Decisions with a "why"**: choices made after considering alternatives, especially
  if the reasoning isn't visible in the code itself.
- **Rejected approaches**: what was tried, why it didn't work — saves a future agent
  from repeating the dead end.
- **Gotchas**: non-obvious behavior in a dependency, API, build step, test harness,
  or environment that cost real time to discover.
- **Corrections**: any point where the user corrected an assumption or approach —
  these are high-signal because they'll likely recur.
- **Conventions**: naming, structuring, or process rules specific to this package that
  aren't enforced by a linter and aren't obvious from reading neighboring code.
- **Open threads**: known follow-ups, deliberately deferred work, or flagged risks —
  but only if they'll still be true/relevant next session.

Explicitly discard:

- Anything a future agent would immediately see by reading the code.
- Narration of what was done (that's what git history is for).
- Bugs that were fully fixed and have no recurring risk.
- Anything the user described as a one-off or explicitly said not to keep.

Write each surviving candidate as **one dense line or short bullet**, not a paragraph.
If a candidate needs a paragraph to explain, it belongs in `docs/` (see the project's
docs index) with a one-line pointer from AGENTS.md instead — AGENTS.md holds pointers and
compressed facts, not explanations. Never duplicate content from docs/ — if it's already documented, just link to it.

## Step 3: Merge, don't append

1. Read every existing line in the file's content sections.
2. For each existing item, decide: **keep as-is**, **keep but compress further**,
   **merge with a new candidate** (if they overlap), or **drop** (superseded,
   resolved, or no longer relevant given what happened this session).
3. Add the new candidates from Step 2 into the appropriate section.
4. Only add an item if it's specific enough to change what a future agent would do.
   "Be careful with the auth module" is not a keeper. "Auth middleware runs before
   the request-logger, so logged requests never include the resolved user — add
   logging inside the handler if you need it" is.

## Step 4: Enforce the budget

Count lines against the marker's `max-lines`. If over:

1. First pass: tighten wording — cut hedging, articles, restated context. Aim for
   telegraphic density over prose.
2. Second pass: drop the lowest-value surviving items. Rank by: how expensive was this
   to discover vs. how likely is it to matter again. Cut items that are cheap to
   rediscover or narrow in applicability first.
3. Never silently drop an item that looks safety-critical (data loss, security,
   irreversible operations) — if cutting would remove the only such warning, cut
   something else instead, or flag to the user that the file needs a higher budget.
4. If still over budget after real compression (not just trimming words), that's a
   signal the package genuinely needs more space or a docs/ split — tell the user
   rather than force-cutting meaningful content.

## File shape

Keep sections minimal and skimmable. Suggested structure (omit empty sections):

```markdown
<!-- agent-md-sync: max-lines=120 -->

# <package name>

<one-line purpose, only if not obvious from the package name/path>

## Conventions

- <dense, specific rules not enforced by lint/tooling>

## Gotchas & decisions

- <non-obvious behavior, rejected approaches, why-notes>

## Open threads

- <deferred work or known risk that's still live>

## See also

- <pointer to docs/INDEX.md entries relevant to this package, if any>
```
