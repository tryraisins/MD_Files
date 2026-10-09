"use strict";

const fs = require("fs/promises");
const path = require("path");
const os = require("os");
const crypto = require("crypto");
const readline = require("readline/promises");
const { makeMigration } = require("./migration.js");

const START = "<!-- yeknal:automatic-discovery:start -->";
const END = "<!-- yeknal:automatic-discovery:end -->";
const SUPPORTED = ["codex", "claude", "opencode"];

async function exists(file) {
  try { await fs.access(file); return true; } catch (error) {
    if (error.code === "ENOENT") return false;
    throw error;
  }
}

async function readOptional(file) {
  try { return await fs.readFile(file, "utf8"); } catch (error) {
    if (error.code === "ENOENT") return null;
    throw error;
  }
}

async function atomicWrite(file, data) {
  await noLinks(file);
  await fs.mkdir(path.dirname(file), { recursive: true });
  await noLinks(file);
  const temporary = `${file}.${process.pid}.${crypto.randomBytes(6).toString("hex")}.tmp`;
  try {
    await fs.writeFile(temporary, data, { flag: "wx", mode: 0o600 });
    await noLinks(file);
    await fs.rename(temporary, file);
  } finally { await fs.rm(temporary, { force: true }); }
}

async function noLinks(file) {
  const absolute = path.resolve(file);
  let cursor = path.parse(absolute).root;
  for (const part of absolute.slice(cursor.length).split(path.sep).filter(Boolean)) {
    cursor = path.join(cursor, part);
    try {
      if ((await fs.lstat(cursor)).isSymbolicLink()) throw new Error(`Preserved symlinked integration path: ${cursor}`);
    } catch (error) { if (error.code === "ENOENT") return; throw error; }
  }
}

function context(options = {}) {
  const env = options.env || process.env;
  const home = path.resolve(options.home || env.YEKNAL_HOME || os.homedir());
  let cacheDir = options.cacheDir || env.YEKNAL_CACHE_DIR;
  if (!cacheDir) {
    cacheDir = process.platform === "win32"
      ? path.join(env.LOCALAPPDATA || path.join(home, "AppData", "Local"), "yeknal", "cache")
      : process.platform === "darwin"
        ? path.join(home, "Library", "Caches", "yeknal")
        : path.join(env.XDG_CACHE_HOME || path.join(home, ".cache"), "yeknal");
  }
  return { env, home, cacheDir: path.resolve(cacheDir) };
}

// Locations verified against current first-party skills and instruction docs.
// Config directory presence is detection evidence, not proof of authentication.
async function detectAgents(options = {}) {
  const { env, home } = context(options);
  const codex = path.resolve(env.CODEX_HOME || env.YEKNAL_CODEX_PARENT || path.join(home, ".codex"));
  const claude = path.resolve(env.CLAUDE_CONFIG_DIR || env.YEKNAL_CLAUDE_PARENT || path.join(home, ".claude"));
  const opencode = path.resolve(env.YEKNAL_OPENCODE_PARENT || path.join(env.XDG_CONFIG_HOME || path.join(home, ".config"), "opencode"));
  const shared = path.resolve(env.YEKNAL_AGENTS_PARENT || path.join(home, ".agents"));
  const candidates = [
    { id: "codex", label: "Codex", configDir: codex, instructionFile: path.join(codex, (await readOptional(path.join(codex, "AGENTS.override.md")))?.trim() ? "AGENTS.override.md" : "AGENTS.md"), skillRoots: [path.join(shared, "skills"), path.join(codex, "skills")] },
    { id: "claude", label: "Claude Code", configDir: claude, instructionFile: path.join(claude, "CLAUDE.md"), skillRoots: [path.join(claude, "skills")] },
    { id: "opencode", label: "OpenCode V2", configDir: opencode, instructionFile: path.join(opencode, "AGENTS.md"), skillRoots: [path.join(shared, "skills"), path.join(opencode, "skills"), path.join(claude, "skills")] },
  ];
  for (const agent of candidates) {
    try { agent.detected = (await fs.stat(agent.configDir)).isDirectory(); }
    catch (error) { if (error.code !== "ENOENT") throw error; agent.detected = false; }
    if (agent.id === "opencode") {
      agent.warning = "OpenCode integration targets V2. Earlier versions are not verified.";
      if (env.OPENCODE_CONFIG_DIR) agent.warning += " OPENCODE_CONFIG_DIR is an additional custom directory; setup uses the documented global XDG config directory.";
      const compatibilityDisabled = [env.OPENCODE_DISABLE_CLAUDE_CODE, env.OPENCODE_DISABLE_CLAUDE_CODE_PROMPT].some((value) => ["1", "true"].includes(String(value).toLowerCase()));
      if (!compatibilityDisabled && !(await exists(agent.instructionFile)) && (await readOptional(path.join(claude, "CLAUDE.md")))?.trim()) {
        agent.integrationBlocked = "Existing Claude global instructions may be the active fallback in OpenCode V1. Setup preserved that configuration. After confirming OpenCode V2, create an empty global OpenCode AGENTS.md and rerun setup.";
      }
    }
  }
  return candidates;
}

function parseArgs(args) {
  const result = { agents: [], list: false, remove: false, backups: false, restore: null, json: false };
  for (let i = 0; i < args.length; i++) {
    const flag = args[i];
    if (["--list", "--remove", "--backups", "--json"].includes(flag)) result[flag.slice(2)] = true;
    else if (flag === "--restore") {
      result.restore = args[++i];
      if (!result.restore || result.restore.startsWith("--") || !/^[a-zA-Z0-9-]+$/.test(result.restore)) throw new Error("--restore requires a backup ID or all.");
    } else if (flag === "--agents" || flag.startsWith("--agents=")) {
      const value = flag === "--agents" ? args[++i] : flag.slice(9);
      if (!value || value.startsWith("--")) throw new Error("--agents requires a comma-separated agent list.");
      const selected = value.split(",").map((item) => item.trim().toLowerCase()).filter(Boolean);
      if (!selected.length) throw new Error("--agents requires at least one supported agent.");
      result.agents.push(...selected);
    } else throw new Error(`Unknown setup option: ${flag}`);
  }
  result.agents = [...new Set(result.agents)];
  for (const id of result.agents) if (!SUPPORTED.includes(id)) throw new Error(`Unsupported agent '${id}'. Supported agents: ${SUPPORTED.join(", ")}.`);
  if ([result.list, result.remove, result.backups, !!result.restore].filter(Boolean).length > 1) throw new Error("Choose only one of --list, --remove, --backups, or --restore.");
  if ((result.list || result.backups || result.restore) && result.agents.length) throw new Error("--agents is only used for connection or removal.");
  return result;
}

async function runtimeSnapshot(cacheDir) {
  const packageRoot = path.resolve(__dirname, "..");
  const files = [];
  async function walk(relative) {
    const absolute = path.join(packageRoot, relative);
    if (!(await exists(absolute))) return;
    const stat = await fs.lstat(absolute);
    if (stat.isSymbolicLink()) throw new Error(`Refusing symlink in CLI runtime: ${relative}`);
    if (stat.isDirectory()) {
      for (const name of (await fs.readdir(absolute)).sort()) await walk(path.join(relative, name));
    } else if (stat.isFile()) files.push({ relative, data: await fs.readFile(absolute) });
  }
  for (const entry of ["bin", "lib", "catalog", "catalog.json", "profiles.json", "package.json"]) await walk(entry);
  const identity = crypto.createHash("sha256");
  for (const file of files) identity.update(file.relative.replaceAll(path.sep, "/")).update("\0").update(file.data).update("\0");
  const destination = path.join(cacheDir, "runtime", identity.digest("hex"));
  await noLinks(destination);
  if (await exists(destination)) {
    for (const file of files) {
      await noLinks(path.join(destination, file.relative));
      const actual = await fs.readFile(path.join(destination, file.relative));
      if (!actual.equals(file.data)) throw new Error(`Managed runtime was customized; preserved ${destination}. Restore it or use a different YEKNAL_CACHE_DIR.`);
    }
  } else {
    const temporary = `${destination}.${process.pid}.tmp`;
    try {
      await fs.mkdir(temporary, { recursive: true });
      for (const file of files) {
        const target = path.join(temporary, file.relative);
        await fs.mkdir(path.dirname(target), { recursive: true });
        await fs.writeFile(target, file.data);
      }
      await fs.rename(temporary, destination);
    } finally { await fs.rm(temporary, { recursive: true, force: true }); }
  }
  return destination;
}

function shellCommand(runtime) {
  // Quoted arguments are literal in POSIX shells and cmd. PowerShell requires
  // the call operator when the executable path is quoted.
  const args = [process.execPath, path.join(runtime, "bin", "yeknal.js")];
  if (args.some((value) => /["`$\r\n]/.test(value))) throw new Error("The Node/runtime path contains unsupported shell metacharacters.");
  return `${process.platform === "win32" ? "& " : ""}${args.map((value) => `"${value}"`).join(" ")}`;
}

function instructions(command) {
  return [START, "Yeknal CLI: `" + command + "`.", 'Skip discovery for greetings, simple questions, and trivial tasks. For substantive work benefiting from specialist guidance, prefer a loaded or project-local skill; otherwise invoke the CLI with `search "task domain and intent" --json`, then `load yeknal-name --json` from the active repository. Follow the returned instructions. Load only needed resources, pinning their returned sourceRevision with `--revision`; use `--all-resources` for executable assets. Never bulk install or read the full catalog. Cached content works offline.', END, ""].join("\n");
}

async function safeRegularFile(file) {
  await noLinks(file);
  try {
    const stat = await fs.lstat(file);
    if (!stat.isFile() || stat.isSymbolicLink()) throw new Error(`Preserved non-regular or symlinked integration file: ${file}`);
  } catch (error) { if (error.code !== "ENOENT") throw error; }
}

async function connect(agent, manifest, save, runtime, result) {
  if (agent.integrationBlocked) {
    result.warnings.push(`${agent.label}: ${agent.integrationBlocked}`);
    return;
  }
  const command = shellCommand(runtime);
  const previous = manifest.agents[agent.id] || {};
  if (previous.block && previous.block.path !== agent.instructionFile) {
    result.preserved.push(previous.block.path);
    result.warnings.push(`${agent.label}: the instruction location changed. Remove the previous managed integration before reconnecting.`);
    return;
  }
  const record = { ...previous, runtime, instructionFile: agent.instructionFile };
  await safeRegularFile(agent.instructionFile);
  const current = (await readOptional(agent.instructionFile)) || "";
  const block = instructions(command);
  let updated;
  if (previous.block) {
    if (!current.includes(previous.block.text) || current.indexOf(previous.block.text) !== current.lastIndexOf(previous.block.text)) {
      result.preserved.push(agent.instructionFile);
      result.warnings.push(`${agent.label}: customized managed instructions preserved; connection was not changed.`);
      return;
    }
    const text = previous.block.text.slice(0, previous.block.text.indexOf(START)) + block;
    updated = current.replace(previous.block.text, text);
    record.block = { ...previous.block, text };
  } else {
    if (current.includes(START) || current.includes(END)) {
      result.preserved.push(agent.instructionFile);
      result.warnings.push(`${agent.label}: an unowned Yeknal instruction block exists; preserved without changes.`);
      return;
    }
    const text = (current ? "\n\n" : "") + block;
    updated = current + text;
    record.block = { path: agent.instructionFile, text, createdFile: !(await exists(agent.instructionFile)) };
  }
  manifest.agents[agent.id] = record;
  await save();
  if (updated !== current) await atomicWrite(agent.instructionFile, updated);
  result.connected.push({ id: agent.id, label: agent.label, instructionFile: agent.instructionFile, router: null, command, restart: "Start a new agent session to load updated instructions." });
  if (agent.warning) result.warnings.push(agent.warning);
}

async function disconnect(id, manifest, result) {
  const record = manifest.agents[id];
  if (!record) { result.warnings.push(`${id}: no setup-owned integration found.`); return; }
  if (record.block) {
    await safeRegularFile(record.block.path);
    const current = await readOptional(record.block.path);
    if (current !== null && current.includes(record.block.text) && current.indexOf(record.block.text) === current.lastIndexOf(record.block.text)) {
      const updated = current.replace(record.block.text, "");
      if (!updated && record.block.createdFile) await fs.unlink(record.block.path);
      else await atomicWrite(record.block.path, updated);
      delete record.block;
    } else if (current !== null) result.preserved.push(record.block.path);
    else delete record.block;
  }
  if (!record.block && !record.router) delete manifest.agents[id];
  else result.warnings.push(`${id}: customized managed components remain and were preserved. Removal only changes content that still matches setup ownership records.`);
  result.removed.push(id);
}

async function runSetup(args = [], options = {}) {
  const flags = parseArgs(args);
  const ctx = context(options);
  const agents = await detectAgents(options);
  const output = options.output || process.stdout;
  const input = options.input || process.stdin;
  const result = { supported: SUPPORTED, detected: agents.filter((agent) => agent.detected), connected: [], removed: [], migrated: [], backups: [], restored: [], preserved: [], warnings: [] };
  const report = () => {
    if (flags.json) output.write(JSON.stringify(result, null, 2) + "\n");
    else {
      for (const agent of agents) output.write(`${agent.label}: ${agent.detected ? "detected" : "not detected"} (${agent.configDir})\n`);
      for (const agent of result.connected) output.write(`Connected ${agent.label}. ${agent.restart}\n  CLI: ${agent.command}\n`);
      for (const id of result.removed) output.write(`Removed owned instruction block for ${id}.\n`);
      for (const item of result.migrated) output.write(`Backed up ${item.originalPath} (${item.customized ? "customized" : "catalog match"}); restore ID: ${item.id}\n`);
      for (const item of result.backups) output.write(`Backup ${item.id}: ${item.originalPath}\n`);
      for (const item of result.restored) output.write(`Restored ${item.originalPath} from ${item.id}.\n`);
      if (result.metadata) output.write(`Registered metadata: ${result.metadata.before.skillCount} -> ${result.metadata.after.skillCount} skill files; ${result.metadata.before.descriptionCharacters} -> ${result.metadata.after.descriptionCharacters} description characters.\n`);
      for (const item of result.preserved) output.write(`Preserved customized content: ${item}\n`);
      for (const warning of result.warnings) output.write(`Notice: ${warning}\n`);
      output.write("Other agents and cloud-only sessions are not connected by this first version.\n");
    }
    return result;
  };
  if (flags.list) return report();
  if (!flags.agents.length && !flags.backups && !flags.restore) {
    if (!input.isTTY || !output.isTTY) throw new Error("Non-interactive setup requires --agents codex,claude,opencode. Use --list to inspect detected agents.");
    const available = agents.filter((agent) => agent.detected);
    if (!flags.remove && !available.length) throw new Error("No supported agent configuration directory detected. Install and start a supported agent, then retry setup.");
    output.write(`Supported agents: ${available.map((agent) => agent.id).join(", ") || SUPPORTED.join(", ")}\n`);
    const rl = readline.createInterface({ input, output });
    try { flags.agents = parseArgs(["--agents", await rl.question(`Which agents should setup ${flags.remove ? "disconnect" : "connect"} (comma-separated)? `)]).agents; }
    finally { rl.close(); }
  }
  if (!flags.remove && !flags.backups && !flags.restore) for (const id of flags.agents) {
    if (!agents.find((agent) => agent.id === id).detected) throw new Error(`${id} was not detected at its verified configuration directory. Start that agent once, then retry.`);
  }
  await noLinks(ctx.cacheDir);
  await fs.mkdir(ctx.cacheDir, { recursive: true });
  const lockFile = path.join(ctx.cacheDir, "setup.lock");
  await noLinks(lockFile);
  let lock;
  try { lock = await fs.open(lockFile, "wx"); }
  catch (error) { if (error.code === "EEXIST") throw new Error(`Another setup may be running. If it stopped unexpectedly, remove ${lockFile} and retry.`); throw error; }
  try {
    const manifestPath = path.join(ctx.cacheDir, "setup.json");
    await noLinks(manifestPath);
    const raw = await readOptional(manifestPath);
    const manifest = raw ? JSON.parse(raw) : { schemaVersion: 1, agents: {} };
    if (![1, 2].includes(manifest.schemaVersion) || !manifest.agents || typeof manifest.agents !== "object" || Array.isArray(manifest.agents)) throw new Error("Unsupported or invalid setup ownership manifest; preserved without changes.");
    const save = () => atomicWrite(manifestPath, JSON.stringify(manifest, null, 2) + "\n");
    const migration = makeMigration(ctx, agents, manifest, result, options.cwd || process.cwd());
    if (flags.backups) { result.backups = await migration.list(); return report(); }
    if (flags.restore) { await migration.restore(flags.restore); return report(); }
    if (flags.remove) {
      for (const id of flags.agents) { await disconnect(id, manifest, result); await save(); }
      result.warnings.push("Shared cache, migration backups, and versioned local runtimes are retained. Restore backups explicitly with setup --restore <id|all>.");
    } else {
      await migration.migrate();
      manifest.schemaVersion = 2;
      await save();
      const runtime = await runtimeSnapshot(ctx.cacheDir);
      const connections = [...new Set([...flags.agents, ...SUPPORTED.filter((id) => manifest.agents[id]?.block)])];
      for (const id of connections) await connect(agents.find((agent) => agent.id === id), manifest, save, runtime, result);
    }
    return report();
  } finally { await lock.close(); await fs.unlink(lockFile); }
}

module.exports = { runSetup, detectAgents, parseArgs };
