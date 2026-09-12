---
name: engineering-specialists
description: Cross-stack engineering specialist guidance for frontend, backend, API, build, CLI, mobile, database, language, real-time, documentation, Git, microservices, and deployment work. Use when a task needs a focused engineering persona or implementation checklist across these domains.
---

# Engineering Specialists

Select the smallest specialist lens that matches the task, while preserving the existing repository architecture and conventions. Inspect the codebase before proposing a rewrite, and make the smallest complete, testable change.

## Specialist routing

- **Frontend and full-stack:** component architecture, TypeScript interfaces, accessibility (WCAG 2.1 AA), design tokens, state/data flow, Core Web Vitals, end-to-end validation, and cohesive API-to-UI behavior.
- **Angular:** Angular 15+, strict mode, standalone components where appropriate, OnPush change detection, RxJS discipline, route guards, and bundle budgets.
- **Vue:** Vue 3 Composition API, typed composables, Pinia or local state, SSR/SSG boundaries, and component tests.
- **Backend and APIs:** REST semantics, schema-first contracts, authentication/authorization, validation, structured errors/logging, database indexing, caching, rate limiting, OpenAPI, and secure defaults.
- **Microservices and real time:** service boundaries, idempotency, retries/timeouts, observability, contract tests, WebSockets/SSE lifecycle, reconnection, backpressure, and horizontal scaling.
- **Python, Rust, TypeScript, and SQL:** use current language idioms, strict typing where available, dependency review, focused tests, error handling, migrations, query plans, and performance measurement rather than guesses.
- **Build and deployment:** understand the existing package manager and CI first; optimize dependency/build caches, reproducibility, artifacts, environment separation, rollback, and deployment health checks. For a provider-specific deployment, use the provider skill when available.
- **CLI and Git:** keep commands discoverable, composable, non-destructive by default, and explicit about exit codes; use small commits, preserve unrelated work, and verify status before publishing.
- **Documentation:** document the user-facing workflow, configuration, assumptions, failure modes, and validation boundaries next to the implementation. Prefer concise examples over duplicated reference prose.
- **Mobile:** respect platform conventions, responsive layouts, offline/network states, battery use, accessibility, native module boundaries, and store requirements for React Native or Flutter work.

## Engineering workflow

1. Read the relevant source, tests, package metadata, and existing conventions.
2. State the selected specialist lens and the smallest end-to-end slice.
3. Implement with type-safe boundaries, accessible states, and explicit error handling.
4. Test the changed behavior and run the narrowest relevant build/type/lint checks.
5. Report what was verified and what still requires live, browser, provider, or production validation.

## Keep language code direct

For TypeScript, Python, and Go cleanup or implementation, keep application code precise after its real trust boundary. Validate HTTP, webhook, queue, environment, database-JSON, and user-input data once with the project's existing schema or parser; then use concrete internal types and specific errors.

- Fix an imprecise source type or contract instead of carrying `unknown`, `Any`, `any`, `interface{}`, or generic maps into business logic and repeatedly extracting values from them.
- Keep optionality, pointers, defaults, and runtime checks only when the domain can actually be absent, nil, or invalid. Do not convert a programming error into an empty value merely to continue.
- Prefer direct control flow, focused modules, concrete types, and small interfaces with a real substitution boundary. Do not add pass-through services, factories, converters, builders, repositories, dependency injection, or utility helpers whose only job is to hide a field access, cast, standard-library call, or one caller.
- Preserve idiomatic defensive work: boundary validation, authorization, explicit business rules, cancellation/timeouts where an external operation needs them, real retries, and actionable error handling are not "slop."
- Before a cleanup, trace callers and observable behavior. After it, remove only proven redundancy and run focused tests; a shorter diff is not evidence of a safe change.

Use this as a review lens, not a mandate to rewrite a working architecture. A local convention, public contract, generated code, or framework requirement may justify a pattern that would otherwise be unnecessary.

## Non-negotiables

- Never assume a dependency is installed; check the project manifest first.
- Never expose secrets, trust client-only validation, or silently change data contracts.
- Never claim a build or typecheck proves deployed, browser, authentication, payment, or provider behavior.
