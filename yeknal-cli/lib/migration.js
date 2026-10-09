"use strict";

const fs = require("fs/promises");
const path = require("path");
const crypto = require("crypto");
const digest = (bytes) => crypto.createHash("sha256").update(bytes).digest("hex");
const inside = (root, target) => {
  const relative = path.relative(path.resolve(root), path.resolve(target));
  return relative === "" || (!relative.startsWith(`..${path.sep}`) && relative !== ".." && !path.isAbsolute(relative));
};

async function noLinks(file) {
  const absolute = path.resolve(file);
  let cursor = path.parse(absolute).root;
  for (const part of absolute.slice(cursor.length).split(path.sep).filter(Boolean)) {
    cursor = path.join(cursor, part);
    try { if ((await fs.lstat(cursor)).isSymbolicLink()) throw new Error(`Symlink preserved: ${cursor}`); }
    catch (error) { if (error.code === "ENOENT") return; throw error; }
  }
}

// Resolve Windows short names and casing through the nearest existing ancestor
// without following any symbolic-link component. Missing suffixes remain literal.
async function canonical(file) {
  await noLinks(file);
  if (process.platform === "win32") {
    const absolute = path.resolve(file), root = path.parse(absolute).root;
    const parts = absolute.slice(root.length).split(path.sep).filter(Boolean);
    let cursor = root.replace(/^([a-z]):/i, (_, drive) => `${drive.toUpperCase()}:`);
    for (let i = 0; i < parts.length; i++) {
      const part = parts[i];
      const entries = await fs.readdir(cursor);
      let actual = entries.find((name) => name.toLowerCase() === part.toLowerCase());
      if (!actual) {
        let alias;
        try { alias = await fs.lstat(path.join(cursor, part), { bigint: true }); }
        catch (error) {
          if (error.code === "ENOENT") return path.join(cursor, ...parts.slice(i));
          throw error;
        }
        if (alias.isSymbolicLink() || alias.ino === 0n) throw new Error(`Cannot safely identify Windows path alias: ${path.join(cursor, part)}`);
        // Prefer likely 8.3 matches, but require the filesystem's inode/device
        // identity, never a spelling heuristic, before accepting a long name.
        const prefix = part.split("~")[0].toLowerCase();
        const ordered = [...entries].sort((a, b) => Number(!a.toLowerCase().startsWith(prefix)) - Number(!b.toLowerCase().startsWith(prefix)));
        for (const name of ordered) {
          try {
            const stat = await fs.lstat(path.join(cursor, name), { bigint: true });
            if (!stat.isSymbolicLink() && stat.dev === alias.dev && stat.ino === alias.ino) { actual = name; break; }
          } catch (error) { if (error.code !== "ENOENT") throw error; }
        }
        if (!actual) throw new Error(`Cannot safely resolve Windows path alias: ${path.join(cursor, part)}`);
      }
      cursor = path.join(cursor, actual);
    }
    return cursor;
  }
  let cursor = path.resolve(file);
  const suffix = [];
  for (;;) {
    try { return path.join(await fs.realpath(cursor), ...suffix); }
    catch (error) {
      if (error.code !== "ENOENT") throw error;
      const parent = path.dirname(cursor);
      if (parent === cursor) throw error;
      suffix.unshift(path.basename(cursor));
      cursor = parent;
    }
  }
}

async function optional(file) {
  try { return await fs.readFile(file, "utf8"); }
  catch (error) { if (error.code === "ENOENT") return null; throw error; }
}

function metadata(text) {
  const frontmatter = /^---\r?\n([\s\S]*?)\r?\n---(?:\r?\n|$)/.exec(text || "")?.[1] || "";
  const scalar = (key) => new RegExp(`^${key}:\\s*(.*)$`, "m").exec(frontmatter)?.[1]?.trim().replace(/^['"]|['"]$/g, "") || "";
  let description = scalar("description");
  if (/^[>|][-+]?$/u.test(description)) {
    const lines = frontmatter.split(/\r?\n/);
    const start = lines.findIndex((line) => /^description:/.test(line));
    description = [];
    for (let i = start + 1; i < lines.length && /^\s/.test(lines[i]); i++) description.push(lines[i].trim());
    description = description.join(" ");
  }
  return { name: scalar("name"), description };
}

async function snapshot(folder) {
  await noLinks(folder);
  const files = [], directories = [];
  let bytesRead = 0, pathsRead = 0;
  async function walk(relative) {
    if (++pathsRead > 50000) throw new Error(`Migration path limit exceeded; folder preserved: ${folder}`);
    const absolute = path.join(folder, relative);
    const stat = await fs.lstat(absolute);
    if (stat.isSymbolicLink()) throw new Error(`Folder contains a symlink; preserved: ${absolute}`);
    if (stat.isDirectory()) {
      directories.push({ path: relative.replaceAll(path.sep, "/"), mode: stat.mode });
      for (const entry of (await fs.readdir(absolute)).sort()) await walk(path.join(relative, entry));
    } else if (stat.isFile()) {
      if (bytesRead + stat.size > 1024 * 1024 * 1024) throw new Error(`Migration byte limit exceeded; folder preserved: ${folder}`);
      const bytes = await fs.readFile(absolute);
      bytesRead += bytes.length;
      if (bytesRead > 1024 * 1024 * 1024) throw new Error(`Migration byte limit exceeded; folder preserved: ${folder}`);
      files.push({ path: relative.replaceAll(path.sep, "/"), sha256: digest(bytes), size: bytes.length, mode: stat.mode, mtimeMs: stat.mtimeMs });
    } else throw new Error(`Non-regular content preserved: ${absolute}`);
  }
  await walk("");
  return { files, directories };
}

function contentIdentity(snapshot) {
  return digest(JSON.stringify({ files: snapshot.files.map(({ path, sha256, size }) => ({ path, sha256, size })), directories: snapshot.directories.map(({ path }) => path) }));
}

async function globalRoots(ctx, agents) {
  const { getSkillTargetSpecs } = require("../bin/yeknal.js");
  const roots = [];
  for (const spec of getSkillTargetSpecs(ctx.home)) {
    for (const parent of [...spec.defaults, ...(ctx.env[spec.envVar] ? [ctx.env[spec.envVar]] : [])]) roots.push(path.resolve(parent, "skills"));
  }
  for (const agent of agents) roots.push(...agent.skillRoots);
  if (ctx.env.OPENCODE_CONFIG_DIR) roots.push(path.resolve(ctx.env.OPENCODE_CONFIG_DIR, "skills"));
  return [...new Map(roots.map((root) => [process.platform === "win32" ? path.resolve(root).toLowerCase() : path.resolve(root), path.resolve(root)])).values()];
}

async function activeProject(cwd) {
  let cursor = path.resolve(cwd);
  for (;;) {
    try { await fs.lstat(path.join(cursor, ".git")); return canonical(cursor); }
    catch (error) { if (error.code !== "ENOENT") throw error; }
    const parent = path.dirname(cursor);
    if (parent === cursor) return null;
    cursor = parent;
  }
}

function makeMigration(ctx, agents, manifest, result, cwd) {
  let backupRoot = path.join(ctx.cacheDir, "migration-backups");
  let roots;
  async function init() {
    if (!roots) {
      const normalized = [];
      for (const root of await globalRoots(ctx, agents)) {
        try { normalized.push(await canonical(root)); }
        catch (error) { result.preserved.push(root); result.warnings.push(error.message); }
      }
      roots = [...new Map(normalized.map((root) => [process.platform === "win32" ? root.toLowerCase() : root, root])).values()];
      backupRoot = await canonical(backupRoot);
    }
    if (roots.some((root) => inside(root, backupRoot) || inside(backupRoot, root))) throw new Error("Migration backup must be outside every supported skill-discovery path.");
    await noLinks(backupRoot);
    return roots;
  }
  async function inventory() {
    await init();
    const entries = [], project = await activeProject(cwd || process.cwd());
    let skillCount = 0, descriptionCharacters = 0;
    for (const root of roots) {
      if ((project && inside(project, root)) || await activeProject(root)) { result.warnings.push(`Project-local discovery root preserved: ${root}`); continue; }
      try {
        await noLinks(root);
        for (const name of (await fs.readdir(root)).sort()) {
          const folder = path.join(root, name);
          try {
            await noLinks(folder);
            if (!(await fs.lstat(folder)).isDirectory()) continue;
            const text = await optional(path.join(folder, "SKILL.md"));
            const info = metadata(text);
            if (text !== null) { skillCount++; descriptionCharacters += info.description.length; }
            entries.push({ root, folder, name, text, info });
          } catch (error) { result.preserved.push(folder); result.warnings.push(error.message); }
        }
      } catch (error) { if (error.code !== "ENOENT") { result.preserved.push(root); result.warnings.push(error.message); } }
    }
    return { entries, metadata: { skillCount, descriptionCharacters, discoveryRoots: roots.length } };
  }

  async function list() {
    await init();
    const backups = [];
    let names;
    try { names = await fs.readdir(backupRoot); } catch (error) { if (error.code === "ENOENT") return []; throw error; }
    for (const id of names.sort()) {
      if (!/^\d+-[a-f0-9]{16}$/.test(id)) continue;
      const folder = path.join(backupRoot, id);
      await noLinks(folder);
      await noLinks(path.join(folder, "manifest.json"));
      const raw = await optional(path.join(folder, "manifest.json"));
      if (!raw) continue;
      const record = JSON.parse(raw);
      if (record.schemaVersion !== 1 || record.id !== id) throw new Error(`Invalid migration backup: ${folder}`);
      backups.push({ ...record, backupPath: path.join(folder, "content") });
    }
    return backups;
  }

  async function migrate() {
    const before = await inventory();
    result.metadata = { before: before.metadata };
    const catalog = JSON.parse(await fs.readFile(path.join(__dirname, "..", "catalog.json"), "utf8"));
    const known = new Map(catalog.skills.map((skill) => [skill.name, skill]));
    const ownedRouterEntries = [];
    for (const agent of Object.values(manifest.agents)) if (agent.router?.path) {
      try { ownedRouterEntries.push({ agent, folder: await canonical(path.dirname(agent.router.path)) }); }
      catch (error) { result.preserved.push(agent.router.path); result.warnings.push(error.message); }
    }
    const ownedRouters = new Set(ownedRouterEntries.map(({ folder }) => folder));
    for (const entry of before.entries) {
      const skill = known.get(entry.name);
      const eligible = ((skill || entry.name === "yeknal-auto-discovery") && entry.info.name === entry.name) || ownedRouters.has(entry.folder);
      if (!eligible) {
        if (entry.name.startsWith("yeknal-") || ownedRouters.has(entry.folder)) {
          result.preserved.push(entry.folder);
          result.warnings.push(`Ambiguous Yeknal identity preserved: ${entry.folder}; catalog name and frontmatter identity must match.`);
        }
        continue;
      }
      try {
        const original = await snapshot(entry.folder);
        const expected = skill?.files.map(({ path, sha256, size }) => ({ path, sha256, size }));
        const actual = original.files.map(({ path, sha256, size }) => ({ path, sha256, size }));
        const customized = expected ? JSON.stringify([...expected].sort((a,b) => a.path.localeCompare(b.path))) !== JSON.stringify([...actual].sort((a,b) => a.path.localeCompare(b.path))) : !ownedRouterEntries.some(({ agent, folder }) => folder === entry.folder && agent.router.hash === digest(entry.text || "") && original.files.length === 1);
        const id = `${Date.now()}-${crypto.randomBytes(8).toString("hex")}`;
        const destination = path.join(backupRoot, id), temporary = `${destination}-pending`;
        const record = { schemaVersion: 1, id, name: entry.name, originalPath: entry.folder, discoveryRoot: entry.root, createdAt: new Date().toISOString(), customized, identity: contentIdentity(original), ...original };
        await noLinks(destination);
        await fs.mkdir(backupRoot, { recursive: true });
        try {
          await fs.mkdir(temporary);
          await fs.cp(entry.folder, path.join(temporary, "content"), { recursive: true, errorOnExist: true, force: false, preserveTimestamps: true });
          if (contentIdentity(await snapshot(path.join(temporary, "content"))) !== record.identity) throw new Error("Migration backup verification failed.");
          await fs.writeFile(path.join(temporary, "manifest.json"), JSON.stringify(record, null, 2) + "\n", { flag: "wx", mode: 0o600 });
          await fs.rename(temporary, destination);
        } catch (error) {
          // An incomplete backup is never a reason to change the original.
          throw new Error(`Backup failed for ${entry.folder}: ${error.message}`);
        }
        // Recheck the entire original immediately before atomically detaching it.
        if (contentIdentity(await snapshot(entry.folder)) !== record.identity) throw new Error(`Source changed during migration; original preserved: ${entry.folder}`);
        if (path.dirname(entry.folder) !== entry.root || !inside(entry.root, entry.folder)) throw new Error("Unsafe migration source.");
        await noLinks(entry.folder);
        // The usual same-volume path retains the original by atomic rename
        // outside discovery too. No recursive source deletion is needed.
        let detached = path.join(destination, "original"), crossVolume = false;
        try { await fs.rename(entry.folder, detached); }
        catch (error) {
          if (error.code !== "EXDEV") throw error;
          crossVolume = true;
          detached = path.join(entry.root, `.yeknal-migration-${id}`);
          await fs.rename(entry.folder, detached);
        }
        try {
          if (contentIdentity(await snapshot(detached)) !== record.identity) throw new Error("Source changed during migration.");
        } catch (error) {
          await fs.rename(detached, entry.folder);
          throw new Error(`${error.message} Restored to original path.`);
        }
        if (crossVolume) {
          try { await fs.rm(detached, { recursive: true }); }
          catch (error) {
            // A verified complete backup already exists. Restore any remaining
            // directory to its original location rather than leaving a hidden
            // native discovery registration behind, and explain partial cleanup.
            try { await fs.rename(detached, entry.folder); } catch (restoreError) { result.warnings.push(`Cleanup residue at ${detached}: ${restoreError.message}`); }
            result.warnings.push(`Migration cleanup failed for ${entry.folder}; remaining original content may be partial. Complete backup retained; restore ID ${id}: ${error.message}`);
            result.preserved.push(entry.folder);
            continue;
          }
        }
        for (const { agent, folder } of ownedRouterEntries) if (folder === entry.folder) { delete agent.router; delete agent.routerPath; }
        result.migrated.push({ ...record, backupPath: path.join(destination, "content") });
        if (customized) result.warnings.push(`Customized Yeknal content backed up: ${entry.folder} (restore ${id}).`);
      } catch (error) { result.preserved.push(entry.folder); result.warnings.push(error.message); }
    }
    result.metadata.after = (await inventory()).metadata;
  }

  async function restore(selection) {
    const records = await list();
    const selected = selection === "all" ? records : records.filter((record) => record.id === selection);
    if (!selected.length && selection !== "all") throw new Error(`Migration backup not found: ${selection}`);
    for (const record of selected) {
      try {
        if (!path.isAbsolute(record.originalPath) || !path.isAbsolute(record.discoveryRoot)) throw new Error("Backup paths must be absolute.");
        const target = await canonical(record.originalPath), root = await canonical(record.discoveryRoot);
        if (!roots.includes(root) || path.dirname(target) !== root || !record.name || path.basename(target) !== record.name) throw new Error(`Backup restore path is not a supported configured global root: ${target}`);
        if (await activeProject(root)) throw new Error(`Restore target is inside a repository; preserved: ${target}`);
        await noLinks(target);
        try { await fs.lstat(target); throw new Error(`Restore target already exists; preserved: ${target}`); } catch (error) { if (error.code !== "ENOENT") throw error; }
        if (contentIdentity(await snapshot(record.backupPath)) !== record.identity) throw new Error(`Backup content was modified; restore refused: ${record.id}`);
        await fs.mkdir(root, { recursive: true });
        const temporary = path.join(path.dirname(record.backupPath), `restore-${crypto.randomBytes(8).toString("hex")}`);
        await noLinks(temporary);
        try { await fs.lstat(temporary); throw new Error(`Restore staging path already exists: ${temporary}`); } catch (error) { if (error.code !== "ENOENT") throw error; }
        await fs.cp(record.backupPath, temporary, { recursive: true, errorOnExist: true, force: false, preserveTimestamps: true });
        if (contentIdentity(await snapshot(temporary)) !== record.identity) throw new Error("Restore verification failed; target was not changed.");
        // Exclusive creation also protects an existing empty directory. POSIX
        // rename alone can overwrite empty directories, so never use it here.
        await fs.mkdir(target);
        await noLinks(target);
        await fs.cp(temporary, target, { recursive: true, errorOnExist: true, force: false, preserveTimestamps: true });
        if (contentIdentity(await snapshot(target)) !== record.identity) throw new Error(`Restore content verification failed; backup retained: ${record.id}`);
        await fs.rm(temporary, { recursive: true });
        result.restored.push({ id: record.id, originalPath: target, backupPath: record.backupPath });
      } catch (error) { result.preserved.push(record.originalPath); result.warnings.push(error.message); }
    }
  }
  return { migrate, list, restore };
}

module.exports = { makeMigration, metadata };
