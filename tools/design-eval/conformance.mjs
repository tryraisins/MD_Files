#!/usr/bin/env node
"use strict";

// Deterministic rule probes. Each probe answers one question about the built
// page with a number, so a rule can be verified instead of argued about.
// Reports pass / fail / skip; skip means the page does not expose the
// structure the probe needs, which is different from passing.
//
// Exit codes: 0 all required probes pass or skip, 1 any high-severity failure,
// 2 usage or browser error.

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

function parseArgs(argv) {
  const out = {};
  for (let i = 0; i < argv.length; i += 1) {
    const token = argv[i];
    if (!token.startsWith("--")) continue;
    const key = token.slice(2);
    out[key] = argv[i + 1] && !argv[i + 1].startsWith("--") ? argv[++i] : "true";
  }
  return out;
}

const args = parseArgs(process.argv.slice(2));
if (!args.url) {
  console.error("usage: node tools/design-eval/conformance.mjs --url <url> [--probes probes.json] [--out report.md] [--json out.json]");
  process.exit(2);
}

const probesPath =
  args.probes && args.probes !== "true"
    ? path.resolve(args.probes)
    : path.join(path.dirname(fileURLToPath(import.meta.url)), "probes.json");
const config = JSON.parse(fs.readFileSync(probesPath, "utf8").replace(/^\uFEFF/, ""));

async function loadPlaywright() {
  try {
    return await import("playwright");
  } catch {
    return null;
  }
}

// Runs in the page. Everything here must be serialisable and synchronous.
const collect = (navigationConfig) => {
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
    return rect.width !== 0 || rect.height !== 0;
  };

  const mode = (values) => {
    if (!values.length) return null;
    const counts = new Map();
    for (const value of values) counts.set(value, (counts.get(value) || 0) + 1);
    return [...counts.entries()].sort((a, b) => b[1] - a[1] || a[0] - b[0])[0][0];
  };

  let css = "";
  for (const sheet of Array.from(document.styleSheets)) {
    try {
      for (const rule of Array.from(sheet.cssRules)) css += `${rule.cssText}\n`;
    } catch {
      // Cross-origin sheet; unavailable, which the probe reports as a skip.
    }
  }

  const headings = Array.from(document.querySelectorAll("h1, h2, h3, h4, h5, h6")).map((heading) =>
    Number(heading.tagName.slice(1))
  );

  const focusables = Array.from(
    document.querySelectorAll('a[href], button, input, select, textarea, [tabindex]:not([tabindex="-1"]), [contenteditable="true"]')
  ).filter(isRendered);

  const unnamed = focusables.filter((element) => {
    const text = (element.innerText || "").trim();
    return (
      !text &&
      !element.getAttribute("aria-label") &&
      !element.getAttribute("aria-labelledby") &&
      !element.getAttribute("title") &&
      !element.querySelector("img[alt]") &&
      !element.querySelector("svg title") &&
      !(element.labels && element.labels.length) &&
      !element.closest("label")
    );
  });

  const base = {
    h1Count: document.querySelectorAll("h1").length,
    unnamedCount: unnamed.length,
    headings,
    cssLength: css.length,
    css,
    lang: document.documentElement.getAttribute("lang"),
    title: (document.title || "").trim(),
    viewportMeta: Boolean(document.querySelector("meta[name='viewport']")),
  };

  if (!navigationConfig || !navigationConfig.enabled) return { base, nav: null };

  const containerSelector = navigationConfig.container || "nav";
  const container = Array.from(document.querySelectorAll(containerSelector))
    .filter(isRendered)
    .sort((a, b) => b.querySelectorAll("a, button").length - a.querySelectorAll("a, button").length)[0];

  if (!container) return { base, nav: { found: false } };

  const rows = Array.from(container.querySelectorAll("a[href], button")).filter(isRendered);
  if (!rows.length) return { base, nav: { found: false } };

  const styleOf = (element) => window.getComputedStyle(element);
  const round = (value) => Math.round(value * 100) / 100;

  const rowHeights = rows.map((row) => round(row.getBoundingClientRect().height));
  const rowRadii = rows.map((row) => parseFloat(styleOf(row).borderTopLeftRadius) || 0);
  const labelSizes = rows.map((row) => parseFloat(styleOf(row).fontSize) || 0);
  const iconWidths = rows
    .map((row) => row.querySelector("svg, img, i[class*='icon']"))
    .filter(Boolean)
    .map((icon) => round(icon.getBoundingClientRect().width));

  const activeRows = rows.filter((row) => row.hasAttribute("aria-current") || row.getAttribute("aria-current") === "true");

  // Groups: the shallowest descendants of the container that hold at least two rows.
  const groupMap = new Map();
  for (const row of rows) {
    let node = row.parentElement;
    while (node && node !== container) {
      const count = Array.from(node.querySelectorAll("a[href], button")).filter(isRendered).length;
      if (count >= 2) groupMap.set(node, count);
      node = node.parentElement;
    }
  }
  const groups = [...groupMap.keys()].filter((group) => {
    // Keep the shallowest groups only.
    return ![...groupMap.keys()].some((other) => other !== group && group.contains(other) && groupMap.get(other) === groupMap.get(group));
  });
  const groupTops = groups
    .map((group) => ({ node: group, rect: group.getBoundingClientRect() }))
    .sort((a, b) => a.rect.top - b.rect.top);
  const groupGaps = [];
  for (let i = 1; i < groupTops.length; i += 1) {
    const gap = round(groupTops[i].rect.top - groupTops[i - 1].rect.bottom);
    if (gap > 0) groupGaps.push(gap);
  }

  let selectedInset = null;
  if (activeRows.length) {
    const active = activeRows[0];
    const containerStyle = styleOf(container);
    const containerRect = container.getBoundingClientRect();
    const paddingLeft = parseFloat(containerStyle.paddingLeft) || 0;
    selectedInset = round(active.getBoundingClientRect().left - containerRect.left - paddingLeft);
  }

  return {
    base,
    nav: {
      found: true,
      rowCount: rows.length,
      rowHeight: mode(rowHeights.map((value) => Math.round(value))),
      rowRadius: mode(rowRadii.map((value) => Math.round(value))),
      labelFontSize: mode(labelSizes.map((value) => Math.round(value))),
      iconWidth: mode(iconWidths.map((value) => Math.round(value))),
      groupGap: groupGaps.length ? Math.round(mode(groupGaps.map((value) => Math.round(value)))) : null,
      selectedInset,
      activeCount: activeRows.length,
    },
  };
};

const evaluate = (probe, data) => {
  const { base, nav } = data;

  const compare = (actual, expect) => {
    if (expect.equals !== undefined) return actual === expect.equals;
    if (expect.within !== undefined) return typeof actual === "number" && actual >= expect.within[0] && actual <= expect.within[1];
    if (expect.atLeast !== undefined) return typeof actual === "number" && actual >= expect.atLeast;
    if (expect.present !== undefined) return expect.present ? Boolean(actual) : !actual;
    if (expect.exists !== undefined) return Boolean(actual) === expect.exists;
    if (expect.minLength !== undefined) return typeof actual === "string" && actual.length >= expect.minLength;
    return false;
  };

  switch (probe.type) {
    case "count": {
      const actual = base.h1Count;
      return { actual, ok: compare(actual, probe.expect) };
    }
    case "unnamed-controls": {
      const actual = base.unnamedCount;
      return { actual, ok: compare(actual, probe.expect) };
    }
    case "heading-order": {
      let skip = 0;
      for (let i = 1; i < base.headings.length; i += 1) skip = Math.max(skip, base.headings[i] - base.headings[i - 1]);
      return { actual: skip, ok: skip <= (probe.expect.maxSkip ?? 1) };
    }
    case "attr": {
      const actual = probe.attr === "textContent" ? base.title : probe.selector === "html" ? base.lang : null;
      return { actual, ok: compare(actual, probe.expect) };
    }
    case "exists": {
      const actual = probe.selector.includes("viewport") ? base.viewportMeta : null;
      return { actual, ok: compare(actual, probe.expect) };
    }
    case "css-feature": {
      if (!base.cssLength) return { actual: "no CSS readable", ok: false, skip: true, reason: "stylesheet not readable (cross-origin)" };
      const actual = (base.css.match(new RegExp(probe.feature.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "g")) || []).length;
      return { actual, ok: compare(actual, probe.expect) };
    }
    default:
      return { actual: null, ok: false, skip: true, reason: `unknown probe type ${probe.type}` };
  }
};

const main = async () => {
  const playwright = await loadPlaywright();
  if (!playwright) {
    console.error("Playwright is not installed. npm i -D playwright && npx playwright install chromium");
    process.exit(2);
  }

  const { chromium } = playwright;
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  await page.goto(args.url, { waitUntil: "load", timeout: Number(args.timeout || 45000) });
  await page.waitForLoadState("networkidle", { timeout: 15000 }).catch(() => {});
  const data = await page.evaluate(collect, config.navigation || null);
  await browser.close();

  const results = [];

  const describeExpect = (expect) => {
    if (!expect) return "-";
    if (expect.equals !== undefined) return `= ${expect.equals}`;
    if (expect.within) return `${expect.within[0]}-${expect.within[1]}`;
    if (expect.atLeast !== undefined) return `>= ${expect.atLeast}`;
    if (expect.present !== undefined) return expect.present ? "present" : "absent";
    if (expect.exists !== undefined) return expect.exists ? "exists" : "absent";
    if (expect.maxSkip !== undefined) return `skip <= ${expect.maxSkip}`;
    if (expect.minLength !== undefined) return `length >= ${expect.minLength}`;
    return JSON.stringify(expect);
  };

  for (const probe of config.structural || []) {
    results.push({
      id: probe.id,
      description: probe.description,
      severity: probe.severity || "medium",
      expected: describeExpect(probe.expect),
      ...evaluate(probe, data),
    });
  }

  if (data.nav && !data.nav.found) {
    results.push({
      id: "navigation",
      description: "Primary navigation found",
      severity: "low",
      actual: "no nav landmark",
      ok: false,
      skip: true,
      reason: "no nav container on the page",
    });
  } else if (data.nav) {
    for (const rule of config.navigation?.rules || []) {
      const actual = data.nav[rule.measure];
      if (actual === null || actual === undefined) {
        results.push({ id: rule.id, description: rule.why, severity: rule.severity, actual: "not measurable", ok: false, skip: true, reason: "structure not present" });
        continue;
      }
      results.push({
        id: rule.id,
        description: rule.why,
        severity: rule.severity,
        actual,
        expected:
          rule.expect.equals !== undefined
            ? `= ${rule.expect.equals}`
            : rule.expect.within
              ? `${rule.expect.within[0]}-${rule.expect.within[1]}`
              : JSON.stringify(rule.expect),
        ok: rule.expect.equals !== undefined ? actual === rule.expect.equals : actual >= rule.expect.within[0] && actual <= rule.expect.within[1],
      });
    }
  }

  const failures = results.filter((r) => !r.ok && !r.skip);
  const skipped = results.filter((r) => r.skip);
  const passed = results.filter((r) => r.ok);

  const lines = [];
  lines.push("# Conformance report");
  lines.push("");
  lines.push(`- URL: ${args.url}`);
  lines.push(`- Probes: ${results.length} (${passed.length} pass, ${failures.length} fail, ${skipped.length} skip)`);
  lines.push("");
  lines.push("| Probe | Severity | Expected | Actual | Result |");
  lines.push("| --- | --- | --- | --- | --- |");
  for (const result of results) {
    const verdict = result.skip ? `skip (${result.reason})` : result.ok ? "pass" : "**fail**";
    lines.push(`| ${result.id} | ${result.severity} | ${result.expected ?? "-"} | ${result.actual ?? "-"} | ${verdict} |`);
  }
  lines.push("");

  const report = lines.join("\n");

  if (args.out && args.out !== "true") {
    const outPath = path.resolve(args.out);
    fs.mkdirSync(path.dirname(outPath), { recursive: true });
    fs.writeFileSync(outPath, `${report}\n`);
  }
  if (args.json && args.json !== "true") {
    fs.writeFileSync(path.resolve(args.json), `${JSON.stringify({ url: args.url, results, nav: data.nav }, null, 2)}\n`);
  }

  console.log(report);
  const highFailures = failures.filter((f) => f.severity === "high");
  process.exit(highFailures.length ? 1 : 0);
};

main().catch((error) => {
  console.error(error);
  process.exit(2);
});
