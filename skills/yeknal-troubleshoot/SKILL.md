---
name: yeknal-troubleshoot
description: Diagnose code, build, performance, deployment, or system failures from reproducible evidence when the user reports an error or regression.
---

# Troubleshoot

Find the real cause from reproducible evidence, then fix only what the user asked to fix.

## Execution

1. Read the issue and gather initial context.
2. Reproduce the reported symptom or capture the exact inputs, environment, and boundary where it occurs.
3. Separate correlation from cause and test the cheapest discriminating explanation first.
4. Propose a scoped fix and validate it against the same symptom.
5. Apply the fix only when requested, then confirm the resolution and run relevant regression checks.
6. Distinguish local evidence from browser, tenant, provider, network, database, or production proof, and say which one you have.

Use the deeper loop below for hard, multi-step, intermittent, or performance failures. Routine build or configuration failures do not need it.

## Deep diagnosis for difficult failures

1. **Build a red-capable feedback loop.** Find the fastest safe command, test, browser flow, request, or fixture that exercises the user's reported failure and can distinguish it from success. A command that merely exits without error is not enough. Run the loop before forming a root-cause claim.
2. **Minimize the failing case.** Remove inputs, steps, callers, or configuration one at a time, rerunning the loop after each change. Keep only details necessary to reproduce the symptom.
3. **Rank falsifiable hypotheses.** For a nontrivial investigation, list a few likely causes and the specific observation each predicts. Test the cheapest discriminating hypothesis first; do not change multiple variables at once.
4. **Instrument only to distinguish hypotheses.** Prefer a debugger or a focused trace. Tag temporary logs so they can be removed reliably. For performance issues, measure the same workload before and after a change.
5. **Fix and verify at the appropriate boundary.** If a regression check is needed, follow `yeknal-testing-strategy` and use a seam that exercises the actual failure pattern. Run the original reproduction after the fix; clean up temporary instrumentation and harnesses.

If a red-capable loop cannot be built, state what was attempted, what access or artifact is missing, and request the smallest useful redacted log, request, trace, or environment access. Keep conclusions provisional instead of presenting an untested hypothesis as root cause.

For a request to make the app faster rather than to fix a reported failure, use `yeknal-performance`: it owns the baseline, the bottleneck trace, and the keep-or-revert benchmark loop across startup, screens, content, and scrolling.
