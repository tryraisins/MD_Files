# Project Handoff

Last updated: 2026-10-23
Branch: main
HEAD: see git log; released source edf3ec6, catalog/tag e769323

## Verification harness pair (2026-10-23)

Two skills added from Lauren Tan's pstack (`cursor/plugins` at `4ec7ffa`): `yeknal-verification-harness` (generates a project-local launch/doctor/drive/evidence/cleanup skill plus a feature map) and `yeknal-verification-audit` (the upkeep pass: source wave per feature, one live session, at most one set of proven corrections). Catalog 91 to 93.

Decisions with the user: pair 1 only. The formal-verification pair (`create-formal-verification-skill` and `maintain-formal-verification-skill`, TLA+/model checkers) was reviewed and deliberately left out because it only pays off where concurrency, parsers, or invariants exceed what tests reach, and would rot across a design-and-product catalog.

Two upstream behaviors were changed during the port. The hardcoded `.cursor/skills/verify-<app>/` path became the project's own skill directory with `.agents/skills/` as the neutral fallback, because this catalog targets Codex, Claude, opencode, and Cursor. `disable-model-invocation: true` became "Use only when the user explicitly asks" in the description, because `tools/rewrite-standard.md` rejects unknown top-level frontmatter fields. `/create-verification-skill` and `/maintain-verification-skill` references became the two `yeknal-` skill names. The three upstream `references/feature-map-example/` files were carried over unchanged.

Registration: both skills are in the `process` profile, not core, because core sat 303 characters under the 10,000-character discovery budget in `yeknal-cli/test/yeknal.test.js`. Also updated `skills.sh.json` (Verification group), `site/presentation.json` (task `review`; harness also `build`), `PROVENANCE.md`, `README.md` (process 7 to 9, all 91 to 93, upstream review paragraph, credits), `llms.txt`, and two `evaluations/skill-routing.json` cases (33 to 35).

Verification: `skills-ref validate` passes both skills. `audit-skills.ps1`, routing evals, the CLI suite (50/50 including the profile-coverage and core-budget tests), `node tools/build-catalog.js --check`, and the portfolio `assemble` run all passed on this commit from a clean worktree. Relative links resolve and `git diff --check` is clean.

Boundaries: `npx yeknal skills --skills verification-harness,verification-audit` needs a push, because manual installs read the public GitHub tree. `audit-markdown-links.ps1` cannot run here: it needs PowerShell 7 for `Path.GetRelativePath` and only 5.1 is installed. Release order unchanged: commit the source, run `node tools/build-catalog.js`, commit the catalog, push, then `--validate` and CI, then sync the portfolio.

## Content SEO skill rewrite (2026-10-23)

`yeknal-content-seo` now carries procedures, not only guardrails. The trigger was an AI-SEO course that supplied the missing operational layer. `SKILL.md` grew from 81 to 104 lines: four new workflow steps (intent from observed results, winnability at current authority, a named differentiator, a distribution path before publishing), a reference-routing table, an extended AI-search section (search-backed vs training answers, fan-out queries, the self-ranking discount, logged-out sampling), a diff-gate step before replacing pages, and new rules against fabricated metrics, multi-page intent splits, and publishing without a differentiator.

Seven references were added under `skills/yeknal-content-seo/references/`: `keyword-intent-and-patterns.md`, `page-decisions-and-briefs.md`, `publishing-and-change-control.md` (diff gate, approval tiers, code veto on deletion, rejection log), `content-maintenance.md` (prune, repoint, regroup; ranking vs CTR diagnosis), `local-search.md`, `authority-and-links.md` (earned links only, paid-link diagnostics, AI citation prospecting), and `technical-audit.md`. The last one absorbs the valid material from the retired universal SEO prompt and corrects its stale advice: keyword density, fixed word minimums, `rel="next/prev"`, FID, the retired Mobile-Friendly Test, "required" schema types, FAQ schema as a rich-result play, and fixed character counts.

Deliberately not adopted from the source article: buying links, reciprocal ranking swaps, self-ranking first in own listicles, fixed cadences and link counts, and unverifiable mechanism claims. The skill now forbids each of these explicitly.

The legacy `SEO/seo-improvement-prompt.md` was replaced with a superseded pointer (source text is in git history). The same prompt was installed in three user-level folders; all three were disabled by renaming to `SKILL.md.disabled`, with a `README.md` pointer and a backup at `%LOCALAPPDATA%\Temp\opencode\seo-legacy-backup-20261023`: `~/.agents/skills/seo`, `~/.codex/skills/seo`, `~/.claude/skills/SEO`. The upgraded skill was copied to `~/.agents/skills/yeknal-content-seo`, `~/.codex/skills/yeknal-content-seo`, and `~/.claude/skills/yeknal-content-seo`; those copies are snapshots and must be refreshed after the next published release.

Verification: `audit-skills.ps1` 0 errors and 0 warnings across 91 skills; `parity check yeknal-content-seo` PASS; routing evals 33 cases and 0 errors; `verify-public-discovery.js` passed; 22 relative links in the skill folder resolve (checked with a one-off Node scan). `audit-markdown-links.ps1` could not run because it needs PowerShell 7 and only Windows PowerShell 5.1 is installed; `skills-ref validate` is CI-only. `sync-portfolio.js --validate` cannot pass before a commit by design: it compares the working tree to the catalog's pinned revision.

Released 2026-10-23. Commits: `565e10b` (skill, references, evals, presentation, legacy pointer) and `c2cf16a` (catalog regenerated at `565e10b`); validation run 40034862361 passed. The portfolio sync wrote `src/data/skills-catalog.json` at `565e10b` (91 skills, 35 internal) and was committed there as `6190564`; deploy run 40035586715 succeeded. Live checks: `/skills/` lists 91 entries including Content and SEO, `/skills/content-seo/files.json` includes the new references, and the detail page carries the new purpose. `sync-portfolio.js --validate` cannot pass before a commit by design: it compares the working tree to the catalog's pinned source revision, which is the commit that contains the skills.

## End-to-end-only testing policy (2026-10-23)

`yeknal-testing-strategy` no longer merely prefers E2E. It bans writing, scaffolding, or generating unit tests, and requires behavior to be proven through the real entry point (browser, CLI, HTTP request against the running server, or the built feature observed end to end). Running a repository's existing unit suite stays allowed and its failures must be reported, but cases must not be added to it. If E2E cannot reach a boundary, the boundary is named and the user is asked before any isolated test is written. The user chose "ban writing, allow running existing" over a total ban, because most repositories route their existing unit suite through the normal test command and CI. The frontmatter description changed so the skill triggers when an agent is about to write or run tests.

Every place that restated the old "write it before the code" rule was aligned so nothing contradicts the skill: `yeknal-implement` step 5, `yeknal-playwright`, the `yeknal-notion-spec-to-implementation` task reference, the `yeknal-aspnet-core` testing reference, repository `AGENTS.md`, and the global `C:\Users\nubiaville\.config\opencode\AGENTS.md` section 14 plus the `claude_tests` and `go-tests` lane text in section 22. `site/presentation.json` purpose, when-to-use, and example were updated in step. No skill was added, renamed, or removed, so `previousNames` and the groupings are untouched.

The unit-test mentions under `yeknal-cloudflare-deploy/references/` are framework documentation for `getPlatformProxy` and Vitest, not agent policy. Leave them alone.

Verification: skill audit reports 0 errors and 0 warnings for every changed skill; the remaining `yeknal-content-seo` broken-link errors belong to the user's in-progress content-seo edits, which were left untouched. Routing evaluations 29/0. `git diff --check` clean, `site/presentation.json` parses. Not run: `audit-markdown-links.ps1` (needs PowerShell 7, this machine has 5.1), `skills-ref` (installed only in CI), and `node tools/build-catalog.js` plus `sync-portfolio.js --validate` (both build from committed trees). Release order is unchanged: commit the source, run the catalog build, commit the catalog.

## Launch readiness skill (2026-10-23)

New skill `skills/yeknal-launch-readiness` with five references: `obligations.md` (Register A by surface), `jurisdictions.md` (NG, EU/EEA, UK, US federal, US California), `launch-gates.md` (Register B), `evidence-and-fixes.md` (detection recipes and what source cannot prove), `report-template.md`.

The work started from a pre-launch compliance checklist and a twenty-item pre-launch prompt. Two decisions were settled with the user: one skill rather than a legal skill plus an engineering skill, because both fire on the same trigger and produce one artifact; and a jurisdiction-neutral matrix with Nigeria leading, because the NDPA follows the data subject and the GAID filing cycle applies to small teams.

Register B covers the seven gates no existing skill owned: database access rules, a tested restore, a performance budget on a mid-tier phone, email deliverability, cost containment with a per-user quota, rollback including migration reversibility, and consent-gated analytics. Thirteen further checks are cross-referenced to `application-security`, `sentry`, `ui-quality-baseline`, `content-seo`, the deployment skills, and the testing skills, and are deliberately not restated.

Registration: `web` profile 5 to 6, `platform` 7 to 8, core unchanged at 37, catalog 91. Also updated `site/presentation.json`, `PROVENANCE.md` originals list, `SKILL_AUDIT.md` (new decision section), `README.md` counts plus a Launch readiness group, and the folder count in `yeknal-cli/README.md`.

Verification: skill audit 91 skills, 0 errors, 0 warnings. CLI suite 50/50 including the profile validity and core-budget test. `node yeknal-cli/bin/yeknal.js profiles` lists `launch-readiness` under `web` and `platform`. Presentation entry parses, its task ids are valid, its key set matches an existing entry, and every `related` target exists. Repository-wide relative links 1,071 checked, 0 broken, using a Node walk because `audit-markdown-links.ps1` needs PowerShell 7 (`Path.GetRelativePath`) and this machine has only 5.1. `git diff --check` clean.

Two rows inside the skill are flagged `verify` on purpose rather than asserted: the GAID DCPMI tier thresholds, and the specific CBN instrument governing recurring card mandates. Keep that treatment.

Pre-commit boundary, not a defect. `tools/build-catalog.js` builds from the committed tree by design, so `--check` still passes and `tools/sync-portfolio.js --validate` fails with two expected errors: catalog behind the working tree, and the presentation entry having no catalog match yet. Release order is unchanged: commit the source, run `node tools/build-catalog.js`, commit the catalog, push, then `--validate` and CI.

Not built: a scanner. `references/evidence-and-fixes.md` records the measured subset so a later `npx yeknal` scan has a specification instead of a guess.

## Slop scan command (2026-10-23)

`npx yeknal slopscan` is a new command. It scans a local codebase for AI-slop indicators, writes `yeknal-slopscan.log` and `yeknal-slopscan.json`, and names the checks it cannot perform without a rendered page. It is local only: no network request, no browser, no dependency, and no skill syncing (unlike `security`, which downloads and syncs).

Design decisions, all settled in review with the user:

- **No score.** SlopLens scores one rendered page. A repository is not a page, and a repo-wide number is driven by size, so the report gives counts instead. `--fail-on N|any` gates on the count of primary findings.
- **Exit 0 by default**, `1` when `--fail-on` is met, `2` for a usage or input error.
- **The catalog is hand-curated, not generated.** `yeknal-cli/lib/slop-rules.json` carries provenance (`sloplens-3.2.0` at `7d73916dd79ba95b50ef36a32663c15fc849c305`) and copies the shared fields verbatim: id, name, category, family, supporting, fix. Everything specific to a source scan is owned here: `staticPlain`, the observation/inference split, the assessment, file types and thresholds. The `plain` text from SlopLens describes a rendered page and cannot be printed beside a static finding.
- **Assessment is explicit.** `measured` means syntactically certain, `heuristic` means the pattern is present but the inference is not, `unassessed` means the check needs the rendered page. Nine rules are unassessed, including card-grid, repeated-layouts, template-hero, hero-badge, nested-containers, mobile-overflow, scroll-length, control-consistency and spacing-consistency.
- **Supporting signals never count alone.** A stock icon set or a kit palette is reported only as context, and only when a primary slop signal exists.

Files: `yeknal-cli/lib/slopscan.js` (detectors and reports), `yeknal-cli/lib/slop-rules.json`, `yeknal-cli/lib/scan-files.js` (the walker extracted from `bin/yeknal.js` so the two scanners share it without a circular require), `bin/yeknal.js` (dispatch, usage, report writing), `test/slopscan.test.js`, `skills/yeknal-slopscan/SKILL.md`, `tools/slopscan-failure-modes.md`.

Rule ownership is shared with the user's `Slop Detector` repository. That repository records the contract in its `HANDOFF.md` and provides `tools/slopscan-drift.mjs`, a maintainer command that compares the shared fields. It is deliberately not wired into either CI: this repository cannot check out that one during validation, and `catalog:check` rebuilds at its own pinned revision so it would never detect the drift anyway. Run the drift script after changing either copy.

Real-repository pass, seven of the user's projects spanning Next.js, Vite/React and non-framework folders: scan times 1.5 to 11.1 seconds, no crashes, no leftover processes. The pass found and fixed seven false-positive classes before acceptance: nested JSX braces breaking the tag scanner, expression attributes read as literal values, icon-only buttons that actually carried `aria-label`, `outline: none` with a global `:focus-visible` or a ring replacement, modal backdrops counted as decorative effects, nested click handlers counted twice, and vitest-style `.cjs` scripts parsed as markup. Findings that remain are plausible defects (icon-only buttons with no name, empty image sources, clickable table rows) plus genuine copy in a deliberate specimen illustration inside SlopLens itself, which is the intended "candidate for review" framing rather than a defect.

Verification: `node --test` in `yeknal-cli` passes 49/49, including the existing 22. The clean fixture produces zero findings, and two runs over the same fixture produce identical reports apart from the timestamp. Neither the log nor the JSON contains a literal em dash; the JSON preserves the character through the `\u2014` escape.

Not verified: a Node 18 run, Linux or macOS behaviour, false-positive rates on third-party codebases, and the `skills-ref` validator, which is installed only in CI.

## Portfolio skills library (2026-10-11)

- Shipped: `site/presentation.json` (visitor-facing title, purpose, tasks, when-to-use, example, requirements and attribution for all 89 skills, grounded in PROVENANCE.md and bundled notices) and `tools/sync-portfolio.js`, which writes a validated snapshot to the portfolio's `src/data/skills-catalog.json`. Commit `f013d36`; validation run 38171155193 passed, including the new `--validate` CI step. The portfolio library is live at https://tryraisins.dev/skills/ (portfolio `5121fea`).
- The sync reads committed objects only and pins everything to the catalog `sourceRevision`, the revision `setup` serves; `skills --all` still installs unpinned `main`, so regenerate and commit the catalog with any skill change. Refusals and recovery are listed in `tools/portfolio-sync-failure-modes.md`; the publication order is in the README "Portfolio skills library" section.
- `ask-sonner` has no recorded upstream; its page says so rather than claiming it as original. Licensed skills must carry attribution or the sync refuses.
- Evidence: `node tools/verify-portfolio-sync.js` (locally excluded) passed 26/26 in disposable clones with a bare origin and a real Astro build: dirty, stale, tampered, unpublished and invalid-reference refusals, new-skill defaults, deletion, rename redirect, hand-edited snapshot build failure and `--ref` rollback. Report and command log are in the OS temp `portfolio-sync-e2e-*` folder it prints. Portfolio browser E2E passed 83/83 locally and against production, including running the install prompt's git commands against GitHub with hash comparison. That run found and fixed a Windows `core.autocrlf` hash mismatch in the prompt.
- Catalog 0/0 skill audit, routing 0 errors and CLI 22/22 passed locally; the link audit needs PowerShell 7, which isn't installed here, and passed in CI.

## Current Objective

Compatibility for every previously supported local agent/harness shipped in
2.4.1 while preserving working registrations. User authorized implementation and
publishing on 2026-10-10.

## Current State

- Published baseline: CLI 2.4.0 was verified as npm latest/GitHub v2.4.0 on
  2026-10-09 (not refreshed during this implementation). Source commit
  edf3ec64781c24428e87cb869225a4bab077619c; catalog/release commit
  e7693236a65293171456c4f77dcf08908b1d717c. Release validation passed:
  https://github.com/tryraisins/MD_Files/actions/runs/37994702565.
- CLI 2.4.1 is published as npm latest and GitHub release v2.4.1. Source commit
  d976b7923cae86c12ca9b7d92d1d32f936a083ea; push validation passed:
  https://github.com/tryraisins/MD_Files/actions/runs/38038171667. npm shasum:
  7dbe47482451e8027112e631af91e570138e0e16. Release:
  https://github.com/tryraisins/MD_Files/releases/tag/v2.4.1.
- Catalog contains 89 Markdown skills, 54 public slugs, and the unchanged 37-skill
  manual core profile. Markdown folders remain authoritative; preserve licenses,
  unique yeknal names, supporting files, and published/manual profile behavior.
- Local patch adds documented adapters for Cursor, Windsurf/Cascade, Copilot CLI,
  Gemini CLI/Antigravity, Roo, Kiro, Cline, and Amp alongside Codex/Claude/OpenCode.
  OpenHands/shared clients receive paste-ready manual bootstrap and steps. Gemini
  shares Antigravity's default file; redirected CLI roots get distinct Antigravity
  manual steps. Rule/settings gates and custom-agent scope limits are reported.
  Connected means instructions-prepared, runtimeVerified false. No router skill
  is installed. Unchanged owned blocks upgrade; edited/unowned files stay intact.
- Setup inventories all known shared/agent-specific global discovery roots. Exact
  catalog folder + frontmatter identity or prior router ownership establish the
  migration candidate; prefix alone never does. Default setup retains all skills.
  --migrate is opt-in after a native-session check, and only selected successfully
  prepared dedicated roots qualify. Shared .agents/.claude, manual, unselected,
  blocked/failed and historical alternative roots stay. Unsafe protection paths
  disable migration conservatively. Backups are verified before moving originals.
- setup --backups lists recovery records; --restore ID|all restores only into an
  empty absent supported target with verified backup bytes. --remove disconnects
  unchanged blocks while retaining cache/runtime/backups. Manual global skills
  installs and restored skills remain unless eligible migration is requested.
- Plain search/load read compact metadata or selected instructions/references.
  Git root + relative cwd + filesystem identity bound overrides to the requesting
  repository. Direct loads create no project files/native inventory. Explicit
  --materialize/--all-resources copies supporting trees to .yeknal/resources;
  resources clean removes unchanged owned trees and preserves customization.
- Shared per-user cache is storage, not registered skills. Immutable source/hash
  manifests, lazy file loading, catalog TTL/backoff, offline verified reuse, pinned
  references, path/symlink/Windows alias guards, and retained local runtime apply.
  No hosted backend, MCP server, new dependency, telemetry, accounts, or keys.
- Prior UI edits banning all link underline treatments are included in this release;
  decoration/arrow rules, visible focus, action affordances, and contrast stay.

## Relevant Files

- yeknal-cli/lib/harnesses.js, setup.js, migration.js: native adapters, manual
  bootstrap, preserved registrations, ownership and recovery.
- yeknal-cli/lib/discovery.js, commands.js: cache/repository/resource retrieval.
- yeknal-cli/bin/yeknal.js: existing commands plus setup/search/load/update/cache/resources.
- tools/build-catalog.js and yeknal-cli/catalog.json: reproducible static source snapshot.
- yeknal-cli/package.json, package-lock.json: 2.4.1 release and runtime packaging.
- README.md, yeknal-cli/README.md: setup/migration/restore/manual/cache behavior.
- skills/yeknal-skill-router/SKILL.md: legacy manual router with direct-loading guidance.
- Six UI skills: frontend-design/developer, redesign, UI baseline/designer, imagegen web.
- tools/discovery-failure-modes.md: recorded verification risks and proof boundaries.
- .github/workflows/validate.yml, publish.yml: static catalog check and existing gates.

## Decisions and Constraints

- Generate the catalog after the source commit, include it in a follow-up catalog
  commit, and publish those exact bytes. CI checks against the declared source
  commit rather than mutating release content. Full checkout history is required.
- Keep npx yeknal skills and its options intact. Exact-profile sync retains its
  existing managed replacement/pruning behavior. Setup migration never uses that
  blind stale-folder helper; it always backs up identified full folders first.
- Native surfaces are backed by official documentation, not runtime autonomy
  proof. Ambiguous OpenCode V1 fallback and disabled/custom guidance are reported.
  Config-directory detection is not authentication or autonomous behavior proof.
- Registered metadata measurements are skill files/description characters, not a
  claimed token saving. Cache directories are excluded from active discovery.
- No project-local migration and no unknown symlink targets. Windows 8.3 aliases
  require directory identity/name checks; fs.realpath alone does not expand them.
- Preserve unrelated work. Verification scripts and generated artifacts remain
  local and are excluded from release commits according to the saved preference;
  the required static catalog is the distributable data artifact.

## Verification and Repeatable Commands

Existing CLI checks: 22/22. All 89 canonical skills validate. Catalog audit 0/0,
relative links 1,055 resolved, routing cases 28 valid; changed skills pass parity.
Package dry-run includes bootstrap/migration/cache/runtime/catalog modules.

From repository root:

~~~powershell
node tools/build-catalog.js --check
npm test --prefix yeknal-cli
npm pack ./yeknal-cli --dry-run
node tools/verify-harness-setup.js
node tools/verify-discovery.js
node tools/verify-public-discovery.js
node tools/verify-agent-discovery.js
~~~

The four local verifiers are in this checkout and locally excluded from Git.
They write rerunnable reports/logs into OS temporary directories, without editing
real global configurations or copying authentication credentials. Provider runs
can consume account usage. E2E/public/actual-agent final evidence follows below.

- Full discovery E2E: 29/29 passed, no skips. Report and command log:
  C:/Users/NUBIAV~1/AppData/Local/Temp/yeknal-discovery-e2e-iasUHC/report.json.
  Includes backup/restore conflicts and tampering, Windows alias overlap, two Git
  repositories, supporting scripts, offline retrieval, and live manual installs.
- Migration fixture registered metadata: 9 regular skills / 1,355 description
  characters became 3 unrelated/ambiguous skills / 30 characters across 26 roots.
  This measures metadata, not model tokens.
- Actual Codex greeting bypass passed; substantive review loaded and applied an
  existing native yeknal-review. Reports: temp/yeknal-agent-flow-cpFv5F/report.json
  and temp/yeknal-agent-flow-2zvZtl/report.json under the same OS temp directory.
  Bootstrap-only autonomous search/load remained unverified even with documented
  per-run skill disabling. Do not infer it from command E2E or native skill use.
- Post-push public retrieval and offline reuse passed for immutable source edf3ec6:
  C:/Users/NUBIAV~1/AppData/Local/Temp/yeknal-public-flow-rxfI56/report.json.
- npm latest 2.4.0 verified; registry and local package SHA-1 both
  50a07e0949e4d86e19015dad4ede293b806d0d4f. Fresh npm-cache published-package
  setup/repeat/remove and offline search passed:
  C:/Users/NUBIAV~1/AppData/Local/Temp/yeknal-published-QfX02m/report.json.
  Rerun: node C:/Users/nubiaville/AppData/Local/Temp/yeknal-published-smoke.js.
  npm initially returned 404 during processing, then propagated successfully.
  Trusted-publish workflow remained skipped as configured; local authenticated
  publish succeeded. No real user agent configuration was modified.

## Failed Approaches / Do Not Repeat

- Do not equate configured/native available skills with already read instructions.
  A real Codex run may reuse existing registered global skills instead of exercising
  cache-only discovery; reports must distinguish that from new retrieval behavior.
- Do not infer executed search commands from a text regex over all transcript
  output: displayed AGENTS.md can include search text. Inspect executed command events.
- Do not rerun runtime-idempotence scenarios while workers edit package files;
  the runtime content hash correctly changes when implementation changes.
- Native Windows read-only command execution blocked an earlier fixture. Bounded
  actual-agent checks run with command execution enabled against isolated fixtures.
- Windows skills-ref needs PYTHONUTF8=1; Markdown link audit needs PowerShell 7.
- Npm package commands run from yeknal-cli. Registry propagation may briefly be
  stale/404. Current trusted-publish GitHub variable is unset; authenticated local
  npm publish is the known fallback. Never print credential environment values.

## Remaining Verification Boundaries

### Compatibility patch, 2026-10-10

- Fixed the reproduced 2.4.0 continuity risk: broad migration removed registrations
  for unconnected clients. Default setup now retains every collection; opt-in
  migration follows successful runtime preparation and native instruction writing.
- All prior harnesses are selectable or have a documented manual path. --agents
  all handles detected configurations. OpenHands/shared clients, disabled guidance,
  rule conflicts, and redirected Antigravity configurations get manual steps.
- Compatibility flows 17/17 passed; discovery flows 29/29 passed without skips,
  including public legacy installs. CLI checks 22/22, catalog, package dry-run,
  all 89 skills, Markdown audit 0/0, relative links 1,055/0 broken, routing 28/0.
- Pre-release E2E reports (with sibling commands.log):
  C:/Users/NUBIAV~1/AppData/Local/Temp/yeknal-harness-e2e-ePzKnD/report.json
  C:/Users/NUBIAV~1/AppData/Local/Temp/yeknal-discovery-e2e-Kecnn1/report.json
- Review caught and fixed redirected Gemini/Antigravity identity, unresolved
  junction protection aborting retention, and customized blocks reported removed.
  These cases are covered by the compatibility flow verifier.
- Published package was fetched through a clean npm cache; `yeknal profiles` and
  read-only `yeknal setup --list --json` both completed from 2.4.1. Initial npm
  metadata checks briefly returned cached 2.4.0/404; fresh registry metadata and
  clean-cache install confirmed 2.4.1/latest and the expected shasum.
- No real user global configuration or credentials were modified/copied. No
  native provider test was performed in the release turn.
- Remaining: verify real native global ingestion and autonomous search/load in
  each actual harness/surface. Only Codex/Claude/OpenCode commands were available
  here; most clients are unavailable. The isolated CLI checks are not agent proof.
- Release gates and fresh published-package checks passed. Native provider/runtime
  behavior remains unverified.

Prior release implementation, commit, push, and publication are complete. Real native
global instruction ingestion, bootstrap-only autonomous search/load, and autonomous
Claude/OpenCode use remain unverified runtime boundaries. Existing global skills
took precedence in actual Codex runs; further provider attempts were deliberately
stopped. CLI/integration fixtures do not prove those native autonomous behaviors.
Users activate this version with npx yeknal@latest setup; explicit backups/restore
and manual installs are documented in README.md and yeknal-cli/README.md.
