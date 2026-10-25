---
name: yeknal-project-handoff
description: Create, update, or resume work from a concise repository-root HANDOFF.md so another agent can continue without the current conversation. Use for substantial ongoing projects, milestones, and task handoffs.
---

# Project handoff

Keep important project state in the repository so another capable agent can continue without the current conversation. A handoff is a compact working brief, not a transcript and not a substitute for source, tests, or repository instructions.

## Start or resume work

1. Read applicable `AGENTS.md` files and `HANDOFF.md` before substantial work.
2. Check the working tree, recent changes, relevant source, tests, and current runtime or build evidence.
3. Treat the handoff as a navigation aid, not unquestioned truth. Reconcile it against the repository and fix stale claims before relying on them.
4. Preserve useful existing context and unrelated user changes. Do not overwrite a still-useful handoff with a generic template.

## Keep it safe and trustworthy

- Never put secrets, credentials, private keys, or sensitive personal data in the handoff.
- Do not record routine command output, full diffs, or conversation history.

When no handoff is warranted, leave the repository without one and summarize needed continuity in the task response.
