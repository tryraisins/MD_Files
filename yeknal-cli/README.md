# yeknal

A CLI tool to fetch project guideline templates and sync skill folders for AI coding agents.

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

### Design

Fetches `Design.md`.

```bash
npx yeknal design
```

Output:
- `Design.md`

### SEO

Fetches `SEO-Prompt.md`.

```bash
npx yeknal seo
```

Output:
- `SEO-Prompt.md`

### Skills

Syncs skill folders from the GitHub repository into detected local agent folders.

```bash
npx yeknal skills
```

Behavior:
- Source mode is GitHub-only.
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

## Examples

```bash
# Pull security guidelines + run audit
npx yeknal security

# Pull design guidelines
npx yeknal design

# Pull SEO guidelines
npx yeknal seo

# Sync skill folders for Gemini/Codex/Claude
npx yeknal skills
```

## License

ISC
