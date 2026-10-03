---
name: "yeknal-yeet"
description: "Use only when the user explicitly asks to stage, commit, push, and open a GitHub pull request in one flow using the GitHub CLI (`gh`)."
metadata:
  internal: true
---

## Prerequisites

- Confirm the GitHub CLI is installed: check `gh --version`. If it is missing, ask the user to install `gh` and stop.
- Confirm the session is authenticated: run `gh auth status`. If it is not authenticated, ask the user to run `gh auth login` and re-run `gh auth status` before continuing.

## Naming conventions

- Branch: `codex/{description}` when you start from the main, master, or default branch.
- Commit: `{description}`, kept terse.
- PR title: `[codex] {description}`, summarizing the whole diff.

## Workflow

- On the main, master, or default branch, create a branch with `git checkout -b "codex/{description}"`.
- On any other branch, stay where you are.
- Inspect the working tree, then stage everything: `git status -sb` followed by `git add -A`.
- Commit with a terse message built from the description: `git commit -m "{description}"`.
- Run the project checks unless they already ran. If a check fails because a dependency or tool is absent, install it and retry once.
- Push and set upstream tracking: `git push -u origin $(git branch --show-current)`.
- If the push fails on workflow authentication errors, pull from master and push again.
- Open the pull request as a draft, then edit its title and body so they reflect the description and the actual deltas: `GH_PROMPT_DISABLED=1 GIT_TERMINAL_PROMPT=0 gh pr create --draft --fill --head $(git branch --show-current)`.
- Write the PR body to a temp file using real newlines, for example `pr-body.md` ... EOF, and pass that file, so the markdown never arrives with escaped `\n`.
- The PR description is detailed markdown prose covering the issue, the cause and its effect on users, the root cause, the fix, and the tests or checks that validated it.
