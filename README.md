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
- Shared Agent Skills standard: `~/.agents` (read by Cursor, opencode, GitHub Copilot, Gemini CLI, Roo Code, OpenHands, Windsurf, Amp, and other compatible clients)

A user-level folder is only used when it already exists. When `~/.agents` exists, sync installs there and skips the per-harness folders whose clients already read `~/.agents/skills` (Codex, opencode, Cursor, Windsurf/Cascade, GitHub Copilot, Gemini CLI, Roo Code, OpenHands, and Amp); managed folders left in a skipped location are removed so the client stops showing a stale duplicate. Targets not configured to read `~/.agents` (Claude, Kiro, Cline, and the Antigravity folders) keep their own copy. Because opencode, Cursor, Amp, and Windsurf also read `~/.claude/skills`, they can still see a managed skill from both `~/.agents` and Claude's folder. Use `npx yeknal skills --skip-claude` to also skip Claude Code's folder and clean its managed copies, preventing that duplicate. Personal folders are preserved.

Git is optional and is used only if the GitHub download path is rate-limited.
Project-level sync requires the current directory to be inside a Git repository.
Repository-scoped loading and asset materialization also use Git to resolve the
active project. Without Git, direct catalog/cache loading creates no project files.

## Quick start

### Minimal automatic discovery

~~~bash
npx yeknal setup
npx yeknal setup --agents codex,claude,opencode
npx yeknal search "accessible React animation" --json
npx yeknal load yeknal-animate --json
npx yeknal setup --backups --json
npx yeknal setup --restore BACKUP_ID --json
npx yeknal setup --remove --agents codex,claude,opencode
~~~

Yeknal 2.4.0 keeps one short global bootstrap per connected Codex, Claude Code,
or OpenCode V2 installation, plus a cached CLI runtime. Greetings, simple
questions, and trivial tasks skip discovery. Substantive tasks search compact
metadata and read only the selected instructions and needed supporting files.
There is no global router SKILL.md or full catalog in agent context.

Setup migrates identified global Yeknal catalog skills and superseded routers
from shared and agent-specific locations into verified recoverable backups,
including customized contents. A prefix alone does not establish ownership;
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

Manual installation stays available. A later deliberate global skills command
can recreate collections; setup will migrate recognized copies again. Automatic
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
npx yeknal skills --project --add --skills aspnet-core
npx yeknal profiles
npx yeknal security
~~~

| Command | Result |
| --- | --- |
| `npx yeknal skills` | Syncs the 37-skill core profile into detected user-level agent folders, including shared UI/UX guidance and common motion design and review skills. |
| `npx yeknal skills --skip-claude` | Avoids duplicate managed skills in OpenCode and other Claude-compatible readers by skipping and cleaning managed copies from `~/.claude/skills`. |
| `npx yeknal skills --project --profile design` | Syncs the design specialist pack into the current repository's `.agents/skills`. |
| `npx yeknal skills --project --profile process` | Syncs the optional process and domain-modeling workflows into the current repository. |
| `npx yeknal skills --profile core,web --project` | Combines exact profiles for one repository. |
| `npx yeknal skills --skills nextjs-developer,vercel-deploy --project` | Syncs only those named skills into one repository. |
| `npx yeknal skills --project --add --skills aspnet-core` | Adds missing skills to the current repository without deleting or replacing existing skills. |
| `npx yeknal skills --all` | Syncs all 89 skills for legacy or exhaustive setups. |
| `npx yeknal profiles` | Lists available profiles, sizes, and skill names without downloading skills. |
| `npx yeknal security` | Syncs the four security skills, scans the current folder, and writes text, JSON, and SARIF reports. |

`yeknal@2.4.0` defaults to the updated 37-skill core profile, including shared UI/UX guidance and common motion design and review workflows.

### Install with skills.sh

The catalog is published to the [skills.sh](https://skills.sh) directory under unique `yeknal-*` slugs. The `skills/` folder holds the published set (54 skills); internal specialists remain installable with `npx yeknal skills` but are hidden from skills.sh discovery.

```bash
npx skills add tryraisins/MD_Files --list
npx skills add tryraisins/MD_Files --skill yeknal-frontend-design
```

## Sync behavior

- Skills are pulled from `skills/yeknal-*/` in this repository on `main`.
- Version 2 defaults to `core`; `all` preserves the former full-catalog behavior.
- Skill folders already carry the `yeknal-` prefix, so installed folder names match the catalog names; the CLI treats an existing prefix as final.
- User scope syncs every detected agent folder: Codex, Claude, Gemini Antigravity/Antigravity, opencode, Cursor, Windsurf/Cascade, GitHub Copilot, Gemini CLI, Roo Code, Kiro, Cline, OpenHands, Amp, and the shared `~/.agents` standard. When `~/.agents` is present it is preferred, the overlapping per-harness folders are skipped, and their stale managed `yeknal-*` folders are removed. Project scope targets the current Git repository's `.agents/skills` folder, which Codex, Cursor, opencode, Roo Code, OpenHands, and other compatible clients scan from the working directory up to the repository root.
- Profiles are exact sets. Combine them with commas; named `--skills` are also exact and do not add core implicitly, so project installs need not duplicate a user-level core profile.
- Manual core installs include `yeknal-skill-router`. Automatic setup migrates that router with recognized global collections and uses a short bootstrap to search/load directly without native installation. Older manual workflows retain additive project installation with `--project --add`.
- `npx yeknal security` installs `yeknal-application-security`, `yeknal-security-best-practices`, `yeknal-security-ownership-map`, and `yeknal-security-threat-model`.
- `SEO` remains source/reference material and is not installed because it has no `SKILL.md` entry point.
- Missing `skills` folders are created inside detected agent parent folders.
- Managed `yeknal-*` folders are updated or removed as the repository changes.
- Personal folders without the `yeknal-` prefix are left untouched.

## Capability profiles

The global core is intentionally broader than a minimal coding starter but smaller than the full catalog. Its 37 entries cover:

- process and reasoning management: brainstorming, research, orchestration/context management, implementation, review, diagnosis, cleanup, Git, finalization, documentation, test planning, and test auditing;
- canonical design: reference research, visual direction, UI quality, frontend implementation, redesign, mobile, motion, and human-AI interaction;
- security: secure implementation, focused framework review, threat modeling, and sensitive-code ownership;
- browser-based verification through Playwright.

Specialist packs add depth without forcing every style, platform, integration, or media workflow into every agent prompt:

| Profile | Skills | Purpose |
| --- | ---: | --- |
| `core` | 37 | High-frequency process, design, implementation, verification, and security. |
| `process` | 7 | Optional domain modeling, delivery, cleanup, GitHub, exhaustive-output, and response workflows beyond core. |
| `design` | 24 | Specialist visual styles, motion, prototyping, Figma, and image-led work. |
| `security` | 4 | The four distinct security output contracts. |
| `web` | 5 | Specialist web apps, frameworks, SEO, and production errors beyond core. |
| `platform` | 7 | Platform-specific engineering and deployment. |
| `documents-media` | 10 | Documents, data files, presentations, notebooks, image, audio, and video. |
| `productivity` | 5 | Linear and Notion workflows. |
| `openai` | 6 | OpenAI documentation and media-generation workflows. |
| `all` | 89 | Every catalog entry; use when discovery cost is acceptable. |

Design is consolidated at the routing layer rather than flattened into one oversized skill. `yeknal-frontend-design`, `yeknal-ui-quality-baseline`, `yeknal-design-reference-research`, `yeknal-redesign-existing-projects`, `yeknal-mobile-app-design`, `yeknal-human-ai-interface-design`, and the shared motion workflows (`yeknal-animate`, `yeknal-animate-expo`, `yeknal-apple-design`, `yeknal-emil-design-eng`, `yeknal-find-animation-opportunities`, `yeknal-improve-animations`, and `yeknal-review-animations`) provide the core paths. Aesthetic systems, prototyping, Figma, and image-led workflows remain in the design pack because their triggers and output contracts differ. The skill router still fetches a task-specific specialist when one is missing. Security keeps four folders for the same reason: implementation, review, threat modeling, and ownership analysis are not interchangeable artifacts.

## Selection and precedence

Use the narrowest applicable skill. When guidance conflicts, follow this order:

1. explicit user requirements and approved artifacts;
2. repository instructions and existing design systems;
3. focused design, framework, provider, or command skills;
4. shared baselines such as `yeknal-ui-quality-baseline`, `yeknal-application-security`, and `yeknal-markdown-management`;
5. generic specialist routers or personas.

The consolidated routers are `yeknal-engineering-specialists`, `yeknal-orchestration-specialists`, and `yeknal-research-analysis`. They reduce duplicate persona skills without overriding more specific instructions.

## Notable skill groups

### Design and motion

- `yeknal-frontend-design`: compact anti-generic frontend direction adapted from Anthropic's current frontend skill.
- `yeknal-design-reference-research`: converts live products, galleries, flows, and source registries into an evidence ledger, product-specific thesis, rejection list, and responsive implementation brief.
- `yeknal-human-ai-interface-design`: trustworthy AI suggestions, generation, retrieval, agents, approvals, provenance, recovery, and reliance-focused evaluation.
- `yeknal-design-taste-frontend` and `yeknal-design-taste-frontend-v1`: detailed local design systems for expressive, non-templated interfaces.
- `yeknal-high-end-visual-design`, `yeknal-minimalist-ui`, `yeknal-industrial-brutalist-ui`, and `yeknal-stitch-design-taste`: specialist art-direction and design-system workflows. `yeknal-gpt-taste` remains an explicit compatibility route to current guidance.
- `yeknal-ui-quality-baseline`: the shared UI contract for all core agents, including a durable `DESIGN.md`, coherent tokens, accessible responsive layouts, complete interaction and loading states, a mobile web platform layer (sticky hover, tap flash, dynamic viewport units, input zoom, overscroll, safe areas, and real-hardware verification), end-to-end user-flow checks, rendered QA, and public-site launch checks for links, page metadata, favicon, buttons, and placeholder copy.
- `yeknal-mobile-app-design`: native mobile screen and flow implementation with optional Appllama reference research; it delegates motion-only work to `yeknal-animate-expo` and image-only concepts to `yeknal-imagegen-frontend-mobile`.
- `yeknal-emil-design-eng`, `yeknal-animate`, `yeknal-animate-expo`, and the animation review skills: interaction and motion craft.
- `yeknal-break-ui`: adversarial worst-case data stress testing that renders demo and edge-case fixtures behind a dev-only toggle and reports each break with its fix; it complements the shared baseline's mobile web platform layer rather than duplicating it.
- `yeknal-oil-motion`: a specialized workflow for generated or captured frame-based interactive media, adapted from `oil-oil/oil-motion`.
- `yeknal-pick-ui-library`: dependency-aware component selection with Rare UI, beUI, Spectrum UI, and Spell UI treated as inspectable source registries, not default dependencies.

### Research and response modes

- `yeknal-research-analysis`: the canonical research workflow. Explicit deep-research requests load a focused reference for resumable evidence ledgers, claim verification, saturation-based stopping, and evidence-only follow-up instead of adding a second research skill.
- `yeknal-i-have-adhd`: an explicit-only, persistent response mode with action-first structure, bounded steps, visible state, and evidence-based time estimates.

### Markdown and implementation commands

- `yeknal-markdown-management`: create, update, merge, split, rename, and audit Markdown and skill folders without losing authority, links, anchors, or provenance.
- `yeknal-implement`, `yeknal-review`, `yeknal-troubleshoot`, `yeknal-cleanup`, `yeknal-git`, `yeknal-finalize`, and `yeknal-add-changelog`: focused command workflows that defer to repository evidence and specialist skills.
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

### SEO discovery

`yeknal-content-seo` includes an IndexNow workflow for changed-URL notification and conditionally evaluates whether a public AI-readable brand facts page fills a real search-information gap. It does not claim such a page or `/llms.txt` improves AI Overview placement. The skill treats submission, crawling, indexing, ranking, and AI citations as separate proof boundaries.

## Upstream review

The 2026-10-03 refresh reviewed [emilkowalski/skills](https://github.com/emilkowalski/skills) at `e8a175de22ae1e49370fc144c1f3bb9aeedf988d`. The catalog already carried 12 of its 14 skills. Its two newest were incorporated without duplicating existing capability:

- `break-ui` becomes `yeknal-break-ui`: an adversarial worst-case data stress test with a bundled worst-case catalog, added to core because it verifies the shared UI contract.
- `mobile-native` is folded into the shared `yeknal-ui-quality-baseline` as the mobile web platform layer, and the mobile screen skill routes to it; no separate skill was created. Motion, gesture, and React Native work continue to route to `yeknal-animate` and `yeknal-animate-expo`.

The 2026-10-07 workflow review examined [mattpocock/skills](https://github.com/mattpocock/skills) at `f3fc5632f401156837ee3872f14fe33ccf1024ea`. Its domain-modeling practice informed `yeknal-domain-modeling`, an independently written glossary/ADR workflow with no source text copied.

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

The latest review selectively strengthens existing entries instead of adding duplicate bundles: `yeknal-ui-quality-baseline`, `yeknal-design-reference-research`, and `yeknal-content-seo` cover UI repair, design-rule evidence, and page metadata; `yeknal-engineering-specialists` and `yeknal-review` add language-specific simplification checks for TypeScript, Python, and Go; `yeknal-implement` and `yeknal-markdown-management` separate judgment from repeatable verification work, preserve short discriminating skill triggers, and route detail progressively. Current `yeknal-animate` already provides a stricter motion-performance contract, so the external motion checklist was reviewed without duplication. Guidance was independently adapted; no upstream instructions override repository, project, or user authority.

## Validation and releases

GitHub Actions validates skill structure, relative Markdown links, CLI tests, package contents, and changed-file whitespace on pushes and pull requests. The npm trusted-publishing workflow is prepared but remains dormant until the package has a matching OIDC connection and the repository variable `NPM_TRUSTED_PUBLISHING_ENABLED` is set to `true`. Until then, package owners publish from an authenticated local npm client; no npm write token is stored in GitHub.

`evaluations/skill-routing.json` records high-value routing and precedence cases. CI validates the dataset and referenced skills; model-level activation scoring remains a separate behavioral evaluation boundary.

## Credits

This catalog adapts and consolidates work from many upstream authors. Full source, license, and notice details are in [`PROVENANCE.md`](PROVENANCE.md). Principal upstreams include:

- Anthropic ([anthropics/skills](https://github.com/anthropics/skills), Apache-2.0) for `yeknal-frontend-design` and the document skills.
- Leonxlnx ([leonxlnx/taste-skill](https://github.com/leonxlnx/taste-skill), MIT) for the taste-skill design derivatives.
- Emil Kowalski ([emilkowalski/skills](https://github.com/emilkowalski/skills), MIT) for `yeknal-emil-design-eng`, `yeknal-break-ui`, and the motion craft bar, with the mobile-native web guidance folded into `yeknal-ui-quality-baseline`.
- Appllama (MIT), [oil-oil/oil-motion](https://github.com/oil-oil/oil-motion) (MIT), [ayghri/i-have-adhd](https://github.com/ayghri/i-have-adhd) (MIT), and NeetigyaShah/deep-research (MIT).
- Microsoft, Figma, OpenAI, Notion, Vercel, Cloudflare, Netlify, Render, Sentry, Linear, and GitHub for provider and platform skills.
- Rare UI (MIT + Commons Clause + Attribution), referenced for component selection; not vendored. Any project that installs a Rare UI component must retain its notice and add a README credit linking to [rareui.com](https://www.rareui.com).

## License

ISC. Imported or adapted skills retain their upstream license files where required.

Rare UI component source is not vendored in this catalog. Any project that installs a Rare UI component must keep its notice in the copied source and add a README credit linking to rareui.com (MIT + Commons Clause + Attribution).
