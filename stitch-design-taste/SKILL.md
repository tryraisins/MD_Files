---
name: stitch-design-taste
description: Create or update a versioned DESIGN.md specification for Google Stitch-style screen generation from authoritative product evidence. Use when an AI design tool needs semantic guidance for tokens, components, content, responsive behavior, states, and motion intent without replacing the real design system.
---

# Stitch design specification

Translate a product's real design direction into precise, reviewable guidance that an AI screen generator can follow. `DESIGN.md` is a generation specification—not authority above approved design files, repository tokens, the running product, platform conventions, or accessibility requirements.

Also apply `ui-quality-baseline`. When references must be researched, apply `design-reference-research` first and retain its evidence boundaries and rejection list.

## Establish authority and scope

Before writing:

- identify the product owner, intended generation tool, target screens, and consumers of the specification;
- inspect authoritative design files, code tokens, components, brand rules, content, and platform conventions;
- record specification version, review date, source locations, and unresolved contradictions;
- distinguish observed product rules from proposed additions and reference-derived hypotheses;
- preserve existing screen behavior unless the user explicitly requests a redesign.

Do not import a gallery's `DESIGN.md` as truth. Reconcile every value and rule with the actual product, and diff updates as versioned product-data changes.

## Define the product-specific system

### Direction

State the product, audience, primary job, intended feeling, visual thesis, signature device, density, variance, and motion intent. Explain each setting from evidence; never start from universal dial values.

### Tokens

For each token provide a semantic name, exact value or scale, functional role, theme behavior, and contrast or fallback requirement:

- canvas, surface, text, border, focus, accent, feedback, and data colors;
- type families, weights, sizes, leading, tracking, measures, and fallbacks;
- spacing, grid, gutters, content widths, radius, border, elevation, layer, and motion scales.

Do not ban or require a hue, font, radius, or effect merely to appear premium. A choice is invalid when it conflicts with the brand, task, content, accessibility, or implementation—not because it is common.

### Components and content

For each relevant component describe:

- purpose and content anatomy;
- size, placement, hierarchy, and responsive behavior;
- idle, hover/no-hover, focus, pressed, selected, pending, disabled, success, error, empty, offline, and permission states as applicable;
- accessible name, keyboard behavior, touch target, truncation/wrapping, and localization constraints;
- real imagery/data requirements and clearly labeled placeholder policy.

Cards, sidebars, floating navigation, equal grids, centered heroes, asymmetric layouts, glass, texture, and editorial whitespace are contextual options. Select them from information relationships and the stated thesis.

### Complete screen and flow anatomy

Cover navigation, opening task or hero, content/evidence sequence, primary commitment, pre-footer/footer where relevant, 404/dead-end recovery, loading/error/success, and Open Graph representation. For multi-screen work, document entry, transition, completion, cancellation, return, and failure paths.

### Responsive transformation

Use `design-reference-research/references/responsive-matrix.md`. Specify, per region, what reflows, reorders, condenses, becomes progressive disclosure, changes navigation mode, scrolls intentionally, or is omitted with justification.

Include small/common phones, tablet portrait/landscape, compact-height and standard desktops, wide desktop, text zoom, keyboard, touch/no-hover, reduced motion, and any product-specific foldable, split-view, safe-area, or virtual-keyboard conditions. Do not prescribe a blind single-column collapse.

### Motion intent

Static screen tools cannot prove animation. Document trigger, purpose, intermediate state, interruption, settled state, exit, input differences, and reduced-motion alternative for each proposed motion. Do not prescribe one spring, stagger, engine, or 60fps claim for every component.

## Required DESIGN.md structure

Use the repository's [DESIGN.md](DESIGN.md) as a schema, replacing every bracketed field with product evidence. A complete specification includes:

1. metadata and authority;
2. product and user jobs;
3. direction and explicit rejections;
4. semantic tokens;
5. layout and responsive transformations;
6. component anatomy and state matrix;
7. content and asset policy;
8. motion intent and reduced-motion behavior;
9. accessibility and performance constraints;
10. verification status, unresolved items, and change log.

## Quality gate

Before delivery:

- remove any rule that could be pasted unchanged into an unrelated product;
- confirm every exact value has a source or rationale;
- ensure the specification does not invent product capabilities, data, testimonials, or assets;
- check that all promised modes, devices, states, and flow stages are covered;
- label static-generation assumptions separately from behavior verified in a working browser;
- report conflicts and unknowns instead of filling them with fashionable defaults.
