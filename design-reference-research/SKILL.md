---
name: design-reference-research
description: Research live interfaces, galleries, flows, and component sources, then synthesize evidence into a product-specific design direction. Use when a user supplies UI references, asks for inspiration or competitor-pattern research, or needs a non-generic visual direction before implementation; do not use for implementation-only work whose design is already fixed.
---

# Design reference research

Turn references into decisions, not a collage. This skill is read-only unless the user also asks for implementation.

Apply `ui-quality-baseline` to anything produced from the research. An approved design, established brand, repository design system, and working behavior outrank external inspiration.

## Establish the comparison frame

Before browsing, identify or infer:

- product category, audience, and primary user job;
- platform and input mode;
- page, screen, flow, or component being decided;
- content density, data sensitivity, and accessibility needs;
- target widths, heights, orientations, and themes;
- existing tokens, primitives, and behavior that must survive.

Do not compare surfaces that merely share an aesthetic. A checkout should be compared with other commitment flows before it is compared with attractive landing pages.

## Build a useful reference set

1. Inspect the product's current interface and design system first.
2. Choose references by functional similarity, audience, platform, and state complexity. Use [references/source-atlas.md](references/source-atlas.md) to route to the right libraries.
3. Study at least three relevant examples when the source material allows it. Prefer a small varied set over dozens of near-identical trend examples.
4. Capture evidence at the relevant desktop and mobile widths. For interactive work, inspect the trigger, transition, settled state, interruption, exit, and reduced-motion behavior—not one still frame.
5. Record each source's date, URL, access limitation, and whether it is a live product, gallery screenshot, editorial interpretation, or source-code registry.
6. Stop when two consecutive references add no decision-relevant pattern and the required devices, states, and flow stages are covered. More browsing after saturation is noise.

Use a gallery to discover examples, then follow through to the original product when a consequential claim depends on current behavior. A screenshot gallery does not prove usability, conversion, accessibility, performance, or production adoption.

## Extract patterns before styling

For every useful example, record:

- user goal and stage in the journey;
- hierarchy and reading order;
- navigation model and escape or recovery path;
- placement, wording, and commitment level of the primary action;
- content model, density, and progressive disclosure;
- grid, alignment, span, and responsive transformation;
- type, color, material, imagery, and motion roles;
- loading, empty, error, offline, success, and permission states that are visible or missing;
- what is product-specific versus reusable.

Classify observations as:

- **Invariant:** repeated because the task or platform demands it.
- **Common option:** one proven solution among several.
- **Outlier:** distinctive and potentially useful, but not evidence of a convention.
- **Failure or risk:** attractive in a still but weak for comprehension, input, performance, or small screens.

For page- and component-specific questions, load [references/pattern-atlas.md](references/pattern-atlas.md). For cross-device behavior and verification, load [references/responsive-matrix.md](references/responsive-matrix.md).

## Synthesize a direction

Do not average the references into a fashionable middle. Produce one coherent thesis:

- one sentence connecting the product's subject to a visual and interaction idea;
- the structural pattern adopted and why;
- the one memorable element that earns emphasis;
- role-based color, type, spacing, shape, and motion decisions;
- explicit responsive transformations;
- a short rejection list naming tempting patterns that do not fit.

Every major decision must trace to one of four authorities: product content, user need, platform convention, or observed reference pattern. If the rationale is only “modern,” “premium,” or “looks cool,” the decision is not ready.

## Protect originality and product fit

- Extract grammar, hierarchy, and behavior; do not copy a composition, illustration, copy line, brand asset, or distinctive interaction one-to-one.
- Respect licenses and terms. Source-code registries are implementation candidates only after license, dependency, and code review.
- Keep source attribution in research notes. Do not reproduce gallery watermarks or present borrowed work as original.
- Distinguish inspiration from evidence. Popularity labels, sponsorship, and gallery ordering are not quality measurements.
- Adapt imported components to the product's tokens, semantics, accessibility, responsive behavior, bundle budget, and motion policy.

## Required research output

Return a compact package another designer or developer can act on:

1. **Comparison frame** — scope, users, platform, constraints, and proof boundary.
2. **Evidence matrix** — source, observed pattern, classification, device or state, and relevance.
3. **Synthesis** — invariants, meaningful variants, risks, and saturation note.
4. **Design direction** — thesis, structure, system decisions, and rejection list.
5. **Responsive and state plan** — what reflows, moves, condenses, becomes a sheet, or stays fixed.
6. **Implementation handoff** — component boundaries, existing primitives to reuse, and unknowns that require a rendered check.

When access is blocked or a source is paywalled, label it `UNVERIFIED` for the unavailable claim and continue with other evidence. Never imply that transport success or a search snippet proves the interface was reviewed.
