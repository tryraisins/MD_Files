---
name: yeknal-git
description: "Run the specific Git operation the user asked for while preserving unrelated work: status, diff, branch, commit, merge, history, or push. Not the full delivery flow, which is `yeknal-finalize`."
---

# Git

Run the Git operation the user asked for, and nothing wider.

## Execution

1. Inspect current Git state and repository context.
2. Run the requested operation with validation.
3. Handle merge conflicts and branch management.
4. Report the result and the next step.

## Safety

- Inspect `git status`, relevant diffs, remotes, and branch state before changing history or publishing.
- Stage only intended files; exclude secrets, screenshots, generated artifacts, and unrelated changes.
- Prefer non-interactive, recoverable commands.
- Never run destructive reset, checkout, clean, force-push, or history rewriting unless the user explicitly asked for that exact effect.
- Do not commit or push just because validation passed; wait for the user's request.
