"use strict";
const fs = require("fs");
const path = require("path");
const { inventoryDir } = require("./skill-inventory.js");

function findRepoRoot(start) {
  let dir = start;
  for (;;) {
    if (fs.existsSync(path.join(dir, ".git"))) return dir;
    const parent = path.dirname(dir);
    if (parent === dir) throw new Error("could not find repository root (.git)");
    dir = parent;
  }
}

const repo = findRepoRoot(__dirname);
const skillsRoot = path.join(repo, "skills");
const parityRoot = path.join(repo, "rewrite-parity");
const baselineRoot = path.join(parityRoot, "baselines");

const CATEGORIES = ["fmKeys", "headings", "backticks", "links", "thresholds", "resources"];

// Which categories gate the rewrite. Renamed headings are reported but do not
// fail (they are labels); capability signals do. Backticked tokens treat
// "x" and "yeknal-x" as equivalent because the rewrite normalizes sibling refs.
const SEVERITY = { fmKeys: "error", headings: "advisory", backticks: "error", links: "error", thresholds: "error", resources: "error" };
function normItem(cat, x) {
  return cat === "backticks" ? x.replace(/^yeknal-/, "") : x;
}

function skillDirs() {
  return fs.readdirSync(skillsRoot)
    .filter((n) => fs.existsSync(path.join(skillsRoot, n, "SKILL.md")))
    .sort();
}

function capture(names) {
  fs.mkdirSync(baselineRoot, { recursive: true });
  let count = 0;
  for (const name of names) {
    const inv = inventoryDir(path.join(skillsRoot, name));
    fs.writeFileSync(path.join(baselineRoot, `${name}.json`), JSON.stringify(inv, null, 2) + "\n");
    count += 1;
  }
  console.log(`captured ${count} baseline(s) in rewrite-parity/baselines/`);
}

function loadAllow(name) {
  const p = path.join(parityRoot, `${name}.allow.json`);
  if (!fs.existsSync(p)) return {};
  return JSON.parse(fs.readFileSync(p, "utf8"));
}

function check(name) {
  const baselinePath = path.join(baselineRoot, `${name}.json`);
  if (!fs.existsSync(baselinePath)) {
    console.error(`no baseline for ${name}; run: node tools/parity.js capture`);
    process.exitCode = 1;
    return;
  }
  const base = JSON.parse(fs.readFileSync(baselinePath, "utf8"));
  const cur = inventoryDir(path.join(skillsRoot, name));
  const allow = loadAllow(name);

  const report = [];
  let missingTotal = 0;
  report.push(`# Parity Report: ${name}`, "");
  report.push(`- Gate: error categories = fmKeys, backticks, links, thresholds, resources; headings are advisory.`, "");

  for (const cat of CATEGORIES) {
    const allowed = new Set((allow[cat] || []).map((x) => normItem(cat, x)));
    const baseSet = new Set((base[cat] || []).map((x) => normItem(cat, x)));
    const curSet = new Set((cur[cat] || []).map((x) => normItem(cat, x)));
    const missing = [...baseSet].filter((x) => !curSet.has(x) && !allowed.has(x)).sort();
    const added = [...curSet].filter((x) => !baseSet.has(x)).sort();
    const severity = SEVERITY[cat];
    if (severity === "error") missingTotal += missing.length;
    report.push(`## ${cat} (${severity})`);
    report.push(`- baseline ${baseSet.size}, current ${curSet.size}, missing ${missing.length}, added ${added.length}`);
    if (missing.length) {
      report.push(`- MISSING${severity === "error" ? " (capability regression)" : " (advisory)"}:`);
      for (const m of missing) report.push(`  - ${m}`);
    }
    if (added.length && added.length <= 40) {
      report.push("- added:");
      for (const a of added) report.push(`  - ${a}`);
    }
    report.push("");
  }

  report.push(missingTotal === 0 ? "Result: PASS (no capability items missing)." : `Result: FAIL (${missingTotal} missing item(s)).`);
  fs.mkdirSync(parityRoot, { recursive: true });
  const reportPath = path.join(parityRoot, `${name}.md`);
  fs.writeFileSync(reportPath, report.join("\n") + "\n");
  console.log(`${name}: ${missingTotal === 0 ? "PASS" : "FAIL (" + missingTotal + ")"} -> rewrite-parity/${name}.md`);
  if (missingTotal > 0) process.exitCode = 1;
}

const [cmd, ...rest] = process.argv.slice(2);
if (cmd === "capture") {
  const names = rest.length ? rest : skillDirs();
  capture(names);
} else if (cmd === "check") {
  if (!rest.length) throw new Error("usage: node tools/parity.js check <skillDirName...>");
  for (const n of rest) check(n);
} else if (cmd === "check-all") {
  for (const n of skillDirs()) {
    if (fs.existsSync(path.join(baselineRoot, `${n}.json`))) check(n);
  }
} else {
  throw new Error("usage: node tools/parity.js <capture|check|check-all> [names...]");
}
