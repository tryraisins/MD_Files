# Installed Skill Conflict Resolution

Reviewed 2026-09-08 across the local Codex, Claude, and shared-agent skill roots.

## Ownership decisions

- Current `yeknal-*` folders remain the managed source for repository skills.
- Microsoft Foundry remains the lock-backed copy in `.agents/skills`, sourced from `microsoft/azure-skills`.
- Codex `.system` skills remain authoritative for `imagegen`, `openai-docs`, and `skill-creator`.
- `classic-sp-to-spfx` remains in place because its Codex/Claude copy differs from the shared-agent copy and contains project-specific paths; it needs a manual merge.

## Reversible cleanup

On 2026-09-08, 53 stale or duplicate folders were moved—not deleted—to dated quarantine folders:

- `C:\Users\nubiaville\.agents\skills-quarantine\2026-09-08\skills`
- `C:\Users\nubiaville\.codex\skills-quarantine\2026-09-08\skills`
- `C:\Users\nubiaville\.claude\skills-quarantine\2026-09-08\skills`

The quarantine preserves the original folder names and can be restored with `Move-Item`. No `.claude\skills.zip`, lock file, system skill, or project-specific `classic-sp-to-spfx` copy was removed.

## Installer guard

`npx yeknal skills` now detects Codex `.system/<skill>/SKILL.md` entries and skips repository skills with the same name, preventing managed duplicates from being recreated.

## Remaining review items

The four intentional audit groups are the Codex/Claude `imagegen` and `openai-docs` cross-agent copies, the three `skill-creator` variants, and the unresolved `classic-sp-to-spfx` divergence. They are retained until the consuming agent's ownership is confirmed.
