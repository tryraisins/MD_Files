---
name: yeknal-gh-address-comments
description: Address review and issue comments on the open GitHub PR for the current branch using the `gh` CLI. Verifies `gh` auth first and asks the user to authenticate if needed.
metadata:
  internal: true
  short-description: Address comments in a GitHub PR review
---

# PR Comment Handler

Locate the open PR for the current branch and work through its comments with the `gh` CLI.

Prereq: `gh` is authenticated with repo and workflow scopes. Confirm with `gh auth status`; if it is not, ask the user to run `gh auth login`. If a sandbox blocks network access, ask the user to allow it or to run the command themselves.

## 1) Inspect comments needing attention
- Run `python scripts/fetch_comments.py` from the skill folder to print every comment and review thread on the PR

## 2) Ask the user for clarification
- Number the review threads and comments, and give a short summary of what a fix for each one would require
- Ask the user which numbered comments to address

## 3) If user chooses comments
- Apply fixes for the selected comments

Notes:
- If `gh` hits auth or rate issues mid-run, prompt the user to re-authenticate with `gh auth login`, then retry.
