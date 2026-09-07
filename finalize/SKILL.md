---
name: finalize
description: Run repository-appropriate documentation and quality gates, summarize the final diff, and perform only explicitly requested Git publication steps. Use when the user asks to finalize, prepare, commit, or publish completed work.
---

# Finalize

## Usage
```
/finalize [commit-message] [--skip-docs] [--skip-lint] [--skip-types] [--skip-build] [--dry-run] [--no-push]
```

## Workflow Pipeline

1. Inspect repository instructions, working-tree state, package manager, scripts, and changed files.
2. Update affected Markdown through `markdown-management`; do not rewrite unrelated documentation.
3. Run the repository's actual focused test, type, lint, and build commands. Never assume Bun, Next.js, or a script name.
4. Run `git diff --check`, inspect the final diff, and distinguish new failures from baseline failures.
5. Summarize changed behavior, validation evidence, and external proof still required.
6. Stage, commit, or push only when explicitly requested, and only after confirming the exact files and destination.

## Arguments
- `[commit-message]` - Custom commit message (optional)
- `--skip-docs` - Skip documentation updates
- `--skip-lint` - Skip linting validation (only applies to Next.js < 16)
- `--skip-types` - Skip TypeScript type checking
- `--skip-build` - Skip build verification
- `--dry-run` - Show what would be done without executing
- `--no-push` - Commit locally but don't push to remote

## Examples
```bash
# Full workflow with custom message
/finalize "feat: add user authentication system"

# Skip some steps
/finalize --skip-docs --skip-build

# Dry run to see what would happen
/finalize --dry-run

# Commit locally only
/finalize "fix: resolve login bug" --no-push
```

Skipped gates must be reported. A passing local build does not prove browser, tenant, provider, deployment, or production behavior.
