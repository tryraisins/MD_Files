# Startup

Startup is a cold-path budget. The user waits once, but that wait sets their first impression of the whole product.

## Define the end of startup

Do not measure to "the app is running". Measure to the first moment the user can act:

- **Web**: first meaningful content painted and the primary control responsive. Report TTFB, FCP, LCP, and time to interactive-ish behavior separately.
- **Electron**: first painted, usable window. Not `app.whenReady`, not the process start.
- **React Native**: first screen committed and interactive, not the JS bundle evaluated.

Record both the technical boundary and the user-visible one. A fast `DOMContentLoaded` with a blocked main thread is still a slow startup.

## Diagnose

| Observation | Likely cost | Evidence to capture |
| --- | --- | --- |
| Long gap before any HTML | Server or edge latency, cold start, database connect | TTFB, server logs, cold-start timing |
| HTML arrives, blank screen | Render-blocking CSS or fonts, client bundle parse | Network waterfall, main-thread flame chart |
| Content appears, then jumps or freezes | Late data, hydration, expensive first render | Trace with long tasks, React Profiler |
| Fast on desktop, slow on phone | Bundle size, parse and compile on a weaker CPU | Throttled trace, bundle analysis |
| Slow only on first launch | Synchronous storage reads, update checks, migrations, remote config | Main-process or boot marks |

## Web

**Cut the critical path.**

- Split by route, not by arbitrary file. The first route should not download the settings screen.
- Defer non-critical work: analytics, chat widgets, support banners, A/B libraries, error replay, feature flags that are not needed for the first paint.
- Remove eager imports from the entry: icon barrels, date libraries, charting, editors, markdown renderers, heavy UI kits.
- Preload what the first screen definitely needs (critical font, hero image, the one API call), and preconnect to origins used immediately. Do not preload everything.
- Inline critical CSS only when it measurably helps. A large inline block can delay HTML parsing.

**Shorten the boot sequence.**

- Boot requests that do not depend on each other should run in parallel, not in a chain.
- Expensive client initialization (parsing a large config, building an index, restoring a store) belongs after first paint, or on the server.
- Authentication checks can often render a shell first and resolve identity behind a stable boundary. Do not flash a login screen while the session is unknown.

**Respect the device.**

- Test with 4x CPU throttling. Parse and compile cost dominates on mid-tier phones.
- Check third-party scripts, not just your bundle. A tag manager can cost more than the app.
- Avoid layout shift during startup. Reserve space for the header, hero, and any async slot.

## Electron

- Create the window early, then do the rest. Work before `new BrowserWindow` delays every user-visible pixel.
- Show on `ready-to-show`; do not open a white window and paint over it.
- Move boot work off the main process: no synchronous file system calls, no blocking network requests, no heavy parsing on startup.
- Defer update checks, telemetry, crash-reporter upload, and plugin discovery until after the first window is usable.
- Load local content first. A remote start page turns your startup into a network measurement.
- Keep the preload script small. It runs before the page and blocks the renderer.
- Ship compressed and pruned assets. Check that development maps, test fixtures, and unused locales are excluded from the package.

Measure with `--trace-startup` and main-process marks. Compare package size and file count between releases; startup regressions often come from assets, not code.

## React Native

- Build release, profile with Hermes, and measure on a mid-tier Android device.
- Keep the initial bundle small: lazy-load routes, defer heavy libraries, avoid importing the whole icon set.
- Do not block the first screen on remote config, fonts, or analytics. Render with defaults and reconcile later.
- Use native navigation with lazy screen registration. Registering every screen at boot costs time the user never sees benefit from.
- Move startup parsing and migration off the JS thread where the platform allows it.
- Watch image decoding and font loading during the first render; they are common invisible costs.

## Verify the fix

1. Re-run the same cold-start measurement at least five times.
2. Compare median and p75 for the user-visible boundary, not only for the technical one.
3. Confirm the first screen still shows real content, not a longer skeleton.
4. Check memory and bundle size, so the win is not paid for later.
5. Walk the first-run path again: empty state, signed-out state, offline start, and slow network.
