#!/usr/bin/env node
"use strict";

// Turns a blind judgement plus a capture manifest into a scorecard.
// Keeps conformance (binary, deterministic) separate from quality (scored,
// argued). Never merges them into a single number.

import fs from "node:fs";
import path from "node:path";

const WEIGHTS = {
  visual: 0.3,
  usability: 0.25,
  craft: 0.2,
  content: 0.15,
  motion: 0.1,
};

const LABELS = {
  visual: "Visual design",
  usability: "Usability",
  craft: "Craft",
  content: "Content",
  motion: "Motion",
};

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

if (!args.judge || !args.out) {
  console.error(
    "usage: node tools/design-eval/score.mjs --judge <judgement.json> [--manifest <manifest.json>] --out <scorecard.md>"
  );
  process.exit(2);
}

const readJson = (file) => JSON.parse(fs.readFileSync(file, "utf8").replace(/^\uFEFF/, ""));

const judgement = readJson(path.resolve(args.judge));
const manifest = args.manifest && args.manifest !== "true" ? readJson(path.resolve(args.manifest)) : null;

if (!judgement.scores || !judgement.verdict) {
  console.error("judgement is missing `scores` or `verdict`; check the judge JSON shape in judge-prompt.md");
  process.exit(2);
}

const scored = [];
let weightedSum = 0;
let weightTotal = 0;

for (const [key, weight] of Object.entries(WEIGHTS)) {
  const entry = judgement.scores[key];
  if (!entry || entry.score === null || entry.score === undefined) {
    scored.push({ key, weight, score: null, anchor: entry?.anchor || "not judged" });
    continue;
  }
  const score = Number(entry.score);
  if (!Number.isFinite(score) || score < 1 || score > 5) {
    console.error(`scores.${key}.score must be 1-5 or null, received ${JSON.stringify(entry.score)}`);
    process.exit(2);
  }
  scored.push({ key, weight, score, anchor: entry.anchor || "" });
  weightedSum += score * weight;
  weightTotal += weight;
}

const weighted = weightTotal > 0 ? weightedSum / weightTotal : null;

const gate = [];
if (manifest) {
  gate.push({
    check: "Horizontal overflow",
    result: manifest.horizontalOverflow?.length ? `FAIL (${manifest.horizontalOverflow.join(", ")})` : "pass",
  });
  gate.push({
    check: "Console errors",
    result: manifest.consoleErrorCount ? `FAIL (${manifest.consoleErrorCount})` : "pass",
  });
}
if (judgement.gate) {
  const g = judgement.gate;
  const describe = (value) =>
    value === false ? "pass" : value === null || value === undefined ? "not verified" : `FAIL (${JSON.stringify(value)})`;
  gate.push({ check: "Fabricated content", result: describe(g.fabricatedContent) });
  gate.push({ check: "Required state reachable", result: describe(g.missingRequiredState) });
  gate.push({
    check: "Keyboard primary action",
    result: g.keyboardPrimaryAction === "verified" ? "pass" : g.keyboardPrimaryAction === "failed" ? "FAIL" : "not verified",
  });
}

const gateFailed = gate.some((entry) => String(entry.result).startsWith("FAIL")) || judgement.verdict === "fail";

const blockingFindings = (judgement.findings || []).filter((finding) => finding.severity === "blocking");
const gateFailures = gate.filter((entry) => String(entry.result).startsWith("FAIL"));

const lines = [];
lines.push("# Design eval scorecard");
lines.push("");
if (manifest?.url) lines.push(`- **URL:** ${manifest.url}`);
if (manifest?.label) lines.push(`- **Arm:** ${manifest.label}`);
if (manifest?.capturedAt) lines.push(`- **Captured:** ${manifest.capturedAt}`);
lines.push(`- **Verdict:** ${gateFailed ? "**FAIL**" : "**PASS**"}`);
lines.push(`- **Weighted quality:** ${weighted === null ? "not scored" : weighted.toFixed(2)} / 5`);
lines.push("");
lines.push("## Conformance gate");
lines.push("");
lines.push("| Check | Result |");
lines.push("| --- | --- |");
for (const entry of gate) lines.push(`| ${entry.check} | ${entry.result} |`);
lines.push("");
if (gateFailed && gateFailures.length === 0) {
  lines.push(
    `Failed on ${blockingFindings.length} blocking finding${blockingFindings.length === 1 ? "" : "s"}, which the gate fields above do not encode. The findings table below is the reason.`
  );
  lines.push("");
}
lines.push("## Quality");
lines.push("");
lines.push("| Dimension | Score | Weight | Anchor |");
lines.push("| --- | --- | --- | --- |");
for (const entry of scored) {
  const weight = `${Math.round(entry.weight * 100)}%`;
  lines.push(
    `| ${LABELS[entry.key]} | ${entry.score === null ? "n/a" : `${entry.score}/5`} | ${weight} | ${entry.anchor.replace(/\|/g, "\\|")} |`
  );
}
lines.push("");
lines.push(
  weighted === null
    ? "No dimension was scored; the weighted total is undefined."
    : `Weighted over scored dimensions only (${Math.round(weightTotal * 100)}% of the rubric). Unscored dimensions are excluded rather than counted as zero.`
);
lines.push("");

if (judgement.inferredJob) {
  lines.push("## Inferred job");
  lines.push("");
  lines.push(judgement.inferredJob);
  lines.push("");
}

if (Array.isArray(judgement.findings) && judgement.findings.length) {
  lines.push("## Findings");
  lines.push("");
  lines.push("| Severity | What | Where | Consequence | Fix |");
  lines.push("| --- | --- | --- | --- | --- |");
  const order = { blocking: 0, high: 1, medium: 2, low: 3 };
  const findings = [...judgement.findings].sort(
    (a, b) => (order[a.severity] ?? 9) - (order[b.severity] ?? 9)
  );
  for (const finding of findings) {
    lines.push(
      `| ${finding.severity} | ${finding.what} | ${finding.where} | ${finding.consequence} | ${finding.fix} |`
    );
  }
  lines.push("");
}

if (judgement.strength) {
  lines.push("## Strength");
  lines.push("");
  lines.push(judgement.strength);
  lines.push("");
}

if (Array.isArray(judgement.unverifiable) && judgement.unverifiable.length) {
  lines.push("## Not verified");
  lines.push("");
  for (const item of judgement.unverifiable) lines.push(`- ${item}`);
  lines.push("");
}

if (manifest?.shots?.length) {
  lines.push("## Screenshots");
  lines.push("");
  for (const shot of manifest.shots) lines.push(`- \`${shot}\``);
  lines.push("");
}

if (manifest?.notes?.length) {
  lines.push("## Capture notes");
  lines.push("");
  for (const note of manifest.notes) lines.push(`- ${note}`);
  lines.push("");
}

const outPath = path.resolve(args.out);
fs.mkdirSync(path.dirname(outPath), { recursive: true });
fs.writeFileSync(outPath, `${lines.join("\n")}\n`);

console.log(`${gateFailed ? "FAIL" : "PASS"} | weighted ${weighted === null ? "n/a" : weighted.toFixed(2)}/5 -> ${path.relative(process.cwd(), outPath)}`);
process.exit(gateFailed ? 1 : 0);
