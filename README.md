# MD Files

A collection of reusable skill folders and security guidelines for AI coding agents.

Use [`yeknal`](https://www.npmjs.com/package/yeknal) to sync skills or run a security audit.

## Quick Start

```bash
# Fetch security guidelines + run security audit
npx yeknal security

# Sync skill folders to local agent directories
npx yeknal skills
```

## Commands

| Command | Result |
| --- | --- |
| `npx yeknal security` | Downloads `Security-Master.md` and runs a security audit |
| `npx yeknal skills` | Syncs skill folders (excluding `Design`, `Security`, `Security_Raw`, `SEO`) |

## Skills Sync Behavior

- Source mode is GitHub download.
- Uses GitHub API + raw file download by default.
- If GitHub API rate limit is hit, it automatically falls back to `git clone` (Git must be installed).
- Includes only top-level folders that contain `SKILL.md`.
- Overwrites existing destination skill folders.
- Creates `<parent>/skills` when parent exists but skills folder does not.
- Sync targets:
- Gemini: `~/.gemini/antigravity` or `~/.antigravity`
- Codex: `~/.codex`
- Claude: `~/.claude`

Optional parent path overrides:
- `YEKNAL_GEMINI_PARENT`
- `YEKNAL_CODEX_PARENT`
- `YEKNAL_CLAUDE_PARENT`
- `YEKNAL_GITHUB_TOKEN` (or `GITHUB_TOKEN`) for higher GitHub API rate limits (optional)

## Repository Structure

```
Security/
...skill folders...
yeknal-cli/
```

## License

ISC
