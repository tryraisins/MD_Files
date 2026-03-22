# yeknal

A CLI tool to sync skill folders for AI coding agents and run security audits.

## Installation

No installation needed; use `npx`:

```bash
npx yeknal <command>
```

## Usage

Run commands from your project root:

### Security

Fetches `Security-Master.md` and runs a security audit.

```bash
npx yeknal security
```

Output:
- `Security-Master.md`
- `security-audit.log`

### Skills

Syncs skill folders from the GitHub repository into detected local agent folders.

```bash
npx yeknal skills
```

Behavior:
- Source mode is GitHub download.
- Uses GitHub API + raw file download by default.
- If GitHub API rate limit is hit, it automatically falls back to `git clone` (Git must be installed).
- Top-level folders are included only if they contain `SKILL.md`.
- Excludes `Design`, `Security`, `Security_Raw`, and `SEO`.
- Sync targets (if parent folder exists):
- Gemini: `~/.gemini/antigravity` or `~/.antigravity`
- Codex: `~/.codex`
- Claude: `~/.claude`
- For each detected target, creates `<parent>/skills` if missing.
- Overwrites destination skill folders to keep targets in sync.

Optional environment variable overrides:
- `YEKNAL_GEMINI_PARENT`
- `YEKNAL_CODEX_PARENT`
- `YEKNAL_CLAUDE_PARENT`
- `YEKNAL_GITHUB_TOKEN` (or `GITHUB_TOKEN`) for higher GitHub API rate limits (optional)

## Examples

```bash
# Pull security guidelines + run audit
npx yeknal security

# Sync skill folders for Gemini/Codex/Claude
npx yeknal skills
```

## License

ISC
