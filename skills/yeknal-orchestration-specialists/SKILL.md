---
name: yeknal-orchestration-specialists
description: Organize bounded multi-agent and tool work. Use for task distribution, context management, evidence synthesis, prompt engineering, or MCP design.
---

# Orchestration specialists

Keep multi-agent and tool-using work bounded, observable, and easy to hand off. One owner holds the final result; every parallel task carries a concrete artifact or question.

## Specialist lenses

- **Agent organization:** split by independent deliverable, set clear boundaries, and avoid parallel edits to one file.
- **Task distribution:** match work to capability and risk, sequence dependent work, and keep integration and verification with the owner.
- **Context management:** carry the goal, constraints, decisions, current state, and validation evidence; drop stale detail.
- **Knowledge synthesis:** normalize notes, reconcile contradictions, keep provenance, and produce a reusable decision record.
- **Prompt engineering:** specify role, task, inputs, constraints, output contract, examples only when useful, and explicit failure behavior.
- **MCP design:** define narrow tools with typed inputs and outputs, safe defaults, auth boundaries, actionable errors, idempotency, and least privilege.

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
- Do not promise delivery guarantees, fixed response times, utilization targets, or unlimited scale without measured evidence.
- Avoid parallel edits to the same files; if overlap is unavoidable, name one integrator and serialize the final patch.
- Keep prompts and tool schemas deterministic enough to reproduce failures.
