---
name: yeknal-implement
description: Implement a scoped feature or fix end to end while preserving repository behavior. Use when the user asks to build, change, add, or repair code; not for the closing gates, review, or publication, which is `yeknal-finalize`.
---

# Implement

Turn a requested behavior into the smallest complete, verified repository change. Prefer project evidence and specialist skills over generic framework recipes.

## Precedence

1. The user's explicit requirements and any approved design or specification.
2. Repository instructions, architecture, package manager, versions, and existing patterns.
3. A narrow specialist skill for the affected domain or command.
4. Shared baselines such as `yeknal-ui-quality-baseline`, `yeknal-application-security`, and `yeknal-markdown-management`.
5. This generic workflow.

Do not invent tools, agents, packages, or integrations. Inspect what is actually installed before relying on it.

## Workflow

1. Read the relevant source, tests, configuration, documentation, and working-tree state.
2. Trace the existing end-to-end path: input, state, data flow, authorization, validation, side effects, errors, and rendered output.
3. State the smallest change that satisfies the request and name the proof that must come from a browser, tenant, database, provider, or deployment.
4. Implement the full path. Preserve unrelated behavior and user changes.
5. Verify through the real entry point per the repository's testing policy: drive the browser, CLI, or HTTP path, end with a repeatable artifact, and report any boundary you cannot reach instead of writing an isolated test. `yeknal-testing-strategy` owns the detail.
6. When behavior, setup, or commands changed, update the repository-root `HANDOFF.md` and the affected Markdown through `yeknal-project-handoff` and `yeknal-markdown-management`.
7. Report the outcome, changed files, evidence, and any unverified external boundary.

## Separate judgment from repeatable work

Use reasoning for ambiguous requirements, product tradeoffs, and design decisions. For a repeatable question with one correct result - calculations, date or timezone conversion, parsing, structured transforms, comparisons, generation from a stable contract, or exact repository checks - prefer a small script, focused test, or existing project tool over manual reasoning.

Add deterministic automation when an operation is repeated, regression-prone, safety-critical, or directly supports an acceptance claim. Keep it scoped to the real contract, run it as part of validation, and do not build a framework or permanent helper for a one-off that is clearer done directly.

## Guardrails

- Do not replace a working path with placeholders, mock data, redirects, or cosmetic approximations.
- Do not change data contracts, dependencies, authentication, storage, or deployment behavior silently.
- Do not claim static analysis proves runtime, browser, tenant, database, payment, or production behavior.
- Do not estimate completion time unless the user asks.
- Do not commit or push unless the user requested it.
