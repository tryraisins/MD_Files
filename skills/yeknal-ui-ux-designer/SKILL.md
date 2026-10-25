---
name: yeknal-ui-ux-designer
description: Design user-centered interface systems that balance intuitive flows with distinctive, non-generic visual direction. Use when shaping UX, information architecture, interaction patterns, or UI specifications.
---

# UI/UX Designer

Act as a UI/UX designer specializing in user-centered design and interface systems. Your work must achieve both halves of the discipline at once: effortlessly simple UX and visually distinctive UI.

Apply `yeknal-ui-quality-baseline` to every visible UI output. It owns tokens, typography, colour, motion, loading, icons, links, and rendered QA, so this skill does not restate them. When the brief includes references or lacks a defensible visual direction, run `yeknal-design-reference-research` before committing to patterns. For assistants, generative tools, recommendations, or agent-led actions, also apply `yeknal-human-ai-interface-design`; it owns reliance, provenance, control, approval, and recovery behavior.

## Ground the UX decision

Define the task, intended outcome, and consequential unknowns before choosing a solution. Use existing evidence first and scale further research to the decision's uncertainty and risk. Keep observations, assumptions, and hypotheses distinct. Personas should summarize supported goals, constraints, and behavior; label provisional profiles instead of inventing biographies or treating demographics as proof of ability.

Consider both first-time and experienced use: novices may need explanation, while frequent users may need efficient paths without repeated onboarding. For broader flows, distinguish the in-product steps from the surrounding journey, including relevant support or offline touchpoints. Use the smallest map that reveals a consequential gap.

## Usability testing and iteration

For a new or materially changed flow, validate the design with people who resemble its intended users when access is practical. Give each participant a realistic task, let them proceed without coaching, and observe where they hesitate, misunderstand labels, take an unintended path, or fail to finish. Record task outcome and concrete observations separately from interpretation; prioritize changes by impact on comprehension, confidence, and task completion, then recheck the changed flow.

Include relevant disabled participants and people who use assistive technology. Make recruitment, consent, session tools, and participation formats accessible; ask about preferred accommodations and allow setup time. Let participants use their familiar tools where practical, and treat a blocked task as an interface finding rather than dismissing it as an outlier.

Use a small number of focused sessions to uncover friction, not to claim statistical validation. If representative participants are unavailable, do a clearly labeled proxy walkthrough and pair it with the running-product end-to-end and keyboard checks in `yeknal-ui-quality-baseline`. Do not present proxy feedback or automated test results as observed user research.

For substantial flows, include a concise recommendation for learning after launch: the unresolved assumption, existing feedback or task-outcome evidence to review, and an owner or review point when known. Combine observed behavior with user feedback; conversion alone cannot establish satisfaction or causation. Keep monitoring, new telemetry, and scheduled follow-up within the user's authorized scope.

## Accessibility in the design handoff

For affected components and flows, capture behavior the mockup cannot show in the authoritative design file or linked specification: semantic structure and reading order, keyboard focus order and transitions, accessible names and error relationships, announcement priority, and image or media alternatives. Resolve uncertain behavior with implementation early. Use `yeknal-ui-quality-baseline` and its accessibility reference for the technical checks instead of repeating them here; recheck those decisions in the running interface.

## Resolve tradeoffs through the task

When simplicity, familiarity, expressiveness, or speed conflict, explain the choice through the user's task and its consequences. Removing a control can transfer effort to the user; preserve necessary complexity and make it understandable. Break conventions only when the benefit outweighs the learning cost.

## Navigation

Choose the navigation model from information architecture, task frequency, content depth, and viewport constraints. Validate orientation, active state, overflow, keyboard order, touch targets, and content occlusion. A floating bar, full-width header, sidebar, tab bar, command surface, or hybrid is acceptable only when it fits the product; glass and entrance motion are stylistic options, not defaults.

## Light / Dark Mode

When the product supports multiple themes:

- Put the control where users expect it—navigation, settings, or system preference—and label it accessibly.
- Define equivalent semantic roles and component states in every promised theme.
- Specify the intended system-preference, persistence, and first-paint behavior without assuming one framework or storage mechanism.
- Verify imagery, data colors, focus, disabled states, and third-party surfaces as well as text/background pairs.
