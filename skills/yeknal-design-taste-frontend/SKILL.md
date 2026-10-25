---
name: yeknal-design-taste-frontend
description: Design and build expressive landing pages, portfolios, and marketing interfaces from product evidence instead of reusable AI recipes, including showcase-level art direction. For an existing product use `yeknal-redesign-existing-projects`.
metadata:
  source: https://github.com/leonxlnx/taste-skill
  source-commit: ce26fc25c0e5e8cab638f883de62d9a86ee5e45b
---

# Design taste for frontend

Build an authored interface whose visual choices trace back to the product, audience, content, brand, and device—not to a fashionable starter composition.

Also apply `yeknal-ui-quality-baseline`. Approved designs, repository instructions, the established design system, and working behavior outrank this skill. Never swap frameworks, styling systems, state flow, or dependencies merely to achieve a look.

Reach for `yeknal-design-reference-research` when the user supplies references or the direction is not yet defensible. Reach for `yeknal-human-ai-interface-design` when the experience includes generation, recommendations, retrieval, copilots, or agents.

## Read the product before designing

Identify or infer:

- the page job and the action users must understand or complete;
- audience, trust level, buying or decision context, and content density;
- brand assets, existing tokens, platform conventions, and approved references;
- real content, imagery, product artifacts, data, and states available;
- target viewport, orientation, pointer, keyboard, touch, zoom, theme, and motion preferences;
- performance, accessibility, localization, legal, and implementation constraints.

State a compact design read: product, audience, intended feeling, visual thesis, signature device, and three tempting patterns you will reject. Reject any thesis that would still fit after swapping the logo and the product noun.

## Use references as evidence

Pull decisions apart per area: navigation, hierarchy, content sequence, layout, type, color, imagery, component states, motion, and responsive transformation. A gallery still can support visual observations; it cannot prove usability, accessibility, conversion, performance, or production behavior.

Do not collage unrelated fragments. Prefer a few functionally comparable references, inspect their live mobile and desktop behavior, note outliers and failures, and stop once additional examples no longer change a decision.

## Choose the system before the composition

1. Reuse the product's tokens, primitives, icon language, and content model when they exist.
2. If adopting a formal design system, confirm its current installation path, version, accessibility contract, theme model, and responsive behavior.
3. If building a local system, define semantic roles for type, color, spacing, radius, border, elevation, motion, and layers before styling individual sections.
4. Keep exceptions explicit. A signature treatment should stay rare enough to remain a signature.

Specific fonts, hues, glass, gradients, asymmetry, cards, bentos, editorial white space, brutalism, texture, 3D, and centered heroes are neither inherently premium nor inherently slop. They turn into slop when chosen without product rationale, repeated mechanically, or left incoherent across states and devices.

## Compose the complete page

Design the sequence as an argument:

- **Navigation:** exposes the right destinations and state for the page depth and device.
- **Opening/hero:** establishes identity, value, context, and the next useful action without forcing a fixed word count or fold position.
- **Evidence:** uses real product material, proof, demonstrations, comparison, process, or outcomes in an order that answers user questions.
- **Commitment:** presents CTA hierarchy, consequence, prerequisites, and reassurance appropriate to the decision.
- **Continuation:** provides a useful pre-footer and footer with navigation, contact, legal, and status information the product actually needs.
- **Recovery and sharing:** covers 404 or dead-end recovery and Open Graph output where relevant.

Repeated cards are right for comparison; asymmetric editorial composition suits narrative emphasis. Choose layout from information relationships, not from a quota for variety. Align shared content when comparison matters and allow deliberate variation when hierarchy matters.

## Plan responsive transformation

Use the matrix in `yeknal-design-reference-research/references/responsive-matrix.md`. At minimum, test small and common phones, tablet portrait and landscape, reduced-height and standard desktop, wide desktop, text zoom, keyboard, touch/no-hover, and reduced motion.

For each region, state whether it reflows, reorders, becomes progressive disclosure, changes navigation mode, scrolls intentionally, or is omitted with justification. Do not treat responsive design as a blind single-column collapse. Verify long words, translations, virtual keyboards, safe areas, browser chrome, pointer types, and device rotation where relevant.

## Use motion as information

Apply `yeknal-animate` for ordinary interface motion. Define the trigger, user benefit, intermediate state, interruption, settled state, exit, input differences, and reduced-motion behavior. Prefer platform and CSS capabilities for simple state changes; add Motion, GSAP, or another dependency only when the repository and interaction justify it.

A reference clip is not a timing specification. Recreate purpose and perceived physics after measuring the actual component. Avoid scroll hijacking, perpetual motion, and entrance choreography that delays frequent tasks or hides content.

## Implementation discipline

- Inspect the package manifest before importing anything. Reuse the installed framework, styling system, and primitives.
- Preserve semantic HTML, route behavior, focus order, forms, state, data bindings, side effects, errors, and analytics.
- Prefer real, approved product images and truthful sample data. Label fixtures and placeholders; never invent realistic people, dates, metrics, endorsements, or logos to make a mockup appear live. Generate imagery only when the user authorizes it and it has a clear content role, and record that it is generated where disclosure matters.
- Use fluid constraints, intrinsic layout, grid or flex according to the relationship, `dvh` where a dynamic viewport is genuinely required, and intentional overflow only.
- Keep client-side animation and pointer work isolated from static rendering. Clean up observers, timelines, listeners, and asynchronous work.
- Meet the repository's performance and accessibility gates; decorative ambition does not waive them.

## Rendered pre-flight

Before completion:

1. Render the actual implementation at the target matrix, not only a component preview, and walk the primary flow with keyboard and touch assumptions.
2. Run the baseline's clipping, horizontal overflow, layout-shift, image-crop, fixed/sticky collision, pending, empty, error, and recovery checks.
3. Compare the result with the stated thesis and rejection list. Remove any element that exists only because it is fashionable.
4. Report what was verified and keep browser, device, network, data, and deployment claims inside the evidence boundary.

Load [dials-and-arsenal.md](references/dials-and-arsenal.md) when a brief needs a starting bias on variance, motion intensity, or density, or when you want the vocabulary for a named technique (bento grid, sticky scroll stack, magnetic button, spotlight border). The dial values are biases to argue against, not targets to hit.
