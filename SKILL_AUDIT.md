# Skill Collection Audit

Audit date: 2026-09-12

## Outcome

- 83 top-level skill folders reviewed.
- 83 of 83 pass the Agent Skills `skills-ref` reference validator.
- 83 of 83 pass the repository Markdown audit with zero errors and zero warnings.
- All skill folder names match their frontmatter `name` and use lowercase hyphenated identifiers.
- Every main `SKILL.md` is below 500 lines; detailed material was moved to focused references where needed.
- Repository-wide relative Markdown link checking reports zero unresolved targets.
- The yeknal CLI parses successfully, and the final patch passes `git diff --check`.

## Profile and routing architecture

Version 2 separates the downloadable catalog from the always-discoverable set:

- `core` contains 25 high-frequency skills spanning process/reasoning management, canonical design, implementation, browser verification, and all four security workflows;
- `process`, `design`, `web`, `platform`, `documents-media`, `productivity`, and `openai` add specialist workflows beyond core; `security` is a standalone four-skill subset;
- `all` preserves access to every current catalog skill without making full installation the default;
- `--skills` installs exact named skills without adding core implicitly, while `--project` installs into the current Git repository's `.agents/skills` instead of user-level roots.

Core descriptions were shortened and front-loaded so the complete core discovery metadata remains below Codex's documented 8,000-character fallback budget even after managed folder paths are represented. The default therefore keeps process and thought-management skills available without recreating the full-catalog routing pressure.

Design is consolidated through canonical core routes rather than an oversized universal prompt. The core paths cover reference research, visual direction, shared UI quality, frontend implementation, redesign, mobile, human-AI interaction, and motion. Specialist aesthetics, Figma, prototyping, image-led generation, and motion-audit contracts remain in the `design` pack because they answer materially different requests.

Security remains four focused skills in both core and the `security` pack. Combining their instructions would blur distinct authorization and deliverable boundaries between secure implementation, framework review, threat modeling, and ownership analysis.

## Consolidation decisions

### Merged

- `document` and `update-docs` became `yeknal-markdown-management`. The merged skill covers creation, updating, deduplication, splitting, renaming, link preservation, source authority, and skill-folder validation.
- `agent-organizer` and `multi-agent-coordinator` were folded into `yeknal-orchestration-specialists`. Unsupported performance promises were removed; bounded task ownership, dependency tracking, conflict avoidance, and evidence contracts were retained.
- `NeetigyaShah/deep-research` became a progressively disclosed mode inside `yeknal-research-analysis`; its standalone follow-up skill was omitted because the canonical mode already covers evidence-only follow-up.
- AppLlama's research and app-design skills became one `yeknal-mobile-app-design` skill. Existing `yeknal-animate-expo`, `yeknal-imagegen-frontend-mobile`, and `yeknal-ui-quality-baseline` instructions remain authoritative for their narrower concerns.
- The former fixed `yeknal-gpt-taste` recipe was consolidated into the evidence-led `yeknal-high-end-visual-design` workflow. `yeknal-gpt-taste` remains only as an explicit compatibility route so existing prompts do not break.
- `ibelick/ui-skills` was incorporated as focused method improvements: existing UI, design-research, and SEO entries now cover narrow-surface repair, durable `DESIGN.md` evidence, and complete page-metadata review without adding a second universal UI router. The TypeScript, Python, and Go anti-slop material is one language-aware simplification lens in `yeknal-engineering-specialists` and `yeknal-review`, not three duplicate language personas.

### Kept separate

- Focused command skills such as `yeknal-implement`, `yeknal-review`, `yeknal-troubleshoot`, `yeknal-cleanup`, `yeknal-git`, and `yeknal-finalize` remain distinct because their trigger and safety contracts are narrower than `yeknal-engineering-specialists`.
- Specialist visual directions remain distinct. An approved design, repository design system, or narrow aesthetic skill takes precedence over generic frontend guidance.
- `yeknal-design-reference-research` remains separate from implementation skills because it is read-only by default and produces an evidence ledger and decision brief; `yeknal-human-ai-interface-design` remains separate because appropriate reliance, provenance, autonomy, approvals, and recovery are interaction-safety concerns rather than an aesthetic.
- The four security skills remain separate because application implementation, best-practice review, threat modeling, and ownership analysis produce different artifacts.
- `yeknal-i-have-adhd` remains one explicit-only skill because its persistent conversation-output contract has no behavioral equivalent in the research, documentation, or implementation skills.

## Naming repairs

The following folders were renamed to match their existing skill names:

| Previous folder | Current folder |
| --- | --- |
| `Design` | `yeknal-frontend-design` |
| `Security` | `yeknal-application-security` |
| `brutalist-skill` | `yeknal-industrial-brutalist-ui` |
| `gpt-tasteskill` | `yeknal-gpt-taste` |
| `image-to-code-skill` | `yeknal-image-to-code` |
| `minimalist-skill` | `yeknal-minimalist-ui` |
| `output-skill` | `yeknal-full-output-enforcement` |
| `redesign-skill` | `yeknal-redesign-existing-projects` |
| `soft-skill` | `yeknal-high-end-visual-design` |
| `stitch-skill` | `yeknal-stitch-design-taste` |
| `taste-skill` | `yeknal-design-taste-frontend` |
| `taste-skill-v1` | `yeknal-design-taste-frontend-v1` |

## Progressive disclosure

Six oversized design skills were split without discarding their specialist material:

- `brandkit/references/brand-system-and-prompts.md`
- `design-taste-frontend/references/patterns-redesign-and-sources.md`
- `emil-design-eng/references/component-motion-craft.md`
- `image-to-code/references/implementation-and-extraction.md`
- `imagegen-frontend-mobile/references/mobile-art-direction-system.md`
- `imagegen-frontend-web/references/web-art-direction-system.md`

The new research and mobile integrations use the same progressive-disclosure pattern:

- `research-analysis/references/deep-research.md`
- `mobile-app-design/references/appllama-research.md`
- `design-reference-research/references/source-atlas.md`
- `design-reference-research/references/pattern-atlas.md`
- `design-reference-research/references/responsive-matrix.md`
- `human-ai-interface-design/references/lifecycle-and-patterns.md`

## Upstream review and incorporation

Reviewed repositories and revisions:

- [Anthropic skills](https://github.com/anthropics/skills) at `41bbe19d1a1a7eaab5e7bb9050a417e5c6cffc8f`;
- [OpenAI plugins](https://github.com/openai/plugins) at `1e285826e604f66f7208f7ac4dba0fe8341d1f57`;
- [oil-motion](https://github.com/oil-oil/oil-motion) at `eafd4a45dc9c996489df3c54ac4ebdcde2bd030b`;
- [Rare UI](https://github.com/swamimalode07/rare-ui) at `b3efd6c290884a852b7af39d34df99a762dbbf3f` (MIT + Commons Clause + Attribution);
- [Deep Research](https://github.com/NeetigyaShah/deep-research) at `201dc0e0366f1108ba94f0f422a9ccaecb733b21`;
- [i-have-adhd](https://github.com/ayghri/i-have-adhd) at `58494af57962b2d7a996b4d419474380a299af5e`;
- [AppLlama skills](https://github.com/Appllama/appllama-skills) at `dd5caaec3d5d50ad7fc0324da238119c6b7c3707`;
- [Spell UI](https://github.com/xxtomm/spell-ui) at `fffe96db7b67b44243bf35815916fdfc58fe5014`.
- [ui-skills](https://github.com/ibelick/ui-skills/tree/main/skills) at `f5dd1de9c0fc6c033a43dc3fd2a5be41366e9f43`.
- [TypeScript Anti-Slop](https://gist.github.com/pipethedev/ff13d98a5b626f985708afb343723048) at `165357e91adc1367ef3ecccc9634bfe2e2d968c4`.
- [Python Anti-Slop](https://gist.github.com/pipethedev/5707c47edd0d6994347adef72c533de9) at `313007ca4ce40384272320f2c984a651610969b9`.
- [Go de-slop](https://gist.github.com/pipethedev/0bc97d0d4a13edafbad95a00ad8b7ffe) at `42f9a8e8f7006e3f377187841406ed37daa3276f`.
- [CLAUDE.md](https://github.com/jbarbier/CLAUDE.md) at `02ddd29be403278cfa068ffd54e247bb1f5a1b9f`.
- [Rethinking skills and prompts for GPT-6 Astra](https://developers.openai.com/blog/rethinking-skills-and-prompts-for-gpt-6-astra), published 2026-09-11.

The Anthropic frontend guidance was adapted into a compact `yeknal-frontend-design` entry point. OpenAI's current plugin repository was treated as format and progressive-disclosure reference material, not copied wholesale. Existing local specialist design and command behavior was retained wherever broader upstream guidance conflicted.

Rare UI, beUI, Spectrum UI, and Spell UI are incorporated into `yeknal-pick-ui-library` as inspectable source registries. Rare UI is a preferred prebuilt source for matching React interactions, gated by its mandatory attribution, README credit, React-only compatibility, and no-redistribution terms; the others remain optional. None is an automatic dependency. `yeknal-oil-motion` is a separate specialist skill for generated or captured frame timelines, not ordinary component transitions.

The original 28 supplied UI sources were reviewed through text extraction where available and rendered checks at desktop and mobile widths. Their functions, adoption boundaries, and access limitations are preserved in the design-reference source atlas. Gallery screenshots are explicitly treated as discovery evidence, not proof of accessibility, performance, conversion, or production use.

The 2026-09-12 additions were independently adapted as concise local rules. `yeknal-implement` now routes repeatable, acceptance-critical operations to small executable checks, while `yeknal-markdown-management` requires copyable examples and deterministic claims to be rechecked. The GPT-6 Astra guidance further tightens catalog maintenance: descriptions must be short and discriminating, multi-mode skills must route progressively, and instructions must not become generic itineraries that overconstrain more capable models. They retain real validation, error handling, idiomatic framework conventions, project-specific contracts, and user authority; no source was imported as an overriding general workflow. The established `yeknal-animate` skill already exceeds the reviewed motion-performance guidance and remains the canonical motion entry point.

Deep Research extends the canonical research workflow instead of duplicating it. AppLlama's two related entry points are represented by one mobile implementation skill with optional MCP research. The ADHD-friendly response mode remains explicit-only. These boundaries are covered by routing evaluations for deep research, reference-led visual research, human-AI interaction, native mobile flows, Expo animation, mobile image generation, and ADHD mode.

The official IndexNow protocol and LaunchIgniter submitter are covered in `content-seo/references/indexnow.md`, with submission receipt kept separate from crawling, indexing, and ranking evidence.

## Launch readiness (2026-10-23)

One skill was added rather than two, and it was deliberately not folded into `yeknal-application-security`.

The trigger is a single event: a product becomes publicly reachable. Legal obligations and launch engineering both fire on that event and both produce the same artifact, one register with a go or no-go. Splitting them across two skills would make them compete for the same request. Folding legal duties into `application-security` would blur the boundary this audit protects elsewhere, where secure implementation, framework review, threat modeling, and ownership analysis stay separate because their artifacts differ.

`yeknal-launch-readiness` therefore owns two registers. Register A covers legal and regulatory surfaces, with the instruments in `references/jurisdictions.md` and the checks in `references/obligations.md`. Register B covers seven gates that no existing skill owned: database access rules, tested restore, performance budget, email deliverability, cost containment, rollback including migration reversibility, and consent-gated analytics. Thirteen further checks are cross-referenced to their owners and are not restated.

Nigeria was made the leading jurisdiction at the user's request. The NDPA 2023 applies to any product processing the data of a data subject in Nigeria, the GAID 2025 replaced NDPR 2019 entirely from 19 September 2025, and the NITDA intermediary code and Copyright Act 2022 takedown regime differ enough from their US counterparts that a copied template fails. Two rows ship flagged `verify` rather than asserted: the GAID tier thresholds, and the specific CBN instrument governing recurring card mandates. The skill's own rules require that treatment for any figure not confirmed from a primary source.

`references/evidence-and-fixes.md` records the measured subset so that a future scanner has a specification rather than a guess. No scanner was built, following the slop-scan precedent that the rule catalog should settle before it is codified.

## Performance (2026-10-23)

`yeknal-performance` was added as one skill rather than folded into `yeknal-troubleshoot`, `yeknal-launch-readiness`, or `yeknal-improve-animations`.

The trigger is a standing request, not a reported failure: make the app faster, prove each fix, and keep only what actually works. Troubleshoot starts from a reproducible failure and stops at one before-and-after measurement. Launch readiness measures a single p75 budget once, read-only, as a gate. Improve animations is a read-only motion-craft audit. None of them owns a measure, fix, re-measure programme across startup, screen navigation, content loading, and scrolling, and none enforces a noise floor or a revert rule.

The skill makes measurement part of the contract: a production build, cold cache, a throttled device, at least five runs, median and p75, and an artifact behind every number. It adds `scripts/bench-web.mjs`, a Playwright harness that records route timings, long tasks, layout shift, and scroll frame intervals, writes JSON, and compares two runs with the noise floor applied. The harness needs Playwright in the target project and refuses to install it silently. Electron and React Native use their native profiling tools, documented in the references.

## Legacy sweep (2026-10-24)

`yeknal-test-audit` was renamed to `yeknal-legacy-sweep` and widened from a test-value gate into the campaign that removes unused legacy code and bloated tests together. It stays in `core`, renaming its existing slot (core stays 37), so the default install keeps the deletion-evidence gate. The published set grows from 58 to 59 and the skill joins the Process and reasoning group; `previousNames` redirects the old portfolio slug, and `PROVENANCE.md` keeps the openclaw credit while recording that all production-code, triage, and campaign material is original.

Three skills now split the territory explicitly: `yeknal-dead-code-hunter` finds unused symbols in named files, `yeknal-cleanup` prunes a scoped set of files, dependencies, or config, and `yeknal-legacy-sweep` owns a repository-wide or subsystem campaign with deletion authority. Folding the campaign into `dead-code-hunter` would have buried a whole-repo procedure inside a linter emulation; folding it into `testing-strategy` would have put production-code deletion behind a test-planning trigger.

The content adds what the old gate lacked: a baseline before any edit where failures are treated as the bug list, lane design with serialized writers, an evidence row that must be complete before a removal, failure triage into product bug, obsolete contract, flaky, and already-broken, a keeper map built before deletion, checkpoints that keep the tree reversible, and a report contract that exposes blocked candidates. Three references carry the detail (`evidence-standard.md`, `campaign-execution.md`, `report-template.md`), including a tool matrix for knip, ts-prune, depcheck, madge, ruff, vulture, and coverage with the rule that tool output is a lead, never a verdict.

## Security audit (2026-10-24)

`yeknal-security-audit` was adapted from `cloudflare/security-audit-skill` at `c1c8a8c1471069fb0e188eeaff69b8e8db6564a8` and added to the `security` profile, which grows from four skills to five. The catalog now separates auditing from the three adjacent contracts: `yeknal-security-best-practices` applies secure-by-default guidance and focused stack review, `yeknal-security-threat-model` models design-time abuse, `yeknal-security-ownership-map` maps sensitive-code ownership, and only the audit skill runs a coverage-led empirical hunt with adversarial verification.

This is the first skill in the catalog to ship a JSON Schema and executable validators, and that is a deliberate convention change. The findings contract is what makes the workflow checkable: every record is machine-validated, prose is derived from records, and a claim that cannot be verified stays `needs_validation` without a severity. The coverage ledger is a second schema because "we looked everywhere" must be countable rather than asserted.

Four upstream behaviors changed. The upstream `research` and `general` roles are platform-neutral by design, but unbound role names collapse into one context on this harness, so the skill binds them to `@deepseek-fast`, `@go-scout`, and a fresh verifier, and states that independence comes from fresh context. The OS-sandbox requirement is written as source-only on Windows rather than assumed, so target code does not execute and behavioral leads stay unresolved instead of guessed. Both validators are patched for Windows: upstream rejects every input when `O_NOFOLLOW` and `O_NONBLOCK` are missing, which is always the case on win32, so the local build falls back to a check-then-open read that keeps the symlink, regular-file, byte-limit, and UTF-8 checks and only loses the race-free guarantee. The two upstream validator test files are not shipped: this catalog does not carry unit suites inside skills, and the pinned source commit makes re-vendoring a diff rather than a reconstruction.

`report-schema.json` sits beside `validate-findings.cjs` because the validator resolves it from its own directory. Do not move one without the other.

## Security refresh

The old duplicate raw security prompt files and generated audit log were removed. `yeknal-application-security` and its reference baseline now cover:

- OWASP Top 10:2025 and API Security Top 10 risks;
- Argon2id password storage and safer session/CSRF defaults;
- CSP `frame-ancestors` and removal of deprecated `X-XSS-Protection` advice;
- tenant and object-level authorization, SSRF, uploads, webhooks, and resource limits;
- dependency, artifact, CI/CD, plugin, model, and prompt supply-chain integrity;
- prompt injection, unsafe tool output, memory poisoning, excessive agency, approval boundaries, and bounded agent execution;
- replay, races, retries, exceptional conditions, logging, and incident response.

The CLI syncs all four security skills and reads the master baseline from `yeknal-application-security`. Version `2.0.1` adds profile selection, exact named-skill selection, and repository-local `.agents/skills` installation on top of Codex `.system` collision avoidance, stable security rule IDs, JSON and SARIF reports, interrupted-download handling, automated tests, CI validation, and the OIDC-ready npm release workflow.

## Validation commands

```powershell
pwsh -NoProfile -File .\skills\yeknal-markdown-management\scripts\audit-skills.ps1 -Root .
pwsh -NoProfile -File .\skills\yeknal-markdown-management\scripts\audit-markdown-links.ps1 -Root .
skills-ref validate <each skill folder under skills/>
npm test --prefix .\yeknal-cli
git diff --check
```

The checks validate static structure and syntax. They do not prove behavioral activation quality in every model/client or live security posture in a deployed application.

## Portfolio audit, 2026-10-25

Second full audit, run against the installed set rather than the repository alone, and judged by three models instead of one.

### Outcome

- 96 catalog skills reduced to 81: 10 merged, 6 archived, 1 new router created.
- Core profile reduced from 37 skills to 15, on the test "a developer needs this across unrelated projects".
- Installed footprint reduced from 250 folders and 152 unique names across four roots to 169 folders and 130 unique names across five roots, with every duplicate removed and 10 superseded personal skills quarantined. The original inventory missed `~/.agents/skills`, so the starting cost was higher than measured.
- Always-on description cost reduced from 39,144 to 16,289 characters (about 9,786 to 4,072 tokens).
- Median skill body reduced from 103 to 60 lines; total body lines from 9,148 to 5,568; largest from 482 to 243.
- Every surviving skill has an explicit entry gate, a description under 260 characters, and no reference to a skill that no longer exists.

### Method

Each of the 96 skills was reviewed independently by DeepSeek V4.1 Flash, Claude Sonnet 5.5, and GPT-6 Luna against `QUALITY-BAR.md`: single entry gate, trigger precision, front-loaded description, body discipline, split threshold, followability, declared overlap, and provenance. Disagreements resolved by a fixed rule, with six genuinely contested items sent to DeepSeek V4 Pro. The register is recorded in the release commit.

The three reviewers disagreed in a useful way: DeepSeek is conservative about deletion (66 trims, 2 merges), Sonnet produced every surviving merge proposal (15), and Luna voted no skill core-worthy except the genuinely cross-project ones, judging 70 as pack-only. That last result is the strongest signal that the catalog had been over-installed rather than badly written.

### Consolidation

- `yeknal-deploy` replaces four provider skills with a router that reads the provider from repository configuration and stops to ask when none or several match.
- `yeknal-notion` replaces three Notion skills with one hub and four modes: capture, meeting, research brief, update.
- `yeknal-legacy-sweep` absorbs `yeknal-dead-code-hunter` and `yeknal-cleanup`, including the scoped fast path for small jobs and the prove-unused-before-delete rules.
- `yeknal-animate` absorbs the reference material of `yeknal-emil-design-eng`.
- `yeknal-verification-harness` absorbs `yeknal-verification-audit` as `references/upkeep.md`.

Archived skills move to `archive/skills/`, which is outside every discovery root. Restoring one is a folder move back into `skills/`.

### Personal skills, second board pass

The 49 skills installed outside the catalog were reviewed by the same three models.

- 13 kept: ai-sdk, classic-sp-to-spfx, hatch-pet, mcp-builder, microsoft-foundry, neon, neon-auth, neon-functions, neon-object-storage, neon-postgres, neon-realtime, shadcn, and skill-creator.
- 36 archived, including all 27 thirteen-line "senior X" personas. Those files share a real defect beyond being thin: their descriptions are truncated mid-word, and they instruct the agent to consult a "query context manager" that does not exist on this machine.
- The Neon family was nine skills, not ten, and all nine repeated the same parent preamble, region list and client setup block. Three surfaces were folded into `neon/references/` before their folders were quarantined: ai-gateway, postgres-branches and postgres-egress-optimizer. Six remain as skills.
- Every kept skill's description was rewritten to trigger-first form. All 13 are now under 260 characters, down from a maximum of 1,773.

Result across all five discovery roots: 129 folders, 94 unique skills, 19,218 description characters, about 4,805 tokens of always-on cost.

### Provider skills pruned

Four skills were dropped after the consolidation because they were provider-specific without supplying anything a documentation fetch does not: `nextjs-developer` (33 lines, no version-specific fact), `ask-sonner` (one toast library, mostly API tables), `stitch-design-taste` (links a `DESIGN.md` it does not ship, no Stitch-specific grammar), and `linear` (duplicates the connected MCP server's own tool schemas). All four moved to `archive/skills/`.

The rule kept for the rest: a provider skill stays when it encodes a decision gate, a hazard (what looks like a preview and is not), or a bundled script that does real work. Under that rule `aspnet-core`, `winui-app`, `write-swift`, `figma-implement-design`, `chatgpt-apps`, `sentry`, `openai-docs`, `jupyter-notebook`, and the OpenAI media skills remain, as opt-in packs.

Catalog after this pass: 77 skills, 15 core.

### Capability packs removed (2026-10-25)

The catalog was reduced further on request, to an engineering, design, security and process set. Removed to `archive/skills/`: all eight image, video and audio skills, all five document and file skills, the two response-mode skills (`i-have-adhd`, `full-output-enforcement`), the remaining platform and framework skills (`aspnet-core`, `winui-app`, `write-swift`, `figma-implement-design`), `develop-web-game`, both agent-surface skills (`chatgpt-apps`, `openai-docs`), and the Notion pair (`notion`, `notion-spec-to-implementation`).

Consequences handled: three packs became empty and were deleted (`documents-media`, `productivity`, `openai`), six surviving skills had their cross-references to removed ids rewritten (`brandkit`, `markdown-management`, `mobile-app-design`, `playwright`, `research-analysis`), and 3 routing cases were dropped.

Catalog after this pass: 53 skills, 15 core, in five packs.

### Defects found that structure checks do not catch

- A commit-and-push skill staged the whole working tree, including secrets and unrelated changes.
- One skill required a plan skill that this catalog never shipped.
- Several skills hardcoded an agent-home path that resolves to nothing after install.
- 13 trimmed descriptions became invalid YAML because an unquoted colon-space breaks strict frontmatter parsing.
- Two files were written with a UTF-8 BOM, which silently breaks frontmatter parsing for strict validators.
- Four deploy descriptions all matched an unnamed "deploy this" request, with one never naming its own provider.

### Verification

`audit-skills.ps1` 81 skills with 0 errors and 0 warnings; `validate-routing-evals.ps1` 44 cases with 0 errors; `verify-discovery.js` 30/30; `verify-harness-setup.js` 18/18; `npm test --prefix yeknal-cli` 50/50; custom catalog check reporting 0 failures, 0 BOMs, 147 resolving relative links, and a longest description of 251 characters.

Boundaries: `audit-markdown-links.ps1` needs PowerShell 7, which is absent here, so a Node link check stood in. Model-based routing quality is asserted by the 44 evaluation cases, not proven for every client.
