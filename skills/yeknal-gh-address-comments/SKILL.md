---
name: yeknal-gh-address-comments
description: Help address review/issue comments on the open GitHub PR for the current branch using gh CLI; verify gh auth first and prompt the user to authenticate if not logged in.
metadata:
  internal: true
  short-description: Address comments in a GitHub PR review
---

# PR Comment Handler

Locate the open PR for the current branch and work through its comments with the `gh` CLI. Run every `gh` command with elevated network access.

Prereq: make sure `gh` is authenticated (for example, run `gh auth login` once), then run `gh auth status` with escalated permissions (include workflow/repo scopes) so `gh` commands succeed. If sandboxing blocks `gh auth status`, rerun it with `sandbox_permissions=require_escalated`.

## 1) Inspect comments needing attention
- Run scripts/fetch_comments.py to print every comment and review thread on the PR

## 2) Ask the user for clarification
- Number the review threads and comments, and give a short summary of what a fix for each one would require
- Ask the user which numbered comments to address

## 3) If user chooses comments
- Apply fixes for the selected comments

Notes:
- If `gh` hits auth or rate issues mid-run, prompt the user to re-authenticate with `gh auth login`, then retry.
