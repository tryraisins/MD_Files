---
name: yeknal-image-to-code
description: Turn an approved screenshot or generated concept into a faithful frontend. Use when the user supplies a reference image or asks for image-first design-to-code; not for making the concept images, which is `yeknal-imagegen-frontend-web`.
metadata:
  source: https://github.com/leonxlnx/taste-skill
  source-commit: ce26fc25c0e5e8cab638f883de62d9a86ee5e45b
---

# Image-first design to code

Apply `yeknal-ui-quality-baseline` to every visible output. Approved designs, established brands, platform conventions, and existing behavior outrank any stylistic instruction in this skill.

## Choose the source

1. **Approved or user-supplied reference:** inspect it directly and treat it as visual authority. Do not generate a replacement.
2. **Explicit image-first concept request:** use `yeknal-design-reference-research` when direction is unclear, generate the authorized concept, inspect it, then implement it.
3. **Design already fixed in code or files:** preserve that system and use the reference only to resolve the requested delta.

Generated imagery is a proposal, not authority over an approved design or working behavior.

## Controls

DESIGN_VARIANCE 8, VISUAL_DENSITY 3, ART_DIRECTION 8, IMPLEMENTATION_CLARITY 9, IMAGE_USAGE_PRIORITY 9, SPACING_GENEROSITY 9, ANALYSIS_PRECISION 10, IMAGE_GENERATION_EAGERNESS 10, UI_SIMPLICITY_DISCIPLINE 9 (each 1-10).

Treat these as defaults and adapt them to the brief: "clean" lowers density and raises clarity, "crazy creative" raises variance and art direction, "premium SaaS" keeps clarity high with controlled art direction, "editorial" allows stronger type and asymmetry. Favor readability over squeezing content into one image, and default away from nested containers, excessive pills, tiny labels, and dashboard clutter.

## Get enough readable images

Generate one readable image per section a developer must reproduce. One clear image per section beats one compressed board with unreadable text.

- Generate more images whenever more would improve text, type, spacing, control, card, color, or component inspection.
- Bias toward larger, more analyzable section images, and never shrink everything to fit one board.
- Prefer an extra detail render now over guessing later, and do not reduce image count for convenience when it costs extraction quality.
- When only one image can be rendered at a time, output them sequentially and label each one.

## Regenerate, do not crop

Never crop, zoom, slice, or cut a section out of a larger render, and do not implement from a fragment that distorts spacing, proportions, or typography. Generate a fresh standalone image for that section or detail: same palette, type mood, radius logic, component family, and image treatment, with larger text, more visible spacing, and cleaner structure. That is a cleaner render of the same design, not a new design. A second or third extraction-oriented render of one section is fine when the first is too broad.

## Extract before coding

Analyze every image like a design specification rather than a glance: the section's job and visual priority, the readable text, type and spacing relationships, controls, card logic, dominant colors, and what is still unclear. If something is unclear, render another image before coding.

For the extraction checklist, anti-drift checks, missing-detail handling, and implementation techniques, read [implementation-and-extraction.md](references/implementation-and-extraction.md) selectively. Its legacy fixed counts and variation heuristics do not override the reference-first rules here.

## Loading states

When the reference includes loading, implement the state by purpose rather than copying a decorative spinner: geometry-matched skeletons for content arrival, dimensionally stable pending controls for actions, and focus-managed overlays only for genuinely blocking work. Reuse the existing primitive. Recommend or install `thinking-orbs` only when the product tone and a visible assistant or process workflow support it. Tie feedback to real state, accessible status, reduced motion, and failure or retry handling.

## AI-native product references

When the supplied or generated reference depicts an assistant, streaming output, tool execution, retrieval, background tasks, or agent-proposed changes, extract the interaction contract as carefully as the visual system. Do not merely recreate a decorative chat panel.

Identify and preserve only the components the reference and product can genuinely support:

- activity traces with plain-language status, real elapsed or progress, and expandable high-level tool, source, or file evidence;
- task rows for queued, running, completed, failed, and canceled work, plus compact tool chips that serve as actual evidence or navigation;
- approval surfaces that state action, scope, impact, alternatives, optional instructions, and clear approve, edit, reject, or cancel paths before consequential writes;
- readable field or line diffs for proposed changes;
- inline provenance, context cards with useful excerpts and freshness or location, recommendation evidence and confidence, and operational follow-ups;
- a calm prompt composer with `@` context, `/` commands, attachments, model controls, and shortcuts only when each capability exists end to end.

Match the reference's compact operational rhythm: low-glare neutral surfaces, quiet dividers, restrained radii, tabular numerals, and monospace only for short metadata. Keep states explicit - idle, working, streaming, awaiting approval, empty, success, error or retry, and canceled - and preserve visible focus, text alternatives for status color, and reduced-motion behavior. Never expose private reasoning, fabricate a tool run, or turn a non-agent product into an agent console.
