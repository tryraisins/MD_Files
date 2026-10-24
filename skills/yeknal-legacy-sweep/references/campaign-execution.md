# Campaign execution

A sweep across a whole repository fails in predictable ways: two writers collide, a lane runs out of context mid-batch, or a deletion hides a failing test. This file is the operating procedure that prevents those three.

## Lane design

Split by production ownership, not by folder name. A lane is one owner of one behaviour area with one set of files.

| Lane type | Can run in parallel | Writes | Return |
| --- | --- | --- | --- |
| Inventory | Yes | No | Scope map, entry points, external consumers |
| Discovery | Yes | No | Candidates with rows started |
| Deletion | No, serialized | Yes | Diff, gate results, rows completed |
| Verification | Yes, read-only | No | Baseline or final gate results |

Rules:

- No two writers touch the same file, config, or fixture in the same round.
- Shared test support (`conftest.py`, `setup.ts`, factories, fixtures) is serialized even when the tests are not.
- A discovery lane that starts proposing edits has left its lane. Stop it.
- The orchestrator owns the keeper map; a lane does not decide that a contract can lose its proof.

## Discovery brief

Give each read-only lane exactly this:

```
Scope: <paths, and what is explicitly out of scope>
Question: find removable code and tests in <area>
Report per candidate:
  - path and symbol or test name
  - reference search run, and result
  - framework or dynamic mechanism checked
  - public contract or external consumer status
  - replacement or unreachable reason
  - confidence: proven / blocked / judgment
Do not edit. Do not summarise without rows. If a row cannot be filled, say which line failed.
```

A lane that returns prose without rows has not completed the brief. Send it back once with the missing line named.

## Write lane contract

```
Owns: <exact files>
Batch: <max files or symbols this round>
Must not touch: <shared fixtures, config, generated files>
Before returning: focused tests, then full suite, typecheck, lint, build, git diff --check
Return: diff summary, gate results, rows completed, anything blocked
Revert if: an unrelated keeper fails, or a gate regresses for a reason you cannot explain
```

Batches stay small enough that the executor can hold the whole batch in context. If a lane is cut off, the work already applied must still be coherent and gate-passing.

## Triage table

| Signal | Classification | Action |
| --- | --- | --- |
| Fails at baseline, assertion targets live behaviour | Product bug | Fix the code; keep the test |
| Fails at baseline, assertion targets removed or changed behaviour | Obsolete contract | Repair to the current contract, or remove with the replacement proof |
| Passes alone, fails in suite, no product change | Flaky or shared state | Quarantine with command, seed, ordering evidence; fix the isolation if cheap |
| Never reaches an assertion, or imports fail | Already broken | Remove only after confirming no contract was protected |
| Passes for the wrong reason (mock supplies the result) | Weak test | Repair to reach the real boundary, or consolidate into a stronger test |
| Fails only after a deletion | Regression from the deletion | Revert the deletion; redo the row |

The order matters. A test that fails because the product is wrong is a bug report, and deleting it converts a defect into silence.

## Keeper map

Build before the first deletion. One row per contract:

| Contract | Surviving proof | Command |
| --- | --- | --- |
| Checkout rejects an expired card | `test/checkout/expired-card.spec.ts` | `npm test -- checkout` |
| Session cookie is HttpOnly in production config | `test/security/cookies.spec.ts` | `npm test -- security` |

Then, before removing a test: is the contract in the map, and is the named survivor green? If the contract has no survivor, the test is not removable, whatever its shape.

## Checkpoint protocol

After each lane:

1. Run the focused checks for the affected area.
2. Run the full gate set from the baseline.
3. Compare with the baseline: same failures, or fewer. A new failure stops the lane.
4. Record the diff stat and the rows completed.
5. Commit or stash so the next lane starts from a known tree.

A campaign that stops after any checkpoint should leave a working repository and an honest report, not a half-applied batch.

## Cheap-executor limits

When the work runs on a small-context or low-cost model:

- one lane per dispatch, with the brief inlined;
- a hard cap on candidate rows per batch, typically 10 to 20;
- no cross-lane reasoning: the orchestrator merges findings;
- the model must return the row, not a recommendation;
- escalations go up only on a real capability failure, never on a timeout or a rate limit;
- the orchestrator re-runs every gate the lane claims to have run.

## Failure handling

- A lane returns "everything looks unused": suspect a broken search scope, not a codebase full of dead code.
- A lane returns rows with no search detail: reject and re-dispatch with the evidence standard attached.
- Gates fail for reasons unrelated to the lane: stop, report, and do not attribute them to the sweep.
- The sweep discovers a security, data-loss, or authorization defect: stop that lane, report it separately, and do not fold it into cleanup.
