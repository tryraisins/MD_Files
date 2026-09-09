---
name: human-ai-interface-design
description: Design trustworthy interfaces for AI suggestions, generation, retrieval, copilots, and agents. Use when shaping AI product flows, provenance, uncertainty, review, approvals, autonomy, recovery, feedback, or long-running work; do not use for ordinary deterministic UI with no AI-mediated behavior.
---

# Human-AI interface design

Design for appropriate reliance: users should know what the system can do, what it did, what evidence it used, what remains uncertain, and how to correct or stop it.

Also apply `ui-quality-baseline`. Use deterministic controls for exact state, permissions, prices, status, and irreversible commitments; a chat box is not a universal interface for AI.

## Decide the system's role

For each task, choose one mode deliberately:

- **Suggest:** offer a low-cost recommendation the user can ignore.
- **Draft:** create editable working material that remains clearly unfinished.
- **Ask:** resolve ambiguity that materially changes outcome or risk.
- **Act with review:** prepare a consequential action, show its scope and diff, then wait for approval.
- **Act within bounds:** execute reversible, low-stakes work inside explicit limits and report what changed.
- **Defer or hand off:** preserve context when the system lacks evidence, authority, or reliable capability.

Increase review, provenance, and permission friction with stakes and irreversibility. Do not infer broad autonomy from a user allowing one action.

## Design the complete lifecycle

Map the experience across:

1. **Before use:** capability, limits, data access, cost or latency, example intents, and what AI will influence.
2. **During work:** plan or current stage, sources and tools used, partial results, stop or background controls, and meaningful progress.
3. **Before commitment:** editable output, diff or preview, affected scope, alternatives, permission, and explicit approval when needed.
4. **When wrong:** reject, edit, undo, regenerate, retry, rollback, narrow the request, or reach a human without losing context.
5. **Over time:** history, provenance, model or data freshness, feedback, policy owner, evaluation, and behavior changes after upgrades.

Load [references/lifecycle-and-patterns.md](references/lifecycle-and-patterns.md) for detailed states, patterns, and evaluation cases.

## Calibrate trust

- Label generated, summarized, ranked, or transformed material where confusion with source or human authorship is plausible.
- Prefer inspectable provenance over a bare confidence score. Link the source passage, record, file, tool result, or changed field that supports the output.
- Reduce precision when evidence is weak: ranges, alternatives, partial results, and explicit review flags are better than false certainty.
- Keep the cheapest useful explanation in the primary flow and deeper methodology, assumptions, traces, and logs behind progressive disclosure.
- Never expose private chain-of-thought. Show concise plans, decisions, inputs, actions, and evidence that help the user verify work.
- Make freshness visible when source age or model/data drift can change the answer.

## Preserve control and agency

- Accepting a suggestion may be one action; dismissing or continuing manually should be equally cheap.
- Generated output stays editable. Support selected-part revision, comparison, version history, and continuation from the current draft when the task warrants it.
- Separate global controls—memory, data access, automatic actions, notification policy—from controls for one output.
- Add friction before publishing, sending, purchasing, deleting, changing permissions, or touching many records. Keep exploration and reversible drafting fluid.
- Show whose rule constrained behavior: user preference, administrator policy, safety rule, privacy limit, technical limitation, or commercial placement.
- Keep retrieved content, instructions, tools, and actions visibly and architecturally distinct.

## Make failure a designed state

- Partial success is not total success. Identify completed, failed, skipped, stale, and still-running parts.
- Match recovery to consequence: text can be edited; records need history; external messages need preview; workflows need checkpoints and rollback.
- When the system must refuse or defer, state the limit briefly and offer the nearest useful continuation.
- Human handoff carries the task summary, evidence, uncertainty, attempted actions, unresolved questions, and next step.
- Do not leave a silent spinner. Explain whether the system is searching, waiting on a tool, preparing a draft, awaiting approval, rate-limited, or stuck.
- Never fabricate progress, elapsed stages, citations, or tool activity.

## Accessibility and inclusion

Generated changes, suggestions, citations, warnings, voice interactions, and agent traces must be keyboard reachable and announced appropriately. Do not make voice, color, animation, hover, or drag the only path. Allow users to inspect generated alt text and other AI-authored accessibility content rather than silently trusting it.

Adapt explanation and control to user expertise without hiding auditability. Novices need wayfinders; experts need override and configuration; auditors need provenance and repeatability.

## Required design output

For an AI-mediated feature, specify:

- user goal, stakes, reversibility, and chosen system role;
- input and context sources with permission boundaries;
- full state model and transition diagram or table;
- provenance, uncertainty, and explanation surfaces;
- edit, reject, stop, approval, undo, rollback, and handoff paths;
- data, policy, memory, cost, and notification controls;
- accessibility behavior;
- evaluation scenarios and proof boundaries.

Do not call the experience trustworthy because it looks calm or transparent. Verify that controls work, provenance resolves, cancellation stops work, rollback restores state, permissions constrain tools, and model or data changes are regression-tested.

## Source note

This skill incorporates the user-supplied [39 Principles for Designing Human-AI Interaction](https://syntaxstream.substack.com/p/42-principles-for-designing-humanai), which synthesizes mixed-initiative and human-AI guidance. For high-stakes product decisions, also verify applicable platform policy, law, domain requirements, and primary research.
