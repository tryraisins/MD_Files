#!/usr/bin/env node

/**
 * yeknal CLI
 * Fetches Markdown files from a GitHub repository to the current working directory.
 */

const fs = require("fs");
const path = require("path");
const https = require("https");

// ==========================================
// USER CONFIGURATION (UPDATE THESE VALUES)
// ==========================================
const GITHUB_USERNAME = "tryraisins"; // e.g., 'your-github-username'
const GITHUB_REPO = "MD_Files"; // e.g., 'your-repo-name'
const BRANCH = "main"; // e.g., 'main' or 'master'
// ==========================================

// Base URL for GitHub raw content
const BASE_URL = `https://raw.githubusercontent.com/${GITHUB_USERNAME}/${GITHUB_REPO}/${BRANCH}`;

// Map commands to specific file paths in the GitHub repository
const configs = {
  security: {
    remotePath: "Security/Security-Master.md", // Path in your repo
    localName: "Security-Master.md", // Name saved locally
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

const args = process.argv.slice(2);
const category = args[0] ? args[0].toLowerCase() : null;

if (!category || !configs[category]) {
  console.error("❌ Error: Invalid or missing category.");
  console.log("\nUsage:");
  console.log("  npx yeknal security");
  console.log("  npx yeknal design");
  console.log("  npx yeknal seo\n");
  process.exit(1);
}

const config = configs[category];
const fileUrl = `${BASE_URL}/${config.remotePath}`;
const localDest = path.join(process.cwd(), config.localName);

console.log(`\n⏳ Fetching ${category} guidelines...`);

https
  .get(fileUrl, (res) => {
    if (res.statusCode !== 200) {
      console.error(
        `\n❌ Failed to download file. (HTTP Status: ${res.statusCode})`,
      );
      console.error(`Please verify that the file exists at:\n👉 ${fileUrl}\n`);
      console.error(
        `If the repository is private, this script needs a Personal Access Token.`,
      );
      process.exit(1);
    }

    const fileStream = fs.createWriteStream(localDest);
    res.pipe(fileStream);

    fileStream.on("finish", () => {
      fileStream.close();
      console.log(`✅ Successfully saved to: ${localDest}\n`);
    });
  })
  .on("error", (err) => {
    console.error("\n❌ Network error fetching file:", err.message);
    process.exit(1);
  });
