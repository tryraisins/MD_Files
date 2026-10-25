#!/usr/bin/env node
"use strict";

// Guards every cross-reference between the catalog, its metadata surfaces and
// the routing dataset. A skill can be renamed or removed without the site,
// profiles or docs being updated, and nothing else catches that: the structure
// audits check files, not whether the ids in prose still exist.
//
// Fails on:
//   - a skill body naming a skill id that does not exist in skills/
//   - presentation.json listing, relating or featuring a missing skill
//   - a presentation task that no task id declares, or a skill task that
//     does not exist
//   - skills.sh.json, profiles.json, llms.txt or the routing evaluations
//     naming a missing skill
//   - a catalog skill that no profile covers
const fs = require("node:fs");
const path = require("node:path");

const ROOT = path.resolve(__dirname, "..");
const failures = [];
const checks = [];

const fail = (message) => failures.push(message);
const pass = (label, detail) => checks.push(`${label}: ${detail}`);

const read = (relative) => fs.readFileSync(path.join(ROOT, relative), "utf8");
const readJson = (relative) => JSON.parse(read(relative));

function frontmatter(text) {
  const match = String(text).replace(/^\uFEFF/, "").match(/^---\r?\n([\s\S]*?)\r?\n---/);
  return match ? match[1] : "";
}

function skillName(folder, text) {
  const name = (frontmatter(text).match(/^name:\s*(.+)$/m) || [])[1];
  return name ? name.trim().replace(/^["']|["']$/g, "") : folder;
}

// 1. The catalog.
const skillsDir = path.join(ROOT, "skills");
if (!fs.existsSync(skillsDir)) {
  console.error("skills/ is missing.");
  process.exit(1);
}

const catalog = new Map();
for (const entry of fs.readdirSync(skillsDir, { withFileTypes: true })) {
  if (!entry.isDirectory()) continue;
  const file = path.join(skillsDir, entry.name, "SKILL.md");
  if (!fs.existsSync(file)) continue;
  const text = fs.readFileSync(file, "utf8");
  const name = skillName(entry.name, text);
  if (name !== entry.name) fail(`${entry.name}/SKILL.md: frontmatter name is "${name}"`);
  catalog.set(name, text);
}
pass("catalog", `${catalog.size} skills`);

// 2. Bodies must not name a skill that does not exist.
const ID = /\byeknal-[a-z0-9-]{3,}\b/g;
let references = 0;
for (const [id, text] of catalog) {
  const body = text.replace(/^---\r?\n[\s\S]*?\r?\n---\r?\n?/, "");
  for (const match of body.matchAll(ID)) {
    references += 1;
    if (!catalog.has(match[0])) {
      const line = body.slice(0, match.index).split(/\r?\n/).length + 1;
      fail(`${id}: body line ${line} names missing skill ${match[0]}`);
    }
  }
}
pass("skill bodies", `${references} skill references resolved`);

// 3. Presentation metadata.
const presentation = readJson("site/presentation.json");
const taskIds = new Set((presentation.tasks || []).map((task) => task.id));
for (const [id, entry] of Object.entries(presentation.skills || {})) {
  if (!catalog.has(id)) fail(`presentation.json: entry for missing skill ${id}`);
  for (const related of entry.related || []) {
    if (!catalog.has(related)) fail(`presentation.json: ${id}.related names missing skill ${related}`);
    if (related === id) fail(`presentation.json: ${id}.related lists itself`);
  }
  for (const task of entry.tasks || []) {
    if (!taskIds.has(task)) fail(`presentation.json: ${id} uses undeclared task ${task}`);
  }
}
for (const featured of presentation.featured || []) {
  const id = typeof featured === "string" ? featured : featured.skill;
  if (id && !catalog.has(id)) fail(`presentation.json: featured names missing skill ${id}`);
}
for (const point of presentation.startingPoints || []) {
  // `task` here is human-readable label text, not a task id.
  if (point.skill && !catalog.has(point.skill)) fail(`presentation.json: startingPoints names missing skill ${point.skill}`);
}
pass("presentation.json", `${Object.keys(presentation.skills || {}).length} entries, ${taskIds.size} tasks`);

// 4. skills.sh groups.
const groups = readJson("skills.sh.json");
for (const group of groups.groupings || []) {
  for (const id of group.skills || []) {
    if (!catalog.has(id)) fail(`skills.sh.json: "${group.title}" names missing skill ${id}`);
  }
}
pass("skills.sh.json", `${(groups.groupings || []).length} groups`);

// 5. Profiles, and full coverage of the catalog.
const profiles = readJson("yeknal-cli/profiles.json");
const covered = new Set();
for (const [pack, spec] of Object.entries(profiles)) {
  for (const short of spec.skills || []) {
    const id = `yeknal-${short}`;
    if (!catalog.has(id)) fail(`profiles.json: "${pack}" names missing skill ${id}`);
    covered.add(id);
  }
}
for (const id of catalog.keys()) {
  if (!covered.has(id)) fail(`profiles.json: no profile covers ${id}`);
}
pass("profiles.json", `${Object.keys(profiles).length} packs, ${covered.size} skills covered`);

// 6. llms.txt.
let listed = 0;
for (const line of read("llms.txt").split(/\r?\n/)) {
  const match = line.match(/^(yeknal-[a-z0-9-]+):/);
  if (!match) continue;
  listed += 1;
  if (!catalog.has(match[1])) fail(`llms.txt: names missing skill ${match[1]}`);
}
pass("llms.txt", `${listed} entries`);

// 7. Routing evaluations.
const evals = readJson("evaluations/skill-routing.json");
const seenCaseIds = new Set();
for (const item of evals.cases || []) {
  if (seenCaseIds.has(item.id)) fail(`skill-routing.json: duplicate case id ${item.id}`);
  seenCaseIds.add(item.id);
  for (const id of [item.primary, ...(item.secondary || []), ...(item.mustNotLead || [])]) {
    if (id && !catalog.has(id)) fail(`skill-routing.json: case ${item.id} names missing skill ${id}`);
  }
}
pass("skill-routing.json", `${(evals.cases || []).length} cases`);

// Report.
for (const line of checks) console.log(`PASS ${line}`);
if (failures.length) {
  console.error(`\nFAIL ${failures.length} cross-reference problem(s):`);
  for (const failure of [...new Set(failures)]) console.error(`  - ${failure}`);
  process.exit(1);
}
console.log(`\nAll ${checks.length} cross-reference checks passed across ${catalog.size} skills.`);
