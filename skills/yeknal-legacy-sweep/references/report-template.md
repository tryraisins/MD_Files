# Report template

Use this structure for the closing report. Keep it short enough to read and specific enough to audit.

```markdown
# Legacy sweep: <repository or subsystem>

Scope: <paths, commits or branches, exclusions>
Baseline: <HEAD, dirty state, date>

## Gates

| Gate | Baseline | Final | Command |
| --- | --- | --- | --- |
| Test suite | 12 pass, 2 fail | 14 pass, 0 fail | `npm test` |
| Typecheck | pass | pass | `npm run typecheck` |
| Lint | 3 warnings | 0 warnings | `npm run lint` |
| Build | pass | pass | `npm run build` |
| Diff check | clean | clean | `git diff --check` |
| Behaviour | not run | exercised: <flow> | `<command or URL>` |

## Removed

| Path or symbol | Kind | Proof | Replaced by |
| --- | --- | --- | --- |
| `src/dates.ts:formatLegacyDate` | function | no references after lane 2; not exported; no dynamic path | `formatDate` |
| `test/legacy-date.spec.ts` | test | asserted the removed function; contract no longer exists | none |

## Repaired or consolidated

| Test or code | Change | Contract now protected |
| --- | --- | --- |
| `test/checkout.spec.ts` | assertion now checks the response, not the mock call | expired-card rejection |

## Bugs fixed

| Defect | Evidence | Fix |
| --- | --- | --- |
| Negative quantity accepted at checkout | baseline failure in `test/checkout/qty.spec.ts` | validation added at the boundary |

## Coverage preserved

| Contract | Survivor | Verified |
| --- | --- | --- |
| Expired card rejected | `test/checkout/expired-card.spec.ts` | yes |

## Dependencies, assets, configuration

| Item | Action | Proof |
| --- | --- | --- |
| `left-pad` | removed | no import after sweep; `depcheck` clean |

## Blocked

| Candidate | Missing evidence | What would unblock it |
| --- | --- | --- |
| `legacyWebhookVersion` | deployment manifest not in repository | manifest, or confirmation from the owner |

## Not run or not verified

- <check>, because <reason>. This is unverified, not passing.

## Follow-ups

- <item the sweep deliberately left out of scope>
```

## Rules for the report

- Every removal in the table has a row behind it. If the row is not written, the removal is not proven.
- Never write "all tests pass" unless the command was run after the last edit.
- Separate the removed bloat count from the behaviour claim. A smaller suite is not a result by itself.
- Report a surviving baseline failure as a defect with its evidence, not as cleanup debt.
- Name the blocked candidates explicitly. A sweep that reports only what it removed hides the judgment calls.
- Keep unverified statements in their own section so nothing reads as proven.
