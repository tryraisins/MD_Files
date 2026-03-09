#!/usr/bin/env node

/**
 * yeknal CLI
 * - Fetches markdown templates (security, design, seo).
 * - Syncs skill folders into local AI agent directories (skills command).
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
const CONTENTS_API_BASE = `https://api.github.com/repos/${GITHUB_USERNAME}/${GITHUB_REPO}/contents`;

const EXCLUDED_SKILL_FOLDERS = new Set(["Design", "Security", "Security_Raw", "SEO"]);

const singleFileConfigs = {
  security: {
    remotePath: "Security/Security-Master.md",
    localName: "Security-Master.md",
  },
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
  console.log("  npx yeknal security");
  console.log("  npx yeknal design");
  console.log("  npx yeknal seo");
  console.log("  npx yeknal skills\n");
}

function isHttpSuccess(statusCode) {
  return typeof statusCode === "number" && statusCode >= 200 && statusCode < 300;
}

function requestBuffer(url, redirectsRemaining = 5) {
  return new Promise((resolve, reject) => {
    const req = https.get(
      url,
      {
        headers: {
          "User-Agent": "yeknal-cli",
          Accept: "application/vnd.github+json",
        },
      },
      (res) => {
        const statusCode = res.statusCode || 0;

        if ([301, 302, 303, 307, 308].includes(statusCode) && res.headers.location) {
          if (redirectsRemaining <= 0) {
            reject(new Error(`Too many redirects requesting ${url}`));
            return;
          }
          res.resume();
          requestBuffer(res.headers.location, redirectsRemaining - 1).then(resolve).catch(reject);
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

function buildContentsApiUrl(repoPath) {
  const encoded = repoPath
    .split("/")
    .filter(Boolean)
    .map((segment) => encodeURIComponent(segment))
    .join("/");
  const endpoint = encoded ? `/${encoded}` : "";
  return `${CONTENTS_API_BASE}${endpoint}?ref=${encodeURIComponent(BRANCH)}`;
}

async function listRepoPath(repoPath) {
  const data = await fetchJson(buildContentsApiUrl(repoPath));
  return Array.isArray(data) ? data : [data];
}

async function folderHasTopLevelSkillFile(folderName) {
  const entries = await listRepoPath(folderName);
  return entries.some((entry) => entry.type === "file" && entry.name === "SKILL.md");
}

async function discoverSkillFolders() {
  const rootEntries = await listRepoPath("");
  const candidateDirs = rootEntries.filter(
    (entry) => entry.type === "dir" && !EXCLUDED_SKILL_FOLDERS.has(entry.name),
  );

  const checks = await Promise.all(
    candidateDirs.map(async (dir) => ({
      name: dir.name,
      hasSkillFile: await folderHasTopLevelSkillFile(dir.name),
    })),
  );

  return checks
    .filter((entry) => entry.hasSkillFile)
    .map((entry) => entry.name)
    .sort((a, b) => a.localeCompare(b));
}

async function downloadRepoFolderRecursive(repoPath, localFolderPath) {
  const entries = await listRepoPath(repoPath);
  await fsp.mkdir(localFolderPath, { recursive: true });

  for (const entry of entries) {
    const nextLocalPath = path.join(localFolderPath, entry.name);
    if (entry.type === "dir") {
      await downloadRepoFolderRecursive(entry.path, nextLocalPath);
      continue;
    }

    if (entry.type === "file") {
      if (!entry.download_url) {
        throw new Error(`Missing download URL for repo file: ${entry.path}`);
      }
      await downloadUrlToFile(entry.download_url, nextLocalPath);
    }
  }
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

async function isDirectory(filePath) {
  try {
    const stats = await fsp.stat(filePath);
    return stats.isDirectory();
  } catch {
    return false;
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

  const skillFolders = await discoverSkillFolders();
  if (skillFolders.length === 0) {
    throw new Error("No skill folders were discovered from the GitHub repository.");
  }

  console.log(`\nSkill folders to sync (${skillFolders.length}):`);
  console.log(`  ${skillFolders.join(", ")}`);

  const tempRoot = await fsp.mkdtemp(path.join(os.tmpdir(), "yeknal-skills-"));
  try {
    for (const folder of skillFolders) {
      const localFolder = path.join(tempRoot, folder);
      await downloadRepoFolderRecursive(folder, localFolder);
    }

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

function runSecurityAudit() {
  return new Promise((resolve) => {
    console.log("Running security audit (this may take a moment)...");
    exec("npx secure-repo audit", (error, stdout, stderr) => {
      const logPath = path.join(process.cwd(), "security-audit.log");

      const outputLines = stdout.split("\n");
      const finalLines = [];

      let inPolicySection = false;
      let policyPasses = 0;
      let policyWarnings = 0;
      let policyIssues = 0;
      let policyPoints = 0;

      for (let i = 0; i < outputLines.length; i++) {
        const line = outputLines[i];

        if (line.match(/^\s*Policy files:/)) {
          inPolicySection = true;
          continue;
        }

        if (inPolicySection) {
          if (
            line.match(/^\s*Environment files:/) ||
            line.match(/^\s*Secret scanning:/) ||
            line.match(/^\s*Configuration:/)
          ) {
            inPolicySection = false;
          } else {
            if (line.includes("[FAIL]")) policyIssues += 1;
            if (line.includes("[warn]")) policyWarnings += 1;
            if (line.includes("[pass]")) {
              policyPasses += 1;
              if (
                line.includes("SECURITY.md") ||
                line.includes("AUTH.md") ||
                line.includes("API.md") ||
                line.includes("ENV_VARIABLES.md")
              ) {
                policyPoints += 10;
              } else {
                policyPoints += 5;
              }
            }
            continue;
          }
        }

        if (line.match(/^\s*Security Score:\s*\d+\s*\/\s*\d+/)) {
          const match = line.match(/^\s*Security Score:\s*(\d+)/);
          if (match) {
            const oldScore = parseInt(match[1], 10);
            const newScore = oldScore - policyPoints;
            finalLines.push(`  Security Score: ${newScore} / 45`);
          } else {
            finalLines.push(line);
          }
          continue;
        }

        if (line.match(/^\s*Results:\s*\d+\s*passed,\s*\d+\s*warnings,\s*\d+\s*issues/)) {
          const match = line.match(
            /Results:\s*(\d+)\s*passed,\s*(\d+)\s*warnings,\s*(\d+)\s*issues/,
          );
          if (match) {
            const newPassed = parseInt(match[1], 10) - policyPasses;
            const newWarnings = parseInt(match[2], 10) - policyWarnings;
            const newIssues = parseInt(match[3], 10) - policyIssues;
            finalLines.push(
              `  Results: ${newPassed} passed, ${newWarnings} warnings, ${newIssues} issues`,
            );
          } else {
            finalLines.push(line);
          }
          continue;
        }

        if (line.match(/^\s*\d+\s*issue\(s\)\s*found/)) {
          const match = line.match(/^\s*(\d+)\s*issue\(s\)/);
          if (match) {
            const newIssues = parseInt(match[1], 10) - policyIssues;
            finalLines.push(`  ${newIssues} issue(s) found. Fix these before shipping.`);
          } else {
            finalLines.push(line);
          }
          continue;
        }

        if (line.includes("Run: npx secure-repo init") && line.includes("adds missing policy files")) {
          continue;
        }

        if (line.includes("Want deeper coverage? The pro pack adds")) {
          i += 2;
          continue;
        }

        finalLines.push(line);
      }

      const modifiedStdout = finalLines.join("\n");
      const output = `--- Security Audit Log ---\nDate: ${new Date().toISOString()}\n\n${modifiedStdout}\n${
        stderr ? `Errors/Warnings:\n${stderr}` : ""
      }`;

      fs.writeFileSync(logPath, output);

      const totalNewIssuesRegex = /^\s*(\d+)\s*issue\(s\)\s*found/m;
      const matchNewIssues = modifiedStdout.match(totalNewIssuesRegex);
      let hasIssues = error !== null;
      if (matchNewIssues) {
        hasIssues = parseInt(matchNewIssues[1], 10) > 0;
      }

      if (hasIssues) {
        console.log("Security audit found issues (or returned an error code).");
        console.log(`See ${logPath} for details.\n`);
      } else {
        console.log(`Security audit clean. Results saved to: ${logPath}\n`);
      }

      resolve();
    });
  });
}

async function runSingleFileTemplateCommand(category) {
  const config = singleFileConfigs[category];
  const fileUrl = `${RAW_BASE_URL}/${config.remotePath}`;
  const localDest = path.join(process.cwd(), config.localName);

  console.log(`\nFetching ${category} guidelines...`);
  await downloadUrlToFile(fileUrl, localDest);
  console.log(`Saved to: ${localDest}\n`);

  if (category === "security") {
    await runSecurityAudit();
  }
}

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
