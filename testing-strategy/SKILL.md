---
name: testing-strategy
description: Use before testing implementation work to prefer end-to-end coverage and plan failure cases before isolated test implementations.
---

# Testing Strategy

Use this guidance whenever implementation work needs verification. Follow the user's explicit requirements and the repository's required checks, while preferring the smallest verification approach that proves the behavior users rely on.

## Default approach

- Strongly prefer end-to-end (E2E) tests as the sole testing mechanism, especially for complex features. Exercise the real user or system flow and its important success, error, and recovery states.
- Do not add unit tests after writing the code they would cover. If a unit test is genuinely needed, write it before implementing the corresponding behavior. Do not retrofit unit tests onto already-written code.
- Do not add tests simply to create coverage numbers or duplicate behavior already proved by an E2E flow.
- At the end of an E2E run, produce a verifiable, repeatable artifact, such as a runnable test command/script, report, trace, screenshot, or log. Keep artifacts in the repository's established output location and avoid committing generated artifacts unless requested or required by project practice.
- When no test harness exists and the change is small, run the feature in its real context and record what was observed instead of creating a test framework.

## Testing a system in isolation

When isolated testing is necessary, first write down the concrete ways the system could fail. Include relevant invalid inputs, boundaries, state transitions, dependency failures, and recovery behavior. Then write the test or harness code that checks those failure modes. Only after this failure-mode inventory exists should you implement the isolated verification code.

## Workflow

1. Identify the user-visible or externally observable behavior and the strongest practical end-to-end path.
2. Prefer the E2E path as the complete testing mechanism; include failure and recovery scenarios when they matter.
3. If proposing a unit test, establish that it is necessary and write it before the code it covers. Never add it afterward.
4. If E2E verification cannot exercise a boundary and isolated verification is necessary, document failure modes first, then implement the isolated check.
5. Run the checks and preserve a repeatable artifact for E2E runs. Report precisely what was verified and any boundary that remains unverified.
