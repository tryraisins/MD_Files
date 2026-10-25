#!/usr/bin/env node
"use strict";

// Captures the deterministic evidence a design judge needs: full-page
// screenshots at three widths, the same at reduced motion, and measurements
// that a reviewer should not have to take on trust.
//
// Playwright is required. This script refuses to fabricate evidence when it is
// missing: a run with no screenshots is worse than no run.

import fs from "node:fs";
import path from "node:path";

function parseArgs(argv) {
  const out = {};
  for (let i = 0; i < argv.length; i += 1) {
    const token = argv[i];
    if (!token.startsWith("--")) continue;
    const key = token.slice(2);
    const value = argv[i + 1] && !argv[i + 1].startsWith("--") ? argv[++i] : "true";
    out[key] = value;
  }
  return out;
}

const args = parseArgs(process.argv.slice(2));

if (!args.url || !args.out) {
  console.error(
    "usage: node tools/design-eval/capture.mjs --url <url> --out <run-dir> [--label <arm>] [--timeout <ms>]"
  );
  process.exit(2);
}

const VIEWPORTS = [
  { name: "390", width: 390, height: 844 },
  { name: "768", width: 768, height: 1024 },
  { name: "1440", width: 1440, height: 900 },
];

const REDUCED = ["390", "1440"];

async function loadPlaywright() {
  try {
    return await import("playwright");
  } catch {
    return null;
  }
}

const measurePage = () => {
  const root = document.documentElement;
  const images = Array.from(document.images);

  // Only rendered controls count. Hidden textareas, off-screen inputs and
  // display:none descendants are not in the accessibility tree and must not be
  // reported as unnamed controls.
  const isRendered = (element) => {
    if (element.hasAttribute("hidden")) return false;
    if (element.closest("[hidden]")) return false;
    if (element.getAttribute("aria-hidden") === "true") return false;
    if (element.disabled) return false;
    const style = window.getComputedStyle(element);
    if (style.display === "none" || style.visibility === "hidden") return false;
    if (typeof element.checkVisibility === "function") {
      if (!element.checkVisibility({ checkVisibilityCSS: true, checkOpacity: true })) return false;
    }
    const rect = element.getBoundingClientRect();
    if (rect.width === 0 && rect.height === 0) return false;
    return true;
  };

  const focusables = Array.from(
    document.querySelectorAll(
      'a[href], button, input, select, textarea, [tabindex]:not([tabindex="-1"]), [contenteditable="true"]'
    )
  ).filter(isRendered);

  const unnamedControls = focusables.filter((element) => {
    const text = (element.innerText || "").trim();
    const label = element.getAttribute("aria-label");
    const labelledBy = element.getAttribute("aria-labelledby");
    const title = element.getAttribute("title");
    const alt = element.querySelector("img[alt]");
    const svgTitle = element.querySelector("svg title");
    // A label element associated by `for`, or a wrapping label, is a real name.
    const associatedLabels = element.labels ? element.labels.length : 0;
    const wrappedLabel = element.closest("label") ? 1 : 0;
    return (
      !text &&
      !label &&
      !labelledBy &&
      !title &&
      !alt &&
      !svgTitle &&
      !associatedLabels &&
      !wrappedLabel
    );
  });

  return {
    title: document.title,
    lang: root.getAttribute("lang"),
    scrollWidth: root.scrollWidth,
    innerWidth: window.innerWidth,
    horizontalOverflow: root.scrollWidth > window.innerWidth + 1,
    h1Count: document.querySelectorAll("h1").length,
    headings: Array.from(document.querySelectorAll("h1, h2")).slice(0, 24).map((heading) => ({
      level: heading.tagName.toLowerCase(),
      text: (heading.textContent || "").trim().replace(/\s+/g, " ").slice(0, 80),
    })),
    imageCount: images.length,
    imagesMissingAlt: images.filter((image) => !image.hasAttribute("alt")).length,
    focusableCount: focusables.length,
    unnamedControlCount: unnamedControls.length,
    bodyTextLength: (document.body?.innerText || "").length,
    hasViewportMeta: Boolean(document.querySelector('meta[name="viewport"]')),
    themeColor: document.querySelector('meta[name="theme-color"]')?.getAttribute("content") || null,
    largestContentfulPaint: window.__designEvalLcp || null,
  };
};

async function main() {
  const playwright = await loadPlaywright();
  if (!playwright) {
    console.error(
      "Playwright is not installed. Install it in the project under test:\n  npm i -D playwright && npx playwright install chromium"
    );
    process.exit(2);
  }

  const { chromium } = playwright;
  const runDir = path.resolve(args.out);
  const shotsDir = path.join(runDir, "shots");
  fs.mkdirSync(shotsDir, { recursive: true });

  const timeout = Number(args.timeout || 45000);
  const manifest = {
    url: args.url,
    label: args.label || null,
    capturedAt: new Date().toISOString(),
    node: process.version,
    viewports: VIEWPORTS.map((viewport) => viewport.name),
    console: [],
    shots: [],
    measurements: {},
    notes: [],
  };

  const browser = await chromium.launch();

  const capture = async (viewport, { reduced }) => {
    const context = await browser.newContext({
      viewport: { width: viewport.width, height: viewport.height },
      deviceScaleFactor: 1,
      reducedMotion: reduced ? "reduce" : "no-preference",
    });
    const page = await context.newPage();

    await page.addInitScript(() => {
      window.__designEvalLcp = 0;
      try {
        new PerformanceObserver((list) => {
          for (const entry of list.getEntries()) window.__designEvalLcp = entry.startTime;
        }).observe({ type: "largest-contentful-paint", buffered: true });
      } catch {
        /* older engines: LCP stays null */
      }
    });

    const suffix = reduced ? `${viewport.name}-reduced` : viewport.name;

    page.on("console", (message) => {
      if (message.type() === "error") manifest.console.push({ viewport: suffix, message: message.text() });
    });
    page.on("pageerror", (error) => {
      manifest.console.push({ viewport: suffix, pageerror: String(error) });
    });

    await page.goto(args.url, { waitUntil: "load", timeout });
    await page.waitForLoadState("networkidle", { timeout }).catch(() => {
      manifest.notes.push(`${suffix}: network never went idle; captured after load`);
    });

    const shotPath = path.join(shotsDir, `${suffix}.png`);
    await page.screenshot({ path: shotPath, fullPage: true });
    manifest.shots.push(path.relative(runDir, shotPath).split(path.sep).join("/"));

    const measurements = await page.evaluate(measurePage);
    manifest.measurements[suffix] = measurements;

    await context.close();
  };

  for (const viewport of VIEWPORTS) {
    await capture(viewport, { reduced: false });
  }
  for (const name of REDUCED) {
    const viewport = VIEWPORTS.find((entry) => entry.name === name);
    await capture(viewport, { reduced: true });
  }

  await browser.close();

  manifest.horizontalOverflow = Object.entries(manifest.measurements)
    .filter(([, value]) => value.horizontalOverflow)
    .map(([key]) => key);
  manifest.consoleErrorCount = manifest.console.length;

  const manifestPath = path.join(runDir, "manifest.json");
  fs.writeFileSync(manifestPath, `${JSON.stringify(manifest, null, 2)}\n`);

  console.log(`captured ${manifest.shots.length} screenshots -> ${path.relative(process.cwd(), runDir)}`);
  if (manifest.horizontalOverflow.length) {
    console.log(`horizontal overflow at: ${manifest.horizontalOverflow.join(", ")}`);
  }
  if (manifest.console.length) {
    console.log(`console errors: ${manifest.console.length}`);
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
