---
name: yeknal-cleanup
description: Remove confirmed dead code, stale dependencies, or redundant configuration when the user asks to clean up or prune a project.
---

# Cleanup

Remove what is provably unused and leave everything still in use intact.

## Invocation

```
/cleanup [target] [--type code|imports|files|all] [--safe|--aggressive]
```

## Arguments

- `target` - files, directories, or the whole project.
- `--type` - what to clean: `code`, `imports`, `files`, or `all`.
- `--safe` - conservative cleanup (default).
- `--aggressive` - broader cleanup with more risk.
- `--dry-run` - show the plan without changing anything.

## Execution

1. Analyze the target for cleanup candidates.
2. Find dead code, unused imports, and redundant files.
3. Produce a cleanup plan with a risk note for each item.
4. Apply only what the chosen mode allows.
5. Validate and report what changed.

## Evidence and safety

- Before calling anything unused, search the whole in-scope call graph and configuration.
- Treat dynamic imports, reflection, generated entry points, framework conventions, deployment manifests, and external consumers as possible references.
- Prefer a dry run or an explicit candidate list before material deletion.
- Preserve unrelated working-tree changes; after cleanup run the repository's tests, type checks, build, and `git diff --check`.
- State what was removed and whether it can be recovered.
