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
| `yeknal-verification-harness` | [cursor/plugins](https://github.com/cursor/plugins) (`pstack/skills/create-verification-skill`) | MIT | `LICENSE.txt` | OK |
| `yeknal-verification-audit` | [cursor/plugins](https://github.com/cursor/plugins) (`pstack/skills/maintain-verification-skill`) | MIT | `LICENSE.txt` | OK |
| `yeknal-security-audit` | [cloudflare/security-audit-skill](https://github.com/cloudflare/security-audit-skill) (`skills/security-audit`) | MIT | `LICENSE.txt` | OK |

## Derived with bundled notice

| Skill(s) | Upstream / holder | License | Notice |
| --- | --- | --- | --- |
| `yeknal-notion` (hub; consolidates the former knowledge-capture, meeting-intelligence and research-documentation skills) | Notion Labs, Inc. | MIT | `LICENSE.txt` |
| `yeknal-deploy` (Vercel reference) | Vercel | MIT | `references/licenses/vercel.txt` |
| `yeknal-research-analysis` | NeetigyaShah/deep-research | MIT | `LICENSE.deep-research.txt` |
| `yeknal-playwright` | Microsoft (playwright-cli) | Apache-2.0 | `LICENSE.txt`, `NOTICE.txt` |
| `yeknal-figma-implement-design` | Figma | Apache-2.0 | `LICENSE.txt` |
| `yeknal-aspnet-core`, `yeknal-winui-app` | Microsoft | Apache-2.0 | `LICENSE.txt` |
| `yeknal-doc`, `yeknal-pdf`, `yeknal-slides`, `yeknal-spreadsheet`, `yeknal-jupyter-notebook` | Anthropic document skills | Apache-2.0 | `LICENSE.txt` |
| `yeknal-imagegen`, `yeknal-sora`, `yeknal-speech`, `yeknal-transcribe`, `yeknal-openai-docs`, `yeknal-chatgpt-apps` | OpenAI | Apache-2.0 | `LICENSE.txt` |
| `yeknal-deploy` (Cloudflare reference), (Netlify reference), (Render reference) | Cloudflare, Netlify, Render | Apache-2.0 | `references/licenses/cloudflare.txt`, `netlify.txt`, `render.txt` |
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
| `yeknal-animate` (absorbs the former `yeknal-emil-design-eng` reference material) | [emilkowalski/skills](https://github.com/emilkowalski/skills) (Copyright 2026 Emil Kowalski) | MIT |
| `yeknal-break-ui` | [emilkowalski/skills](https://github.com/emilkowalski/skills) (Copyright 2026 Emil Kowalski) | MIT |
| `yeknal-ambition` | [DannyMac180/skills](https://github.com/DannyMac180/skills) (`be-ambitious`) (Copyright 2026 Dan McAteer) | MIT |

## Attribution-only (non-permissive or reference)

| Skill(s) | Obligation |
| --- | --- |
| `yeknal-pick-ui-library`, `yeknal-frontend-design`, `yeknal-redesign-existing-projects` | Rare UI (`swamimalode07/rare-ui`, MIT + Commons Clause + Attribution). Source is not vendored; any project that installs a Rare UI component must keep the notice in the copied source and add a README credit linking to rareui.com. |
| `yeknal-animate`, `yeknal-animate-expo`, `yeknal-find-animation-opportunities`, `yeknal-improve-animations`, `yeknal-prototype`, `yeknal-review-animations` | Reference/inspiration: Emil Kowalski's design-engineering philosophy (animations.dev, emilkowal.ski). No source copied. |
| `yeknal-mobile-app-design`, `yeknal-ui-quality-baseline` | Reference/inspiration: Emil Kowalski's mobile-native web guidance (emilkowal.ski, animations.dev). Adapted into the shared UI baseline's mobile web platform layer; no source copied. |
| `yeknal-design-reference-research` | Research reads live products/galleries; keeps source attribution in notes and must not present borrowed work as original. |
| `yeknal-ui-quality-baseline`, `yeknal-ui-ux-designer` | Reference/inspiration: Irene Pereyra, *Universal Principles of UX*. Independently synthesized guidance on context, user agency, research, entry paths, tradeoffs, and learning after launch; no book text or illustrations reproduced. |
| `yeknal-ui-quality-baseline`, `yeknal-ui-ux-designer`, `yeknal-animate`, `yeknal-mobile-app-design` | Reference/inspiration: Irene Pereyra, Studio Anton & Irene, *The Accessible Design Reference & Specification Book*. Original synthesis on accessible behavior, media, research, and handoff; technical requirements checked against linked W3C guidance and MDN. Detailed checks live in the shared baseline's accessibility reference; no book text or assets bundled. |
| `yeknal-ui-quality-baseline`, `yeknal-design-reference-research` | Reviewed [ibelick/ui-skills](https://github.com/ibelick/ui-skills) (Julien Thibeaut) as a reference only; an 8-word shingle scan found no verbatim overlap, so no upstream notice is bundled. |
| `yeknal-legacy-sweep` | Original production-code, failure-triage and campaign material. The test evidence gate is adapted independently from the audit concepts in [openclaw/openclaw test-audit](https://github.com/openclaw/openclaw/blob/main/.agents/skills/test-audit/SKILL.md) (previously shipped as `yeknal-test-audit`); no source text copied. |
| `yeknal-domain-modeling` | Adapted independently from [mattpocock/skills domain-modeling](https://github.com/mattpocock/skills/blob/f3fc5632f401156837ee3872f14fe33ccf1024ea/skills/engineering/domain-modeling/SKILL.md) at `f3fc5632f401156837ee3872f14fe33ccf1024ea` (MIT); no source text copied. |
| `yeknal-ambition` | Reference/inspiration: Felix Rieseberg, [How to be more ambitious: A tutorial for humans with models](https://felixrieseberg.com/how-to-be-more-ambitious-a-tutorial-for-humans-with-models/) (13 October 2026). Altitude, range, the contract boundary and the outside-check rule are independently synthesized; no article text or examples are reproduced. |
| `yeknal-agent-cost-control` | Method adapted independently from [Cloudflare, cutting our inference bill by 68%](https://blog.cloudflare.com/obsessive-inference-optimization/); no source text or code copied, and its figures are presented as one team's reference case rather than a benchmark. |
| `yeknal-ui-quality-baseline`, `yeknal-animate`, `yeknal-review-animations`, `yeknal-design-taste-frontend`, `yeknal-slopscan` | Reviewed [Nutlope/hallmark](https://github.com/nutlope/hallmark) (MIT) as a peer design skill: its rule-identifier scheme, dealt-direction mechanic, and precision AI-tell list informed our own originals; no source text copied. Its `eval/` harness is the reference for our harness design. |
| `yeknal-animate` (frame budget reference) | Reviewed [emilkowalski/skills `animation-performance`](https://github.com/emilkowalski/skills) (MIT, Copyright 2026 Emil Kowalski) as reference; our reference states the invariants and diagnosis order, not upstream text. Emil Kowalski is already credited above for `yeknal-animate`, `yeknal-break-ui`, and the reference set. |
| `yeknal-animate` (rendered video reference), `yeknal-design-reference-research` | Reviewed [MotionVideo](https://motionvideo.xyz/en) on 2026-10-26 as a gallery of AI-made motion clips. Its public technique categories informed the wording of our own technique table; no clip, prompt, or skill text is copied, and its separately sold skill pack is not vendored. |
| `yeknal-pick-ui-library`, `yeknal-ui-quality-baseline` | Reviewed [Arc UI](https://uiarc.dev), [Shaders](https://github.com/shader-effects-inc/shaders) (MIT), [snapcn](https://snapcn.dev) (MIT), and [React Bits](https://github.com/DavidHDev/react-bits) (MIT + Commons Clause) as library references only. React Bits is not vendored; any project copying its source must keep its notice and observe the Commons Clause. |
| `yeknal-design-taste-frontend`, `yeknal-slopscan` | The precision tell list is an independent rewrite informed by publicly discussed AI-tell patterns, including Hallmark's floor. Wording is ours. |

## Original skills (no upstream identified)

`yeknal-add-changelog`, `yeknal-agent-cost-control`, `yeknal-animate`, `yeknal-animate-expo`, `yeknal-apple-design`, `yeknal-application-security`, `yeknal-brainstorm`, `yeknal-cleanup`, `yeknal-content-seo`, `yeknal-dead-code-hunter`, `yeknal-engineering-specialists`, `yeknal-finalize`, `yeknal-frontend-developer`, `yeknal-git`, `yeknal-human-ai-interface-design`, `yeknal-implement`, `yeknal-launch-readiness`, `yeknal-markdown-management`, `yeknal-nextjs-developer`, `yeknal-orchestration-specialists`, `yeknal-project-handoff`, `yeknal-review`, `yeknal-skill-router`, `yeknal-slopscan` (derived from the SlopLens rule catalog in the author's own Slop Detector project; the catalog itself remains full SlopLens material), `yeknal-testing-strategy`, `yeknal-troubleshoot`, `yeknal-ui-quality-baseline`, `yeknal-design-reference-research`, `yeknal-ui-ux-designer`, `yeknal-write-swift` (Apple/Swift guidance is referenced, not copied).

## Actions

1. Done: `ibelick/ui-skills` was reviewed as a reference only (no verbatim overlap); no upstream notice is required.
2. Keep the Rare UI attribution requirement visible wherever a Rare UI component can be installed. React Bits carries an identical MIT + Commons Clause restriction and follows the same rule.
3. Keep the README and npm README Credits sections aligned with this file when upstreams change.
4. `yeknal-animation-vocabulary` is archived under `archive/skills/`; its principle definitions were folded into `yeknal-animate/references/motion-principles.md`. It is no longer an installed skill.
