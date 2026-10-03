---
name: yeknal-troubleshoot
description: Diagnose code, build, performance, deployment, or system failures from reproducible evidence when the user reports an error or regression.
---

# Troubleshoot

Find the real cause from reproducible evidence, then fix only what the user asked to fix.

## Invocation

```
/troubleshoot [issue] [--type bug|build|performance|deployment] [--trace] [--fix]
```

## Arguments

- `issue` - the problem or error message.
- `--type` - category: `bug`, `build`, `performance`, or `deployment`.
- `--trace` - add detailed tracing and logging.
- `--fix` - apply safe fixes automatically.

## Execution

1. Read the issue and gather initial context.
2. List candidate root causes and the investigation path for each.
3. Debug systematically against the reproduction.
4. Propose a fix and validate it.
5. Apply the fix and confirm the resolution.

## Evidence rules

- Reproduce, or obtain the exact error, inputs, environment, and boundary where it occurs.
- Separate correlation from root cause and test the cheapest discriminating hypothesis first.
- Do not change code during a diagnosis-only request.
- When a fix is requested, keep it scoped and rerun the reproduction plus relevant regression checks.
- Distinguish local evidence from browser, tenant, provider, network, database, or production proof.
