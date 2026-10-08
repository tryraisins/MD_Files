# Project Handoff

Last updated: 2026-10-08
Branch: main
HEAD: post-release handoff update follows the `v2.3.4` release commit; see `git log -1`

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
- **2026-10-08**: applied original guidance inspired by Irene Pereyra's *Universal Principles of UX* to the shared baseline and UX designer skill. Catalog/profile counts remain unchanged. Local checks pass: both edited skills valid, parity preserved, catalog audit 0/0 across 89 skills, 1,053 relative links resolved, 28 routing cases valid, CLI tests 22/22.
- **2026-10-08 accessibility update**: synthesized the supplied *Accessible Design Reference & Specification Book* into shared behavior rules, one conditional accessibility reference, and UX research/handoff guidance. Added small native checks and aligned existing motion guidance with the shared removal/reduction/replacement policy. No new skills or profile changes.
- **2026-10-08 core profile expansion**: added `animate-expo`, `apple-design`, `emil-design-eng`, `find-animation-opportunities`, `improve-animations`, and `review-animations` to core. Core is now 37 skills; the design profile remains available for exact specialist installs. The task-time router still installs any other relevant missing specialist into a project. These defaults are included in published `yeknal@2.3.4`.
- Published `yeknal@2.3.4` and GitHub release `v2.3.4`; npm `latest` now reports 2.3.4 and the downloaded CLI profile reports core 37 with all six motion specialists.

## Current Task

Complete. `yeknal@2.3.4` is published with the 37-skill default core profile. The source changes and package release are on GitHub; npm registry and a fresh-cache `npx yeknal@latest profiles` check both confirm the updated default.

## Relevant Files

- `skills/yeknal-<base>/SKILL.md` - canonical skills.
- `skills/yeknal-break-ui/` - new skill (`SKILL.md`, `CATALOG.md`, `LICENSE.txt`).
- `skills/yeknal-ui-ux-designer/SKILL.md` - user-centered design and usability research guidance.
- `skills/yeknal-ui-quality-baseline/SKILL.md` - shared UI implementation and verification contract.
- `skills/yeknal-ui-quality-baseline/references/accessibility-design.md` - conditional text, input, media, announcement, and assistive-technology checks with primary sources.
- `skills/yeknal-mobile-app-design/SKILL.md` - platform accessibility semantics and native setting/navigation checks.
- Motion consistency changes: `yeknal-animate`, `yeknal-animate-expo`, `yeknal-apple-design`, `yeknal-find-animation-opportunities`, `yeknal-review-animations` and its standards, `yeknal-improve-animations` audit, and `yeknal-emil-design-eng` motion reference.
- `skills/yeknal-test-audit/SKILL.md` - test value audit and evidence-led cleanup workflow.
- `skills/yeknal-domain-modeling/SKILL.md` - opt-in glossary and ADR workflow.
- `skills/yeknal-review/SKILL.md` - independent standards/spec review axes.
- `skills/yeknal-troubleshoot/SKILL.md` - reproduction-led fast and deep diagnosis paths.
- `skills/yeknal-content-seo/SKILL.md` - SEO workflow, AI-search page check, and content safeguards.
- `skills.sh.json` - repo-page groupings (54 slugs).
- `yeknal-cli/profiles.json` - profiles; core 37 and optional process 7, including domain modeling.
- `PROVENANCE.md` - provenance/license ledger.
- `tools/skill-inventory.js`, `tools/parity.js`, `tools/rewrite-standard.md` - rewrite gate.
- `rewrite-parity/baselines/<skill>.json` - pre-rewrite capability inventories.
- `HANDOFF.md` (this file).

## Recent Changes

- 2026-10-08: kept shared accessibility behavior in the baseline, detailed checks in one reference, and participant/handoff decisions in the UX designer skill. Existing frontend and redesign integrations inherit the shared rules. Replaced conflicting motion statements that required animation under reduced motion; preserved platform examples and existing capabilities.
- 2026-10-08: moved six common motion specialists into core so default installs include `animate-expo`, `apple-design`, `emil-design-eng`, `find-animation-opportunities`, `improve-animations`, and `review-animations`. Updated profile counts and clarified that the router remains available for other task-specific skills.
- 2026-10-08: kept shared interaction rules in the baseline and research/decision guidance in the UX designer skill. Existing frontend, redesign, mobile, and motion integrations inherit the baseline without duplicated instructions or a new skill.
- 2026-10-03: added `yeknal-break-ui`; added mobile web platform layer to `yeknal-ui-quality-baseline`; refreshed README/PROVENANCE/llms/profiles/eval counts.
- 2026-10-07: added practical usability-testing steps to `yeknal-ui-ux-designer` and a status-based public launch sign-off to `yeknal-ui-quality-baseline`.
- 2026-10-07: added `ui-ux-designer` to the CLI core profile; updated the core count in repository and CLI documentation.
- 2026-10-07: added `test-audit` to the default CLI core; updated catalog/profile counts and prepared `yeknal@2.3.2`.
- 2026-10-07: updated `yeknal-review` and `yeknal-troubleshoot`; added public `yeknal-domain-modeling` to the optional process profile; published CLI patch release `2.3.3`.
- 2026-10-07: reviewed the supplied Opus/ChatSEO SEO workflow; added a conditional brand-information page check, article-derived safeguards, and Google AI Overview proof boundaries to `yeknal-content-seo`; pushed as `da69324`.

## Decisions and Reasoning

- The six requested motion specialists are now in core. The existing discovery-metadata ceiling was 8,000 characters; core now uses 9,642, so the explicit ceiling is 10,000 to retain a bounded profile while accommodating these workflows. If it grows further, reconsider profile membership instead of routinely raising the limit.
- Both books are reference inputs for independent synthesis, credited in `PROVENANCE.md`; no book text, PDF/EPUB, or illustrations are bundled. Existing feedback, recovery, and testing rules were extended only where the review found a gap. Book claims dismissing metrics or research were not adopted. Learning after launch is a handoff recommendation, not permission to install telemetry or start monitoring.
- Accessibility requirements use linked W3C guidance; spacing overrides are not authored defaults, the 44 CSS pixel touch policy is distinct from AA minimums, and reduced-motion preferences require an implemented response. Keep detailed guidance conditional and scoped to the affected UI; automated validation does not establish accessibility conformance in a downstream product.
- Parity gate: `fmKeys`, `backticks`, `links`, `thresholds`, `resources` strict; `headings` advisory. Backticked `x` and `yeknal-x` are equivalent.
- Keep `break-ui` in core (published) because it verifies the shared UI contract; fold `mobile-native` into the baseline instead of creating a near-duplicate skill, per the "avoid convolution" preference.
- `break-ui` is a distinct verification task, so it stays separate from redesign, taste, and motion skills; the mobile platform layer assigns to the CTA/state/typography/safe-area guidance already in the baseline.
- New `break-ui` was not parity-baselined (it has no pre-rewrite form); `tools/parity.js check-all` only checks skills with a baseline, so it is skipped cleanly.

## Failed Approaches / Do Not Repeat

- Local `skills-ref` needs `PYTHONUTF8=1` (Windows cp1252 decode errors otherwise).
- `audit-markdown-links.ps1` needs PowerShell 7 because `Path.GetRelativePath` fails on Windows PowerShell 5.1. Bundled `pwsh` is now available through `Get-Command pwsh`; use it locally.
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

1. The skills.sh listing previously lagged the 54 local public slugs; recheck after its next index refresh.

## Verification

- 2026-10-08 accessibility update: all 10 affected skills passed `skills-ref validate`; full parity check passed; catalog audit found 0 errors/warnings across 89 skills; all 1,054 relative links resolved; routing evaluations passed 28 cases; CLI tests passed 22/22; `git diff --check` passed. Reviewed ownership and removed conflicting reduced-motion wording. Unrelated reports regenerated by the full parity check were restored to their initial clean state. These checks validate catalog structure and packaging, not downstream accessibility or usability outcomes.
- 2026-10-08 core profile expansion: local CLI profile listing confirms 37 core skills and includes all six requested motion specialists; the router instructions confirm task-time additive fetching remains available for other relevant skills. `git diff --check` passed.
- 2026-10-08 `yeknal@2.3.4` release prep: `npm test` 22/22, `npm pack --dry-run` succeeded (package includes `profiles.json`, shasum `8f9b844fccd488b8eb4464af99ea35e4a0adb135`), all 89 skills validated, catalog audit 0 errors/0 warnings, 1,054 relative links resolved, routing evaluation 28 cases/0 errors, core metadata 9,642/10,000 characters, `git diff --check` passed. GitHub trusted publishing was not configured, so npm was published manually after the GitHub release.
- 2026-10-08 release verification: GitHub validation run `37848746577` succeeded; GitHub release workflow `37848847805` skipped because `NPM_TRUSTED_PUBLISHING_ENABLED` is unset; authenticated `npm publish` succeeded. `npm view` latest/version report 2.3.4; npm shasum `8f9b844fccd488b8eb4464af99ea35e4a0adb135` matches the local package; fresh-cache `npx yeknal@latest profiles` reports core 37 with all six requested skills.
- 2026-10-08 UX update: targeted `skills-ref validate` passed for both edited skills; full parity check passed; skill audit found 0 errors/warnings across 89 skills; all 1,053 relative Markdown links resolved; routing evaluations passed 28 cases; existing CLI tests passed 22/22; `git diff --check` passed. These are catalog/packaging checks, not a claim of improved usability measured in a downstream product.
- Local: previous design/CLI release validation passed at core 30 and catalog 87.
- 2026-10-07 design-skill update: skills-ref validate passed for all 87 skills; audit-skills 0 errors / 0 warnings; routing evals 26 cases / 0 errors; CLI tests 22/22; `git diff --check` passed.
- Post-push before the latest addition: skills.sh listed 53 published skills, including `yeknal-ui-quality-baseline` and `yeknal-ui-ux-designer`.
- Previous test-audit update: all 88 skills passed `skills-ref`; catalog audit reported 0 errors / 0 warnings; routing evaluations reported 26 cases / 0 errors; CLI tests passed 22/22; `yeknal@2.3.2` was published and verified.
- Previous review/domain-modeling update: all 89 skills passed `skills-ref`; catalog audit reported 0 errors / 0 warnings; routing evaluations reported 27 cases / 0 errors; CLI tests passed 22/22; `yeknal@2.3.3` was published and verified. The skills.sh page still showed 53 at last check; indexing refresh is pending.
- Previous SEO skill update: targeted `skills-ref validate` passed; catalog audit reports 0 errors / 0 warnings across 89 skills; routing evaluations report 28 cases / 0 errors; CLI tests pass 22/22; local skills.sh discovery lists 54 published skills; `git diff --check` passes. Commit `da69324` is pushed to `main`.
