---
name: "yeknal-sentry"
description: "Inspect Sentry issues or events, summarize recent production errors, and pull basic Sentry health data through the read-only API. Use when the user names Sentry or asks what is failing in production."
metadata:
  internal: true
---

# Sentry (read-only observability)

## Access

Ask the user for a `SENTRY_AUTH_TOKEN` with read-only scopes such as `project:read` and `event:read`, or have them create one at https://sentry.io/settings/account/api/auth-tokens/. Never ask them to paste the full token in chat: have them set it locally and confirm when it is ready.

- Set `SENTRY_AUTH_TOKEN` as an environment variable.
- Set `SENTRY_ORG` and `SENTRY_PROJECT`, or pass `--org` and `--project` explicitly. Ask for them rather than assuming.
- Optional: `SENTRY_BASE_URL` for self-hosted instances.
- Query the Sentry API on every run: no heuristics, no caching.

## Core tasks

Use `<path-to-skill>/scripts/sentry_api.py` for every call. It handles pagination and retries once on transient errors.

```bash
python <path-to-skill>/scripts/sentry_api.py list-issues --org <org> --project <project> --environment prod --time-range 24h --limit 20 --query "is:unresolved"
```

Use `python` on Windows and `python3` on macOS or Linux.

1. **List issues**, ordered most recent first, with the `--query` filter you need.
2. **Resolve a short ID** such as `ABC-123` to an issue ID with `list-issues --query "ABC-123" --limit 1`; feed the returned `id` into issue detail or events.
3. **Issue detail** with `issue-detail <issue_id>`.
4. **Issue events** with `issue-events <issue_id> --limit 20`.
5. **Event detail** with `event-detail --org <org> --project <project> <event_id>`.

## API requirements

Use only these GET endpoints:

- List issues: `/api/0/projects/{org_slug}/{project_slug}/issues/`
- Issue detail: `/api/0/issues/{issue_id}/`
- Events for issue: `/api/0/issues/{issue_id}/events/`
- Event detail: `/api/0/projects/{org_slug}/{project_slug}/events/{event_id}/`

## Output formatting rules

- Issue list: title, short_id, status, first_seen, last_seen, count, environments, top_tags; ordered most recent first.
- Event detail: culprit, timestamp, environment, release, url, and the stack frames that identify the failure.
- When there are no results, say so explicitly.
- Redact PII in output (emails, IPs), and never echo auth tokens.
