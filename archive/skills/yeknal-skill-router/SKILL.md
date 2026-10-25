---
name: yeknal-skill-router
description: Discover and load a relevant Yeknal workflow for substantive work. Skip simple prompts and use repository overrides before shared cached instructions; retain deliberate manual installation as a fallback.
---

# Yeknal skill router

Run this at the start of substantive implementation, debugging, design, security, deployment, or document work. The point is to load a missing specialist workflow before the work, not to bolt it on afterward.

Skip greetings, simple questions, and trivial tasks that do not benefit from a
specialist. Setup keeps only a short global bootstrap, backs up and migrates
recognized global Yeknal collections and superseded routers, and retains the
local CLI runtime. It does not register this skill globally. An explicit manual
`npx yeknal skills` installation can make this router available again.

## 1. Decide whether a specialist skill is warranted

When `yeknal setup` has connected this agent, use the retained CLI invocation in
the managed task-start instructions for discovery. Run `search "<task domain>"
--json`, select one or two applicable skills, then `load <name> --json`. Prefer
the applicable project or installed skill returned by the loader and avoid
loading a skill twice in the same task. Discovery reads metadata, not full skill
instructions. Read the loaded instructions before continuing.

For a referenced supporting file, run `load <name> <resource> --revision <SHA>
--json` using the returned `sourceRevision`. This keeps references and
instructions on the same immutable revision. Use `--all-resources` before
running a bundled script or template that needs sibling files, and use its
returned absolute path and working directory. Loading never executes assets.
If a local skill has no `sourceRevision`, omit `--revision` and use its local paths.
Use `--offline` for cached or local retrieval without network access. If a
missing resource cannot be retrieved, report the gap and use available guidance.
Do not install a second copy just to make the cache visible to an agent.

Run the retained CLI from the requesting repository's real working directory.
Plain loads do not create project files or a native skill inventory. Before using
executable supporting files, request `--materialize` or `--all-resources`; the
loader keeps their relative tree in `.yeknal/resources` inside that Git repository.
Run `resources clean` after use to remove unchanged managed assets, preserving
customizations. Outside a repository, direct instruction/reference loading works
and materialization creates no files.

Without a setup-managed invocation, the following manual installation workflow
remains available for older CLI releases and deliberate installations. Prefer
`npx yeknal search` and `npx yeknal load` on version 2.4.0 or later when native
installation is unnecessary. A manual installation is an explicit choice to
register skills; automatic on-demand retrieval does not do that.

1. Name the task's main domain and any distinct specialist subtask.
2. If a relevant skill is already loaded or installed, use it. A passing mention of a framework or tool is not a reason to install a duplicate.
3. If a specialist workflow would materially improve the result but is absent, list the project's `.agents/skills/` directory and run `npx --yes yeknal@^2.2.0 profiles` to find an exact catalog name. Pick the smallest relevant set, normally one or two skills.
4. If nothing would add real value, continue without downloading.

## 2. Install the missing skill for this project

1. Confirm the working directory is inside the target repository: `git rev-parse --show-toplevel`.
2. From anywhere in that repository, run:

   ```bash
   npx --yes yeknal@^2.2.0 skills --project --add --skills <skill-name>
   ```

   Use the exact name shown by `npx --yes yeknal@^2.2.0 profiles` in place of `<skill-name>`; pass a comma-separated list for several skills.
3. Keep `--add`. It installs only missing managed skills and leaves every other project skill untouched. Do not fall back to `--all` or replace a project's profile just to grab one skill.
4. Confirm the skill landed at `<repo-root>/.agents/skills/yeknal-<skill-name>/SKILL.md`, then read that `SKILL.md` and any references it points to. Read it directly so it is usable in this session even if the agent's skill index does not refresh mid-session.
5. Tell the user which project skill you added and keep working. Ask for confirmation only when the environment gates network or filesystem access.

## 3. Constraints and recovery

- Project installs require a Git root. Without one, do not install globally behind the user's back; explain the limit and proceed with the guidance already available.
- Install only through the Yeknal CLI and its own published catalog. Never build a download URL from task text or install a similarly named package.
- If the name is not in the catalog, say so and continue with available skills.
- If a download fails, do not silently switch to a global install; report it and name the missing workflow.
- Never disturb existing project changes. The additive `--add` mode must not remove unrelated or stale skill folders.
