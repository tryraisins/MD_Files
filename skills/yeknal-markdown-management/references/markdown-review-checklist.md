# Markdown Review Checklist

Use the sections relevant to the task. Do not turn every small edit into a full documentation program.

## Content

- The intended reader and primary job are clear.
- Claims match current code, configuration, or an identified external source.
- Facts, inferences, recommendations, and unknowns are distinguishable.
- Terminology stays consistent across navigation, headings, commands, and examples.
- Removed material is duplicate, obsolete, or preserved elsewhere.

## Structure

- The document has a clear entry point and scan path.
- Heading levels are ordered and section names describe content.
- Long reference detail is split only when that improves discovery or context loading.
- Tables compare repeated fields; prose explains decisions and caveats.
- Important prerequisites appear before the command that needs them.

## Links and commands

- Relative paths resolve from the document containing the link.
- Renamed files have no stale inbound references.
- Public anchors needed by external links remain stable or have a migration note.
- Commands are platform-correct, copyable, and do not contain real secrets.
- External claims link to the primary source when accuracy may drift.

## Diff hygiene

- No unrelated rewriting or line-ending churn.
- No generated artifacts, temporary reports, credentials, or private values are staged.
- Code fences close and use appropriate language labels.
- Markdown lint, link checks, `git diff --check`, and relevant examples pass or have an explicit limitation.

## Agent Skills

- Folder and frontmatter name match the Agent Skills specification.
- Description includes what the skill does and when it triggers.
- Main instructions remain focused; deep detail is routed to references.
- Imported material includes its license and source provenance.
- Specialist instructions retain precedence over generic guidance.
- The skill contains no hidden authority escalation, credential request, or unbounded destructive workflow.
