---
name: implement
description: Implement a scoped feature or fix end to end while preserving repository behavior. Use when the user asks to build, change, add, or repair code.
---

# Implement

Turn a requested behavior into the smallest complete, verified repository change. Prefer project evidence and specialist skills over generic framework recipes.

## Precedence

1. The user's explicit requirements and approved design or specification.
2. Repository instructions, architecture, package manager, versions, and existing patterns.
3. A narrow specialist skill for the affected domain or command.
4. Shared baselines such as `ui-quality-baseline`, `application-security`, and `markdown-management`.
5. This generic implementation workflow.

Do not invent unavailable tools, agents, packages, or integrations. Inspect what is actually installed before relying on it.

## Workflow

1. Read the relevant source, tests, configuration, documentation, and working-tree state.
2. Trace the existing end-to-end path: input, state, data flow, authorization, validation, side effects, errors, and rendered output.
3. State the smallest change that satisfies the request and identify proof that must come from a browser, tenant, database, provider, or deployment.
4. Implement the complete path. Preserve unrelated behavior and user changes.
5. Add or update focused tests when the repository supports them and the behavior warrants them.
6. Update Markdown when commands, configuration, behavior, setup, failure modes, or proof boundaries changed. Use `markdown-management` for substantial documentation work.
7. Run the narrowest relevant tests, type checks, lint, build, security checks, and `git diff --check`.
8. Report the outcome, changed files, evidence, and any unverified external boundary.

## Separate judgment from repeatable work

Use reasoning for ambiguous requirements, product trade-offs, and design decisions. For a repeatable question with one correct result—calculations, date or time-zone conversion, parsing, structured transforms, comparisons, generation from a stable contract, or exact repository checks—prefer a small script, focused test, or existing project tool over manual reasoning.

Add deterministic automation when the operation is repeated, regression-prone, safety-critical, or directly supports an acceptance claim. Keep it scoped to the real contract, execute it as part of validation, and do not create a framework or permanent helper for a one-off that is clearer to perform directly.

## Domain routing

- Visible UI: apply `ui-quality-baseline`; use the most specific design skill that matches the requested aesthetic.
- Framework or language work: use the relevant frontend, backend, Next.js, TypeScript, Python, Rust, SQL, mobile, or other specialist.
- Authentication, authorization, untrusted input, secrets, dependencies, or agent/tool boundaries: apply `application-security` and the appropriate security review skill.
- Deployment or provider configuration: use the provider-specific skill and distinguish local validation from live deployment proof.
- Motion: use ordinary CSS or a project dependency for interface transitions; use `oil-motion` only for deliberate frame-based interactive media.

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
- Do not claim that static analysis proves runtime, browser, tenant, database, payment, or production behavior.
- Do not estimate completion time unless the user asks for an estimate.
- Do not commit or push unless the user requested it.
