---
name: yeknal-redesign-existing-projects
description: Redesign an existing website or app without breaking behavior or data flow. Use for visual refreshes, UX improvements, responsive repair, or de-genericization.
metadata:
  source: https://github.com/leonxlnx/taste-skill
  source-commit: ce26fc25c0e5e8cab638f883de62d9a86ee5e45b
---

# Redesign an existing product

Improve the real product, not an imagined replacement. A redesign succeeds when the interface becomes clearer, more coherent, more distinctive, and more robust while its required behavior still works.

Also apply `yeknal-ui-quality-baseline`. Use `yeknal-design-reference-research` when the redesign is reference-led or the current product lacks a defensible direction. Use `yeknal-human-ai-interface-design` for real generation, recommendation, retrieval, copilot, or agent behavior.

## Preserve the contract

Before editing, inventory:

- routes, navigation, forms, state, bindings, queries, mutations, side effects, analytics, and error handling;
- framework, styling system, components, tokens, iconography, themes, dependencies, and build/deploy assumptions;
- approved design files, brand assets, content, screenshots, and repository instructions;
- responsive behavior, accessibility semantics, keyboard/touch behavior, loading and failure states;
- intentional quirks or compatibility constraints that a visual cleanup could accidentally erase.

Do not replace working behavior with mock data, placeholders, dead controls, redirects, or visual approximations. Keep existing conventions unless a change is explicitly in scope and justified.

## Establish evidence before taste

Capture the current product at representative viewports and states. Record confirmed defects separately from preferences and unknowns. If references are involved, compare functionally similar products and follow the evidence boundaries in `yeknal-design-reference-research`; attractive screenshots do not prove usability or implementation quality.

Define:

- the user and business problem the redesign addresses;
- one product-specific visual/interaction thesis;
- what must remain recognizable;
- the smallest coherent system change that can achieve the thesis;
- three fashionable patterns explicitly rejected because they do not fit.

## Audit the experience

Work through flow, visual system, content, components and states, responsive behavior, motion, and accessibility against `yeknal-ui-quality-baseline`. Keep the findings this skill adds:

- Record confirmed defects separately from preferences and unknowns. Use real approved assets and data; label fixtures and placeholders.
- Never invent people, dates, metrics, testimonials, client logos, or contact details to make a mockup appear live.
- Keep CTA labels consistent with their actual consequence. Do not hide cost, prerequisites, destructive impact, or unavailable capability.
- Use cards only when containment, comparison, selection, grouping, or elevation is meaningful.
- For every region, decide explicitly what reflows, reorders, condenses, becomes progressive disclosure, changes navigation mode, scrolls intentionally, or can be omitted. Use the responsive matrix in `yeknal-design-reference-research` for the device set.
- Measure before adding large images, filters, WebGL, video, custom fonts, scroll timelines, or a new animation dependency.
- Accessibility fixes are behavior changes: test them rather than assuming markup alone proves success.
- Do not diagnose "slop" from one font, hue, card count, centered hero, or navigation style. Diagnose unsupported decisions, copied trend bundles, repetitive section grammar, weak content hierarchy, incoherent tokens, fake depth, and incomplete states.

## Plan changes by coherence and risk

Group findings into:

1. **Behavior and accessibility defects:** broken flow, unreadable state, inaccessible control, responsive failure.
2. **System defects:** inconsistent tokens, typography, component anatomy, state language, or layout constraints.
3. **Page/flow defects:** weak hierarchy, evidence order, navigation, CTA, footer, 404, or recovery.
4. **Polish opportunities:** imagery, material, motion, and signature details after the system works.

Fix the highest-impact root cause instead of restyling every symptom. Keep changes reviewable. A font swap, asymmetric grid, glass surface, texture, or scroll effect is not automatically an upgrade, and a face from [typeface options](../yeknal-ui-quality-baseline/references/typeface-options.md) is only a candidate after it passes the selection gate in [typography](../yeknal-ui-quality-baseline/references/typography.md).

## Implement without collateral change

- Work in the installed stack and inspect dependencies before imports.
- Follow the Tailwind CSS (v4) + shadcn/ui default for React-compatible stacks and the stack-appropriate equivalent otherwise, per `AGENTS.md` section 24. Preserve an existing documented design system unless replacing it is explicitly in scope.
- Use `yeknal-pick-ui-library` before adding or adapting a registry component; keep any license notice and required README credit.
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
