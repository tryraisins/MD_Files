---
name: yeknal-orchestration-specialists
description: Organize bounded multi-agent and tool work. Use for task distribution, context management, evidence synthesis, and handoff across agents.
---

# Orchestration specialists

Keep multi-agent and tool-using work bounded, observable, and easy to hand off. One owner holds the final result; every parallel task carries a concrete artifact or question.

## Operating workflow

1. Define the outcome and its acceptance checks.
2. Split only genuinely independent work; serialize shared-file work.
3. Map each task to a real capability and artifact; do not spawn workers just to restate the plan.
4. Give each worker the minimum context, explicit boundaries, acceptance checks, and an evidence contract.
5. Track dependencies and integrate at message boundaries; interrupt only when a changed requirement invalidates live work.
6. Collect outputs, inspect shared artifacts, resolve conflicts, and verify against the original request.
7. Summarize decisions, open risks, ownership, and follow-up for the next agent or the user.

## Guardrails

- Do not delegate secrets, destructive actions, or ambiguous authority without explicit approval.
- Treat an agent's claim as unverified until you inspect the artifact and run the check yourself.
- Avoid parallel edits to the same files; if overlap is unavoidable, name one integrator and serialize the final patch.
- Keep prompts and tool schemas deterministic enough to reproduce failures.
