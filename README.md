# MD Files

[![skills.sh](https://skills.sh/b/tryraisins/MD_Files)](https://skills.sh/tryraisins/MD_Files)

A curated collection of reusable skill folders for AI coding agents. The collection favors specific design and command guidance over generic personas, uses progressive disclosure for long references, and keeps security guidance grounded in current primary sources.

## Requirements

`yeknal` does not need a global install. A new device needs Node.js with npm and internet access. User-level sync detects these supported agent folders:

- Codex: `~/.codex`
- Claude: `~/.claude`
- Gemini Antigravity: `~/.gemini/config` or `~/.gemini/antigravity`
- Antigravity: `~/.antigravity`
- opencode: `~/.config/opencode`
- Cursor: `~/.cursor`
- Windsurf / Cascade: `~/.codeium/windsurf`
- GitHub Copilot: `~/.copilot`
- Gemini CLI: `~/.gemini`
- Roo Code: `~/.roo`
- Kiro: `~/.kiro`
- Cline: `~/.cline`
- OpenHands: `~/.openhands`
- Amp: `~/.config/amp`
- T3 Code: `~/.t3` (or `T3CODE_HOME`); installs skills into `~/.agents/skills`, which T3 Code reads for every provider
- Shared Agent Skills standard: `~/.agents` (read by Cursor, opencode, GitHub Copilot, Gemini CLI, Roo Code, OpenHands, Windsurf, Amp, T3 Code, and other compatible clients)

A user-level folder is only used when it already exists, except that a detected T3 Code install makes `~/.agents/skills` the install target because it is the only folder T3 Code reads without third-party extensibility. When `~/.agents` exists, sync installs there and skips the per-harness folders whose clients already read `~/.agents/skills` (Codex, opencode, Cursor, Windsurf/Cascade, GitHub Copilot, Gemini CLI, Roo Code, OpenHands, and Amp); managed folders left in a skipped location are removed so the client stops showing a stale duplicate. Targets not configured to read `~/.agents` (Claude, Kiro, Cline, and the Antigravity folders) keep their own copy. Because opencode, Cursor, Amp, and Windsurf also read `~/.claude/skills`, they can still see a managed skill from both `~/.agents` and Claude's folder. Use `npx yeknal skills --skip-claude` to also skip Claude Code's folder and clean its managed copies, preventing that duplicate. Personal folders are preserved.

Git is optional and is used only if the GitHub download path is rate-limited.
Project-level sync requires the current directory to be inside a Git repository.
Repository-scoped loading and asset materialization also use Git to resolve the
active project. Without Git, direct catalog/cache loading creates no project files.

## Quick start

### Minimal automatic discovery

Yeknal 2.4.1 adds compatibility adapters for the previously supported local
agent harnesses. See the CLI documentation for automatic and manual connection
details and the runtime verification limits.

~~~bash
npx yeknal setup
npx yeknal setup --agents all
npx yeknal setup --keep-archived
npx yeknal search "accessible React animation" --json
npx yeknal load yeknal-animate --json
npx yeknal setup --backups --json
npx yeknal setup --restore BACKUP_ID --json
npx yeknal setup --remove --agents codex,claude,opencode
~~~

Setup keeps one short global bootstrap per connected local harness, plus a
cached CLI runtime. With no agent list it connects every detected agent, so no
prompt is needed; `--agents` still selects an exact list.
Archived skills listed in `archived.json` are retired by default across every
configured global skill root, each with a recoverable backup that
`setup --restore` returns; pass `--keep-archived` to retain them.
It recognizes every previously supported harness and reports
manual steps where no automatic global instruction surface is available.
Gemini CLI and Antigravity share one connection when they use the same global
instruction root; redirected Gemini CLI homes require manual Antigravity setup.
Greetings, simple
questions, and trivial tasks skip discovery. Substantive tasks search compact
metadata and read only the selected instructions and needed supporting files.
There is no global router SKILL.md or full catalog in agent context.

Catalog skills remain available by default. After verifying search/load in a
fresh native agent session, use setup --agents NAME --migrate to back up eligible
dedicated collections. Only selected agents whose instruction files were safely
prepared can migrate; shared folders, unselected agents, manual fallbacks, and
failed connections stay available. A prefix alone does not establish ownership;
ambiguous identities, symlinks, unrelated skills, project-local folders, and
backup failures are preserved and reported. The shared cache and backups sit
outside every native skill-discovery path. Restore is explicit and never
overwrites an existing target. Setup removal retains backup/cache data.

Run loading from the active repository. Its actual Git root bounds project
overrides, so another repository's overrides cannot leak into the request.
Plain loads create no native skill inventory or project files. Only explicit
materialize/all-resources requests copy executable supporting trees into
.yeknal/resources; resources clean removes unchanged managed assets. Outside a
repository, lightweight loading works without creating project files.

Manual installation stays available. Deliberate global skills installs and
restored backups remain available unless eligible migration is requested. Automatic
behavior depends on the agent following its bootstrap and having command/file
access. New sessions may be needed. See the [CLI documentation](yeknal-cli/README.md)
for supported configurations, backup/restore, cache expiry, and verification limits.

Distribution uses public GitHub static files and npm, with immutable revisions,
hash checks, and shared offline caching. No account, API key, backend, paid
dependency, or LLM search service is required. GitHub/npm public-service limits
still apply; cache reuse is not unlimited free capacity. Future scale should be
measured before choosing mirrors or hosting with explicit cost budgets.

### Deliberate manual installation

~~~bash
npx yeknal skills
npx yeknal skills --project --profile design
npx yeknal skills --project --add --skills slopscan
npx yeknal profiles
npx yeknal security
~~~

| Command | Result |
| --- | --- |
| `npx yeknal skills` | Syncs the 15-skill core profile into detected user-level agent folders, including shared UI/UX guidance and common motion design and review skills. |
| `npx yeknal skills --skip-claude` | Avoids duplicate managed skills in OpenCode and other Claude-compatible readers by skipping and cleaning managed copies from `~/.claude/skills`. |
| `npx yeknal skills --project --profile design` | Syncs the design specialist pack into the current repository's `.agents/skills`. |
| `npx yeknal skills --project --profile process` | Syncs the optional process and domain-modeling workflows into the current repository. |
| `npx yeknal skills --profile core,web --project` | Combines exact profiles for one repository. |
| `npx yeknal skills --skills design-reference-research,prototype --project` | Syncs only those named skills into one repository. |
| `npx yeknal skills --project --add --skills slopscan` | Adds missing skills to the current repository without deleting or replacing existing skills. |
| `npx yeknal skills --project --add --prune-archived --skills slopscan` | Same additive sync, plus removal of retired skills listed in `archived.json`. |
| `npx yeknal skills --all` | Syncs every published skill (57 folders) for legacy or exhaustive setups. |
| `npx yeknal profiles` | Lists available profiles, sizes, and skill names without downloading skills. |
| `npx yeknal security` | Syncs the four security skills, scans the current folder, and writes text, JSON, and SARIF reports. |
| `npx yeknal slopscan` | Scans the current folder for AI-slop indicators and writes a readable log and a JSON report with fixes. |

`yeknal@2.8.0` defaults to the 15-skill core profile, including shared UI/UX guidance and common motion design and review workflows.

### Install with skills.sh

The catalog is published to the [skills.sh](https://skills.sh) directory under unique `yeknal-*` slugs. The `skills/` folder holds the published set (57 skills); internal specialists remain installable with `npx yeknal skills` but are hidden from skills.sh discovery.

```bash
npx skills add tryraisins/MD_Files --list
npx skills add tryraisins/MD_Files --skill yeknal-frontend-design
```

## Sync behavior

- Skills are pulled from `skills/yeknal-*/` in this repository on `main`.
- Version 2 defaults to `core`; `all` preserves the former full-catalog behavior.
- Skill folders already carry the `yeknal-` prefix, so installed folder names match the catalog names; the CLI treats an existing prefix as final.
- User scope syncs every detected agent folder: Codex, Claude, Gemini Antigravity/Antigravity, opencode, Cursor, Windsurf/Cascade, GitHub Copilot, Gemini CLI, Roo Code, Kiro, Cline, OpenHands, Amp, T3 Code, and the shared `~/.agents` standard. When `~/.agents` is present it is preferred (a detected T3 Code install also makes it the target), the overlapping per-harness folders are skipped, and their stale managed `yeknal-*` folders are removed. Project scope targets the current Git repository's `.agents/skills` folder, which Codex, Cursor, opencode, Roo Code, OpenHands, T3 Code, and other compatible clients scan from the working directory up to the repository root.
- Profiles are exact sets. Combine them with commas; named `--skills` are also exact and do not add core implicitly, so project installs need not duplicate a user-level core profile.
- Manual core installs no longer include a skill router. Setup adds a short bootstrap to search/load directly without native installation and preserves existing routers by default. Explicit eligible `--migrate` requests back them up with their dedicated collections. Older manual workflows retain additive project installation with `--project --add`.
- `npx yeknal security` installs `yeknal-application-security`, `yeknal-security-best-practices`, `yeknal-security-ownership-map`, and `yeknal-security-threat-model`.
- `npx yeknal slopscan` scans locally only. It makes no network requests and installs no skills.
- `SEO` remains source/reference material and is not installed because it has no `SKILL.md` entry point.
- Missing `skills` folders are created inside detected agent parent folders.
- Managed `yeknal-*` folders are updated or removed as the repository changes.
- Retired skills are pruned by name from `archived.json` (generated from `archive/skills/`) before syncing. A normal profile sync always prunes them; `--project --add` stays additive unless `--prune-archived` is also passed.
- A profile that references a skill the repository no longer publishes now warns and continues instead of aborting the sync, so an older CLI version cannot block installation. An explicitly named missing skill still fails.
- Personal folders without the `yeknal-` prefix are left untouched.

## Capability profiles

The global core is deliberately small: 15 entries a developer needs across unrelated projects. Its 15 entries cover:

- process and delivery: implementation, review, diagnosis, finalization, project handoff, domain modeling, multi-agent orchestration, and an ambition pass that raises a brief to expert standard before work starts;
- navigation: a model-free code index for entering a large repository without spending turns on guessed searches;
- design: visual direction, redesign of an existing product, and the shared UI quality floor;
- security: cross-stack application security for secure implementation and review;
- verification: the end-to-end testing policy;
- documentation: Markdown maintenance.

Git operations and real-browser automation moved to the `process` pack: both are task-level tools rather than cross-project defaults, and the ambition pass took the freed slot.

Specialist packs add depth without forcing every style, platform, integration, or media workflow into every agent prompt:

| Profile | Skills | Purpose |
| --- | ---: | --- |
| `core` | 15 | Cross-project process, reasoning, design, security, verification, documentation, and code navigation. |
| `process` | 11 | Agent cost, Git operations, browser automation, delivery extras, legacy sweeps, GitHub, and verification upkeep beyond core. |
| `design` | 22 | Specialist visual styles, motion, prototyping and design evidence. |
| `security` | 5 | The five distinct security output contracts. |
| `web` | 5 | Specialist SEO, agent readability, performance, launch readiness and production errors beyond core. |
| `platform` | 2 | Deployment routing and launch readiness. |
| `all` | 57 | Every catalog entry; use when discovery cost is acceptable. |

Design is consolidated at the routing layer rather than flattened into one oversized skill. `yeknal-frontend-design`, `yeknal-ui-quality-baseline`, `yeknal-design-reference-research`, `yeknal-redesign-existing-projects` and the shared motion workflows (`yeknal-animate`, `yeknal-animate-expo`, `yeknal-apple-design`, `yeknal-improve-animations`, `yeknal-review-animations`) provide the core paths. Aesthetic systems, prototyping and mobile workflows remain in the design pack because their triggers and output contracts differ. Deploy is one router (`yeknal-deploy`) that reads the provider from repository configuration, because four descriptions that all matched "deploy this" cost more in routing accuracy than they returned. Security keeps five folders for the same reason: implementation, review, auditing, threat modeling, and ownership analysis are not interchangeable artifacts.

## Selection and precedence

Use the narrowest applicable skill. When guidance conflicts, follow this order:

1. explicit user requirements and approved artifacts;
2. repository instructions and existing design systems;
3. focused design, framework, provider, or command skills;
4. shared baselines such as `yeknal-ui-quality-baseline`, `yeknal-application-security`, and `yeknal-markdown-management`;
5. generic specialist routers or personas.

The consolidated routers are `yeknal-orchestration-specialists` and `yeknal-research-analysis`. They reduce duplicate persona skills without overriding more specific instructions. The former `yeknal-engineering-specialists` persona router was archived in the October 2026 audit: it had no entry gate, restated what the model already knows, and recommended unit tests against repository policy.

## Notable skill groups

### Design and motion

- `yeknal-frontend-design`: compact anti-generic frontend direction adapted from Anthropic's current frontend skill.
- `yeknal-design-reference-research`: converts live products, galleries, flows, and source registries into an evidence ledger, product-specific thesis, rejection list, and responsive implementation brief.
- `yeknal-human-ai-interface-design`: trustworthy AI suggestions, generation, retrieval, agents, approvals, provenance, recovery, and reliance-focused evaluation.
- `yeknal-design-taste-frontend`: the detailed local design system for expressive, non-templated interfaces. The `v1` compatibility copy is archived; its three dials live in that skill's references.
- `yeknal-high-end-visual-design`, `yeknal-minimalist-ui`, `yeknal-industrial-brutalist-ui`: specialist art-direction and design-system workflows. `yeknal-gpt-taste` is archived; its legacy name is recorded in catalog metadata rather than kept as a routing entry.
- `yeknal-ui-quality-baseline`: the shared UI contract for all core agents, including a durable `DESIGN.md`, coherent tokens, accessible responsive layouts, complete interaction and loading states, a mobile web platform layer (sticky hover, tap flash, dynamic viewport units, input zoom, overscroll, safe areas, and real-hardware verification), end-to-end user-flow checks, rendered QA, and public-site launch checks for links, page metadata, favicon, buttons, and placeholder copy.
- `yeknal-mobile-app-design`: native mobile screen and flow implementation with optional Appllama reference research; it delegates motion-only work to `yeknal-animate-expo`.
- `yeknal-animate`, `yeknal-animate-expo`, and the animation review skills: interaction and motion craft. The Emil Kowalski reference material now lives inside `yeknal-animate/references/`.
- `yeknal-break-ui`: adversarial worst-case data stress testing that renders demo and edge-case fixtures behind a dev-only toggle and reports each break with its fix; it complements the shared baseline's mobile web platform layer rather than duplicating it.
- `yeknal-oil-motion`: a specialized workflow for generated or captured frame-based interactive media, adapted from `oil-oil/oil-motion`.
- `yeknal-pick-ui-library`: dependency-aware component selection with Rare UI, beUI, Spectrum UI, and Spell UI treated as inspectable source registries, not default dependencies.

### Research and response modes

- `yeknal-ambition`: the pre-flight pass that decides whether a brief is already at expert standard, and when it is not, names the bottleneck, the raw material, the method and the outside check. It offers the bigger option rather than taking it, and most briefs correctly get no pass at all.
- `yeknal-research-analysis`: the canonical research workflow. Explicit deep-research requests load a focused reference for resumable evidence ledgers, claim verification, saturation-based stopping, and evidence-only follow-up instead of adding a second research skill.

### Markdown and implementation commands

- `yeknal-markdown-management`: create, update, merge, split, rename, and audit Markdown and skill folders without losing authority, links, anchors, or provenance.
- `yeknal-implement`, `yeknal-review`, `yeknal-troubleshoot`, `yeknal-git`, `yeknal-finalize`, and `yeknal-add-changelog`: focused command workflows that defer to repository evidence and specialist skills. Cleanup now lives inside `yeknal-legacy-sweep`.
- `yeknal-domain-modeling`: opt-in glossary and ADR practice for resolving domain language and recording only durable, consequential decisions.

Run the local structural audit with:

```powershell
pwsh -NoProfile -File .\skills\yeknal-markdown-management\scripts\audit-skills.ps1 -Root .
pwsh -NoProfile -File .\skills\yeknal-markdown-management\scripts\audit-markdown-links.ps1 -Root .
```

Audit duplicate names across installed Codex, Claude, and shared skill roots without deleting personal skills:

```powershell
pwsh -NoProfile -File .\skills\yeknal-markdown-management\scripts\audit-installed-skill-conflicts.ps1
```

### Security

- `yeknal-application-security`: cross-stack secure-by-design baseline and `Security-Master.md` reference.
- `yeknal-security-best-practices`: focused repository security review.
- `yeknal-security-threat-model`: trust-boundary and abuse-case threat modeling, including AI and agentic systems.
- `yeknal-security-ownership-map`: sensitive-code ownership and concentration analysis.

The guidance covers current OWASP web/API risks, secure authentication and password storage, software supply chains, exceptional conditions, and prompt/tool/agent boundaries. Static checks are evidence, not proof of live authorization, deployment, tenant, browser, or provider behavior.

Security scan checks use stable IDs and link to current `Security-Master.md` anchors. The CLI writes `yeknal-security.log`, `yeknal-security.json`, and SARIF 2.1.0 `yeknal-security.sarif`; all three are ignored by Git by default.

### Launch readiness

`yeknal-launch-readiness` runs once per product, not per change, against the obligations that begin when a stranger can reach it. It covers the legal surfaces (data collected, third-party embeds and transfers, minors, marketing email, subscriptions and payments, user content, accessibility, AI features, breach response, vendors) and the seven engineering gates no other skill owns: database access rules, a restore that was actually tested, a performance budget measured on a mid-tier phone, email sender authentication, cost caps with a per-user quota, a rollback plan that includes migration reversibility, and consent-gated analytics.

Nigeria leads the jurisdiction matrix because the NDPA follows the data subject, so a product with no Nigerian entity still owes Nigerian users the full set of duties, and the NDPC GAID filing cycle applies to small teams. The matrix then covers EU/EEA, UK, US federal, and US California, and tells the agent how to extend it rather than improvising.

The skill is read-only by default and explicitly not legal advice. It never presents a statutory maximum as a likely outcome, marks anything unverifiable as `unassessed`, and refuses the word "compliant". Everything already owned by `yeknal-application-security`, `yeknal-sentry`, `yeknal-ui-quality-baseline`, `yeknal-content-seo`, the deployment skills, or the testing skills is cross-referenced rather than restated.

### SEO discovery

`yeknal-content-seo` includes an IndexNow workflow for changed-URL notification and conditionally evaluates whether a public AI-readable brand facts page fills a real search-information gap. It does not claim such a page or `/llms.txt` improves AI Overview placement. The skill treats submission, crawling, indexing, ranking, and AI citations as separate proof boundaries.

`yeknal-agent-readable-site` owns the delivery layer those decisions ship through: a markdown version of every public page through three access paths, one renderer registry, code-generated `llms.txt`, `llms-full.txt` and `ai.txt`, the head signals, and an AI crawler policy split into answer-engine indexers, user-initiated fetchers and training controls. It opens with a platform tier check, because a static host cannot negotiate content types or set response headers, and the bundled zero-dependency checker reports a host-blocked requirement as unsupported instead of passing it. The checker's coverage mode follows a split sitemap into its children and fails when a public route has no markdown version. Two things it refuses to encode: the stale bracketed `ai.txt` format that the source prompt still uses, and any claim that publishing these files produces a citation.

### Agent cost control

`yeknal-agent-cost-control` treats an inference bill as a design outcome rather than a provider price list. It reads per-session usage from the harness log, ranks sessions by cost, and then changes one lever: calls per session, content per call, tool surface, or model and effort. Cache work is explicitly conditional, because a setup already at a high cache-read share gains almost nothing from reordering prompts. A cheaper model is never accepted on cost alone: the outcome check counts findings that led to a change rather than findings reported, since a fall in reported problems is equally consistent with noise removed or real problems lost.

### Code navigation

`yeknal-code-graph` builds a local, model-free index of a repository and answers with one ranked, budgeted slice instead of a sequence of guessed searches. It is deliberately not GraphRAG: nothing is extracted by a model, so building costs no tokens. Its own measurements are published with it, including the recall it misses against plain `grep`, because the honest claim is fewer orientation turns in a large repository, not an escape from a usage limit.

## Upstream review

The 2026-10-03 refresh reviewed [emilkowalski/skills](https://github.com/emilkowalski/skills) at `e8a175de22ae1e49370fc144c1f3bb9aeedf988d`. The catalog already carried 12 of its 14 skills. Its two newest were incorporated without duplicating existing capability:

- `break-ui` becomes `yeknal-break-ui`: an adversarial worst-case data stress test with a bundled worst-case catalog, added to core because it verifies the shared UI contract.
- `mobile-native` is folded into the shared `yeknal-ui-quality-baseline` as the mobile web platform layer, and the mobile screen skill routes to it; no separate skill was created. Motion, gesture, and React Native work continue to route to `yeknal-animate` and `yeknal-animate-expo`.

The 2026-10-07 workflow review examined [mattpocock/skills](https://github.com/mattpocock/skills) at `f3fc5632f401156837ee3872f14fe33ccf1024ea`. Its domain-modeling practice informed `yeknal-domain-modeling`, an independently written glossary/ADR workflow with no source text copied.

The 2026-10-23 review examined pstack in [cursor/plugins](https://github.com/cursor/plugins/tree/main/pstack) at `4ec7ffa173eaa70d3d9467a627baf0954645a353`. Two behavioral-verification workflows were adapted as `yeknal-verification-harness` and `yeknal-verification-audit`, both in the `process` profile: the first generates a project-local skill with launch, doctor, drive, evidence, cleanup, and a feature map; the second keeps that map honest with one live pass and now lives inside that skill as `references/upkeep.md`. Upstream is MIT (Copyright 2026 Lauren Tan), so each skill bundles the notice. Two upstream behaviors changed. The hardcoded `.cursor/skills/verify-<app>/` path becomes the project's own skill directory with `.agents/skills/` as the neutral fallback, and the `disable-model-invocation` flag becomes explicit-only wording in the description, because this catalog's frontmatter contract allows only known fields. The formal-verification pair (model checkers, provers, TLA+) was reviewed and left out: it pays off only where concurrency, parsers, or invariants exceed what tests reach, and carrying it across a design-and-product catalog would add upkeep without demand.

The 2026-10-24 review examined [cloudflare/security-audit-skill](https://github.com/cloudflare/security-audit-skill) at `c1c8a8c1471069fb0e188eeaff69b8e8db6564a8` and adapted it as `yeknal-security-audit` in the `security` profile. Upstream is MIT (Copyright 2025-2026 Cloudflare, Inc.), so the skill bundles the notice. The six-phase engine, coverage ledger, findings schema, and both zero-dependency validators are carried over; the domain attack-class companions move under `references/`. Three upstream behaviors changed. Its platform-neutral `research` and `general` roles are bound to this harness's real lanes, because an unbound role name silently collapses the audit into one context. Its OS-sandbox requirement is stated as source-only on Windows rather than quietly assumed, so behavioral leads stay `needs_validation` instead of being guessed. Both validators are patched for Windows, where upstream rejects every input because `O_NOFOLLOW` and `O_NONBLOCK` are unavailable; the local build keeps every other input check and only loses the race-free read. Its two validator test files are not shipped, since this catalog does not carry unit suites inside skills and the pinned commit makes re-vendoring a diff. The four existing security skills were retargeted in the same change so that exactly one skill owns a full audit.

The 2026-10-26 review examined [DannyMac180/skills `be-ambitious`](https://github.com/DannyMac180/skills/tree/main/be-ambitious) at `a4e95dddae3015971397c61923175950a9fa2f76` (MIT, Copyright 2026 Dan McAteer) and Felix Rieseberg's [How to be more ambitious](https://felixrieseberg.com/how-to-be-more-ambitious-a-tutorial-for-humans-with-models/) (13 October 2026). One core skill was added: `yeknal-ambition` owns reframing a brief before work starts, which no other skill did. The port keeps the four-question depth pass and the deeper-not-bigger rule; altitude, range, the contract boundary and the outside-check rule are original synthesis, because the upstream skill covers depth only and stops after rewriting. The core profile gave up `yeknal-git` and `yeknal-playwright` to make room, and both moved to the `process` pack.

The 2026-10-25 design review examined [ibelick/ui-skills](https://github.com/ibelick/ui-skills), [nutlope/hallmark](https://github.com/nutlope/hallmark) (MIT), and the new `animation-performance` skill in [emilkowalski/skills](https://github.com/emilkowalski/skills), alongside roughly twenty component registries and galleries. One skill was added: `yeknal-design-system`, which owns token layers, hardcoded-value mapping, component specs and migration, because the catalog demanded a `DESIGN.md` and supplied no method to build the system behind it. The rest landed as references inside existing skills rather than new skills: OKLCH color, typography, icons, effects and blends, component patterns, data display, account and money flows, motion principles, frame budget, and rendered video. Hallmark's contribution was method, not text: its rule-identifier scheme, the dealt direction that stops consecutive builds converging, its precision AI-tell list, and above all its eval harness, which informed `tools/design-eval` (briefs, a blind judge, and a scorecard). No component registry became a default; React Bits is recorded as MIT plus a Commons Clause restriction like Rare UI, and Shaders, snapcn and Arc UI are library references only.

The 2026-09-12 refresh additionally reviewed:

- `anthropics/skills` at `41bbe19d1a1a7eaab5e7bb9050a417e5c6cffc8f`;
- `openai/plugins` at `1e285826e604f66f7208f7ac4dba0fe8341d1f57`;
- `oil-oil/oil-motion` at `eafd4a45dc9c996489df3c54ac4ebdcde2bd030b`;
- `swamimalode07/rare-ui` at `b3efd6c290884a852b7af39d34df99a762dbbf3f` (MIT + Commons Clause + Attribution; attribution and a visible rareui.com link are required when a component ships);
- `NeetigyaShah/deep-research` at `201dc0e0366f1108ba94f0f422a9ccaecb733b21`;
- `ayghri/i-have-adhd` at `58494af57962b2d7a996b4d419474380a299af5e`;
- `Appllama/appllama-skills` at `dd5caaec3d5d50ad7fc0324da238119c6b7c3707`;
- `xxtomm/spell-ui` at `fffe96db7b67b44243bf35815916fdfc58fe5014`.
- `ibelick/ui-skills` at `f5dd1de9c0fc6c033a43dc3fd2a5be41366e9f43`;
- `pipethedev` TypeScript Anti-Slop gist at `165357e91adc1367ef3ecccc9634bfe2e2d968c4`;
- `pipethedev` Python Anti-Slop gist at `313007ca4ce40384272320f2c984a651610969b9`;
- `pipethedev` Go de-slop gist at `42f9a8e8f7006e3f377187841406ed37daa3276f`;
- `jbarbier/CLAUDE.md` at `02ddd29be403278cfa068ffd54e247bb1f5a1b9f`;
- OpenAI's [Rethinking skills and prompts for GPT-6 Astra](https://developers.openai.com/blog/rethinking-skills-and-prompts-for-gpt-6-astra), published 2026-09-11.

Upstream material is adapted selectively. Existing local specialist design and command instructions win where generic upstream guidance conflicts.

Deep Research is incorporated as a mode of `yeknal-research-analysis`; its separate follow-up entry point is unnecessary because the canonical mode already includes evidence-only follow-up. AppLlama's two upstream skills are consolidated into `yeknal-mobile-app-design`, with MCP research instructions loaded only when that service is connected. The ADHD-friendly response contract remains one explicit-only skill because it changes conversation behavior rather than research, UI, or implementation behavior.

The UI review is indexed in [`skills/yeknal-design-reference-research/references/source-atlas.md`](skills/yeknal-design-reference-research/references/source-atlas.md). It separates live-product evidence, galleries, motion clips, platform guidance, and source-code registries; rendered desktop/mobile checks and access limitations are recorded without treating attractive screenshots as usability proof.

The latest review selectively strengthens existing entries instead of adding duplicate bundles: `yeknal-ui-quality-baseline`, `yeknal-design-reference-research`, and `yeknal-content-seo` cover UI repair, design-rule evidence, and page metadata; `yeknal-review` adds language-specific simplification checks for TypeScript, Python, and Go (the `yeknal-engineering-specialists` persona router that also carried them was archived in October 2026, with the checks kept in review); `yeknal-implement` and `yeknal-markdown-management` separate judgment from repeatable verification work, preserve short discriminating skill triggers, and route detail progressively. Current `yeknal-animate` already provides a stricter motion-performance contract, so the external motion checklist was reviewed without duplication. Guidance was independently adapted; no upstream instructions override repository, project, or user authority.

## Validation and releases

GitHub Actions validates skill structure, relative Markdown links, CLI tests, package contents, and changed-file whitespace on pushes and pull requests. It also runs `node tools/verify-skill-references.js`, which fails when a skill body, `site/presentation.json`, `skills.sh.json`, `profiles.json`, `llms.txt` or a routing case names a skill that does not exist, when a presentation entry uses an undeclared task, or when a catalog skill is in no profile. That is the guard against a removed skill lingering in prose or metadata, which the structure audits cannot see. The npm trusted-publishing workflow is prepared but remains dormant until the package has a matching OIDC connection and the repository variable `NPM_TRUSTED_PUBLISHING_ENABLED` is set to `true`. Until then, package owners publish from an authenticated local npm client; no npm write token is stored in GitHub.

### Portfolio skills library

The library at [tryraisins.dev/skills](https://tryraisins.dev/skills/) is generated from this catalog. Visitor-facing titles, tasks, examples and attribution live in [`site/presentation.json`](site/presentation.json); a new skill without an entry still appears using its name and description, and CI rejects entries for skills that no longer exist. Whoever publishes catalog changes also syncs the portfolio, in this order:

1. Commit skill changes, run `node tools/build-catalog.js`, and commit the regenerated catalog.
2. Update `site/presentation.json` for added, renamed (`previousNames`) or removed skills, and run `node tools/sync-portfolio.js --validate`.
3. Push to `main` and wait for the validation workflow to pass.
4. Run `node tools/sync-portfolio.js --portfolio ../../Portfolio/my-portfolio`, then build, check, commit and push the portfolio as its handoff describes.

The sync reads only committed, pushed objects and refuses stale catalogs, unpublished commits, unknown references and missing license credits; [`tools/portfolio-sync-failure-modes.md`](tools/portfolio-sync-failure-modes.md) lists every check. Deleted skills disappear from the portfolio on the next sync, renamed ones keep a redirect, and `--ref <commit>` re-syncs an earlier published catalog as a rollback.

`evaluations/skill-routing.json` records high-value routing and precedence cases. CI validates the dataset and referenced skills; model-level activation scoring remains a separate behavioral evaluation boundary.

## Credits

This catalog adapts and consolidates work from many upstream authors. Full source, license, and notice details are in [`PROVENANCE.md`](PROVENANCE.md). Principal upstreams include:

- Anthropic ([anthropics/skills](https://github.com/anthropics/skills), Apache-2.0) for `yeknal-frontend-design` and the document skills.
- Leonxlnx ([leonxlnx/taste-skill](https://github.com/leonxlnx/taste-skill), MIT) for the taste-skill design derivatives.
- Emil Kowalski ([emilkowalski/skills](https://github.com/emilkowalski/skills), MIT) for the motion craft bar now carried by `yeknal-animate`, `yeknal-break-ui`, and the motion review skills, with the mobile-native web guidance folded into `yeknal-ui-quality-baseline`.
- Appllama (MIT), [oil-oil/oil-motion](https://github.com/oil-oil/oil-motion) (MIT), [ayghri/i-have-adhd](https://github.com/ayghri/i-have-adhd) (MIT), and NeetigyaShah/deep-research (MIT).
- Lauren Tan's [pstack](https://github.com/cursor/plugins/tree/main/pstack) (MIT) for `yeknal-verification-harness`, which now also carries the upkeep loop from the former `yeknal-verification-audit`.
- Vercel, Cloudflare, Netlify, Render, Sentry and GitHub for the deploy and operations skills retained in the catalog.
- Rare UI (MIT + Commons Clause + Attribution), referenced for component selection; not vendored. Any project that installs a Rare UI component must retain its notice and add a README credit linking to [rareui.com](https://www.rareui.com).

## License

ISC. Imported or adapted skills retain their upstream license files where required.

Rare UI component source is not vendored in this catalog. Any project that installs a Rare UI component must keep its notice in the copied source and add a README credit linking to rareui.com (MIT + Commons Clause + Attribution).
