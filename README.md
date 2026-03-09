# MD Files

A collection of reusable project guideline templates and skill folders for AI coding agents.

Use [`yeknal`](https://www.npmjs.com/package/yeknal) to pull templates or sync skills.

## Quick Start

```bash
# Fetch security guidelines + run security audit
npx yeknal security

# Fetch design guidelines
npx yeknal design

# Fetch SEO checklist
npx yeknal seo

# Sync skill folders to local agent directories
npx yeknal skills
```

## Commands

| Command | Result |
| --- | --- |
| `npx yeknal security` | Downloads `Security-Master.md` and runs `secure-repo audit` |
| `npx yeknal design` | Downloads `Design.md` |
| `npx yeknal seo` | Downloads `SEO-Prompt.md` |
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
Design/
SEO/
...skill folders...
yeknal-cli/
```

## License

ISC
