---
name: project-handoff
description: Create, update, or resume work from a concise repository-root HANDOFF.md that preserves important project context across sessions. Use for substantial ongoing projects, milestones, task transitions, or when continuing work in an unfamiliar repository; skip trivial or disposable tasks.
---

# Project Handoff

Keep important project state in the repository so another capable agent can continue without relying on the current conversation. A handoff is a compact working brief, not a transcript or a substitute for source code, tests, or repository instructions.

## Start or resume work

1. Read applicable `AGENTS.md` files and `HANDOFF.md` before substantial work.
2. Check the working tree, recent changes, relevant source, tests, and current runtime/build evidence as appropriate.
3. Treat the handoff as a navigation aid, not unquestioned truth. Reconcile it against the repository and update stale claims before relying on them.
4. Preserve useful existing project context and unrelated user changes. Do not replace a handoff wholesale with a generic template when the current one is still useful.

## Decide whether to maintain one

Create or maintain a root `HANDOFF.md` when the repository contains meaningful ongoing work and continuity would help. Typical cases include applications, websites, APIs, multi-file tools, long-running investigations, substantial refactors, or work likely to move across sessions or agents.

Skip it for one-off edits, tiny scripts, disposable prototypes, or tasks with no meaningful next step. Do not create a file merely to satisfy this skill.

## Update at meaningful transitions

Update the handoff when a substantial task changes what a future session needs to know, such as a milestone, a significant fix or discovery, a changed requirement or approach, a new constraint, important verification results, or the next action. Before ending substantial work, check that it reflects the resulting repository state.

Prefer replacing stale details over appending a running history. Keep only useful context, decisions, blockers, failed approaches worth avoiding, and a clear next step. Record verification accurately, including what remains unverified.

## Suggested structure

Adapt this outline to the project; omit empty sections and keep it concise:

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

Include enough detail for a new session to understand what is being built, what works, what changed, important constraints, what remains incomplete, and how to verify the next step. Link to authoritative files instead of copying their content.

## Keep it safe and trustworthy

- Never put secrets, credentials, private keys, or sensitive personal data in the handoff.
- Separate verified facts from assumptions and open questions.
- Prefer current source, runtime/build behavior, and tests over stale notes or chat recollection.
- Do not claim checks passed unless they were actually run; name relevant commands and outcomes.
- Do not record routine command output, full diffs, or conversation history.

When no handoff is warranted, leave the repository without one and summarize any needed continuity in the task response.
