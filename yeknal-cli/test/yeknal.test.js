"use strict";

const assert = require("node:assert/strict");
const fs = require("node:fs");
const fsp = fs.promises;
const os = require("node:os");
const path = require("node:path");
const { spawnSync } = require("node:child_process");
const test = require("node:test");

const yeknal = require("../bin/yeknal.js");

async function withTempDir(run) {
  const directory = await fsp.mkdtemp(path.join(os.tmpdir(), "yeknal-test-"));
  try {
    return await run(directory);
  } finally {
    await fsp.rm(directory, { recursive: true, force: true });
  }
}

test("discovers only top-level skill folders and excludes SEO", () => {
  const tree = [
    { type: "tree", path: "alpha" },
    { type: "blob", path: "alpha/SKILL.md" },
    { type: "blob", path: "alpha/references/details.md" },
    { type: "tree", path: "notes" },
    { type: "blob", path: "notes/README.md" },
    { type: "tree", path: "SEO" },
    { type: "blob", path: "SEO/SKILL.md" },
  ];

  assert.deepEqual(yeknal.discoverSkillFolders(tree), ["alpha"]);
  const files = yeknal.listFilesForFolder(tree, "alpha");
  assert.deepEqual(new Set(files), new Set([
    "alpha/SKILL.md",
    "alpha/references/details.md",
  ]));
  assert.deepEqual(files, [...files].sort((a, b) => a.localeCompare(b)));
  assert.equal(yeknal.getManagedSkillFolderName("alpha"), "yeknal-alpha");
  assert.equal(yeknal.getManagedSkillFolderName("yeknal-alpha"), "yeknal-alpha");
});

test("discovers and copies a staged local skill tree", async () => {
  await withTempDir(async (directory) => {
    const source = path.join(directory, "source");
    const target = path.join(directory, "target");
    await fsp.mkdir(path.join(source, "alpha", "references"), { recursive: true });
    await fsp.mkdir(path.join(source, "not-a-skill"), { recursive: true });
    await fsp.mkdir(path.join(source, "SEO"), { recursive: true });
    await fsp.writeFile(path.join(source, "alpha", "SKILL.md"), "---\nname: alpha\ndescription: Use for tests.\n---\n");
    await fsp.writeFile(path.join(source, "alpha", "references", "details.md"), "details\n");
    await fsp.writeFile(path.join(source, "SEO", "SKILL.md"), "ignored\n");

    assert.deepEqual(await yeknal.discoverLocalSkillFolders(source), ["alpha"]);
    await yeknal.copyDirRecursive(path.join(source, "alpha"), target);
    assert.equal(await fsp.readFile(path.join(target, "references", "details.md"), "utf8"), "details\n");
  });
});

test("discovers Codex system skills without treating unrelated folders as skills", async () => {
  await withTempDir(async (directory) => {
    await fsp.mkdir(path.join(directory, ".system", "imagegen"), { recursive: true });
    await fsp.mkdir(path.join(directory, ".system", "not-a-skill"), { recursive: true });
    await fsp.writeFile(path.join(directory, ".system", "imagegen", "SKILL.md"), "system\n");
    await fsp.writeFile(path.join(directory, ".system", "not-a-skill", "README.md"), "notes\n");

    assert.deepEqual([...await yeknal.discoverSystemSkillNames(directory)], ["imagegen"]);
  });
});

test("removes stale managed folders but preserves expected and personal folders", async () => {
  await withTempDir(async (directory) => {
    for (const folder of ["yeknal-current", "yeknal-stale", "personal-skill"]) {
      await fsp.mkdir(path.join(directory, folder), { recursive: true });
      await fsp.writeFile(path.join(directory, folder, "marker.txt"), folder);
    }

    const removed = await yeknal.removeStaleManagedSkillFolders(
      directory,
      new Set(["yeknal-current"]),
    );

    assert.deepEqual(removed, ["yeknal-stale"]);
    assert.equal(fs.existsSync(path.join(directory, "yeknal-current")), true);
    assert.equal(fs.existsSync(path.join(directory, "personal-skill")), true);
    assert.equal(fs.existsSync(path.join(directory, "yeknal-stale")), false);
  });
});

test("uses git fallback only for GitHub API rate limits", () => {
  const coded = new Error("rate limited");
  coded.code = "GITHUB_RATE_LIMIT";
  assert.equal(yeknal.shouldUseGitCloneFallback(coded), true);
  assert.equal(
    yeknal.shouldUseGitCloneFallback(new Error("GitHub API rate limit exceeded.")),
    true,
  );
  assert.equal(yeknal.shouldUseGitCloneFallback(new Error("network timeout")), false);
});

test("an interrupted download leaves no destination file", async () => {
  await withTempDir(async (directory) => {
    const destination = path.join(directory, "skill", "SKILL.md");
    await assert.rejects(
      yeknal.downloadUrlToFile("https://example.invalid/SKILL.md", destination, async () => {
        throw new Error("response aborted");
      }),
      /response aborted/,
    );
    assert.equal(fs.existsSync(destination), false);
  });
});

test("a successful download writes the complete response body", async () => {
  await withTempDir(async (directory) => {
    const destination = path.join(directory, "skill", "SKILL.md");
    await yeknal.downloadUrlToFile("https://example.invalid/SKILL.md", destination, async () => ({
      statusCode: 200,
      body: Buffer.from("complete body\n"),
    }));
    assert.equal(await fsp.readFile(destination, "utf8"), "complete body\n");
  });
});

test("security reports expose stable rule IDs as text, JSON, and SARIF", () => {
  const check = yeknal.checkResult(
    "Strong password hashing",
    "legacy reference",
    5,
    0,
    "fail",
    "Weak password storage detected.",
    [{ file: "src/auth.js", line: 12, message: "Uses a fast hash." }],
  );
  const results = {
    categories: [{ name: "Authentication", checks: [check] }],
    totalPoints: 5,
    totalEarned: 0,
    applicablePoints: 5,
    percentage: 0,
    totalIssues: 1,
    totalWarnings: 0,
    projectDir: "/project",
    timestamp: "2026-09-07T00:00:00.000Z",
    filesScanned: 1,
  };

  assert.equal(check.id, "AUTH-002");
  assert.match(yeknal.generateSecurityLog(results), /\[AUTH-002\] Strong password hashing/);

  const json = JSON.parse(yeknal.generateSecurityJson(results));
  assert.equal(json.schemaVersion, "1.0.0");
  assert.equal(json.scan.categories[0].checks[0].id, "AUTH-002");

  const sarif = JSON.parse(yeknal.generateSecuritySarif(results));
  assert.equal(sarif.version, "2.1.0");
  assert.equal(sarif.runs[0].results[0].ruleId, "AUTH-002");
  assert.equal(sarif.runs[0].results[0].locations[0].physicalLocation.region.startLine, 12);
});

test("every security rule links to a current Security-Master heading", () => {
  const masterPath = path.join(__dirname, "..", "..", "application-security", "Security-Master.md");
  const headings = new Set(
    fs.readFileSync(masterPath, "utf8")
      .split(/\r?\n/)
      .filter((line) => /^#{1,6} /.test(line))
      .map((line) => `#${line.replace(/^#{1,6} /, "").toLowerCase().replace(/[^a-z0-9 -]/g, "").replace(/\s+/g, "-")}`),
  );

  for (const [name, rule] of Object.entries(yeknal.SECURITY_RULES)) {
    assert.match(rule.id, /^[A-Z]+-\d{3}$/i, name);
    assert.equal(headings.has(rule.reference), true, `${name}: ${rule.reference}`);
  }
});

test("CLI help remains executable", () => {
  const result = spawnSync(process.execPath, [path.join(__dirname, "..", "bin", "yeknal.js"), "--help"], {
    encoding: "utf8",
  });
  assert.equal(result.status, 0, result.stderr);
  assert.match(result.stdout, /npx yeknal security/);
  assert.match(result.stdout, /npx yeknal skills/);
});
