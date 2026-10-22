"use strict";

/**
 * Shared project file traversal for the yeknal scanners.
 *
 * The security scanner and the slop scanner both need to walk a project tree
 * while skipping dependencies, build output and generated files. The ignore
 * rules and the walker live here so the two scanners cannot drift apart, and
 * so neither has to require the CLI entry point (which would be a circular
 * require).
 *
 * The walker reports what it skipped rather than dropping it silently. A scan
 * that quietly ignores files it could not read is not the same as a clean
 * result, so callers receive a coverage record alongside the file list.
 */

const fs = require("fs");
const path = require("path");
const { execFile } = require("child_process");

const fsp = fs.promises;

// Directories that never hold authored project source.
const SCAN_IGNORE_DIRS = new Set([
  "node_modules", ".git", ".next", "dist", "build", ".cache", ".output",
  "coverage", ".nyc_output", "__pycache__", ".venv", "venv", "env",
  ".terraform", "vendor", "target", "bin", "obj", ".nuxt", ".svelte-kit",
  ".astro", ".vercel", ".netlify", ".turbo", "out", ".parcel-cache", "tmp",
]);

// Dependency backups and similarly named generated/build directories are
// commonly left beside the working tree after reinstalls or builds.
const SCAN_IGNORE_DIR_PATTERNS = [
  /^node_modules(?:\.|[-_])(?:bak|backup)(?:[-_.]|$)/i,
  /^(?:vendor|bower_components|\.venv|venv|env)(?:\.|[-_])(?:bak|backup)(?:[-_.]|$)/i,
  /^(?:build|dist|out|coverage|generated|__generated__)(?:\.|[-_])(?:bak|backup)(?:[-_.]|$)/i,
];

// Generated source/config files can contain copied secrets or noisy bundled
// content that is not the project's authored implementation.
const SCAN_IGNORE_FILE_PATTERNS = [
  /\.min\.(?:js|css|mjs|cjs)$/i,
  /\.(?:bundle|chunk|generated|gen)\.[^.]+$/i,
  /(?:^|[._-])generated(?:[._-]|$)/i,
  /\.d\.ts$/i,
  /\.map$/i,
];

function isScanIgnoredDirectory(name) {
  const nameLC = name.toLowerCase();
  return SCAN_IGNORE_DIRS.has(nameLC) || SCAN_IGNORE_DIR_PATTERNS.some((pattern) => pattern.test(name));
}

function isScanIgnoredFile(name) {
  return SCAN_IGNORE_FILE_PATTERNS.some((pattern) => pattern.test(name));
}

const DEFAULT_MAX_DEPTH = 12;
const DEFAULT_MAX_FILE_SIZE = 512 * 1024;

/**
 * Walk a project tree.
 *
 * @param {string} rootDir Absolute or relative scan root.
 * @param {object} [options]
 * @param {(name: string, fullPath: string) => boolean} [options.accept]
 *   Called for each file that is not ignored. Return true to include it.
 * @param {(name: string) => boolean} [options.isIgnoredDirectory]
 * @param {(name: string) => boolean} [options.isIgnoredFile]
 * @param {number} [options.maxDepth]
 * @param {number} [options.maxFileSize]
 * @returns {Promise<{ files: string[], coverage: object }>}
 */
async function walkFiles(rootDir, options = {}) {
  const maxDepth = options.maxDepth ?? DEFAULT_MAX_DEPTH;
  const maxFileSize = options.maxFileSize ?? DEFAULT_MAX_FILE_SIZE;
  const accept = options.accept ?? (() => true);
  const ignoreDirectory = options.isIgnoredDirectory ?? isScanIgnoredDirectory;
  const ignoreFile = options.isIgnoredFile ?? isScanIgnoredFile;

  const files = [];
  // Symlinks are never followed: a Dirent for a symlink reports neither
  // isFile() nor isDirectory(), so links to directories and files are skipped
  // by construction and can never escape the scan root.
  const coverage = { read: 0, filtered: 0, tooLarge: 0, tooDeep: 0, unreadable: 0 };

  async function walk(dir, depth) {
    if (depth > maxDepth) {
      coverage.tooDeep += 1;
      return;
    }

    let entries;
    try {
      entries = await fsp.readdir(dir, { withFileTypes: true });
    } catch {
      coverage.unreadable += 1;
      return;
    }

    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name);

      if (entry.isDirectory()) {
        if (ignoreDirectory(entry.name)) coverage.filtered += 1;
        else await walk(fullPath, depth + 1);
        continue;
      }

      if (!entry.isFile()) continue;

      if (ignoreFile(entry.name) || !accept(entry.name, fullPath)) {
        coverage.filtered += 1;
        continue;
      }

      let stats;
      try {
        stats = await fsp.stat(fullPath);
      } catch {
        coverage.unreadable += 1;
        continue;
      }
      if (stats.size > maxFileSize) {
        coverage.tooLarge += 1;
        continue;
      }

      files.push(fullPath);
      coverage.read += 1;
    }
  }

  await walk(rootDir, 0);
  return { files, coverage };
}

/** Read a file as UTF-8, returning null when it cannot be read. */
async function safeReadFile(filePath) {
  try {
    return await fsp.readFile(filePath, "utf8");
  } catch {
    return null;
  }
}

/**
 * List the files Git would consider part of the working tree, so generated and
 * ignored output stays out of a scan. Returns null when the directory is not a
 * Git work tree or Git is unavailable, so callers can fall back to walkFiles.
 */
function listGitVisibleFiles(rootDir) {
  return new Promise((resolve) => {
    execFile(
      "git",
      ["ls-files", "-co", "--exclude-standard", "-z"],
      { cwd: rootDir, maxBuffer: 64 * 1024 * 1024, windowsHide: true },
      (error, stdout) => {
        if (error || typeof stdout !== "string") {
          resolve(null);
          return;
        }
        const paths = stdout
          .split("\0")
          .filter((value) => value.length > 0)
          .map((value) => path.resolve(rootDir, value));
        resolve(paths);
      },
    );
  });
}

module.exports = {
  DEFAULT_MAX_DEPTH,
  DEFAULT_MAX_FILE_SIZE,
  SCAN_IGNORE_DIRS,
  SCAN_IGNORE_DIR_PATTERNS,
  SCAN_IGNORE_FILE_PATTERNS,
  isScanIgnoredDirectory,
  isScanIgnoredFile,
  listGitVisibleFiles,
  safeReadFile,
  walkFiles,
};
