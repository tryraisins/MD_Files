# Project Handoff

Last updated: 2026-10-03
Branch: main
HEAD: 3036a3f (Route 1 migration pushed; working tree holds B6/C7/C8 pilot changes, uncommitted)

## Current Objective

Publish the Yeknal catalog on skills.sh under unique `yeknal-*` slugs (Route 1), then re-author all 86 skills as original, more efficient works with full upstream credit, preserving every capability and reference.

## Current State

- Phase A complete and pushed (`3036a3f`): all 86 skills under `skills/yeknal-<base>/`, frontmatter names prefixed, 34 held-back skills `metadata.internal: true`, published set = core ∪ design = 52. `skills-ref validate` 86/86; CLI tests 22/22; `npx skills add tryraisins/MD_Files --list` finds exactly 52 with zero non-prefixed.
- skills.sh probe (B5): repo page `https://www.skills.sh/tryraisins/md_files` exists and lists installed skills; snapshot endpoint returns `yeknal-frontend-design` files; **no duplicate/fork markers** on the adapted skill. Search index for `tryraisins` still lags (count 0), consistent with known ingestion lag (vercel-labs/skills issue #1242).
- B6 provenance audit complete: `PROVENANCE.md` records explicit sources, bundled notices, the MIT derivative set missing notices (leonxlnx/taste-skill, emilkowalski, ibelick/ui-skills), and Rare UI attribution.
- C7 rewrite tooling complete: `tools/skill-inventory.js`, `tools/parity.js` (capture/check/check-all), `tools/rewrite-standard.md`; 86 baselines captured in `rewrite-parity/baselines/`.
- C8 pilot complete: `yeknal-skill-router`, `yeknal-frontend-design`, `yeknal-security-threat-model` rewritten; all pass `tools/parity.js` and `skills-ref validate`; `audit-skills.ps1` 0 errors/0 warnings; link audit 0 unresolved.
- Side task: all 52 published skills installed via telemetry to fill the repo page (page listing still cached at time of writing).
- C9 complete: all 86 skills rewritten (length-neutral, originality/clarity), each `tools/parity.js` PASS and `skills-ref validate` OK.
- C10 complete: MIT notices plus `metadata.source`/`source-commit` added to the 14 confirmed MIT derivatives; Credits sections added to README and npm README; `PROVENANCE.md` updated.
- Phase D local gates all green: skills-ref 86/86, parity no fails, audit-skills 0/0, links 0, routing evals 0, CLI tests 22/22, `npx skills add . --list` = 52.

## Current Task

Finalize: Phase D local verification is green; re-check the skills.sh repo page and search index once ingestion catches up.

## Relevant Files

- `skills/yeknal-<base>/SKILL.md` - canonical skills.
- `skills.sh.json` - repo-page groupings (52 slugs).
- `PROVENANCE.md` - provenance/license ledger.
- `tools/skill-inventory.js`, `tools/parity.js`, `tools/rewrite-standard.md` - rewrite gate.
- `rewrite-parity/baselines/<skill>.json` - pre-rewrite capability inventories (86).
- `rewrite-parity/<skill>.md` - parity reports.
- `yeknal-cli/bin/yeknal.js`, `yeknal-cli/test/yeknal.test.js`, `.github/workflows/validate.yml` - repointed for `skills/`.
- `HANDOFF.md` (this file).

## Recent Changes

- Added `tools/` parity tooling and captured baselines.
- Rewrote the 3 pilot skills; added `PROVENANCE.md`.
- Installed all 52 published skills (telemetry) as an optional repo-page fill.

## Decisions and Reasoning

- Parity gate: `fmKeys`, `backticks`, `links`, `thresholds`, `resources` are strict; `headings` are advisory (labels, not capabilities). Backticked tokens treat `x` and `yeknal-x` as equivalent because C normalizes sibling references.
- Upstreams are MIT/Apache-2.0 (notice-required, permissive); Rare UI is the only non-permissive case (attribution + Commons Clause), and its source is not vendored.
- Keep `metadata.internal` to hold back the 34 unpublished skills.

## Failed Approaches / Do Not Repeat

- Local `skills-ref` needs `PYTHONUTF8=1` (Windows cp1252 decode errors otherwise).
- `pwsh` is absent locally; `audit-markdown-links.ps1` needs PowerShell 7 (use the temp Node link checker locally; CI uses pwsh).
- Do not include `<skill-name>` only inside a code fence; the parity inventory captures backticked tokens, so keep referenced placeholders backticked.

## Known Issues

- skills.sh search index has not ingested `tryraisins` yet; `isDuplicate` cannot be fully confirmed until it does.
- The repo page listing is cached and may lag new installs.
- Pilot rewrites are similar length to originals; deeper efficiency trimming is a batch-time decision.

## Important Constraints

- No capability/reference loss: `tools/parity.js check-all` must pass.
- `name` == folder; `skills-ref validate` must pass.
- Preserve upstream notices; add the missing MIT notices (C10).
- `npx yeknal` commands, profiles, and flags unchanged.

## Commands and Tests

```powershell
$env:PYTHONUTF8="1"; Get-ChildItem .\skills -Directory | ForEach-Object { skills-ref validate $_.FullName }
node tools/parity.js check-all
./skills/yeknal-markdown-management/scripts/audit-skills.ps1 -Root .
./skills/yeknal-markdown-management/scripts/audit-markdown-links.ps1 -Root .
./skills/yeknal-markdown-management/scripts/validate-routing-evals.ps1 -Root .
npm test --prefix .\yeknal-cli
npx skills add . --list
```

Current results: 86/86 valid; parity PASS for the 3 pilots; audit-skills 0/0; links 0 unresolved; routing evals 0 errors; CLI tests 22/22; `skills add --list` = 52.

## Next Actions

1. Re-check the skills.sh repo page and search index; confirm no `isDuplicate` once indexed.
2. Optional: create a Vercel-authed Pack for one-command core install.
2. C10: add MIT notices + `metadata.source` for the derivatives in `PROVENANCE.md`; add README + npm README Credits sections.
3. Commit the B6/C7/C8 batch (needs approval).
4. Re-check skills.sh repo page + search index; confirm no `isDuplicate` once indexed.

## Verification

- Local: parity PASS (3 pilots), skills-ref 86/86, audit-skills 0/0, links 0, routing 0, CLI 22/22, `skills add --list` 52.
- Pending: batch parity reports; credits present; skills.sh search/duplicate confirmation.
