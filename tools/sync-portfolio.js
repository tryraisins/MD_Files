"use strict";

// Publishes a validated snapshot of this catalog into the portfolio. Everything
// is read from committed Git objects so the snapshot always describes a
// published revision; see tools/portfolio-sync-failure-modes.md.
const fs = require("fs");
const path = require("path");
const crypto = require("crypto");
const { execFileSync, spawnSync } = require("child_process");
const { buildCatalog } = require("./build-catalog");

const REPOSITORY = "tryraisins/MD_Files";
const SNAPSHOT_PATH = "src/data/skills-catalog.json";
const PREFIX = "yeknal-";
const USAGE = "Usage: node tools/sync-portfolio.js (--validate | --portfolio <dir> [--check]) [--ref <commit>] [--no-fetch] [--remote <name>]";

function parseArgs(argv) {
  const options = { ref: "HEAD", fetch: true, remote: "origin", check: false, validate: false, portfolio: null };
  for (let index = 0; index < argv.length; index += 1) {
    const arg = argv[index];
    const value = () => {
      const next = argv[index + 1];
      if (!next || next.startsWith("--")) throw new Error(`${arg} requires a value.\n${USAGE}`);
      index += 1;
      return next;
    };
    if (arg === "--portfolio") options.portfolio = path.resolve(value());
    else if (arg === "--ref") options.ref = value();
    else if (arg === "--remote") options.remote = value();
    else if (arg === "--check") options.check = true;
    else if (arg === "--validate") options.validate = true;
    else if (arg === "--no-fetch") options.fetch = false;
    else throw new Error(`Unknown option ${arg}.\n${USAGE}`);
  }
  if (options.validate === Boolean(options.portfolio)) throw new Error(USAGE);
  if (options.check && !options.portfolio) throw new Error(USAGE);
  return options;
}

function createGit(repo) {
  const git = (...args) => execFileSync("git", args, { cwd: repo, maxBuffer: 128 * 1024 * 1024 }).toString();
  git.ok = (...args) => spawnSync("git", args, { cwd: repo }).status === 0;
  git.show = (revision, file) => git("show", `${revision}:${file}`);
  return git;
}

function frontmatter(text) {
  const match = text.match(/^---\r?\n([\s\S]*?)\r?\n---/);
  const block = match ? match[1] : "";
  const field = (key) => {
    const found = block.match(new RegExp(`^\\s*${key}:\\s*(.*)$`, "m"));
    return found ? found[1].trim().replace(/^(['"])([\s\S]*)\1$/, "$2") : "";
  };
  return { internal: field("internal") === "true", license: field("license"), source: field("source") };
}

function titleFromSlug(slug) {
  return slug.split("-").map((word) => word.charAt(0).toUpperCase() + word.slice(1)).join(" ");
}

function firstSentence(text) {
  const match = text.match(/^(.+?[.!?])(\s|$)/);
  return match ? match[1] : text;
}

// Pure validation and assembly so the same rules run in CI (--validate) and
// before writing the portfolio snapshot.
function assemble({ catalog, presentation, skillMeta, sourceRevision, catalogCommit, cliVersion }) {
  const errors = [];
  const warnings = [];
  const names = new Set(catalog.skills.map((skill) => skill.name));
  const taskIds = new Set((presentation.tasks || []).map((task) => task.id));
  const entries = presentation.skills || {};
  const slugOf = (name) => name.slice(PREFIX.length);
  const requireSkill = (name, where) => {
    if (!names.has(name)) errors.push(`${where} references unknown skill ${name}`);
  };

  if (presentation.schemaVersion !== 1) errors.push("site/presentation.json must have schemaVersion 1");
  if (!taskIds.size) errors.push("At least one task is required");
  for (const name of Object.keys(entries)) {
    if (!names.has(name)) errors.push(`Presentation entry ${name} has no matching skill; remove or rename it`);
  }
  for (const name of presentation.featured || []) requireSkill(name, "featured");
  for (const point of presentation.startingPoints || []) {
    requireSkill(point.skill, `Starting point "${point.task}"`);
    if (!point.task) errors.push(`Starting point for ${point.skill} needs task text`);
  }

  const slugs = new Map();
  const redirects = [];
  const skills = catalog.skills.map((skill) => {
    if (!skill.name.startsWith(PREFIX)) errors.push(`${skill.name} does not use the ${PREFIX} prefix`);
    const slug = slugOf(skill.name);
    if (slugs.has(slug)) errors.push(`Slug ${slug} is used by ${slugs.get(slug)} and ${skill.name}`);
    slugs.set(slug, skill.name);
    const entry = entries[skill.name];
    const meta = skillMeta[skill.name];
    if (!entry) warnings.push(`${skill.name} has no presentation entry; publishing it with defaults`);
    const view = entry || {};
    const where = `Presentation for ${skill.name}`;
    for (const key of ["title", "purpose"]) {
      if (entry && (typeof view[key] !== "string" || !view[key].trim())) errors.push(`${where} needs ${key}`);
    }
    for (const task of view.tasks || []) if (!taskIds.has(task)) errors.push(`${where} uses unknown task ${task}`);
    for (const related of view.related || []) {
      requireSkill(related, where);
      if (related === skill.name) errors.push(`${where} lists itself as related`);
    }
    if (entry && (!Array.isArray(view.whenToUse) || !view.whenToUse.length)) errors.push(`${where} needs whenToUse`);
    if (entry && (!view.example || !view.example.ask || !view.example.outcome)) errors.push(`${where} needs example.ask and example.outcome`);
    const notices = skill.files.filter((file) => /^(LICEN[CS]E|NOTICE)/i.test(path.posix.basename(file.path)));
    if (notices.length && !(view.attribution && view.attribution.credit)) {
      errors.push(`${skill.name} bundles ${notices.map((file) => file.path).join(", ")} but has no attribution`);
    }
    for (const previous of view.previousNames || []) {
      if (names.has(previous)) errors.push(`${where} lists previous name ${previous}, which is still a current skill`);
      redirects.push({ from: slugOf(previous), to: slug });
    }
    const attribution = view.attribution || {};
    return {
      name: skill.name,
      slug,
      title: view.title || titleFromSlug(slug),
      purpose: view.purpose || firstSentence(skill.description),
      description: skill.description,
      tasks: view.tasks || [],
      featuredRank: (presentation.featured || []).indexOf(skill.name),
      compatibility: Boolean(view.compatibility),
      internal: Boolean(meta && meta.internal),
      whenToUse: view.whenToUse || [],
      avoid: view.avoid || null,
      requirements: view.requirements || null,
      example: view.example || null,
      attribution: {
        credit: attribution.credit || "Written for this catalog.",
        license: attribution.license || null,
        sourceUrl: attribution.sourceUrl || null,
      },
      related: (view.related || []).map(slugOf),
      version: skill.version,
      fileCount: skill.files.length,
      totalBytes: skill.files.reduce((sum, file) => sum + file.size, 0),
      files: skill.files,
    };
  });
  for (const redirect of redirects) {
    if (slugs.has(redirect.from)) errors.push(`Redirect from ${redirect.from} collides with a current skill`);
  }
  if (new Set(redirects.map((redirect) => redirect.from)).size !== redirects.length) errors.push("Duplicate previous names");

  skills.sort((a, b) => {
    const rank = (skill) => (skill.featuredRank < 0 ? Infinity : skill.featuredRank);
    return rank(a) - rank(b) || Number(a.compatibility) - Number(b.compatibility) || a.title.localeCompare(b.title, "en");
  });
  const tasks = presentation.tasks.map((task) => ({ ...task, count: skills.filter((skill) => skill.tasks.includes(task.id)).length }));
  const snapshot = {
    schemaVersion: 1,
    repository: REPOSITORY,
    sourceRevision,
    catalogCommit,
    cliVersion,
    counts: { skills: skills.length, internal: skills.filter((skill) => skill.internal).length },
    tasks,
    startingPoints: (presentation.startingPoints || []).map((point) => ({ task: point.task, skill: slugOf(point.skill) })),
    redirects,
    skills,
  };
  snapshot.snapshotHash = crypto.createHash("sha256").update(JSON.stringify(snapshot)).digest("hex");
  return { snapshot, errors, warnings };
}

function loadInputs(repo, options) {
  const git = createGit(repo);
  const ref = git("rev-parse", `${options.ref}^{commit}`).trim();
  // --validate checks the working tree, so it also works before committing.
  const read = options.validate
    ? (file) => fs.readFileSync(path.join(repo, file), "utf8")
    : (file) => git.show(ref, file);
  const catalog = JSON.parse(read("yeknal-cli/catalog.json"));
  const presentation = JSON.parse(read("site/presentation.json"));
  const cliVersion = JSON.parse(read("yeknal-cli/package.json")).version;
  const { sourceRevision } = catalog;
  const problems = [];

  if (options.ref === "HEAD" && !options.validate) {
    const dirty = git("status", "--porcelain", "--", "skills", "site", "yeknal-cli/catalog.json").trim();
    if (dirty) problems.push(`Commit these changes first; the sync reads committed files only:\n${dirty}`);
  }
  if (!git.ok("cat-file", "-e", `${sourceRevision}^{commit}`)) {
    problems.push(`Catalog source revision ${sourceRevision} is not in this repository`);
  } else {
    const compared = options.validate ? [sourceRevision] : [sourceRevision, ref];
    if (!git.ok("diff", "--quiet", ...compared, "--", "skills")) {
      problems.push(`skills/ at ${ref.slice(0, 7)} differs from catalog source ${sourceRevision.slice(0, 7)}; run node tools/build-catalog.js and commit the catalog first`);
    }
    const rebuilt = buildCatalog(repo, sourceRevision);
    if (JSON.stringify(rebuilt) !== JSON.stringify(catalog)) {
      problems.push(`catalog.json at ${ref.slice(0, 7)} does not match its source revision`);
    }
  }
  const skillMeta = {};
  for (const skill of catalog.skills) {
    skillMeta[skill.name] = frontmatter(git.show(sourceRevision, `skills/${skill.name}/SKILL.md`));
  }
  return { git, ref, catalog, presentation, cliVersion, sourceRevision, skillMeta, problems };
}

function requirePublished(git, options, revisions) {
  if (options.fetch) git("fetch", "--quiet", options.remote, "main");
  const remoteRef = `${options.remote}/main`;
  if (!git.ok("rev-parse", "--verify", "--quiet", remoteRef)) return [`${remoteRef} is not available`];
  return revisions
    .filter(([, revision]) => !git.ok("merge-base", "--is-ancestor", revision, remoteRef))
    .map(([label, revision]) => `${label} ${revision.slice(0, 7)} is not on ${remoteRef}; push it before syncing`);
}

function describeChanges(previous, next) {
  const before = new Map((previous ? previous.skills : []).map((skill) => [skill.name, skill]));
  const after = new Map(next.skills.map((skill) => [skill.name, skill]));
  const renamedFrom = new Set(next.redirects.map((redirect) => PREFIX + redirect.from));
  const added = [...after.keys()].filter((name) => !before.has(name));
  const removed = [...before.keys()].filter((name) => !after.has(name) && !renamedFrom.has(name));
  const renamed = [...before.keys()].filter((name) => !after.has(name) && renamedFrom.has(name));
  const changed = [...after.keys()].filter((name) => before.has(name) && JSON.stringify(before.get(name)) !== JSON.stringify(after.get(name)));
  return { added, removed, renamed, changed };
}

function writeAtomically(file, text) {
  fs.mkdirSync(path.dirname(file), { recursive: true });
  const temporary = `${file}.${process.pid}.tmp`;
  fs.writeFileSync(temporary, text);
  fs.renameSync(temporary, file);
}

function main() {
  const options = parseArgs(process.argv.slice(2));
  const repo = path.resolve(__dirname, "..");
  const inputs = loadInputs(repo, options);
  const { snapshot, errors, warnings } = assemble({
    catalog: inputs.catalog,
    presentation: inputs.presentation,
    skillMeta: inputs.skillMeta,
    sourceRevision: inputs.sourceRevision,
    catalogCommit: inputs.ref,
    cliVersion: inputs.cliVersion,
  });
  const problems = [...inputs.problems, ...errors];
  if (!options.validate && !problems.length) {
    problems.push(...requirePublished(inputs.git, options, [["Catalog source", inputs.sourceRevision], ["Presentation commit", inputs.ref]]));
  }
  for (const warning of warnings) console.warn(`warning: ${warning}`);
  if (problems.length) {
    for (const problem of problems) console.error(`error: ${problem}`);
    console.error(`Sync refused with ${problems.length} problem(s); nothing was written.`);
    process.exitCode = 1;
    return;
  }
  const summary = `${snapshot.counts.skills} skills (${snapshot.counts.internal} internal) at ${snapshot.sourceRevision.slice(0, 7)}`;
  if (options.validate) {
    console.log(`Presentation valid for ${summary}`);
    return;
  }
  const target = path.join(options.portfolio, SNAPSHOT_PATH);
  const text = JSON.stringify(snapshot, null, 2) + "\n";
  const previousText = fs.existsSync(target) ? fs.readFileSync(target, "utf8") : null;
  if (options.check) {
    if (previousText !== text) {
      console.error(`${SNAPSHOT_PATH} is out of date; run the sync without --check`);
      process.exitCode = 1;
    } else {
      console.log(`${SNAPSHOT_PATH} is current: ${summary}`);
    }
    return;
  }
  let previous = null;
  try { previous = previousText && JSON.parse(previousText); } catch { previous = null; }
  const changes = describeChanges(previous, snapshot);
  writeAtomically(target, text);
  console.log(`Wrote ${SNAPSHOT_PATH}: ${summary}`);
  for (const [label, list] of Object.entries(changes)) {
    if (list.length) console.log(`  ${label}: ${list.join(", ")}`);
  }
}

if (require.main === module) {
  try {
    main();
  } catch (error) {
    console.error(`error: ${error.message}`);
    process.exitCode = 1;
  }
}

module.exports = { assemble, describeChanges };
