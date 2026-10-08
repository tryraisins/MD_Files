---
name: yeknal-animate
description: Implement purposeful, accessible web motion. Use for new component, page, scroll, gesture, SVG, or canvas animation; use review-animations to audit existing motion.
---

## UI quality integration

Apply `yeknal-ui-quality-baseline` to every visible interface the animation touches. Reuse the product's tokens and motion system, keep control geometry stable, gate hover behavior behind pointer capability, include a reduced-motion path, and check the result at narrow and touch widths. Never add motion to hit a quota.

# Building Animations

A construction skill with one job: turn a motion request into an implementation that survives a strict review. It does not audit a codebase (`yeknal-improve-animations` does that), critique a diff (`yeknal-review-animations`), search for animation opportunities (`yeknal-find-animation-opportunities`), or target React Native (`yeknal-animate-expo`).

## Operating Posture

You are a senior design engineer who builds the animation directly. The standard is Emil Kowalski's animation philosophy, the same bar `yeknal-review-animations` enforces. Write code that passes that review on the first pass.

Two failure modes, and the first matters more:

1. **Animating something that should not animate.** The gate below is meant to produce zero lines of code sometimes. That outcome is a success, not evasion.
2. **Animating the right thing with the wrong ingredients** — `ease-in` on an entrance, `scale(0)`, keyframes on a toast, or a duration that makes a dropdown feel sluggish.

Never hand the user a menu of motion options. Make the call, state the reasoning in one line, and write the code.

## Hard Rules

1. **Follow the sequence in order.** Steps 1 and 2 gate everything. Do not pick a curve before deciding whether the element animates at all.
2. **No approximated values.** Every curve, duration, and spring config comes from the tables below. Never invent `cubic-bezier(0.4, 0, 0.2, 1)` simply because it looks familiar.
3. **Extend the codebase's tokens; do not fork them.** If `--ease-out` or a duration scale already exists, use it. A parallel system is a defect.
4. **Reduced motion and hover gating ship with the animation**, not as a follow-up task.
5. **Cheapest tool that works.** Do not install a motion library to build a fade.

## Use motion references correctly

When the user supplies a motion reference, or the interaction has no established product precedent, use `yeknal-design-reference-research`. Sources such as [60fps](https://60fps.design/), [Design Spells](https://designspells.com/), and [Landing Love](https://www.landing.love/) help surface interaction ideas, but a clip is not a timing specification.

Study the full trigger, intermediate state, interruption, settled state, exit, input modality, and reduced-motion path. Rebuild the purpose and physical relationship using the project's tokens and constraints; do not trace another product's pixels or copy a showcase animation into high-frequency utility UI.

## The Build Sequence

### 1. Should this animate at all?

| Frequency | Decision |
| --- | --- |
| 100+ times/day (keyboard shortcuts, command palette toggle) | **No animation. Ever.** Stop here. |
| Tens of times/day (hover effects, list navigation) | Near-imperceptible only — fast and subtle, or nothing |
| Occasional (modals, drawers, toasts) | Standard animation |
| Rare / first-time (onboarding, success, celebration) | The delight budget lives here |

**A keyboard-initiated action is a disqualifier, not a judgment call.** Raycast has no open/close animation, which is correct for something opened hundreds of times a day.

If the request fails this gate, say so plainly and write no animation. Offer the non-motion alternative instead: an instant state change or a static affordance.

### 2. What is the purpose?

Name it in one of these words before continuing:

- **Feedback** — confirming the interface heard the user
- **Spatial consistency** — showing where something came from or went
- **State indication** — making a state change legible
- **Preventing a jarring change** — bridging content that would otherwise teleport
- **Explanation** — demonstrating how something works (marketing/onboarding only)
- **Delight** — allowed *only* at the rare/first-time tier

Cannot name it? Do not build it. "It looks cool" on a frequently-seen element is a reason to stop.

Also check **function**: data the user is reading or acting on should not move for style. A decorative mouse-tracking effect belongs on a marketing page, not on a graph in a banking app.

### 3. Pick the tool — cheapest that works

Walk down the list; stop at the first option that fits.

| Need | Tool |
| --- | --- |
| Hover, press, color, a state toggle you control with a class or attribute | **CSS transition** |
| Entry animation on mount, no JS state | **CSS `@starting-style`** |
| Predetermined motion that must stay smooth while the page is busy loading | **CSS animation** (runs off the main thread) |
| Programmatic control with CSS performance, no library | **WAAPI** (`element.animate()`) |
| Springs, layout animations, exit animations, gesture-driven values | **Motion** (`motion.dev`) |

CSS animations beat JS under load: they run off the main thread, while `requestAnimationFrame`-based animation drops frames while the browser loads, scripts, or paints. Use CSS for predetermined motion and JS for dynamic, interruptible motion.

If the task needs a *component* rather than an animation — a toast, a drawer, a command menu, a dropdown — stop and invoke `yeknal-pick-ui-library`. Hand-rolling those is how you end up with a `<div>` dropdown and no focus management.

### 4. Pick the properties

- **`transform` and `opacity` only.** They skip layout and paint and run on the GPU. `width`/`height`/`margin`/`padding`/`top`/`left` trigger all three. (`clip-path` is the sanctioned fourth — see RECIPES.md. `height` is tolerated only for accordions, where no transform equivalent exists.)
- **Never `scale(0)`.** Start from `scale(0.9–0.97)` plus `opacity: 0`. Nothing in the real world appears from nothing.
- **`transform-origin` at the trigger** for popovers, dropdowns, menus, and tooltips — `var(--transform-origin)` in Base UI. **Modals are exempt** because they are not anchored to a trigger and stay centered.
- **Percentages in `translate()`** are relative to the element's own size: `translateY(100%)` moves by its own height regardless of content. Prefer this over hardcoded pixels.
- **In Motion, use the full transform string.** The `x`/`y`/`scale` shorthands are not hardware-accelerated and drop frames under load:

```jsx
<motion.div animate={{ x: 100 }} />                          // drops frames under load
<motion.div animate={{ transform: "translateX(100px)" }} />  // hardware accelerated
```

- **Never drive a child's transform from a CSS variable on the parent** — it recalculates styles for every child. Set `transform` on the element directly.

### 5. Easing and duration — or a spring

**Easing**, in decision order:

| Situation | Easing |
| --- | --- |
| Entering or exiting | `ease-out` |
| Moving / morphing on screen | `ease-in-out` |
| Hover / color change | `ease` |
| Constant motion (marquee, progress) | `linear` |
| Default | `ease-out` |

**Never `ease-in` on UI.** It starts slow and delays the exact moment the user is watching. `ease-out` at 200ms *feels* faster than `ease-in` at 200ms.

Built-in CSS easings are too weak. Use these:

```css
--ease-out: cubic-bezier(0.23, 1, 0.32, 1);        /* strong ease-out for UI */
--ease-in-out: cubic-bezier(0.77, 0, 0.175, 1);    /* strong ease-in-out for on-screen movement */
--ease-drawer: cubic-bezier(0.32, 0.72, 0, 1);     /* iOS-like drawer curve (Ionic) */
```

Need a curve that is not here? Take it from [easing.dev](https://easing.dev/) or [easings.co](https://easings.co/). Do not hand-roll one.

**Duration:**

| Element | Duration |
| --- | --- |
| Button press feedback | 100–160ms |
| Tooltips, small popovers | 125–200ms |
| Dropdowns, selects | 150–250ms |
| Modals, drawers | 200–500ms |
| Marketing / explanatory | Can be longer |

**UI animations stay under 300ms.** A 180ms dropdown feels more responsive than a 400ms one.

**Reach for a spring instead** when the motion is a drag with momentum, an element that should feel alive, a gesture the user can interrupt or reverse, or decorative mouse-tracking:

```js
{ type: "spring", duration: 0.5, bounce: 0.2 }        // Apple-style — easier to reason about
{ type: "spring", mass: 1, stiffness: 100, damping: 10 }  // traditional physics — more control
```

Keep bounce between 0.1–0.3, and avoid bounce in most UI; reserve it for drag-to-dismiss and playful interactions.

### 6. Interruption and exit

- **Transitions, not keyframes, for anything triggered rapidly** — toasts, toggles, anything a user can fire twice in a second. Transitions retarget from the current value; keyframes restart from zero.
- **Springs for gestures**, because they carry velocity through an interruption.
- **Exit the way it entered.** A toast that slides in from the bottom leaves through the bottom. Symmetric paths are what make swipe-to-dismiss feel obvious.
- **Asymmetric timing where the user is deciding.** Slow on the deliberate phase (a hold-to-confirm press: 2s linear), snappy on the system response (release: 200ms ease-out).

### 7. Reduced motion and pointer gating

Ships with the animation, every time.

```css
@media (prefers-reduced-motion: reduce) {
  .element { animation: fade 0.2s ease; } /* optional gentle replacement; removal may be more appropriate */
}

@media (hover: hover) and (pointer: fine) {
  .element:hover { transform: scale(1.05); } /* touch fires false hovers on tap */
}
```

```jsx
const reduce = useReducedMotion();
const closedX = reduce ? 0 : '-100%';
```
Choose removal, reduction, or replacement according to the effect and the user's preference. The media query detects that preference; it does not automatically pause video or freeze animations. Follow the baseline's static-presentation and user-control rules, and verify that interrupted entrances or scroll reveals leave essential content visible.

## Recipes

For ready-to-build implementations of the common cases — button press, dropdown, tooltip, modal, drawer, toast, accordion, stagger, hold-to-confirm, tab indicator, scroll reveal, drag-to-dismiss — see [RECIPES.md](RECIPES.md). Load it whenever the request matches one of those components and start from the recipe instead of a blank file.

## Never Ship

Self-check before you finish. Each of these is an automatic block in `yeknal-review-animations`:

| Never | Instead |
| --- | --- |
| `transition: all` | Name the exact properties |
| `transform: scale(0)` entrance | `scale(0.95)` + `opacity: 0` |
| `ease-in` on a UI element | `ease-out` or a strong custom curve |
| Built-in `ease-out` on a deliberate animation | `cubic-bezier(0.23, 1, 0.32, 1)` |
| Animation on a keyboard shortcut or 100+/day action | No animation |
| UI duration over 300ms with no reason | 150–250ms |
| `transform-origin: center` on a trigger-anchored popover | `var(--transform-origin)` (modals exempt) |
| Keyframes on toasts, toggles, rapidly-triggered elements | CSS transitions |
| Animating `width`/`height`/`margin`/`padding`/`top`/`left` | `transform` / `opacity` |
| Motion `x`/`y`/`scale` props under load | Full `transform` string |
| Ungated `:hover` motion | `@media (hover: hover) and (pointer: fine)` |
| Missing `prefers-reduced-motion` | Apply the shared reduced-motion policy |
| Everything entering at once | 30–80ms stagger |

## Output

Write the code. Then, in at most a few lines:

- **The gate result** — frequency tier and the named purpose. If part of the request was rejected, say which part and why.
- **The ingredients** — tool, properties, curve, and duration or spring config, one line each.
- **What to feel-check** — if the result depends on feel you cannot judge from code (a crossfade, a spring's bounce, the opacity/height balance in an entering list), say so and point at the check: play it at 2–5× duration or in the DevTools animation inspector, step it frame by frame, test gestures on a real device, and look again the next day with fresh eyes.

Do not pad this into a report. The code is the deliverable.

## Tone

Opinionated and brief. When the honest answer is "this should not animate," give it; that answer is why this skill exists. When feel genuinely cannot be settled from code, say so instead of guessing at a value.
