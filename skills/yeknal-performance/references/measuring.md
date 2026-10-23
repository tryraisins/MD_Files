# Measuring

The measurement is the work. Everything else in this skill depends on it being honest and repeatable.

## The protocol

1. **Build for production.** Run the same command the deployment uses. Development builds, HMR, source maps, unminified bundles, and debug toolbars all distort startup and interaction cost.
2. **Start cold.** A fresh browser context, an emptied cache, and a restarted app. A warm second load measures the cache, not the app.
3. **Throttle to the target device.** For web, 4x CPU slowdown and Fast 3G or a mid-tier phone profile. For desktop, measure on the slowest supported machine, not the development laptop. For mobile, a real mid-tier device or the platform's performance profile.
4. **Run at least five times.** Discard the first run if the app performs one-time initialization. Report the median and p75, never the best run.
5. **Keep conditions identical.** Same machine, same power mode, same browser version, same extensions (none), same background load, same data set. Reboot or close the heavy apps between baseline and comparison if the machine drifts.
6. **Record the artifact.** Trace file, heap snapshot, query log, harness JSON, screenshot. The artifact is what makes the number reviewable later.

## Noise floor

Run-to-run variance is real. Compute the floor from your own runs rather than trusting a rule of thumb:

```
spreadPct  = (max - min) / median * 100
noiseFloor = max(2, spreadPct / 2)
```

A change counts only when it moves the median by more than the floor for that metric. The bundled harness computes this per route and marks comparisons inside the floor as `within-noise`.

The harness also applies two practical guards: the noise floor is capped at 50 percent, and a change must clear 2ms in absolute terms. Without them, a 5ms metric with 1ms of jitter produces a huge percentage and a fake verdict.

If the floor is above roughly 15 percent, the environment is too noisy to judge small wins. Fix the environment before judging code.

## Web measurement

### Bundled harness

`scripts/bench-web.mjs` measures a running app with Playwright. It records, per route:

- TTFB, FCP, LCP, DOMContentLoaded, load
- time until a ready selector is visible
- long-task count, total long-task time, and total blocking time
- CLS
- scroll pass: frame interval p50, p95, max, dropped frames, and dropped percentage

Minimal `perf.config.json`:

```json
{
  "baseUrl": "http://localhost:3000",
  "runs": 5,
  "cpuThrottle": 4,
  "network": { "latency": 150, "downloadKbps": 1600, "uploadKbps": 750 },
  "viewport": { "width": 390, "height": 844 },
  "routes": [
    { "name": "home", "path": "/", "readySelector": "main" },
    { "name": "inbox", "path": "/inbox", "readySelector": "[data-loaded='true']" },
    { "name": "deep-list", "path": "/inbox?page=5", "readySelector": "[data-loaded='true']",
      "scroll": { "distance": 6000, "steps": 80 } }
  ]
}
```

Commands:

```bash
node scripts/bench-web.mjs --config perf.config.json --label baseline
node scripts/bench-web.mjs --config perf.config.json --label after
node scripts/bench-web.mjs --compare perf-results/baseline.json perf-results/after.json
```

The harness needs Playwright in the project (`npm i -D playwright`). It does not install a browser silently; run `npx playwright install chromium` once.

### When the harness is not enough

- **Startup before any page exists**: use a Performance panel trace and the `navigation` timing entry, or Electron startup tracing.
- **Interaction cost**: record an interaction in the Performance panel and read INP, or use `PerformanceObserver` with `event` timing.
- **Server cost**: measure with the app's own logs or a query log. A client trace shows waiting, not why the server waited.
- **Memory**: heap snapshot after the flow, not at load. Growth per interaction is the signal.

### Web pitfalls

- Dev server, HMR, and React Strict Mode double renders inflate or distort work.
- A warm cache makes route changes look faster than a real first visit.
- Lighthouse single runs are noisy. Run it several times or use the harness.
- Browser extensions, open DevTools panels, and screen recording change the numbers.
- Measuring with a 1440px viewport on a fast laptop hides the phone cost the user actually has.

## Electron measurement

- Launch with `--trace-startup` and read the trace in `chrome://tracing`. Time from process start to first painted window, not to `app.whenReady`.
- Add marks in the main process around expensive boot steps: window creation, store reads, update checks, IPC registration, database connect.
- Show the window on `ready-to-show` rather than hiding a blank frame afterwards.
- Measure the renderer separately with a CDP trace, because main-process and renderer costs are different budgets.

## React Native measurement

- Build a release variant. Development builds are not representative.
- Record a Hermes sampling profile: `npx react-native profile-hermes`.
- Use the Perf Monitor for JS and UI thread frame rates during scroll and navigation.
- Time screen transitions with marks around the navigation action and the first commit of the destination.
- Measure on a mid-tier Android device, which is usually the real floor.

## Artifacts

Keep one directory per run inside the target repository, not inside the skill:

```
perf-results/
  baseline.json
  after.json
  traces/
    startup-before.json
    startup-after.json
  notes.md
```

The JSON is the machine-readable record. The traces are the evidence for why a number moved. `notes.md` lists what changed between labels, because labels alone go stale.

## Rules for the harness itself

- It must be committed and rerunnable with one command.
- It must fail loudly when the app is not reachable, rather than reporting zeros.
- It must use the same route list, viewport, and throttle for every label.
- It must not require a specific framework, only a URL and a selector.
- It must print the artifact path so the next agent can find it.
