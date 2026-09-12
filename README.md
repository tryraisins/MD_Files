# MD Files

A curated collection of reusable skill folders for AI coding agents. The collection favors specific design and command guidance over generic personas, uses progressive disclosure for long references, and keeps security guidance grounded in current primary sources.

## Requirements

`yeknal` does not need a global install. A new device needs Node.js with npm and internet access. User-level sync detects these supported agent folders:

- Codex: `~/.codex`
- Claude: `~/.claude`
- Gemini Antigravity: `~/.gemini/antigravity`
- Antigravity: `~/.antigravity`

Git is optional and is used only if the GitHub download path is rate-limited.
Project-level sync requires the current directory to be inside a Git repository.

## Quick start

```bash
npx yeknal skills
npx yeknal skills --project --profile design
npx yeknal profiles
npx yeknal security
```

| Command | Result |
| --- | --- |
| `npx yeknal skills` | Syncs the 25-skill core profile into detected user-level agent folders. |
| `npx yeknal skills --project --profile design` | Syncs the design specialist pack into the current repository's `.agents/skills`. |
| `npx yeknal skills --profile core,web --project` | Combines exact profiles for one repository. |
| `npx yeknal skills --skills nextjs-developer,vercel-deploy --project` | Adds exact skills to the default core profile in one repository. |
| `npx yeknal skills --all` | Syncs all 83 skills for legacy or exhaustive setups. |
| `npx yeknal profiles` | Lists available profiles and their sizes without downloading skills. |
| `npx yeknal security` | Syncs the four security skills, scans the current folder, and writes text, JSON, and SARIF reports. |

## Sync behavior

- Skills are pulled from this repository on `main`.
- Version 2 defaults to `core`; `all` preserves the former full-catalog behavior.
- Installed folders use the managed `yeknal-` prefix; `frontend-design` becomes `yeknal-frontend-design`.
- User scope syncs detected Codex, Claude, and Gemini/Antigravity skill folders. Project scope targets the current Git repository's `.agents/skills` folder, which Codex scans from the working directory up to the repository root.
- Profiles are exact sets. Combine them with commas; a non-core project pack can be installed without duplicating a user-level core profile.
- `npx yeknal security` installs `application-security`, `security-best-practices`, `security-ownership-map`, and `security-threat-model`.
- `SEO` remains source/reference material and is not installed because it has no `SKILL.md` entry point.
- Missing `skills` folders are created inside detected agent parent folders.
- Managed `yeknal-*` folders are updated or removed as the repository changes.
- Personal folders without the `yeknal-` prefix are left untouched.

## Capability profiles

The global core is intentionally broader than a minimal coding starter but smaller than the full catalog. Its 25 entries cover:

- process and reasoning management: brainstorming, research, orchestration/context management, implementation, review, diagnosis, cleanup, Git, finalization, and documentation;
- canonical design: reference research, visual direction, UI quality, frontend implementation, redesign, mobile, motion, and human-AI interaction;
- security: secure implementation, focused framework review, threat modeling, and sensitive-code ownership;
- browser-based verification through Playwright.

Specialist packs add depth without forcing every style, platform, integration, or media workflow into every agent prompt:

| Profile | Skills | Purpose |
| --- | ---: | --- |
| `core` | 25 | High-frequency process, design, implementation, verification, and security. |
| `process` | 6 | Optional delivery, cleanup, GitHub, exhaustive-output, and response workflows beyond core. |
| `design` | 24 | Specialist visual styles, motion, prototyping, Figma, and image-led work beyond core design. |
| `security` | 4 | The four distinct security output contracts. |
| `web` | 5 | Specialist web apps, frameworks, SEO, and production errors beyond core. |
| `platform` | 7 | Platform-specific engineering and deployment. |
| `documents-media` | 10 | Documents, data files, presentations, notebooks, image, audio, and video. |
| `productivity` | 5 | Linear and Notion workflows. |
| `openai` | 6 | OpenAI documentation and media-generation workflows. |
| `all` | 83 | Every catalog entry; use when discovery cost is acceptable. |

Design is consolidated at the routing layer rather than flattened into one oversized skill. `frontend-design`, `ui-quality-baseline`, `design-reference-research`, `redesign-existing-projects`, `mobile-app-design`, `human-ai-interface-design`, and `animate` provide the core paths; aesthetic systems and tool-specific workflows remain in the design pack because their triggers and output contracts differ. Security keeps four folders for the same reason: implementation, review, threat modeling, and ownership analysis are not interchangeable artifacts.

## Selection and precedence

Use the narrowest applicable skill. When guidance conflicts, follow this order:

1. explicit user requirements and approved artifacts;
2. repository instructions and existing design systems;
3. focused design, framework, provider, or command skills;
4. shared baselines such as `ui-quality-baseline`, `application-security`, and `markdown-management`;
5. generic specialist routers or personas.

The consolidated routers are `engineering-specialists`, `orchestration-specialists`, and `research-analysis`. They reduce duplicate persona skills without overriding more specific instructions.

## Notable skill groups

### Design and motion

- `frontend-design`: compact anti-generic frontend direction adapted from Anthropic's current frontend skill.
- `design-reference-research`: converts live products, galleries, flows, and source registries into an evidence ledger, product-specific thesis, rejection list, and responsive implementation brief.
- `human-ai-interface-design`: trustworthy AI suggestions, generation, retrieval, agents, approvals, provenance, recovery, and reliance-focused evaluation.
- `design-taste-frontend` and `design-taste-frontend-v1`: detailed local design systems for expressive, non-templated interfaces.
- `high-end-visual-design`, `minimalist-ui`, `industrial-brutalist-ui`, and `stitch-design-taste`: specialist art-direction and design-system workflows. `gpt-taste` remains an explicit compatibility route to current guidance.
- `ui-quality-baseline`: accessibility, responsive containment, coherent tokens, truthful loading states, and rendered QA.
- `mobile-app-design`: native mobile screen and flow implementation with optional Appllama reference research; it delegates motion-only work to `animate-expo` and image-only concepts to `imagegen-frontend-mobile`.
- `emil-design-eng`, `animate`, `animate-expo`, and the animation review skills: interaction and motion craft.
- `oil-motion`: a specialized workflow for generated or captured frame-based interactive media, adapted from `oil-oil/oil-motion`.
- `pick-ui-library`: dependency-aware component selection with Rare UI, beUI, Spectrum UI, and Spell UI treated as inspectable source registries, not default dependencies.

### Research and response modes

- `research-analysis`: the canonical research workflow. Explicit deep-research requests load a focused reference for resumable evidence ledgers, claim verification, saturation-based stopping, and evidence-only follow-up instead of adding a second research skill.
- `i-have-adhd`: an explicit-only, persistent response mode with action-first structure, bounded steps, visible state, and evidence-based time estimates.

### Markdown and implementation commands

- `markdown-management`: create, update, merge, split, rename, and audit Markdown and skill folders without losing authority, links, anchors, or provenance.
- `implement`, `review`, `troubleshoot`, `cleanup`, `git`, `finalize`, and `add-changelog`: focused command workflows that defer to repository evidence and specialist skills.

Run the local structural audit with:

```powershell
pwsh -NoProfile -File .\markdown-management\scripts\audit-skills.ps1 -Root .
pwsh -NoProfile -File .\markdown-management\scripts\audit-markdown-links.ps1 -Root .
```

Audit duplicate names across installed Codex, Claude, and shared skill roots without deleting personal skills:

```powershell
pwsh -NoProfile -File .\markdown-management\scripts\audit-installed-skill-conflicts.ps1
```

### Security

- `application-security`: cross-stack secure-by-design baseline and `Security-Master.md` reference.
- `security-best-practices`: focused repository security review.
- `security-threat-model`: trust-boundary and abuse-case threat modeling, including AI and agentic systems.
- `security-ownership-map`: sensitive-code ownership and concentration analysis.

The guidance covers current OWASP web/API risks, secure authentication and password storage, software supply chains, exceptional conditions, and prompt/tool/agent boundaries. Static checks are evidence, not proof of live authorization, deployment, tenant, browser, or provider behavior.

Security scan checks use stable IDs and link to current `Security-Master.md` anchors. The CLI writes `yeknal-security.log`, `yeknal-security.json`, and SARIF 2.1.0 `yeknal-security.sarif`; all three are ignored by Git by default.

### SEO discovery

`content-seo` includes an IndexNow workflow for changed-URL notification. It treats LaunchIgniter's submitter as an optional manual helper and keeps receipt, crawling, indexing, and ranking as separate proof boundaries.

## Upstream review

The 2026-09-12 refresh additionally reviewed:

- `anthropics/skills` at `41bbe19d1a1a7eaab5e7bb9050a417e5c6cffc8f`;
- `openai/plugins` at `1e285826e604f66f7208f7ac4dba0fe8341d1f57`;
- `oil-oil/oil-motion` at `eafd4a45dc9c996489df3c54ac4ebdcde2bd030b`;
- `swamimalode/rare-ui` at `b3efd6c290884a852b7af39d34df99a762dbbf3f`;
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

Deep Research is incorporated as a mode of `research-analysis`; its separate follow-up entry point is unnecessary because the canonical mode already includes evidence-only follow-up. AppLlama's two upstream skills are consolidated into `mobile-app-design`, with MCP research instructions loaded only when that service is connected. The ADHD-friendly response contract remains one explicit-only skill because it changes conversation behavior rather than research, UI, or implementation behavior.

The UI review is indexed in [`design-reference-research/references/source-atlas.md`](design-reference-research/references/source-atlas.md). It separates live-product evidence, galleries, motion clips, platform guidance, and source-code registries; rendered desktop/mobile checks and access limitations are recorded without treating attractive screenshots as usability proof.

The latest review selectively strengthens existing entries instead of adding duplicate bundles: `ui-quality-baseline`, `design-reference-research`, and `content-seo` cover UI repair, design-rule evidence, and page metadata; `engineering-specialists` and `review` add language-specific simplification checks for TypeScript, Python, and Go; `implement` and `markdown-management` separate judgment from repeatable verification work, preserve short discriminating skill triggers, and route detail progressively. Current `animate` already provides a stricter motion-performance contract, so the external motion checklist was reviewed without duplication. Guidance was independently adapted; no upstream instructions override repository, project, or user authority.

## Validation and releases

GitHub Actions validates skill structure, relative Markdown links, CLI tests, package contents, and changed-file whitespace on pushes and pull requests. The npm trusted-publishing workflow is prepared but remains dormant until the package has a matching OIDC connection and the repository variable `NPM_TRUSTED_PUBLISHING_ENABLED` is set to `true`. Until then, package owners publish from an authenticated local npm client; no npm write token is stored in GitHub.

`evaluations/skill-routing.json` records high-value routing and precedence cases. CI validates the dataset and referenced skills; model-level activation scoring remains a separate behavioral evaluation boundary.

## License

ISC. Imported or adapted skills retain their upstream license files where required.
