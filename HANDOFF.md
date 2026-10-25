# Project Handoff

Last updated: 2026-10-25
Branch: main
HEAD: see git log; 2.6.1 release commit tagged `v2.6.1`

## 2.6.1: stale npm profiles and archived-skill retirement (2026-10-25)

Incident: `npx yeknal@latest skills` failed with `Requested skill folder(s) not found: brainstorm, cleanup, engineering-specialists, emil-design-eng, skill-router`. Cause: npm 2.6.0 was published 2026-10-24 with the pre-consolidation `profiles.json` (37-skill core), while the repository had already archived those folders to `archive/skills/`. `selectSkillFolders` treated a missing profile entry as fatal. The local `profiles.json` was corrected in the consolidation commits, but no version bump or publish followed, so npm kept serving the old file against the new repository tree.

Changes in 2.6.1:

- `yeknal-cli/bin/yeknal.js`: `selectSkillFolders` returns `{ folders, skipped }`. A missing skill named with `--skills` still throws; a missing profile entry warns (`[skip] ... no longer published`) and the sync continues. An empty selection throws an actionable error instead of doing nothing.
- `yeknal-cli/archived.json` (new, packaged): 34 retired folder names generated from `archive/skills` by `tools/build-catalog.js`, which now emits and `--check`s both files.
- `removeArchivedSkillFolders` prunes only curated archived names, never the whole `yeknal-` prefix. A normal sync always prunes; `--add` needs the new `--prune-archived` flag.
- `lib/migration.js`: `setup --migrate` treats archived names as retired-but-owned, backs them up to `migration-backups`, then removes them; `--restore` returns them. `setup` without `--migrate` still touches no skills.
- `lib/setup.js`: the runtime snapshot includes `archived.json`, and the report prints `Retired archived skill` instead of `Ambiguous Yeknal identity preserved`.
- Docs: both READMEs, plus `tools/verify-archived-cleanup.js` (new E2E harness, requires network).

Verification: `npm test` 50/50; `catalog:check` verified at `1189560` (catalog) and `d55ada2` (archived); `npm pack --dry-run` includes `archived.json`; `node tools/verify-archived-cleanup.js` passed all four scenarios: default sync pruned the seeded archived folder while keeping 15 managed plus a personal folder; `--add` kept the archived folder and local edits while `--add --prune-archived` removed only the archived folder; a patched stale profile warned and installed while `--skills not-a-skill` still failed; `setup --migrate` retired the archived skill with a backup and `--restore all` returned it.

Release: version 2.6.1, released from `b25375a`, tag `v2.6.1`, GitHub release `https://github.com/tryraisins/MD_Files/releases/tag/v2.6.1`. `.github/workflows/publish.yml` stayed dormant because the repository has no `NPM_TRUSTED_PUBLISHING_ENABLED` variable, so the package was published manually from an authenticated npm client. Published `yeknal@2.6.1`, shasum `c9268f9c576995821605ab0faa29f20a8b3d8794` (matches the local `npm pack`). Validation workflow green on `b25375a`. `npx yeknal@2.6.1 skills` was then run against the real home and installed the 15-skill core profile into `~/.agents/skills`, `~/.claude/skills`, `~/.kiro/skills`, `~/.gemini/config/skills`, and `~/.gemini/antigravity/skills`, with `yeknal-git/SKILL.md` byte-identical to the repository copy. Portfolio synced to `cliVersion 2.6.1` and `catalogCommit b25375a` (skill content unchanged), committed `c389072`, pushed, and the Deploy GitHub Pages workflow published; live `https://tryraisins.dev/skills/` was rebuilt at 12:19 GMT, still lists 53 skills, and contains no archived name.

Do not repeat, learned during this release: a manual `skills` run with some `YEKNAL_*_PARENT` overrides removed falls back to the real home for those harnesses. `--skills <one>` also prunes every other managed folder in each target, so it deletes a working core install. For isolation, set every parent var to a missing path (as `tools/verify-archived-cleanup.js` does) and never point a partial override set at the real machine. The damaged roots were repaired with a default 15-skill sync.

Known issue, deliberately untouched: `skills --add` still calls `cleanSkippedManagedSkills` for skipped shared-reading targets, which removes managed copies even in additive mode. It predates this release and is recorded here rather than changed inside a release fix.

## Portfolio audit (2026-10-25)

Full three-model audit of the catalog and the installed set. Decisions, evidence and merge map live in the release commit under `SKILL_AUDIT.md`; the working artifacts were `.audit/` (git-excluded).

Shape: 96 catalog skills to 81 (10 merged, 6 archived, 1 new `yeknal-deploy` router), core 37 to 15, installed folders 250 to 81 plus 11 personal, always-on descriptions 39,144 to 16,289 characters, body p50 103 to 60, total body lines 9,148 to 5,568.

Reviewers: DeepSeek V4.1 Flash (all 96), Claude Sonnet 5.5 (all 96), GPT-6 Luna (placement for all 96), DeepSeek V4 Pro for six contested items. Resolution rules were fixed before the votes: unanimous wins; a merge needs two votes or a single Sonnet merge with no keep dissent and a surviving target; core needs two core votes and a technology-agnostic trigger; a tie-break overrides the rules and is recorded.

Consolidation: `yeknal-deploy` (router over four provider references, provider detected from repo config, asks when none or several match), `yeknal-notion` (hub with capture, meeting, research-brief and update modes), `yeknal-legacy-sweep` (absorbs dead-code-hunter and cleanup), `yeknal-animate` (absorbs emil reference material), `yeknal-verification-harness` (absorbs verification-audit as `references/upkeep.md`). Archived to `archive/skills/`, outside every discovery root: v1 taste, gpt-taste, animation-vocabulary, engineering-specialists, brainstorm, skill-router.

Install layer: 98 redundant folders moved to `~/.skill-quarantine/2026-10-24/` with a restore manifest, and 10 superseded personal skills to `~/.skill-quarantine/2026-10-25/`. The OpenCode root keeps 6 personal skills with no catalog equivalent: ai-sdk, shadcn, react-best-practices, visualize, template-creator, hatch-pet.

Baseline correction worth remembering: the Phase 0 inventory missed `~/.agents/skills`, which is a real discovery root and held a parallel catalog install plus about 53 personal skills. Final measured state across all five roots is 169 folders, 130 unique names, 23,559 description characters (about 5,890 tokens). The 39 remaining duplicate folders are one copy per harness root, which discovery deduplicates by name.

Not audited: none. The 49 personal skills in `~/.agents` were reviewed in a second board pass. 13 kept (ai-sdk, classic-sp-to-spfx, hatch-pet, mcp-builder, microsoft-foundry, the six Neon skills that survived, shadcn, skill-creator) and 36 quarantined, including all 27 thirteen-line personas, which also had truncated descriptions and referenced a "query context manager" that does not exist. Three Neon surfaces folded into `neon/references/` before quarantine. All 13 kept descriptions were rewritten under 260 characters, from a 1,773-character maximum. Final measured state across five roots: 129 folders, 94 unique, 19,218 description characters, about 4,805 tokens.

Provider prune (2026-10-25): dropped `nextjs-developer`, `ask-sonner`, `stitch-design-taste` and `linear` to `archive/skills/`, taking the catalog to 77 skills and 15 core. They were provider-specific with no version-specific fact, or duplicated an MCP server's own tool schema. The retained rule: keep a provider skill only when it encodes a decision gate, a hazard, or a bundled script.

Published 2026-10-25 after the prune: catalog source `c661f3c` with the catalog at `8aa2a36`, CI success. Portfolio synced at `8aa2a36`, committed `f99bac7`, deployed, and the live page confirmed all four skills gone with Deploy and Legacy sweep still present. Final installed measurement: 125 folders, 90 unique, 18,361 description characters, about 4,590 tokens.

Capability prune (2026-10-25): a further 24 skills archived on request, taking the catalog to 53 skills and 15 core. Removed: all image/video/audio, all documents, both response-mode skills, the remaining platform and framework skills, develop-web-game, both agent-surface skills, and the Notion pair. Three packs went empty and were deleted. Six surviving skills had cross-references rewritten. The catalog is now an engineering, design, security and process set in five packs.

Published 2026-10-25 after the capability prune: catalog source `59bc2d7` with the catalog at `1189560`, CI success; task-filter retitle at `899797c`. Portfolio synced twice, committed `c06712e` and `0b49b07`, deployed. Live page confirms 53 skills, the new filter labels, and no mention of the removed capabilities. Final installed measurement: 101 folders, 66 unique, 13,303 description characters, about 3,326 tokens.

Defects the review caught that structure checks do not: `yeet` staged the whole tree including secrets; `gh-fix-ci` required a `create-plan` skill that never existed; several skills hardcoded `$CODEX_HOME/skills/<name>` paths that resolve to nothing after install; 13 trimmed descriptions became invalid YAML from an unquoted colon-space; two files were written with a UTF-8 BOM; four deploy descriptions all matched an unnamed "deploy this".

Verification: `audit-skills.ps1` 81/0/0; `validate-routing-evals.ps1` 46 cases, 0 errors; `verify-discovery.js` 30/30; `verify-harness-setup.js` 18/18; CLI suite 50/50; custom check 0 failures, 0 BOMs, 147 links resolving, longest description 251.

Published 2026-10-25: catalog source `945ada1` with catalog at `3ce23da`, CI "Validate skills and CLI" success on both pushes. Portfolio synced with `node tools/sync-portfolio.js --portfolio ../../Portfolio/my-portfolio`, committed as `a0fca84` and deployed; live `https://tryraisins.dev/skills/` shows Deploy and Notion and no longer lists the archived skills. Only `src/data/skills-catalog.json` was committed in the portfolio; its other modified files were left untouched as in-progress work.

Installer note: `yeknal skills` installs from its cached catalog revision, so it reinstalls stale content after a local change. Verify with a file hash against `skills/`, and if it differs, copy the core folders directly from the repository.

Do not repeat: a single worker cannot finish 40 trims, it hits its step limit at about 23. Split trim work into batches of roughly 20 and verify descriptions, BOMs and dangling ids after every batch.

Also do not trust `yeknal skills` to install the working tree. It installs from its cached catalog revision, so after a local change it reinstalls stale content. Verify with a file hash against `skills/`, and if it differs, copy the core folders directly from the repository.

## Security audit skill (2026-10-24)

`yeknal-security-audit` adapts `cloudflare/security-audit-skill` at `c1c8a8c1471069fb0e188eeaff69b8e8db6564a8` (MIT, Cloudflare) into the `security` profile, which grows from four skills to five. It is the first skill in the catalog to ship a JSON Schema and executable validators, and the first to own an empirical audit distinct from the three existing security contracts. `yeknal-security-best-practices` keeps focused stack review and secure-by-default guidance, `yeknal-security-threat-model` keeps design-time modeling, `yeknal-security-ownership-map` keeps the git-risk axis, and each now points at the audit skill for a full run.

Files: `SKILL.md` rewritten to this catalog's conventions with the platform-neutral `research`/`general` roles bound to `@deepseek-fast`, `@go-scout`, and a fresh verifier; 14 companions under `references/`; `scripts/validate-findings.cjs`, `scripts/validate-coverage-ledger.cjs`, and `scripts/report-schema.json` kept byte-close to upstream except one patch. The upstream test files are deliberately not shipped.

Upstream change worth knowing before re-vendoring: both validators call `readFileWithinLimit`, which upstream makes reject every input when `O_NOFOLLOW` and `O_NONBLOCK` are unavailable. Those constants are undefined on win32, so the validators were unusable here until the local fallback was added: a check-then-open read that keeps symlink rejection, the regular-file test, the byte limit, and UTF-8 decoding, and only loses the race-free guarantee. Each file carries a header note. Diff against the pin rather than replacing the files.

Registered in `yeknal-cli/profiles.json` (`security`), `skills.sh.json` (Security group), `site/presentation.json` (tasks `security` and `review`, Cloudflare attribution and source URL), `llms.txt`, `PROVENANCE.md`, `README.md` (counts, profile table, upstream review paragraph), `SKILL_AUDIT.md` (release note and the convention change), and `evaluations/skill-routing.json` (five new cases plus `mustNotLead` additions to the existing security-review and threat-model cases). `yeknal-cli/test/yeknal.test.js:208` needed its hardcoded `security` profile expectation updated, which is the failure the parallel cost session reported at 49/50.

End-to-end proof: a fixture service in `%TEMP%\opencode\audit-target` (five files, planted login bypass, SQL concatenation, cross-owner search, plaintext listener) was audited end to end with the skill in `quick` profile. Recon seeded six units, two hunters returned four candidates, a `@go-scout` critic added two deferred units and disputed one `covered` status that was really a dead branch, a fresh verifier kept all four at `needs_validation` and corrected three evidence claims, and the parent wrote `findings.json`. Validators: `PASS: 4 findings valid` and `PASS: 9 coverage units valid`. Run artifacts stay in `%TEMP%\opencode\audit-runs\invoicer\run-1` (`REPORT.md`, `NEEDS-VALIDATION.md`, `FINDINGS-DETAIL.md`, ledger, `findings.json`). Zero records reached `confirmed` because the policy is source-only, which is the expected and honest outcome on this machine.

Verification: `skills-ref validate` valid; `audit-skills.ps1` 96 skills, 0 errors, 0 warnings; routing evals 43 cases, 0 errors; relative links resolve across 717 files; CLI suite 50/50; `git diff --check` clean. `audit-markdown-links.ps1` still cannot run here because PowerShell 7 is absent, so a Node link check stood in.

Published: source in `0d33578`, catalog regenerated at `70a537a` with 96 skills, and `node tools/build-catalog.js --check` passes at that revision. The follow-up count correction in `README.md` keeps the profile table honest after both 2.6.0 skills landed in the same source commit.

## T3 Code harness support (2026-10-24)

T3 Code is an agent control surface, not an agent. Its shipped server (`server.asar`, the `IN0` skill-root table) scans `~/.agents/skills`, `~/.cursor/skills`, and the gated `~/.claude/skills`, `~/.codex/skills`, `~/.grok/skills`, plus the same names under the workspace, plugin roots, and `extraRoots`. It has no global instruction file: instructions come from the selected provider agent and the repository `AGENTS.md`. Skills appear in the `$` mention and `/` menu, filtered to the provider, and need **Restart agent session** after a change. T3 home is `~/.t3` or `T3CODE_HOME`.

The CLI now treats it as a first-class manual harness. `SUPPORTED` and `ALIASES` add `t3`, `t3-code`, and `t3code`; `detectHarnesses` detects `~/.t3`/`T3CODE_HOME` and returns a manual entry whose skill root is `~/.agents/skills`, with steps covering install, the `$` menu, restart, provider instructions, and project scope. `getSkillTargetSpecs` gained a T3 spec with `skillsParent: ~/.agents` and `shared: true`, so a T3-only machine creates `~/.agents/skills` instead of installing nothing, while a machine that already has `~/.agents` still reports the unchanged "Agents (shared standard)" target. `collectSkillTargets` now de-duplicates by resolved skills folder rather than detection folder, and `discovery.localRoots` honours `skillsParent` so it never reads `~/.t3/skills`. Setup stays manual mode: T3 owns no instruction file to write.

Docs updated: `yeknal-cli/README.md` prerequisite, integration table, aliases, and `skills` bullets; root `README.md` folder list and user-scope paragraphs. No version bump was made because the working tree already carries an unfinished 2.7.0 release (new `yeknal-agent-cost-control` and `yeknal-security-audit` skills, profile and catalog updates).

Verification: `node tools/verify-harness-setup.js` 18/18, including a new T3 scenario for detection, `T3CODE_HOME` redirect, aliases, manual contract, and the shared install root. `node tools/verify-discovery.js` 30/30, including a new live scenario proving a T3-only home installs into `~/.agents/skills` and creates no `~/.t3/skills`. Both scripts are listed in `.git/info/exclude`, so their edits stay local. `node tools/build-catalog.js --check` verified at `60ff367`. On this machine `setup --list` reports `T3 Code: detected; manual`, and the resolved target list still shows one `Agents (shared standard)` entry, not a T3 duplicate.

Known failure, not caused here: `npm test --prefix yeknal-cli` is 49/50. `profiles reference real skills and keep core discovery under budget` fails because the untracked `skills/yeknal-agent-cost-control` folder is not in any profile yet. That belongs to the in-flight release, so it was reported and left untouched.

Boundary: the `$` menu entry itself is a T3 Code UI check. After `npx yeknal skills`, use **Restart agent session** in T3 Code and confirm a skill appears for the selected provider. No automated check covers that surface.

## Agent cost work (2026-10-24)

Two halves: harness tuning outside this repo, and one new catalog skill. The trigger was the Cloudflare post on cutting inference cost 68%, measured against this machine before applying anything.

Baseline that changed the plan: 36 sessions, 2,736 calls, $10.66 over 30 days, with 95% of input tokens already served from cache and one 644-call session carrying 57% of the spend. So the work became session shape and call count, not prompt-cache tuning.

Harness changes (`~/.config/opencode`, not in this repo): `cost-report.mjs` plus `command/cost.md` (`/cost`) reads the local session database read-only and reports spend, calls per session, first-call cache hit, and the tail; a batch-read rule in `deepseek-fast.md` and `go-scout.md`; a re-review skip rule in `deepseek-routing.ts`; and section 22.16 on session hygiene and cost in the global `AGENTS.md`. Subagent tool definitions needed no change: no denied-tool attempts in about 2,700 calls.

Skill: `yeknal-agent-cost-control` with `references/measurement.md` (OpenCode schema and SQL). Registered in `site/presentation.json` (task `agents`), `skills.sh.json` (Process and reasoning), `llms.txt`, `README.md`, `PROVENANCE.md` (Cloudflare post, method adapted, figures framed as one team's reference case), `evaluations/skill-routing.json` (`agent-spend-regression`), and `yeknal-cli/profiles.json` (`process`; the profile-coverage test requires every discovered skill to be covered).

Project tool surface: a local-only `opencode.json` in the repo root disables pencil, Neon, vercel, and cloudflare for this project, where MCP tools accounted for 2 calls in roughly 1,100. It is excluded through `.git/info/exclude` and is not part of the release. Entries must be complete, because a partial `{ "enabled": false }` is dropped by schema validation without warning and the server stays active.

Verification: `skills-ref validate` valid; `audit-skills.ps1` 96 skills, 0 errors, 0 warnings; routing evals 43 cases, 0 errors; relative links resolve; `opencode mcp list` shows the four servers disabled in this directory. `audit-markdown-links.ps1` still cannot run here for the same PowerShell 7 reason as before. The CLI failure reported at 49/50 was the security work's stale expectation at `test/yeknal.test.js:208`, since fixed, so the suite is 50/50.

Released as 2.6.0: catalog regenerated in `70a537a`, `node tools/build-catalog.js --check` passes at `0d33578`, `npm publish` shipped 2.6.0 (shasum `7d2e252`), tag `v2.6.0` points at `3a04d68`, and the portfolio synced in `3bbe359`. End-to-end proof from the published package: `npx yeknal@2.6.0 search "cut agent cost"` ranks `yeknal-agent-cost-control` first from `source: catalog`, and `load yeknal-agent-cost-control` returns `SKILL.md` plus `references/measurement.md` from revision `0d33578`. Live page verified at `tryraisins.dev/skills/agent-cost-control`.

## Legacy sweep rename (2026-10-24)

`yeknal-test-audit` is now `yeknal-legacy-sweep`, rewritten from a test-value gate into the full sweep campaign: baseline first, serialized lanes, an evidence row per candidate, failure triage, a keeper map, checkpoints, and a report contract. It keeps the core slot (core stays 37), becomes public (published 58 to 59), and joins the Process and reasoning group. New references: `evidence-standard.md`, `campaign-execution.md`, `report-template.md`.

The request behind it was a Codex prompt that used GPT-6.1 Sol Ultra for a deep dead-code and bloated-test cleanup. The skill exists so a cheap executor can run the same campaign, because the expensive part was never the scan, it was the judgment about what counts as proof. A candidate that cannot fill its row leaves as a blocker instead of a deletion, and a failing test is triaged as a defect before it is treated as bloat.

Renamed references updated: `yeknal-testing-strategy` (line 47), `site/presentation.json` (key moved to alphabetical position, `previousNames: ["yeknal-test-audit"]`, purpose and example widened), `evaluations/skill-routing.json` (the verification-audit case now points at the new ID, plus a new `deep-legacy-sweep` case), `PROVENANCE.md`, `skills.sh.json`, `profiles.json`, `SKILL_AUDIT.md`, `llms.txt`, `README.md`, `yeknal-cli/README.md`. Version bumped to 2.6.0, which also covers the verification pair and `yeknal-performance`.

Verification: `skills-ref validate` valid; `audit-skills.ps1` 0 errors and 0 warnings; CLI suite 50/50; presentation and count validator 0 errors; `git diff --check` clean. End-to-end run: a fixture repository in `%TEMP%\opencode\legacy-sweep-fixture` with four traps was swept by a separate worker following this skill. It removed `formatLegacyDate`, kept the string-key handler that `knip` flagged, kept the barrel export, removed a self-comparison test only after proving it passes against broken code, fixed the real `normalizeEmail` bug, and left both keeper tests byte-identical. Its report is `SWEEP-REPORT.md` in that folder; the acceptance list is `%TEMP%\opencode\legacy-sweep-evidence\RUN.md`.

Not done here: the catalog rebuild and commit, the push, and the portfolio sync. The user's `yeknal-test-audit` copies in `~/.agents/skills` and `~/.claude/skills` were left in place.

## Verification harness pair (2026-10-23)

Two skills added from Lauren Tan's pstack (`cursor/plugins` at `4ec7ffa`): `yeknal-verification-harness` (generates a project-local launch/doctor/drive/evidence/cleanup skill plus a feature map) and `yeknal-verification-audit` (the upkeep pass: source wave per feature, one live session, at most one set of proven corrections).

Decisions with the user: pair 1 only. The formal-verification pair (`create-formal-verification-skill` and `maintain-formal-verification-skill`, TLA+/model checkers) was reviewed and deliberately left out because it only pays off where concurrency, parsers, or invariants exceed what tests reach, and would rot across a design-and-product catalog.

Two upstream behaviors were changed during the port. The hardcoded `.cursor/skills/verify-<app>/` path became the project's own skill directory with `.agents/skills/` as the neutral fallback, because this catalog targets Codex, Claude, opencode, and Cursor. `disable-model-invocation: true` became "Use only when the user explicitly asks" in the description, because `tools/rewrite-standard.md` rejects unknown top-level frontmatter fields. `/create-verification-skill` and `/maintain-verification-skill` references became the two `yeknal-` skill names. The three upstream `references/feature-map-example/` files were carried over unchanged.

Registration: both skills are in the `process` profile, not core, because core sat 303 characters under the 10,000-character discovery budget in `yeknal-cli/test/yeknal.test.js`. Also updated `skills.sh.json` (Verification group), `site/presentation.json` (task `review`; harness also `build`), `PROVENANCE.md`, `README.md`, `llms.txt`, and two `evaluations/skill-routing.json` cases.

Verification: `skills-ref validate` passes both skills (installed locally at 0.1.0). `audit-skills.ps1` reported 93 skills, 0 errors, 0 warnings before the parallel performance and legacy-sweep work landed. Routing evals 0 errors. CLI suite 50/50 including the profile-coverage and core-budget tests. Catalog build and portfolio `assemble` over the built tree returned 0 errors and 0 warnings with the MIT credits detected. Relative links resolve. `git diff --check` clean.

Boundaries: not committed. The tree is shared with the performance and legacy-sweep workstreams, so the source commit, `node tools/build-catalog.js`, the catalog commit, the push, and the portfolio sync are all still pending. `audit-markdown-links.ps1` cannot run here: it needs PowerShell 7 for `Path.GetRelativePath` and only 5.1 is installed.

## Performance skill (2026-10-24)

New skill `skills/yeknal-performance` owns the measure, fix, re-measure programme across startup, screen open, content load, and scrolling. It is separate from `yeknal-troubleshoot` (starts from a failure, one before/after), `yeknal-launch-readiness` (one read-only p75 gate), and `yeknal-improve-animations` (read-only motion craft). The contract is explicit: production build, cold cache, throttled device, at least five runs, median and p75, an artifact behind every number, and a revert when a change does not clear the measured noise floor.

Six references: `measuring.md` (protocol, noise floor, artifacts, tooling per stack), `startup.md`, `screens-and-content.md`, `scrolling.md`, `fix-catalog.md`, `report-template.md`. Bundled harness `scripts/bench-web.mjs` uses Playwright to record route timings, ready selector, long tasks, TBT, CLS, DOM size, transfer, and scroll frame intervals, writes `perf-results/<label>.json`, and compares two labels with a per-metric noise floor, a 50 percent cap, and a 2ms absolute floor. It refuses to install Playwright or a browser silently.

Registration: `web` profile, not `core`, because a 38th core entry pushed core discovery metadata to 10,255 characters against the 10,000 budget in `yeknal-cli/test/yeknal.test.js`; core stays 37 and `all` is 94. Also updated `skills.sh.json` (Process & reasoning), `site/presentation.json`, `llms.txt`, `README.md` (web 6 to 7, all 94), `SKILL_AUDIT.md`, and one routing evaluation case (`app-performance-optimization`, mustNotLead troubleshoot and improve-animations). One-line cross-links added in `yeknal-troubleshoot` and `yeknal-launch-readiness`; neither restates the workflow.

Verification: `audit-skills.ps1` 94 skills, 0 errors, 0 warnings; `validate-routing-evals.ps1` 37 cases, 0 errors; `node --test yeknal-cli/test/yeknal.test.js` 23/23; `verify-public-discovery.js` passed; relative links 1,109 checked, 0 broken (Node walk, because `audit-markdown-links.ps1` needs PowerShell 7 and this machine has 5.1); presentation entry 94 keys, known key set, valid tasks and related targets; `catalog:check` verified at the committed revision; `git diff --check` clean.

Harness smoke test: local static page in `%TEMP%\opencode\perf-smoke`, 3 runs at 4x CPU, 1600kbps, 150ms latency, 390x844. Baseline (3,000 rows plus a 120ms blocking render) measured 3,949ms ready, 3,584ms LCP, 21,012 DOM nodes; after (300 rows, no blocking work) measured 871ms ready, 660ms LCP, 1,212 nodes. The comparison marked 7 improvements, 8 within noise, and 2 regressions (long-task totals), which is the harness doing its job rather than declaring a clean sweep.

Not run here: `skills-ref validate` (CI only), `audit-markdown-links.ps1` (needs PowerShell 7), and `sync-portfolio.js --validate` (compares against the catalog's pinned revision, so it can only pass after the source commit and catalog rebuild). Release order is unchanged: commit the source, run `node tools/build-catalog.js`, commit `yeknal-cli/catalog.json`, push, then `--validate`.

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
