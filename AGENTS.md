<!-- agent-md-sync: max-lines=45 -->

# Project overview

pnpm monorepo in TypeScript, three packages: `frontend`, `backend`, and `e2e` (Playwright Test;
see `e2e/AGENTS.md`). Root scripts are thin `pnpm --filter <pkg>` delegates.

# Docs

`docs/INDEX.md` is the entry point. Read [doc authority](docs/INDEX.md#doc-authority) before
treating a doc as a requirement: PRD/tech docs bind; UX docs are flow guides, not exact UI specs.
When code conflicts with a binding doc, change the code. Design might be the source of truth for
docs and dictate changes.

# Code style

- Do not use comments in code unless there is extraordinary behavior that is difficult to understand from the code, such as a side effect caused by another component.
- Preffer immutable structures and vars where possible.
- Preffer to declare entities before the first consumtion

# Rules

- User may make changes between your edits, do not revert them.
- Make issue explanations short and simple. Provide high level description which is easy to understand, if detailed technical explanation seems important - suggest to user further explanation.
- Chages to the docs should always be motivated by desision\design\new task implementation.

# Skills

- When running impeccable always work in frontend package.

### Issue tracker

Issues live as markdown files under `.scratch/<feature>/`. See `docs/agents/issue-tracker.md`.

### Triage labels

The five default triage roles, recorded as `Status:` values. See `docs/agents/triage-labels.md`.

### Domain docs

Single-context layout: root `GLOSSARY.md` + `docs/adr/`. See `docs/agents/domain.md`.
