---
name: yeknal-testing-strategy
description: Use before writing or running tests to enforce end-to-end-only verification. Do not write unit tests; prove behavior through the real entry point, keep a repeatable artifact, and report what stayed unverified.
---

# Testing strategy

Apply this whenever implementation work needs verification. Follow the user's explicit requirements and the repository's required checks, and prove the behavior users rely on through its real entry point.

## End-to-end only

Do not write, scaffold, or generate unit tests.

- Verify with end-to-end (E2E) tests or by running the feature in its real context. That means driving the real entry point: a browser through the actual UI, a CLI invocation, an HTTP request against the running server, or the built feature observed end to end.
- Importing a function into a test runner, asserting a helper's return value, mocking a dependency, or testing a module in isolation is not E2E and is out of bounds here.
- Running a repository's existing unit suite is allowed and often required, usually through the project's own test command. Report failures; do not add cases to it, do not repair it by writing another test, and do not create a new suite.
- If an existing unit test fails because of your change, fix the production code. If the failing test itself looks wrong, report that instead of extending or editing the suite.
- Only the user's explicit approval in that specific task overrides this. A general preference for "good coverage", a framework default, or an earlier repository habit does not.

Exercise the success path, then the error and recovery states that matter. Cover the whole flow a user or system actually runs, not the pieces of it.

## When E2E cannot reach a boundary

Some behavior is genuinely unreachable end to end: hardware, a paid third-party sandbox, a destructive production condition, an unauthenticated tenant, timing that cannot be reproduced.

When that happens:

1. Name the exact boundary you could not reach.
2. Gather the strongest available real evidence instead: a manual run, a real request, a recorded log or trace, a captured screenshot.
3. Ask the user before writing any isolated test or harness code.

Do not quietly fall back to a unit test because E2E is inconvenient. An unreached boundary is reported, not papered over.

## Artifacts

End every E2E run with a verifiable, repeatable artifact: a runnable command or script, report, trace, screenshot, or log. Keep artifacts in the repository's established output location, and do not commit generated artifacts unless requested or required.

When no harness exists and the change is small, run the feature in its real context and record what you observed instead of standing up a test framework.

## Workflow

1. Identify the user-visible or externally observable behavior and the strongest practical E2E path.
2. Use that path as the complete mechanism; add failure and recovery scenarios where they matter.
3. If E2E cannot reach a boundary, state what is unreachable and what real evidence you did gather, then ask before writing anything isolated.
4. Run the flow, keep a repeatable artifact, and report exactly what was verified and what remains unverified.

When reviewing, consolidating, or removing existing tests, also apply `yeknal-test-audit`; it owns the evidence bar for test value and deletion. This does not replace the repository's test-planning or validation requirements.
