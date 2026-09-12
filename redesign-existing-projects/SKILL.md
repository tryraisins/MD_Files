---
name: redesign-existing-projects
description: Redesign an existing website or app without breaking behavior or data flow. Use for visual refreshes, UX improvements, responsive repair, or de-genericization.
---

# Redesign an existing product

Improve the real product, not an imagined replacement. A redesign is successful when the interface becomes clearer, more coherent, more distinctive, and more robust while its required behavior still works.

Also apply `ui-quality-baseline`. Use `design-reference-research` when the redesign is reference-led or the current product lacks a defensible direction. Use `human-ai-interface-design` for real generation, recommendation, retrieval, copilot, or agent behavior.

## Preserve the contract

Before editing, inventory:

- routes, navigation, forms, state, bindings, queries, mutations, side effects, analytics, and error handling;
- framework, styling system, components, tokens, iconography, themes, dependencies, and build/deploy assumptions;
- approved design files, brand assets, content, screenshots, and repository instructions;
- responsive behavior, accessibility semantics, keyboard/touch behavior, loading and failure states;
- intentional quirks or compatibility constraints that a visual cleanup could accidentally erase.

Do not replace working behavior with mock data, placeholders, dead controls, redirects, or visual approximations. Keep existing conventions unless a change is explicitly in scope and justified.

## Establish evidence before taste

Capture the current product at representative viewports and states. Record confirmed defects separately from preferences and unknowns. If references are involved, compare functionally similar products and follow the evidence boundaries in `design-reference-research`; attractive screenshots do not prove usability or implementation quality.

Define:

- the user and business problem the redesign addresses;
- one product-specific visual/interaction thesis;
- what must remain recognizable;
- the smallest coherent system change that can achieve the thesis;
- three fashionable patterns explicitly rejected because they do not fit.

## Audit the experience

### Structure and user flow

- Can users identify place, state, next action, consequence, and recovery path?
- Do navigation, information architecture, page title, active state, browser history, deep links, and dead ends behave correctly?
- Does the content sequence answer user questions before asking for commitment?
- Are forms, tables, filters, comparison, search, and dashboards structured around the real task rather than decorative containers?

### Visual system

- Are type, color, spacing, grid, radius, border, elevation, imagery, and icons tokenized and coherent?
- Do hierarchy and density match task frequency and content complexity?
- Are exceptions meaningful, or are they accumulated one-off values?
- Does the page have a product-specific signature, or could the brand and nouns be swapped without changing the design?

Do not diagnose “slop” from one font, hue, card count, centered hero, or navigation style. Diagnose unsupported decisions, copied trend bundles, repetitive section grammar, weak content hierarchy, incoherent tokens, fake depth, gratuitous motion, and incomplete states.

### Content and truthfulness

- Replace vague generated copy with specific, product-grounded language.
- Use real approved assets and data when available. Label fixtures and placeholders; never invent realistic people, dates, metrics, testimonials, client logos, or contact details to make a mockup appear live.
- Keep CTA labels consistent with their actual consequence. Do not hide cost, prerequisites, destructive impact, or unavailable capability.
- Include required legal, privacy, status, attribution, and recovery content based on product scope—not as universal boilerplate.

### Components and states

- Audit idle, hover/no-hover, focus, pressed, selected, expanded, pending, success, error, empty, offline, disabled, permission-denied, cancellation, and retry where applicable.
- Match loading feedback to the wait: geometry-matched skeleton for content, stable pending control for an action, determinate progress only when real, and an overlay only for genuinely blocking work.
- Keep component dimensions stable, status readable without color alone, focus visible, and announcements appropriate.
- Use cards only when containment, comparison, selection, grouping, or elevation is meaningful.

### Responsive and device behavior

Use `design-reference-research/references/responsive-matrix.md`. Inspect small/common phones, tablet portrait/landscape, compact-height and standard desktop, wide desktop, zoom, keyboard, touch/no-hover, reduced motion, and product-specific safe-area, split-view, foldable, or virtual-keyboard conditions.

For every region, decide explicitly what reflows, reorders, condenses, becomes progressive disclosure, changes navigation mode, scrolls intentionally, or can be omitted. Check long copy, translations, data extremes, image crops, sticky/fixed occlusion, and horizontal overflow.

### Motion and performance

- Keep motion that communicates hierarchy, continuity, feedback, or state; remove motion whose only rationale is fashion.
- Apply `animate` for interaction details. Define trigger, intermediate state, interruption, exit, reduced-motion path, and pointer/touch differences.
- Measure before adding large images, filters, WebGL, video, custom fonts, scroll timelines, or a new animation dependency.
- Preserve content availability and control responsiveness when motion or assets fail.

### Accessibility

- Preserve or improve semantic landmarks, heading order, labels, descriptions, error association, focus order, skip links, dialogs, live regions, and target sizes.
- Verify text and non-text contrast, zoom/reflow, high-contrast or forced-color behavior where relevant, reduced motion, and keyboard-only completion.
- Accessibility fixes are behavior changes: test them rather than assuming markup alone proves success.

## Plan changes by coherence and risk

Group findings into:

1. **Behavior and accessibility defects:** broken flow, unreadable state, inaccessible control, responsive failure.
2. **System defects:** inconsistent tokens, typography, component anatomy, state language, or layout constraints.
3. **Page/flow defects:** weak hierarchy, evidence order, navigation, CTA, footer, 404, or recovery.
4. **Polish opportunities:** imagery, material, motion, and signature details after the system works.

Fix the highest-impact root cause instead of restyling every symptom. Keep changes reviewable. A font swap, asymmetric grid, glass surface, texture, or scroll effect is not automatically an upgrade.

## Implement without collateral change

- Work in the installed stack and inspect dependencies before imports.
- Reuse components and semantic tokens; centralize new roles instead of scattering arbitrary values.
- Preserve network contracts, state transitions, validation, analytics, side effects, and errors.
- Keep source, generated assets, test artifacts, screenshots, and credentials separated for commit hygiene.
- Run targeted static checks after each coherent slice and broader repository checks before handoff.

## Rendered validation

After implementation:

1. Compare before and after at the target device matrix.
2. Walk primary and recovery flows with keyboard and touch assumptions.
3. Exercise real loading, empty, long-content, error, success, disabled, permission, and interrupted states where the environment permits.
4. Check clipping, overflow, focus, content order, layout shift, image crops, sticky collisions, reduced motion, and performance regressions.
5. Re-read the redesign thesis and rejection list; remove trend-driven additions that lack a product reason.
6. Report exactly what static checks, browsers, devices, data, services, and deployments were or were not verified.

## Deliverable

Return the confirmed problems, governing thesis, changes made, preserved behavior, validation evidence, and unresolved live-environment gates. Do not claim tenant, backend, deployment, analytics, or device proof from local static checks alone.
