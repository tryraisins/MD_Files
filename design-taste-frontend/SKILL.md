---
name: design-taste-frontend
description: Design and implement expressive landing pages, portfolios, and marketing interfaces from product evidence instead of reusable AI recipes. Use when a new web experience needs distinctive art direction and working code; use redesign-existing-projects for an existing product and narrower aesthetic skills when the user names a specific style.
---

# Design taste for frontend

Build an authored interface whose visual decisions can be traced to the product, audience, content, brand, and device—not to a fashionable starter composition.

Also apply `ui-quality-baseline`. Approved designs, repository instructions, the established design system, and working behavior outrank this skill. Do not change frameworks, styling systems, state flow, or dependencies merely to achieve a look.

Use `design-reference-research` when the user supplies references or the direction is not already defensible. Use `human-ai-interface-design` when the experience includes generation, recommendations, retrieval, copilots, or agents. Use `high-end-visual-design` only when the brief explicitly calls for showcase-level art direction.

## Read the product before designing

Identify or infer:

- the page job and the action users must understand or complete;
- audience, trust level, buying or decision context, and content density;
- brand assets, existing tokens, platform conventions, and approved references;
- real content, imagery, product artifacts, data, and states available;
- target viewport, orientation, pointer, keyboard, touch, zoom, theme, and motion preferences;
- performance, accessibility, localization, legal, and implementation constraints.

State a compact design read: product, audience, intended feeling, visual thesis, signature device, and three tempting patterns you will reject. Reject a thesis that would still fit after swapping the logo and product noun.

## Use references as evidence

Extract decisions separately for navigation, hierarchy, content sequence, layout, type, color, imagery, component states, motion, and responsive transformation. A gallery still can support visual observations; it cannot prove usability, accessibility, conversion, performance, or production behavior.

Do not collage unrelated fragments. Prefer a few functionally comparable references, inspect their live mobile and desktop behavior, note outliers and failures, and stop when additional examples no longer change a decision.

## Choose the system before the composition

1. Reuse the product's tokens, primitives, icon language, and content model when they exist.
2. If adopting a formal design system, verify its current installation path, version, accessibility contract, theme model, and responsive behavior.
3. If creating a local system, define semantic roles for type, color, spacing, radius, border, elevation, motion, and layers before styling individual sections.
4. Keep exceptions explicit. A signature treatment should be rare enough to remain a signature.

Specific fonts, hues, glass, gradients, asymmetry, cards, bentos, editorial white space, brutalism, texture, 3D, and centered heroes are neither inherently premium nor inherently slop. They become slop when chosen without product rationale, repeated mechanically, or left incoherent across states and devices.

## Compose the complete page

Design the sequence as an argument:

- **Navigation:** exposes the right destinations and state for the page depth and device.
- **Opening/hero:** establishes identity, value, context, and the next useful action without forcing a fixed word count or fold position.
- **Evidence:** uses real product material, proof, demonstrations, comparison, process, or outcomes in an order that resolves user questions.
- **Commitment:** presents CTA hierarchy, consequence, prerequisites, and reassurance appropriate to the decision.
- **Continuation:** provides a useful pre-footer and footer with navigation, contact, legal, and status information that the product actually needs.
- **Recovery and sharing:** covers 404 or dead-end recovery and Open Graph output where relevant.

Repeated cards are correct for comparison; asymmetric editorial composition is correct for narrative emphasis. Choose layout from information relationships, not from a quota for variety. Align shared content when comparison matters and allow deliberate variation when hierarchy matters.

## Build a coherent visual language

### Typography

- Select for voice, reading conditions, script coverage, metrics, licensing, and loading cost.
- A system stack may be more deliberate than a distinctive display face. Preserve an established family unless typography is in scope.
- Define roles and measures; verify wrapping, truncation, italic/diacritic clearance, fallback metrics, and zoom behavior with real copy.

### Color and material

- Name colors by semantic role and verify text, non-text, focus, disabled, state, and data contrast.
- Use the palette required by brand and information structure. Do not ban a hue or impose one accent merely to look different.
- Give borders, shadows, texture, transparency, grain, imagery, and depth a hierarchy or atmosphere purpose. Provide fallbacks when effects reduce transparency, contrast, performance, or legibility.

### Components and iconography

- Use containers only when grouping, containment, comparison, selection, or elevation is meaningful.
- Keep control geometry stable across idle, hover, focus, pressed, pending, success, error, disabled, and selected states.
- Reuse one coherent icon language unless a second family has a documented semantic role. Verify accessible names and optical alignment.
- Treat loading, empty, error, offline, partial, permission-denied, and success states as first-class compositions.

### Content and assets

- Prefer real, approved product images and truthful sample data. Label fixtures and placeholders; never invent realistic people, dates, metrics, endorsements, or logos to make a mockup appear live.
- Write specific draft copy that reflects the product. Avoid empty superlatives and repeated CTA labels with ambiguous consequences.
- Generate imagery only when the user requests or authorizes it and the result has a clear content role; record that it is generated where disclosure matters.

## Plan responsive transformation

Use the matrix in `design-reference-research/references/responsive-matrix.md`. At minimum, test small and common phones, tablet portrait and landscape, reduced-height and standard desktop, wide desktop, text zoom, keyboard, touch/no-hover, and reduced motion.

For each region, state whether it reflows, reorders, becomes progressive disclosure, changes navigation mode, scrolls intentionally, or is omitted with justification. Do not treat responsive design as a blind single-column collapse. Verify long words, translations, virtual keyboards, safe areas, browser chrome, pointer types, and device rotation where relevant.

## Use motion as information

Apply `animate` for ordinary interface motion. Define the trigger, user benefit, intermediate state, interruption, settled state, exit, input differences, and reduced-motion behavior. Prefer platform and CSS capabilities for simple state changes; add Motion, GSAP, or another dependency only when the repository and interaction justify it.

A reference clip is not a timing specification. Recreate purpose and perceived physics after measuring the actual component. Avoid scroll hijacking, perpetual motion, and entrance choreography that delays frequent tasks or hides content.

## Implementation discipline

- Inspect the package manifest before importing anything. Reuse the installed framework, styling system, and primitives.
- Preserve semantic HTML, route behavior, focus order, forms, state, data bindings, side effects, errors, and analytics.
- Use fluid constraints, intrinsic layout, grid or flex according to the relationship, `dvh` where a dynamic viewport is actually required, and intentional overflow only.
- Keep client-side animation and pointer work isolated from static rendering. Clean up observers, timelines, listeners, and asynchronous work.
- Meet the repository's performance and accessibility gates; decorative ambition does not waive them.

## Rendered pre-flight

Before completion:

1. Render the actual implementation at the target matrix—not only a component preview.
2. Walk the primary flow with keyboard and touch assumptions; inspect focus, hover/no-hover, pending, empty, error, success, and recovery.
3. Check clipping, horizontal overflow, text measure, order, occlusion, cumulative layout shift, image crops, and fixed/sticky collisions.
4. Compare the result with the stated thesis and rejection list. Remove any element that exists only because it is fashionable.
5. Report what was verified and keep browser, device, network, data, and deployment claims inside the evidence boundary.

## Optional technique reference

Load [patterns-redesign-and-sources.md](references/patterns-redesign-and-sources.md) only when a selected technique needs an implementation skeleton or historical source note. Its fixed counts, palettes, font bans, layout quotas, and theme mandates are legacy heuristics, not current requirements; this skill and `ui-quality-baseline` take precedence.
