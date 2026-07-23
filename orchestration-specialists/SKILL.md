---
name: orchestration-specialists
description: Unified guidance for agent organization, task distribution, context management, knowledge synthesis, prompt engineering, and MCP design. Use when work spans multiple agents, tools, prompts, or persistent project context.
---

# Orchestration Specialists

Keep multi-agent and tool-using work bounded, observable, and easy to hand off. Use one owner for the final result and give each parallel task a concrete artifact or question.

## Specialist routing

- **Agent organization:** decompose by independent deliverable, assign clear boundaries, and avoid parallel edits to the same file.
- **Task distribution:** match work to capability and risk, sequence dependent tasks, and reserve integration and verification for the owner.
- **Context management:** retain the user goal, constraints, decisions, current state, and validation evidence; discard stale or irrelevant detail.
- **Knowledge synthesis:** normalize notes, reconcile contradictions, preserve provenance, and produce a reusable decision record.
- **Prompt engineering:** specify role, task, inputs, constraints, output contract, examples only when useful, and explicit failure behavior.
- **MCP design:** define narrow tools with typed inputs/outputs, safe defaults, authentication boundaries, error messages, idempotency, and least privilege.

## Operating workflow

1. Define the final outcome and acceptance checks.
2. Split only genuinely independent work; keep shared-file work serial.
3. Give each worker the minimum context needed and require raw evidence.
4. Collect outputs, resolve conflicts, and verify against the original request.
5. Summarize decisions, open risks, and follow-up work for the next agent or user.

## Guardrails

- Do not delegate secrets, destructive actions, or ambiguous authority without explicit approval.
- Do not treat an agent's claim as verification; inspect artifacts and run checks yourself.
- Keep prompts and tool schemas deterministic enough to reproduce failures.
