---
name: yeknal-project-handoff
description: Create, update, or resume work from a concise repository-root HANDOFF.md that preserves important project context across sessions. Use for substantial ongoing projects, milestones, task transitions, or when continuing work in an unfamiliar repository; skip trivial or disposable tasks.
---

# Project handoff

Keep important project state in the repository so another capable agent can continue without the current conversation. A handoff is a compact working brief, not a transcript and not a substitute for source, tests, or repository instructions.

## Start or resume work

1. Read applicable `AGENTS.md` files and `HANDOFF.md` before substantial work.
2. Check the working tree, recent changes, relevant source, tests, and current runtime or build evidence.
3. Treat the handoff as a navigation aid, not unquestioned truth. Reconcile it against the repository and fix stale claims before relying on them.
4. Preserve useful existing context and unrelated user changes. Do not overwrite a still-useful handoff with a generic template.

## Decide whether to keep one

Create or maintain a root `HANDOFF.md` when the repository holds meaningful ongoing work and continuity helps: applications, websites, APIs, multi-file tools, long investigations, substantial refactors, or work likely to cross sessions or agents.

Skip it for one-off edits, tiny scripts, disposable prototypes, or tasks with no meaningful next step. Do not create a file just to satisfy this skill.

## Update at meaningful transitions

Update the handoff when a substantial task changes what a future session must know: a milestone, a significant fix or discovery, a changed requirement or approach, a new constraint, important verification results, or the next action. Before ending substantial work, confirm it matches the resulting repository state.

Prefer replacing stale detail over appending history. Keep only useful context, decisions, blockers, failed approaches worth avoiding, and a clear next step. Record verification accurately, including what remains unverified.

## Suggested structure

Adapt this outline; omit empty sections and keep it short:

```md
# Project Handoff

Last updated:
Branch / HEAD: <!-- include only when useful and easy to verify -->

## Current Objective
## Current State
## Current Task
## Relevant Files
## Decisions and Constraints
## Known Issues / Failed Approaches
## Commands and Verification
## Next Actions
```

Include enough for a new session to grasp what is being built, what works, what changed, important constraints, what is incomplete, and how to verify the next step. Link to authoritative files instead of copying them.

## Keep it safe and trustworthy

- Never put secrets, credentials, private keys, or sensitive personal data in the handoff.
- Separate verified facts from assumptions and open questions.
- Prefer current source, runtime/build behavior, and tests over stale notes or recollection.
- Do not claim a check passed unless it ran; name the command and the outcome.
- Do not record routine command output, full diffs, or conversation history.

When no handoff is warranted, leave the repository without one and summarize needed continuity in the task response.
