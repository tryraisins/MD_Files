---
name: git
description: Perform scoped Git operations while preserving unrelated work. Use for status, diff, branch, commit, merge, history, or push requests.
---

# Git



# /git - Git Operations

## Purpose
Execute Git operations with intelligent commit messages, branch management, and workflow optimization.

## Usage
```
/git [operation] [args] [--smart-commit] [--branch-strategy]
```

## Arguments
- `operation` - Git operation (add, commit, push, pull, merge, branch, status)
- `args` - Operation-specific arguments
- `--smart-commit` - Generate intelligent commit messages
- `--branch-strategy` - Apply branch naming conventions
- `--interactive` - Interactive mode for complex operations

## Execution
1. Analyze current Git state and repository context
2. Execute requested Git operations with validation
3. Apply intelligent commit message generation
4. Handle merge conflicts and branch management
5. Provide clear feedback and next steps

## Safety rules

- Inspect `git status`, relevant diffs, remotes, and branch state before mutating history or publishing.
- Stage only intended files; exclude secrets, screenshots, generated test artifacts, and unrelated user changes.
- Prefer non-interactive commands and recoverable operations.
- Never use destructive reset, checkout, clean, force-push, or history rewriting unless the user clearly requested that exact effect.
- Do not commit or push merely because validation succeeded; require the user's request.
