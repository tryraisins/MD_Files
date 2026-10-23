# Report template

One deliverable. Copy this shape and fill it. Keep it short enough that someone reads it before launch day.

## Header

```markdown
# Launch readiness: <product>

Date:
Reviewed by:
Target: <commit, branch, or deployment URL>

Jurisdictions in scope: <countries or regions>
Audience age:
Personal data collected:
Money moves: yes / no
Users publish content: yes / no
```

## Verdict

One of three, stated in the first two lines rather than buried:

- **Not ready.** A blocker exists. Name it in one sentence.
- **Ready with fixes.** No blocker, but items must land before public traffic.
- **No gaps found in the checked register.** Never "compliant". Add what was not checked.

## Blockers

| ID | Surface | Finding | Evidence | Fix | Owner |
| --- | --- | --- | --- | --- | --- |

A blocker is exposed personal data, a charge without consent, a child's data collected without a guardian, a secret in a client bundle, or a destructive action with no recovery. Everything else waits.

## Register

One row per check performed. Both registers, in one table, so nobody has to reconcile two documents.

| ID | Surface | Check | Assessment | Finding | Fix | Owner | Status |
| --- | --- | --- | --- | --- | --- | --- | --- |

- `Assessment` is `measured`, `heuristic`, or `unassessed`.
- `Status` is `fail`, `pass`, `open`, or `verify`.
- `Owner` is a skill name or a person. Nothing is ownerless.

Group by surface, in this order: data collected, third-party embeds and transfers, minors, marketing email, subscriptions and payments, user content, accessibility, AI features, breach response, vendors, then the seven launch gates.

## Needs counsel

Rows where the answer depends on judgement rather than a lookup: regulated data, cross-border instruments, children's products, money handling, employment or health data.

List the question, not a guess at the answer. One line each, with the jurisdiction.

## Needs a filing or paperwork

These have lead times, so they appear early and dated.

| Filing | Regime | Deadline | Owner | Status |
| --- | --- | --- | --- | --- |

Typical entries: DMCA agent designation and the three-year renewal, NDPC registration, DPCO-mediated audit return, NITDA intermediary report, processor agreements.

## Not checked

Every `unassessed` row, and every check this audit could not perform, listed plainly. This section protects the reader from mistaking a thin report for a clean one.

Common entries: field performance, inbox placement, whether a restore was tested, whether a filing was made, whether a notice is truthful.

## Verify before quoting

Any figure or section marked `verify` in the register, repeated here with the exact source to confirm. Do not let a flagged number travel into a user-facing document.

## Next actions

Three to seven items, ordered. Each says what to do, who does it, and what proves it is done. Nothing vague, nothing that requires re-reading the register.

## After the fixes

Say what changed and re-run the register. Keep the `unassessed` rows listed rather than deleting them, and do not upgrade a row to `pass` because a policy sentence was edited.
