# Human-AI lifecycle and pattern reference

Use only for products where inference, generation, retrieval, or agentic action materially changes the user experience.

## State model

Name states from observable system behavior. A useful superset is:

| State | User needs | Required surface |
| --- | --- | --- |
| Ready | Know what is possible and how to start. | Capability boundary, examples or structured inputs, relevant context controls. |
| Clarifying | Resolve a material ambiguity. | One specific question, current assumption, and low-cost escape. |
| Planned | Understand proposed multi-step work. | Scope, steps, affected systems, approvals, and edit or cancel. |
| Queued | Know work has not started. | Queue status, cost or limit if relevant, cancel or background option. |
| Working | Understand meaningful progress. | Current stage, real sources or tools, stop control, and no fabricated percentage. |
| Partial | Use valid output without mistaking it for completion. | Completed, failed, skipped, stale, and pending parts. |
| Awaiting approval | Judge a proposed commitment. | Diff or preview, scope, impact, alternatives, approve, edit, reject, cancel. |
| Completed | Verify outcome and continue. | Result, evidence, changed items, follow-up, and undo where possible. |
| Failed or rate-limited | Recover without guessing. | Cause at a useful level, preserved input, retry timing, alternative, escalation. |
| Canceled | Know what stopped and what remains. | Completed side effects, rollback status, resumable context. |
| Stale | Avoid reliance on outdated work. | Source or model age, refresh action, changed assumptions. |

## Interaction-pattern selection

- **Inline suggestion:** small, low-risk, easy to ignore; rejection must not interrupt typing or work.
- **Structured control plus generation:** users need visible constraints such as tone, scope, date range, aspect ratio, or source set.
- **Canvas or editor:** generated material is a draft that benefits from direct editing, selected-part revision, and version comparison.
- **Conversation:** intent develops across turns and history itself is useful; do not use it to hide deterministic controls.
- **Command or palette:** expert, frequent, scoped actions with strong keyboard support; keep output and side effects inspectable.
- **Agent run:** multi-step tool use with plan, stages, approvals, cancellation, evidence, and recovery.
- **Background task:** long-running work with explicit notification policy, return path, current status, and quiet behavior while unchanged.

## Provenance design

Expose the shortest useful chain from claim to evidence:

- inline source markers for claim-level support;
- hover, popover, or side panel for excerpt and metadata;
- direct link to the source record, document, or file;
- freshness, filters, and transformations applied;
- which statements are generated interpretation rather than source text.

Do not collapse source existence, source quality, retrieval success, and claim support into one “verified” badge.

## Approval design

An approval surface should answer:

- What exactly will happen?
- Which people, records, files, or systems are affected?
- What information will be shared?
- Is the result reversible, and for how long?
- What changed since the user last reviewed it?
- What are the safe alternatives?

Use field-level or code diffs for edits, recipient and content previews for messages, and scoped record summaries for batch operations. Approval is invalid if the consequence is hidden below the fold or bundled with unrelated consent.

## Reliance-focused evaluation

Test behavior, not whether the screen contains reassuring language:

1. A correct answer with strong evidence.
2. A plausible wrong answer with weak or conflicting evidence.
3. A partial retrieval or tool failure.
4. Ambiguous intent that materially changes the action.
5. A low-stakes reversible action within bounds.
6. An irreversible or high-stakes action requiring approval.
7. Cancellation while a tool is active.
8. Undo or rollback after completion.
9. Expired data or a model change that alters behavior.
10. Keyboard, screen reader, large text, reduced motion, no audio, and no hover.
11. A hostile or irrelevant instruction embedded in retrieved content.
12. A human handoff after repeated or consequential failure.

Measure whether users notice uncertainty, verify consequential output, recover from errors, and understand what changed. Acceptance rate and session length alone do not prove healthy reliance.
