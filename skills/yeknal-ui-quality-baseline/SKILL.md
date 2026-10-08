---
name: yeknal-ui-quality-baseline
description: Apply shared visual, responsive, accessibility, state, and motion checks whenever creating, changing, or reviewing visible UI or mockups.
---

# Universal UI Quality Baseline

Apply this contract automatically to every visible interface: a whole product, a single screen, a redesign, a generated comp, or one small element. Never wait for the user to restate these requirements.

An explicit brief, an approved design file, an established brand, a platform convention, and the current product's functional behavior stay authoritative. This baseline supplies the quality controls briefs tend to leave implicit; it does not erase intentional exceptions.

## Start with the real context

Before touching UI:

1. Inspect the current design system, component library, package manifest, global styles, tokens, breakpoints, icon source, motion utilities, and loading primitives.
2. When redesigning, inventory current routes, states, roles, and behavior before moving or regrouping features.
3. Treat approved design files as the visual authority and current code as the feature and behavior authority unless the user says otherwise.
4. Reuse established primitives when they meet the quality bar. Do not introduce a second component, icon, skeleton, or motion system for novelty.
5. If there is no system, establish the smallest coherent token set needed for the work before styling individual elements. For React-compatible stacks, default to **Tailwind CSS (v4) + shadcn/ui** (Radix base) as that foundation, setting them up when absent and whether or not the project already uses them; for non-React stacks use the stack-appropriate equivalent. An explicit brief, approved design, or documented system wins over the default.

For the affected task, consider familiarity, digital literacy, input ability, divided attention, and connectivity where they change the interaction. Viewport size alone does not describe the user's context.

## Keep the design system durable

Before implementing a new interface or a substantial visual change, create or update a concise `DESIGN.md` at the project root and use it as the source of truth for the UI. If the project already has an authoritative design-system document, extend that instead of creating a competing file. For a narrowly scoped repair, read the existing document and update it only when the shared system changes.

Record the visual thesis and reusable rules that implementation needs: role-based color values (including text and surfaces for each supported light or dark theme), font families and size/line-height roles, spacing scale, control geometry, radii, and component variants. Check text and controls against every surface where they appear. Keep the palette restrained, hierarchy clear, and equivalent buttons, cards, and inputs consistent through shared tokens or components. Give the page a clear focal point; add emphasis when hierarchy is too flat and remove competing detail when it feels crowded. Do not add arbitrary one-off values that bypass the documented system.

## Ground open-ended design in evidence

When the visual direction is not already fixed, use `yeknal-design-reference-research` before committing to a pattern. Compare functionally similar products and complete flows across relevant devices; extract hierarchy, navigation grammar, state behavior, and responsive transformations instead of copying pixels or averaging gallery trends.

- Treat live products, gallery screenshots, editorial descriptions, and source-code registries as different evidence types.
- A gallery can show that a pattern exists; it cannot prove usability, conversion, accessibility, performance, or adoption.
- Keep a short rejection list so attractive but irrelevant patterns do not leak into the result.
- Every major visual choice must trace to product content, a user need, a platform convention, or observed reference evidence—not merely “modern,” “premium,” or “clean.”

## Repair the smallest real UI surface

For a UI fix or improvement request, identify the affected route, component, state, and target viewport before styling. Reconstruct the local design system and working interaction first; record confirmed defects separately from preferences or unverified assumptions.

Prioritize in this order: inaccessible or broken behavior, responsive and state failures, system inconsistency, hierarchy or task-flow weakness, then visual polish. Repair the governing token, primitive, layout constraint, or state contract when it explains multiple symptoms. Do not restyle every visible element, replace a working flow, or turn an evidence-backed repair into a broad redesign without scope.

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
- Separate touch-target size from visible icon size. Interactive targets are at least 44 by 44 CSS pixels on touch surfaces unless the platform's stronger rule applies. This is the catalog's touch usability policy; distinguish it from a standard's minimum when reporting conformance.
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
- Check the selected face at its rendered size for distinguishable letters and numbers, useful reading width, and comfortable line spacing in the supported languages. Font-size floors and font categories alone do not prove legibility.
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
- For full screens and pages, check at minimum a 320px small phone, a common 390px phone, tablet portrait and landscape, a 1280px compact desktop with limited height, a 1440px desktop, and a wide desktop. Add 200% text resizing, reflow at 400% browser zoom from a 1280px viewport, user text-spacing overrides, keyboard-only, touch/no-hover, and reduced motion. Preserve functionality and access to full text; contain necessary two-dimensional content such as tables or maps within its own region.
- Place breakpoints where the content or task changes, not merely where the CSS framework provides a token. Document what reorders, condenses, becomes a sheet, moves to overflow, or remains fixed.
- Preserve logical source and focus order when grids re-span or visual order changes. A one-column collapse is not automatically the right mobile transformation.

### Mobile web platform layer

For a web app that will be used on a phone, ship these before the first component. They are CSS-and-meta fixes, not animation work, and they are the tells that separate a website from something installed.

```html
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover, interactive-widget=resizes-content" />
<meta name="theme-color" media="(prefers-color-scheme: light)" content="#ffffff" />
<meta name="theme-color" media="(prefers-color-scheme: dark)" content="#0a0a0a" />
```

- **Gate every `:hover` behind capability.** Touch has no hover, so the first tap applies `:hover` and leaves it stuck. Wrap hover styles in `@media (hover: hover) and (pointer: fine)`, and give touch users an `:active` state instead.
- **Kill the tap flash.** Set `-webkit-tap-highlight-color: transparent` once globally, then ensure every tappable element has its own `.active` feedback.
- **Use dynamic viewport units.** App shells, drawers, and bottom-pinned UI use `100dvh`; heroes and first screens use `100svh` so nothing is cut off. Avoid `100vh` for anything that must track the visible area.
- **Never let inputs zoom the page.** Keep input `font-size` at 16px (or scale up under `@media (pointer: coarse)`). Never use `user-scalable=no` or `maximum-scale=1`; fix the font size instead.
- **Make taps immediate.** Apply `touch-action: manipulation` to buttons, links, and `[role="button"]`, and give press feedback on `:active` or `pointerdown`, not on `click`.
- **Stop the browser hijacking scroll.** `overscroll-behavior: none` on `html, body` for an app shell; `overscroll-behavior: contain` on inner scroll containers. Prefer these over a `touchmove` + `preventDefault()` listener.
- **Pad safe areas.** With `viewport-fit=cover`, pad fixed headers, bottom bars, toasts, and sheets with `env(safe-area-inset-*)` (with a `0px` fallback inside `calc()`).
- **Keep text that is a control unselectable.** `user-select: none` on buttons, tabs, chips, and drag handles; never on `body`, because content text must stay selectable.
- **Tell the browser which axes a gesture owns.** `touch-action: pan-y` on a horizontal carousel, `pan-x` on a vertical drag handle, `none` only on a surface that truly handles every axis. Prefer native `scroll-snap` over a hand-rolled spring.
- **Verify on real hardware.** None of this reproduces in desktop device emulation. Connect a real phone (older than the one on your desk), test with the keyboard open, in landscape, and as an installed PWA if that is a target. State which fixes were verified from code and which need a device.

## Complete page and flow anatomy

For page- or screen-level work, map entry, primary job, commitment, completion, escape, recovery, and next step before polishing individual sections.

- Include likely entry from search, shared links, bookmarks, or notifications. Interior pages must explain their purpose and current location without requiring a visit to the home page; preserve the intended destination through sign-in where applicable.
- Navigation exposes structure, current location, and a reliable way home. Its mobile form follows priority and task frequency rather than defaulting blindly to a hamburger.
- Heroes or first task surfaces keep one dominant purpose, one primary action, and credible product evidence. Essential meaning must survive without animation or a desktop crop.
- On a public home page, state in one clear line what the product does. Give each page one visually dominant primary action; keep secondary actions visibly subordinate.
- CTAs use outcome-specific verbs and place risk, price, scope, permission, or reversibility near the commitment.
- Footers support continuation, support, required legal paths, and recovery; do not delete useful structure just to avoid a conventional footer.
- 404, empty, error, offline, and permission states explain what happened and provide the best next action.
- Bento and modular grids use spans to communicate hierarchy or relationships, keep logical DOM order, and transform intentionally on smaller screens.
- Open Graph and share images are separate fixed-ratio artifacts with their own crop, type, fallback, and localization checks.

### Respect choice and attention

Persuasion must leave the user informed and able to decline. Avoid invented urgency, concealed costs, misleading defaults, and needless obstacles to cancellation or refusal. Add confirmation or review when the consequence warrants it; keep routine, reversible actions fluid.

Interrupt only for information that is actionable and time-sensitive or requires a decision before continuing. Keep routine feedback in the flow and make optional notifications controllable. Ask only for input needed for the task, reuse known values when appropriate, and accept equivalent valid formats without weakening validation.

### Public website launch checks

For a public multi-page website, audit the real routes and shared shell before calling the work complete. Apply the checks that fit the project; do not add empty content or features just to satisfy a checklist.

- Check every page at phone widths for horizontal overflow, clipped content, unusable controls, and layout that still assumes a desktop screen. A mobile menu is needed when the existing navigation cannot fit and remain usable; preserve its links, keyboard and touch behavior, expanded state, and close behavior.
- Verify internal links, footer links, logo destinations, and calls to action against the actual route map. Remove navigation only when the destination is confirmed obsolete or intentionally unavailable; do not hide a broken destination by deleting useful information architecture.
- Make the logo link to the site's home route. Use `tel:` and `mailto:` links for visible phone numbers and email addresses when they are intended as contact methods.
- Ensure each public page has a distinct, accurate title and useful meta description, and that the site has a working favicon. Keep page metadata aligned with visible content; use `yeknal-content-seo` for broader canonical, indexing, social-card, sitemap, or structured-data work.
- Provide a deliberate not-found page with a useful route back into the site. Keep copyright dates current using the project's established convention; if generated dynamically, use a real date source and verify the rendered year.
- Inspect visible copy for lorem ipsum, stale template instructions, and placeholder labels. Confirm each button performs its stated action and has a visible, accessible success or error result when its action can succeed or fail.
- Never use staccato sentences in interface prose, design notes, or handoff copy. Connect related ideas with complete sentences and a natural rhythm; avoid strings of clipped fragments and one-line paragraphs. Keep labels, headings, and status messages concise where the interface needs them, while writing supporting explanations in flowing prose.
- Check image dimensions and transfer size at rendered sizes. Resize oversized assets and prefer supported modern formats and responsive variants where the project supports them; retain appropriate quality, dimensions, and fallbacks rather than blindly recompressing every asset.
- Treat the site as responsive page by page: inspect every route at narrow phone width and representative common phone, tablet, and desktop widths, then check shared components and any page-specific exceptions at the viewport where their content is most constrained.

For an existing site audit, record each finding with its route, observed behavior, viewport or state, and the smallest appropriate correction. Separate confirmed broken behavior from optional polish.

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
- Respect `prefers-reduced-motion` in code and design. Remove, reduce, or replace effects according to their purpose; essential content and controls must remain available in a meaningful static presentation. Opacity or color can preserve comprehension when positional motion is removed.
- Give modals, dropdowns, and tab changes a brief transition when it clarifies opening, closing, or selection. Keep it interruptible, skip it when it adds delay without information, and honor reduced motion.
- Test under CPU and network load; animation that only looks smooth on an idle machine is not finished.

## States and accessibility

Important components and flows include the states they can actually enter: idle, hover, focus, active, disabled, loading, empty, success, warning, error/retry, offline, and canceled where applicable.

For detailed text-override checks, new or materially changed forms, gesture controls, media, or live content, and accessibility reviews, read [Accessibility design checks](references/accessibility-design.md). Apply only the relevant sections; it supplies implementation and verification detail for the shared rules below.

- Use semantic HTML, visible focus, keyboard access, sufficient contrast, and readable status text. Distinguish content reading order from keyboard focus order; ordinary text does not need to become a Tab stop.
- Make hover, pressed, focus, and disabled feedback visible and consistent for each interactive control type. Verify text contrast on both light and dark surfaces when both are used.
- Do not communicate state by color alone.
- Keep essential actions discoverable without hover or a hidden gesture. Custom dragging and complex pointer gestures need an equivalent tap/click path as well as keyboard access unless the gesture is essential.
- Give forms persistent, programmatically associated labels, appropriate autocomplete, and associated instructions and errors. Avoid unnecessary time limits; when a limit is required, provide warning and adjustment or extension where applicable.
- Announce meaningful async results with urgency appropriate to the message, preserve focus during routine updates, and avoid repeated announcements. Provide user control over automatic motion or live updates when required, and keep actionable messages available long enough to use.
- Specify an image's information or function, or mark it decorative; make complex charts available through an appropriate text or data equivalent. For media, provide the captions, descriptions, alternatives, and playback controls required by its content and conformance target.
- Dialogs and overlays trap focus when modal, close safely, restore focus, and respect Escape unless the operation cannot be dismissed.
- Do not hide important content from older users, zoomed text, localization, or assistive technology just to preserve a screenshot-perfect layout.

### Networked form submission and offline recovery

Treat a remote form submission as an interruption-prone operation, not a one-way button click. For every new or materially changed form that sends data to a server or third-party service:

- Keep the user's entered values when validation, network, timeout, or server errors occur. Do not reset, navigate to a success/thank-you state, or claim success until the server confirms it.
- If the browser is known to be offline before the request begins, keep the values and say plainly that the form was not sent because there is no connection. Provide a clear retry path when connectivity returns.
- `navigator.onLine` is only an advisory signal. If a request fails or its response is lost, retain the draft and explain that submission could not be confirmed; do not falsely guarantee that no server-side action happened. Make retry safe with the product's existing idempotency or duplicate-submission protections where an uncertain outcome matters.
- Use field-level messages for validation and a separate, prominent form-level message for transport/server failures. The message must be readable without color alone and announced appropriately to assistive technology.
- Preserve drafts beyond a re-render by default. Persist across refresh/navigation only when the product and sensitivity of the data justify it; never persist passwords, payment data, one-time codes, or other sensitive fields in browser storage without an explicit, secure design.
- Test the real form after entering values with the network disabled: values remain intact, the UI clearly reports the unsent/uncertain result, no success transition occurs, and the retry behavior does not create duplicates. Record whether this browser-level check was completed or blocked.

## AI-mediated interfaces

When inference, generation, retrieval, or agentic action changes the user experience, also apply `yeknal-human-ai-interface-design`. Expose capability limits, relevant provenance and freshness, editable output, partial failure, stop or cancel, approval before consequential actions, and recovery proportional to the side effect. Use deterministic controls for exact state, permissions, price, and irreversible commitment; do not turn every feature into chat.

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
- Walk every critical user journey end to end in the running product (for example, sign-up or checkout when present), including applicable direct-entry and sign-in-return paths. Check that visible buttons act, links reach valid destinations, and the same journey can be completed with a keyboard alone.
- For new or materially changed flows, exercise relevant screen-reader and system-setting behavior in the running interface; use the reference's scoped checks and record the tested browser/device/tool combination. Automated scans, screenshots, and simulations alone do not establish accessibility conformance or observed usability.
- For a public launch, confirm the home page says what the product does in one clear line, each page has one dominant primary action, every page has an accurate title and description, the site has a working favicon, and no visible placeholder or template text remains.
- Run relevant lint, type checks, tests, builds, and browser checks. A successful build is not visual proof.
- Report what was verified, what failed, and what remains blocked without overclaiming.

### Public launch sign-off

Before calling a public website launch-ready, consolidate applicable checks into a short route-by-route sign-off. Mark each item **verified**, **failed**, or **blocked** and include evidence or the blocker; omit items that do not apply rather than inventing work to satisfy the list.

- Home-page purpose and page-level primary actions are clear.
- Routes, navigation, links, and visible actions work, including the core journey from start to finish.
- Responsive containment, mobile navigation where needed, enlarged-text layout, and keyboard completion have been checked.
- Loading, empty, error, form, success, disabled, and transition behavior has been checked where those states exist.
- Page titles and descriptions, favicon, and visible copy have been checked; no placeholder or template text remains.
- Relevant automated checks and rendered browser verification have been run, with any unavailable device or production checks called out explicitly.

For broader crawlability and metadata review, follow `yeknal-content-seo`; this sign-off does not replace its canonical, indexing, social-card, sitemap, or structured-data checks.
