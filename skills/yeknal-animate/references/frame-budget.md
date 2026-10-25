# Frame budget

Motion either lands inside the frame budget or it stutters. This file is the diagnostic layer beneath the main skill's property rules: what a frame costs, and how to find the cause when an animation drops frames.

## The budget

- 60Hz means a frame every 16.7ms. 120Hz means 8.3ms. A 120Hz phone has **half** the budget you probably assumed, and it is now a common device.
- The relevant device is a mid-range phone, not your laptop. A fast machine hides almost every problem in this file.
- "It feels smooth on my machine" is not evidence. Record on a throttled device, then look at frame intervals and long tasks, not at impressions.

## Diagnosis order

Work top to bottom. Most jank is at the top and `will-change` is at the bottom.

1. **Is it a layout property?** `width`, `height`, `top`, `left`, `margin`, `padding` force layout, paint, and composite. Replace with `transform` and `opacity`, or with `clip-path` where a reveal genuinely needs it.
2. **Is the main thread busy?** CSS animations and WAAPI run off the main thread for compositor-only properties. A `requestAnimationFrame` loop competes with React renders, hydration, and paint and drops frames exactly when the page is doing the most.
3. **Is something re-rendering every frame?** A React state update per frame is the classic cause: a scroll handler calling `setState`, a gesture writing to state instead of a motion value. The animation is fine; the render is not.
4. **Is a CSS variable being animated or rewritten on a parent?** Changing a custom property invalidates style recalculation for every element that inherits it. Animating `--x` on a container with many children recalculates all of them, every frame. Set the property on the element that moves.
5. **Is a filter, blur, or shadow involved?** These are the expensive paints: see the cost table below.
6. **Only now: `will-change` or a layer hint.** It is a last step, it allocates memory, and it fixes neither a wrong property nor a busy thread.

Every fix you propose names which cause it addresses. "Added `will-change`, seems smoother" is not a diagnosis.

## Cost table

| Property | Cost | Note |
| --- | --- | --- |
| `transform`, `opacity` | Cheapest | Compositor only; can run off the main thread |
| `clip-path` | Cheap to moderate | Composited in modern engines; animate the shape, not the layout |
| `filter: blur()` | Expensive | Cost scales with radius and area; re-runs every frame |
| `backdrop-filter: blur()` | Most expensive | Re-filters whatever is behind it, every frame that changes |
| `box-shadow` | Expensive | Repainted each frame when animated |
| `background-color`, `color` | Moderate | Paint only, acceptable for small areas and short transitions |
| `width`, `height`, `top`, `left`, `margin` | Worst | Layout, paint, and composite |

Rules that follow:

- **Never animate `box-shadow`.** Put the shadow on a pseudo-element and animate its `opacity`, or animate a `transform` on a shadow layer.
- **Keep blur radii small.** The visual difference between 20px and 40px is small; the cost is roughly proportional to area and radius.
- **Never combine `backdrop-filter` with `mix-blend-mode`** on the same element, and do not place either on a large scrolling region.
- **Do not animate a filter and a transform on the same element** unless you have measured it.

## Verification

- Record with the CPU throttled and on a real mid-range device or a throttled profile.
- Read frame intervals: p50, p95, and the count above 33ms. A p50 that is fine with a bad p95 is a stutter, not a pass.
- Check long tasks overlapping the animation window, not just the average frame rate.
- Test with the page busy: hydrate while animating, scroll while a list renders, open a drawer during a route change. An animation that is only smooth on an idle page is unfinished.
- State plainly which findings came from code reading and which need a recording on a device. Never claim a frame-rate result you did not measure.

## When to accept the cost

Some motion genuinely earns an expensive property, for example a full-screen blur behind a modal, or a masked reveal on a hero. Accept it when the interaction is rare, the area is bounded, and a fallback exists for slow devices and reduced-motion users. Accepting it silently for a repeated interaction is the defect.
