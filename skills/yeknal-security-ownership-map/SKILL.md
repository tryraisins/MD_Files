---
name: "yeknal-security-ownership-map"
description: "Map sensitive-code ownership and bus-factor risk from Git history with Python 3 and networkx. Use only for explicit security ownership, orphaned-code, or CODEOWNERS risk analysis."
metadata:
  openai-plugins-reviewed-commit: 1e285826e604f66f7208f7ac4dba0fe8341d1f57
  last-reviewed: "2026-09-07"
---

# Security Ownership Map

Build a bipartite graph of people and files from git history, compute ownership risk, and export graph artifacts for Neo4j/Gephi. It also builds a file co-change graph (Jaccard similarity over shared commits) to cluster files by how they move together, ignoring large noisy commits.

This skill answers who owns sensitive code and where bus-factor risk sits. It does not judge whether that code is vulnerable; for an empirical audit of those paths, use `yeknal-security-audit`.

## Requirements

Python 3 and `networkx` (community detection is on by default):

```bash
pip install networkx
```

## Workflow

1. Scope the repo and time window (`--since` / `--until`).
2. Decide sensitivity rules. Include authentication, authorization, cryptography, secrets, CI/release workflows, policy-as-code, infrastructure, parsers, AI tool definitions, prompts, retrieval/memory pipelines, and approval gates when present.
3. Build the map with `<skill-dir>/scripts/run_ownership_map.py`. Co-change is on by default; `--cochange-max-files` ignores supernode commits, and `--graphml` adds GraphML output.
4. Query the outputs with `<skill-dir>/scripts/query_ownership.py` for bounded JSON slices.
5. Persist and visualize with `references/neo4j-import.md`.

```bash
python <skill-dir>/scripts/run_ownership_map.py \
  --repo . \
  --out ownership-map-out \
  --since "12 months ago" \
  --emit-commits
```

Defaults: author identity, author date, and merge commits excluded. Override with `--identity committer`, `--date-field committer`, or `--include-merges`. Common glue files (lockfiles, `.github/*`, editor config) and Dependabot commits are also excluded from co-change; override with `--cochange-exclude`, `--no-default-cochange-excludes`, `--author-exclude-regex`, or `--no-default-author-excludes`. Example: add `--cochange-exclude "**/Kbuild"` for Linux build glue.

## Sensitivity rules

By default the script flags common auth/crypto/secret paths. Override with a CSV passed to `--sensitive-config`:

```
# pattern,tag,weight
**/auth/**,auth,1.0
**/crypto/**,crypto,1.0
**/*.pem,secrets,1.0
```

## Querying

`query_ownership.py` returns small, JSON-bounded slices without loading the full graph into context. Its groups are `people`, `files`, `person`, `file`, `cochange`, `summary`, and `community`; use `--limit`, `--tag`, `--bus-factor-max`, `--sort`, or `--min-jaccard` to narrow a slice.

```bash
# Sensitive hotspots with low bus factor
python <skill-dir>/scripts/query_ownership.py --data-dir ownership-map-out summary --section bus_factor_hotspots

# Auth files with bus factor <= 1
python <skill-dir>/scripts/query_ownership.py --data-dir ownership-map-out files --tag auth --bus-factor-max 1

# Community maintainers over time for the community containing one file
python <skill-dir>/scripts/community_maintainers.py --data-dir ownership-map-out --file path/to/file --since 2025-01-01 --bucket quarter --top 5
```

Summary sections: `orphaned_sensitive_code` (stale and low bus factor), `hidden_owners`, `bus_factor_hotspots`.

Useful flags: `--touch-mode file` counts per-file touches instead of per commit; `--window-days 90` or `--weight recency --half-life-days 180` smooths churn; `--ignore-author-regex '(bot|dependabot)'` filters bots; `--min-share 0.1` shows stable maintainers only; `--community-top-owners 5` sets how many maintainers are stored per community.

### Summary format (default)

Use this structure and add fields if needed:

```json
{
  "orphaned_sensitive_code": [
    {
      "path": "crypto/tls/handshake.rs",
      "last_security_touch": "2023-03-12T18:10:04+00:00",
      "bus_factor": 1
    }
  ],
  "hidden_owners": [
    {
      "person": "alice@corp",
      "controls": "63% of auth code"
    }
  ]
}
```

## Output artifacts

`ownership-map-out/` contains:

- `people.csv` (nodes: people, with `primary_tz_offset`, `primary_tz_minutes`, `timezone_offsets`), `files.csv` (nodes: files), `edges.csv` (touches)
- `cochange_edges.csv` (Jaccard-weighted file edges; omitted with `--no-cochange`)
- `summary.json` (security ownership findings), `communities.json` (computed by default, with `maintainers` per community)
- `cochange.graph.json` (falls back to `ownership.graph.json` when there are no co-change edges) and optional `*.graphml`
- `commits.jsonl` (only with `--emit-commits`)

## Notes

- `bus_factor_hotspots` lists sensitive files with low bus factor; `orphaned_sensitive_code` is the stale subset.
- If `git log` is too large, narrow with `--since` or `--until`.
- Compare `summary.json` against CODEOWNERS to highlight ownership drift. CODEOWNERS is declared routing, not proof of review or expertise.
- Git history is incomplete when work was squashed, mirrored, generated, or performed outside the repository; label those limits.
- Minimize personal data in exported graphs. Use approved identity normalization and retention rules before sharing contributor emails, time zones, or employment inferences.
