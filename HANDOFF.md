# Project Handoff

Last updated: 2026-10-07
Branch: main
HEAD: da69324 (SEO AI-search guidance update)

## Current Objective

Maintain the published Yeknal catalog on skills.sh under unique `yeknal-*` slugs. Both the Route 1 migration and the all-86 rewrite are complete; current work is selective upstream refresh and ongoing catalog maintenance.

## Current State

- Phase A complete and pushed (`3036a3f`): all skills under `skills/yeknal-<base>/`, frontmatter names prefixed, non-published skills `metadata.internal: true`.
- Skills.sh repo page lists published slugs with no duplicate/fork markers.
- All-86 rewrite complete and gated by `tools/parity.js` (per-skill PASS) and `skills-ref validate`.
- C10 complete: MIT notices plus `metadata.source`/`source-commit` on MIT derivatives; Credits in README and npm README; `PROVENANCE.md` updated.
- **2026-10-03 Emil refresh**: reviewed `emilkowalski/skills` at `e8a175de22ae1e49370fc144c1f3bb9aeedf988d`. Catalog already carried 12/14. Added `yeknal-break-ui` (new core skill, adapted with bundled `CATALOG.md` + MIT `LICENSE.txt`); folded `mobile-native` into `yeknal-ui-quality-baseline` as the mobile web platform layer (no new skill). Registered in `skills.sh.json`, `profiles.json` core, `llms.txt`, `PROVENANCE.md`, `README.md`, and two new routing eval cases. Counts now core 29, design 24, published 53, catalog 87.
- **2026-10-07**: added `yeknal-ui-ux-designer` to the CLI's default `core` profile. Core now has 30 skills; both it and `yeknal-ui-quality-baseline` are included by default.
- Published CLI patch release `2.3.1`; verified npm's latest tag and the downloaded CLI profile output.
- **2026-10-07**: added internal `yeknal-test-audit`, linked it from `yeknal-testing-strategy`, and included it in the default CLI core. Core now has 31 skills; catalog has 88.
- Published CLI patch release `2.3.2`; verified the latest npm tag and downloaded CLI profile output includes `test-audit` in core.
- **2026-10-07**: strengthened standards/spec reviews and deep-diagnosis guidance; added public `yeknal-domain-modeling` to the optional `process` profile. Core remains 31; process is 7; catalog is 89 with 54 published.
- Published `yeknal@2.3.3`; verified the latest npm version and downloaded CLI profile output includes `domain-modeling` in `process`.
- **2026-10-07**: added a conditional, evidence-bound AI-readable brand page check and SEO content-safety guidance to `yeknal-content-seo`; updated routing coverage.
- Pushed SEO skill update in `da69324`; Google AI Overview guidance is explicitly non-guaranteed and the new brand page is conditional on a documented gap.
- Local gates all green after the refresh: skills-ref valid, audit-skills 0/0 at 87 skills, 0 unresolved links, routing evals 26 cases 0 errors, CLI tests 22/22.

## Current Task

Complete. Updated and pushed `yeknal-content-seo` with an evidence-bound conditional AI-readable brand-page check and safeguards based on the supplied SEO article.

## Relevant Files

- `skills/yeknal-<base>/SKILL.md` - canonical skills.
- `skills/yeknal-break-ui/` - new skill (`SKILL.md`, `CATALOG.md`, `LICENSE.txt`).
- `skills/yeknal-ui-ux-designer/SKILL.md` - user-centered design and usability research guidance.
- `skills/yeknal-ui-quality-baseline/SKILL.md` - shared UI implementation and verification contract.
- `skills/yeknal-test-audit/SKILL.md` - test value audit and evidence-led cleanup workflow.
- `skills/yeknal-domain-modeling/SKILL.md` - opt-in glossary and ADR workflow.
- `skills/yeknal-review/SKILL.md` - independent standards/spec review axes.
- `skills/yeknal-troubleshoot/SKILL.md` - reproduction-led fast and deep diagnosis paths.
- `skills/yeknal-content-seo/SKILL.md` - SEO workflow, AI-search page check, and content safeguards.
- `skills.sh.json` - repo-page groupings (54 slugs).
- `yeknal-cli/profiles.json` - profiles; core 31 and optional process 7, including domain modeling.
- `PROVENANCE.md` - provenance/license ledger.
- `tools/skill-inventory.js`, `tools/parity.js`, `tools/rewrite-standard.md` - rewrite gate.
- `rewrite-parity/baselines/<skill>.json` - pre-rewrite capability inventories.
- `HANDOFF.md` (this file).

## Recent Changes

- 2026-10-03: added `yeknal-break-ui`; added mobile web platform layer to `yeknal-ui-quality-baseline`; refreshed README/PROVENANCE/llms/profiles/eval counts.
- 2026-10-07: added practical usability-testing steps to `yeknal-ui-ux-designer` and a status-based public launch sign-off to `yeknal-ui-quality-baseline`.
- 2026-10-07: added `ui-ux-designer` to the CLI core profile; updated the core count in repository and CLI documentation.
- 2026-10-07: added `test-audit` to the default CLI core; updated catalog/profile counts and prepared `yeknal@2.3.2`.
- 2026-10-07: updated `yeknal-review` and `yeknal-troubleshoot`; added public `yeknal-domain-modeling` to the optional process profile; published CLI patch release `2.3.3`.
- 2026-10-07: reviewed the supplied Opus/ChatSEO SEO workflow; added a conditional brand-information page check, article-derived safeguards, and Google AI Overview proof boundaries to `yeknal-content-seo`; pushed as `da69324`.

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

Previous verified results: 87/87 valid; audit-skills 0/0; links 0 unresolved; routing evals 26 cases/0 errors; CLI tests 22/22; catalog 87, core 29, design 24, published 53.

## Next Actions

1. Recheck the skills.sh listing after its index refresh; the local catalog now contains 54 public slugs.
2. Optional: create a Vercel-authed Pack for a one-command core install.

## Verification

- Local: previous design/CLI release validation passed at core 30 and catalog 87.
- 2026-10-07 design-skill update: skills-ref validate passed for all 87 skills; audit-skills 0 errors / 0 warnings; routing evals 26 cases / 0 errors; CLI tests 22/22; `git diff --check` passed.
- Post-push before the latest addition: skills.sh listed 53 published skills, including `yeknal-ui-quality-baseline` and `yeknal-ui-ux-designer`.
- Previous test-audit update: all 88 skills passed `skills-ref`; catalog audit reported 0 errors / 0 warnings; routing evaluations reported 26 cases / 0 errors; CLI tests passed 22/22; `yeknal@2.3.2` was published and verified.
- Previous review/domain-modeling update: all 89 skills passed `skills-ref`; catalog audit reported 0 errors / 0 warnings; routing evaluations reported 27 cases / 0 errors; CLI tests passed 22/22; `yeknal@2.3.3` was published and verified. The skills.sh page still showed 53 at last check; indexing refresh is pending.
- Current SEO skill update: targeted `skills-ref validate` passed; catalog audit reports 0 errors / 0 warnings across 89 skills; routing evaluations report 28 cases / 0 errors; CLI tests pass 22/22; local skills.sh discovery lists 54 published skills; `git diff --check` passes. Commit `da69324` is pushed to `main`.
