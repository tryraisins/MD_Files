---
name: yeknal-gpt-taste
description: Compatibility route for legacy gpt-taste requests. Use only when explicitly invoked; delegate premium frontend art direction to high-end-visual-design and do not revive the retired fixed AIDA, randomized-layout, gapless-bento, or mandatory-GSAP recipe.
metadata:
  source: https://github.com/leonxlnx/taste-skill
  source-commit: ce26fc25c0e5e8cab638f883de62d9a86ee5e45b
---

# GPT Taste compatibility route

`gpt-taste` stays in the catalog so existing prompts and projects keep working. Its old recipe applied one fixed formula — AIDA structure, Python-randomized layout, a gapless bento grid, oversized spacing, and a GSAP pass — no matter what the product was. That made novelty repeatable, not tasteful.

Route current work like this:

1. Reach for `yeknal-high-end-visual-design` when the user asks for premium, agency, editorial, experimental, or showcase-level art direction.
2. Use `yeknal-design-taste-frontend` for expressive general frontend implementation.
3. Apply `yeknal-ui-quality-baseline` to every visible output.
4. Call on `yeknal-design-reference-research` when the direction needs live reference study.

When a project already uses AIDA, bento, or GSAP deliberately and the user wants it kept, leave it in place. Never add those patterns just because this compatibility skill was named.
