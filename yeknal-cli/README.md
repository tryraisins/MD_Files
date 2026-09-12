# yeknal

Sync reusable AI-agent skills and run a lightweight static security audit from the command line.

## Requirements

You do not need a global install. A new device needs:

- Node.js with npm;
- internet access;
- for user-level sync, at least one supported agent folder: Codex (`~/.codex`), Claude (`~/.claude`), Gemini Antigravity (`~/.gemini/antigravity`), or Antigravity (`~/.antigravity`);
- for project sync, a current directory inside a Git repository.

Git is optional and is used as a fallback when GitHub API or raw-file downloads remain unavailable after automatic retries.

## Commands

```bash
npx yeknal skills
npx yeknal skills --project --profile design
npx yeknal profiles
npx yeknal security
```

### `npx yeknal skills`

Downloads selected top-level skill folders from `tryraisins/MD_Files` on `main`, then installs them with the managed `yeknal-` prefix. Version 2 defaults to the 25-skill `core` profile instead of installing all 83 folders. The core keeps high-frequency process and reasoning management, canonical design, browser verification, and all four security workflows available globally.

```bash
# Core profile in detected user-level agent folders
npx yeknal skills

# An exact specialist pack in the current Git repository
npx yeknal skills --project --profile design

# Combine packs for one repository
npx yeknal skills --project --profile core,web

# Install only named skills in this repository
npx yeknal skills --project --skills nextjs-developer,vercel-deploy

# Preserve the pre-v2 full-catalog behavior
npx yeknal skills --all
```

Profiles are exact sets. Selecting `design` alone does not silently add `core`, which allows a user-level core install and a project-only specialist pack without duplicate skill names. `--skills` adds named skills to an explicitly selected profile, or installs only those names when no profile was supplied. Run `npx yeknal profiles` to list current profiles and counts.

The command:

- creates missing `skills` directories in supported agent folders;
- updates and removes only managed `yeknal-*` folders;
- preserves personal skill folders without that prefix;
- on Codex, skips repository skills already supplied by `~/.codex/skills/.system`;
- with `--project`, resolves the current Git root and syncs only that repository's `.agents/skills`; Codex discovers repository skills from the working directory up to the repository root;
- excludes `SEO`, which is reference material without a `SKILL.md`.

Design and security are grouped without collapsing distinct outputs into one oversized prompt. Core contains the canonical design paths and all security paths. The `design` pack adds specialist aesthetics, motion, prototyping, Figma, and image-led workflows; the `security` pack remains four focused skills for implementation, review, threat modeling, and ownership analysis.

### `npx yeknal profiles`

Lists the built-in `core`, `process`, `design`, `security`, `web`, `platform`, `documents-media`, `productivity`, and `openai` profiles without making a network request. `all` is a dynamic full-catalog profile.

### `npx yeknal security`

This command:

1. downloads `application-security/Security-Master.md` temporarily;
2. syncs `application-security`, `security-best-practices`, `security-ownership-map`, and `security-threat-model`;
3. scans the current project;
4. writes `yeknal-security.log`, `yeknal-security.json`, and `yeknal-security.sarif`, then removes the temporary master file.

The scanner checks static signals for exposed secrets and credential files, dependency risk, authentication and session handling, input validation, CORS, security headers, database access, unsafe frontend sinks, and framework configuration. Checks use stable rule IDs and current `Security-Master.md` anchors. JSON supports custom processing, while SARIF 2.1.0 supports compatible code-scanning tools. Findings require human review; a static scan cannot prove runtime authorization, exploitability, deployment posture, or the absence of vulnerabilities.

## Development and release

```bash
npm ci
npm test
npm pack --dry-run
```

`.github/workflows/publish.yml` is ready for npm trusted publishing but is gated by the repository variable `NPM_TRUSTED_PUBLISHING_ENABLED`. Set that variable to `true` only after npm has a matching OIDC connection for `tryraisins/MD_Files` and `publish.yml`. Until then, publish manually from an authenticated local npm client; do not store a long-lived npm publish token in repository secrets.

## Notes

- If no supported user-level agent folder exists, user-scope sync exits without installing anything. Project scope only requires the current directory to be inside a Git repository.
- Downloads use bounded retries for temporary network failures and GitHub `408`, `425`, `429`, and `5xx` responses. `Retry-After` is honored up to 10 seconds. After retry exhaustion, the command uses a shallow Git clone when Git is installed.
- If GitHub API limits are reached, set `YEKNAL_GITHUB_TOKEN` or `GITHUB_TOKEN`. Install Git to enable the fallback clone for API limits or interrupted raw-file downloads.
- Generated `yeknal-security.log`, `yeknal-security.json`, and `yeknal-security.sarif` files are local evidence and should not be committed.

## License

ISC
