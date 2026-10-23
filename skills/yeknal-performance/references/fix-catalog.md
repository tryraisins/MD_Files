# Fix catalog

Ranked by how often the evidence leads here, not by how interesting the fix is. Use the profile to choose the row; never apply a row because it sounds modern.

Each row is a hypothesis until the trace supports it. After the fix, re-run the same measurement and apply the noise floor.

## Startup

| Symptom | Evidence | Fix | Expected | Risk | Verify |
| --- | --- | --- | --- | --- | --- |
| HTML is late | High TTFB, cold server, slow database connect | Warm the server path, cache the shell, connect lazily, deploy closer to users | Large for first visitor | Stale shell, cold-start cost moved | TTFB at p75 from a cold edge |
| Blank screen while JS parses | Large entry chunk, long parse and compile | Route-level splitting, remove eager imports, defer non-critical libraries | 200 to 800ms on mid-tier phones | Broken deep links if splitting is careless | Cold load on 4x CPU throttle |
| Everything loads at once | Waterfall shows dozens of requests before first paint | Parallelize independent boot requests, defer analytics and widgets | Medium | Ordering assumptions break | Same waterfall, fewer blocking requests |
| Fonts block text | Invisible text, late font request | `font-display: swap`, preload the used font, metric-compatible fallback | 100 to 400ms | Visual shift on swap | First paint text visible, no layout shift |
| Electron opens white | Window created late, work before `ready-to-show` | Create window first, show on ready, defer main-process work | Large | None if ready-to-show is wired | Trace start to first painted frame |
| RN first screen waits on config | Boot marks show remote fetch before render | Render defaults, reconcile config after first commit | Large | Defaults must be safe | Hermes profile, first commit time |
| Slow only on first launch | Sync storage reads, migrations, update check | Move to async, run after first paint, or precompute at build | Large | Migration ordering | First-run marks on a clean install |

## Screen open

| Symptom | Evidence | Fix | Expected | Risk | Verify |
| --- | --- | --- | --- | --- | --- |
| Dead click | Handler work and chunk fetch on the interaction | Prefetch on hover or focus, split and preload the route | 100 to 500ms perceived | Wasted bandwidth on unused prefetch | Interaction trace |
| Skeleton for seconds | Serial requests after navigation | Parallel fetch, server aggregation, shared in-flight cache | Large | Cache invalidation | Waterfall depth and content-ready time |
| Re-render storm | Profiler shows repeated commits, unrelated components | Split context, stabilize references, memo at measured boundaries | Medium | Stale props if memo is wrong | Commit count per interaction |
| Screen opens then jumps | Data lands after paint without reserved space | Reserve layout, stream the shell, use honest placeholders | Perceived | None if sizes match | CLS during navigation |
| Every visit re-fetches | No cache, no stale policy | Cache with key plus invalidation rule, or server cache | Medium to large | Stale data | Repeat visit timing, freshness check |
| Slow only on deep link | Cold chunk plus full data fetch | Preload likely chunk, resolve data on the server | Medium | Auth and error states | Cold deep-link run |

## Content load

| Symptom | Evidence | Fix | Expected | Risk | Verify |
| --- | --- | --- | --- | --- | --- |
| One query per row | Query log repeats the same statement | Join, batch, or eager-load in one query | Very large | Shape changes in the API | Query count and total time |
| Page 20 is slow | Full scan, offset pagination, no index | Composite index matching filter and sort, cursor pagination | Very large | Migration and backfill | `EXPLAIN`, p75 for deep pages |
| Huge payload | Response size far above rendered data | Select needed fields, trim nested objects, compress | Large | Consumers expecting fields | Bytes and parse time |
| Duplicate requests | Same URL requested twice at once | Shared in-flight promise, cache layer | Medium | Cache key mistakes | Request count per screen |
| Images late and heavy | LCP is an image, bytes exceed slot | Size correctly, modern format, priority on the LCP image | Large | Quality regression | LCP and bytes |
| Whole list renders | DOM node count grows with data | Virtualize, paginate, or both | Large | Find-in-page, accessibility | Node count, scroll p95 |
| Content appears in pieces | Independent requests resolve late | Aggregate on the server, stream sections in priority order | Medium | Partial failure handling | Content-ready time |

## Scrolling

| Symptom | Evidence | Fix | Expected | Risk | Verify |
| --- | --- | --- | --- | --- | --- |
| Long tasks per frame | Trace shows >50ms tasks during scroll | Virtualize, simplify rows, move work off the thread | Large | Row behavior changes | p95 frame interval |
| Layout thrash | Forced reflow warnings | Batch reads and writes, avoid per-frame measurement | Large | None | Trace layout duration |
| Re-render per scroll event | Commit count matches scroll events | rAF-throttled state, CSS-driven effects, selectors | Medium | Stale UI if throttled wrong | Commit count and p95 |
| Stutter when images enter | Decode and paint on the main thread | Reserve dimensions, lazy-load below fold, decode async | Medium | Blank slots | Frame intervals during image entry |
| Stutter after minutes | Heap growth, detached nodes, listeners | Cap caches, clean up listeners, release image memory | Medium | Cache misses | Memory across three passes |
| Nested scroll containers | Multiple scroll owners | One scroll container, sticky instead of nested panes | Medium | Layout redesign | Touch scroll on a mid-tier phone |

## Traps

These changes often look like improvements and are not:

- **Debouncing the symptom.** Delaying a render hides jank but adds latency. Measure INP, not just frame rate.
- **`React.memo` everywhere.** Comparison cost and stale-prop bugs, usually without a measurable win.
- **Lazy-loading the LCP image.** It delays the one thing the user is waiting for.
- **Fake skeletons.** A longer, prettier placeholder is still a slower screen.
- **Caching without invalidation.** Fast and wrong.
- **Removing content or states.** Smaller page, broken product.
- **Measuring a dev build.** The numbers describe a different app.
- **Optimizing a once-per-session path.** The user pays per interaction, not per install.

## Order of work

1. The largest measured contributor on the surface the user complained about.
2. Anything that blocks the first usable frame.
3. Anything that scales with data size or session length.
4. Micro-optimizations only if the profile still names them.

Stop when the surface meets its budget or the next candidate is high risk for a small measured gain.
