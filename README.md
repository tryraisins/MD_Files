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
| `npx yeknal security` | Refreshes the managed `yeknal-Security` skill, downloads `Security-Master.md`, and runs a security audit |
| `npx yeknal skills` | Syncs the latest top-level skill folders, including `Security` as `yeknal-Security` (excluding `Design`, `Security_Raw`, `SEO`) |

## Skills Sync Behavior

- Source mode is GitHub download.
- Pulls the current top-level `SKILL.md` folders from this repository on `main`.
- Uses GitHub API + raw file download by default.
- If GitHub API rate limit is hit, it automatically falls back to `git clone` (Git must be installed).
- Includes only top-level folders that contain `SKILL.md`.
- Installs each synced skill with a `yeknal-` folder prefix, for example `taste-skill` installs as `yeknal-taste-skill`.
- The canonical security skill is installed as `yeknal-Security` by both commands; re-running either command overwrites that managed folder.
- `Security_Raw` is reference/source material rather than an installable skill (it has no `SKILL.md`), so it is not downloaded.
- Only matching `yeknal-*` managed destination folders are overwritten during sync.
- Personal/private skill folders without the `yeknal-` prefix are left untouched.
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

## Latest Taste Skills

The repository now includes the Taste skill bundle:

- `ui-quality-baseline` — automatic control, typography, icon, responsive, loading, skeleton, and motion standards for any UI task, including individual elements
- `taste-skill`
- `taste-skill-v1`
- `gpt-tasteskill`
- `image-to-code-skill`
- `imagegen-frontend-web`
- `imagegen-frontend-mobile`
- `brandkit`
- `redesign-skill`
- `soft-skill`
- `output-skill`
- `minimalist-skill`
- `brutalist-skill`
- `stitch-skill`

## Emil Kowalski UI skill merge

The design and motion collection also includes the upstream UI-focused skills from [`emilkowalski/skills`](https://github.com/emilkowalski/skills/tree/main/skills), reviewed from commit `d23d7f8`:

- `animate` and `animate-expo` for purposeful, performant web and React Native motion
- `ask-sonner` for accessible, stateful toast workflows
- `prototype` for isolated, divergent UI explorations
- `write-swift` for modern Swift and SwiftUI-adjacent work
- supporting recipes, API, picker, audit, plan, and standards references for the imported and existing skills

Existing local skills retain their `ui-quality-baseline` integration; the newly imported visible-UI skills reference the same baseline so typography, tokens, geometry, responsive behavior, accessibility, loading states, and reduced motion remain consistent across outputs.

## License

ISC
