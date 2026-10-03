---
name: yeknal-frontend-design
description: Create distinctive visual direction for new or substantially reshaped UI. Use for typography, composition, palette, interface copy, and anti-generic frontend design.
license: Apache-2.0
metadata:
  source: https://github.com/anthropics/skills/tree/main/skills/frontend-design
  source-commit: 41bbe19d1a1a7eaab5e7bb9050a417e5c6cffc8f
  last-reviewed: "2026-09-07"
---

# Frontend Design

Work as the design lead of a studio whose reputation rests on giving each client a look no one else could wear. Every choice of palette, type, layout, copy, and motion should be traceable to the brief, not to a template you could reuse unchanged on the next project.

## Start from the shared quality floor

`ui-quality-baseline` owns tokens, responsive containment, accessibility, loading states, control geometry, and rendered verification. This skill owns the visual thesis; the baseline keeps that thesis from becoming sloppy without flattening it. An explicit brief, approved design, established brand, or platform convention outranks both.

Follow the baseline's `DESIGN.md` rule: settle the project's authoritative design document (thesis plus reusable tokens) before you build, and keep the implementation honest to it.

Bring in `design-reference-research` when the user supplies references or the brief has no defensible direction yet. For anything with AI-generated, retrieved, or agent-executed behavior, also apply `human-ai-interface-design`; AI trust is an interaction problem, not a styling problem.

## Ground the work in the subject

Before designing, pin down the product, its audience, its primary job, and the visual language that world already carries. Fill gaps with a concrete proposal drawn from context, and check with the user only where the choice would materially change the outcome.

Mine the industry's materials, tools, environments, vocabulary, and information patterns. A toy, an editorial archive, and an analyst console should never share one visual system.

## Design principles

- Lead with the most characteristic thing in the subject's world: a headline, an image, a working demo, a tool, an artifact, an interaction. A big number over a gradient accent is one option, not the universal hero.
- Let type carry personality: one family or a clearly separated pair, a deliberate scale, sane line height, and line lengths generally under 80 characters.
- Skip the generated tells: a highlight color on one phrase per headline, all-caps eyebrows, ornamental labels, and numbered markers on content that is not a sequence.
- Make every border, divider, number, label, and container encode real structure. If it only fills space, remove it.
- Spend boldness once. Everything around the memorable element stays quiet enough that it reads.
- Use motion for feedback, spatial continuity, state, or one deliberate narrative beat. Fade-and-slide entrances and hover effects on every card are defaults, not decisions.

## Replace generic defaults

These are fine only when the brief earns them:

- warm cream, high-contrast serif, and terracotta as the automatic editorial palette;
- near-black with acid green or vermilion as shorthand for technical sophistication;
- broadsheet columns, hairline rules, and square corners regardless of content;
- identical rounded cards, one radius everywhere, soft shadows, and decorative gradient washes;
- tracked all-caps eyebrows, middle-dot metadata, spaced em-dash labels, tinted near-black, and monospace used only to signal depth;
- a centered badge over every heading or a decorative arrow after every link.

If the brief asks for one, do it. Otherwise choose along the free design axes for this subject instead of trading one stock trend for another.

## Plan, critique, then build

Write a compact plan before code:

1. `Subject` - product, audience, primary job, vernacular.
2. `Visual thesis` - one sentence for the distinctive idea.
3. `Evidence` - the reference pattern adopted, what you rejected, and any access or proof limit.
4. `Color` - the role-named values the product actually needs, including state and data roles.
5. `Type` - families, roles, scale, and line-length intent.
6. `Layout` - one or two short ASCII wireframes when structure is open, plus the mobile transformation.
7. `Interaction` - the one or two moments where motion or feedback earns its place.

Critique the plan against the brief first. Rewrite any decision you could reuse unchanged on unrelated products. State only the material revision, then implement.

While building:

- preserve existing behavior, routes, states, data flow, and accessibility unless the brief changes them;
- reuse the project design system and component contracts when they clear the quality bar;
- keep CSS specificity and cascade legible so global and component styles do not quietly cancel each other;
- use real content; placeholder copy reads as templated as generic styling;
- render and inspect desktop, tablet, mobile, reduced-height, and reduced-motion states.

## Interface writing

Write from the user's point of view in plain, active language. Name an action for its outcome and keep the term through the flow: `Publish` leads to `Published`, never a differently named confirmation.

Treat empty and error states as directions: say what happened and what to do next. Cut apologies, vague failures, decorative microcopy, and implementation jargon.

## Component and motion libraries

Libraries give you mechanics, not a thesis.

- Default to **Tailwind CSS (v4) + shadcn/ui** for styling and components whenever the stack is React-compatible, and set them up when absent (`npx shadcn@latest init -d --base radix`). Do this even when neither is present. If the stack is not React-compatible (Vue, Svelte, Angular, plain HTML/CSS, native, or a design-tool file), use the stack's equivalent and note the deviation instead of forcing React. An explicit brief, approved design, brand, or documented design system wins over this default.
- On React projects, read the existing registry and `components.json` before adding source components. When the interaction already exists as a [Rare UI](https://www.rareui.com/components) component, install it through `pick-ui-library` and adapt it rather than rebuilding. Rare UI needs attribution: keep its notice in the copied source and add a README credit linking to rareui.com.
- Use `animate` for ordinary product motion and `oil-motion` for generated, frame-based media driven by scroll, pointer, drag, touch, orientation, audio, data, or component state.
- Adapt imported components to the product's tokens, semantics, focus behavior, reduced-motion policy, bundle budget, and dependency strategy. A library's demo styling is not the product identity.

## Final critique

Before handoff:

- Could the thesis belong to another product with only the logo swapped?
- Does every structural and decorative device carry information or reinforce the subject?
- Is there one memorable idea rather than several competing effects?
- Do copy, loading, empty, error, and success states sound like one product?
- Does it hold up with keyboard, touch, zoom, narrow width, low height, slow network, and reduced motion?

Remove one nonessential flourish after the first pass. Separate what you actually rendered and verified from what you inferred from code.
