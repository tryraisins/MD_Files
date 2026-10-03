---
name: yeknal-finalize
description: Run final documentation and quality gates, summarize the diff, and perform requested Git publication. Use when preparing completed work for delivery.
---

# Finalize

Close out a piece of work with the repository's real gates, then publish only if asked.

## Invocation

```
/finalize [commit-message] [--skip-docs] [--skip-lint] [--skip-types] [--skip-build] [--dry-run] [--no-push]
```

## Workflow

1. Read repository instructions, working-tree state, the package manager, scripts, and the changed files.
2. For substantial ongoing work, make sure root `HANDOFF.md` reflects the verified current state and next action; use `yeknal-project-handoff` when continuity warrants it.
3. Update other affected Markdown through `yeknal-markdown-management`; leave unrelated docs alone.
4. Run the repository's actual focused test, type, lint, and build commands. Never assume Bun, Next.js, or a specific script name.
5. Run `git diff --check`, inspect the final diff, and separate new failures from pre-existing ones.
6. Summarize changed behavior, validation evidence, and any external proof still required.
7. Stage, commit, or push only when explicitly requested, after confirming the exact files and destination.

## Arguments

- `[commit-message]` - custom commit message (optional).
- `--skip-docs` - skip documentation updates.
- `--skip-lint` - skip linting (Next.js < 16 only).
- `--skip-types` - skip TypeScript type checking.
- `--skip-build` - skip build verification.
- `--dry-run` - show what would run without executing it.
- `--no-push` - commit locally without pushing.

## Examples

```bash
/finalize "feat: add user authentication system"
/finalize --skip-docs --skip-build
/finalize --dry-run
/finalize "fix: resolve login bug" --no-push
```

Report every skipped gate. A passing local build does not prove browser, tenant, provider, deployment, or production behavior.
