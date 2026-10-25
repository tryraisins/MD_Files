# Archive

Skills that no longer earn a slot in the catalog, kept for their history.

This directory sits outside every discovery root. `skills/` is the only place the catalog builder, the CLI, and each harness scan for skills, so nothing under `archive/` is installed, routed to, listed, or counted. The files stay in the repository so a decision can be revisited without reconstructing the content.

Archived skills are not maintained. Their frontmatter still names the skill they used to be, their links point at files that may no longer exist, and nothing here should be copied into a new skill without re-checking it.

## Restoring one

Move the folder back into `skills/`:

```bash
git mv archive/skills/<name> skills/<name>
```

Then check three things before publishing:

1. `SKILL.md` has `name` matching the folder and a description that still states its entry gate.
2. Every relative link resolves inside the restored folder.
3. The skill does not duplicate one that now covers the same job. If it does, merge the content instead of restoring a second entry.

## Contents

| Folder | Why it was archived |
| --- | --- |
| `yeknal-animation-vocabulary` | Reverse-lookup glossary the model already answers; its content mirrors a page on the site, which stays. |
| `yeknal-brainstorm` | General ideation the model already does confidently. |
| `yeknal-design-taste-frontend-v1` | Compatibility copy of a prompt with no API to break. Its three dials and its arsenal list were salvaged into `skills/yeknal-design-taste-frontend/references/dials-and-arsenal.md`. |
| `yeknal-engineering-specialists` | Persona router with no entry gate that also recommends unit tests, against repository policy. |
| `yeknal-gpt-taste` | Eight-line router with no instructions of its own; its only job was a legacy name in metadata. |
| `yeknal-skill-router` | Its own body says it is not registered globally, and the managed bootstrap already does the job. |
