# Screens and content

A screen that opens quickly but fills in slowly is still slow. Measure both: the transition (did the UI respond?) and the content (is the real thing on screen?).

## Define the two numbers

- **Screen open**: from the interaction to the next painted state. The user must see that something happened. A dead click is the worst result, worse than a visible skeleton.
- **Content ready**: from the interaction to the real content replacing the placeholder. Measure with a stable marker such as `data-loaded="true"` on the container.

Report both. A 50ms transition into a 3-second skeleton is not a fast screen.

## Diagnose

| Observation | Likely cost | Evidence |
| --- | --- | --- |
| Click feels dead, then jumps | Work on the click handler, synchronous state updates, route chunk fetch | Trace the interaction, check chunk timing |
| Skeleton appears, then waits | Serial requests, slow endpoint, client-side waterfall | Network waterfall, server timings |
| Content appears in pieces | Independent requests resolving separately, no shared cache | Waterfall order, request duplication |
| Second visit is fast, first is slow | Cold route chunk, no data cache, no prefetch | Compare cold and warm, check cache headers |
| Page 5 is much slower than page 1 | Offset pagination, missing index, full scan, over-fetch | Query log and `EXPLAIN`, payload size |
| Images pop in late | No dimensions, no sizing, no modern format, no priority | LCP element, image bytes, layout shifts |
| Slow only on mobile data | Payload size, too many requests, no compression | Throttled waterfall |

## Navigation and rendering

- Fetch the route's code before the click when intent is clear (hover, focus, viewport entry). Prefetching on mount everything is not the same thing.
- Keep the previous screen interactive until the next one is ready. Blocking the whole UI for a route change makes even a fast load feel broken.
- Split work that does not affect the first painted state: move parsing, formatting, and derived data after the paint, or to the server.
- Reduce render cost at the source: stable list keys, derived state computed once, context split so unrelated consumers do not re-render, memo boundaries where the profile shows repeated work.
- Do not add `memo` or `useMemo` everywhere. They cost comparison time and code. Add them where the profiler shows a repeated expensive render.

## Data and waterfalls

The most common cause of a slow screen is a chain of requests that could have been one.

- **Parallelize independent reads.** Thread, messages, permissions, and reactions should not wait for each other.
- **Collapse serial client fetches.** Server-render or server-aggregate when the client would otherwise make three dependent calls.
- **Fix N+1 at the query layer.** One query per row is a data-model problem, not a caching problem.
- **Index the columns the screen filters and sorts on.** Confirm with the query plan, not with intuition.
- **Select only the fields the screen uses.** Wide rows cost transfer, parse, and memory.
- **Paginate with a stable cursor** for long or frequently changing lists. Offset pagination gets slower and can duplicate or skip rows while data changes.
- **Cache with a named invalidation rule.** State the key, the lifetime, and what makes it stale. A cache without that rule is a correctness bug waiting to surface.
- **Coalesce duplicate requests.** Two components asking for the same resource at the same moment should share one in-flight request.
- **Prefetch on intent, not on mount.** Hover, focus, and near-viewport are intent. Loading every possible next screen is not.

## Older content

"Older content loads faster" usually means the deep path, not the first page. Measure it directly:

- Open page 5, page 20, or item 1,000, cold.
- Time the query, the payload, and the render separately.
- Check whether pagination degrades with depth. If it does, the index or the query shape is wrong.
- Check whether the list virtualizes or renders every row. Rendering 5,000 rows costs the same on page 1 and page 100 only if the list is windowed.
- Check whether the deep link restores scroll position without re-fetching everything.
- Check whether back navigation reuses the cache or starts over.

## Images and fonts

- Set width and height (or an aspect ratio) on every image and media slot. Layout shift is a performance cost the user feels.
- Serve correctly sized images. A 2,000px image in a 390px slot is wasted bytes and decode time.
- Use a modern format with a fallback, and lazy-load below the fold. Never lazy-load the LCP image.
- Use `font-display: swap` or a metric-compatible fallback. Avoid invisible text during startup.
- Preload only the font actually used in the first paint.

## Streaming and progressive rendering

- Stream the shell first when the page has slow sections. The user gets a usable frame while data resolves.
- Do not stream a skeleton that then shifts. Reserve the final layout.
- Keep placeholders honest: they should match the shape and size of the content, not act as a decorative delay.

## Verify the fix

1. Re-measure with the same route list, data set, and throttle.
2. Compare both numbers: screen open and content ready.
3. Test cold and warm visits, deep pages, back navigation, and restored scroll.
4. Confirm the empty, error, and offline states still work and still look right.
5. Confirm no request duplication was introduced and no cache serves stale data without a rule.
