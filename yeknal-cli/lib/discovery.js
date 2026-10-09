"use strict";

const fs = require("fs/promises");
const path = require("path");
const os = require("os");
const crypto = require("crypto");
const { execFile } = require("child_process");
const { promisify } = require("util");
const execFileAsync = promisify(execFile);

const CATALOG_URL = "https://raw.githubusercontent.com/tryraisins/MD_Files/main/yeknal-cli/catalog.json";
const SOURCE_URL = "https://raw.githubusercontent.com/tryraisins/MD_Files";
const DAY = 24 * 60 * 60 * 1000;
const MAX_CATALOG = 4 * 1024 * 1024;
const MAX_RESOURCE = 32 * 1024 * 1024;
const NAME = /^[a-z0-9][a-z0-9-]{0,127}$/;
const HASH = /^[a-f0-9]{64}$/;

function cacheRoot(home = os.homedir(), env = process.env) {
  if (env.YEKNAL_CACHE_DIR) return path.resolve(env.YEKNAL_CACHE_DIR);
  if (process.platform === "win32") return path.join(env.LOCALAPPDATA || path.join(home, "AppData", "Local"), "yeknal", "cache");
  if (process.platform === "darwin") return path.join(home, "Library", "Caches", "yeknal");
  return path.join(env.XDG_CACHE_HOME || path.join(home, ".cache"), "yeknal");
}

function hash(data) { return crypto.createHash("sha256").update(data).digest("hex"); }

function safeResource(resource) {
  if (typeof resource !== "string" || !resource || resource.length > 1024 || resource.includes("\\") || /[\x00-\x1f\x7f:?#%]/.test(resource)) throw new Error("Invalid resource path");
  const parts = resource.split("/");
  if (parts.some((part) => !part || part === "." || part === ".." || /[ .]$/.test(part) || /[<>"|*]/.test(part) || /^(con|prn|aux|nul|com[1-9]|lpt[1-9])(?:\.|$)/i.test(part))) throw new Error("Invalid resource path");
  return resource;
}

function validateCatalog(catalog) {
  if (!catalog || catalog.schemaVersion !== 1 || !/^[a-f0-9]{40}$/.test(catalog.sourceRevision) || typeof catalog.version !== "string" || !Array.isArray(catalog.skills) || catalog.skills.length > 5000) throw new Error("Invalid skill catalog");
  const names = new Set();
  for (const skill of catalog.skills) {
    if (typeof skill.name !== "string" || !NAME.test(skill.name) || names.has(skill.name.toLowerCase()) || typeof skill.description !== "string" || !HASH.test(skill.version) || !Array.isArray(skill.keywords) || skill.keywords.some((word) => typeof word !== "string") || !Array.isArray(skill.files) || skill.files.length > 5000) throw new Error("Invalid skill catalog entry");
    names.add(skill.name.toLowerCase());
    const files = new Set();
    for (const file of skill.files) {
      safeResource(file.path);
      if (files.has(file.path.toLowerCase()) || !HASH.test(file.sha256) || !Number.isSafeInteger(file.size) || file.size < 0 || file.size > MAX_RESOURCE) throw new Error("Invalid skill file manifest");
      files.add(file.path.toLowerCase());
    }
    if (!files.has("skill.md") || hash(JSON.stringify(skill.files)) !== skill.version) throw new Error("Invalid skill content version");
  }
  return catalog;
}

// Reject links in every component, including ancestors of a configured cache.
async function noLinks(filename) {
  const absolute = path.resolve(filename);
  const root = path.parse(absolute).root;
  let cursor = root;
  for (const part of absolute.slice(root.length).split(path.sep).filter(Boolean)) {
    cursor = path.join(cursor, part);
    try { if ((await fs.lstat(cursor)).isSymbolicLink()) throw new Error(`Symbolic links are not allowed: ${cursor}`); }
    catch (error) { if (error.code === "ENOENT") return; throw error; }
  }
}

async function atomicWrite(filename, content) {
  await noLinks(filename);
  await fs.mkdir(path.dirname(filename), { recursive: true });
  await noLinks(filename);
  const temporary = `${filename}.${crypto.randomBytes(12).toString("hex")}.tmp`;
  try {
    await fs.writeFile(temporary, content, { flag: "wx", mode: 0o600 });
    await noLinks(filename);
    await fs.rename(temporary, filename);
  } finally { await fs.rm(temporary, { force: true }).catch(() => {}); }
}

async function readSafe(filename) {
  await noLinks(filename);
  if ((await fs.stat(filename)).size > MAX_RESOURCE) throw new Error("Local resource exceeds size limit");
  return fs.readFile(filename);
}

function metadata(text, fallbackName) {
  const fm = text.match(/^---\r?\n([\s\S]*?)\r?\n---/);
  const description = fm && fm[1].match(/^description:\s*(.+)$/m);
  return { name: fallbackName, description: description ? description[1].trim().replace(/^(['"])(.*)\1$/, "$2") : "Locally installed skill", keywords: fallbackName.split("-") };
}

function createDiscovery(options = {}) {
  const env = options.env || process.env;
  const cwd = path.resolve(options.cwd || process.cwd());
  const home = path.resolve(options.home || env.YEKNAL_HOME || os.homedir());
  const cache = path.resolve(options.cacheDir || cacheRoot(home, env));
  const fetcher = options.fetch || globalThis.fetch;
  const now = options.now || Date.now;
  const ttl = options.ttlMs === undefined ? DAY : options.ttlMs;
  const offline = options.offline === undefined ? env.YEKNAL_OFFLINE === "1" : options.offline;
  const catalogPath = path.join(cache, "catalog.json");
  let catalogState;
  let lastError = null;
  let refreshPromise;
  let nextRefreshAt = 0;
  let repositoryPromise;
  let repositoryCwd;

  async function repositoryRoot() {
    if (!repositoryPromise) repositoryPromise = (async () => {
      try {
        // Ask Git about the requesting cwd, including linked worktrees. Never
        // infer a project from the runtime's install path or an ancestor scan.
        const { stdout } = await execFileAsync("git", ["-C", cwd, "rev-parse", "--show-toplevel", "--show-prefix"], { windowsHide: true, timeout: 10000, maxBuffer: 16384, env });
        const [topLevel, ...prefixLines] = stdout.trimEnd().split(/\r?\n/);
        const root = await fs.realpath(path.resolve(topLevel));
        // fs.realpath on Windows can retain 8.3 aliases. Git's relative prefix
        // reconstructs cwd beneath its canonical toplevel instead of comparing
        // differently spelled aliases. Check directory identity as well.
        const projectCwd = path.resolve(root, prefixLines.join("\n"));
        const relative = path.relative(root, projectCwd);
        if (relative === ".." || relative.startsWith(`..${path.sep}`) || path.isAbsolute(relative)) throw new Error("Git repository does not contain the requesting directory");
        const [requestStat, projectStat] = await Promise.all([fs.stat(cwd, { bigint: true }), fs.stat(projectCwd, { bigint: true })]);
        if (requestStat.dev !== projectStat.dev || requestStat.ino !== projectStat.ino) throw new Error("Git project context does not match the requesting directory");
        repositoryCwd = projectCwd;
        return root;
      } catch (error) {
        if (error.code === "ENOENT" || /not a git repository/i.test(error.stderr || "")) return null;
        throw error;
      }
    })();
    return repositoryPromise;
  }

  async function request(url, maxSize) {
    if (offline) throw new Error("Offline mode: remote retrieval is disabled; existing cached skills remain usable");
    if (typeof fetcher !== "function") throw new Error("Network retrieval needs Node.js 18 or newer");
    const response = await fetcher(url, { signal: AbortSignal.timeout(15000), redirect: "error", headers: { "User-Agent": "yeknal-skill-discovery", Accept: "application/octet-stream" } });
    if (response.url && new URL(response.url).origin !== new URL(SOURCE_URL).origin) throw new Error("Unexpected skill source origin");
    if (!response.ok) {
      const retry = response.headers && response.headers.get("retry-after");
      const error = new Error(`Skill source returned HTTP ${response.status}${retry ? `; retry after ${retry}` : ""}`);
      const seconds = retry && /^\d+$/.test(retry) ? Number(retry) * 1000 : retry ? Date.parse(retry) - now() : 0;
      error.retryAfterMs = Math.max(Number.isFinite(seconds) ? seconds : 0, response.status === 429 || response.status === 403 ? 15 * 60 * 1000 : 5 * 60 * 1000);
      throw error;
    }
    const announcedSize = Number(response.headers && response.headers.get("content-length"));
    if (announcedSize > maxSize) throw new Error("Remote response exceeds size limit");
    const chunks = [];
    let total = 0;
    if (response.body && response.body[Symbol.asyncIterator]) {
      for await (const chunk of response.body) {
        total += chunk.length;
        if (total > maxSize) throw new Error("Remote response exceeds size limit");
        chunks.push(Buffer.from(chunk));
      }
      return Buffer.concat(chunks);
    }
    const data = Buffer.from(await response.arrayBuffer());
    if (data.length > maxSize) throw new Error("Remote response exceeds size limit");
    return data;
  }

  async function getCatalog() {
    if (catalogState) return catalogState;
    try {
      const saved = JSON.parse((await readSafe(catalogPath)).toString());
      validateCatalog(saved.catalog);
      if (!Number.isFinite(saved.fetchedAt)) throw new Error("Invalid cache timestamp");
      catalogState = saved;
      if (typeof saved.lastError === "string") lastError = saved.lastError;
      if (Number.isFinite(saved.retryAt)) nextRefreshAt = saved.retryAt;
    } catch (error) {
      if (error.code !== "ENOENT") lastError = error.message;
      const bundled = validateCatalog(JSON.parse((await fs.readFile(path.join(__dirname, "../catalog.json"))).toString()));
      catalogState = { catalog: bundled, fetchedAt: 0, source: "bundled" };
    }
    return catalogState;
  }

  async function refresh() {
    if (refreshPromise) return refreshPromise;
    refreshPromise = (async () => {
      const previous = await getCatalog();
      try {
        const catalog = validateCatalog(JSON.parse((await request(CATALOG_URL, MAX_CATALOG)).toString()));
        const saved = { catalog, fetchedAt: now(), source: "remote", lastAttemptAt: now() };
        await atomicWrite(path.join(cache, "catalogs", `${catalog.sourceRevision}.json`), JSON.stringify(catalog));
        await atomicWrite(catalogPath, JSON.stringify(saved));
        catalogState = saved;
        lastError = null;
        nextRefreshAt = 0;
        return { updated: true, ...await status() };
      } catch (error) {
        lastError = error.message;
        nextRefreshAt = now() + (error.retryAfterMs || 5 * 60 * 1000);
        catalogState = { ...previous, lastError, lastAttemptAt: now(), retryAt: nextRefreshAt };
        // Persist backoff across CLI processes and agents. Keep the last usable
        // catalog rather than replacing it with a failed or partial response.
        await atomicWrite(catalogPath, JSON.stringify(catalogState)).catch(() => {});
        return { updated: false, ...await status() };
      }
    })().finally(() => { refreshPromise = undefined; });
    return refreshPromise;
  }

  async function localRoots() {
    const roots = [];
    const repository = await repositoryRoot();
    let directory = repository ? repositoryCwd : cwd;
    const samePath = (left, right) => process.platform === "win32" ? left.toLowerCase() === right.toLowerCase() : left === right;
    const projectParents = [".agents", ".claude", ".codex", ".cursor", ".gemini", ".opencode", ".kiro", ".roo", ".cline", ".copilot", ".windsurf", ".openhands", ".config/opencode", ".config/amp"];
    while (repository) {
      const relative = path.relative(repository, directory);
      if (relative === ".." || relative.startsWith(`..${path.sep}`) || path.isAbsolute(relative)) throw new Error("Project skill discovery escaped the active Git repository");
      for (const parent of projectParents) roots.push({ root: path.join(directory, parent, "skills"), source: "project" });
      if (samePath(directory, repository)) break;
      const next = path.dirname(directory);
      if (next === directory) break;
      directory = next;
    }
    // Lazy import avoids a module initialization cycle when CLI uses discovery.
    const { getSkillTargetSpecs } = require("../bin/yeknal.js");
    for (const spec of getSkillTargetSpecs(home)) {
      const nativeOverride = spec.envVar === "YEKNAL_CODEX_PARENT" ? env.CODEX_HOME : spec.envVar === "YEKNAL_CLAUDE_PARENT" ? env.CLAUDE_CONFIG_DIR : spec.envVar === "YEKNAL_OPENCODE_PARENT" && env.XDG_CONFIG_HOME ? path.join(env.XDG_CONFIG_HOME, "opencode") : spec.envVar === "YEKNAL_AMP_PARENT" && env.XDG_CONFIG_HOME ? path.join(env.XDG_CONFIG_HOME, "amp") : null;
      const override = env[spec.envVar] || nativeOverride;
      const parents = override ? [path.resolve(override)] : spec.defaults;
      for (const parent of parents) roots.push({ root: path.join(parent, "skills"), source: "installed" });
    }
    const seen = new Set();
    return roots.filter(({ root }) => { const key = process.platform === "win32" ? root.toLowerCase() : root; if (seen.has(key)) return false; seen.add(key); return true; });
  }

  async function localSkill(name) {
    for (const location of await localRoots()) {
      const root = path.join(location.root, name);
      try {
        const content = await readSafe(path.join(root, "SKILL.md"));
        return { ...location, root, content };
      } catch (error) { if (error.code !== "ENOENT" && error.code !== "ENOTDIR") throw error; }
    }
    return null;
  }

  async function localMetadata(filename, name) {
    await noLinks(filename);
    const handle = await fs.open(filename, "r");
    try {
      // Discovery only reads the frontmatter prefix, never complete instructions.
      const prefix = Buffer.alloc(8192);
      const { bytesRead } = await handle.read(prefix, 0, prefix.length, 0);
      const text = prefix.subarray(0, bytesRead).toString();
      return { ...metadata(text, name), version: "local" };
    } finally { await handle.close(); }
  }

  async function resourcesAt(root) {
    const files = [];
    async function walk(relative) {
      const directory = path.join(root, relative);
      await noLinks(directory);
      for (const entry of await fs.readdir(directory, { withFileTypes: true })) {
        const resource = relative ? `${relative}/${entry.name}` : entry.name;
        safeResource(resource);
        if (entry.isSymbolicLink()) throw new Error(`Symbolic resource is not allowed: ${resource}`);
        if (entry.isDirectory()) await walk(resource);
        else if (entry.isFile()) files.push(resource);
        if (files.length > 5000) throw new Error("Too many local skill resources");
      }
    }
    await walk("");
    return files.sort();
  }

  async function search(query, { limit = 8 } = {}) {
    if (typeof query !== "string" || query.length > 2000) throw new Error("Search query must be a string of at most 2000 characters");
    if (!Number.isInteger(limit) || limit < 1 || limit > 50) throw new Error("Search limit must be between 1 and 50");
    let state = await getCatalog();
    if (!offline && now() >= nextRefreshAt && now() - state.fetchedAt >= ttl) { await refresh(); state = await getCatalog(); }
    const candidates = new Map();
    for (const location of await localRoots()) {
      let entries;
      try { await noLinks(location.root); entries = await fs.readdir(location.root, { withFileTypes: true }); }
      catch (error) { if (error.code === "ENOENT" || error.code === "ENOTDIR") continue; throw error; }
      for (const entry of entries) {
        if (!NAME.test(entry.name) || !entry.isDirectory() || candidates.has(entry.name)) continue;
        try {
          candidates.set(entry.name, { ...await localMetadata(path.join(location.root, entry.name, "SKILL.md"), entry.name), source: location.source });
        } catch (error) { if (error.code !== "ENOENT") throw error; }
      }
    }
    for (const skill of state.catalog.skills) if (!candidates.has(skill.name)) candidates.set(skill.name, { ...skill, source: "catalog" });
    const terms = [...new Set(query.toLowerCase().match(/[a-z0-9][a-z0-9+#.-]*/g) || [])];
    return [...candidates.values()].map((skill) => {
      const name = skill.name.toLowerCase();
      const description = skill.description.toLowerCase();
      const keywords = skill.keywords.join(" ").toLowerCase();
      const score = terms.reduce((sum, term) => sum + (name === term ? 20 : name.includes(term) ? 8 : 0) + (description.includes(term) ? 4 : 0) + (keywords.includes(term) ? 2 : 0), 0);
      return { name: skill.name, description: skill.description, source: skill.source, version: skill.version, score };
    }).filter((skill) => !terms.length || skill.score > 0).sort((a, b) => b.score - a.score || a.name.localeCompare(b.name, "en")).slice(0, limit);
  }

  function result(name, resource, filename, content, source, version, revision, resources, root) {
    let encoding = "utf8";
    try { if (content.includes(0)) encoding = "base64"; else new TextDecoder("utf-8", { fatal: true }).decode(content); }
    catch { encoding = "base64"; }
    return { name, resource, path: filename, content: content.toString(encoding), encoding, source, version, sourceRevision: revision, resources, resourcesRoot: root };
  }

  async function cachedFallback(name, resource, excludeRevision, warning) {
    const directory = path.join(cache, "catalogs");
    let snapshots;
    try { await noLinks(directory); snapshots = await fs.readdir(directory); }
    catch (error) { if (error.code === "ENOENT") return null; throw error; }
    const ordered = [];
    for (const snapshot of snapshots) {
      if (!/^[a-f0-9]{40}\.json$/.test(snapshot) || snapshot === `${excludeRevision}.json`) continue;
      const filename = path.join(directory, snapshot);
      await noLinks(filename);
      ordered.push({ filename, modified: (await fs.stat(filename)).mtimeMs });
    }
    ordered.sort((a, b) => b.modified - a.modified || a.filename.localeCompare(b.filename));
    for (const snapshot of ordered) {
      let catalog;
      try { catalog = validateCatalog(JSON.parse((await readSafe(snapshot.filename)).toString())); }
      catch (error) { if (/Symbolic links/.test(error.message)) throw error; continue; }
      const skill = catalog.skills.find((entry) => entry.name === name);
      const manifest = skill && skill.files.find((entry) => entry.path === resource);
      if (!manifest) continue;
      const root = path.join(cache, "skills", catalog.sourceRevision, name);
      const filename = path.join(root, resource);
      try {
        const content = await readSafe(filename);
        if (content.length === manifest.size && hash(content) === manifest.sha256) return { ...result(name, resource, filename, content, "cache", skill.version, catalog.sourceRevision, skill.files.map((file) => file.path), root), stale: true, warning };
      } catch (error) { if (error.code !== "ENOENT") throw error; }
    }
    return null;
  }

  async function loadResource(name, resource = "SKILL.md", { revision } = {}) {
    if (typeof name !== "string" || !NAME.test(name)) throw new Error("Invalid skill name");
    if (revision !== undefined && !/^[a-f0-9]{40}$/.test(revision)) throw new Error("Invalid source revision");
    // One sibling traversal is a deliberate cross-skill reference, not an
    // arbitrary filesystem traversal. Validate the target again afterwards.
    if (typeof resource === "string" && resource.startsWith("../")) {
      const match = resource.match(/^\.\.\/([a-z0-9][a-z0-9-]{0,127})\/(.+)$/);
      if (!match) throw new Error("Invalid cross-skill resource path");
      return loadResource(match[1], match[2], { revision });
    }
    safeResource(resource);
    const local = revision ? null : await localSkill(name);
    if (local) {
      const filename = path.join(local.root, resource);
      const content = resource === "SKILL.md" ? local.content : await readSafe(filename);
      return result(name, resource, filename, content, local.source, hash(local.content), null, await resourcesAt(local.root), local.root);
    }
    const state = await getCatalog();
    let catalog = state.catalog;
    if (revision && revision !== catalog.sourceRevision) {
      try { catalog = validateCatalog(JSON.parse((await readSafe(path.join(cache, "catalogs", `${revision}.json`))).toString())); }
      catch (error) { throw new Error(`Source revision metadata is unavailable: ${revision}. Keep the catalog snapshot from the initial load. ${error.message}`); }
      if (catalog.sourceRevision !== revision) throw new Error("Source revision metadata mismatch");
    }
    const skill = catalog.skills.find((entry) => entry.name === name);
    if (!skill) throw new Error(`Unknown skill: ${name}. Run yeknal update to refresh the catalog.`);
    const manifest = skill.files.find((entry) => entry.path === resource);
    if (!manifest) throw new Error(`Resource is not in the skill manifest: ${name}/${resource}`);
    const root = path.join(cache, "skills", catalog.sourceRevision, name);
    const filename = path.join(root, resource);
    try {
      const content = await readSafe(filename);
      if (content.length === manifest.size && hash(content) === manifest.sha256) return result(name, resource, filename, content, "cache", skill.version, catalog.sourceRevision, skill.files.map((file) => file.path), root);
    } catch (error) { if (error.code !== "ENOENT") throw error; }
    // Keep an immutable manifest so later reference loads can pin this revision
    // even after a catalog refresh changes the latest revision.
    await atomicWrite(path.join(cache, "catalogs", `${catalog.sourceRevision}.json`), JSON.stringify(catalog));
    const url = `${SOURCE_URL}/${catalog.sourceRevision}/skills/${encodeURIComponent(name)}/${resource.split("/").map(encodeURIComponent).join("/")}`;
    let content;
    try { content = await request(url, Math.min(MAX_RESOURCE, manifest.size + 1)); }
    catch (error) {
      // An explicit pin must never silently switch versions. An unpinned load
      // may use an older verified cached version when the latest is unavailable.
      if (!revision) {
        const fallback = await cachedFallback(name, resource, catalog.sourceRevision, error.message);
        if (fallback) return fallback;
      }
      throw error;
    }
    if (content.length !== manifest.size || hash(content) !== manifest.sha256) throw new Error(`Content verification failed: ${name}/${resource}`);
    await atomicWrite(filename, content);
    return result(name, resource, filename, content, "remote", skill.version, catalog.sourceRevision, skill.files.map((file) => file.path), root);
  }

  async function load(name, resource = "SKILL.md", options = {}) {
    return { ...await loadResource(name, resource, options), repositoryRoot: await repositoryRoot() };
  }

  const ownedManifest = ".yeknal-managed.json";
  async function verifyMaterialized(root, repository, name, version) {
    const record = JSON.parse((await readSafe(path.join(root, ownedManifest))).toString());
    if (record.schemaVersion !== 1 || record.owner !== "yeknal-resources" || record.repositoryRoot !== repository || record.name !== name || record.version !== version || !Array.isArray(record.files) || record.files.length > 5000) throw new Error(`Unrecognized resource ownership: ${root}`);
    const listed = new Set();
    for (const file of record.files) {
      safeResource(file.path);
      if (file.path === ownedManifest || listed.has(file.path.toLowerCase()) || !HASH.test(file.sha256)) throw new Error(`Invalid resource ownership: ${root}`);
      listed.add(file.path.toLowerCase());
      if (hash(await readSafe(path.join(root, file.path))) !== file.sha256) throw new Error(`Customized resource preserved: ${path.join(root, file.path)}`);
    }
    const actual = await resourcesAt(root);
    if (actual.length !== listed.size + 1 || actual.some((file) => file !== ownedManifest && !listed.has(file.toLowerCase()))) throw new Error(`Unmanaged resources preserved: ${root}`);
    const directories = new Set();
    for (const file of record.files) {
      const parts = file.path.split("/");
      for (let length = 1; length < parts.length; length += 1) directories.add(parts.slice(0, length).join("/"));
    }
    async function verifyDirectories(relative = "") {
      for (const entry of await fs.readdir(path.join(root, relative), { withFileTypes: true })) {
        if (!entry.isDirectory()) continue;
        const child = relative ? `${relative}/${entry.name}` : entry.name;
        if (!directories.has(child)) throw new Error(`Unmanaged directory preserved: ${path.join(root, child)}`);
        await verifyDirectories(child);
      }
    }
    await verifyDirectories();
    return record;
  }

  async function materialize(name, { revision, resource = "SKILL.md" } = {}) {
    const repository = await repositoryRoot();
    if (!repository) throw new Error("Executable resources require a Git repository. Loading from the shared cache still works outside a repository.");
    const selected = await load(name, resource, { revision });
    // Copy the selected skill's supporting tree together, preserving script
    // imports, assets and relative references without native skill registration.
    const buffers = [];
    for (const entry of selected.resources) {
      if (entry === ownedManifest) throw new Error("Skill resource conflicts with the managed ownership record");
      const loaded = selected.sourceRevision ? await loadResource(selected.name, entry, { revision: selected.sourceRevision }) : { path: path.join(selected.resourcesRoot, entry) };
      buffers.push({ path: entry, content: await readSafe(loaded.path) });
    }
    const files = buffers.map((entry) => ({ path: entry.path, sha256: hash(entry.content) }));
    const version = selected.sourceRevision || hash(JSON.stringify(files));
    const resources = path.join(repository, ".yeknal", "resources");
    const root = path.join(resources, version, selected.name);
    await noLinks(root);
    try {
      await fs.lstat(root);
      const previous = await verifyMaterialized(root, repository, selected.name, version);
      if (JSON.stringify(previous.files) !== JSON.stringify(files)) throw new Error(`Existing resource contents do not match the selected skill: ${root}`);
    } catch (error) {
      if (error.code !== "ENOENT") throw error;
      // ENOENT inside an existing tree also means it is incomplete, so never
      // replace it merely because one owned resource has disappeared.
      try { await fs.lstat(root); throw new Error(`Incomplete resources preserved: ${root}`); }
      catch (existing) { if (existing.code !== "ENOENT") throw existing; }
      await noLinks(resources);
      await fs.mkdir(path.dirname(root), { recursive: true });
      const staging = path.join(path.dirname(root), `.yeknal-stage-${crypto.randomBytes(12).toString("hex")}`);
      await fs.mkdir(staging);
      try {
        for (const entry of buffers) {
          const filename = path.join(staging, entry.path);
          await atomicWrite(filename, entry.content);
          // Public Git content does not carry modes; conventional executable
          // resources remain directly runnable on platforms with POSIX modes.
          if (entry.path.startsWith("scripts/") || /\.(?:sh|py|js|mjs|cjs|ps1)$/.test(entry.path)) await fs.chmod(filename, 0o700);
        }
        await atomicWrite(path.join(staging, ownedManifest), JSON.stringify({ schemaVersion: 1, owner: "yeknal-resources", repositoryRoot: repository, name: selected.name, version, sourceRevision: selected.sourceRevision, files }, null, 2));
        await noLinks(root);
        await fs.rename(staging, root);
      } finally {
        await noLinks(staging);
        await fs.rm(staging, { recursive: true, force: true });
      }
    }
    return { ...selected, path: path.join(root, selected.resource), resourcesRoot: root, materializedRoot: root, materialized: files.map((file) => ({ resource: file.path, path: path.join(root, file.path) })) };
  }

  async function cleanResources() {
    const repository = await repositoryRoot();
    if (!repository) return { repositoryRoot: null, removed: [], preserved: [], notice: "No Git repository; no project files changed" };
    const resources = path.join(repository, ".yeknal", "resources");
    const removed = [];
    const preserved = [];
    let versions;
    try { await noLinks(resources); versions = await fs.readdir(resources, { withFileTypes: true }); }
    catch (error) { if (error.code === "ENOENT") return { repositoryRoot: repository, removed, preserved }; throw error; }
    for (const version of versions) {
      const versionRoot = path.join(resources, version.name);
      if (!/^(?:[a-f0-9]{40}|[a-f0-9]{64})$/.test(version.name) || !version.isDirectory() || version.isSymbolicLink()) { preserved.push({ path: versionRoot, reason: "Unrecognized resource directory" }); continue; }
      for (const skill of await fs.readdir(versionRoot, { withFileTypes: true })) {
        const root = path.join(versionRoot, skill.name);
        try {
          if (!NAME.test(skill.name) || !skill.isDirectory() || skill.isSymbolicLink()) throw new Error("Unrecognized resource directory");
          await verifyMaterialized(root, repository, skill.name, version.name);
          await noLinks(root);
          await fs.rm(root, { recursive: true });
          removed.push(root);
        } catch (error) { preserved.push({ path: root, reason: error.message }); }
      }
      await fs.rmdir(versionRoot).catch((error) => { if (error.code !== "ENOTEMPTY" && error.code !== "EEXIST") throw error; });
    }
    await fs.rmdir(resources).catch((error) => { if (error.code !== "ENOTEMPTY" && error.code !== "EEXIST") throw error; });
    await fs.rmdir(path.dirname(resources)).catch((error) => { if (error.code !== "ENOTEMPTY" && error.code !== "EEXIST") throw error; });
    return { repositoryRoot: repository, removed, preserved };
  }

  async function status() {
    const state = await getCatalog();
    return { cacheRoot: cache, repositoryRoot: await repositoryRoot(), catalogSource: state.source || "cache", catalogUrl: CATALOG_URL, sourceRevision: state.catalog.sourceRevision, version: state.catalog.version, skillCount: state.catalog.skills.length, fetchedAt: state.fetchedAt || null, stale: now() - state.fetchedAt >= ttl, offline, lastError, retryAt: nextRefreshAt || null, lastAttemptAt: state.lastAttemptAt || null };
  }

  return { search, load, materialize, cleanResources, update: refresh, status };
}

module.exports = { createDiscovery, cacheRoot };
