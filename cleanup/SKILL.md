---
name: cleanup
description: Remove confirmed dead code, unused imports, redundant files, and structural clutter with reversible evidence. Use when the user explicitly requests code or project cleanup.
---

# Cleanup

# /cleanup - Code and Project Cleanup

## Purpose
Systematically clean up code, remove dead code, optimize imports, and improve project structure.

## Usage
```
/cleanup [target] [--type code|imports|files|all] [--safe|--aggressive]
```

## Arguments
- `target` - Files, directories, or entire project to clean
- `--type` - Cleanup type (code, imports, files, all)
- `--safe` - Conservative cleanup (default)
- `--aggressive` - More thorough cleanup with higher risk
- `--dry-run` - Preview changes without applying them

## Execution
1. Analyze target for cleanup opportunities
2. Identify dead code, unused imports, and redundant files
3. Create cleanup plan with risk assessment
4. Execute cleanup operations with appropriate safety measures
5. Validate changes and report cleanup results

## Evidence and safety

- Search the complete in-scope call graph and configuration before declaring code or files unused.
- Treat dynamic imports, reflection, generated entry points, framework conventions, deployment manifests, and external consumers as possible references.
- Prefer a dry run or an explicit candidate list for material deletion.
- Preserve unrelated working-tree changes and use the repository's tests, type checks, build, and `git diff --check` after cleanup.
- State what was removed and whether recovery is possible.
