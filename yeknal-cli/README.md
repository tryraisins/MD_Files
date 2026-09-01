# yeknal

Sync reusable AI-agent skill folders and run a lightweight security audit from the command line.

## Requirements

You do not need to install `yeknal` globally. On a new device, you only need:

- Node.js with npm, so `npx` is available.
- Internet access, because the CLI reads the latest skills from GitHub.
- At least one supported agent folder for skill sync: Codex (`~/.codex`), Claude (`~/.claude`), Gemini Antigravity (`~/.gemini/antigravity`), or Antigravity (`~/.antigravity`).

Git is optional. The CLI uses Git only as a fallback if GitHub API rate limits block the normal download path.

## Quick Start

Run commands from the project you want to work in:

```bash
npx yeknal security
npx yeknal skills
```

## Commands

### `npx yeknal security`

Use this when you want security guidance plus a scan of the current project.

It does three things:

- Refreshes the managed security skill as `yeknal-Security` in detected agent skill folders.
- Temporarily downloads the latest `Security-Master.md` rules from GitHub.
- Scans the current folder and writes a detailed report to `yeknal-security.log`.

The scan checks for common issues such as hardcoded secrets, risky credential files, dependency manifests, authentication/session patterns, missing input validation evidence, permissive CORS, missing security headers, database-access risks, unsafe frontend sinks, and framework configuration problems. It is a static audit helper; it does not replace a full manual security review.

### `npx yeknal skills`

Use this when you want the latest reusable skills copied into your local agent setup.

It syncs top-level folders from `tryraisins/MD_Files` on GitHub when they contain a `SKILL.md` file. Installed folders are managed with a `yeknal-` prefix, for example `taste-skill` becomes `yeknal-taste-skill`.

The command preserves your personal skills. It only overwrites or removes managed `yeknal-*` folders that came from this repository.

## What Gets Synced

- Skill folders are downloaded from the repository `main` branch.
- `Security` is installed as `yeknal-Security`.
- `Design`, `SEO`, and `Security_Raw` are not installed by the CLI.
- Missing `skills` folders are created inside detected agent parent folders.
- Stale managed `yeknal-*` folders are removed when they no longer exist in the repository.

## Notes

- If no supported agent folder exists, `npx yeknal skills` has nowhere to sync and exits without installing anything.
- If GitHub API limits are reached, set `YEKNAL_GITHUB_TOKEN` or `GITHUB_TOKEN`, or make sure Git is installed so the fallback clone can run.

## License

ISC
