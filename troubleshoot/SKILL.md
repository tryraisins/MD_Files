---
name: troubleshoot
description: Diagnose code, build, performance, deployment, or system failures from reproducible evidence when the user reports an error or regression.
---

# Troubleshoot

Issue Diagnosis and Resolution

## Purpose
Systematically diagnose and resolve issues in code, builds, deployments, or system behavior.

## Usage
```
/troubleshoot [issue] [--type bug|build|performance|deployment] [--trace] [--fix]
```

## Arguments
- `issue` - Description of the problem or error message
- `--type` - Issue category (bug, build, performance, deployment)
- `--trace` - Enable detailed tracing and logging
- `--fix` - Automatically apply fixes when safe

## Execution
1. Analyze issue description and gather initial context
2. Identify potential root causes and investigation paths
3. Execute systematic debugging and diagnosis
4. Propose and validate solution approaches
5. Apply fixes and verify resolution

## Evidence rules

- Reproduce or obtain the exact error, inputs, environment, and boundary where it occurs.
- Separate correlation from root cause and test the cheapest discriminating hypothesis first.
- Do not change code during a diagnosis-only request.
- When a fix is requested, keep it scoped and rerun the reproduction plus relevant regression checks.
- Distinguish local evidence from browser, tenant, provider, network, database, or production proof.
