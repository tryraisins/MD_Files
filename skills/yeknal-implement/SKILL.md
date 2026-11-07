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

## The UX, DX, and AX standard

Three people open every screen: the user experience (UX), the developer experience (DX), and the agent experience (AX) that edits it next. Serve all three, or you are robbing one to pay another.

- UX: clear hierarchy, fewer steps to the goal, accessible by default, responsive, fast, honest loading and error states.
- DX: readable, conventional, consistently named, typed where the stack allows, testable through its real entry point, and free of cleverness that needs a comment to excuse it.
- AX: discoverable structure, stable file and symbol names, explicit conventions, machine-readable configuration, and no hidden magic or implicit state an agent cannot see from the repository.

When the three genuinely conflict, keep the product correct first, then protect UX, then weigh DX and AX equally. Never trade UX for a tidier abstraction, and never trade DX or AX for a prettier screen.

A label that only exists to explain the layout is a layout bug. Fix the hierarchy, grouping, spacing, control names, or visible state instead of adding a caption. Required field labels, error messages, consequence warnings, accessibility text, and secondary labels that distinguish rows or states all stay. The full copy rules live in `yeknal-ui-quality-baseline`.

## Workflow

1. Read the relevant source, tests, configuration, documentation, and working-tree state.
2. Trace the existing end-to-end path: input, state, data flow, authorization, validation, side effects, errors, and rendered output.
3. State the smallest change that satisfies the request and name the proof that must come from a browser, tenant, database, provider, or deployment.
4. Implement the full path. Preserve unrelated behavior and user changes.
5. For user-facing web routes, the shared shell is part of the change, not a follow-up. When the project's handoff names a `missing` floor item, or the project has none yet, create it here: a not-found route that renders recovery instead of redirecting to the home page, the icon set, a per-route title and description, and robots or sitemap to match the project's exposure. Record the resulting paths in the floor block. The stack decides the file; the behavior is the requirement.
6. Verify through the real entry point per the repository's testing policy: drive the browser, CLI, or HTTP path, end with a repeatable artifact, and report any boundary you cannot reach instead of writing an isolated test. `yeknal-testing-strategy` owns the detail. For a route-based app, fetch a path that does not exist and report the status code and what rendered, because a component can exist while the host still answers 200 for everything.
7. When behavior, setup, or commands changed, update the repository-root `HANDOFF.md` and the affected Markdown through `yeknal-project-handoff` and `yeknal-markdown-management`.
8. Report the outcome, changed files, evidence, and any unverified external boundary.

## Separate judgment from repeatable work

Use reasoning for ambiguous requirements, product tradeoffs, and design decisions. For a repeatable question with one correct result - calculations, date or timezone conversion, parsing, structured transforms, comparisons, generation from a stable contract, or exact repository checks - prefer a small script, focused test, or existing project tool over manual reasoning.

Add deterministic automation when an operation is repeated, regression-prone, safety-critical, or directly supports an acceptance claim. Keep it scoped to the real contract, run it as part of validation, and do not build a framework or permanent helper for a one-off that is clearer done directly.

## Guardrails

- Do not replace a working path with placeholders, mock data, redirects, or cosmetic approximations.
- Do not change data contracts, dependencies, authentication, storage, or deployment behavior silently.
- Do not add a flag when the product needs a state. Name the states, keep the legal transitions in one place, and enforce them atomically in the store rather than with a read, a check, then a write.
- Do not claim static analysis proves runtime, browser, tenant, database, payment, or production behavior.
- Do not estimate completion time unless the user asks.
- Do not commit or push unless the user requested it.
