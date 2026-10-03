# Provenance and Credits

This catalog adapts and consolidates material from several upstream authors. Each adapted skill keeps the upstream license notice it shipped with, and this file records source, license, and attribution status. Original Yeknal skills are credited to this repository.

Licensing rule: permissive upstreams (MIT, Apache-2.0) require retaining the copyright and license notice; nothing here is re-licensed without compliance. Where a skill is an independent re-write of an idea rather than a copy, we still credit the source in good faith.

Legend: **Explicit** = `metadata.source` in frontmatter. **Notice** = bundled `LICENSE`/`NOTICE` file with an identifiable holder. **Name-match** = exact skill name published by an upstream on skills.sh. **Reference** = cites an author's public work as inspiration without copying.

## Explicit provenance

| Skill | Upstream | License | Notice | Status |
| --- | --- | --- | --- | --- |
| `yeknal-frontend-design` | [anthropics/skills](https://github.com/anthropics/skills) (`skills/frontend-design`) | Apache-2.0 | `LICENSE.txt` | OK |
| `yeknal-i-have-adhd` | [ayghri/i-have-adhd](https://github.com/ayghri/i-have-adhd) | MIT | `LICENSE.txt` | OK |
| `yeknal-mobile-app-design` | [Appllama/appllama-skills](https://github.com/Appllama/appllama-skills) | MIT | `LICENSE.txt` | OK |
| `yeknal-oil-motion` | [oil-oil/oil-motion](https://github.com/oil-oil/oil-motion) | MIT | `LICENSE.txt` | OK |

## Derived with bundled notice

| Skill(s) | Upstream / holder | License | Notice |
| --- | --- | --- | --- |
| `yeknal-notion-knowledge-capture`, `yeknal-notion-meeting-intelligence`, `yeknal-notion-research-documentation`, `yeknal-notion-spec-to-implementation` | Notion Labs, Inc. | MIT | `LICENSE.txt` |
| `yeknal-vercel-deploy` | Vercel | MIT | `LICENSE.txt` |
| `yeknal-research-analysis` | NeetigyaShah/deep-research | MIT | `LICENSE.deep-research.txt` |
| `yeknal-playwright` | Microsoft (playwright-cli) | Apache-2.0 | `LICENSE.txt`, `NOTICE.txt` |
| `yeknal-figma-implement-design` | Figma | Apache-2.0 | `LICENSE.txt` |
| `yeknal-aspnet-core`, `yeknal-winui-app` | Microsoft | Apache-2.0 | `LICENSE.txt` |
| `yeknal-doc`, `yeknal-pdf`, `yeknal-slides`, `yeknal-spreadsheet`, `yeknal-jupyter-notebook` | Anthropic document skills | Apache-2.0 | `LICENSE.txt` |
| `yeknal-imagegen`, `yeknal-sora`, `yeknal-speech`, `yeknal-transcribe`, `yeknal-openai-docs`, `yeknal-chatgpt-apps` | OpenAI | Apache-2.0 | `LICENSE.txt` |
| `yeknal-cloudflare-deploy` | Cloudflare | Apache-2.0 | `LICENSE.txt` |
| `yeknal-netlify-deploy` | Netlify | Apache-2.0 | `LICENSE.txt` |
| `yeknal-render-deploy` | Render | Apache-2.0 | `LICENSE.txt` |
| `yeknal-sentry` | Sentry | Apache-2.0 | `LICENSE.txt` |
| `yeknal-linear` | Linear | Apache-2.0 | `LICENSE.txt` |
| `yeknal-gh-address-comments`, `yeknal-gh-fix-ci` | GitHub | Apache-2.0 | `LICENSE.txt` |
| `yeknal-develop-web-game`, `yeknal-screenshot`, `yeknal-yeet` | packaged reference/openai | Apache-2.0 | `LICENSE.txt` |
| `yeknal-security-best-practices`, `yeknal-security-ownership-map`, `yeknal-security-threat-model` | original workflow; incorporates openai/plugins review | Apache-2.0 | `LICENSE.txt` |

## Derivatives with MIT notices added

These match upstream skill names published on skills.sh. They are MIT-licensed upstream, and each now bundles the upstream MIT notice plus `metadata.source` / `source-commit`.

| Skill(s) | Upstream | License |
| --- | --- | --- |
| `yeknal-design-taste-frontend`, `yeknal-design-taste-frontend-v1`, `yeknal-redesign-existing-projects`, `yeknal-high-end-visual-design`, `yeknal-minimalist-ui`, `yeknal-industrial-brutalist-ui`, `yeknal-stitch-design-taste`, `yeknal-gpt-taste`, `yeknal-full-output-enforcement`, `yeknal-image-to-code`, `yeknal-imagegen-frontend-web`, `yeknal-imagegen-frontend-mobile`, `yeknal-brandkit` | [leonxlnx/taste-skill](https://github.com/leonxlnx/taste-skill) (Copyright 2026 Leonxlnx) | MIT |
| `yeknal-emil-design-eng` | [emilkowalski/skills](https://github.com/emilkowalski/skills) (Copyright 2026 Emil Kowalski) | MIT |
| `yeknal-ui-quality-baseline`, `yeknal-design-reference-research` | likely [ibelick/ui-skills](https://github.com/ibelick/ui-skills) (Copyright 2026 Julien Thibeaut) - verify mapping | MIT |

## Attribution-only (non-permissive or reference)

| Skill(s) | Obligation |
| --- | --- |
| `yeknal-pick-ui-library`, `yeknal-frontend-design`, `yeknal-redesign-existing-projects` | Rare UI (`swamimalode07/rare-ui`, MIT + Commons Clause + Attribution). Source is not vendored; any project that installs a Rare UI component must keep the notice in the copied source and add a README credit linking to rareui.com. |
| `yeknal-animate`, `yeknal-animate-expo`, `yeknal-find-animation-opportunities`, `yeknal-improve-animations`, `yeknal-prototype`, `yeknal-review-animations` | Reference/inspiration: Emil Kowalski's design-engineering philosophy (animations.dev, emilkowal.ski). No source copied. |
| `yeknal-design-reference-research` | Research reads live products/galleries; keeps source attribution in notes and must not present borrowed work as original. |

## Original skills (no upstream identified)

`yeknal-add-changelog`, `yeknal-animate`, `yeknal-animate-expo`, `yeknal-animation-vocabulary`, `yeknal-apple-design`, `yeknal-application-security`, `yeknal-brainstorm`, `yeknal-cleanup`, `yeknal-content-seo`, `yeknal-dead-code-hunter`, `yeknal-engineering-specialists`, `yeknal-finalize`, `yeknal-frontend-developer`, `yeknal-git`, `yeknal-human-ai-interface-design`, `yeknal-implement`, `yeknal-markdown-management`, `yeknal-nextjs-developer`, `yeknal-orchestration-specialists`, `yeknal-project-handoff`, `yeknal-review`, `yeknal-skill-router`, `yeknal-testing-strategy`, `yeknal-troubleshoot`, `yeknal-ui-ux-designer`, `yeknal-write-swift` (Apple/Swift guidance is referenced, not copied).

## Actions

1. Confirm the `ibelick/ui-skills` mapping; credit or drop accordingly (no notice added yet).
2. Confirm the `ibelick/ui-skills` mapping; credit or drop accordingly.
3. Keep the Rare UI attribution requirement visible wherever a Rare UI component can be installed.
4. Expand the README and npm README Credits sections to summarize this file, and add a per-skill notice reference where a notice exists.
