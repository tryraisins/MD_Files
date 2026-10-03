# Technique and source reference

Load only the section needed for a technique already justified by the main skill. These patterns are options, not a page recipe. Confirm current library APIs and upstream documentation before implementation.

## Technique selection contract

For any advanced effect, record:

- product purpose and the user benefit;
- trigger, intermediate state, settled state, exit, and interruption;
- keyboard, touch, no-hover, reduced-motion, and reduced-transparency behavior;
- content availability before JavaScript and when the effect fails;
- layout, paint, memory, network, and cleanup cost;
- target devices and the evidence used to validate the behavior.

Prefer the simplest implementation that preserves the intended relationship. Use `animate` for motion details and `ui-quality-baseline` for the rendered quality gate.

## Sticky-stack storytelling

Use when later content meaningfully supersedes or compares with earlier content and the stack preserves orientation. Do not use it to make an ordinary feature list feel cinematic.

Implementation requirements:

- content remains in logical DOM and reading order;
- the pinned interval is proportional to content and does not trap scrolling;
- cards remain reachable at short viewport heights and browser zoom;
- focus is never hidden behind a pinned sibling;
- resize, orientation change, route transition, and unmount refresh or destroy the timeline;
- reduced motion renders an ordinary readable sequence without pinning;
- touch devices get the effect only after real-device validation.

## Horizontal narrative

Use horizontal movement only when the content relationship is intrinsically sequential, spatial, or gallery-like. Ordinary page sections should keep native vertical scrolling.

- Preserve wheel, trackpad, keyboard, touch, and assistive-technology access.
- Show position and make every item reachable without pixel-perfect gestures.
- Avoid nested horizontal regions, ambiguous swipe ownership, and scroll-jacking.
- Provide a vertical/reflowed alternative for reduced motion, zoom, short viewports, and narrow screens when horizontal behavior stops being usable.

## Scroll reveal

Reveal can clarify sequence or hierarchy, but content must not remain invisible if observers or scripts fail.

- Prefer CSS transitions and `IntersectionObserver` for simple one-time reveals.
- Use a timeline library only for coordination that CSS cannot express cleanly.
- Set visible content as the no-script/failure default, then enhance.
- Avoid applying the same offset/fade to every section; repeated choreography becomes visual noise.
- Respect interruption, reverse navigation, restored scroll position, and reduced motion.

## Material and glass

Blur, transparency, highlight borders, inner shadows, grain, and refraction are stylistic tools. Use them only when they support the product's material language.

- Provide a solid-fill fallback for reduced transparency, unsupported blur, low contrast, or constrained devices.
- Keep text and controls legible over changing imagery.
- Limit large fixed filters and layered backdrops; measure paint cost.
- “Liquid Glass” is an Apple platform design language. A web blur/refraction treatment is an approximation and must not be presented as an official implementation.

## Direction vocabulary

Use these as descriptive axes, not numerical mandates:

- **Density:** gallery-airy, reading-focused, everyday balanced, operational dense.
- **Variance:** regular, subtly offset, editorial asymmetric, experimental.
- **Motion:** static, feedback-only, fluid transitions, narrative choreography.
- **Material:** flat, bordered, elevated, translucent, tactile, image-led.
- **Content grammar:** comparison, narrative, catalog, editorial, workflow, dashboard, community.

Every chosen position needs a product, content, platform, or reference rationale. Do not rotate values across projects to simulate originality.

## Design-system source routing

Prefer the product's installed system. If selection is in scope, use `pick-ui-library` and verify current official documentation. Common official starting points include:

- Material Design / Material Web for Google-aligned cross-platform products;
- Fluent UI for Microsoft 365 and enterprise ecosystems;
- Carbon for IBM-aligned enterprise systems;
- Primer for GitHub-like developer products;
- GOV.UK Frontend or USWDS for their respective government contexts;
- Atlassian Design System for Atlassian ecosystem extensions;
- Shopify's current app design system for Shopify-admin applications;
- Radix or Base UI primitives and shadcn-compatible registries for owned React components;
- native HTML and CSS for small surfaces that do not need another dependency.

Do not select a system from homepage aesthetics. Compare framework/version compatibility, accessibility, component/state coverage, theming, localization, bundle cost, licensing, maintenance, and how much adaptation the brand requires.

## Reference and component sources

Use `design-reference-research/references/source-atlas.md` for the reviewed gallery, flow, platform, motion, and source-code registries. Use the original live product for interaction claims and inspect copied component source before adoption.

For any source-owned component:

1. inspect the license, dependencies, framework and styling versions, client-state assumptions, timers/listeners, SVGs, and accessibility;
2. install or copy only the selected component;
3. adapt it to product tokens and content instead of importing its demo aesthetic;
4. test all states and target viewports;
5. record the upstream URL and reviewed revision when reproducibility matters.

## Redesign preservation

For an existing product, `redesign-existing-projects` owns the workflow. Preserve routes, state, bindings, validation, side effects, data contracts, analytics, and environment assumptions before using any technique in this reference.

## Pre-flight for an advanced technique

- The technique has one documented purpose.
- The simple/failure/reduced-motion path works.
- Content order and focus remain correct.
- Small phone, tablet, compact-height desktop, wide desktop, zoom, touch, and keyboard behavior were checked where relevant.
- No unexpected horizontal overflow, occlusion, layout shift, or stale listeners/timelines remain.
- Performance claims are measured on the intended device class.
- The final handoff distinguishes static, browser, device, backend, and deployment evidence.
