---
name: "yeknal-sentry"
description: "Use when the user asks to inspect Sentry issues or events, summarize recent production errors, or pull basic Sentry health data via the Sentry API; perform read-only queries with the bundled script and require `SENTRY_AUTH_TOKEN`."
metadata:
  internal: true
---

# Sentry (Read-only Observability)

## Quick start

- If authentication is not in place yet, ask the user for a valid `SENTRY_AUTH_TOKEN` with read-only scopes such as `project:read` and `event:read`, or have them log in and create one before you run anything.
- Export `SENTRY_AUTH_TOKEN` as an environment variable.
- Optional defaults: `SENTRY_ORG`, `SENTRY_PROJECT`, `SENTRY_BASE_URL`.
- Defaults: org/project `{your-org}`/`{your-project}`, time range `24h`, environment `prod`, limit 20 (max 50).
- Always query the Sentry API: no heuristics, no caching.

If the token is missing, give the user these steps:
1. Create a Sentry auth token at https://sentry.io/settings/account/api/auth-tokens/.
2. Grant it read-only scopes such as `project:read`, `event:read`, and `org:read`.
3. Export `SENTRY_AUTH_TOKEN` as an environment variable in their system.
4. Offer to walk them through setting the environment variable for their OS/shell if needed.
- Never ask the user to paste the full token in chat. Ask them to set it locally and confirm when they are ready.

## Core tasks (use bundled script)

Use `scripts/sentry_api.py` for deterministic API calls. It handles pagination and retries once on transient errors.

## Skill path (set once)

```bash
export CODEX_HOME="${CODEX_HOME:-$HOME/.codex}"
export SENTRY_API="$CODEX_HOME/skills/sentry/scripts/sentry_api.py"
```

User-scoped skills install under `$CODEX_HOME/skills` (default: `~/.codex/skills`).

### 1) List issues (ordered by most recent)

```bash
python3 "$SENTRY_API" \
  list-issues \
  --org {your-org} \
  --project {your-project} \
  --environment prod \
  --time-range 24h \
  --limit 20 \
  --query "is:unresolved"
```

### 2) Resolve an issue short ID to issue ID

```bash
python3 "$SENTRY_API" \
  list-issues \
  --org {your-org} \
  --project {your-project} \
  --query "ABC-123" \
  --limit 1
```

Feed the returned `id` into issue detail or events.

### 3) Issue detail

```bash
python3 "$SENTRY_API" \
  issue-detail \
  1234567890
```

### 4) Issue events

```bash
python3 "$SENTRY_API" \
  issue-events \
  1234567890 \
  --limit 20
```

### 5) Event detail (no stack traces by default)

```bash
python3 "$SENTRY_API" \
  event-detail \
  --org {your-org} \
  --project {your-project} \
  abcdef1234567890
```

## API requirements

Use only these endpoints, all GET:

- List issues: `/api/0/projects/{org_slug}/{project_slug}/issues/`
- Issue detail: `/api/0/issues/{issue_id}/`
- Events for issue: `/api/0/issues/{issue_id}/events/`
- Event detail: `/api/0/projects/{org_slug}/{project_slug}/events/{event_id}/`

## Inputs and defaults

- `org_slug`, `project_slug`: default to `{your-org}`/`{your-project}` (avoid non-prod orgs).
- `time_range`: default `24h` (sent as `statsPeriod`).
- `environment`: default `prod`.
- `limit`: default 20, max 50 (paginate until you reach the limit).
- `search_query`: the optional `query` parameter.
- `issue_short_id`: resolve it through a list-issues query first.

## Output formatting rules

- Issue list: title, short_id, status, first_seen, last_seen, count, environments, top_tags; ordered most recent first.
- Event detail: culprit, timestamp, environment, release, url.
- When there are no results, say so explicitly.
- Redact PII in output (emails, IPs). Never print raw stack traces.
- Never echo auth tokens.

## Golden test inputs

- Org: `{your-org}`
- Project: `{your-project}`
- Issue short ID: `{ABC-123}`

Example prompt: "List the top 10 open issues for prod in the last 24h."
Expected: an ordered list with titles, short IDs, counts, and last seen.
