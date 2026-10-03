"use strict";
const fs = require("fs");
const path = require("path");

function splitFrontmatter(raw) {
  const m = raw.match(/^---\r?\n([\s\S]*?)\r?\n---/);
  return { fm: m ? m[1] : "", body: m ? raw.slice(m[0].length) : raw };
}

function norm(s) {
  return s.replace(/\s+/g, " ").trim();
}

function inventoryFromParts({ skillText, files = [] }) {
  const { fm, body } = splitFrontmatter(skillText);

  const fmKeys = [...new Set((fm.match(/^[A-Za-z0-9_-]+:/gm) || []).map((s) => s.replace(/:$/, "")))];

  const headings = [...new Set((body.match(/^#{1,6}\s+.+$/gm) || []).map((h) => norm(h.replace(/^#{1,6}\s+/, ""))))];

  const backticks = [...new Set([...skillText.matchAll(/`([^`\n]+)`/g)].map((m) => norm(m[1])))].filter(Boolean);

  const links = [...new Set([...body.matchAll(/!?\[[^\]]*\]\(([^)]+)\)/g)]
    .map((m) => m[1].trim().split(/\s+/)[0])
    .filter((t) => t && !/^#/.test(t) && !/^[a-z][a-z0-9+.-]*:/i.test(t))
    .map((t) => t.split("#")[0])
    .filter(Boolean))];

  const thresholds = [...new Set([...skillText.matchAll(/\b\d+(?:\.\d+)?\s?(?:ms|s|px|rem|em|%|fps|kb|mb|characters?|lines?|words?|times?)\b/gi)].map((m) => norm(m[0].toLowerCase())))];

  const codeFences = (body.match(/^```[^\n]*$/gm) || []).length;

  const resources = [...new Set(files.map((f) => f.split(path.sep).join("/")))].filter((f) => f && f !== "SKILL.md").sort();

  return { fmKeys, headings, backticks, links, thresholds, codeFences, resources };
}

function inventoryDir(dir) {
  const skillFile = path.join(dir, "SKILL.md");
  const skillText = fs.readFileSync(skillFile, "utf8");
  const files = [];
  (function walk(rel) {
    for (const e of fs.readdirSync(path.join(dir, rel), { withFileTypes: true })) {
      const r = rel ? path.join(rel, e.name) : e.name;
      if (e.isDirectory()) walk(r);
      else files.push(r);
    }
  })("");
  return inventoryFromParts({ skillText, files });
}

module.exports = { inventoryFromParts, inventoryDir, splitFrontmatter, norm };

if (require.main === module) {
  const dir = process.argv[2];
  if (!dir) throw new Error("usage: node tools/skill-inventory.js <skillDir>");
  console.log(JSON.stringify(inventoryDir(dir), null, 2));
}
