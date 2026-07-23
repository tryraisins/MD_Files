# yeknal

A CLI tool to sync the latest skill folders for AI coding agents and run security audits.

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

Syncs the latest skill folders from the GitHub repository into detected local agent folders.

```bash
npx yeknal skills
```

Behavior:
- Source mode is GitHub download.
- Pulls the current top-level `SKILL.md` folders from `tryraisins/MD_Files` on `main`.
- Uses GitHub API + raw file download by default.
- If GitHub API rate limit is hit, it automatically falls back to `git clone` (Git must be installed).
- Top-level folders are included only if they contain `SKILL.md`.
- Installs each synced skill with a `yeknal-` folder prefix, for example `taste-skill` installs as `yeknal-taste-skill`.
- Matching `yeknal-*` managed destination folders are overwritten during sync, and stale `yeknal-*` folders removed from an earlier repository version are cleaned up. Unprefixed personal skill folders are never touched.
- Sync targets (if parent folder exists):
- Gemini: `~/.gemini/antigravity` or `~/.antigravity`
- Codex: `~/.codex`
- Claude: `~/.claude`
- For each detected target, creates `<parent>/skills` if missing.
- Personal/private skill folders without the `yeknal-` prefix are left untouched.

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
