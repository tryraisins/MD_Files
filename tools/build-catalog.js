"use strict";

// Build only from a committed tree: metadata and content hashes must describe
// exactly the immutable revision used by retrieval, even in a dirty checkout.
const fs = require("fs");
const path = require("path");
const crypto = require("crypto");
const { execFileSync, spawnSync } = require("child_process");

function digest(data) {
  return crypto.createHash("sha256").update(data).digest("hex");
}

function field(text, key) {
  const match = text.match(new RegExp(`^${key}:\\s*(.*)$`, "m"));
  if (!match) return "";
  return match[1].trim().replace(/^(['"])([\s\S]*)\1$/, "$2");
}

function buildCatalog(repo = path.resolve(__dirname, ".."), revision = "HEAD") {
  const git = (...args) => execFileSync("git", args, { cwd: repo, maxBuffer: 128 * 1024 * 1024 });
  const sourceRevision = git("rev-parse", `${revision}^{commit}`).toString().trim();
  const listing = git("ls-tree", "-r", "-z", sourceRevision, "--", "skills").toString().split("\0").filter(Boolean);
  const entries = listing.map((entry) => {
    const [meta, filename] = entry.split("\t");
    const [mode, type, oid] = meta.split(" ");
    if (type !== "blob" || mode === "120000") throw new Error(`Unsupported catalog entry: ${filename}`);
    return { filename, oid };
  }).filter((entry) => /^skills\/[^/]+\/.+/.test(entry.filename));
  const batch = spawnSync("git", ["cat-file", "--batch"], {
    cwd: repo, input: entries.map((entry) => entry.oid).join("\n") + "\n", maxBuffer: 128 * 1024 * 1024,
  });
  if (batch.status !== 0) throw new Error(batch.stderr.toString() || "Could not read committed skill content");
  const grouped = new Map();
  let offset = 0;
  for (const entry of entries) {
    const end = batch.stdout.indexOf(10, offset);
    const size = Number(batch.stdout.subarray(offset, end).toString().split(" ")[2]);
    if (!Number.isSafeInteger(size)) throw new Error("Invalid git object response");
    const content = batch.stdout.subarray(end + 1, end + 1 + size);
    offset = end + size + 2;
    const [, name, ...parts] = entry.filename.split("/");
    const resource = parts.join("/");
    const skill = grouped.get(name) || { name, files: [] };
    skill.files.push({ path: resource, sha256: digest(content), size });
    if (resource === "SKILL.md") skill.text = content.toString("utf8");
    grouped.set(name, skill);
  }
  const version = JSON.parse(git("show", `${sourceRevision}:yeknal-cli/package.json`).toString()).version;
  const skills = [...grouped.values()].filter((skill) => skill.text).sort((a, b) => a.name.localeCompare(b.name, "en")).map((skill) => {
    const frontmatter = skill.text.match(/^---\r?\n([\s\S]*?)\r?\n---/);
    const description = field(frontmatter ? frontmatter[1] : "", "description");
    const headings = [...skill.text.matchAll(/^#{1,3}\s+(.+)$/gm)].map((match) => match[1].replace(/[`*_]/g, ""));
    const keywords = [...new Set((skill.name + " " + headings.join(" ")).toLowerCase().match(/[a-z0-9][a-z0-9+-]{2,}/g) || [])].sort().slice(0, 64);
    const files = skill.files.sort((a, b) => a.path.localeCompare(b.path, "en"));
    return { name: skill.name, description, keywords, version: digest(JSON.stringify(files)), files };
  });
  return { schemaVersion: 1, sourceRevision, version, skills };
}

if (require.main === module) {
  const output = path.resolve(__dirname, "../yeknal-cli/catalog.json");
  if (process.argv.includes("--check")) {
    const saved = fs.readFileSync(output, "utf8");
    const revision = JSON.parse(saved).sourceRevision;
    if (!/^[a-f0-9]{40}$/.test(revision)) throw new Error("Invalid catalog source revision");
    const expected = JSON.stringify(buildCatalog(undefined, revision), null, 2) + "\n";
    if (saved.replaceAll("\r\n", "\n") !== expected) throw new Error("Catalog does not match its immutable source revision; regenerate before release");
    console.log(`Catalog verified at ${revision}`);
  } else {
    if (process.argv.length > 2) throw new Error("Usage: node tools/build-catalog.js [--check]");
    const catalog = buildCatalog();
    fs.writeFileSync(output, JSON.stringify(catalog, null, 2) + "\n");
    console.log(`Catalog: ${catalog.skills.length} skills at ${catalog.sourceRevision}`);
  }
}

module.exports = { buildCatalog };
