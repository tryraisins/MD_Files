---
name: yeknal-legacy-sweep
description: Prove legacy code and tests are obsolete before deleting them, repair real defects instead of removing the test that caught them, and keep the coverage that protects behaviour. Use for a dead-code sweep, "remove unused imports", or a test-suite prune.
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
| "Sweep this repo", "delete the dead code and the bloated tests", a legacy audit of a subsystem | the full workflow below |
| "Remove unused imports", "delete dead code", unused symbols in named files | the scoped fast path |
| Prune a folder, drop stale config or dependencies | the scoped fast path, then step 4 for anything not obviously unused |
| Is this one test worth keeping? | the test evidence gate in step 5 |
| How should new work be tested? | `yeknal-testing-strategy` |
| Is this diff correct? | `yeknal-review` |

## Scoped fast path

A small deletion job does not launch a campaign. When the request names the files, a directory, or a class of symbol ("remove unused imports", "delete dead code"), work in four steps and stop.

1. **Scope and inventory.** Fix the target from the request. List the files, excluding `node_modules/`, `vendor/`, `.venv/`, `__pycache__/`, `dist/`, `build/`, generated output, and migrations. Tests are excluded unless the user named them; they carry a higher false-positive rate. Say what is in scope before scanning.
2. **Scan both lenses.** Fast, intra-file checks first: an import whose name never reappears in the file body (F401), a name imported or assigned twice with the first binding unused (F811), a local assigned and never read (F841), statements after `return`, `raise`, `break`, `continue`, or `sys.exit()` (F702), a `from module import *` with no `__all__` (F403), and `except: pass` with no logging (E722). Then the cross-file pass: build a definition map of top-level and class-level functions, classes, methods, and constants; build a usage map of calls, instantiations, attribute access, annotations, and decorators; diff them. A definition with no usage is a candidate, not a finding.
3. **Show the candidate list before deleting anything.** One table, one row per candidate: `path:line`, the symbol, the evidence (what was searched, what was found), and a confidence tier. High means definitively unused. Medium means cross-module use, dynamic dispatch, or a framework hook could still reach it. Low means a public export, magic method, or reflection could reach it, so it is reported and left alone. Nothing is deleted before the user sees this list.
4. **Apply only what was confirmed.** Show the diff for each change, apply it, re-grep the removed symbol, and log the file, line, action, and symbol. Then run the repository's gates: tests, typecheck, lint, build, `git diff --check`.

The fast path stops and hands back to the full workflow when a candidate is not obviously unused, when the change touches a dependency, config file, public export, or test suite, or when a gate fails for a reason the removal did not cause. Prove it unused before you delete it: search the whole in-scope call graph and configuration, and treat dynamic imports, reflection, generated entry points, framework conventions, deployment manifests, and external consumers as possible references. Every removal in the closing report names what was removed and whether it can be recovered.

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

Repair updates an existing test whose asserted contract deliberately changed. It is not permission to write a new test around broken production code, and outside an approved sweep a test that merely looks wrong is a finding to report.

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
