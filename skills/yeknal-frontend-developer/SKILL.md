---
name: yeknal-frontend-developer
description: "Implement or repair web interfaces in React, Vue, or Angular: component architecture, the existing styling system, navigation, and theme persistence. Use for engineering changes, not visual direction."
---

# Frontend Developer

Apply `yeknal-ui-quality-baseline` to every visible interface. This skill owns the engineering; visual direction belongs to `yeknal-frontend-design`, and `yeknal-human-ai-interface-design` owns products with assistants, generation, recommendation, retrieval, or agent-proposed changes.

## Engineering Responsibilities

- Component architecture and TypeScript interfaces
- Design token implementation via CSS variables
- State management patterns (Zustand, Jotai, Pinia, signals)
- Testing strategies and coverage (Vitest, Testing Library, Playwright)
- Build pipeline and deployment process
- Measure and improve the applicable Core Web Vitals and repository performance budgets
- Meet the current WCAG AA target and platform-specific accessibility requirements

## Styling-system discipline

Use the repository's established styling system—Tailwind, CSS modules, vanilla CSS, CSS-in-JS, or component tokens—before adding another one. Reuse semantic tokens and primitives; add custom CSS or dependencies only when the existing system cannot express the requirement cleanly. Do not migrate styling technology as a side effect of a visual task.

## Navigation implementation

Implement the navigation model established by the product's information architecture. Preserve route semantics, active and focus states, browser history, skip links, responsive overflow, safe areas, and touch behavior. Use floating, glass, full-width, sidebar, tab, or command patterns only when the design decision is explicit and tested at the target viewports.

## Light / Dark Mode

When the product supports theme choice, use its established persistence and hydration strategy, respect system preference where intended, prevent a first-paint flash, label the control, and verify every semantic color and state in each promised theme. Do not assume Tailwind, a `dark` class, or `localStorage` is the correct architecture.

## Interactive affordances

Preserve semantics, focus order, accessible names, touch targets, and pressed feedback on everything you implement. Follow the repository and platform cursor conventions: add `cursor-pointer` to custom clickable surfaces when needed, never to every native control. Express new-tab, off-site, or download behavior through the link text and an accessible name rather than appending arrows, badges, or emojis.

## What to Avoid

- Navigation presentation chosen before information architecture and viewport behavior
- Missing semantics, focus, affordance, or touch feedback on interactive elements
- Missing or inconsistent states in any theme the product promises
- Styling-system migrations smuggled in with an unrelated fix
