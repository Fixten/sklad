# Guide: focused minimal solutions from agents

Standing guide for how work is handed to agents and what agents owe back. It
exists because agents reliably over-engineer unless the loop gives complexity a
price; this file is that price. With minor adaptation, the standing rules below
belong in `frontend/docs/code_style.md`, and the per-task part can become a
skill.

## The failure mode (why agents add what wasn't asked for)

1. **Cost function mismatch** — agents optimize for "covers the request,
   survives review, breaks nothing". All three rewards are additive; complexity
   carries no price unless declared here.
2. **Library distrust** — an agent doesn't trust that a dependency's normal
   path will work, so it wraps, patches, or re-implements the library's job.
   (In this codebase's history: a custom selection machinery beside cmdk that
   existed only for that reason, and was deleted with no behavior loss.)
3. **Requirement reconstruction** — when a doc is silent, an agent silently
   substitutes *what the current code does* for the requirement. Consumers'
   wiring becomes the spec, and the design grows around it.
4. **Authority creep** — specs and plans written by earlier agents get obeyed
   like requirements, including lines written to reject the requester's own
   stated requests.
5. **Unmeasured simplicity** — nothing flags needless layers, nothing rewards
   removal, until the reviewer questions files by hand. The gates below make
   that questioning the loop's first deliverable instead of its recovery action.

## Standing rules (drop-in for `code_style.md`)

### Requirements and design

- Requirements come from user statements and product/UX docs, in that order.
  Code and tests are never requirements; they are evidence.
- Every claimed requirement carries a citation: a doc line or a user statement.
  "The current consumer does X" is never a requirement.
- On any conflict between a requester statement and a doc (including docs
  written by earlier agents), the requester statement wins: quote the
  conflicting line and stop for a ruling instead of working around it.

### Design

- Trust the library: use its documented API for the job it exists for. Do not
  patch internal state, remount internals, or build parallel
  mini-implementations of library behavior. If a bug blocks the documented
  path, surface it and pick with the requester among: another documented API,
  accept the bug, patch the library.
- Every addition — file, hook, prop, option, dependency — is declared in one
  sentence: what breaks without it, and which alternative (library behavior,
  existing file) was rejected. Additions without this sentence are rejected at
  review.
- Prefer the design in which existing pieces disappear. Rewrites, not wraps.
- Tests pin required behavior, not implementation choices. A test that fails
  only because a layer was deleted is updated with the deletion, not fought.

### Simplicity accounting

- State work budgets in numbers the requester sets (component ≤ N lines, net
  diff budget, max new files). Report actuals with the result.
- A plan is presented one page, plain words, before any code: the structure
  tree, who owns each piece of state, and the additions list. The reviewer must
  be able to read it without knowing the codebase.

## Per-task inputs (requester checklist)

1. The need in one plain paragraph, plus the concrete flow or failure seen
   today.
2. Bindings: which docs govern, scope exclusions (a11y, form stack, versions),
   everything already decided.
3. **The additions gate** — the single most effective input: "Every planned new
   file/hook/prop appears as an itemized list with a one-sentence justification
   before any test or code is written. Anything not on the list may not
   appear." Additions are free by default; this makes each one a declaration.
4. The checkpoint: "present the one-page design before writing tests or code;
   approval of the shape comes first."
5. A known-simpler assumption, if one exists ("assume the library handles
   selection — that is the plan's spine"). This stops the distrust spiral at
   step one.

## Agent's first deliverable (fixed shape)

1. One page: the design in plain sentences — no commands, no test blobs.
2. Structure tree: files created/rewritten/deleted, who owns each piece of
   state.
3. Additions list: enumerated, each with its one-sentence justification.
   Missing item = a review finding, not silent cargo.
4. Requirements trace: which cited line each piece realizes — a library
   feature or small own code.
5. Budget actuals vs. the declared numbers.

## The second pass (before implementation)

A separate pass whose only role is adversarial: "go through the design; for
every piece, name the cited requirement or library behavior that needs it; mark
what is machinery." Run it every time, before a line of code exists — it is the
reviewer's by-hand questioning made formal, at the cost of one agent read.

## Execution order after approval

Design approved → tests pinned to required behavior only → implement → report
actual diff numbers against the declared budgets. Growing past a budget is a
stop-and-justify moment, not silent growth.
