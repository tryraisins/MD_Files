"use strict";

/**
 * End-to-end verification for archived-skill retirement.
 *
 * Runs the real CLI entry point against isolated temporary agent roots, so the
 * default sync, the additive project sync, the stale-profile fallback and the
 * setup migration are all proven through their real commands. Requires network
 * access to github.com and raw.githubusercontent.com.
 *
 * Usage: node tools/verify-archived-cleanup.js
 * Artifact: console transcript per scenario; exit code 1 on failure.
 */

const assert = require("node:assert/strict");
const fs = require("node:fs");
const fsp = fs.promises;
const os = require("node:os");
const path = require("node:path");
const { spawnSync } = require("node:child_process");

const CLI = path.resolve(__dirname, "../yeknal-cli/bin/yeknal.js");
const CLI_ROOT = path.resolve(__dirname, "../yeknal-cli");
const ENV_VARS = [
  "YEKNAL_GEMINI_PARENT",
  "YEKNAL_CODEX_PARENT",
  "YEKNAL_CLAUDE_PARENT",
  "YEKNAL_OPENCODE_PARENT",
  "YEKNAL_CURSOR_PARENT",
  "YEKNAL_WINDSURF_PARENT",
  "YEKNAL_COPILOT_PARENT",
  "YEKNAL_GEMINI_CLI_PARENT",
  "YEKNAL_ROO_PARENT",
  "YEKNAL_KIRO_PARENT",
  "YEKNAL_CLINE_PARENT",
  "YEKNAL_OPENHANDS_PARENT",
  "YEKNAL_AMP_PARENT",
  "YEKNAL_AGENTS_PARENT",
  "YEKNAL_T3_PARENT",
];
const BRAINSTORM = "yeknal-brainstorm";

function isolatedEnv(root, active) {
  const env = {
    ...process.env,
    YEKNAL_HOME: path.join(root, "home"),
    YEKNAL_CACHE_DIR: path.join(root, "cache"),
  };
  for (const name of ENV_VARS) env[name] = path.join(root, "absent", name);
  return Object.assign(env, active);
}

function runCli(env, args, cwd = CLI_ROOT) {
  return spawnSync(process.execPath, [CLI, ...args], { cwd, env, encoding: "utf8" });
}

async function seedSkill(folder, name, extra = "") {
  await fsp.mkdir(folder, { recursive: true });
  await fsp.writeFile(
    path.join(folder, "SKILL.md"),
    `---\nname: ${name}\ndescription: Verification fixture.\n---\n${extra}`,
  );
}

async function installed(skillsPath) {
  try {
    return (await fsp.readdir(skillsPath)).filter((name) => name.startsWith("yeknal-")).sort();
  } catch (error) {
    if (error.code === "ENOENT") return [];
    throw error;
  }
}

async function scenarioDefaultSync(root) {
  const kiro = path.join(root, ".kiro");
  const skills = path.join(kiro, "skills");
  await seedSkill(path.join(skills, BRAINSTORM), BRAINSTORM);
  await seedSkill(path.join(skills, "personal-skill"), "personal-skill");

  const result = runCli(isolatedEnv(root, { YEKNAL_KIRO_PARENT: kiro }), ["skills"]);
  assert.equal(result.status, 0, result.stderr || result.stdout);

  const transcript = `${result.stdout}\n${result.stderr}`;
  assert.match(transcript, /archived skill yeknal-brainstorm/);
  assert.ok(fs.existsSync(path.join(skills, "personal-skill")), "personal folder must survive");
  assert.ok(!fs.existsSync(path.join(skills, BRAINSTORM)), "archived folder must be removed");

  const managed = await installed(skills);
  for (const expected of ["yeknal-git", "yeknal-implement", "yeknal-ui-quality-baseline"]) {
    assert.ok(managed.includes(expected), `missing ${expected}: ${managed.join(", ")}`);
  }
  return `installed ${managed.length} managed folders, archived folder pruned, personal folder kept`;
}

async function scenarioProjectAdditive(root) {
  const repo = path.join(root, "repo");
  const skills = path.join(repo, ".agents", "skills");
  await seedSkill(path.join(skills, BRAINSTORM), BRAINSTORM);
  await seedSkill(path.join(skills, "yeknal-git"), "yeknal-git", "local edit\n");
  const init = spawnSync("git", ["init", "-q"], { cwd: repo, encoding: "utf8" });
  assert.equal(init.status, 0, init.stderr);

  const env = isolatedEnv(path.join(root, "isolation"), {});
  const addOnly = runCli(env, ["skills", "--project", "--add", "--skills", "git"], repo);
  assert.equal(addOnly.status, 0, addOnly.stderr || addOnly.stdout);
  assert.ok(fs.existsSync(path.join(skills, BRAINSTORM)), "--add must stay additive");
  assert.equal(
    await fsp.readFile(path.join(skills, "yeknal-git", "SKILL.md"), "utf8"),
    "---\nname: yeknal-git\ndescription: Verification fixture.\n---\nlocal edit\n",
    "--add must not replace an installed skill",
  );

  const pruned = runCli(env, ["skills", "--project", "--add", "--prune-archived", "--skills", "git"], repo);
  assert.equal(pruned.status, 0, pruned.stderr || pruned.stdout);
  assert.match(`${pruned.stdout}\n${pruned.stderr}`, /archived skill yeknal-brainstorm/);
  assert.ok(!fs.existsSync(path.join(skills, BRAINSTORM)), "--prune-archived must remove it");
  return "--add kept the archived folder and local edits; --prune-archived removed only the archived folder";
}

async function scenarioStaleProfile(root) {
  const copy = path.join(root, "cli");
  await fsp.cp(CLI_ROOT, copy, {
    recursive: true,
    filter: (source) => !/[\\/](node_modules|test)([\\/]|$)/.test(source),
  });
  const profilesPath = path.join(copy, "profiles.json");
  const profiles = JSON.parse(await fsp.readFile(profilesPath, "utf8"));
  profiles.core = { ...profiles.core, skills: ["git", "brainstorm"] };
  await fsp.writeFile(profilesPath, JSON.stringify(profiles, null, 2) + "\n");

  const kiro = path.join(root, ".kiro");
  await fsp.mkdir(kiro, { recursive: true });
  const env = isolatedEnv(root, { YEKNAL_KIRO_PARENT: kiro });
  const result = spawnSync(process.execPath, [path.join(copy, "bin", "yeknal.js"), "skills"], {
    cwd: root,
    env,
    encoding: "utf8",
  });
  assert.equal(result.status, 0, result.stderr || result.stdout);
  assert.match(result.stderr, /no longer published: brainstorm/);
  assert.ok((await installed(path.join(kiro, "skills"))).includes("yeknal-git"));

  const typo = runCli(env, ["skills", "--skills", "not-a-skill"]);
  assert.notEqual(typo.status, 0, "an explicitly named missing skill must still fail");
  assert.match(typo.stderr, /Requested skill folder\(s\) not found: not-a-skill/);
  return "a stale profile entry warns and continues; an unknown named skill still fails";
}

async function scenarioSetupMigration(root) {
  const home = path.join(root, "home");
  const kiro = path.join(home, ".kiro");
  const folder = path.join(kiro, "skills", BRAINSTORM);
  await seedSkill(folder, BRAINSTORM);
  await fsp.mkdir(path.join(kiro, "steering"), { recursive: true });

  const env = isolatedEnv(root, { YEKNAL_KIRO_PARENT: kiro });
  const migrated = runCli(env, ["setup", "--agents", "kiro", "--migrate", "--json"], root);
  assert.equal(migrated.status, 0, migrated.stderr || migrated.stdout);
  const report = JSON.parse(migrated.stdout);
  const retired = report.migrated.find((item) => item.name === BRAINSTORM);
  assert.ok(retired, `expected a migration record: ${migrated.stdout}`);
  assert.equal(retired.archived, true);
  assert.ok(!fs.existsSync(folder), "migrated archived folder must leave the discovery root");

  const restored = runCli(env, ["setup", "--restore", "all", "--json"], root);
  assert.equal(restored.status, 0, restored.stderr || restored.stdout);
  assert.ok(fs.existsSync(path.join(folder, "SKILL.md")), "restore must return the archived skill");
  return `setup --migrate retired it with backup ${retired.id}; --restore all returned it`;
}

async function scenarioDefaultSetup(root) {
  const home = path.join(root, "home");
  const kiro = path.join(home, ".kiro");
  const claude = path.join(home, ".claude");
  await seedSkill(path.join(kiro, "skills", BRAINSTORM), BRAINSTORM);
  await seedSkill(path.join(kiro, "skills", "yeknal-git"), "yeknal-git");
  await seedSkill(path.join(home, ".agents", "skills", "yeknal-animation-vocabulary"), "yeknal-animation-vocabulary");
  await fsp.mkdir(path.join(claude, "skills"), { recursive: true });

  const env = isolatedEnv(root, { YEKNAL_KIRO_PARENT: kiro, YEKNAL_CLAUDE_PARENT: claude });
  const result = runCli(env, ["setup", "--json"], root);
  assert.equal(result.status, 0, result.stderr || result.stdout);
  const report = JSON.parse(result.stdout);

  const detected = report.detected.map((agent) => agent.id);
  assert.ok(detected.includes("kiro") && detected.includes("claude"), `detected: ${detected.join(", ")}`);
  assert.ok(report.connected.some((entry) => entry.id === "kiro"), "default setup must connect kiro");
  assert.ok(report.connected.some((entry) => entry.id === "claude"), "default setup must connect claude");

  const retired = report.migrated.filter((item) => item.archived).map((item) => item.name).sort();
  assert.deepEqual(retired, ["yeknal-animation-vocabulary", BRAINSTORM].sort(), `retired: ${retired.join(", ")}`);
  assert.ok(!fs.existsSync(path.join(kiro, "skills", BRAINSTORM)));
  assert.ok(!fs.existsSync(path.join(home, ".agents", "skills", "yeknal-animation-vocabulary")));
  assert.ok(fs.existsSync(path.join(kiro, "skills", "yeknal-git", "SKILL.md")), "catalog skills must stay");

  const restored = runCli(env, ["setup", "--restore", "all", "--json"], root);
  assert.equal(restored.status, 0, restored.stderr || restored.stdout);
  assert.ok(fs.existsSync(path.join(kiro, "skills", BRAINSTORM, "SKILL.md")));
  assert.ok(fs.existsSync(path.join(home, ".agents", "skills", "yeknal-animation-vocabulary", "SKILL.md")));
  return "setup with no agent list connected both detected agents, retired archived leftovers across roots, kept catalog skills, and restored them";
}

async function scenarioKeepArchived(root) {
  const kiro = path.join(root, "home", ".kiro");
  const folder = path.join(kiro, "skills", BRAINSTORM);
  await seedSkill(folder, BRAINSTORM);

  const env = isolatedEnv(root, { YEKNAL_KIRO_PARENT: kiro });
  const result = runCli(env, ["setup", "--keep-archived", "--json"], root);
  assert.equal(result.status, 0, result.stderr || result.stdout);
  const report = JSON.parse(result.stdout);
  assert.equal(report.migrated.filter((item) => item.archived).length, 0);
  assert.ok(fs.existsSync(path.join(folder, "SKILL.md")), "--keep-archived must retain the archived skill");
  return "--keep-archived left the archived folder in place";
}

async function main() {
  const root = await fsp.mkdtemp(path.join(os.tmpdir(), "yeknal-archived-e2e-"));
  const scenarios = [
    ["default sync", scenarioDefaultSync],
    ["project true-add pruning", scenarioProjectAdditive],
    ["stale profile", scenarioStaleProfile],
    ["setup default all agents", scenarioDefaultSetup],
    ["setup keep archived", scenarioKeepArchived],
    ["setup --migrate", scenarioSetupMigration],
  ];
  let failed = 0;
  try {
    for (const [name, scenario] of scenarios) {
      const directory = path.join(root, name.replaceAll(/[^a-z0-9]+/gi, "-"));
      await fsp.mkdir(directory, { recursive: true });
      try {
        const detail = await scenario(directory);
        console.log(`[pass] ${name}: ${detail}`);
      } catch (error) {
        failed += 1;
        console.error(`[fail] ${name}: ${error.message}`);
      }
    }
  } finally {
    if (process.env.YEKNAL_E2E_KEEP) {
      console.log(`Temporary evidence kept at ${root}`);
    } else {
      await fsp.rm(root, { recursive: true, force: true });
    }
  }
  if (failed > 0) {
    throw new Error(`${failed} scenario(s) failed`);
  }
  console.log("Archived-skill cleanup verified end to end.");
}

main().catch((error) => {
  console.error(`\nError: ${error.message}`);
  process.exit(1);
});
