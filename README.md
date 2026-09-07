# MD Files

A curated collection of reusable skill folders for AI coding agents. The collection favors specific design and command guidance over generic personas, uses progressive disclosure for long references, and keeps security guidance grounded in current primary sources.

## Requirements

`yeknal` does not need a global install. A new device needs Node.js with npm, internet access, and at least one supported agent folder:

- Codex: `~/.codex`
- Claude: `~/.claude`
- Gemini Antigravity: `~/.gemini/antigravity`
- Antigravity: `~/.antigravity`

Git is optional and is used only if the GitHub download path is rate-limited.

## Quick start

```bash
npx yeknal skills
npx yeknal security
```

| Command | Result |
| --- | --- |
| `npx yeknal skills` | Syncs every current top-level skill folder into detected local agent skill folders. |
| `npx yeknal security` | Syncs the four security skills, scans the current folder, and writes text, JSON, and SARIF reports. |

## Sync behavior

- Skills are pulled from this repository on `main`.
- Installed folders use the managed `yeknal-` prefix; `frontend-design` becomes `yeknal-frontend-design`.
- `npx yeknal security` installs `application-security`, `security-best-practices`, `security-ownership-map`, and `security-threat-model`.
- `SEO` remains source/reference material and is not installed because it has no `SKILL.md` entry point.
- Missing `skills` folders are created inside detected agent parent folders.
- Managed `yeknal-*` folders are updated or removed as the repository changes.
- Personal folders without the `yeknal-` prefix are left untouched.

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
- `design-taste-frontend` and `design-taste-frontend-v1`: detailed local design systems for expressive, non-templated interfaces.
- `gpt-taste`, `high-end-visual-design`, `minimalist-ui`, `industrial-brutalist-ui`, and `stitch-design-taste`: specialist aesthetic directions.
- `ui-quality-baseline`: accessibility, responsive containment, coherent tokens, truthful loading states, and rendered QA.
- `emil-design-eng`, `animate`, `animate-expo`, and the animation review skills: interaction and motion craft.
- `oil-motion`: a specialized workflow for generated or captured frame-based interactive media, adapted from `oil-oil/oil-motion`.
- `pick-ui-library`: dependency-aware component selection with Rare UI treated as a source registry, not a default dependency.

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

The 2026-09-07 refresh reviewed:

- `anthropics/skills` at `41bbe19d1a1a7eaab5e7bb9050a417e5c6cffc8f`;
- `openai/plugins` at `1e285826e604f66f7208f7ac4dba0fe8341d1f57`;
- `oil-oil/oil-motion` at `eafd4a45dc9c996489df3c54ac4ebdcde2bd030b`;
- `swamimalode/rare-ui` at `b3efd6c290884a852b7af39d34df99a762dbbf3f`.

Upstream material is adapted selectively. Existing local specialist design and command instructions win where generic upstream guidance conflicts.

## Validation and releases

GitHub Actions validates skill structure, relative Markdown links, CLI tests, package contents, and changed-file whitespace on pushes and pull requests. npm releases are published from GitHub releases through npm trusted publishing with short-lived OIDC credentials; the workflow does not require a stored npm write token.

`evaluations/skill-routing.json` records high-value routing and precedence cases. CI validates the dataset and referenced skills; model-level activation scoring remains a separate behavioral evaluation boundary.

## License

ISC. Imported or adapted skills retain their upstream license files where required.
