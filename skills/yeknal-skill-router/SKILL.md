---
name: yeknal-skill-router
description: At the start of a substantive coding or build task, check whether the task needs a specialist Yeknal skill that is not available in the current project, install that skill into the project, read it, and use it before continuing.
---

# Yeknal skill router

Run this at the start of substantive implementation, debugging, design, security, deployment, or document work. The point is to load a missing specialist workflow before the work, not to bolt it on afterward.

## 1. Decide whether a specialist skill is warranted

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
