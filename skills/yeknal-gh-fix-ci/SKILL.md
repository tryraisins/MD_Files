---
name: yeknal-gh-fix-ci
description: "Debug failing GitHub PR checks that run in GitHub Actions: inspect checks and logs with `gh`, summarize the failure, propose a fix, and implement after approval. Use when a PR check fails; external providers are out of scope."
metadata:
  internal: true
---


# Gh Pr Checks Plan Fix

## Overview

Use `gh` to find failing PR checks, pull GitHub Actions logs for actionable failures, summarize the failure snippet, then propose a fix plan and implement it only after explicit approval.

Prereq: authenticate with the standard GitHub CLI once (`gh auth login`), then confirm with `gh auth status` (repo + workflow scopes are typically required).

## Inputs

- `repo`: path inside the repo (default `.`)
- `pr`: PR number or URL (optional; defaults to current branch PR)
- `gh` authentication for the repo host

## Workflow

1. Verify gh authentication.
   - Run `gh auth status` in the repo.
   - If unauthenticated, ask the user to run `gh auth login` (ensuring repo + workflow scopes) before proceeding.
2. Resolve the PR.
   - Prefer the current branch PR: `gh pr view --json number,url`.
   - If the user provides a PR number or URL, use that directly.
3. Inspect failing checks (GitHub Actions only).
   - Preferred: run the bundled script (handles gh field drift and job-log fallbacks):
     - `python "<path-to-skill>/scripts/inspect_pr_checks.py" --repo "." --pr "<number-or-url>"`
     - Add `--json` for machine-friendly output.
   - Manual fallback:
     - `gh pr checks <pr> --json name,state,bucket,link,startedAt,completedAt,workflow`
       - If a field is rejected, rerun with the available fields reported by `gh`.
     - For each failing check, extract the run id from `detailsUrl` and run:
       - `gh run view <run_id> --json name,workflowName,conclusion,status,url,event,headBranch,headSha`
       - `gh run view <run_id> --log`
     - If the run log says it is still in progress, fetch job logs directly:
       - `gh api "/repos/<owner>/<repo>/actions/jobs/<job_id>/logs" > "<path>"`
4. Scope non-GitHub Actions checks.
   - If `detailsUrl` is not a GitHub Actions run, label it as external and report the URL only.
   - Do not attempt Buildkite or other providers; keep the workflow lean.
5. Summarize failures for the user.
   - Give the failing check name, the run URL (if any), and a concise log snippet.
   - Call out missing logs explicitly.
6. Create a plan.
   - Draft a concise plan inline and request approval before implementing.
7. Implement after approval.
   - Apply the approved plan, summarize diffs and tests, and ask about opening a PR.
8. Recheck status.
   - After changes, suggest re-running the relevant tests and `gh pr checks` to confirm.

## Bundled script

`scripts/inspect_pr_checks.py` handles gh field drift and job-log fallbacks. It exits non-zero when failures remain, so it can be used in automation. Pass `--json` for machine-friendly output and `--max-lines` / `--context` to widen the snippet.
