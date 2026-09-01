# MD Files

A collection of reusable skill folders and security guidance for AI coding agents.

Use [`yeknal`](https://www.npmjs.com/package/yeknal) when you want to copy the latest skills into your local agent setup or run a static security scan on a project.

## Requirements

`yeknal` does not need a global install. A new device still needs Node.js with npm, internet access, and at least one supported agent folder for skill sync:

- Codex: `~/.codex`
- Claude: `~/.claude`
- Gemini Antigravity: `~/.gemini/antigravity`
- Antigravity: `~/.antigravity`

Git is optional. It is only used if the normal GitHub download path is rate-limited.

## Quick Start

```bash
npx yeknal security
npx yeknal skills
```

## Commands

| Command | Result |
| --- | --- |
| `npx yeknal security` | Refreshes `yeknal-Security`, scans the current folder, and writes `yeknal-security.log` |
| `npx yeknal skills` | Syncs current top-level `SKILL.md` folders into detected local agent skill folders |

## Sync Behavior

- Skills are pulled from this repository on `main`.
- Installed skill folders use the managed `yeknal-` prefix, for example `taste-skill` installs as `yeknal-taste-skill`.
- `Security` is installed as `yeknal-Security` by both commands.
- `Design`, `SEO`, and `Security_Raw` are not installed by the CLI.
- Missing `skills` folders are created inside detected agent parent folders.
- Managed `yeknal-*` folders are overwritten or removed when the repository changes.
- Personal/private skill folders without the `yeknal-` prefix are left untouched.

## Security Scan

`npx yeknal security` temporarily downloads the latest `Security-Master.md` rules, scans the current project, and removes the temporary rules file after writing `yeknal-security.log`.

The scanner checks common static signals including secrets, credential files, dependency manifests, authentication/session patterns, input validation evidence, CORS, security headers, database-access risks, unsafe frontend sinks, and framework configuration issues. It is a helper for finding issues quickly, not a replacement for manual security review.

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
