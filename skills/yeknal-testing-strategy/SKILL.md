---
name: yeknal-testing-strategy
description: Use before testing implementation work to prefer end-to-end coverage and plan failure cases before isolated test implementations.
---

# Testing strategy

Apply this whenever implementation work needs verification. Follow the user's explicit requirements and the repository's required checks, and prefer the smallest approach that proves the behavior users rely on.

## Default approach

- Prefer end-to-end (E2E) tests as the sole mechanism, especially for complex features. Exercise the real user or system flow, including its success, error, and recovery states.
- Never write a unit test after the code it would cover. If a unit test is genuinely needed, write it before the behavior it checks. Do not retrofit unit tests onto finished code.
- Do not add tests only to raise coverage, or to re-prove what an E2E flow already covers.
- End every E2E run with a verifiable, repeatable artifact: a runnable command or script, report, trace, screenshot, or log. Keep artifacts in the repository's established output location and do not commit generated artifacts unless requested or required.
- When no harness exists and the change is small, run the feature in its real context and record what you observed instead of standing up a test framework.

## Testing a system in isolation

When isolated testing is unavoidable, first write down the concrete ways the system can fail: invalid inputs, boundaries, state transitions, dependency failures, and recovery behavior. Write the test or harness only after that failure-mode list exists.

## Workflow

1. Identify the user-visible or externally observable behavior and the strongest practical E2E path.
2. Use that E2E path as the complete mechanism; add failure and recovery scenarios where they matter.
3. If a unit test is proposed, justify it and write it before the code it covers.
4. If E2E cannot reach a boundary, document failure modes first, then write the isolated check.
5. Run the checks, keep a repeatable artifact for E2E runs, and report exactly what was verified and what remains unverified.
