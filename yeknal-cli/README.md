# yeknal

A command line tool that does three things for AI coding agents:

- **Finds the right skill on demand.** Your agent searches a public catalog of skills (Markdown instruction files) and reads only the one or two it needs.
- **Installs skills deliberately.** Pick a profile or named skills and copy them into your user folders or a single repository.
- **Scans your code.** `security` and `slopscan` run against the project you are in and write reports you can read or feed into CI.

It is not an MCP server, a background service or an AI search service. Search is local and uses no LLM. There is no yeknal account, API key or hosted backend.

## First run

Install [Node.js](https://nodejs.org) 18 or later, make sure at least one supported agent is configured (see [Supported agents](#supported-agents)), then run:

~~~bash
npx yeknal setup
~~~

Restart the agent or start a new session. Setup prepares a connection for every agent it detects without prompting, and retires curated archived skills with recoverable backups unless you pass `--keep-archived`. Some integrations still need you: if the output lists a Manual connection, follow the steps and the documentation link it prints. After that, the agent can look up guidance itself, and you can do the same by hand from inside any repository:

~~~bash
npx yeknal search "review a diff"
npx yeknal load yeknal-review
~~~

`search` ranks matching skills by name and description. `load` prints the instructions of one skill. Neither installs anything into your agent folders or your project.

Greetings, simple questions and trivial tasks skip the lookup. For substantive work, the agent searches from its real working directory, picks one or two skills and reads their instructions directly.

## Which command do I want?

| Goal | Command |
| --- | --- |
| Connect my agents so they can look up skills | `npx yeknal setup` |
| Find a skill for a task | `npx yeknal search "<task>"` |
| Read a skill's instructions | `npx yeknal load <skill>` |
| Read a skill's reference file or script | `npx yeknal load <skill> <resource>` |
| Audit this project for security issues | `npx yeknal security` |
| Check this project's interface code for generic AI-made patterns | `npx yeknal slopscan` |
| See which skill packs exist | `npx yeknal profiles` |
| Install a skill pack in my agent folders | `npx yeknal skills` |
| Install a pack or named skills in one repository | `npx yeknal skills --project --profile <pack>` |
| Refresh the skill list now | `npx yeknal update` |
| See where the cache is and whether it is stale | `npx yeknal cache status` |
| Work without the network | add `--offline` to `search` or `load` |
| Delete files copied into a repository by `load` | `npx yeknal resources clean` |
| Undo what setup changed | `npx yeknal setup --remove` or `setup --restore <ID\|all>` |

## Security scan

~~~bash
npx yeknal security
~~~

Run it from the root of the project you want to check. It:

1. downloads `skills/yeknal-application-security/Security-Master.md` temporarily;
2. syncs `yeknal-application-security`, `yeknal-security-best-practices`, `yeknal-security-ownership-map` and `yeknal-security-threat-model`;
3. scans the current project, skipping dependencies, build output and generated files;
4. writes `yeknal-security.log`, `yeknal-security.json` and `yeknal-security.sarif`, then removes the temporary master file.

The scanner checks static signals for exposed secrets and credential files, dependency risk, authentication and session handling, input validation, CORS, security headers, database access, unsafe frontend sinks and framework configuration. Checks use stable rule IDs and link to current `Security-Master.md` anchors.

| Output | Use |
| --- | --- |
| `yeknal-security.log` | Readable summary |
| `yeknal-security.json` | Custom processing |
| `yeknal-security.sarif` | SARIF 2.1.0, for compatible code-scanning tools |

The command exits with code `1` when it reports findings. It needs network access for the download and the skill sync.

Findings need human review. A static scan cannot prove runtime authorization, exploitability, deployment posture or the absence of vulnerabilities. The generated files are local evidence and should not be committed.

## Slop scan

~~~bash
npx yeknal slopscan
~~~

Run it from the root of a web project. It scans source files for signs of generic, AI-made interface code and writes `yeknal-slopscan.log` and `yeknal-slopscan.json`. It runs locally, makes no network requests and installs no skills.

It checks for stock marketing copy, placeholder text, gradient headline text, clipped slogans, accent words inside a headline, zero-padded numbered labels, decorative emoji, stock icon sets, UI-kit default colors, dotted metadata lines, missing image alt text, broken local image paths, click-only controls, skipped heading levels, unguarded motion and similar signals. Each finding names its file and line and carries a plain explanation and a fix.

The command does not score the repository and does not claim to know who or what wrote the code.

### Rendered-page checks

Some checks need a rendered page: layout, computed styles and similar things cannot be judged from source. The scan lists them as unassessed and does not attempt them. The report points at `https://sloplens.tryraisins.dev`, where scanning your deployed URL returns a 0 to 100 score with a tier and points per rule. `slopscan` only prints that address. It never contacts the site.

### Options

| Flag | Meaning |
| --- | --- |
| `--path DIR` | Project to scan. Defaults to the current directory. |
| `--out DIR` | Where to write the reports. Defaults to the scanned project. |
| `--ignore GLOB` | Skip matching paths. Repeat the flag for several patterns. |
| `--fail-on N\|any` | Exit with code `1` when the number of findings reaches `N`. `any` means one finding. |
| `--json` | Print the JSON report to stdout instead of the text summary. The report files are still written. |

### Exit codes

| Code | Meaning |
| --- | --- |
| `0` | Scan finished, and `--fail-on` was not given or its threshold was not reached. |
| `1` | `--fail-on` threshold reached. |
| `2` | Usage or input error, or the reports could not be written. |

### What gets scanned

- Inside a Git repository, the scan reads tracked files and non-ignored untracked files. A tracked file stays included even when it matches an ignore pattern. Elsewhere it walks the folder, skipping dependency, build and generated folders, files over 512 KB and anything deeper than 12 levels. Symbolic links are not followed.
- File types: `js`, `ts`, `jsx`, `tsx`, `mjs`, `cjs`, `vue`, `svelte`, `astro`, `html`, `css`, `scss` and `less`.
- Tests, specs, fixtures, mocks, stories and `e2e` folders, plus `.test.`, `.spec.` and `.stories.` files, are left out because their strings look like shipped copy.
- `--ignore` takes `*`, `**` and `?` against paths relative to the scan root. A trailing slash means a directory. Negation with `!` is rejected. Matching is case-insensitive on Windows.
- If the folder has neither a `package.json` nor a `.git` directory, the scan warns that you may be scanning the wrong path.
- Inside a repository, the report file names are added to `.gitignore`. Reports are never written through a symbolic link.
- Supporting signals that are not slop on their own are listed but not counted unless a real slop signal is also found.

`slopscan` is part of the `design` profile today, not `core`. The command works without any install. The profile only matters if you want the matching skill, which tells an agent how to act on the report:

~~~bash
npx yeknal skills --project --add --skills slopscan
~~~

## Skills and profiles

### Profiles

~~~bash
npx yeknal profiles
~~~

Lists the built-in profiles with their skill counts and names, without a network request.

| Profile | Skills | Contents |
| --- | --- | --- |
| `core` | 15 | High-frequency process, reasoning, design, implementation, verification and security workflows. The default. |
| `process` | 11 | Agent cost, delivery extras, legacy sweeps, GitHub and verification upkeep beyond core. |
| `design` | 22 | Specialist visual styles, motion, prototyping, Figma and image-led workflows beyond core design. Includes `slopscan`. |
| `security` | 5 | Multi-phase auditing, secure implementation, focused review, threat modeling and ownership analysis. |
| `web` | 5 | SEO, agent readability, performance, launch readiness and production-error workflows. |
| `platform` | 2 | Deployment routing and launch readiness for specific platforms. |
| `all` | all | Every skill in the current catalog. Computed dynamically. |

Profiles are exact sets. Selecting `design` alone does not silently add `core`. That lets you keep a user-level `core` install and add a project-only specialist pack without duplicate skill names. Combine packs with commas.

### `skills`

Downloads selected top-level skill folders from `tryraisins/MD_Files` on `main` and installs them with the managed `yeknal-` prefix. It defaults to the 15-skill `core` profile instead of every published folder. Retired skills are removed by name using the `archived.json` list generated from `archive/skills`, so an older install stops serving a skill the catalog no longer publishes.

~~~bash
# Core profile in detected user-level agent folders
npx yeknal skills

# An exact specialist pack in the current Git repository
npx yeknal skills --project --profile design

# Combine packs for one repository
npx yeknal skills --project --profile core,web

# Install only named skills in this repository
npx yeknal skills --project --skills design-reference-research,prototype

# Add a missing skill without removing existing project skills
npx yeknal skills --project --add --skills slopscan

# Also remove retired skills during an additive project sync
npx yeknal skills --project --add --prune-archived --skills slopscan

# Install the full catalog, as before v2
npx yeknal skills --all
~~~

| Flag | Meaning |
| --- | --- |
| `[profile]` or `--profile a,b` | Profiles to install. Default `core`. |
| `--skills a,b` | Named skills. Added to an explicitly selected profile, or installed alone when no profile is given. |
| `--project` | Install into the current Git repository's `.agents/skills` instead of user-level folders. |
| `--add` | With `--project`, install only missing selected skills and keep every other managed and personal project skill. |
| `--prune-archived` | With `--add`, also remove retired skills. |
| `--skip-claude` | Skip the Claude folder for user-level sync. |
| `--all` | Install every published skill. |

What it does:

- Creates missing `skills` directories in supported agent folders.
- Updates and removes only managed `yeknal-*` folders. Personal folders without that prefix are kept.
- Removes retired skills by name before syncing. A normal sync always does this. `--add` stays additive unless `--prune-archived` is also passed.
- Warns and continues when a profile names a skill the repository no longer publishes, so an older CLI cannot block the whole sync. An explicitly named missing skill still fails.
- On Codex, skips repository skills already supplied by `~/.codex/skills/.system`.
- Excludes `SEO`, which is reference material without a `SKILL.md`.
- Exits with code `1` when a sync fails.

User-level sync (the default scope):

- Installs into every detected user-level parent. If no supported agent folder exists, it exits without installing anything.
- When `~/.agents` exists it is preferred. The overlapping per-agent folders (Codex, opencode, Cursor, Windsurf/Cascade, GitHub Copilot, Gemini CLI, Roo Code, OpenHands and Amp) are skipped and their stale managed folders removed. Agents that do not read `~/.agents` (Claude, Kiro, Cline and the Antigravity folders) keep their own copy.
- Clients that also read a kept folder can see a managed skill twice. opencode, Cursor, Amp and Windsurf read `~/.claude/skills`. `--skip-claude` avoids that: it opts out of the Claude target and removes only stale managed `yeknal-*` copies there.
- With T3 Code detected, it installs into `~/.agents/skills` even when that folder does not exist yet. T3 Code reads it for every provider, so it is the one reliable root. Its `.claude`, `.codex` and `.grok` roots are gated and are not used as targets.
- Running `skills --skills <name>` at user scope registers a permanent global copy again, so use it only when you want that.

Project sync (`--project`):

- Resolves the current Git root and syncs only that repository's `.agents/skills`. Codex, Cursor, opencode, Roo Code, OpenHands, T3 Code and other compatible clients discover repository skills from the working directory up to the repository root.
- `--project --add` is the safe mode for adding one specialist when a task needs it.
- Without `--add`, project sync replaces and removes the managed `yeknal-*` folders to match the selected profile exactly.

### `search`

~~~bash
npx yeknal search "debug React state" --limit 5
~~~

| Flag | Meaning |
| --- | --- |
| `<query>` | Words describing the task. |
| `--limit N` | Number of results, from 1 to 20. Default 8. |
| `--json` | Accepted for consistency with `load`. `search` always prints JSON. |
| `--offline` | Do not use the network. |

Each result has a name, description, source (`installed`, `project` or `catalog`), version and score. Search runs on cached metadata and uses no LLM.

### `load`

~~~bash
npx yeknal load yeknal-troubleshoot
npx yeknal load yeknal-ui-quality-baseline references/accessibility-design.md --revision COMMIT_SHA
npx yeknal load yeknal-markdown-management scripts/audit-skills.ps1 --materialize
npx yeknal load yeknal-markdown-management --all-resources
~~~

| Flag | Meaning |
| --- | --- |
| `<name>` | Skill to read. |
| `[resource]` | A reference file or script inside the skill. |
| `--materialize` | Copy the selected supporting files into the repository's `.yeknal/resources` folder. |
| `--all-resources` | Copy the skill's whole supporting tree there. |
| `--revision SHA` | Read from a pinned source revision, given as the full 40-character commit SHA. |
| `--json` | Machine-readable output. |
| `--offline` | Do not use the network. |

How it behaves:

- A plain load reads instructions and references directly. It adds no native skill folders and creates no project files.
- It asks Git for the repository containing the working directory, including subdirectories and worktrees. Project-local overrides in that repository take precedence over shared cached copies. Nothing from a project is ever written into the shared cache.
- Only `--materialize` and `--all-resources` copy files into the repository. Relative script imports and assets stay together. `.yeknal/resources` is not a skill discovery folder. Use the returned absolute paths and the documented interpreter and working directory.
- Loading never runs scripts and never installs dependencies.
- Outside Git, discovery and loading still work, but copying files into a project is refused.
- To pin supporting files to the same immutable source as the instructions, pass the `sourceRevision` returned by the first load. A project-local override returns a `null` `sourceRevision`, so omit `--revision` for those. Cross-skill references can be loaded the same way at the pinned revision.

### `setup`

~~~bash
npx yeknal setup
npx yeknal setup --list --json
npx yeknal setup --agents all --json
npx yeknal setup --agents cursor,gemini,cline --json
npx yeknal setup --keep-archived --json
~~~

| Flag | Meaning |
| --- | --- |
| `--list` | Show detected agents and their status. |
| `--agents all\|NAME,...` | Choose an exact list. With no list, setup attempts every detected agent. |
| `--keep-archived` | Keep retired skills. By default they are retired with recoverable backups. |
| `--migrate` | Move existing yeknal skill folders out of selected agents' dedicated roots. See [Migration, removal and restore](#migration-removal-and-restore). |
| `--remove` | Disconnect agents. Interactive unless `--agents` is given. |
| `--backups` | List backups. |
| `--restore ID\|all` | Restore a backup. |
| `--json` | Machine-readable output. |

Setup keeps one short instruction block per connected agent, plus a versioned local copy of the CLI so agents do not have to run npm each time. It does not register a global router skill and does not embed a skill list. A rules file that was only re-saved with different line endings is not treated as an edit: the block is rewritten in that file's own line endings.

Restart or start a new agent session after setup. Whether the agent follows the instructions depends on the agent and its tool permissions.

## Everything else

### Cache and offline use

~~~bash
npx yeknal update
npx yeknal cache status
npx yeknal load yeknal-troubleshoot --offline
~~~

- `update` forces a refresh of the skill list and prints JSON. Otherwise search refreshes it after 24 hours.
- `cache status` prints JSON with the cache location, catalog source and revision, version, skill count, whether the data is stale, offline state, the last error and when the next retry is allowed.
- The cache is storage only and is never registered as a skill directory. Defaults are `%LOCALAPPDATA%/yeknal/cache` on Windows, `~/Library/Caches/yeknal` on macOS, and `$XDG_CACHE_HOME/yeknal` or `~/.cache/yeknal` on Linux. Set `YEKNAL_CACHE_DIR` to choose another place.
- If a refresh fails, usable cached data is kept and a persistent retry backoff applies. File downloads check hashes and safe paths and are written atomically. Cached loads never contact the network.
- `--offline` or `YEKNAL_OFFLINE=1` forbids any retrieval over the network. Files that are not cached then fail. An unpinned load may use an older verified cached copy and reports its revision. A manual `npx` can still need npm access before yeknal itself starts.

### `resources clean`

~~~bash
npx yeknal resources clean
~~~

Removes the files that `load --materialize` or `--all-resources` copied into `.yeknal/resources`. It removes only unchanged files that yeknal owns and keeps anything you edited. Run it before committing a project.

### `update`

Refreshes the skill list immediately. See [Cache and offline use](#cache-and-offline-use).

### Migration, removal and restore

Setup keeps your existing global skills, except curated retired skills, which are retired by default with recoverable backups. Writing an instruction file proves preparation, not that the agent loaded it. Open a fresh session and check before you ask for `setup --agents NAME --migrate`.

~~~bash
npx yeknal setup --backups --json
npx yeknal setup --agents codex --migrate --json
npx yeknal setup --restore BACKUP_ID --json
npx yeknal setup --restore all --json
npx yeknal setup --remove --agents codex,claude,opencode --json
~~~

Migration only considers the dedicated skill folders of selected agents whose connection was safely prepared. It recognizes a folder when it has an exact catalog name with a matching identity in its frontmatter, appears in `archived.json`, or has an existing setup ownership record. A name prefix alone is not enough. Each identified folder is copied to a backup, verified, and only then removed from active discovery.

- Customized folders are backed up in full and reported. Retired skills are reported as archived, not customized.
- Left untouched and reported: shared `.agents/skills` and `.claude/skills`, historical alternative roots, unselected agents, manual connections, failed connections, unknown identities, symbolic links, project-local folders, backup failures and edited instruction blocks. Unrelated native configuration and third-party skills stay.
- If a protected discovery root cannot be resolved safely, migration is disabled and setup lists the preserved paths.
- Backups live in the cache's migration-backups folder, outside skill discovery paths. They record original paths, content hashes and file metadata. Backups created by 2.4.0 can still be listed and restored.
- Restore refuses conflicting targets and modified backups, and keeps the backup after a successful restore. A restored skill stays available unless you request an eligible migration again.
- Removal disconnects unchanged instruction blocks and keeps backups, cache and the local CLI copy. It does not restore global skills for you.
- Repeated setup creates no duplicate connections or backups. The before and after output counts skill files and description characters, not tokens.

The `skills` command is separate from this. Installing globally recreates native global skill folders, which setup would otherwise leave alone, and an exact profile sync replaces and removes managed folders as described in [`skills`](#skills).

## Supported agents

Paths are relative to your home folder unless an environment variable overrides them. `setup --agents` accepts the IDs below. Aliases: `gemini-cli`, `copilot-cli`, `cascade`, `roo-code`, `t3-code`, `t3code` and `shared`.

| Setup ID | Instruction file | Notes |
| --- | --- | --- |
| `codex` | `.codex/AGENTS.md`, or an active `AGENTS.override.md` | [Codex instructions](https://developers.openai.com/codex/guides/agents-md). Respects `CODEX_HOME`. |
| `claude` | `.claude/CLAUDE.md` | [Claude memory](https://code.claude.com/docs/en/memory). Respects `CLAUDE_CONFIG_DIR`. |
| `opencode` | `.config/opencode/AGENTS.md` | [OpenCode V2](https://opencode.ai/v2/docs/instructions/). Respects `XDG_CONFIG_HOME`. An ambiguous V1 fallback is reported. |
| `cursor` | `.cursor/rules/yeknal.mdc` | [Cursor user rule files](https://cursor.com/help/customization/rules). Check that the rule is enabled and Always Apply. Agent Chat scope. |
| `windsurf` | `.codeium/windsurf/memories/global_rules.md` | [Cascade global rules](https://docs.devin.ai/desktop/cascade/memories). The combined file is limited to 6,000 characters. |
| `copilot` | `.copilot/copilot-instructions.md` | [Copilot CLI](https://docs.github.com/en/copilot/how-tos/copilot-cli/customize-copilot/add-custom-instructions). Respects `COPILOT_HOME`. IDEs need their own instructions. |
| `gemini`, `antigravity` | `.gemini/GEMINI.md` | [Gemini context](https://geminicli.com/docs/cli/gemini-md/) and [Antigravity rules](https://www.antigravity.google/docs/rules/). One shared connection when the roots match, otherwise Antigravity gets manual steps for its own global file. |
| `roo` | `.roo/rules/yeknal.md` | [Roo global instructions](https://github.com/RooCodeInc/Roo-Code/blob/main/apps/docs/docs/features/custom-instructions.md). |
| `kiro` | `.kiro/steering/yeknal.md` | [Kiro steering](https://kiro.dev/docs/steering/). Local IDE and CLI. Custom agents need the steering path in their resources. |
| `cline` | `.cline/rules/yeknal.md` | [Cline rules](https://docs.cline.bot/customization/cline-rules). Respects `CLINE_DIR`. Check that the rule is enabled and the active CLI `--config` location. |
| `amp` | `.config/amp/AGENTS.md` | [Amp guidance](https://ampcode.com/docs/customize/agents-md). If `AMP_IGNORE_GUIDANCE_FILES` is set, setup asks for a manual check. |
| `openhands` | Manual connection | [OpenHands skills](https://docs.openhands.dev/overview/skills). Configure the active project, backend or AgentContext and enable instructions. |
| `t3` | Manual connection | [T3 Code commands and skills](https://github.com/pingdotgg/t3code/blob/main/docs/user/composer.md#commands-and-skills). Runs the selected provider agent, reads `.agents/skills` without gating, has no global instruction file, and needs an agent session restart after a skill change. Respects `T3CODE_HOME`. |
| `agents` | Manual connection | The shared Agent Skills standard (`~/.agents`) has no universal global instruction location. Existing shared skills are kept. |

Detection looks for each agent's folder: `~/.codex`, `~/.claude`, `~/.gemini/config` or `~/.gemini/antigravity` (Gemini Antigravity), `~/.antigravity`, `~/.config/opencode`, `~/.cursor`, `~/.codeium/windsurf`, `~/.copilot`, `~/.gemini` (Gemini CLI), `~/.roo`, `~/.kiro`, `~/.cline`, `~/.openhands`, `~/.config/amp`, `~/.t3` and `~/.agents`. A folder proves detection only. Agents you pick explicitly in a manual mode do not need a local folder.

Overrides:

- `YEKNAL_*_PARENT` variables keep the legacy naming, for example `YEKNAL_GEMINI_CLI_PARENT` for the Gemini instruction root.
- [`GEMINI_CLI_HOME`](https://geminicli.com/docs/reference/configuration/) replaces the home used to resolve `.gemini`. It does not name the `.gemini` folder directly.
- If Gemini's `context.fileName` excludes `GEMINI.md`, or its settings cannot be read safely, setup keeps the settings and gives manual steps instead.

Manual, blocked or failed connections return an entry with a paste-ready `bootstrapFile`, a CLI command, a documentation link and steps. The file stays in the cache, outside native discovery. Existing dedicated rule files that yeknal does not own, and customized instruction blocks, are preserved. Nothing is pasted into IDE settings or custom agent configuration for you.

## Requirements

- Node.js 18 or later, with npm. No global install is needed.
- Internet access for the first search or load, for `skills` and for `security`. Cached content works offline.
- For user-level sync, at least one supported agent folder (see the detection list above).
- For project sync or copying files into a repository, a current directory inside a Git repository.
- Git is otherwise optional. It is the fallback when GitHub API or raw-file downloads stay unavailable after automatic retries.

## Notes and limits

- If no supported user-level agent folder exists, user-scope sync exits without installing anything. Project scope only needs the current directory to be inside a Git repository.
- Downloads use bounded retries for temporary network failures and for GitHub `408`, `425`, `429` and `5xx` responses. `Retry-After` is honored up to 10 seconds. When retries run out, `skills` and `security` fall back to a shallow Git clone if Git is installed. `search`, `load` and `update` use cached data instead.
- If you hit GitHub API limits, set `YEKNAL_GITHUB_TOKEN` or `GITHUB_TOKEN`. Install Git to enable the fallback clone for API limits or interrupted raw-file downloads. See [GitHub API limits](https://docs.github.com/en/rest/using-the-rest-api/rate-limits-for-the-rest-api).
- Public GitHub static files and npm distribution need no yeknal account, API key, hosted backend, paid dependency or AI search service. Public service capacity is limited, not unlimited.
- A connected agent reports `instructions-prepared` and `runtimeVerified: false`. Verify in a fresh session: inspect the active instructions, give a substantive task that should trigger a lookup, check that a greeting skips the lookup, then repeat offline with already cached content. Check custom agents and subagents separately. Remote and cloud sessions need instruction and command access in their own environment, which a local setup cannot establish.
- Generated `yeknal-security.log`, `yeknal-security.json` and `yeknal-security.sarif` files are local evidence and should not be committed.

## Development and release

~~~bash
npm ci
npm test
npm pack --dry-run
~~~

From the repository root, `node tools/build-catalog.js --check` validates the generated catalog. The catalog generator reads a committed Git revision and emits names, descriptions, search metadata, content versions and SHA-256 manifests without full instructions. It also emits `archived.json`, the retired-skill list built from `archive/skills`. Generate after source commits, then include the static catalog in a follow-up commit. CI validates it against its declared immutable source revision rather than changing release bytes during publication.

`.github/workflows/publish.yml` is ready for npm trusted publishing but is gated by the repository variable `NPM_TRUSTED_PUBLISHING_ENABLED`. Set that variable to `true` only after npm has a matching OIDC connection for `tryraisins/MD_Files` and `publish.yml`. Until then, publish manually from an authenticated local npm client; do not store a long-lived npm publish token in repository secrets.

## Credits

The skill catalog this CLI installs adapts and consolidates work from many upstream authors. See the repository [PROVENANCE.md](https://github.com/tryraisins/MD_Files/blob/main/PROVENANCE.md) for full source, license, and notice details. Principal upstreams include Anthropic, Leonxlnx (taste-skill), Emil Kowalski, Appllama, oil-oil, ayghri, NeetigyaShah, and the provider teams (Microsoft, Figma, OpenAI, Notion, Vercel, Cloudflare, Netlify, Render, Sentry, Linear, GitHub).

## License

ISC
