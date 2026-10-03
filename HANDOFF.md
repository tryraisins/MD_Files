# Project Handoff

Last updated: 2026-10-03
Branch: main
HEAD: e3a1561 (working tree has the uncommitted Route 1 migration)

## Current Objective

Publish the Yeknal skills catalog on skills.sh under unique `yeknal-*` slugs (Route 1: canonical `skills/yeknal-<base>/`), starting with 52 published skills and 34 hidden, then re-author all 86 skills as original, more efficient works with full upstream credit, preserving every current capability and reference.

## Current State

- Pre-flight passed: `skills-ref validate` accepts boolean `metadata.internal: true`, and the `skills` CLI hides `internal` skills by default (shows them with `INSTALL_SKILLS`/`INSTALL_INTERNAL_SKILLS=1`).
- All 86 skill folders moved `git mv <base>/` -> `skills/yeknal-<base>/`; each frontmatter `name:` rewritten to `yeknal-<base>`; 34 held-back skills tagged `metadata.internal: true`.
- Published set = `core` (28) ∪ `design` (24) = 52. Hidden = 34.
- All 86 validate with `skills-ref validate` (use `PYTHONUTF8=1` on Windows; local Python defaults to cp1252).
- `yeknal` CLI repointed: discovery/download now read `skills/yeknal-<base>/`; internal identifiers stay base-named so `--skills frontend-design`, `profiles.json`, and flags are unchanged. All 22 CLI tests pass.
- Docs normalized to `yeknal-*` names (README, AGENTS.md, SKILL_AUDIT.md, yeknal-cli/README.md backticks; llms.txt line prefixes; evaluations/skill-routing.json). Markdown link audit: 0 unresolved across 574 files.
- `skills.sh.json` created (4 groupings, all 52 slugs). README has the skills.sh badge + install section.

## Current Task

Phase A4 is essentially complete but uncommitted. Next: commit/push (user decision), then run the skills.sh duplicate probe (Phase B5), then the provenance/license audit (B6), then the capability-preserving rewrite program (C7-C10: pilot 3, then batch 83).

## Relevant Files

- `skills/yeknal-<base>/SKILL.md` - canonical skill locations (86).
- `yeknal-cli/bin/yeknal.js` - discovery/paths repointed to `skills/`; `SKILLS_DIR`, `toSkillBaseName`, `repoSkillPrefix`.
- `yeknal-cli/test/yeknal.test.js` - updated for `skills/` layout.
- `yeknal-cli/profiles.json` - unchanged (base names); published = core ∪ design.
- `.github/workflows/validate.yml` - validates `skills/*`; audit script paths under `skills/yeknal-markdown-management/scripts/`.
- `skills/yeknal-markdown-management/scripts/*.ps1` - `audit-skills` and `validate-routing-evals` now scan `skills/` (and accept base or `yeknal-` names).
- `skills.sh.json`, `README.md`, `AGENTS.md`, `SKILL_AUDIT.md`, `llms.txt`, `evaluations/skill-routing.json`.
- Migration/report artifacts live outside the repo: `C:\Users\nubiaville\Desktop\Projects 2026\yeknal-skills-mapping.json` (base -> prefixed -> hidden).

## Recent Changes

- Migrated all 86 skills into `skills/yeknal-<base>/`; prefixed names; tagged 34 internal.
- Repointed the yeknal CLI and its tests (22 pass).
- Updated CI, audit scripts, docs, dataset, and added `skills.sh.json` + README badge/section.

## Decisions and Reasoning

- Route 1 (canonical `skills/yeknal-*`) over a mirror: single source of truth, no permanent generator.
- R1a: all 86 under `skills/`; the 34 unpublished are hidden via `metadata.internal: true` (verified the CLI honors it).
- Source kept spec-valid: `name` must equal parent dir, so folders and `name:` moved together.
- yeknal keeps base-name identifiers internally; only path construction adds the prefix, so commands do not change.
- Full rewrite of all 86 for originality + efficiency is planned, with a per-skill capability-parity gate; pilot 3 first.

## Failed Approaches / Do Not Repeat

- Do not validate locally without `PYTHONUTF8=1`; Windows Python cp1252 decoding raises false `UnicodeDecodeError` on UTF-8 SKILL.md files.
- Do not run `skills-ref validate` over 86 skills in one interactive shell without a raised timeout (Python startup makes it ~2 min).
- `pwsh` (PowerShell 7) is not installed locally; `audit-markdown-links.ps1` uses `[IO.Path]::GetRelativePath` (.NET Core), so it cannot run under Windows PowerShell 5.1. CI runs it on ubuntu-latest.

## Known Issues

- Nothing is committed yet; the entire migration is in the working tree.
- The skills.sh duplicate probe cannot run until the repo is pushed (needs GitHub telemetry).
- Skill bodies still reference sibling skills by base names; intentional for now, fixed during the C rewrite.
- `skills.sh.json` groups the 52 published slugs; if skills.sh's repo crawl ignores `metadata.internal`, the 34 hidden skills could still surface (fallback: move them to a non-discovered `catalog/` dir, R1b).

## Important Constraints

- `npx yeknal skills`, `--profile`, `--skills`, `--project`, `--add`, `--skip-claude`, `--all`, and `profiles` must keep working with base names.
- Every skill must keep `name` == folder and pass `skills-ref validate`.
- No capability or reference may be lost in the rewrite; the parity report is the gate.
- Preserve upstream copyright/license notices; add credit in README + npm README + per-skill NOTICE.

## Commands and Tests

```powershell
# validate all skills (Windows: force UTF-8)
$env:PYTHONUTF8="1"; Get-ChildItem .\skills -Directory | ForEach-Object { skills-ref validate $_.FullName }
# repo audits (PowerShell 7)
./skills/yeknal-markdown-management/scripts/audit-skills.ps1 -Root .
./skills/yeknal-markdown-management/scripts/audit-markdown-links.ps1 -Root .
./skills/yeknal-markdown-management/scripts/validate-routing-evals.ps1 -Root .
# CLI
npm test --prefix .\yeknal-cli
# skills.sh discovery (local source)
npx skills add . --list
```

Current results: 86/86 skills valid; audit-skills 0 errors/0 warnings; markdown links 0 unresolved; routing evals 0 errors; 22/22 CLI tests pass.

## Next Actions

1. Commit the migration (needs explicit user approval) and push to `main`.
2. B5: probe skills.sh (install one adapted + one original skill, read `isDuplicate`) to calibrate rewrite depth.
3. B6: provenance + license audit across 86.
4. C7: rewrite standard + capability-inventory script + `rewrite-parity/<skill>.md` gate.
5. C8: pilot `yeknal-skill-router`, `yeknal-frontend-design`, `yeknal-security-threat-model`.
6. C9/C10: batch the remaining 83; add README/npm credits and per-skill NOTICE.

## Verification

- Local: all 86 valid, audits clean, 22 CLI tests pass, link audit clean, `npx skills add . --list` returns the published set.
- Pending: remote `npx skills add tryraisins/MD_Files --list` after push; skills.sh repo page + duplicate status; parity reports; credits present.
