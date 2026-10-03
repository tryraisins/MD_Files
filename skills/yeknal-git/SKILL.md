---
name: yeknal-git
description: Perform scoped Git operations while preserving unrelated work. Use for status, diff, branch, commit, merge, history, or push requests.
---

# Git

Run the Git operation the user asked for, and nothing wider.

## Invocation

```
/git [operation] [args] [--smart-commit] [--branch-strategy] [--interactive]
```

## Arguments

- `operation` - the Git action: add, commit, push, pull, merge, branch, or status.
- `args` - arguments for that operation.
- `--smart-commit` - draft a precise commit message from the staged diff.
- `--branch-strategy` - apply the repository's branch naming convention.
- `--interactive` - step through complex operations.

## Execution

1. Inspect current Git state and repository context.
2. Run the requested operations with validation.
3. For commits, derive the message from the actual diff.
4. Handle merge conflicts and branch management.
5. Report the result and the next step.

## Safety

- Inspect `git status`, relevant diffs, remotes, and branch state before changing history or publishing.
- Stage only intended files; exclude secrets, screenshots, generated artifacts, and unrelated changes.
- Prefer non-interactive, recoverable commands.
- Never run destructive reset, checkout, clean, force-push, or history rewriting unless the user explicitly asked for that exact effect.
- Do not commit or push just because validation passed; wait for the user's request.
