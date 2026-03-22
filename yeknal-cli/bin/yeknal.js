#!/usr/bin/env node

/**
 * yeknal CLI
 * - Fetches markdown templates (security, design, seo).
 * - Syncs skill folders into local AI agent directories (skills command).
 * - Scans project repos for security issues based on Security-Master.md rules.
 */

const fs = require("fs");
const os = require("os");
const path = require("path");
const https = require("https");
const { exec } = require("child_process");

const fsp = fs.promises;

// ==========================================
// USER CONFIGURATION
// ==========================================
const GITHUB_USERNAME = "tryraisins";
const GITHUB_REPO = "MD_Files";
const BRANCH = "main";
// ==========================================

const RAW_BASE_URL = `https://raw.githubusercontent.com/${GITHUB_USERNAME}/${GITHUB_REPO}/${BRANCH}`;
const API_BASE = `https://api.github.com/repos/${GITHUB_USERNAME}/${GITHUB_REPO}`;
const GITHUB_TOKEN = process.env.YEKNAL_GITHUB_TOKEN || process.env.GITHUB_TOKEN || "";

const EXCLUDED_SKILL_FOLDERS = new Set(["Design", "Security", "Security_Raw", "SEO"]);

const SECURITY_REPO_FOLDERS = ["Security", "Security_Raw"];

const singleFileConfigs = {
  design: {
    remotePath: "Design/SKILL.md",
    localName: "Design.md",
  },
  seo: {
    remotePath: "SEO/seo-improvement-prompt.md",
    localName: "SEO-Prompt.md",
  },
};

function usage() {
  console.log("\nUsage:");
  console.log("  npx yeknal security   Sync security skills + scan current project");
  console.log("  npx yeknal design     Fetch design guidelines");
  console.log("  npx yeknal seo        Fetch SEO guidelines");
  console.log("  npx yeknal skills     Sync all skill folders\n");
}

function isHttpSuccess(statusCode) {
  return typeof statusCode === "number" && statusCode >= 200 && statusCode < 300;
}

function getRequestHeaders(url) {
  const isApiRequest = url.includes("api.github.com");
  const headers = {
    "User-Agent": "yeknal-cli",
    Accept: isApiRequest ? "application/vnd.github+json" : "*/*",
  };

  if (GITHUB_TOKEN) {
    headers.Authorization = `Bearer ${GITHUB_TOKEN}`;
  }

  return headers;
}

function requestBuffer(url, redirectsRemaining = 5) {
  return new Promise((resolve, reject) => {
    const req = https.get(
      url,
      {
        headers: getRequestHeaders(url),
      },
      (res) => {
        const statusCode = res.statusCode || 0;

        if ([301, 302, 303, 307, 308].includes(statusCode) && res.headers.location) {
          if (redirectsRemaining <= 0) {
            reject(new Error(`Too many redirects requesting ${url}`));
            return;
          }
          res.resume();
          const nextUrl = new URL(res.headers.location, url).toString();
          requestBuffer(nextUrl, redirectsRemaining - 1).then(resolve).catch(reject);
          return;
        }

        const chunks = [];
        res.on("data", (chunk) => chunks.push(chunk));
        res.on("end", () => {
          resolve({
            statusCode,
            body: Buffer.concat(chunks),
          });
        });
      },
    );

    req.on("error", reject);
  });
}

async function fetchJson(url) {
  const response = await requestBuffer(url);
  if (!isHttpSuccess(response.statusCode)) {
    const bodyText = response.body.toString("utf8");
    if (response.statusCode === 403 && bodyText.includes("API rate limit exceeded")) {
      throw new Error(
        `GitHub API rate limit exceeded.\n` +
          `Set an auth token to increase limits:\n` +
          `  PowerShell: $env:YEKNAL_GITHUB_TOKEN="<your_token>"\n` +
          `  Bash/zsh:  export YEKNAL_GITHUB_TOKEN="<your_token>"\n` +
          `Then rerun: npx yeknal security`,
      );
    }
    throw new Error(`GitHub API request failed (${response.statusCode}): ${url}\n${bodyText}`);
  }
  return JSON.parse(response.body.toString("utf8"));
}

async function downloadUrlToFile(url, localPath) {
  const response = await requestBuffer(url);
  if (!isHttpSuccess(response.statusCode)) {
    throw new Error(`Failed to download file (${response.statusCode}): ${url}`);
  }
  await fsp.mkdir(path.dirname(localPath), { recursive: true });
  await fsp.writeFile(localPath, response.body);
}

function buildGitTreeApiUrl() {
  return `${API_BASE}/git/trees/${encodeURIComponent(BRANCH)}?recursive=1`;
}

async function fetchRepoTree() {
  const data = await fetchJson(buildGitTreeApiUrl());
  if (!data || !Array.isArray(data.tree)) {
    throw new Error("GitHub tree response was missing expected data.");
  }
  return data.tree;
}

function discoverSkillFolders(repoTree) {
  const topLevelDirs = new Set();
  const dirsWithSkill = new Set();

  for (const entry of repoTree) {
    if (entry.type === "tree" && typeof entry.path === "string" && !entry.path.includes("/")) {
      if (!EXCLUDED_SKILL_FOLDERS.has(entry.path)) {
        topLevelDirs.add(entry.path);
      }
      continue;
    }

    if (entry.type === "blob" && typeof entry.path === "string") {
      const parts = entry.path.split("/");
      if (parts.length === 2 && parts[1] === "SKILL.md" && !EXCLUDED_SKILL_FOLDERS.has(parts[0])) {
        dirsWithSkill.add(parts[0]);
      }
    }
  }

  return Array.from(topLevelDirs)
    .filter((dir) => dirsWithSkill.has(dir))
    .sort((a, b) => a.localeCompare(b));
}

function listFilesForFolder(repoTree, folderName) {
  const prefix = `${folderName}/`;
  return repoTree
    .filter((entry) => entry.type === "blob" && typeof entry.path === "string")
    .map((entry) => entry.path)
    .filter((repoPath) => repoPath.startsWith(prefix))
    .sort((a, b) => a.localeCompare(b));
}

function buildRawFileUrl(repoFilePath) {
  const encodedPath = repoFilePath.split("/").map((part) => encodeURIComponent(part)).join("/");
  return `${RAW_BASE_URL}/${encodedPath}`;
}

async function copyDirRecursive(sourceDir, targetDir) {
  await fsp.mkdir(targetDir, { recursive: true });
  const entries = await fsp.readdir(sourceDir, { withFileTypes: true });

  for (const entry of entries) {
    const sourcePath = path.join(sourceDir, entry.name);
    const targetPath = path.join(targetDir, entry.name);

    if (entry.isDirectory()) {
      await copyDirRecursive(sourcePath, targetPath);
      continue;
    }

    if (entry.isFile()) {
      await fsp.copyFile(sourcePath, targetPath);
    }
  }
}

function execCommand(command, options = {}) {
  return new Promise((resolve, reject) => {
    exec(command, options, (error, stdout, stderr) => {
      if (error) {
        reject(new Error(stderr || error.message));
        return;
      }
      resolve({ stdout, stderr });
    });
  });
}

function execCommandSafe(command, options = {}) {
  return new Promise((resolve) => {
    exec(command, options, (error, stdout, stderr) => {
      resolve({ error, stdout: stdout || "", stderr: stderr || "" });
    });
  });
}

async function isDirectory(filePath) {
  try {
    const stats = await fsp.stat(filePath);
    return stats.isDirectory();
  } catch {
    return false;
  }
}

async function fileExists(filePath) {
  try {
    await fsp.access(filePath, fs.constants.F_OK);
    return true;
  } catch {
    return false;
  }
}

async function discoverLocalSkillFolders(sourceRoot) {
  const entries = await fsp.readdir(sourceRoot, { withFileTypes: true });
  const folders = [];

  for (const entry of entries) {
    if (!entry.isDirectory()) {
      continue;
    }
    const folderName = entry.name;
    if (EXCLUDED_SKILL_FOLDERS.has(folderName)) {
      continue;
    }

    const skillFilePath = path.join(sourceRoot, folderName, "SKILL.md");
    if (await isDirectory(path.join(sourceRoot, folderName))) {
      try {
        await fsp.access(skillFilePath, fs.constants.F_OK);
        folders.push(folderName);
      } catch {
        // not a skill folder
      }
    }
  }

  return folders.sort((a, b) => a.localeCompare(b));
}

async function downloadSkillsFromGit(tempRoot, skillFolders, repoTree) {
  for (const folder of skillFolders) {
    const localFolder = path.join(tempRoot, folder);
    const folderFiles = listFilesForFolder(repoTree, folder);

    await fsp.mkdir(localFolder, { recursive: true });
    for (const repoPath of folderFiles) {
      const relativePath = repoPath.slice(folder.length + 1);
      const destinationPath = path.join(localFolder, relativePath);
      await downloadUrlToFile(buildRawFileUrl(repoPath), destinationPath);
    }
  }
}

async function stageSkillsFromGitClone(tempRoot) {
  const cloneRoot = await fsp.mkdtemp(path.join(os.tmpdir(), "yeknal-repo-"));
  const repoPath = path.join(cloneRoot, "repo");
  const cloneUrl = `https://github.com/${GITHUB_USERNAME}/${GITHUB_REPO}.git`;
  const cloneCommand = `git clone --depth 1 --branch ${BRANCH} ${cloneUrl} "${repoPath}"`;

  try {
    await execCommand(cloneCommand);
    const skillFolders = await discoverLocalSkillFolders(repoPath);
    if (skillFolders.length === 0) {
      throw new Error("No skill folders were discovered from the cloned repository.");
    }

    for (const folder of skillFolders) {
      const sourceFolder = path.join(repoPath, folder);
      const destinationFolder = path.join(tempRoot, folder);
      await copyDirRecursive(sourceFolder, destinationFolder);
    }

    return skillFolders;
  } finally {
    await fsp.rm(cloneRoot, { recursive: true, force: true });
  }
}

async function resolveSkillTargets() {
  const home = os.homedir();

  const targetSpecs = [
    {
      label: "Gemini Antigravity",
      envVar: "YEKNAL_GEMINI_PARENT",
      defaults: [path.join(home, ".gemini", "antigravity"), path.join(home, ".antigravity")],
    },
    {
      label: "Codex",
      envVar: "YEKNAL_CODEX_PARENT",
      defaults: [path.join(home, ".codex")],
    },
    {
      label: "Claude",
      envVar: "YEKNAL_CLAUDE_PARENT",
      defaults: [path.join(home, ".claude")],
    },
  ];

  const seenParents = new Set();
  const targets = [];

  for (const spec of targetSpecs) {
    const overridePath = process.env[spec.envVar];
    const candidates = overridePath ? [path.resolve(overridePath)] : spec.defaults;

    for (const candidateParent of candidates) {
      if (seenParents.has(candidateParent)) {
        continue;
      }

      if (await isDirectory(candidateParent)) {
        seenParents.add(candidateParent);
        targets.push({
          label: spec.label,
          parentPath: candidateParent,
          skillsPath: path.join(candidateParent, "skills"),
        });
      }
    }
  }

  return targets;
}

async function runSkillsCommand() {
  console.log("\nFetching available skill folders from GitHub...");

  const targets = await resolveSkillTargets();
  if (targets.length === 0) {
    console.log("No supported parent folders found. Nothing to sync.");
    console.log("Expected one or more of:");
    console.log("  ~/.gemini/antigravity or ~/.antigravity");
    console.log("  ~/.codex");
    console.log("  ~/.claude\n");
    return;
  }

  console.log(`Detected ${targets.length} target parent folder(s):`);
  for (const target of targets) {
    console.log(`  - ${target.label}: ${target.parentPath}`);
  }

  const tempRoot = await fsp.mkdtemp(path.join(os.tmpdir(), "yeknal-skills-"));
  try {
    let skillFolders = [];
    let sourceLabel = "GitHub API + raw file download";

    try {
      const repoTree = await fetchRepoTree();
      skillFolders = discoverSkillFolders(repoTree);
      if (skillFolders.length === 0) {
        throw new Error("No skill folders were discovered from the GitHub repository.");
      }

      await downloadSkillsFromGit(tempRoot, skillFolders, repoTree);
    } catch (error) {
      const message = error && error.message ? error.message : String(error);
      if (!message.includes("GitHub API rate limit exceeded")) {
        throw error;
      }

      console.log("\nGitHub API rate-limited. Falling back to git clone source download...");
      skillFolders = await stageSkillsFromGitClone(tempRoot);
      sourceLabel = "git clone fallback";
    }

    console.log(`\nSkill folders to sync (${skillFolders.length}) via ${sourceLabel}:`);
    console.log(`  ${skillFolders.join(", ")}`);

    let hadFailure = false;
    for (const target of targets) {
      try {
        await fsp.mkdir(target.skillsPath, { recursive: true });
        let copiedCount = 0;

        for (const folder of skillFolders) {
          const sourceFolder = path.join(tempRoot, folder);
          const destinationFolder = path.join(target.skillsPath, folder);
          await fsp.rm(destinationFolder, { recursive: true, force: true });
          await copyDirRecursive(sourceFolder, destinationFolder);
          copiedCount += 1;
        }

        console.log(
          `\n[ok] ${target.label}: synced ${copiedCount} folder(s) into ${target.skillsPath}`,
        );
      } catch (error) {
        hadFailure = true;
        console.error(`\n[error] ${target.label}: ${error.message}`);
      }
    }

    if (hadFailure) {
      process.exitCode = 1;
      console.error("\nSync completed with errors.");
    } else {
      console.log("\nSkills sync completed successfully.");
    }
  } finally {
    await fsp.rm(tempRoot, { recursive: true, force: true });
  }
}

async function runSingleFileTemplateCommand(category) {
  const config = singleFileConfigs[category];
  const fileUrl = `${RAW_BASE_URL}/${config.remotePath}`;
  const localDest = path.join(process.cwd(), config.localName);

  console.log(`\nFetching ${category} guidelines...`);
  await downloadUrlToFile(fileUrl, localDest);
  console.log(`Saved to: ${localDest}\n`);
}

// ==========================================
// SECURITY SCANNER
// Based on Security-Master.md rules
// ==========================================

const SCAN_IGNORE_DIRS = new Set([
  "node_modules", ".git", ".next", "dist", "build", ".cache", ".output",
  "coverage", ".nyc_output", "__pycache__", ".venv", "venv", "env",
  ".terraform", "vendor", "target", "bin", "obj", ".nuxt", ".svelte-kit",
  ".vercel", ".netlify", ".turbo", "out", ".parcel-cache", "tmp",
]);

const SCAN_SOURCE_EXTENSIONS = new Set([
  ".js", ".ts", ".jsx", ".tsx", ".mjs", ".cjs",
  ".py", ".rb", ".php", ".go", ".rs", ".java", ".cs",
  ".vue", ".svelte",
]);

const SCAN_CONFIG_EXTENSIONS = new Set([
  ".json", ".yaml", ".yml", ".toml", ".ini", ".cfg", ".conf",
]);

const SCAN_ALL_EXTENSIONS = new Set([
  ...SCAN_SOURCE_EXTENSIONS, ...SCAN_CONFIG_EXTENSIONS,
  ".env", ".html", ".xml",
]);

// Secret patterns from Security-Master.md Part 1:
// "Never commit DB passwords, JWT secrets, API keys, service account keys, admin credentials"
const SECRET_PATTERNS = [
  { name: "AWS Access Key ID", pattern: /AKIA[0-9A-Z]{16}/g },
  { name: "AWS Secret Access Key", pattern: /(?:aws_secret_access_key|AWS_SECRET)\s*[=:]\s*['"]?[A-Za-z0-9/+=]{40}/gi },
  { name: "Generic API Key assignment", pattern: /(?:api[_-]?key|apikey|api_secret)\s*[=:]\s*['"][a-zA-Z0-9_\-]{20,}['"]/gi },
  { name: "Generic Secret assignment", pattern: /(?:client_secret|app_secret|secret_key)\s*[=:]\s*['"][a-zA-Z0-9_\-]{16,}['"]/gi },
  { name: "Database connection string", pattern: /(?:postgres|postgresql|mysql|mongodb|mongodb\+srv|redis|rediss):\/\/[^\s'"]*:[^\s'"]*@[^\s'"]+/gi },
  { name: "JWT token (hardcoded)", pattern: /['"]eyJ[a-zA-Z0-9_-]{10,}\.[a-zA-Z0-9_-]{10,}\.[a-zA-Z0-9_-]{10,}['"]/g },
  { name: "Private key", pattern: /-----BEGIN (?:RSA |EC |DSA |OPENSSH )?PRIVATE KEY-----/g },
  { name: "Hardcoded password", pattern: /(?:password|passwd|pwd|db_pass|DB_PASSWORD)\s*[=:]\s*['"][^'"]{8,}['"]/gi },
  { name: "Slack token", pattern: /xox[baprs]-[0-9]{10,13}-[0-9]{10,13}-[a-zA-Z0-9]{24,34}/g },
  { name: "GitHub token", pattern: /gh[ps]_[A-Za-z0-9_]{36}/g },
  { name: "Stripe secret key", pattern: /sk_(?:live|test)_[0-9a-zA-Z]{24,}/g },
  { name: "Twilio auth token", pattern: /(?:twilio_auth_token|TWILIO_AUTH)\s*[=:]\s*['"][a-f0-9]{32}['"]/gi },
  { name: "SendGrid API key", pattern: /SG\.[a-zA-Z0-9_-]{22}\.[a-zA-Z0-9_-]{43}/g },
  { name: "Firebase private key", pattern: /(?:firebase|FIREBASE).*private_key.*-----BEGIN/gi },
];

// Files/patterns to exclude from secret scanning (reduce false positives)
const SECRET_SCAN_EXCLUDE_FILES = new Set([
  "package.json", "package-lock.json", "yarn.lock", "pnpm-lock.yaml",
  ".env.example", ".env.sample", ".env.template",
  "tsconfig.json", "jsconfig.json",
]);

// Walk directory tree collecting scannable files
async function walkProjectFiles(rootDir) {
  const maxDepth = 12;
  const maxFileSize = 512 * 1024; // 512KB
  const files = [];

  async function walk(dir, depth) {
    if (depth > maxDepth) return;

    let entries;
    try {
      entries = await fsp.readdir(dir, { withFileTypes: true });
    } catch {
      return;
    }

    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name);

      if (entry.isDirectory()) {
        if (!SCAN_IGNORE_DIRS.has(entry.name)) {
          await walk(fullPath, depth + 1);
        }
        continue;
      }

      if (entry.isFile()) {
        const ext = path.extname(entry.name).toLowerCase();
        const nameLC = entry.name.toLowerCase();
        if (SCAN_ALL_EXTENSIONS.has(ext) || nameLC.startsWith(".env")) {
          try {
            const stats = await fsp.stat(fullPath);
            if (stats.size <= maxFileSize) {
              files.push(fullPath);
            }
          } catch { /* skip unreadable */ }
        }
      }
    }
  }

  await walk(rootDir, 0);
  return files;
}

// Read file safely, return null on failure
async function safeReadFile(filePath) {
  try {
    return await fsp.readFile(filePath, "utf8");
  } catch {
    return null;
  }
}

// Create a check result object
function checkResult(name, reference, points, earned, status, details, issues) {
  return { name, reference, points, earned, status, details, issues: issues || [] };
}

// ---- Category 1: Secrets & Environment (25 pts) ----
// Security-Master.md Part 1 Rule 1: "No secrets in code"
// Security-Master.md Phase 10: Environment & Secrets Management
async function checkSecretsAndEnv(projectDir, fileContents) {
  const checks = [];

  // Detect whether the project has any real .env files (excluding .env.example/.env.sample/.env.template)
  let hasRealEnvFiles = false;
  for (const [filePath] of fileContents) {
    const base = path.basename(filePath).toLowerCase();
    if (base.startsWith(".env") && !base.includes("example") && !base.includes("sample") && !base.includes("template")) {
      hasRealEnvFiles = true;
      break;
    }
  }

  // Check 1: .gitignore exists (3 pts)
  const gitignorePath = path.join(projectDir, ".gitignore");
  const gitignoreContent = await safeReadFile(gitignorePath);
  if (gitignoreContent !== null) {
    checks.push(checkResult(
      ".gitignore exists", "Phase 10", 3, 3, "pass",
      ".gitignore file found",
    ));
  } else {
    checks.push(checkResult(
      ".gitignore exists", "Phase 10", 3, 0, "fail",
      "No .gitignore file found. Create one to prevent committing secrets, node_modules, build artifacts, and IDE files.",
      [{ file: ".gitignore", message: "Missing .gitignore file" }],
    ));
  }

  // Check 2: .gitignore covers .env files (4 pts)
  if (gitignoreContent !== null) {
    const envPatterns = [".env", ".env.local", ".env.*.local", ".env.production"];
    const lines = gitignoreContent.split("\n").map((l) => l.trim());
    const coversEnv = envPatterns.some((p) =>
      lines.some((line) => line === p || line === `${p}*` || line === ".env*" || line === ".env.*"),
    );

    if (coversEnv) {
      checks.push(checkResult(
        ".gitignore covers .env files", "Phase 10", 4, 4, "pass",
        ".gitignore includes .env patterns",
      ));
    } else if (hasRealEnvFiles) {
      checks.push(checkResult(
        ".gitignore covers .env files", "Phase 10", 4, 0, "fail",
        ".gitignore does not cover .env files but .env files exist. Add .env* to .gitignore.",
        [{ file: ".gitignore", message: "Missing .env* patterns in .gitignore" }],
      ));
    } else {
      checks.push(checkResult(
        ".gitignore covers .env files", "Phase 10", 4, 4, "pass",
        "No .env files in project — .gitignore coverage not required",
      ));
    }
  } else if (hasRealEnvFiles) {
    checks.push(checkResult(
      ".gitignore covers .env files", "Phase 10", 4, 0, "fail",
      ".gitignore missing and .env files exist — secrets may be committed",
      [{ file: ".gitignore", message: ".gitignore missing entirely" }],
    ));
  } else {
    checks.push(checkResult(
      ".gitignore covers .env files", "Phase 10", 4, 4, "pass",
      "No .env files in project — .gitignore coverage not required",
    ));
  }

  // Check 3: No .env files tracked in git (5 pts)
  const gitDir = path.join(projectDir, ".git");
  if (await isDirectory(gitDir)) {
    const result = await execCommandSafe("git ls-files --cached", { cwd: projectDir });
    if (!result.error) {
      const trackedFiles = result.stdout.split("\n").filter(Boolean);
      const trackedEnvFiles = trackedFiles.filter((f) => {
        const base = path.basename(f).toLowerCase();
        return base.startsWith(".env") && !base.includes("example") && !base.includes("sample") && !base.includes("template");
      });

      if (trackedEnvFiles.length === 0) {
        checks.push(checkResult(
          "No .env files tracked in git", "Phase 10", 5, 5, "pass",
          "No .env files found in git index",
        ));
      } else {
        checks.push(checkResult(
          "No .env files tracked in git", "Phase 10", 5, 0, "fail",
          `${trackedEnvFiles.length} .env file(s) tracked in git`,
          trackedEnvFiles.map((f) => ({ file: f, message: `${f} is tracked in git — contains potential secrets` })),
        ));
      }
    } else {
      checks.push(checkResult(
        "No .env files tracked in git", "Phase 10", 5, 5, "skip",
        "Could not run git ls-files",
      ));
    }
  } else {
    // Not a git repo — check for .env files in directory
    const envFiles = [];
    for (const [filePath] of fileContents) {
      const base = path.basename(filePath).toLowerCase();
      if (base.startsWith(".env") && !base.includes("example") && !base.includes("sample")) {
        envFiles.push(filePath);
      }
    }
    if (envFiles.length === 0) {
      checks.push(checkResult(
        "No .env files in project", "Phase 10", 5, 5, "pass",
        "No .env files found (not a git repo)",
      ));
    } else {
      checks.push(checkResult(
        "No .env files in project", "Phase 10", 5, 3, "warn",
        `${envFiles.length} .env file(s) found. Not a git repo so tracking status unknown.`,
        envFiles.map((f) => ({ file: relPath(projectDir, f), message: "Ensure this file is not deployed or shared" })),
      ));
    }
  }

  // Check 4: No hardcoded secrets in source code (8 pts)
  const secretIssues = [];
  for (const [filePath, content] of fileContents) {
    const baseName = path.basename(filePath);
    if (SECRET_SCAN_EXCLUDE_FILES.has(baseName)) continue;
    if (baseName.toLowerCase().startsWith(".env")) continue;

    const ext = path.extname(filePath).toLowerCase();
    if (!SCAN_SOURCE_EXTENSIONS.has(ext) && ext !== ".json" && ext !== ".yaml" && ext !== ".yml") continue;

    for (const sp of SECRET_PATTERNS) {
      sp.pattern.lastIndex = 0;
      let match;
      while ((match = sp.pattern.exec(content)) !== null) {
        // Skip obvious false positives
        const context = content.substring(Math.max(0, match.index - 40), match.index + match[0].length + 40);
        if (/process\.env|os\.environ|ENV\[|getenv|env\(|\.env\./i.test(context)) continue;
        if (/example|placeholder|your[_-]|xxx|changeme|TODO|FIXME/i.test(match[0])) continue;

        const line = content.substring(0, match.index).split("\n").length;
        secretIssues.push({
          file: relPath(projectDir, filePath),
          line,
          message: `${sp.name} found at line ${line}`,
          match: mask(match[0]),
        });
      }
    }
  }

  if (secretIssues.length === 0) {
    checks.push(checkResult(
      "No hardcoded secrets in source", "Part 1 Rule 1", 8, 8, "pass",
      "No hardcoded secrets detected in source files",
    ));
  } else {
    const earned = secretIssues.length <= 2 ? 4 : 0;
    checks.push(checkResult(
      "No hardcoded secrets in source", "Part 1 Rule 1", 8, earned, secretIssues.length <= 2 ? "warn" : "fail",
      `${secretIssues.length} potential secret(s) found in source code`,
      secretIssues,
    ));
  }

  // Check 5: No private keys committed (5 pts)
  const keyIssues = [];
  for (const [filePath, content] of fileContents) {
    if (/-----BEGIN (?:RSA |EC |DSA |OPENSSH )?PRIVATE KEY-----/.test(content)) {
      keyIssues.push({
        file: relPath(projectDir, filePath),
        message: "Private key found in file",
      });
    }
  }

  if (keyIssues.length === 0) {
    checks.push(checkResult(
      "No private keys in repo", "Part 1 Rule 1", 5, 5, "pass",
      "No private key files detected",
    ));
  } else {
    checks.push(checkResult(
      "No private keys in repo", "Part 1 Rule 1", 5, 0, "fail",
      `${keyIssues.length} private key(s) found`,
      keyIssues,
    ));
  }

  return { name: "Secrets & Environment", checks };
}

// ---- Category 2: Dependencies (15 pts) ----
// Security-Master.md Phase 12: Dependency Security
async function checkDependencies(projectDir, fileContents) {
  const checks = [];
  const pkgJsonPath = path.join(projectDir, "package.json");
  const hasPkgJson = await fileExists(pkgJsonPath);

  if (!hasPkgJson) {
    // Check for other lock files (Python, Go, Rust, etc.)
    const otherLocks = ["requirements.txt", "Pipfile.lock", "poetry.lock", "go.sum", "Cargo.lock", "Gemfile.lock", "composer.lock"];
    let foundLock = false;
    for (const lf of otherLocks) {
      if (await fileExists(path.join(projectDir, lf))) {
        foundLock = true;
        checks.push(checkResult(
          "Dependency lock file present", "Phase 12", 5, 5, "pass",
          `Lock file found: ${lf}`,
        ));
        break;
      }
    }
    if (!foundLock) {
      checks.push(checkResult(
        "Dependency lock file present", "Phase 12", 5, 0, "skip",
        "No recognized package manager detected",
      ));
    }

    checks.push(checkResult(
      "Dependency audit clean", "Phase 12", 10, 0, "skip",
      "No package.json found — npm audit skipped",
    ));

    return { name: "Dependencies", checks };
  }

  // Check 6: Lock file present (5 pts)
  const lockFiles = ["package-lock.json", "yarn.lock", "pnpm-lock.yaml"];
  let foundLock = null;
  for (const lf of lockFiles) {
    if (await fileExists(path.join(projectDir, lf))) {
      foundLock = lf;
      break;
    }
  }

  if (foundLock) {
    checks.push(checkResult(
      "Dependency lock file present", "Phase 12", 5, 5, "pass",
      `Lock file found: ${foundLock}`,
    ));
  } else {
    checks.push(checkResult(
      "Dependency lock file present", "Phase 12", 5, 0, "fail",
      "No lock file found. Run npm install to generate package-lock.json.",
      [{ file: "package-lock.json", message: "Missing lock file — builds may not be reproducible" }],
    ));
  }

  // Check 7: npm audit (10 pts)
  const auditResult = await execCommandSafe("npm audit --json 2>&1", { cwd: projectDir, timeout: 30000 });
  if (auditResult.stdout) {
    try {
      const audit = JSON.parse(auditResult.stdout);
      const vulns = audit.metadata ? audit.metadata.vulnerabilities : (audit.vulnerabilities || {});
      const critical = vulns.critical || 0;
      const high = vulns.high || 0;
      const moderate = vulns.moderate || 0;
      const low = vulns.low || 0;
      const total = critical + high + moderate + low;

      if (total === 0) {
        checks.push(checkResult(
          "Dependency audit clean", "Phase 12", 10, 10, "pass",
          "npm audit found no vulnerabilities",
        ));
      } else if (critical === 0 && high === 0) {
        checks.push(checkResult(
          "Dependency audit clean", "Phase 12", 10, 7, "warn",
          `npm audit: ${moderate} moderate, ${low} low vulnerability(ies)`,
          [{ file: "package.json", message: `${total} non-critical vulnerability(ies). Run npm audit fix.` }],
        ));
      } else {
        checks.push(checkResult(
          "Dependency audit clean", "Phase 12", 10, 0, "fail",
          `npm audit: ${critical} critical, ${high} high, ${moderate} moderate, ${low} low`,
          [{ file: "package.json", message: `${critical + high} critical/high vulnerability(ies). Run npm audit fix immediately.` }],
        ));
      }
    } catch {
      checks.push(checkResult(
        "Dependency audit clean", "Phase 12", 10, 0, "skip",
        "Could not parse npm audit output",
      ));
    }
  } else {
    checks.push(checkResult(
      "Dependency audit clean", "Phase 12", 10, 0, "skip",
      "npm audit could not be run (npm not available or no node_modules)",
    ));
  }

  return { name: "Dependencies", checks };
}

// ---- Category 3: Authentication & Sessions (15 pts) ----
// Security-Master.md Part 2: Authentication & Authorization Policy
async function checkAuthSessions(projectDir, fileContents) {
  const checks = [];
  let hasAuthCode = false;

  for (const [, content] of fileContents) {
    if (/(?:login|signIn|authenticate|session|passport|jwt|jsonwebtoken|bcrypt|argon2)/i.test(content)) {
      hasAuthCode = true;
      break;
    }
  }

  if (!hasAuthCode) {
    checks.push(checkResult("No tokens in localStorage", "Part 2 Rule 4", 5, 0, "skip", "No auth-related code detected"));
    checks.push(checkResult("Strong password hashing", "Part 2 Rule 6", 5, 0, "skip", "No auth-related code detected"));
    checks.push(checkResult("Secure cookie configuration", "Part 2 Rule 4", 5, 0, "skip", "No auth-related code detected"));
    return { name: "Auth & Sessions", checks };
  }

  // Check 8: No tokens stored in localStorage (5 pts)
  // Part 2 Rule 4: "Do not store tokens in localStorage"
  const localStorageIssues = [];
  for (const [filePath, content] of fileContents) {
    const ext = path.extname(filePath).toLowerCase();
    if (!SCAN_SOURCE_EXTENSIONS.has(ext)) continue;

    const tokenStoragePattern = /localStorage\.setItem\s*\(\s*['"](?:token|auth|jwt|session|access_token|refresh_token|id_token|bearer)['"]/gi;
    let match;
    while ((match = tokenStoragePattern.exec(content)) !== null) {
      const line = content.substring(0, match.index).split("\n").length;
      localStorageIssues.push({
        file: relPath(projectDir, filePath),
        line,
        message: `Token stored in localStorage at line ${line}`,
      });
    }
  }

  if (localStorageIssues.length === 0) {
    checks.push(checkResult(
      "No tokens in localStorage", "Part 2 Rule 4", 5, 5, "pass",
      "No localStorage token storage detected",
    ));
  } else {
    checks.push(checkResult(
      "No tokens in localStorage", "Part 2 Rule 4", 5, 0, "fail",
      `${localStorageIssues.length} instance(s) of token storage in localStorage. Use httpOnly cookies instead.`,
      localStorageIssues,
    ));
  }

  // Check 9: Strong password hashing (5 pts)
  // Part 2 Rule 6: "bcrypt/scrypt/argon2 only"
  let usesStrongHash = false;
  let usesWeakHash = false;
  const weakHashIssues = [];

  for (const [filePath, content] of fileContents) {
    const ext = path.extname(filePath).toLowerCase();
    if (!SCAN_SOURCE_EXTENSIONS.has(ext)) continue;

    if (/(?:bcrypt|argon2|scrypt)/i.test(content)) usesStrongHash = true;

    const weakPatterns = [
      { name: "MD5 for passwords", pattern: /(?:md5|createHash\s*\(\s*['"]md5).*(?:password|passwd|pwd)/gis },
      { name: "SHA1 for passwords", pattern: /(?:sha1|createHash\s*\(\s*['"]sha1).*(?:password|passwd|pwd)/gis },
      { name: "SHA256 for passwords (use bcrypt)", pattern: /(?:sha256|createHash\s*\(\s*['"]sha256).*(?:password|passwd|pwd)/gis },
    ];

    for (const wp of weakPatterns) {
      if (wp.pattern.test(content)) {
        usesWeakHash = true;
        weakHashIssues.push({
          file: relPath(projectDir, filePath),
          message: wp.name,
        });
      }
    }
  }

  if (usesStrongHash && !usesWeakHash) {
    checks.push(checkResult(
      "Strong password hashing", "Part 2 Rule 6", 5, 5, "pass",
      "Strong hashing algorithm detected (bcrypt/argon2/scrypt)",
    ));
  } else if (usesWeakHash) {
    checks.push(checkResult(
      "Strong password hashing", "Part 2 Rule 6", 5, 0, "fail",
      "Weak hashing algorithm used for passwords. Use bcrypt (cost >= 12), argon2, or scrypt.",
      weakHashIssues,
    ));
  } else {
    checks.push(checkResult(
      "Strong password hashing", "Part 2 Rule 6", 5, 3, "warn",
      "Auth code found but no explicit password hashing detected. Verify hashing is handled by auth provider.",
    ));
  }

  // Check 10: Secure cookie flags (5 pts)
  // Part 2 Rule 4: "httpOnly, Secure, SameSite=Strict cookies"
  let hasCookieConfig = false;
  let hasHttpOnly = false;
  let hasSecure = false;
  const cookieIssues = [];

  for (const [filePath, content] of fileContents) {
    const ext = path.extname(filePath).toLowerCase();
    if (!SCAN_SOURCE_EXTENSIONS.has(ext)) continue;

    if (/(?:cookie|setCookie|set-cookie|cookies\.set)/i.test(content)) {
      hasCookieConfig = true;
      if (/httpOnly\s*:\s*true/i.test(content) || /httponly/i.test(content)) hasHttpOnly = true;
      if (/secure\s*:\s*true/i.test(content)) hasSecure = true;

      if (/httpOnly\s*:\s*false/i.test(content)) {
        const line = content.split("\n").findIndex((l) => /httpOnly\s*:\s*false/i.test(l)) + 1;
        cookieIssues.push({ file: relPath(projectDir, filePath), line, message: "httpOnly set to false" });
      }
    }
  }

  if (!hasCookieConfig) {
    checks.push(checkResult(
      "Secure cookie configuration", "Part 2 Rule 4", 5, 0, "skip",
      "No cookie configuration detected",
    ));
  } else if (hasHttpOnly && hasSecure && cookieIssues.length === 0) {
    checks.push(checkResult(
      "Secure cookie configuration", "Part 2 Rule 4", 5, 5, "pass",
      "Cookies configured with httpOnly and Secure flags",
    ));
  } else {
    const missing = [];
    if (!hasHttpOnly) missing.push("httpOnly");
    if (!hasSecure) missing.push("Secure");
    checks.push(checkResult(
      "Secure cookie configuration", "Part 2 Rule 4", 5, hasHttpOnly ? 3 : 0, cookieIssues.length > 0 ? "fail" : "warn",
      `Cookie configuration missing: ${missing.join(", ") || "none"}. ${cookieIssues.length} issue(s).`,
      cookieIssues,
    ));
  }

  return { name: "Auth & Sessions", checks };
}

// ---- Category 4: Input & API Security (15 pts) ----
// Security-Master.md Part 3: API Standards
async function checkInputApi(projectDir, fileContents) {
  const checks = [];
  const pkgJsonPath = path.join(projectDir, "package.json");
  const pkgContent = await safeReadFile(pkgJsonPath);
  let pkgJson = null;
  try { pkgJson = pkgContent ? JSON.parse(pkgContent) : null; } catch { /* ignore */ }

  const allDeps = pkgJson
    ? Object.keys(pkgJson.dependencies || {}).concat(Object.keys(pkgJson.devDependencies || {}))
    : [];

  // Check 11: Input validation library present (5 pts)
  // Part 3 Rule 1: "Validate all input — use zod/yup/joi"
  const validationLibs = ["zod", "yup", "joi", "@hapi/joi", "ajv", "superstruct", "valibot", "io-ts", "class-validator"];
  const foundValidation = validationLibs.filter((lib) => allDeps.includes(lib));

  let hasValidationImport = false;
  if (foundValidation.length === 0) {
    for (const [, content] of fileContents) {
      if (/(?:from\s+['"](?:zod|yup|joi|ajv|valibot|superstruct)['"]|require\s*\(\s*['"](?:zod|yup|joi|ajv|valibot)['"])/i.test(content)) {
        hasValidationImport = true;
        break;
      }
    }
  }

  if (foundValidation.length > 0 || hasValidationImport) {
    checks.push(checkResult(
      "Input validation library present", "Part 3 Rule 1", 5, 5, "pass",
      `Validation library found: ${foundValidation.join(", ") || "detected in imports"}`,
    ));
  } else if (pkgJson) {
    checks.push(checkResult(
      "Input validation library present", "Part 3 Rule 1", 5, 0, "fail",
      "No input validation library detected. Install zod, yup, or joi.",
      [{ file: "package.json", message: "Add a validation library (zod recommended)" }],
    ));
  } else {
    checks.push(checkResult(
      "Input validation library present", "Part 3 Rule 1", 5, 0, "skip",
      "No package.json found",
    ));
  }

  // Check 12: Rate limiting configured (5 pts)
  // Part 3 Rule 2: "Rate limit all public endpoints"
  const rateLimitLibs = ["express-rate-limit", "rate-limiter-flexible", "@nestjs/throttler", "bottleneck", "p-throttle", "limiter"];
  const foundRateLimit = rateLimitLibs.filter((lib) => allDeps.includes(lib));

  let hasRateLimitCode = false;
  if (foundRateLimit.length === 0) {
    for (const [, content] of fileContents) {
      if (/(?:rateLimit|rate[_-]?limit|throttle|RateLimiter|rateLimiter|Retry-After)/i.test(content)) {
        hasRateLimitCode = true;
        break;
      }
    }
  }

  if (foundRateLimit.length > 0 || hasRateLimitCode) {
    checks.push(checkResult(
      "Rate limiting configured", "Part 3 Rule 2", 5, 5, "pass",
      `Rate limiting found: ${foundRateLimit.join(", ") || "detected in code"}`,
    ));
  } else if (pkgJson) {
    checks.push(checkResult(
      "Rate limiting configured", "Part 3 Rule 2", 5, 0, "warn",
      "No rate limiting detected. Add rate limiting to public endpoints.",
      [{ file: "package.json", message: "Install express-rate-limit or equivalent" }],
    ));
  } else {
    checks.push(checkResult(
      "Rate limiting configured", "Part 3 Rule 2", 5, 0, "skip",
      "No package.json found",
    ));
  }

  // Check 13: CORS not using wildcard (5 pts)
  // Part 3: "CORS: specific origins only (never *)"
  const corsIssues = [];
  for (const [filePath, content] of fileContents) {
    const ext = path.extname(filePath).toLowerCase();
    if (!SCAN_SOURCE_EXTENSIONS.has(ext) && ext !== ".json") continue;

    const wildcardPatterns = [
      /(?:origin|Access-Control-Allow-Origin)\s*[=:]\s*['"]\*['"]/gi,
      /cors\s*\(\s*\)/gi, // cors() with no config defaults to *
    ];

    for (const wp of wildcardPatterns) {
      wp.lastIndex = 0;
      let match;
      while ((match = wp.exec(content)) !== null) {
        const line = content.substring(0, match.index).split("\n").length;
        corsIssues.push({
          file: relPath(projectDir, filePath),
          line,
          message: `CORS wildcard (*) at line ${line}`,
        });
      }
    }
  }

  if (corsIssues.length === 0) {
    let hasCors = false;
    for (const [, content] of fileContents) {
      if (/cors|Access-Control/i.test(content)) { hasCors = true; break; }
    }
    if (hasCors) {
      checks.push(checkResult(
        "CORS properly configured", "Part 3", 5, 5, "pass",
        "CORS found with no wildcard origins",
      ));
    } else {
      checks.push(checkResult(
        "CORS properly configured", "Part 3", 5, 0, "skip",
        "No CORS configuration detected",
      ));
    }
  } else {
    checks.push(checkResult(
      "CORS properly configured", "Part 3", 5, 0, "fail",
      `${corsIssues.length} CORS wildcard (*) usage(s). Use specific origin whitelist.`,
      corsIssues,
    ));
  }

  return { name: "Input & API", checks };
}

// ---- Category 5: Security Headers & Transport (15 pts) ----
// Security-Master.md Phase 2: Security Headers
async function checkHeadersTransport(projectDir, fileContents) {
  const checks = [];
  const pkgJsonPath = path.join(projectDir, "package.json");
  const pkgContent = await safeReadFile(pkgJsonPath);
  let pkgJson = null;
  try { pkgJson = pkgContent ? JSON.parse(pkgContent) : null; } catch { /* ignore */ }

  const allDeps = pkgJson
    ? Object.keys(pkgJson.dependencies || {}).concat(Object.keys(pkgJson.devDependencies || {}))
    : [];

  // Check 14: Security headers configured (5 pts)
  // Phase 2: X-XSS-Protection, X-Content-Type-Options, X-Frame-Options, HSTS, CSP
  let hasHelmet = allDeps.includes("helmet");
  let hasSecurityHeaders = false;
  const headerKeywords = [
    "X-Content-Type-Options", "X-Frame-Options", "X-XSS-Protection",
    "Strict-Transport-Security", "Content-Security-Policy", "Referrer-Policy",
    "Permissions-Policy",
  ];

  for (const [filePath, content] of fileContents) {
    const ext = path.extname(filePath).toLowerCase();
    if (!SCAN_SOURCE_EXTENSIONS.has(ext) && ext !== ".json" && ext !== ".js" && ext !== ".mjs") continue;

    if (/helmet/i.test(content)) hasHelmet = true;
    for (const kw of headerKeywords) {
      if (content.includes(kw)) { hasSecurityHeaders = true; break; }
    }
    if (hasSecurityHeaders) break;
  }

  // Check next.config.js/mjs for headers
  for (const cfgName of ["next.config.js", "next.config.mjs", "next.config.ts"]) {
    const cfgContent = await safeReadFile(path.join(projectDir, cfgName));
    if (cfgContent && /headers|X-Frame-Options|Content-Security-Policy/i.test(cfgContent)) {
      hasSecurityHeaders = true;
    }
  }

  if (hasHelmet || hasSecurityHeaders) {
    checks.push(checkResult(
      "Security headers configured", "Phase 2", 5, 5, "pass",
      hasHelmet ? "Helmet middleware detected" : "Security headers found in configuration",
    ));
  } else if (pkgJson) {
    checks.push(checkResult(
      "Security headers configured", "Phase 2", 5, 0, "warn",
      "No security headers detected. Add helmet or configure headers manually.",
      [{ file: "package.json", message: "Install helmet or add security headers to your server config" }],
    ));
  } else {
    checks.push(checkResult(
      "Security headers configured", "Phase 2", 5, 0, "skip",
      "No server configuration detected",
    ));
  }

  // Check 15: No internal error exposure (5 pts)
  // Part 3 Rule 4: "Never expose internal errors"
  const errorExposureIssues = [];
  for (const [filePath, content] of fileContents) {
    const ext = path.extname(filePath).toLowerCase();
    if (!SCAN_SOURCE_EXTENSIONS.has(ext)) continue;
    const baseName = path.basename(filePath).toLowerCase();
    if (baseName.includes("test") || baseName.includes("spec") || baseName.includes(".d.ts")) continue;

    const patterns = [
      { name: "Stack trace in response", pattern: /(?:res\.(?:json|send|status)|Response\.json)\s*\([^)]*(?:error\.stack|err\.stack|\.stack)/gi },
      { name: "SQL error in response", pattern: /(?:res\.(?:json|send)|Response\.json)\s*\([^)]*(?:sql|query|sequelize|prisma).*error/gi },
    ];

    for (const ep of patterns) {
      ep.pattern.lastIndex = 0;
      let match;
      while ((match = ep.pattern.exec(content)) !== null) {
        const line = content.substring(0, match.index).split("\n").length;
        errorExposureIssues.push({
          file: relPath(projectDir, filePath),
          line,
          message: `${ep.name} at line ${line}`,
        });
      }
    }
  }

  if (errorExposureIssues.length === 0) {
    checks.push(checkResult(
      "No internal error exposure", "Part 3 Rule 4", 5, 5, "pass",
      "No stack traces or internal errors exposed in responses",
    ));
  } else {
    checks.push(checkResult(
      "No internal error exposure", "Part 3 Rule 4", 5, 0, "fail",
      `${errorExposureIssues.length} potential internal error exposure(s)`,
      errorExposureIssues,
    ));
  }

  // Check 16: HTTPS enforcement (5 pts)
  let hasHttpsEnforcement = false;
  for (const [, content] of fileContents) {
    if (/(?:Strict-Transport-Security|HSTS|forceSSL|requireHTTPS|redirect.*https|https:\/\/)/i.test(content)) {
      hasHttpsEnforcement = true;
      break;
    }
  }

  // Check for Vercel/Netlify/cloud deploy (auto-HTTPS)
  const cloudConfigs = ["vercel.json", "netlify.toml", "fly.toml", "render.yaml", "railway.json", "Procfile"];
  let hasCloudDeploy = false;
  for (const cf of cloudConfigs) {
    if (await fileExists(path.join(projectDir, cf))) {
      hasCloudDeploy = true;
      break;
    }
  }

  if (hasHttpsEnforcement || hasCloudDeploy) {
    checks.push(checkResult(
      "HTTPS enforcement", "Phase 2", 5, 5, "pass",
      hasCloudDeploy ? "Cloud platform detected (auto-HTTPS)" : "HTTPS enforcement found in code",
    ));
  } else {
    checks.push(checkResult(
      "HTTPS enforcement", "Phase 2", 5, 3, "warn",
      "No explicit HTTPS enforcement detected. Ensure HTTPS in production.",
    ));
  }

  return { name: "Headers & Transport", checks };
}

// ---- Category 6: Database Security (15 pts) ----
// Security-Master.md Part 1 Rule 4: Database access control
// Security-Master.md Phase 8: Database Security
async function checkDatabase(projectDir, fileContents) {
  const checks = [];
  const pkgJsonPath = path.join(projectDir, "package.json");
  const pkgContent = await safeReadFile(pkgJsonPath);
  let pkgJson = null;
  try { pkgJson = pkgContent ? JSON.parse(pkgContent) : null; } catch { /* ignore */ }

  const allDeps = pkgJson
    ? Object.keys(pkgJson.dependencies || {}).concat(Object.keys(pkgJson.devDependencies || {}))
    : [];

  let hasDbCode = false;
  for (const [, content] of fileContents) {
    if (/(?:prisma|sequelize|typeorm|mongoose|knex|pg|mysql|sqlite|mongodb|supabase|drizzle|\.query\(|\.execute\(|SELECT\s|INSERT\s|UPDATE\s|DELETE\s)/i.test(content)) {
      hasDbCode = true;
      break;
    }
  }

  if (!hasDbCode) {
    checks.push(checkResult("ORM or parameterized queries", "Phase 8", 5, 0, "skip", "No database code detected"));
    checks.push(checkResult("No SQL injection patterns", "Phase 8", 5, 0, "skip", "No database code detected"));
    checks.push(checkResult("DB credentials not hardcoded", "Phase 8", 5, 0, "skip", "No database code detected"));
    return { name: "Database", checks };
  }

  // Check 17: ORM or parameterized queries (5 pts)
  const ormLibs = ["prisma", "@prisma/client", "sequelize", "typeorm", "mongoose", "knex", "drizzle-orm", "@supabase/supabase-js", "objection", "bookshelf", "mikro-orm"];
  const foundOrm = ormLibs.filter((lib) => allDeps.includes(lib));

  let hasOrmImport = false;
  if (foundOrm.length === 0) {
    for (const [, content] of fileContents) {
      if (/(?:from\s+['"](?:prisma|sequelize|typeorm|mongoose|knex|drizzle))/i.test(content)) {
        hasOrmImport = true;
        break;
      }
    }
  }

  if (foundOrm.length > 0 || hasOrmImport) {
    checks.push(checkResult(
      "ORM or parameterized queries", "Phase 8", 5, 5, "pass",
      `ORM detected: ${foundOrm.join(", ") || "detected in imports"}`,
    ));
  } else {
    checks.push(checkResult(
      "ORM or parameterized queries", "Phase 8", 5, 0, "warn",
      "No ORM detected. Ensure parameterized queries are used for all database operations.",
    ));
  }

  // Check 18: No SQL injection patterns (5 pts)
  const sqlInjectionIssues = [];
  for (const [filePath, content] of fileContents) {
    const ext = path.extname(filePath).toLowerCase();
    if (!SCAN_SOURCE_EXTENSIONS.has(ext)) continue;
    const baseName = path.basename(filePath).toLowerCase();
    if (baseName.includes("test") || baseName.includes("spec") || baseName.includes("migration")) continue;

    const patterns = [
      { name: "Template literal in SQL query", pattern: /(?:query|execute|raw)\s*\(\s*`[^`]*(?:SELECT|INSERT|UPDATE|DELETE)[^`]*\$\{/gis },
      { name: "String concatenation in SQL", pattern: /(?:query|execute|raw)\s*\(\s*['"](?:SELECT|INSERT|UPDATE|DELETE)[^'"]*['"]\s*\+\s*(?!['"])/gis },
    ];

    for (const sp of patterns) {
      sp.pattern.lastIndex = 0;
      let match;
      while ((match = sp.pattern.exec(content)) !== null) {
        const line = content.substring(0, match.index).split("\n").length;
        sqlInjectionIssues.push({
          file: relPath(projectDir, filePath),
          line,
          message: `${sp.name} at line ${line}`,
        });
      }
    }
  }

  if (sqlInjectionIssues.length === 0) {
    checks.push(checkResult(
      "No SQL injection patterns", "Phase 8", 5, 5, "pass",
      "No SQL injection patterns detected",
    ));
  } else {
    checks.push(checkResult(
      "No SQL injection patterns", "Phase 8", 5, 0, "fail",
      `${sqlInjectionIssues.length} potential SQL injection pattern(s). Use parameterized queries.`,
      sqlInjectionIssues,
    ));
  }

  // Check 19: DB credentials not hardcoded (5 pts)
  const dbCredIssues = [];
  for (const [filePath, content] of fileContents) {
    const ext = path.extname(filePath).toLowerCase();
    if (!SCAN_SOURCE_EXTENSIONS.has(ext)) continue;
    const baseName = path.basename(filePath);
    if (SECRET_SCAN_EXCLUDE_FILES.has(baseName)) continue;

    const patterns = [
      { name: "Hardcoded DB connection string", pattern: /(?:postgres|postgresql|mysql|mongodb|mongodb\+srv|redis):\/\/[a-zA-Z0-9_]+:[^@\s'"]+@[^\s'"]+/gi },
      { name: "Hardcoded DB password", pattern: /(?:DB_PASSWORD|DATABASE_PASSWORD|MONGO_PASSWORD|PG_PASSWORD|MYSQL_PASSWORD)\s*[=:]\s*['"][^'"]{4,}['"]/gi },
    ];

    for (const dp of patterns) {
      dp.pattern.lastIndex = 0;
      let match;
      while ((match = dp.pattern.exec(content)) !== null) {
        const context = content.substring(Math.max(0, match.index - 30), match.index + match[0].length + 30);
        if (/process\.env|os\.environ|ENV\[/i.test(context)) continue;

        const line = content.substring(0, match.index).split("\n").length;
        dbCredIssues.push({
          file: relPath(projectDir, filePath),
          line,
          message: `${dp.name} at line ${line}`,
        });
      }
    }
  }

  if (dbCredIssues.length === 0) {
    checks.push(checkResult(
      "DB credentials not hardcoded", "Phase 8", 5, 5, "pass",
      "No hardcoded database credentials found",
    ));
  } else {
    checks.push(checkResult(
      "DB credentials not hardcoded", "Phase 8", 5, 0, "fail",
      `${dbCredIssues.length} hardcoded DB credential(s). Use environment variables.`,
      dbCredIssues,
    ));
  }

  return { name: "Database", checks };
}

// ---- Category 7: Frontend Code Security (15 pts) ----
// security-best-practices references: javascript-general, react, vue, next.js
async function checkFrontendSecurity(projectDir, fileContents) {
  const checks = [];

  const jsTsFiles = [...fileContents.entries()].filter(([fp]) => {
    const ext = path.extname(fp).toLowerCase();
    return [".js", ".ts", ".jsx", ".tsx", ".mjs", ".cjs", ".vue"].includes(ext);
  });

  if (jsTsFiles.length === 0) {
    checks.push(checkResult("No dynamic code execution", "security-best-practices/js-general", 5, 0, "skip", "No JS/TS files found"));
    checks.push(checkResult("No unsafe HTML injection sinks", "security-best-practices/react-vue", 5, 0, "skip", "No JS/TS files found"));
    checks.push(checkResult("No client-side secret exposure", "security-best-practices/next-react-vue", 5, 0, "skip", "No JS/TS files found"));
    return { name: "Frontend Security", checks };
  }

  // Check: No eval() / new Function() with dynamic args (5 pts)
  const evalIssues = [];
  for (const [filePath, content] of jsTsFiles) {
    // Exclude test files and comments
    const lines = content.split("\n");
    lines.forEach((line, idx) => {
      const trimmed = line.trim();
      if (trimmed.startsWith("//") || trimmed.startsWith("*")) return;
      // eval(variable) — skip eval("literal string") as those are lower risk
      if (/\beval\s*\(\s*(?!['"`])/.test(line)) {
        evalIssues.push({ file: relPath(projectDir, filePath), line: idx + 1, message: "eval() with dynamic argument" });
      }
      // new Function(variable...) — skip new Function() with all literals
      if (/new\s+Function\s*\([^)]*(?:req\.|res\.|params|query|body|input|user|data)/.test(line)) {
        evalIssues.push({ file: relPath(projectDir, filePath), line: idx + 1, message: "new Function() with dynamic argument" });
      }
      // setTimeout/setInterval with a string argument containing a variable
      if (/(?:setTimeout|setInterval)\s*\(\s*(?!['"`])/.test(line) && !/(?:setTimeout|setInterval)\s*\(\s*(?:function|\()/.test(line)) {
        evalIssues.push({ file: relPath(projectDir, filePath), line: idx + 1, message: "setTimeout/setInterval with string argument" });
      }
    });
  }

  if (evalIssues.length === 0) {
    checks.push(checkResult("No dynamic code execution", "security-best-practices/js-general", 5, 5, "pass", "No eval() or dynamic Function() usage detected"));
  } else {
    checks.push(checkResult(
      "No dynamic code execution", "security-best-practices/js-general", 5, 0, "fail",
      `${evalIssues.length} instance(s) of dynamic code execution (eval/Function/setTimeout). Refactor to static functions.`,
      evalIssues,
    ));
  }

  // Check: No unsafe HTML injection sinks — dangerouslySetInnerHTML, v-html (5 pts)
  const htmlSinkIssues = [];
  const sanitizers = ["DOMPurify", "sanitizeHtml", "sanitize-html", "xss", "isomorphic-dompurify"];

  for (const [filePath, content] of jsTsFiles) {
    const hasSanitizer = sanitizers.some((s) => content.includes(s));
    const lines = content.split("\n");

    lines.forEach((line, idx) => {
      const trimmed = line.trim();
      if (trimmed.startsWith("//") || trimmed.startsWith("*")) return;

      // React dangerouslySetInnerHTML
      if (/dangerouslySetInnerHTML/.test(line) && !hasSanitizer) {
        htmlSinkIssues.push({ file: relPath(projectDir, filePath), line: idx + 1, message: "dangerouslySetInnerHTML without sanitizer" });
      }
      // Vue v-html
      if (/v-html\s*=/.test(line) && !hasSanitizer) {
        htmlSinkIssues.push({ file: relPath(projectDir, filePath), line: idx + 1, message: "v-html without sanitizer (DOMPurify etc.)" });
      }
      // jQuery .html() with variable
      if (/\$\(.*\)\.html\s*\(\s*(?!['"`])/.test(line) || /\.html\s*\(\s*(?:req\.|res\.|params|query|body|user|data|input)/.test(line)) {
        htmlSinkIssues.push({ file: relPath(projectDir, filePath), line: idx + 1, message: "jQuery .html() with dynamic content" });
      }
    });
  }

  if (htmlSinkIssues.length === 0) {
    checks.push(checkResult("No unsafe HTML injection sinks", "security-best-practices/react-vue", 5, 5, "pass", "No unsafe innerHTML/dangerouslySetInnerHTML/v-html sinks detected"));
  } else {
    checks.push(checkResult(
      "No unsafe HTML injection sinks", "security-best-practices/react-vue", 5, 0, "fail",
      `${htmlSinkIssues.length} unsafe HTML sink(s). Use a sanitizer like DOMPurify before injecting HTML.`,
      htmlSinkIssues,
    ));
  }

  // Check: No client-side secret exposure via env vars (5 pts)
  // NEXT_PUBLIC_*, REACT_APP_*, VITE_* should never hold real secrets
  const clientSecretIssues = [];
  const clientSecretPattern = /(?:NEXT_PUBLIC_|REACT_APP_|VITE_)(?:SECRET|KEY|TOKEN|PASSWORD|PASS|PWD|API_KEY|PRIVATE|AUTH)\s*[=:]\s*['"][^'"]{8,}['"]/gi;

  for (const [filePath, content] of fileContents) {
    const base = path.basename(filePath).toLowerCase();
    // Only check .env files and source files, skip .env.example/.env.sample
    if (base.includes("example") || base.includes("sample") || base.includes("template")) continue;

    let match;
    clientSecretPattern.lastIndex = 0;
    while ((match = clientSecretPattern.exec(content)) !== null) {
      const line = content.substring(0, match.index).split("\n").length;
      clientSecretIssues.push({ file: relPath(projectDir, filePath), line, message: `Client-exposed secret: ${match[0].substring(0, 40)}...` });
    }
  }

  if (clientSecretIssues.length === 0) {
    checks.push(checkResult("No client-side secret exposure", "security-best-practices/next-react-vue", 5, 5, "pass", "No secrets found in client-exposed env vars (NEXT_PUBLIC_, REACT_APP_, VITE_)"));
  } else {
    checks.push(checkResult(
      "No client-side secret exposure", "security-best-practices/next-react-vue", 5, 0, "fail",
      `${clientSecretIssues.length} secret(s) exposed via client-side env vars. Move to server-only env vars.`,
      clientSecretIssues,
    ));
  }

  return { name: "Frontend Security", checks };
}

// ---- Category 8: Framework Configuration Security (13 pts) ----
// security-best-practices references: django, flask, express, next.js
async function checkFrameworkConfig(projectDir, fileContents) {
  const checks = [];

  // Detect frameworks present
  const allContent = [...fileContents.values()].join("\n");
  const hasDjango = /(?:from django|import django|DJANGO_SETTINGS_MODULE|django\.conf)/i.test(allContent);
  const hasFlask = /(?:from flask|import flask|Flask\(__name__\))/i.test(allContent);
  const hasExpress = /(?:require\(['"]express['"]\)|from ['"]express['"])/i.test(allContent);
  const hasPython = [...fileContents.keys()].some((fp) => fp.endsWith(".py"));
  const hasJS = [...fileContents.keys()].some((fp) => [".js", ".ts", ".mjs"].includes(path.extname(fp)));

  // Check: Django ALLOWED_HOSTS / DEBUG misconfiguration (5 pts)
  if (hasDjango) {
    const djangoIssues = [];

    for (const [filePath, content] of fileContents) {
      if (!filePath.endsWith(".py")) continue;
      const lines = content.split("\n");

      lines.forEach((line, idx) => {
        const trimmed = line.trim();
        if (trimmed.startsWith("#")) return;
        if (/ALLOWED_HOSTS\s*=\s*\[.*['"]\*['"]/.test(line)) {
          djangoIssues.push({ file: relPath(projectDir, filePath), line: idx + 1, message: "ALLOWED_HOSTS = ['*'] allows any host — set explicit domains in production" });
        }
        if (/^\s*DEBUG\s*=\s*True/.test(line) && !filePath.includes("test") && !filePath.includes("dev") && !filePath.includes("local")) {
          djangoIssues.push({ file: relPath(projectDir, filePath), line: idx + 1, message: "DEBUG = True — ensure this is not active in production" });
        }
      });
    }

    if (djangoIssues.length === 0) {
      checks.push(checkResult("Django: safe ALLOWED_HOSTS / DEBUG", "security-best-practices/django", 5, 5, "pass", "No ALLOWED_HOSTS=['*'] or unconditional DEBUG=True detected"));
    } else {
      checks.push(checkResult(
        "Django: safe ALLOWED_HOSTS / DEBUG", "security-best-practices/django", 5, 0, "fail",
        `${djangoIssues.length} Django configuration issue(s). Wildcard hosts and DEBUG=True expose the application.`,
        djangoIssues,
      ));
    }
  } else if (hasPython) {
    checks.push(checkResult("Django: safe ALLOWED_HOSTS / DEBUG", "security-best-practices/django", 5, 0, "skip", "Django not detected"));
  } else {
    checks.push(checkResult("Django: safe ALLOWED_HOSTS / DEBUG", "security-best-practices/django", 5, 0, "skip", "No Python project detected"));
  }

  // Check: No server-side template injection (SSTI) patterns (5 pts)
  const sstiIssues = [];

  for (const [filePath, content] of fileContents) {
    const ext = path.extname(filePath).toLowerCase();
    if (![".py", ".js", ".ts", ".mjs"].includes(ext)) continue;

    const lines = content.split("\n");
    lines.forEach((line, idx) => {
      const trimmed = line.trim();
      if (trimmed.startsWith("#") || trimmed.startsWith("//") || trimmed.startsWith("*")) return;

      // Flask/Jinja2: render_template_string(request.* or user input)
      if (/render_template_string\s*\(.*(?:request\.|form\[|args\[|json\[|data\[)/.test(line)) {
        sstiIssues.push({ file: relPath(projectDir, filePath), line: idx + 1, message: "render_template_string() with user-controlled input (SSTI)" });
      }
      // Django: Template(user_input)
      if (/Template\s*\(.*(?:request\.|GET\[|POST\[|data\[)/.test(line)) {
        sstiIssues.push({ file: relPath(projectDir, filePath), line: idx + 1, message: "Django Template() with user-controlled input (SSTI)" });
      }
      // Express: res.render(req.query.* or req.body.*)
      if (/res\.render\s*\(\s*req\.(?:query|body|params)/.test(line)) {
        sstiIssues.push({ file: relPath(projectDir, filePath), line: idx + 1, message: "res.render() with user-controlled template name (SSTI)" });
      }
    });
  }

  if (sstiIssues.length === 0) {
    checks.push(checkResult("No server-side template injection", "security-best-practices/flask-express", 5, 5, "pass", "No SSTI patterns (render_template_string/res.render with user input) detected"));
  } else {
    checks.push(checkResult(
      "No server-side template injection", "security-best-practices/flask-express", 5, 0, "fail",
      `${sstiIssues.length} SSTI risk(s). Never pass user-controlled strings directly to template engines.`,
      sstiIssues,
    ));
  }

  // Check: No Express MemoryStore session (3 pts)
  if (hasExpress) {
    const memStoreIssues = [];

    for (const [filePath, content] of fileContents) {
      const ext = path.extname(filePath).toLowerCase();
      if (![".js", ".ts", ".mjs", ".cjs"].includes(ext)) continue;

      if (/express-session|session\s*\(/.test(content)) {
        // MemoryStore is the default when no store: option is set alongside session()
        if (!/store\s*:/.test(content) && /session\s*\(\s*\{/.test(content)) {
          const line = content.split("\n").findIndex((l) => /session\s*\(\s*\{/.test(l)) + 1;
          memStoreIssues.push({ file: relPath(projectDir, filePath), line, message: "express-session configured without explicit store — defaults to MemoryStore (not production-safe)" });
        }
        // Explicit new MemoryStore() is always wrong
        if (/new\s+MemoryStore\s*\(/.test(content)) {
          const line = content.split("\n").findIndex((l) => /new\s+MemoryStore/.test(l)) + 1;
          memStoreIssues.push({ file: relPath(projectDir, filePath), line, message: "Explicit MemoryStore — leaks memory and resets on restart. Use Redis or DB store." });
        }
      }
    }

    if (memStoreIssues.length === 0) {
      checks.push(checkResult("Express: persistent session store", "security-best-practices/express", 3, 3, "pass", "No MemoryStore session configuration detected"));
    } else {
      checks.push(checkResult(
        "Express: persistent session store", "security-best-practices/express", 3, 0, "fail",
        `${memStoreIssues.length} Express session issue(s). Use connect-redis, connect-pg-simple, or similar persistent store.`,
        memStoreIssues,
      ));
    }
  } else if (hasJS) {
    checks.push(checkResult("Express: persistent session store", "security-best-practices/express", 3, 0, "skip", "Express not detected"));
  } else {
    checks.push(checkResult("Express: persistent session store", "security-best-practices/express", 3, 0, "skip", "No JS project detected"));
  }

  return { name: "Framework Config", checks };
}

// ---- Utility helpers for scanner ----

function relPath(projectDir, filePath) {
  return path.relative(projectDir, filePath).replace(/\\/g, "/");
}

function mask(value) {
  if (value.length <= 12) return value.substring(0, 4) + "****";
  return value.substring(0, 8) + "****" + value.substring(value.length - 4);
}

function progressBar(percent, width) {
  const filled = Math.round((percent / 100) * width);
  const empty = width - filled;
  return "[" + "=".repeat(filled) + " ".repeat(empty) + "]";
}

function statusLabel(status) {
  switch (status) {
    case "pass": return "PASS";
    case "fail": return "FAIL";
    case "warn": return "WARN";
    case "skip": return "SKIP";
    default: return status.toUpperCase();
  }
}

function categoryStatus(checks) {
  if (checks.some((c) => c.status === "fail")) return "fail";
  if (checks.some((c) => c.status === "warn")) return "warn";
  if (checks.every((c) => c.status === "skip")) return "skip";
  return "pass";
}

// ---- Main scanner orchestrator ----

async function runSecurityScan(projectDir) {
  // Collect all files
  const filePaths = await walkProjectFiles(projectDir);

  // Read all files into memory
  const fileContents = new Map();
  for (const fp of filePaths) {
    const content = await safeReadFile(fp);
    if (content !== null) {
      fileContents.set(fp, content);
    }
  }

  console.log(`  Scanned ${fileContents.size} file(s)\n`);

  // Run all category checks
  const categories = [
    await checkSecretsAndEnv(projectDir, fileContents),
    await checkDependencies(projectDir, fileContents),
    await checkAuthSessions(projectDir, fileContents),
    await checkInputApi(projectDir, fileContents),
    await checkHeadersTransport(projectDir, fileContents),
    await checkDatabase(projectDir, fileContents),
    await checkFrontendSecurity(projectDir, fileContents),
    await checkFrameworkConfig(projectDir, fileContents),
  ];

  // Calculate scores
  let totalPoints = 0;
  let totalEarned = 0;
  let applicablePoints = 0;
  let totalIssues = 0;
  let totalWarnings = 0;

  for (const category of categories) {
    for (const check of category.checks) {
      totalPoints += check.points;
      if (check.status !== "skip") {
        applicablePoints += check.points;
        totalEarned += check.earned;
      }
      if (check.status === "fail") totalIssues += check.issues.length || 1;
      if (check.status === "warn") totalWarnings += 1;
    }
  }

  const percentage = applicablePoints > 0 ? Math.round((totalEarned / applicablePoints) * 100) : 100;

  return {
    categories,
    totalPoints,
    totalEarned,
    applicablePoints,
    percentage,
    totalIssues,
    totalWarnings,
    projectDir,
    timestamp: new Date().toISOString(),
    filesScanned: fileContents.size,
  };
}

// ---- CLI output formatter ----

function printScanResults(results) {
  console.log("  YEKNAL SECURITY SCAN");
  console.log("  ====================\n");

  const idx = { n: 0 };
  const totalCats = results.categories.length;

  for (const category of results.categories) {
    idx.n++;
    const catEarned = category.checks.reduce((sum, c) => sum + (c.status !== "skip" ? c.earned : 0), 0);
    const catApplicable = category.checks.reduce((sum, c) => sum + (c.status !== "skip" ? c.points : 0), 0);
    const catStatus = categoryStatus(category.checks);

    if (catApplicable === 0) {
      console.log(`  [${idx.n}/${totalCats}] ${padEnd(category.name, 28)} ${"--/--".padStart(7)}  ${statusLabel("skip")}`);
    } else {
      const catPct = Math.round((catEarned / catApplicable) * 100);
      const scoreStr = `${catEarned}/${catApplicable}`.padStart(7);
      console.log(`  [${idx.n}/${totalCats}] ${padEnd(category.name, 28)} ${scoreStr}  ${statusLabel(catStatus)}`);
    }
  }

  console.log("\n  " + "-".repeat(50));
  console.log(`  Overall: ${results.totalEarned}/${results.applicablePoints} applicable points`);
  console.log(`\n  Security Score: ${results.percentage}%`);
  console.log("  " + progressBar(results.percentage, 30));

  if (results.totalIssues > 0 || results.totalWarnings > 0) {
    const parts = [];
    if (results.totalIssues > 0) parts.push(`${results.totalIssues} issue(s)`);
    if (results.totalWarnings > 0) parts.push(`${results.totalWarnings} warning(s)`);
    console.log(`\n  ${parts.join(", ")} found`);
  } else {
    console.log("\n  No issues found");
  }
}

function padEnd(str, len) {
  while (str.length < len) str += " ";
  return str;
}

// ---- Detailed log generator ----

function generateSecurityLog(results) {
  const lines = [];

  lines.push("=".repeat(60));
  lines.push("YEKNAL SECURITY SCAN REPORT");
  lines.push("=".repeat(60));
  lines.push("");
  lines.push(`Date:            ${results.timestamp}`);
  lines.push(`Project:         ${results.projectDir}`);
  lines.push(`Files scanned:   ${results.filesScanned}`);
  lines.push(`Security Score:  ${results.percentage}% (${results.totalEarned}/${results.applicablePoints} applicable points)`);
  lines.push(`Issues:          ${results.totalIssues}`);
  lines.push(`Warnings:        ${results.totalWarnings}`);
  lines.push("");
  lines.push("Based on: Security-Master.md (yeknal security guidelines)");
  lines.push("Reference: https://github.com/tryraisins/MD_Files/blob/main/Security/Security-Master.md");
  lines.push("");

  for (const category of results.categories) {
    lines.push("-".repeat(60));
    lines.push(`CATEGORY: ${category.name.toUpperCase()}`);
    lines.push("-".repeat(60));
    lines.push("");

    for (const check of category.checks) {
      const icon = check.status === "pass" ? "[PASS]" : check.status === "fail" ? "[FAIL]" : check.status === "warn" ? "[WARN]" : "[SKIP]";
      lines.push(`  ${icon} ${check.name}`);
      lines.push(`         Points: ${check.earned}/${check.points} | Reference: Security-Master.md ${check.reference}`);
      lines.push(`         ${check.details}`);

      if (check.issues && check.issues.length > 0) {
        lines.push("");
        for (const issue of check.issues) {
          const loc = issue.line ? `${issue.file}:${issue.line}` : issue.file;
          lines.push(`         -> ${loc}`);
          lines.push(`            ${issue.message}`);
          if (issue.match) {
            lines.push(`            Value: ${issue.match}`);
          }
        }
      }

      lines.push("");
    }
  }

  // Recommendations
  lines.push("=".repeat(60));
  lines.push("RECOMMENDATIONS");
  lines.push("=".repeat(60));
  lines.push("");

  const failedChecks = [];
  const warnChecks = [];
  for (const category of results.categories) {
    for (const check of category.checks) {
      if (check.status === "fail") failedChecks.push(check);
      if (check.status === "warn") warnChecks.push(check);
    }
  }

  if (failedChecks.length > 0) {
    lines.push("CRITICAL (fix before shipping):");
    for (const check of failedChecks) {
      lines.push(`  - ${check.name}: ${check.details}`);
    }
    lines.push("");
  }

  if (warnChecks.length > 0) {
    lines.push("WARNINGS (should address):");
    for (const check of warnChecks) {
      lines.push(`  - ${check.name}: ${check.details}`);
    }
    lines.push("");
  }

  if (failedChecks.length === 0 && warnChecks.length === 0) {
    lines.push("No critical issues or warnings. Security posture looks good.");
    lines.push("");
  }

  lines.push("=".repeat(60));
  lines.push("END OF REPORT");
  lines.push("=".repeat(60));
  lines.push("");

  return lines.join("\n");
}

// ==========================================
// SECURITY SKILL SYNC
// ==========================================

async function syncSecuritySkills(targets) {
  console.log("\nSyncing security skills to agent directories...");

  let repoTree;
  let useClone = false;

  try {
    repoTree = await fetchRepoTree();
  } catch (error) {
    const message = error && error.message ? error.message : String(error);
    if (message.includes("GitHub API rate limit exceeded")) {
      console.log("  GitHub API rate-limited. Falling back to git clone...");
      useClone = true;
    } else {
      throw error;
    }
  }

  const tempRoot = await fsp.mkdtemp(path.join(os.tmpdir(), "yeknal-sec-skills-"));

  try {
    if (useClone) {
      const cloneRoot = await fsp.mkdtemp(path.join(os.tmpdir(), "yeknal-sec-repo-"));
      const repoPath = path.join(cloneRoot, "repo");
      const cloneUrl = `https://github.com/${GITHUB_USERNAME}/${GITHUB_REPO}.git`;

      try {
        await execCommand(`git clone --depth 1 --branch ${BRANCH} ${cloneUrl} "${repoPath}"`);
        for (const folder of SECURITY_REPO_FOLDERS) {
          const src = path.join(repoPath, folder);
          if (await isDirectory(src)) {
            await copyDirRecursive(src, path.join(tempRoot, folder));
          }
        }
      } finally {
        await fsp.rm(cloneRoot, { recursive: true, force: true });
      }
    } else {
      for (const folder of SECURITY_REPO_FOLDERS) {
        const files = listFilesForFolder(repoTree, folder);
        for (const repoPath of files) {
          const relativePath = repoPath.slice(folder.length + 1);
          const destPath = path.join(tempRoot, folder, relativePath);
          await downloadUrlToFile(buildRawFileUrl(repoPath), destPath);
        }
      }
    }

    // Install to each target
    let syncCount = 0;
    for (const target of targets) {
      try {
        await fsp.mkdir(target.skillsPath, { recursive: true });
        for (const folder of SECURITY_REPO_FOLDERS) {
          const src = path.join(tempRoot, folder);
          if (await isDirectory(src)) {
            const dest = path.join(target.skillsPath, folder);
            await fsp.rm(dest, { recursive: true, force: true });
            await copyDirRecursive(src, dest);
          }
        }
        syncCount++;
        console.log(`  [ok] ${target.label}: synced security skills to ${target.skillsPath}`);
      } catch (error) {
        console.error(`  [error] ${target.label}: ${error.message}`);
      }
    }

    return syncCount;
  } finally {
    await fsp.rm(tempRoot, { recursive: true, force: true });
  }
}

// ==========================================
// SECURITY COMMAND (COMBINED)
// ==========================================

async function runSecurityCommand() {
  const projectDir = process.cwd();

  console.log("\n  yeknal security");
  console.log("  ===============\n");

  // Step 1: Download Security-Master.md to current directory
  const masterUrl = `${RAW_BASE_URL}/Security/Security-Master.md`;
  const masterDest = path.join(projectDir, "Security-Master.md");
  console.log("  Downloading Security-Master.md...");
  try {
    await downloadUrlToFile(masterUrl, masterDest);
    console.log(`  Saved to: ${masterDest}`);
  } catch (error) {
    console.error(`  Could not download Security-Master.md: ${error.message}`);
  }

  // Step 2: Sync security skills to agent directories
  const targets = await resolveSkillTargets();
  if (targets.length > 0) {
    await syncSecuritySkills(targets);
  } else {
    console.log("\n  No agent directories found for skill sync.");
  }

  // Step 3: Run security scan on current project
  console.log(`\n  Scanning: ${projectDir}\n`);
  const results = await runSecurityScan(projectDir);

  // Step 4: Print results to CLI
  printScanResults(results);

  // Step 5: Write detailed log
  const logPath = path.join(projectDir, "yeknal-security.log");
  const logContent = generateSecurityLog(results);
  fs.writeFileSync(logPath, logContent);
  console.log(`\n  Full report: ${logPath}\n`);

  // Clean up downloaded files — only the log should remain
  if (fs.existsSync(masterDest)) {
    fs.unlinkSync(masterDest);
  }

  // Ensure yeknal-security.log is in .gitignore so it never gets pushed
  const gitignorePath = path.join(projectDir, ".gitignore");
  const logEntry = "yeknal-security.log";
  if (fs.existsSync(gitignorePath)) {
    const content = fs.readFileSync(gitignorePath, "utf8");
    if (!content.split("\n").some((line) => line.trim() === logEntry)) {
      fs.appendFileSync(gitignorePath, `\n${logEntry}\n`);
      console.log("  Added yeknal-security.log to .gitignore");
    }
  } else {
    fs.writeFileSync(gitignorePath, `# Security scan logs\n${logEntry}\n`);
    console.log("  Created .gitignore with yeknal-security.log");
  }

  // Exit with error code if critical issues found
  if (results.totalIssues > 0) {
    process.exitCode = 1;
  }
}

// ==========================================
// MAIN
// ==========================================

async function main() {
  const args = process.argv.slice(2);
  const command = args[0] ? args[0].toLowerCase() : null;

  if (!command) {
    console.error("Error: Missing command.");
    usage();
    process.exit(1);
  }

  if (command === "skills") {
    await runSkillsCommand();
    return;
  }

  if (command === "security") {
    await runSecurityCommand();
    return;
  }

  if (singleFileConfigs[command]) {
    await runSingleFileTemplateCommand(command);
    return;
  }

  console.error(`Error: Invalid command "${command}".`);
  usage();
  process.exit(1);
}

main().catch((error) => {
  console.error(`\nError: ${error.message}`);
  process.exit(1);
});
