---
name: "yeknal-yeet"
description: "Use only when the user explicitly asks to stage, commit, push, and open a GitHub pull request in one flow using the GitHub CLI (`gh`)."
metadata:
  internal: true
---

# Yeet

Stage, commit, push, and open a pull request in one flow. Use it only when the user asks for the whole flow; for a single step, do that step.

## Prerequisites

- Confirm the GitHub CLI is installed: check `gh --version`. If it is missing, ask the user to install `gh` and stop.
- Confirm the session is authenticated: run `gh auth status`. If it is not authenticated, ask the user to run `gh auth login` and re-run `gh auth status` before continuing.

## Naming conventions

- Branch: `<type>/<short-description>` when you start from the default branch, for example `feat/export-csv`.
- Commit: `{description}`, kept terse.
- PR title: `{description}`, summarizing the whole diff.

## Workflow

- Resolve the default branch first: `gh repo view --json defaultBranchRef -q .defaultBranchRef.name`. On it, create a branch with `git checkout -b "<type>/<short-description>"`. On any other branch, stay where you are.
- Run the project checks before committing, unless they already ran on this exact tree. A failing check, or a formatter that rewrites files, must be resolved before the commit exists. If a check fails because a dependency or tool is absent, report it and install only with the user's approval.
- Inspect the working tree with `git status -sb` and `git diff`, then stage only the files that belong to this change. Never use `git add -A` or `git add .`; leave unrelated work unstaged.
- Commit with a terse message built from the description: `git commit -m "{description}"`.
- Resolve the branch name with `git branch --show-current`. If it prints nothing (detached HEAD), stop and ask. Then push and set upstream tracking: `git push -u origin <branch>`.
- If the push is rejected because the remote moved, fetch and rebase (or merge, if that is the project's convention), then push again. If the push fails on authentication, stop and report; pulling will not fix credentials. Never force-push.
- Write the PR body to a temp file outside the repository using real newlines, then create the draft with that file in one command: `gh pr create --draft --title "{description}" --body-file <path>`. Delete the temp file afterwards. In PowerShell, set any needed environment variables for that command only, for example `$env:GH_PROMPT_DISABLED='1'; gh pr create ...`.
- The PR description is detailed markdown prose covering the issue, the cause and its effect on users, the root cause, the fix, and the tests or checks that validated it.
