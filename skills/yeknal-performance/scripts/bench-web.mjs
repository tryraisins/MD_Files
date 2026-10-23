#!/usr/bin/env node
/**
 * bench-web.mjs
 *
 * Repeatable before/after measurements for a running web app.
 *
 * Usage:
 *   node scripts/bench-web.mjs --config perf.config.json --label baseline
 *   node scripts/bench-web.mjs --config perf.config.json --label after
 *   node scripts/bench-web.mjs --compare perf-results/baseline.json perf-results/after.json
 *
 * Requires Playwright in the project: npm i -D playwright && npx playwright install chromium
 *
 * Exit codes: 0 report written, 1 regression threshold exceeded, 2 usage or measurement error.
 */

import { readFile, writeFile, mkdir } from "node:fs/promises";
import path from "node:path";
import process from "node:process";

const DEFAULTS = {
  runs: 5,
  cpuThrottle: 4,
  readyTimeoutMs: 30000,
  navigationTimeoutMs: 60000,
  settleMs: 300,
  outDir: "perf-results",
  viewport: { width: 390, height: 844 },
  network: { latency: 150, downloadKbps: 1600, uploadKbps: 750 },
  scroll: { distance: 4000, steps: 60 }
};

function parseArgs(argv) {
  const args = { config: "perf.config.json", label: null, compare: null, failOnRegression: null };
  for (let i = 0; i < argv.length; i += 1) {
    const token = argv[i];
    const next = () => {
      const value = argv[i + 1];
      if (value === undefined) throw new Error(`${token} needs a value`);
      i += 1;
      return value;
    };
    if (token === "--config") args.config = next();
    else if (token === "--label") args.label = next();
    else if (token === "--out-dir") args.outDir = next();
    else if (token === "--compare") {
      const first = next();
      const second = next();
      args.compare = [first, second];
    } else if (token === "--fail-on-regression") {
      args.failOnRegression = Number(next());
    } else if (token === "--help" || token === "-h") {
      console.log("See the header of scripts/bench-web.mjs for usage.");
      process.exit(0);
    } else {
      throw new Error(`Unknown argument: ${token}`);
    }
  }
  return args;
}

const round = (value, places = 1) => {
  if (!Number.isFinite(value)) return null;
  const factor = 10 ** places;
  return Math.round(value * factor) / factor;
};

const clamp = (value, min, max) => Math.min(max, Math.max(min, value));

function quantile(sorted, p) {
  if (sorted.length === 0) return null;
  if (sorted.length === 1) return sorted[0];
  const index = (sorted.length - 1) * p;
  const low = Math.floor(index);
  const high = Math.ceil(index);
  if (low === high) return sorted[low];
  return sorted[low] + (sorted[high] - sorted[low]) * (index - low);
}

function summarize(values) {
  const usable = values.filter((value) => Number.isFinite(value));
  if (usable.length === 0) return null;
  const sorted = [...usable].sort((a, b) => a - b);
  const median = quantile(sorted, 0.5);
  const p75 = quantile(sorted, 0.75);
  const spreadPct = median ? ((sorted[sorted.length - 1] - sorted[0]) / median) * 100 : 0;
  return {
    median: round(median),
    p75: round(p75),
    min: round(sorted[0]),
    max: round(sorted[sorted.length - 1]),
    runs: usable.length,
    spreadPct: round(spreadPct),
    noiseFloorPct: round(Math.max(2, spreadPct / 2))
  };
}

function summarizeFrames(deltas, scrolled, requested) {
  const usable = deltas.filter((value) => Number.isFinite(value) && value > 0).slice(2);
  if (usable.length === 0) return null;
  const sorted = [...usable].sort((a, b) => a - b);
  const dropped = usable.filter((value) => value > 33.4).length;
  return {
    frameP50: round(quantile(sorted, 0.5)),
    frameP95: round(quantile(sorted, 0.95)),
    frameMax: round(sorted[sorted.length - 1]),
    droppedPct: round((dropped / usable.length) * 100),
    frameCount: usable.length,
    scrolledPx: round(scrolled),
    requestedPx: requested,
    incompleteScroll: scrolled < requested * 0.5
  };
}

function normalizeConfig(raw) {
  if (!raw || typeof raw !== "object") throw new Error("Config must be a JSON object");
  if (!raw.baseUrl) throw new Error("Config needs baseUrl, for example http://localhost:3000");
  if (!Array.isArray(raw.routes) || raw.routes.length === 0) {
    throw new Error("Config needs a non-empty routes array");
  }
  const network = { ...DEFAULTS.network, ...(raw.network || {}) };
  if (!Number.isFinite(network.downloadKbps) || !Number.isFinite(network.uploadKbps)) {
    throw new Error("network.downloadKbps and network.uploadKbps must be numbers");
  }
  return {
    baseUrl: raw.baseUrl.replace(/\/$/, ""),
    runs: clamp(Number(raw.runs ?? DEFAULTS.runs), 1, 50),
    cpuThrottle: clamp(Number(raw.cpuThrottle ?? DEFAULTS.cpuThrottle), 1, 20),
    readyTimeoutMs: Number(raw.readyTimeoutMs ?? DEFAULTS.readyTimeoutMs),
    navigationTimeoutMs: Number(raw.navigationTimeoutMs ?? DEFAULTS.navigationTimeoutMs),
    settleMs: Number(raw.settleMs ?? DEFAULTS.settleMs),
    viewport: { ...DEFAULTS.viewport, ...(raw.viewport || {}) },
    network,
    outDir: raw.outDir || DEFAULTS.outDir,
    routes: raw.routes.map((route, index) => ({
      name: route.name || `route-${index + 1}`,
      path: route.path || "/",
      readySelector: route.readySelector || null,
      scroll: route.scroll === false ? false : { ...DEFAULTS.scroll, ...(route.scroll || {}) }
    }))
  };
}

async function loadChromium() {
  try {
    const playwright = await import("playwright");
    return playwright.chromium;
  } catch {
    console.error(
      [
        "bench-web: playwright is not installed.",
        "Run: npm i -D playwright",
        "Then: npx playwright install chromium",
        "This harness never installs a browser or a dependency on its own."
      ].join("\n")
    );
    process.exit(2);
  }
}

const INIT_SCRIPT = () => {
  window.__perf = { lcp: 0, cls: 0, longTasks: [] };

  try {
    new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        window.__perf.lcp = Math.max(window.__perf.lcp, entry.startTime);
      }
    }).observe({ type: "largest-contentful-paint", buffered: true });
  } catch {
    /* observer unsupported */
  }

  try {
    new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        if (!entry.hadRecentInput) window.__perf.cls += entry.value;
      }
    }).observe({ type: "layout-shift", buffered: true });
  } catch {
    /* observer unsupported */
  }

  try {
    new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        window.__perf.longTasks.push({ start: entry.startTime, duration: entry.duration });
      }
    }).observe({ type: "longtask", buffered: true });
  } catch {
    /* observer unsupported */
  }

  window.__scrollPass = async (distance, steps) => {
    const deltas = [];
    const startY = window.scrollY;
    let last = performance.now();
    const stepPx = distance / steps;
    for (let i = 0; i < steps; i += 1) {
      await new Promise((resolve) => requestAnimationFrame(resolve));
      const now = performance.now();
      deltas.push(now - last);
      last = now;
      window.scrollBy(0, stepPx);
    }
    return { deltas, scrolled: window.scrollY - startY };
  };
};

async function runRoute(browser, config, route) {
  const context = await browser.newContext({
    viewport: config.viewport,
    deviceScaleFactor: 1
  });
  const page = await context.newPage();

  try {
    await page.addInitScript(INIT_SCRIPT);
    const session = await context.newCDPSession(page);
    await session.send("Network.enable");
    await session.send("Network.setCacheDisabled", { cacheDisabled: true });
    await session.send("Emulation.setCPUThrottlingRate", { rate: config.cpuThrottle });
    await session.send("Network.emulateNetworkConditions", {
      offline: false,
      latency: config.network.latency,
      downloadThroughput: (config.network.downloadKbps * 1024) / 8,
      uploadThroughput: (config.network.uploadKbps * 1024) / 8,
      connectionType: "cellular3g"
    });

    const url = route.path.startsWith("http") ? route.path : `${config.baseUrl}${route.path}`;
    await page.goto(url, { waitUntil: "load", timeout: config.navigationTimeoutMs });

    let readyMs = null;
    if (route.readySelector) {
      await page.waitForSelector(route.readySelector, {
        state: "visible",
        timeout: config.readyTimeoutMs
      });
      readyMs = await page.evaluate(() => performance.now());
    }

    await page.waitForTimeout(config.settleMs);

    const metrics = await page.evaluate(() => {
      const nav = performance.getEntriesByType("navigation")[0] || {};
      const fcp = performance.getEntriesByName("first-contentful-paint")[0];
      const perf = window.__perf || { lcp: 0, cls: 0, longTasks: [] };
      const longTasks = perf.longTasks || [];
      const resources = performance.getEntriesByType("resource");
      return {
        ttfb: nav.responseStart ?? null,
        fcp: fcp ? fcp.startTime : null,
        lcp: perf.lcp || null,
        domContentLoaded: nav.domContentLoadedEventEnd ?? null,
        load: nav.loadEventEnd ?? null,
        cls: Number((perf.cls || 0).toFixed(4)),
        longTaskCount: longTasks.length,
        longTaskTotalMs: longTasks.reduce((sum, task) => sum + task.duration, 0),
        tbtMs: longTasks.reduce((sum, task) => sum + Math.max(0, task.duration - 50), 0),
        domNodes: document.querySelectorAll("*").length,
        resourceCount: resources.length,
        transferKb: resources.reduce((sum, entry) => sum + (entry.transferSize || 0), 0) / 1024
      };
    });

    let scroll = null;
    if (route.scroll) {
      await page.evaluate(() => window.scrollTo(0, 0));
      await page.waitForTimeout(100);
      const result = await page.evaluate(
        ({ distance, steps }) => window.__scrollPass(distance, steps),
        { distance: route.scroll.distance, steps: route.scroll.steps }
      );
      scroll = summarizeFrames(result.deltas, result.scrolled, route.scroll.distance);
    }

    return { ...metrics, readyMs, scroll, ok: true, url };
  } finally {
    await context.close();
  }
}

async function measure(config, label) {
  const reachable = await fetch(config.baseUrl, { method: "GET" }).catch(() => null);
  if (!reachable) {
    throw new Error(`bench-web: cannot reach ${config.baseUrl}. Start the production build first.`);
  }

  const chromium = await loadChromium();
  const browser = await chromium.launch({ headless: true });
  const routes = {};

  try {
    for (const route of config.routes) {
      const runs = [];
      for (let run = 0; run < config.runs; run += 1) {
        process.stdout.write(`  ${route.name} run ${run + 1}/${config.runs}\r`);
        runs.push(await runRoute(browser, config, route));
      }
      const summary = {};
      const metricNames = [
        "ttfb",
        "fcp",
        "lcp",
        "readyMs",
        "domContentLoaded",
        "load",
        "cls",
        "longTaskCount",
        "longTaskTotalMs",
        "tbtMs",
        "domNodes",
        "resourceCount",
        "transferKb"
      ];
      for (const name of metricNames) {
        const values = runs.map((run) => run[name]).filter((value) => value !== null);
        if (values.length > 0) summary[name] = summarize(values);
      }
      const scrollRuns = runs.map((run) => run.scroll).filter(Boolean);
      if (scrollRuns.length > 0) {
        summary.scroll = {};
        for (const name of ["frameP50", "frameP95", "frameMax", "droppedPct"]) {
          const values = scrollRuns.map((run) => run[name]);
          if (values.some((value) => Number.isFinite(value))) {
            summary.scroll[name] = summarize(values);
          }
        }
        summary.scroll.incompleteScroll = scrollRuns.some((run) => run.incompleteScroll);
      }
      routes[route.name] = { url: runs[0].url, summary, runs };
      process.stdout.write(`${" ".repeat(40)}\r`);
    }
  } finally {
    await browser.close();
  }

  return {
    label,
    createdAt: new Date().toISOString(),
    node: process.version,
    platform: `${process.platform} ${process.arch}`,
    config: {
      baseUrl: config.baseUrl,
      runs: config.runs,
      cpuThrottle: config.cpuThrottle,
      viewport: config.viewport,
      network: config.network
    },
    routes
  };
}

function printSummary(report) {
  console.log(`\n${report.label} (${report.createdAt})`);
  for (const [name, route] of Object.entries(report.routes)) {
    const s = route.summary;
    const line = [
      `  ${name.padEnd(18)}`,
      `ready ${fmt(s.readyMs)}`,
      `lcp ${fmt(s.lcp)}`,
      `tbt ${fmt(s.tbtMs)}`,
      `cls ${fmt(s.cls, 3)}`,
      s.scroll ? `frame p95 ${fmt(s.scroll.frameP95)}` : "",
      s.scroll ? `dropped ${fmt(s.scroll.droppedPct, 1)}%` : ""
    ]
      .filter(Boolean)
      .join("  ");
    console.log(line);
    if (s.scroll?.incompleteScroll) {
      console.log(`    warning: the scroll pass reached less than half the requested distance on ${name}`);
    }
  }
}

const fmt = (stat, places = 0) => (stat ? stat.median.toFixed(places) : "n/a");

function compareReports(baseline, after, failThreshold) {
  const rows = [];
  let regression = false;

  for (const [routeName, afterRoute] of Object.entries(after.routes)) {
    const beforeRoute = baseline.routes[routeName];
    if (!beforeRoute) continue;
    const before = beforeRoute.summary;
    const now = afterRoute.summary;

    const pairs = Object.keys(now)
      .filter((key) => key !== "scroll" && before[key] && now[key])
      .map((key) => [key, before[key], now[key]]);

    if (now.scroll && before.scroll) {
      for (const key of ["frameP50", "frameP95", "frameMax", "droppedPct"]) {
        if (before.scroll[key] && now.scroll[key]) {
          pairs.push([`scroll.${key}`, before.scroll[key], now.scroll[key]]);
        }
      }
    }

    for (const [metric, beforeStat, afterStat] of pairs) {
      const delta = afterStat.median - beforeStat.median;
      const pct = beforeStat.median ? (delta / beforeStat.median) * 100 : 0;
      const noise = Math.min(50, Math.max(beforeStat.noiseFloorPct || 0, afterStat.noiseFloorPct || 0, 2));
      const threshold = Math.max(2, (noise / 100) * Math.abs(beforeStat.median));
      const verdict =
        Math.abs(delta) <= threshold ? "within noise" : pct < 0 ? "better" : "worse";
      if (verdict === "worse" && failThreshold !== null && pct > failThreshold) regression = true;
      rows.push({
        route: routeName,
        metric,
        before: beforeStat.median,
        after: afterStat.median,
        delta,
        pct,
        noise,
        verdict
      });
    }
  }

  console.log("\n| Route | Metric | Before | After | Delta | % | Verdict |");
  console.log("| --- | --- | ---: | ---: | ---: | ---: | --- |");
  for (const row of rows) {
    console.log(
      `| ${row.route} | ${row.metric} | ${round(row.before, 1)} | ${round(row.after, 1)} | ` +
        `${round(row.delta, 1)} | ${round(row.pct, 1)}% | ${row.verdict} (noise ${round(row.noise, 1)}%) |`
    );
  }

  const kept = rows.filter((row) => row.verdict === "better").length;
  const worse = rows.filter((row) => row.verdict === "worse").length;
  const neutral = rows.filter((row) => row.verdict === "within noise").length;
  console.log(`\n${kept} improved, ${worse} worse, ${neutral} within noise.`);
  console.log("A change counts only when it clears the noise floor and nothing else regresses.");

  return regression;
}

async function main() {
  const args = parseArgs(process.argv.slice(2));

  if (args.compare) {
    const [beforePath, afterPath] = args.compare;
    const before = JSON.parse(await readFile(beforePath, "utf8"));
    const after = JSON.parse(await readFile(afterPath, "utf8"));
    const regression = compareReports(before, after, args.failOnRegression);
    if (regression) process.exit(1);
    return;
  }

  const raw = JSON.parse(await readFile(args.config, "utf8"));
  const config = normalizeConfig(raw);
  const label = args.label || new Date().toISOString().replace(/[:.]/g, "-");

  console.log(`Measuring ${config.routes.length} route(s), ${config.runs} run(s) each.`);
  console.log(
    `Conditions: ${config.cpuThrottle}x CPU, ${config.network.latency}ms latency, ` +
      `${config.network.downloadKbps}kbps down, ${config.viewport.width}x${config.viewport.height}`
  );

  const report = await measure(config, label);
  printSummary(report);

  const outDir = path.resolve(args.outDir || config.outDir);
  await mkdir(outDir, { recursive: true });
  const outFile = path.join(outDir, `${label}.json`);
  await writeFile(outFile, `${JSON.stringify(report, null, 2)}\n`, "utf8");
  console.log(`\nArtifact: ${outFile}`);
  console.log(`Compare:  node scripts/bench-web.mjs --compare ${outFile} <after.json>`);
}

main().catch((error) => {
  console.error(`\nbench-web: ${error.message}`);
  process.exit(2);
});
