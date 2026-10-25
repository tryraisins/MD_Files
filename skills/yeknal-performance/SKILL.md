---
name: yeknal-performance
description: Make an app faster by measuring startup, navigation, content load, and scroll, fixing the real bottleneck, and proving each win with before and after numbers. Use when an app feels slow to start, to change screens, to fill in, or to scroll.
metadata:
  last-reviewed: "2026-10-23"
  boundary: "Measurement-driven. No claim without a before and after number."
---

# Performance

Make the app faster by measuring, fixing, and measuring again. Every claim in this workflow is a number with a command and an artifact behind it.

## Where this fits

| Request | Use |
| --- | --- |
| "Make the app faster", "it feels slow", "startup takes forever", "scrolling stutters" | this skill |
| "The build fails", "this screen throws", "it broke after deploy" | `yeknal-troubleshoot` |
| "Is this diff safe?" | `yeknal-review` |
| "The animation feels wrong", motion craft | `yeknal-improve-animations` |
| "Is this ready to launch?" | `yeknal-launch-readiness` |
| "Prove this feature works in a browser" | `yeknal-playwright`, `yeknal-verification-harness` |

Performance is measured behavior, not a code pattern. Do not open with a fix list. Open with a measurement.

## Invocation

```
/performance [--surface startup|screens|content|scroll] [--audit] [--budget metric=value]
```

- `--surface` narrows the pass. Without it, cover all four surfaces.
- `--audit` measures and reports without editing code.
- `--budget` sets a target, for example `--budget lcp=2500 --budget startup=1500`.

## The contract

A performance claim has four parts: the metric, the number before, the number after, and the artifact that proves both. Missing any part means the change is unproven, and unproven changes are reported as experiments, never as wins.

## Workflow

### 1. Name the surface and the metric

Do not accept "slow" as a target. Convert the complaint into one measurable event:

| Surface | The user says | Measure |
| --- | --- | --- |
| Startup | "It takes forever to open" | Cold launch to first usable content, on a production build, with an empty cache |
| Screen open | "Clicking a row hangs" | Interaction to the next painted state, and time until the real content replaces the skeleton |
| Content load | "Pages take ages to fill in" | Time to first useful content, time to complete data, waterfall depth, and the same numbers on page 5 or item 1,000 |
| Scrolling | "It stutters" | Frame interval p50 and p95, dropped frames, long tasks on the main thread, and INP while scrolling |

Record the target in the same units as the measurement. "Feel faster" is not a target.

If `--budget` was given, write the budget beside the metric and use it as the stop condition in step 6. With `--audit`, stop after step 3 and report the baseline, the bottleneck, and the expected win without editing code.

### 2. Freeze the baseline before touching code

Measure the untouched app. Production build, cold cache, throttled device, five runs minimum, median and p75 recorded. Use [the measurement protocol](references/measuring.md) and, for web surfaces, the bundled harness:

```bash
node scripts/bench-web.mjs --config perf.config.json --label baseline
```

Commit the config and the harness first. A baseline that cannot be reproduced is not a baseline.

### 3. Locate the bottleneck with evidence

Profile before forming a hypothesis:

- Browser: Performance panel trace, network waterfall, CPU profile, React Profiler commit flame chart.
- Electron: `--trace-startup`, main-process marks, renderer trace, `ready-to-show` timing.
- React Native: Hermes sampling profile, Perf Monitor, navigation transition marks.
- Server and data: query log with durations, N+1 detection, endpoint timings, cache hit rate.

Name the largest contributor and its share of the total. A fix aimed at the second-largest cost is usually wasted effort. If the trace does not support the hypothesis, discard the hypothesis.

### 4. Predict the win, then change one thing

State the expected effect before editing: "deferring the analytics bundle should remove about 400ms of startup", "indexing `messages(thread_id, created_at)` should cut this query from 900ms to under 50ms".

One variable per measurement. Two changes in one run cannot tell you which one worked, and one of them probably did nothing.

### 5. Re-measure identically and decide

Same build settings, same machine, same throttle, same run count, same warm-up. Compare medians, not best runs. Apply the noise floor from [measuring.md](references/measuring.md).

- Improvement larger than the noise floor and no regression elsewhere: keep it.
- Improvement inside the noise floor: revert it. Complexity without a proven win is a loss.
- Regression: revert and record what was tried.

### 6. Deliver the numbers

Use [the report template](references/report-template.md). One table per surface with before, after, delta, artifact path, and change. Include the reverted experiments and the remaining cost.

## Surface map

Detailed procedures live in the references; when the profile names a cost, [the fix catalog](references/fix-catalog.md) maps symptom to fix to verification. The short version:

| Surface | Usual largest cost | Read |
| --- | --- | --- |
| Startup | Eager JavaScript, blocking boot work, serial initialization, remote content in the first frame | [startup.md](references/startup.md) |
| Screen open | Route and component payload, request waterfalls, work on the interaction, unnecessary re-renders | [screens-and-content.md](references/screens-and-content.md) |
| Content load | N+1 queries, missing indexes, over-fetching, no pagination, uncached reads, unoptimized images | [screens-and-content.md](references/screens-and-content.md) |
| Scrolling | Unwindowed lists, layout thrash, per-scroll re-renders, long tasks, oversized images, memory pressure | [scrolling.md](references/scrolling.md) |

## What counts as a win

- The metric moved more than the measured noise floor.
- The other three surfaces did not regress.
- Correctness held: same data, same states, same deep links, same empty and error behavior.
- Accessibility held: focus order, announcements, reduced motion, contrast, keyboard paths.
- The cost is honest: no content hidden, no feature removed, no stale cache presented as fresh, no fake skeleton replacing real content.
- The complexity is justified: the win is worth the code the next person has to maintain.

## Hard rules

1. Never report a development-server measurement as performance.
2. Never claim a win from a single run, a best-of run, or a different machine.
3. Never optimize a cold path that runs once while the per-interaction cost dominates.
4. Never "fix" a slow screen by rendering less of it without saying so.
5. Never cache without naming the invalidation rule.
6. Never paginate in a way that breaks deep links, back navigation, or restored scroll position.
7. Never trade correctness, accessibility, or data freshness for a number.
8. Never add memoization, virtualization, or a worker before the profile names it.
9. Never measure with instrumentation that changes the behavior being measured.
10. Never leave a losing change in the tree because it "should" help.

## Stop conditions

Stop when the surface meets its budget, when the next candidate costs more risk than the remaining milliseconds are worth, or when the profile stops offering a dominant cost. Say which condition was reached. A short, honest report beats a long list of speculative edits.
