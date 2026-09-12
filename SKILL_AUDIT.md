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

- `document` and `update-docs` became `markdown-management`. The merged skill covers creation, updating, deduplication, splitting, renaming, link preservation, source authority, and skill-folder validation.
- `agent-organizer` and `multi-agent-coordinator` were folded into `orchestration-specialists`. Unsupported performance promises were removed; bounded task ownership, dependency tracking, conflict avoidance, and evidence contracts were retained.
- `NeetigyaShah/deep-research` became a progressively disclosed mode inside `research-analysis`; its standalone follow-up skill was omitted because the canonical mode already covers evidence-only follow-up.
- AppLlama's research and app-design skills became one `mobile-app-design` skill. Existing `animate-expo`, `imagegen-frontend-mobile`, and `ui-quality-baseline` instructions remain authoritative for their narrower concerns.
- The former fixed `gpt-taste` recipe was consolidated into the evidence-led `high-end-visual-design` workflow. `gpt-taste` remains only as an explicit compatibility route so existing prompts do not break.
- `ibelick/ui-skills` was incorporated as focused method improvements: existing UI, design-research, and SEO entries now cover narrow-surface repair, durable `DESIGN.md` evidence, and complete page-metadata review without adding a second universal UI router. The TypeScript, Python, and Go anti-slop material is one language-aware simplification lens in `engineering-specialists` and `review`, not three duplicate language personas.

### Kept separate

- Focused command skills such as `implement`, `review`, `troubleshoot`, `cleanup`, `git`, and `finalize` remain distinct because their trigger and safety contracts are narrower than `engineering-specialists`.
- Specialist visual directions remain distinct. An approved design, repository design system, or narrow aesthetic skill takes precedence over generic frontend guidance.
- `design-reference-research` remains separate from implementation skills because it is read-only by default and produces an evidence ledger and decision brief; `human-ai-interface-design` remains separate because appropriate reliance, provenance, autonomy, approvals, and recovery are interaction-safety concerns rather than an aesthetic.
- The four security skills remain separate because application implementation, best-practice review, threat modeling, and ownership analysis produce different artifacts.
- `i-have-adhd` remains one explicit-only skill because its persistent conversation-output contract has no behavioral equivalent in the research, documentation, or implementation skills.

## Naming repairs

The following folders were renamed to match their existing skill names:

| Previous folder | Current folder |
| --- | --- |
| `Design` | `frontend-design` |
| `Security` | `application-security` |
| `brutalist-skill` | `industrial-brutalist-ui` |
| `gpt-tasteskill` | `gpt-taste` |
| `image-to-code-skill` | `image-to-code` |
| `minimalist-skill` | `minimalist-ui` |
| `output-skill` | `full-output-enforcement` |
| `redesign-skill` | `redesign-existing-projects` |
| `soft-skill` | `high-end-visual-design` |
| `stitch-skill` | `stitch-design-taste` |
| `taste-skill` | `design-taste-frontend` |
| `taste-skill-v1` | `design-taste-frontend-v1` |

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
- [Rare UI](https://github.com/swamimalode/rare-ui) at `b3efd6c290884a852b7af39d34df99a762dbbf3f`;
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

The Anthropic frontend guidance was adapted into a compact `frontend-design` entry point. OpenAI's current plugin repository was treated as format and progressive-disclosure reference material, not copied wholesale. Existing local specialist design and command behavior was retained wherever broader upstream guidance conflicted.

Rare UI, beUI, Spectrum UI, and Spell UI are incorporated into `pick-ui-library` as inspectable source registries. None is an automatic dependency. `oil-motion` is a separate specialist skill for generated or captured frame timelines, not ordinary component transitions.

The original 28 supplied UI sources were reviewed through text extraction where available and rendered checks at desktop and mobile widths. Their functions, adoption boundaries, and access limitations are preserved in the design-reference source atlas. Gallery screenshots are explicitly treated as discovery evidence, not proof of accessibility, performance, conversion, or production use.

The 2026-09-12 additions were independently adapted as concise local rules. `implement` now routes repeatable, acceptance-critical operations to small executable checks, while `markdown-management` requires copyable examples and deterministic claims to be rechecked. The GPT-6 Astra guidance further tightens catalog maintenance: descriptions must be short and discriminating, multi-mode skills must route progressively, and instructions must not become generic itineraries that overconstrain more capable models. They retain real validation, error handling, idiomatic framework conventions, project-specific contracts, and user authority; no source was imported as an overriding general workflow. The established `animate` skill already exceeds the reviewed motion-performance guidance and remains the canonical motion entry point.

Deep Research extends the canonical research workflow instead of duplicating it. AppLlama's two related entry points are represented by one mobile implementation skill with optional MCP research. The ADHD-friendly response mode remains explicit-only. These boundaries are covered by routing evaluations for deep research, reference-led visual research, human-AI interaction, native mobile flows, Expo animation, mobile image generation, and ADHD mode.

The official IndexNow protocol and LaunchIgniter submitter are covered in `content-seo/references/indexnow.md`, with submission receipt kept separate from crawling, indexing, and ranking evidence.

## Security refresh

The old duplicate raw security prompt files and generated audit log were removed. `application-security` and its reference baseline now cover:

- OWASP Top 10:2025 and API Security Top 10 risks;
- Argon2id password storage and safer session/CSRF defaults;
- CSP `frame-ancestors` and removal of deprecated `X-XSS-Protection` advice;
- tenant and object-level authorization, SSRF, uploads, webhooks, and resource limits;
- dependency, artifact, CI/CD, plugin, model, and prompt supply-chain integrity;
- prompt injection, unsafe tool output, memory poisoning, excessive agency, approval boundaries, and bounded agent execution;
- replay, races, retries, exceptional conditions, logging, and incident response.

The CLI syncs all four security skills and reads the master baseline from `application-security`. Version `2.0.1` adds profile selection, exact named-skill selection, and repository-local `.agents/skills` installation on top of Codex `.system` collision avoidance, stable security rule IDs, JSON and SARIF reports, interrupted-download handling, automated tests, CI validation, and the OIDC-ready npm release workflow.

## Validation commands

```powershell
pwsh -NoProfile -File .\markdown-management\scripts\audit-skills.ps1 -Root .
pwsh -NoProfile -File .\markdown-management\scripts\audit-markdown-links.ps1 -Root .
skills-ref validate <each top-level skill folder>
npm test --prefix .\yeknal-cli
git diff --check
```

The checks validate static structure and syntax. They do not prove behavioral activation quality in every model/client or live security posture in a deployed application.
