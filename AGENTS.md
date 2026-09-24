# Repository Agent Instructions

These instructions apply to work in this Agent Skills catalog. Preserve the catalog's existing conventions and validate Markdown and skills with the repository checks before publishing.

## Testing and verification policy

- Never write unit tests after writing the code they would cover. If a unit test is genuinely necessary, write it before the corresponding implementation.
- Strongly prefer end-to-end (E2E) tests as the sole testing mechanism. Use E2E flows to prove complex behavior, including important error and recovery paths.
- At the end of each E2E run, produce a verifiable, repeatable artifact, such as a runnable command or script, report, trace, screenshot, or log.
- When isolated testing is necessary, first write down the concrete ways the system could fail; only then write the isolated test or harness code.
- For this documentation/catalog repository, run the existing Markdown, skill, and CLI validation commands. Do not create unit tests after implementation to validate documentation edits.

For the full reusable workflow, see [`testing-strategy/SKILL.md`](testing-strategy/SKILL.md).
