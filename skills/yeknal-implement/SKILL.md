---
name: yeknal-implement
description: Implement a scoped feature or fix end to end while preserving repository behavior. Use when the user asks to build, change, add, or repair code.
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
5. Prefer end-to-end (E2E) tests as the sole mechanism, especially for complex behavior. Never write a unit test after the code it covers; if one is genuinely needed, write it before the implementation. If isolated testing is necessary, document concrete failure modes before writing the test or harness. End each E2E run with a repeatable, verifiable artifact. Apply `yeknal-testing-strategy` when available.
6. For substantial ongoing projects, read or update the repository-root `HANDOFF.md` when continuity helps. Use `yeknal-project-handoff` when available; skip it for trivial or disposable tasks.
7. Update other Markdown when commands, configuration, behavior, setup, failure modes, or proof boundaries change. Use `yeknal-markdown-management` for substantial documentation work.
8. Run the narrowest relevant tests, type checks, lint, build, security checks, and `git diff --check`.
9. Report the outcome, changed files, evidence, and any unverified external boundary.

## Separate judgment from repeatable work

Use reasoning for ambiguous requirements, product tradeoffs, and design decisions. For a repeatable question with one correct result - calculations, date or timezone conversion, parsing, structured transforms, comparisons, generation from a stable contract, or exact repository checks - prefer a small script, focused test, or existing project tool over manual reasoning.

Add deterministic automation when an operation is repeated, regression-prone, safety-critical, or directly supports an acceptance claim. Keep it scoped to the real contract, run it as part of validation, and do not build a framework or permanent helper for a one-off that is clearer done directly.

## Domain routing

- Visible UI: apply `yeknal-ui-quality-baseline`; use the most specific design skill for the requested aesthetic.
- Framework or language work: use the relevant frontend, backend, Next.js, TypeScript, Python, Rust, SQL, mobile, or other specialist.
- Authentication, authorization, untrusted input, secrets, dependencies, or agent/tool boundaries: apply `yeknal-application-security` and the appropriate security review skill.
- Deployment or provider configuration: use the provider-specific skill and separate local validation from live deployment proof.
- Motion: use ordinary CSS or a project dependency for interface transitions; use `yeknal-oil-motion` only for deliberate frame-based interactive media.

## UI states

For React and similar interfaces, choose feedback by wait type and reuse existing primitives:

- geometry-matched skeletons for content arrival;
- stable pending controls for mutations;
- focus-managed overlays only for genuinely blocking work;
- real error and retry states, `aria-busy`, status announcements, and reduced-motion support.

Never add a loading or animation package by default.

## Guardrails

- Do not replace a working path with placeholders, mock data, redirects, or cosmetic approximations.
- Do not change data contracts, dependencies, authentication, storage, or deployment behavior silently.
- Do not claim static analysis proves runtime, browser, tenant, database, payment, or production behavior.
- Do not estimate completion time unless the user asks.
- Do not commit or push unless the user requested it.
