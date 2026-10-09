# Project Handoff

Last updated: 2026-10-09
Branch: main
HEAD: see git log; released source edf3ec6, catalog/tag e769323

## Current Objective

Release minimal global bootstrap and repository-scoped on-demand skills, including
the previous discovery implementation and pending UI link-underline rules. The
user explicitly authorized commit, push, and deployment/publication on 2026-10-09.

## Current State

- CLI 2.4.0 is published as npm latest and GitHub release v2.4.0. Source commit
  edf3ec64781c24428e87cb869225a4bab077619c; catalog/release commit
  e7693236a65293171456c4f77dcf08908b1d717c. Release validation passed:
  https://github.com/tryraisins/MD_Files/actions/runs/37994702565.
- Catalog contains 89 Markdown skills, 54 public slugs, and the unchanged 37-skill
  manual core profile. Markdown folders remain authoritative; preserve licenses,
  unique yeknal names, supporting files, and published/manual profile behavior.
- Setup adds one short native instruction block per connected Codex, Claude Code,
  or OpenCode V2 agent. No global SKILL.md router is installed. Existing unchanged
  owned connections upgrade too. Edited/ambiguous blocks are preserved/reported.
- Setup inventories all known shared/agent-specific global discovery roots. Exact
  catalog folder + frontmatter identity or prior router ownership establish the
  migration candidate; prefix alone never does. Customized content is backed up,
  verified, then moved outside discovery. Symlinks/unknown identities, repository
  roots, or failed backups are preserved. Existing unrelated skills/config stay.
- setup --backups lists recovery records; --restore ID|all restores only into an
  empty absent supported target with verified backup bytes. --remove disconnects
  unchanged blocks while retaining cache/runtime/backups. Manual global skills
  installs can deliberately recreate collections; future setup migrates them again.
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

- yeknal-cli/lib/setup.js, migration.js: native bootstrap, ownership and recovery.
- yeknal-cli/lib/discovery.js, commands.js: cache/repository/resource retrieval.
- yeknal-cli/bin/yeknal.js: existing commands plus setup/search/load/update/cache/resources.
- tools/build-catalog.js and yeknal-cli/catalog.json: reproducible static source snapshot.
- yeknal-cli/package.json, package-lock.json: 2.4.0 and runtime packaging.
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
- Native connection support is limited to verified agents. Ambiguous OpenCode V1
  Claude fallback configurations are skipped/reported. Config-directory detection
  is not proof of installation/authentication or autonomous agent behavior.
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
node tools/verify-discovery.js
node tools/verify-public-discovery.js
node tools/verify-agent-discovery.js
~~~

The three local verifiers are in this checkout and locally excluded from Git.
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

Requested implementation, commit, push, and publication are complete. Real native
global instruction ingestion, bootstrap-only autonomous search/load, and autonomous
Claude/OpenCode use remain unverified runtime boundaries. Existing global skills
took precedence in actual Codex runs; further provider attempts were deliberately
stopped. CLI/integration fixtures do not prove those native autonomous behaviors.
Users activate this version with npx yeknal@latest setup; explicit backups/restore
and manual installs are documented in README.md and yeknal-cli/README.md.
