# Project Handoff

Last updated: 2026-10-03
Branch: main
HEAD: 0022f1e (all phases complete; working tree clean)

## Current Objective

Maintain the published Yeknal catalog on skills.sh under unique `yeknal-*` slugs. Both the Route 1 migration and the all-86 rewrite are complete; current work is selective upstream refresh and ongoing catalog maintenance.

## Current State

- Phase A complete and pushed (`3036a3f`): all skills under `skills/yeknal-<base>/`, frontmatter names prefixed, non-published skills `metadata.internal: true`.
- Skills.sh repo page lists published slugs with no duplicate/fork markers.
- All-86 rewrite complete and gated by `tools/parity.js` (per-skill PASS) and `skills-ref validate`.
- C10 complete: MIT notices plus `metadata.source`/`source-commit` on MIT derivatives; Credits in README and npm README; `PROVENANCE.md` updated.
- **2026-10-03 Emil refresh**: reviewed `emilkowalski/skills` at `e8a175de22ae1e49370fc144c1f3bb9aeedf988d`. Catalog already carried 12/14. Added `yeknal-break-ui` (new core skill, adapted with bundled `CATALOG.md` + MIT `LICENSE.txt`); folded `mobile-native` into `yeknal-ui-quality-baseline` as the mobile web platform layer (no new skill). Registered in `skills.sh.json`, `profiles.json` core, `llms.txt`, `PROVENANCE.md`, `README.md`, and two new routing eval cases. Counts now core 29, design 24, published 53, catalog 87.
- Local gates all green after the refresh: skills-ref valid, audit-skills 0/0 at 87 skills, 0 unresolved links, routing evals 26 cases 0 errors, CLI tests 22/22.

## Current Task

Complete and verified. The 2026-10-03 Emil refresh is done; commit is pending owner approval.

## Relevant Files

- `skills/yeknal-<base>/SKILL.md` - canonical skills.
- `skills/yeknal-break-ui/` - new skill (`SKILL.md`, `CATALOG.md`, `LICENSE.txt`).
- `skills.sh.json` - repo-page groupings (53 slugs).
- `yeknal-cli/profiles.json` - profiles; core now 29.
- `PROVENANCE.md` - provenance/license ledger.
- `tools/skill-inventory.js`, `tools/parity.js`, `tools/rewrite-standard.md` - rewrite gate.
- `rewrite-parity/baselines/<skill>.json` - pre-rewrite capability inventories.
- `HANDOFF.md` (this file).

## Recent Changes

- 2026-10-03: added `yeknal-break-ui`; added mobile web platform layer to `yeknal-ui-quality-baseline`; refreshed README/PROVENANCE/llms/profiles/eval counts.

## Decisions and Reasoning

- Parity gate: `fmKeys`, `backticks`, `links`, `thresholds`, `resources` strict; `headings` advisory. Backticked `x` and `yeknal-x` are equivalent.
- Keep `break-ui` in core (published) because it verifies the shared UI contract; fold `mobile-native` into the baseline instead of creating a near-duplicate skill, per the "avoid convolution" preference.
- `break-ui` is a distinct verification task, so it stays separate from redesign, taste, and motion skills; the mobile platform layer assigns to the CTA/state/typography/safe-area guidance already in the baseline.
- New `break-ui` was not parity-baselined (it has no pre-rewrite form); `tools/parity.js check-all` only checks skills with a baseline, so it is skipped cleanly.

## Failed Approaches / Do Not Repeat

- Local `skills-ref` needs `PYTHONUTF8=1` (Windows cp1252 decode errors otherwise).
- `pwsh` is absent locally; `audit-markdown-links.ps1` needs PowerShell 7 (its `Path.GetRelativePath` call fails on Windows PowerShell 5.1). Use the temp Node/inline link checker locally; CI uses pwsh.
- `audit-skills.ps1` runs under Windows PowerShell 5.1 fine.
- Do not include `<skill-name>` only inside a code fence; the parity inventory captures backticked tokens.

## Known Issues

- skills.sh search index and repo-page listing can lag new installs/pushes.
- `break-ui` has no parity baseline by design (new skill).

## Important Constraints

- No capability/reference loss for baselined skills: `tools/parity.js check-all` must pass.
- `name` == folder; `skills-ref validate` must pass.
- Preserve upstream notices; new MIT derivatives bundle a notice plus `metadata.source`/`source-commit`.
- `npx yeknal` commands, profiles, and flags unchanged.

## Commands and Tests

```powershell
$env:PYTHONUTF8="1"; Get-ChildItem .\skills -Directory | ForEach-Object { skills-ref validate $_.FullName }
powershell -NoProfile -File .\skills\yeknal-markdown-management\scripts\audit-skills.ps1 -Root .
powershell -NoProfile -File .\skills\yeknal-markdown-management\scripts\validate-routing-evals.ps1 -Root .
npm test --prefix .\yeknal-cli
npx skills add . --list
```

Current results: 87/87 valid; audit-skills 0/0; links 0 unresolved; routing evals 26 cases/0 errors; CLI tests 22/22; catalog 87, core 29, design 24, published 53.

## Next Actions

1. Commit the 2026-10-03 Emil refresh (needs approval).
2. Optional: confirm the skills.sh repo page/search index reflects 53 slugs after push.
3. Optional: create a Vercel-authed Pack for a one-command core install.

## Verification

- Local: skills-ref valid (incl. break-ui), audit-skills 0/0 at 87, links 0, routing 26/0, CLI 22/22, counts aligned (core 29, design 24, all 87, published 53).
- Pending: post-push skills.sh listing; owner commit approval.
