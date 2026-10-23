# Scrolling

Scrolling is the surface where frame time is the product. A 16.7ms budget at 60fps, 8.3ms at 120fps. Long frames during scroll are felt immediately as stutter.

## Measure frames, not feelings

Use the bundled harness scroll pass, or record a Performance panel trace while scrolling:

- Frame interval p50 and p95 during a scripted scroll.
- Dropped frames: intervals above roughly 33ms.
- Long tasks on the main thread during the scroll window.
- INP for interactions that happen while scrolling (opening a row, toggling a control).
- Memory growth after several passes down and back up.

A fast first scroll with a slow third pass is usually memory or cache growth. Measure more than one pass.

## Diagnose

| Observation | Likely cost | Evidence |
| --- | --- | --- |
| Stutter from the first pixel | Huge DOM, every row rendered, expensive row components | Trace: long tasks and render counts |
| Stutter only on long lists | No virtualization, layout recalculation per row | DOM node count, layout duration in trace |
| Stutter when images enter view | Decode and layout on the main thread, unsized images | Image events in trace, layout shifts |
| Stutter on hover or pointer move | Scroll or resize listener doing work, layout reads in a loop | Event listener timeline, forced reflow warnings |
| Stutter with sticky or parallax effects | Scroll-linked work on the main thread | Trace during the effect |
| Stutter grows over time | Memory pressure, leaked listeners, accumulating cache | Heap snapshots across passes |
| Smooth on desktop, bad on phone | Too much JS per frame, oversized images, too many layers | Throttled trace on a mid-tier device |

## Lists

- Virtualize or window long lists. Render the rows near the viewport plus a small overscan.
- Keep row height predictable. Variable heights are fine, but measure them once and cache the result.
- Use stable keys tied to identity, never the array index for reorderable lists.
- Avoid work in the row render that does not depend on the row: formatting, sorting, filtering.
- Do not animate layout properties per row. Transform and opacity stay off the layout path.
- Prefetch the next page before the user reaches the end, but do not render it eagerly.
- In React Native, use `FlatList` or `FlashList` with `getItemLayout` where rows are fixed, sensible `windowSize`, and `removeClippedSubviews` only after measuring it helps.

## Main-thread discipline

- Never read layout and then write styles in a loop. Batch reads, then batch writes.
- Use passive listeners for `scroll`, `wheel`, and `touchmove`.
- Throttle scroll-driven state to `requestAnimationFrame`. Do not set React state on every scroll event.
- Prefer CSS for scroll effects (`position: sticky`, `scroll-driven animations`) over JS where support allows.
- Move heavy parsing, sorting, and image processing to a worker or to the server.
- Keep one scroll container. Nested scroll containers multiply work and break momentum on touch.

## Paint and layout

- Give images and embeds explicit dimensions to avoid layout during scroll.
- Use `content-visibility: auto` with `contain-intrinsic-size` for long offscreen sections, and verify it does not break find-in-page or accessibility.
- Avoid huge box shadows, blurs, and filters on scrolling layers; they are expensive to repaint.
- Be careful with `will-change`. It allocates layers and can increase memory. Apply it only during the interaction.
- Reduce DOM depth in rows. Deep trees cost layout and paint on every frame.

## Memory

- Release image and data caches when leaving a long screen, or cap their size.
- Remove listeners on unmount. Duplicated listeners are a common cause of scroll getting worse over time.
- Check for retained detached DOM nodes after navigating away.
- Test a long session: scroll, navigate, return, repeat. Performance that decays is a leak.

## Verify the fix

1. Re-run the same scroll pass with the same distance, step count, and device throttle.
2. Compare p95 frame interval and dropped-frame percentage, not just the average.
3. Run at least three passes to catch warming and decay.
4. Check that scrolling still works with a keyboard, a screen reader, and reduced motion enabled.
5. Confirm the visual result did not change: no clipped content, no wrong sticky behavior, no lost scroll position on back navigation.
