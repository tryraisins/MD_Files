---
name: yeknal-review
description: Review code or systems for concrete defects, regressions, and maintainability risks when the user requests an audit or quality assessment.
---

# Review

Perform a thorough review of a change, file, or system, returning actionable findings ordered by severity within each axis.

## Inspect

- Read source, diffs, tests, configuration, and history directly.
- Use browser testing when rendered behavior is in scope and the tooling exists.
- Consult current primary documentation only where the repository cannot establish expected behavior.
- Do not invent unavailable tools or agents.

## Review the change on two independent axes

For a branch, pull request, or working-tree change, establish the comparison point and inspect the complete relevant diff before judging it. Verify the requested base or target resolves; for branch comparisons, use the merge base so unrelated target-branch changes are not attributed to the reviewed work. Include the commit range and originating requirement when available.

Report these axes separately so a strong result on one cannot conceal a failure on the other:

- **Standards**: does the change follow repository instructions, documented coding standards, established architecture, and relevant language or platform conventions? Name the rule and its source. Use smells as evidence-led heuristics, not automatic violations, and let explicit repository conventions take precedence.
- **Spec**: does the change implement the requested behavior and acceptance criteria? Trace each important requirement to the changed behavior. Call out missing, partial, incorrect, or unrequested behavior with the relevant requirement as evidence.

Find the specification in the user's supplied brief, referenced issue, or relevant repository spec. If none is available, say the spec axis could not be verified; do not invent requirements. For a review of a single file or system rather than a diff, apply the same distinction to the requested contract and the repository's standards.

Keep findings ordered by severity within each axis. Each finding needs a precise file and line, observable impact, evidence, and the smallest appropriate correction. Do not merge or average the two axis results into a single score. If an axis has no supported findings, say so.

## Focused lenses

### Refactoring and dead-code review

When the request is to refactor, simplify, or clean up code, inspect dependency direction, duplication, dead imports/functions/branches, naming, cohesion, and test coverage before proposing edits. Separate safe mechanical cleanup from behavior-changing redesign. Give each finding a file/line, impact, confidence, and smallest safe fix. Do not remove code merely because it looks unused without checking exports, dynamic imports, configuration, tests, and runtime entry points.

### Language simplification review

For TypeScript, Python, and Go, look for defensive over-engineering that obscures a known contract: generic values propagated beyond a boundary, fake validation that ends in a cast, silent empty fallbacks, catch-all or swallowed errors, repeated parsing, needless coercion, one-use extraction helpers, pass-through layers, and abstractions without a real substitution or policy boundary.

Do not flag real boundary validation, domain-specific normalization, idiomatic language error handling, framework-mandated interfaces, cancellation, retries, or deliberate public compatibility. A finding must name the actual contract, the observable risk or maintenance cost, and the smallest behavior-preserving simplification. Never recommend deleting a guard merely because it is defensive.

## Output

- One summary line: what was reviewed, against what comparison point, and what could not be verified.
- Findings grouped by axis and ordered by severity; each with file and line, observable impact, evidence, and the smallest appropriate correction.
- Explicit next actions, and the checks a reader can rerun.
