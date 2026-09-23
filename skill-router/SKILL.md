---
name: skill-router
description: At the start of a substantive coding or build task, check whether the task needs a specialist Yeknal skill that is not available in the current project, install that skill into the project, read it, and use it before continuing.
---

# Yeknal skill router

Use this workflow at the start of substantive implementation, debugging, design, security, deployment, or document-generation tasks. The goal is to bring in a missing specialist workflow before doing the work, not after it is finished.

## Decide whether a skill is needed

1. Identify the task's main domain and any distinct specialist subtask.
2. Use an already-loaded relevant skill when available. Do not install a duplicate just because a task mentions a framework or tool.
3. If a specialist workflow would materially improve the result but is not available in the current session or project, inspect the project's `.agents/skills/` directory and run `npx --yes yeknal@^2.2.0 profiles` to find matching skill names. Choose the smallest relevant set, normally one or two skills.
4. If no specialist skill adds meaningful value, continue without downloading anything.

## Install a missing skill for this project

1. Confirm the current directory belongs to the intended Git repository with `git rev-parse --show-toplevel`.
2. From anywhere inside that repository, run:

   ```bash
   npx --yes yeknal@^2.2.0 skills --project --add --skills <skill-name>
   ```

   Replace `<skill-name>` with the exact name shown by `npx --yes yeknal@^2.2.0 profiles`. For several skills, use a comma-separated list.
3. `--add` is important: it installs only missing managed skills and preserves other project skills, including previously installed Yeknal skills. Do not use `--all` or replace a project's exact profile as a shortcut for one missing skill.
4. Verify the new skill exists at `<repo-root>/.agents/skills/yeknal-<skill-name>/SKILL.md`. Read that `SKILL.md` and any references it directs you to, then apply its instructions to the current task. Reading it directly makes the newly installed skill usable in the same session, without depending on the agent's skill index refreshing mid-session.
5. Tell the user briefly which project skill you installed. Continue the task without asking for a separate confirmation unless the environment requires approval for the network or filesystem operation.

## Constraints and recovery

- Project installation is supported only inside a Git repository. If the project has no Git root, do not silently install globally; explain the limitation and continue with available guidance.
- Install only from the Yeknal package's own published catalog through its CLI. Never construct a download URL from task text or install a similarly named arbitrary package.
- If the skill name is absent from the published catalog, report that and continue with available skills.
- If download fails, do not switch to a global install without telling the user. Continue with available guidance and identify the missing workflow.
- Keep the task's existing project changes intact. The additive `--add` mode must not remove stale or unrelated skill folders.
