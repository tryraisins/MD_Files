# yeknal

Discover skills on demand, manage deliberate manual installations, and run a lightweight static security audit.

## Requirements

You do not need a global install. A new device needs:

- Node.js with npm;
- internet access;
- for user-level sync, at least one supported agent folder: Codex (`~/.codex`), Claude (`~/.claude`), Gemini Antigravity (`~/.gemini/config` or `~/.gemini/antigravity`), Antigravity (`~/.antigravity`), opencode (`~/.config/opencode`), Cursor (`~/.cursor`), Windsurf/Cascade (`~/.codeium/windsurf`), GitHub Copilot (`~/.copilot`), Gemini CLI (`~/.gemini`), Roo Code (`~/.roo`), Kiro (`~/.kiro`), Cline (`~/.cline`), OpenHands (`~/.openhands`), Amp (`~/.config/amp`), or the shared Agent Skills standard (`~/.agents`);
- for project sync, a current directory inside a Git repository.

Git is optional and is used as a fallback when GitHub API or raw-file downloads remain unavailable after automatic retries.
Git also resolves repository context and is required for repository-local asset
materialization. Without it, direct discovery/loading creates no project files.

## Commands

### One-time setup and on-demand loading

Version 2.4.0 adds a minimal global bootstrap, a shared cache, and repository-scoped
retrieval. Install Node.js 18 or later, start/configure a supported agent, then run:

~~~bash
npx yeknal setup
npx yeknal setup --list --json
npx yeknal setup --agents codex,claude,opencode --json
~~~

Setup retains one short managed instruction block per connected agent and a
versioned local CLI runtime. It does not register a global router SKILL.md or
embed a catalog/skill list. Greetings, simple questions, and trivial tasks bypass
discovery. For substantive work that benefits from a specialist, the agent runs
metadata search from its real working directory, selects one or two skills, and
reads their instructions directly. Restart or begin a new agent session after
setup. Automatic use depends on following the bootstrap and tool permissions.

### Migration, removal, and restore

Setup also migrates recognized global Yeknal collections across shared and
agent-specific discovery locations, including locations read by agents other
than those selected for the bootstrap. It identifies exact catalog names with
matching frontmatter identities, or existing setup ownership records. A prefix
alone is insufficient. Each identified folder is copied to a recoverable backup,
verified, and only then removed from active discovery. Customized contents are
backed up in full and reported. Unknown identities, symbolic links, project-local
folders, backup failures, and edited managed instruction blocks are preserved
and reported. Existing unrelated native configuration and third-party skills stay.

~~~bash
npx yeknal setup --backups --json
npx yeknal setup --restore BACKUP_ID --json
npx yeknal setup --restore all --json
npx yeknal setup --remove --agents codex,claude,opencode --json
~~~

Backups live under the shared cache's migration-backups directory, outside skill
discovery paths, and include original paths, content hashes, and filesystem
metadata. Restore refuses conflicting targets or modified backup contents. It
retains the backup after a successful restore. Removal disconnects unchanged
owned instruction blocks and retains backups/cache/runtime; it does not silently
restore global collections. A later setup migrates deliberately restored global
skills again. Repeated setup otherwise creates no duplicate integration/backups.
Before/after output measures skill files and description characters, not tokens.

### Repository context and supporting assets

~~~bash
npx yeknal search "debug React state" --limit 5 --json
npx yeknal load yeknal-troubleshoot --json
npx yeknal load yeknal-ui-quality-baseline references/accessibility-design.md --revision COMMIT_SHA --json
npx yeknal load yeknal-markdown-management scripts/audit-skills.ps1 --materialize --json
npx yeknal load yeknal-markdown-management --all-resources --json
npx yeknal resources clean --json
~~~

The loader asks Git for the repository containing the requesting working
directory, including subdirectories and worktrees. Project-local overrides
within that repository take precedence over shared cached copies. No project
override or local resource state is written into the shared cache. Plain loads
read instructions/references directly without adding native skill folders or
creating project files. Outside Git, lightweight discovery/loading remains
available and materialization refuses to create files.

Only an explicit materialize/all-resources request copies a selected supporting
tree into the repository's .yeknal/resources directory. Relative script imports
and assets remain together. This directory is not a native skill-discovery root.
Use returned absolute paths and the documented interpreter/working directory.
Loading does not run assets or install external dependencies. resources clean
removes only unchanged owned resources and preserves user modifications; clean
these resources before committing a project. No permanent skill inventory is
created merely by loading instructions once.

Pin supporting references with the sourceRevision returned by the initial load,
so instructions and files use the same immutable source. Local overrides return
null sourceRevision; omit the revision flag for them. Cross-skill references
can be loaded selectively through the same loader at the pinned revision.

### Manual installation compatibility

The skills command and all existing options remain available. skills --project
is a deliberate repository installation; --project --add preserves existing
project copies. Global skills installation deliberately recreates native global
collections, which a subsequent setup will back up and migrate again. Exact
profile sync retains its existing managed-folder replacement/removal behavior.
Automatic discovery does not use that stale-folder removal helper for migration.

### Supported integrations

Native bootstrap connections support Codex, Claude Code, and OpenCode V2, using
verified native instruction files. There is no MCP server or background service.
See official [Codex instructions](https://developers.openai.com/codex/guides/agents-md),
[Claude memory](https://code.claude.com/docs/en/memory), and
[OpenCode V2 instructions](https://opencode.ai/v2/docs/instructions/).
Configuration directory presence establishes detection, not authentication.
Ambiguous OpenCode V1 Claude fallback configurations are preserved and reported.
Other agents can use manual installations/CLI loading but are not automatically
connected. Cloud-only sessions without local command/file access are unsupported.
Actual Codex simple/substantive behavior is checked separately; global native
instruction ingestion and autonomous Claude/OpenCode behavior require separate
runtime verification. HANDOFF.md records the evidence actually obtained.

### Catalog, cache, and free-service limits

Markdown skill folders remain the source of truth. The catalog generator reads a
committed Git revision and emits names, descriptions, search metadata, content
versions, and SHA-256 manifests without full instructions. Search is local and
uses no LLM. Generate after source commits, then include the static catalog in a
follow-up catalog commit. CI validates it against its declared immutable source
revision rather than changing release bytes during publication.

The cache is storage, never a registered skill directory. Defaults are
%LOCALAPPDATA%/yeknal/cache on Windows, ~/Library/Caches/yeknal on macOS, and
$XDG_CACHE_HOME/yeknal or ~/.cache/yeknal on Linux. YEKNAL_CACHE_DIR sets an explicit
location; cache status reports it. Catalog search refreshes metadata after
24 hours, while update forces refresh. Failures preserve usable metadata and
apply persistent retry backoff. Immutable file downloads validate hashes and safe
paths and write atomically. Cached loads do not refresh or contact the network.

~~~bash
npx yeknal update --json
npx yeknal cache status --json
npx yeknal load yeknal-troubleshoot --offline --json
~~~

The offline flag or YEKNAL_OFFLINE=1 forbids retrieval network access. The retained
runtime avoids repeated npm invocation for agents; a manual npx command can still
need npm access before Yeknal starts. Uncached files require connectivity, and an
unpinned load may use an older verified cached copy with its revision reported.

Public GitHub static files and npm distribution require no Yeknal account, API
key, hosted backend, paid dependency, or AI search service. Public-service
capacity is limited, not unlimited. The legacy installer can encounter
[GitHub API limits](https://docs.github.com/en/rest/using-the-rest-api/rate-limits-for-the-rest-api).
Measure traffic before selecting mirrors, compression, or paid distribution.

### Development verification

~~~bash
node tools/build-catalog.js --check
npm test --prefix yeknal-cli
npm pack ./yeknal-cli --dry-run
~~~

Local E2E scripts/evidence are retained outside release commits according to the
maintainer's commit policy. HANDOFF.md records their exact rerun paths, reports,
failure modes, and which public/actual-agent boundaries were verified.

### `npx yeknal skills`

Downloads selected top-level skill folders from `tryraisins/MD_Files` on `main`, then installs them with the managed `yeknal-` prefix. Version 2.4.0 defaults to the 37-skill `core` profile instead of installing all 89 folders. The core keeps high-frequency process and reasoning management, project continuity, canonical UI/UX design, common motion design and review workflows, test auditing and planning, browser verification, all four security workflows, and the task-time `yeknal-skill-router` available globally. The optional `process` profile includes `yeknal-domain-modeling` for deliberate glossary and ADR work.

```bash
# Core profile in detected user-level agent folders
npx yeknal skills

# An exact specialist pack in the current Git repository
npx yeknal skills --project --profile design

# Combine packs for one repository
npx yeknal skills --project --profile core,web

# Install only named skills in this repository
npx yeknal skills --project --skills nextjs-developer,vercel-deploy

# Add a missing task-specific skill without removing existing project skills
npx yeknal skills --project --add --skills aspnet-core

# Preserve the pre-v2 full-catalog behavior
npx yeknal skills --all
```

Profiles are exact sets. Selecting `design` alone does not silently add `core`, which allows a user-level core install and a project-only specialist pack without duplicate skill names. `--skills` adds named skills to an explicitly selected profile, or installs only those names when no profile was supplied. Run `npx yeknal profiles` to list profiles, counts, and their skill names; task-time agents use this to select an exact catalog name.

The command:

- creates missing `skills` directories in supported agent folders;
- updates and removes only managed `yeknal-*` folders;
- preserves personal skill folders without that prefix;
- on Codex, skips repository skills already supplied by `~/.codex/skills/.system`;
- installs into every detected user-level parent; when `~/.agents` is present it is preferred, the overlapping per-harness folders (Codex, opencode, Cursor, Windsurf/Cascade, GitHub Copilot, Gemini CLI, Roo Code, OpenHands, and Amp) are skipped and their stale managed folders removed, while targets not configured to read `~/.agents` (Claude, Kiro, Cline, and the Antigravity folders) keep their own copy; clients that also read a kept folder (opencode, Cursor, Amp, and Windsurf read `~/.claude/skills`) can still see a managed skill twice;
- `--skip-claude` opts out of the Claude target for user-level sync and removes only stale managed `yeknal-*` copies there; use it when OpenCode/Cursor/Amp/Windsurf should avoid also discovering the copy in `~/.claude/skills`;
- with `--project`, resolves the current Git root and syncs only that repository's `.agents/skills`; Codex, Cursor, opencode, Roo Code, OpenHands, and other compatible clients discover repository skills from the working directory up to the repository root;
- with `--project --add`, installs only missing selected managed skills and preserves other managed and personal project skills; this is the safe mode for task-time skill routing;
- excludes `SEO`, which is reference material without a `SKILL.md`.

### Task-time skill routing

The `yeknal-skill-router` remains part of deliberate manual `core` installations.
Version 2.4.0 prefers direct search/load without native installation. Older CLI
workflows can still inspect `npx --yes yeknal@^2.2.0 profiles`, then explicitly add
the specialist with `npx --yes yeknal@^2.2.0 skills --project --add --skills <skill-name>`.
Setup migrates recognized global routers and uses only the minimal bootstrap.

The agent decides whether specialist guidance adds value; greetings/simple tasks
skip discovery. The CLI handles catalog validation and selective retrieval.
Explicit user-scope `npx yeknal skills --skills <skill-name>` registers a global
copy again, so use that only when permanent native availability is desired.

Design and security are grouped without collapsing distinct outputs into one oversized prompt. Core contains canonical UI/UX guidance and shared motion workflows; the `design` pack adds specialist aesthetics, prototyping, Figma, and image-led workflows, plus the same motion skills for exact profile installs. The task-time router can still add any missing task-specific specialist. The `security` pack remains four focused skills for implementation, review, threat modeling, and ownership analysis.

### `npx yeknal profiles`

Lists the built-in `core`, `process`, `design`, `security`, `web`, `platform`, `documents-media`, `productivity`, and `openai` profiles without making a network request. `all` is a dynamic full-catalog profile.

### `npx yeknal security`

This command:

1. downloads `skills/yeknal-application-security/Security-Master.md` temporarily;
2. syncs `yeknal-application-security`, `yeknal-security-best-practices`, `yeknal-security-ownership-map`, and `yeknal-security-threat-model`;
3. scans the current project;
4. writes `yeknal-security.log`, `yeknal-security.json`, and `yeknal-security.sarif`, then removes the temporary master file.

The scanner checks static signals for exposed secrets and credential files, dependency risk, authentication and session handling, input validation, CORS, security headers, database access, unsafe frontend sinks, and framework configuration. Checks use stable rule IDs and current `Security-Master.md` anchors. JSON supports custom processing, while SARIF 2.1.0 supports compatible code-scanning tools. Findings require human review; a static scan cannot prove runtime authorization, exploitability, deployment posture, or the absence of vulnerabilities.

## Development and release

```bash
npm ci
npm test
npm pack --dry-run
```

`.github/workflows/publish.yml` is ready for npm trusted publishing but is gated by the repository variable `NPM_TRUSTED_PUBLISHING_ENABLED`. Set that variable to `true` only after npm has a matching OIDC connection for `tryraisins/MD_Files` and `publish.yml`. Until then, publish manually from an authenticated local npm client; do not store a long-lived npm publish token in repository secrets.

## Notes

- If no supported user-level agent folder exists, user-scope sync exits without installing anything. Project scope only requires the current directory to be inside a Git repository.
- Downloads use bounded retries for temporary network failures and GitHub `408`, `425`, `429`, and `5xx` responses. `Retry-After` is honored up to 10 seconds. After retry exhaustion, the command uses a shallow Git clone when Git is installed.
- If GitHub API limits are reached, set `YEKNAL_GITHUB_TOKEN` or `GITHUB_TOKEN`. Install Git to enable the fallback clone for API limits or interrupted raw-file downloads.
- Generated `yeknal-security.log`, `yeknal-security.json`, and `yeknal-security.sarif` files are local evidence and should not be committed.

## Credits

The skill catalog this CLI installs adapts and consolidates work from many upstream authors. See the repository [PROVENANCE.md](https://github.com/tryraisins/MD_Files/blob/main/PROVENANCE.md) for full source, license, and notice details. Principal upstreams include Anthropic, Leonxlnx (taste-skill), Emil Kowalski, Appllama, oil-oil, ayghri, NeetigyaShah, and the provider teams (Microsoft, Figma, OpenAI, Notion, Vercel, Cloudflare, Netlify, Render, Sentry, Linear, GitHub).

## License

ISC
