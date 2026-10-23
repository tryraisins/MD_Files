# Report template

Copy this into the project, fill it from measured data, and keep it beside the artifacts. Do not include a number that has no artifact behind it.

```markdown
# Performance report: <app or surface>

Date:
Build: <commit, production build command>
Machine and device: <cpu, ram, os, browser or device>
Conditions: <cpu throttle, network profile, cache state, run count>
Harness: <command, config path>
Artifacts: <perf-results directory>

## Summary

| Surface | Metric | Before | After | Delta | Verdict |
| --- | --- | ---: | ---: | ---: | --- |
| Startup | Cold launch to usable (p75) | | | | kept / reverted / within noise |
| Screen open | Interaction to content (p75) | | | | |
| Content load | Deep page content ready (p75) | | | | |
| Scrolling | Dropped frames (p95 interval) | | | | |

Verdict values: `kept` means the win exceeded the noise floor and nothing regressed. `within noise` means the change is not proven. `reverted` means it was removed.

## Startup

| Change | Metric | Before | After | Delta | Artifact |
| --- | --- | ---: | ---: | ---: | --- |

Notes:

## Screen open

| Route or action | Metric | Before | After | Delta | Artifact |
| --- | --- | ---: | ---: | ---: | --- |

Notes:

## Content load

| Route or query | Metric | Before | After | Delta | Artifact |
| --- | --- | ---: | ---: | ---: | --- |

Notes, including deep-page behavior:

## Scrolling

| Screen | Frame p95 | Dropped % | Long tasks | Before | After | Artifact |
| --- | ---: | ---: | ---: | --- | --- | --- |

Notes:

## Reverted experiments

| Change | Measured result | Why reverted |
| --- | --- | --- |

## Remaining cost

| Surface | Remaining bottleneck | Estimated cost | Why it was not fixed |
| --- | --- | ---: | --- |

## Verification

- [ ] Same build and conditions for every label
- [ ] At least five runs per label, median and p75 reported
- [ ] Noise floor recorded
- [ ] No regression on the other surfaces
- [ ] Empty, error, offline, and signed-out states still work
- [ ] Deep links, back navigation, and scroll restoration still work
- [ ] Keyboard, screen reader, and reduced-motion paths still work
- [ ] No cache without a named invalidation rule

## Next

The single highest-value next measurement, and what would have to be true for it to be worth doing.
```

## Filling rules

- Before and after must come from the same harness, route list, viewport, and throttle.
- Report p75 for user-facing surfaces. Medians alone hide the slow tail the user remembers.
- A change with no artifact is listed under "Reverted experiments" or omitted, never under results.
- If a surface was not measured, say so. An empty row is honest; an invented number is not.
- Keep the report short enough to read in one pass. Detail belongs in the traces.
