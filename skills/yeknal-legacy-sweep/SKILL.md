---
name: yeknal-legacy-sweep
description: Audit a whole repository or subsystem for unused legacy code and bloated or worthless tests, prove each candidate is obsolete before deleting it, repair real defects instead of removing the test that caught them, and keep the coverage that still protects behaviour. Use when asked for a deep cleanup, a dead-code sweep, a test-suite prune, or a legacy audit, and whenever deletion is on the table.
metadata:
  last-reviewed: "2026-10-24"
  boundary: "Read-only until the user authorizes deletion. Never authors unit tests."
---

# Legacy sweep

Remove what the repository no longer needs, keep what it proves, and leave a record that shows which is which.

A sweep is a campaign, not a lint pass. Reading and judging come first, and every deletion carries a filled evidence row. A candidate that cannot fill its row leaves the sweep as a blocker, never as a removal.

## Where this fits

| Request | Use |
| --- | --- |
| "Sweep this repo", "delete the dead code and the bloated tests", a legacy audit of a subsystem | this skill |
| Unused imports or symbols in named files | `yeknal-dead-code-hunter` |
| Prune a folder, drop stale config or dependencies | `yeknal-cleanup` |
| Is this one test worth keeping? | the test evidence gate below |
| How should new work be tested? | `yeknal-testing-strategy` |
| Is this diff correct? | `yeknal-review` |

Earlier catalog versions shipped the test-value gate as `yeknal-test-audit`. That skill was renamed to this one and widened to cover production code; the evidence bar for tests is unchanged and lives in step 5.

## Boundaries

- Read-only until the user authorizes deletion. Discovery and evidence collection never edit. Removal needs an explicit request or approval of a proposed batch.
- Never delete to make a suite green. A failing test is a failure first and a candidate second.
- Never touch generated files, migrations, schema definitions, vendored code, snapshots, or a public export without per-item confirmation.
- Never author unit tests. Prove behaviour through the real entry point, following `yeknal-testing-strategy`.
- Preserve unrelated working-tree changes. One writer per file set, never two lanes in the same files.
- Stop at product judgment. If keeping or cutting something changes behaviour, pricing, permissions, or a contract, report it and ask.

## Workflow

### 1. Establish the baseline

Record the branch, HEAD, and dirty files. Then run the repository's own gates: full suite, typecheck, lint, build, `git diff --check`. Keep the exact command and the failure signature for every red test.

That failure list is the bug list. Nothing is deleted to shorten it.

### 2. Inventory the scope

Map what could reference anything: entry points, routes, jobs, CLI commands, the exported package surface, tests and fixtures, config and environment keys, CI, documentation examples, scripts, assets, and migrations. Note external consumers such as a published package, another repository, or a deployed client.

Exclude generated, vendored, and migration output from candidates unless the user confirms otherwise.

### 3. Plan lanes, then read

Split by production ownership, not by filename prefix. Discovery lanes are read-only and may run in parallel; each returns candidates with its evidence row filled and the searches it ran. Write lanes are serialized with a single owner per file set, in bounded batches that fit the executor's context.

Use [campaign execution](references/campaign-execution.md) for the lane briefs, the return format, and the batch caps.

### 4. Fill the evidence row for code

A symbol, file, dependency, asset, config key, or branch is removable only when every line below is recorded:

- no reference in any in-scope file, including strings, config, templates, styles, and tests;
- no dynamic, reflective, generated, or framework registration path: decorators, DI containers, route tables, plugin registries, event names, string keys, ORM and serialization models;
- not a public API, export, entry point, documented flag, or published surface;
- no external consumer, deployment manifest, or scheduled job reference;
- the behaviour is duplicated by a live path or is genuinely unreachable;
- the tool output that raised it, and why it is a verdict rather than a candidate.

See the [evidence standard](references/evidence-standard.md) for the full table, framework traps, and the tool matrix. A row with a gap becomes a blocker that names the missing item.

### 5. Fill the evidence row for tests

For each candidate ask:

1. What observable behaviour, invariant, or independent contract does it protect?
2. What plausible regression would make it fail?
3. Why does no surviving test catch that regression?
4. Which boundary owns the contract, and can the test reach it directly?
5. Does it depend on a production seam that exists only for tests?

Then classify **retain**, **repair**, **consolidate**, or **remove**. Removal needs either the surviving proof or the reason no contract exists. Overlapping topic is not redundancy, and an implementation-shaped assertion may still be the only guard on a protocol, migration, security rule, or generated artifact.

### 6. Triage every baseline failure

- **Product bug**: the code is wrong. Fix it and keep the test.
- **Obsolete contract**: the test asserts behaviour the product deliberately no longer has. Repair it or remove it with the row that says what replaced the proof.
- **Flaky**: fails without a code change, at a real boundary. Quarantine it with the evidence (command, seed, timing). Never delete it as flaky.
- **Already broken**: an unreachable test, dead fixture, or helper that no longer compiles. Remove only after confirming it protected no contract.

A red baseline that survives the sweep is a finding to report, not a failure of the sweep.

### 7. Build the keeper map before deleting

For every contract you intend to keep, name the surviving test and the command that runs it. Delete production code first only when the tests exercising it are already proven obsolete. Otherwise the test stays until its replacement exists.

Never delete a test because production code was removed. Revert a lane if an unrelated keeper fails.

### 8. Execute, checkpoint, gate

Per lane: run the focused checks, then the full suite, typecheck, lint, build, and `git diff --check`. Exercise the affected behaviour through its real entry point. A lane that breaks unrelated coverage is reverted, not patched around.

Checkpoint after each lane so the sweep stays reversible and a stopped session leaves a usable tree.

### 9. Report

Use the [report template](references/report-template.md). Report scope, baseline and final gate results, every removal with its proof, bugs fixed, coverage preserved, blockers with the missing evidence item, and the commands actually run. State skipped or unrun checks plainly.

## Stop conditions

- A candidate needs a framework, runtime, or external consumer that cannot be inspected.
- Removal changes a public contract, data shape, pricing, permissions, or user-visible behaviour.
- The batch would exceed the set the user approved.
- The suite is red for reasons outside the scope and the sweep would hide them.

## Working with a cheap executor

- One lane, one batch, one checkpoint. Report progress instead of holding the plan in context.
- Every deletion cites a filled row. No row, no deletion.
- Prefer the smallest change that removes the need for the code.
- If two candidates interact, resolve the dependency first and re-run the gate.
- Return a blocker rather than guessing at intent.

## References

| File | Read when |
| --- | --- |
| [evidence-standard.md](references/evidence-standard.md) | Filling a row, judging a tool hit, or deciding whether a candidate is a verdict or a lead |
| [campaign-execution.md](references/campaign-execution.md) | Splitting lanes, briefing a subagent, triaging failures, or running a batch with a small-context model |
| [report-template.md](references/report-template.md) | Writing the closing report or the blocker list |

## Credit

The test evidence gate was originally adapted from the audit concepts in the [openclaw test-audit skill](https://github.com/openclaw/openclaw/blob/main/.agents/skills/test-audit/SKILL.md), with no source text copied. This skill extends that work to production code, failure triage, and campaign execution. Repository-specific commands and change policies always take precedence.
