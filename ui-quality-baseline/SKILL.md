---
name: ui-quality-baseline
description: Mandatory UI quality baseline for every design, redesign, design-to-code, frontend implementation, component edit, or visual review, including work as small as one button, badge, input, icon, loader, skeleton, or animation. Always use this skill whenever a task creates or changes visible interface code or mockups, even if the user does not explicitly ask for design-system consistency, responsiveness, loading states, motion, or accessibility.
---

# Universal UI Quality Baseline

Apply this contract automatically to every visible interface: a complete product, one screen, a redesign, a generated comp, or one small element. Do not wait for the user to repeat these requirements.

An explicit brief, approved design file, established brand, platform convention, and the current product's functional behavior remain authoritative. This baseline supplies the quality controls that briefs often leave implicit; it does not erase intentional exceptions.

## Start with the real context

Before changing UI:

1. Inspect the current design system, component library, package manifest, global styles, tokens, breakpoints, icon source, motion utilities, and loading primitives.
2. When redesigning, inventory current routes, states, roles, and behavior before moving or regrouping features.
3. Treat approved design files as the visual authority and current code as the feature and behavior authority unless the user says otherwise.
4. Reuse established primitives when they meet the quality bar. Do not introduce a second component, icon, skeleton, or motion system for novelty.
5. If there is no system, establish the smallest coherent token set needed for the work before styling individual elements.

## Tokenize repeated decisions

Create or reuse role-based tokens for:

- color and semantic states;
- typography families, sizes, weights, and line heights;
- spacing and control insets;
- border widths and radii;
- elevation;
- control heights and icon sizes;
- motion duration, easing, and reduced-motion behavior;
- responsive type and layout steps.

Equivalent components must use the same tokens. A one-off component must inherit the nearest established role rather than inventing new values.

## Uniform spacing and geometry

- Use a spacing scale instead of unrelated pixel values. Like elements share the same horizontal and vertical padding.
- Keep container padding visually balanced. Make optical corrections deliberately and document them in the component primitive, not as scattered per-instance offsets.
- Separate touch-target size from visible icon size. Interactive targets are at least 44 by 44 CSS pixels on touch surfaces unless the platform's stronger rule applies.
- Use a small, intentional radius scale. Controls, cards, dialogs, and pills should not all have the same radius, and every rectangle must not become a rounded card.
- Avoid cards inside cards when grouping, whitespace, dividers, or typography can communicate structure.
- Use borders, shadows, and elevation consistently by semantic role rather than decoration.

### Optical centering is required

Buttons, badges, pills, chips, segmented controls, tabs, navigation items, avatars, monograms, step markers, and icon containers must be optically centered horizontally and vertically.

- Use flexbox or grid alignment, explicit gaps, controlled line height, and stable control dimensions.
- Do not rely on `text-align: center` alone.
- Verify rendered glyph bounds when a label still appears high, low, or side-biased despite nominal centering.
- Center the combined icon-and-label group, not each child against the entire container.
- Keep pending buttons the same width as their idle state so loading feedback does not shift surrounding layout.

## Typography system

- Use no more than two primary font families: one display/editorial family when the concept needs it and one highly readable product family. A monospace face is optional for short technical metadata only.
- Respect an existing brand type system. Without one, choose context-appropriate, human-designed families rather than repeatedly defaulting to the same fashionable AI-stack fonts.
- Load the exact weights used. Do not synthesize bold or rely on unavailable variable-font axes.
- Use a concise weight hierarchy: regular body copy, medium or semibold controls, and semibold or bold headings as the typeface requires.
- Equivalent labels use the same family, size, weight, letter spacing, casing, and line height.
- Use tabular numerals for frequently compared operational values.
- Implement responsive type with `clamp()`, media queries, or container queries. Do not let text determine or break the control's target size.
- For constrained controls, shorten secondary copy or move secondary actions before shrinking important text. Do not reduce control labels below 11px.

## Iconography

- Use one coherent icon family per product surface. Match optical size, stroke weight, corner character, and filled/outline state.
- Reuse the project's established icon system when it is consistent. If no system exists for a React web product, prefer Phosphor Icons or another deliberate project-approved family; do not default to Lucide or Feather merely because they are common in generated UI.
- Use regular weight for routine utility actions, stronger weight for active navigation, and filled icons only for selected or critical states where the distinction is meaningful.
- Do not mix multiple libraries on the same surface, hand-draw routine SVG icons, substitute emoji, or use Sparkle, MagicWand, Rocket, and similar AI shorthand without a real product reason.
- Give icon-only controls accessible names and visible tooltips when meaning is not universally obvious.

## Responsive containment

Design real layout changes rather than scaled-down desktop screens.

- Test narrow widths from 320px upward, common phone widths, tablets, desktop widths, and reduced viewport heights.
- Prevent horizontal page scrolling. Use `min-width: 0`, `minmax(0, 1fr)`, explicit flex shrink behavior, responsive grids, and safe wrapping or truncation.
- Buttons, badges, tabs, navigation, forms, tables, cards, and headings must not clip, overlap, become squashed, or acquire inconsistent padding.
- Preserve the primary action. Secondary actions may shorten, hide nonessential decoration, move into an overflow menu, or change presentation on constrained screens.
- Account for safe-area insets, browser chrome, virtual keyboards, dynamic viewport units, text zoom, localization, and installed-PWA display modes where relevant.
- Verify both width and height constraints; a design that works at 390 by 844 may still fail at 390 by 667.

## Loading, skeletons, overlays, and timing buffers

Choose feedback by what the user is waiting for:

### Layout-shaped content loading

- Use skeletons that match the final content's geometry, spacing, hierarchy, and radius. Random gray bars are not a content model.
- Preserve layout dimensions to prevent cumulative layout shift.
- Use the project's design-system skeleton first. In React projects without one, `react-loading-skeleton` is an acceptable lightweight option; a small tokenized CSS primitive is often sufficient.
- Keep shimmer quiet and directional. Under `prefers-reduced-motion`, use a static or gently fading placeholder.
- Do not show skeletons for destructive writes or short button actions; they imply content is arriving, not that a mutation is processing.

### Action or process loading

- A pending button keeps its label or an equally clear status, retains its dimensions, sets `aria-busy`, prevents accidental duplicate submission, and remains understandable without animation.
- Reuse the project's existing progress primitive. `thinking-orbs` is appropriate only when the product tone and visible assistant/process workflow support it; it is not a universal replacement for every spinner and must not be forced into ordinary branded products.
- Use determinate progress when real progress exists. Never fabricate percentages, steps, elapsed time, or tool activity.
- Route progress libraries such as `nextjs-toploader` or NProgress are for actual navigation latency, not data fetching or arbitrary decoration.

### Blocking overlays

- Use a full-screen or modal overlay only when interaction must genuinely pause: session restoration, a consequential operation, or a transition that cannot safely continue in the background.
- Provide a readable status, `role="status"` for non-modal feedback or correct dialog semantics for modal feedback, focus containment when modal, and focus restoration afterward.
- Do not dismiss authentication or session-loading UI until signed-in or signed-out state is actually confirmed. Avoid flashes of the wrong screen.
- Do not trigger navigation overlays on pointer-down or touch-start; scrolling must never look like navigation.

### Timing buffers

- Tie visibility to the real promise, transition, or state machine. Never use a fixed timeout as proof that work completed.
- Immediate actions should acknowledge input at once. For page-level placeholders or overlays, a short 120-200ms reveal delay may prevent flashes when work finishes almost instantly.
- Once a substantial overlay is shown, an optional short minimum-visible window around 250-400ms can prevent flicker, but it must never delay interaction unnecessarily or outlive the real operation.
- Every loader needs a failure, retry, cancellation, or timeout path appropriate to the operation. Infinite unexplained loading is a bug.

## Motion and animation libraries

Motion explains hierarchy, feedback, spatial relationships, or state changes. Do not satisfy a fixed animation quota.

- Use CSS transitions or WAAPI for simple, predetermined micro-interactions.
- Use Motion for React layout transitions, presence, gestures, and interruptible state changes.
- Use GSAP with ScrollTrigger for genuinely complex timelines or scroll choreography.
- Use Anime.js for lightweight DOM or SVG sequences only when it is already the better project fit.
- Prefer the existing motion system and one primary JavaScript motion library per surface. Do not create library soup.
- Animate `transform`, `opacity`, and other compositor-friendly properties where possible; avoid animating layout properties during frequent interactions.
- Keep high-frequency controls instant or very brief. Typical UI feedback belongs around 120-200ms; overlays and spatial transitions commonly belong around 180-300ms. Brand-led narrative motion may be longer when it does not block work.
- Avoid `ease-in` for user-triggered entrances. Use project tokens, a crisp ease-out, or tuned spring behavior.
- Make motion interruptible where users can reverse an action. Do not delay input until an entrance sequence finishes.
- Gate hover motion behind hover-capable pointers.
- Respect `prefers-reduced-motion` in code and design. Preserve comprehension with opacity or color when positional motion is removed.
- Test under CPU and network load; animation that only looks smooth on an idle machine is not finished.

## States and accessibility

Important components and flows include the states they can actually enter: idle, hover, focus, active, disabled, loading, empty, success, warning, error/retry, offline, and canceled where applicable.

- Use semantic HTML, visible focus, keyboard access, sufficient contrast, readable status text, and live announcements for meaningful async changes.
- Do not communicate state by color alone.
- Dialogs and overlays trap focus when modal, close safely, restore focus, and respect Escape unless the operation cannot be dismissed.
- Do not hide important content from older users, zoomed text, localization, or assistive technology just to preserve a screenshot-perfect layout.

## Anti-slop review

Reject defaults that make the result look generated rather than designed:

- repeated purple/teal gradients, glowing orbs, glass panels, and sparkles without brand justification;
- arbitrary dark green themes, especially `#173f36`-like palettes, as a generic sophistication shortcut;
- excessive pill shapes, giant corner radii, floating cards, and nested containers;
- Lucide-everywhere iconography, emoji as controls, or mixed icon families;
- every section using the same split layout, identical card grid, or centered badge-over-heading composition;
- gratuitous animation, fake progress, or shimmer on every surface;
- inconsistent spacing, weights, line heights, radii, and control geometry;
- labels that technically fit but look visibly off-center.

## Small-element rule

Even when the task is only one button, badge, input, icon, loader, or skeleton:

1. inspect the containing system;
2. inherit its typography, spacing, radius, icon, color, and motion tokens;
3. implement every relevant state;
4. verify optical centering and narrow-width containment;
5. avoid adding a new dependency when the existing system can express it;
6. test the element in its real container, not only in isolation.

## Verification before handoff

- Compare the implementation with the approved design or reference at representative desktop, tablet, mobile, and reduced-height viewports.
- Check control geometry, rendered text centering, padding, line height, icon alignment, wrapping, truncation, and horizontal scroll.
- Verify loading feedback against real async state and test success, failure, retry, and reduced motion.
- Run relevant lint, type checks, tests, builds, and browser checks. A successful build is not visual proof.
- Report what was verified, what failed, and what remains blocked without overclaiming.
