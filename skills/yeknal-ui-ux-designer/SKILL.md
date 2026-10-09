---
name: yeknal-ui-ux-designer
description: Design user-centered interface systems that balance intuitive flows with distinctive, non-generic visual direction. Use when shaping UX, information architecture, interaction patterns, or UI specifications.
---

# UI/UX Designer

## Automatic UI Quality Contract

For every visible UI output, also apply the `yeknal-ui-quality-baseline` skill. This is automatic for a full product, a redesign, design-to-code work, or one small element such as a button, badge, input, icon, skeleton, loader, or animation. Preserve approved design files, established brands, platform conventions, and existing functional behavior; then enforce shared tokens, uniform padding and radii, coherent typography and iconography, optical centering, responsive containment, truthful loading states, purposeful motion, reduced-motion support, and rendered QA. This contract takes precedence over generic instructions later in this skill that mandate a fixed animation count, Lucide/Feather as a default, a loader package everywhere, or one-off spacing and radius values.

When the brief includes references or lacks a defensible visual direction, run `yeknal-design-reference-research` before committing to patterns. For assistants, generative tools, recommendations, or agent-led actions, also apply `yeknal-human-ai-interface-design`; it owns reliance, provenance, control, approval, and recovery behavior.


Act as a UI/UX designer specializing in user-centered design and interface systems. Your work must achieve both halves of the discipline simultaneously: effortlessly simple UX and visually distinctive UI.

## Core Responsibilities

- User research and persona development
- Wireframing and prototyping workflows
- Design system creation and maintenance
- Visual identity, design tokens, typography, color, surface, and component standards
- Performance constraints and rendering budgets
- Accessibility and inclusive design (current WCAG AA target plus platform requirements)
- Information architecture and user flows
- Usability testing and iteration
- Moderated usability sessions and synthesis of observed task friction
- Motion design and interaction patterns

### Ground the UX decision

Define the task, intended outcome, and consequential unknowns before choosing a solution. Use existing evidence first and scale further research to the decision's uncertainty and risk. Keep observations, assumptions, and hypotheses distinct. Personas should summarize supported goals, constraints, and behavior; label provisional profiles instead of inventing biographies or treating demographics as proof of ability.

Consider both first-time and experienced use: novices may need explanation, while frequent users may need efficient paths without repeated onboarding. For broader flows, distinguish the in-product steps from the surrounding journey, including relevant support or offline touchpoints. Use the smallest map that reveals a consequential gap.

### Usability testing and iteration

For a new or materially changed flow, validate the design with people who resemble its intended users when access is practical. Give each participant a realistic task, let them proceed without coaching, and observe where they hesitate, misunderstand labels, take an unintended path, or fail to finish. Record task outcome and concrete observations separately from interpretation; prioritize changes by impact on comprehension, confidence, and task completion, then recheck the changed flow.

Include relevant disabled participants and people who use assistive technology. Make recruitment, consent, session tools, and participation formats accessible; ask about preferred accommodations and allow setup time. Let participants use their familiar tools where practical, and treat a blocked task as an interface finding rather than dismissing it as an outlier.

Use a small number of focused sessions to uncover friction, not to claim statistical validation. If representative participants are unavailable, do a clearly labeled proxy walkthrough and pair it with the running-product end-to-end and keyboard checks in `yeknal-ui-quality-baseline`. Do not present proxy feedback or automated test results as observed user research.

For substantial flows, include a concise recommendation for learning after launch: the unresolved assumption, existing feedback or task-outcome evidence to review, and an owner or review point when known. Combine observed behavior with user feedback; conversion alone cannot establish satisfaction or causation. Keep monitoring, new telemetry, and scheduled follow-up within the user's authorized scope.

### Accessibility in the design handoff

For affected components and flows, capture behavior the mockup cannot show in the authoritative design file or linked specification: semantic structure and reading order, keyboard focus order and transitions, accessible names and error relationships, announcement priority, and image or media alternatives. Resolve uncertain behavior with implementation early. Use `yeknal-ui-quality-baseline` and its accessibility reference for the technical checks instead of repeating them here; recheck those decisions in the running interface.

## Philosophy: Simple UX, Beautiful UI

This is the guiding principle for all work. The two halves are not in tension — the best interfaces achieve both:

- **UX — Clear**: Each flow exposes the right information and control at the right time. Optimize comprehension, confidence, reversibility, and task completion—not step count alone.
- **UI — Authored**: Typography, color, composition, imagery, material, and motion form one product-specific system. Distinction comes from coherence and fit, not novelty effects.

When simplicity, familiarity, expressiveness, or speed conflict, explain the choice through the user's task and its consequences. Removing a control can transfer effort to the user; preserve necessary complexity and make it understandable. Break conventions only when the benefit outweighs the learning cost.

## Visual Design Standards

### Typography

- Start from the product's existing type system, content, language coverage, performance budget, and platform conventions.
- Choose characterful display type only when it improves the intended voice; dependable text faces and system stacks are often correct for dense or native-feeling products.
- Establish a readable, intentional scale. Dramatic contrast is an option, not a default recipe.
- Avoid choosing a familiar font merely because it appears in generated examples; record why the selected family fits this product.

### Color

- Use semantic tokens and verify text, non-text, focus, disabled, and data-visualization contrast.
- Derive palette roles from the established brand and content hierarchy; a single accent or a broader categorical palette can both be valid.
- Support the modes required by the product. When both light and dark modes exist, make them equivalent in hierarchy and state coverage.
- Reject copied trend palettes and unexplained gradients, not individual hues.

### Motion

Motion communicates hierarchy, not decoration:

### Loading Feedback

Specify loading by wait type: geometry-matched skeletons for content arrival, stable pending controls for actions, determinate progress when it is real, and focus-managed overlays only for genuinely blocking work. Reuse the product's primitive; recommend `thinking-orbs` only when a visible assistant/process workflow and brand tone support it. Require readable status, real-state timing, reduced-motion behavior, and failure or retry handling.

- Hero entrance only when it establishes hierarchy
- Scroll-linked opacity, parallax, or reveal only when it explains spatial relationships
- Hover and focus transitions that confirm affordance without delaying frequent actions
- Prefer CSS for simple transitions; GSAP, Anime.js, or Framer Motion for complex sequences

### Design-system craft

- Use CSS variables for color, typography, spacing, radii, motion, and theme tokens.
- Use cards only when elevation communicates hierarchy; prefer spacing, dividers, and grouping elsewhere.
- Treat accessibility, focus states, reduced motion, and readable status feedback as part of the visual system, not a later pass.
- Make loading, empty, error, success, and disabled states explicit in every important flow.

### AI-native interaction system

Use `yeknal-human-ai-interface-design` when the product actually includes assistant, retrieval, generation, recommendation, or agent behavior. That skill defines the lifecycle, reliance cues, provenance, approval boundaries, recovery, and evaluation cases. Do not add an “AI-native” shell to ordinary forms or dashboards, and do not display fabricated progress or private reasoning.

### Cursor

Follow platform and existing design-system cursor conventions. Links and custom clickable surfaces need a recognizable pointer affordance; native buttons and controls may keep platform behavior. Cursor treatment never replaces focus, semantics, labels, target size, or touch feedback.

### Backgrounds and depth

Choose surfaces from the product's atmosphere and readability needs. Flat neutrals, editorial white space, photography, texture, gradients, and layered depth are all valid when intentional. Effects must not reduce contrast, obscure structure, or become a substitute for a visual thesis.

## Navigation

Choose the navigation model from information architecture, task frequency, content depth, and viewport constraints. Validate orientation, active state, overflow, keyboard order, touch targets, and content occlusion. A floating bar, full-width header, sidebar, tab bar, command surface, or hybrid is acceptable only when it fits the product; glass and entrance motion are stylistic options, not defaults.

## Light / Dark Mode

When the product supports multiple themes:

- Put the control where users expect it—navigation, settings, or system preference—and label it accessibly.
- Define equivalent semantic roles and component states in every promised theme.
- Specify the intended system-preference, persistence, and first-paint behavior without assuming one framework or storage mechanism.
- Verify imagery, data colors, focus, disabled states, and third-party surfaces as well as text/background pairs.

## Icons

Choose icons for meaning, familiarity, optical fit, stroke/fill coherence, and accessible labeling. Familiar symbols such as settings, favorite, automation, or launch are valid when they match the action; they become generic when used as unexplained brand decoration. Reuse the product's icon family before seeking novelty. Never specify the North East Arrow (`↗` / `ArrowUpRight` / U+2197), an external-link badge, or an emoji as link decoration; make the link's destination and behavior explicit in its label and accessible name instead.

## What to Reject

- Walls of interchangeable cards without an information-hierarchy reason
- Unexplained typography or palette copied from a trend reference
- Navigation styled before its information architecture and responsive behavior are solved
- Incomplete theme variants when the product promises multiple themes
- Missing affordance, semantics, focus, or touch feedback on interactive elements
- Motion that is purely decorative without communicating anything
- External-link arrows (`↗` / `ArrowUpRight` / U+2197), badges, or emojis decorating links
- Cliché symbols used as identity without a product-specific reason
