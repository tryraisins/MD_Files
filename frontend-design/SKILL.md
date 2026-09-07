---
name: frontend-design
description: Guidance for distinctive, intentional visual design when building new UI or reshaping an existing one. Use for aesthetic direction, typography, layout, interface copy, and implementation choices that must avoid templated AI defaults. Prefer this brief-specific design direction over generic style advice when instructions conflict.
license: Apache-2.0
metadata:
  source: https://github.com/anthropics/skills/tree/main/skills/frontend-design
  source-commit: 41bbe19d1a1a7eaab5e7bb9050a417e5c6cffc8f
  last-reviewed: "2026-09-07"
---

# Frontend Design

Approach the work as the design lead at a studio known for giving every client a distinct visual identity. Make deliberate choices about palette, typography, layout, copy, and interaction that grow from the brief instead of from a reusable aesthetic template.

## Apply the shared quality floor

Use `ui-quality-baseline` for tokens, responsive containment, accessibility, loading states, control geometry, and rendered verification. This skill owns the visual thesis. The baseline protects quality without flattening that thesis. An explicit brief, approved design, established brand, or platform convention wins when it conflicts with either skill.

## Ground the design in the subject

Identify the product, audience, primary job, and subject-specific visual language before designing. If the brief omits one of these, infer a concrete proposal from available context and confirm only decisions that would materially change the result.

Use the industry's materials, tools, environments, language, and information patterns as design inputs. A toy, an editorial archive, and an analyst console should not inherit the same visual system.

## Design principles

- Open with the most characteristic thing in the subject's world: a headline, image, working demo, tool, artifact, or interaction. A large metric plus gradient accent is a default, not a universal hero.
- Let typography carry personality. Use one family or a clearly differentiated pair, an intentional scale, appropriate line height, and line lengths generally below 80 characters.
- Avoid the common generated pattern of styling one phrase in every headline, all-caps eyebrows, ornamental labels, and repeated numbered markers when the content is not a sequence.
- Make borders, dividers, numbering, labels, and containers encode structure. Do not add them merely to fill space.
- Spend boldness in one place. Keep surrounding elements disciplined enough that the memorable element remains legible.
- Use motion for feedback, spatial continuity, state, or a single deliberate narrative moment. Scattered fade-and-slide entrances and hover effects on every card are template defaults.

## Detect and replace generic defaults

Treat these as legitimate choices only when the brief earns them:

- warm cream, high-contrast serif, and terracotta as an automatic editorial palette;
- near-black with acid green or vermilion as automatic technical sophistication;
- dense broadsheet columns, hairline rules, and square corners regardless of content;
- identical rounded cards, one radius everywhere, soft shadows, and decorative gradient washes;
- tracked all-caps eyebrows, middle-dot metadata, spaced em-dash labels, tinted near-black, and monospace used only to imply technical depth;
- a centered badge above every heading or a decorative arrow appended to every link.

When the brief explicitly requests one of these, follow it. Otherwise, use the free design axes for choices tied to this subject rather than swapping one stock trend for another.

## Plan, critique, then build

Before implementation, write a compact design plan:

1. `Subject`: product, audience, primary job, and relevant vernacular.
2. `Visual thesis`: one sentence explaining the distinctive idea.
3. `Color`: four to six role-named colors with values.
4. `Type`: families, roles, scale, and line-length intent.
5. `Layout`: one or two short ASCII wireframes when structure is not already fixed.
6. `Interaction`: the one or two moments where motion or feedback materially helps.

Critique the plan against the brief before writing code. Replace any decision that could be reused unchanged for several unrelated products. State only the material revision, then implement.

During implementation:

- preserve existing behavior, routes, states, data flow, and accessibility unless the brief changes them;
- reuse the project's design system and component contracts where they meet the quality bar;
- keep CSS specificity and cascade behavior legible so global and component styles do not silently cancel each other;
- use real content when possible; vague placeholder copy makes a design feel as templated as generic styling;
- render and inspect representative desktop, tablet, mobile, reduced-height, and reduced-motion states.

## Interface writing

Write from the user's perspective with plain, active language. Name actions by their outcome and keep the same term through the flow: `Publish` should lead to `Published`, not a differently named confirmation.

Treat empty and error states as directions. Explain what happened and what the user can do next. Avoid apologies, vague failure messages, decorative microcopy, and implementation jargon.

## Component and motion libraries

Libraries supply mechanics, not the visual thesis.

- For shadcn-compatible React projects, inspect the existing registry and `components.json` before adding source components. Rare UI may be a useful source for unusual animated primitives; use `pick-ui-library` to evaluate and install only the component whose interaction matches the brief.
- Use `animate` for ordinary product motion and `oil-motion` for generated, frame-based media controlled by scroll, pointer, drag, touch, orientation, audio, data, or component state.
- Adapt imported components to the product's tokens, semantics, focus behavior, reduced-motion policy, bundle budget, and dependency strategy. Do not let a library's demo styling become the product identity.

## Final critique

Before handoff, ask:

- Could the visual thesis belong to a different product with only the logo changed?
- Is every structural and decorative device carrying information or reinforcing the subject?
- Is there one clear memorable idea rather than many competing effects?
- Do copy, loading, empty, error, and success states sound like the same product?
- Does the rendered result remain usable with keyboard, touch, zoom, narrow width, low height, slow network, and reduced motion?

Remove one nonessential flourish after the first complete pass. Report what was rendered and verified separately from what was inferred from code.
