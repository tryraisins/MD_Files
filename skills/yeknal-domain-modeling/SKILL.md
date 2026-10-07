---
name: yeknal-domain-modeling
description: Clarify a software project's domain concepts and record resolved terminology or durable architecture decisions. Use when terms, relationships, or system boundaries are ambiguous, or when asked to create or update a GLOSSARY.md or architecture decision record (ADR).
---

# Domain Modeling

Help the project and its people use the same language for the same concepts. Record resolved domain meaning in a glossary and durable architectural choices in ADRs, while keeping both grounded in the product and code. Do not turn ordinary implementation work into a documentation exercise.

## Inspect the current model

1. Read the relevant `AGENTS.md`, `HANDOFF.md`, specifications, and existing `GLOSSARY.md` or ADRs before proposing new terms or decisions.
2. Trace the relevant terms and relationships through user-facing language, domain code, types, data, and workflows. Separate product concepts from implementation names.
3. Preserve established terminology unless there is evidence it is ambiguous, contradictory, or misleading. Do not infer a product rule from a class name alone.

## Clarify concepts with concrete examples

When terminology or relationships are unclear, identify the specific ambiguity and why it affects behavior or communication. Use realistic scenarios, edge cases, and counterexamples to distinguish the competing meanings. Ask only the questions needed to resolve a material ambiguity; label unresolved terms rather than choosing silently.

For each resolved concept, capture the canonical term, concise definition, relevant aliases or distinctions, and the examples needed to disambiguate it. Keep glossary entries about domain meaning, not file paths, implementation steps, or a restatement of the whole specification.

## Maintain the glossary lazily

- Update an existing glossary in its established location and format.
- If no glossary exists, create one only when a useful term has actually been resolved and the user has asked for the documentation or the work's accepted outcome includes it.
- Keep terms concise, consistent, and free of duplicate definitions. Link related concepts where that improves navigation.
- Do not create a glossary containing only speculative terms. Keep open questions separate until they are resolved.

## Record architectural decisions sparingly

Create or update an ADR only when all three are true:

1. The decision has meaningful cost or risk to reverse.
2. A future maintainer would reasonably find the choice surprising without context.
3. There were credible alternatives and a real tradeoff shaped the choice.

Use the repository's existing ADR location and format. If none exists, create the smallest compatible structure when an ADR is warranted. Record context, the decision, alternatives considered, consequences, and any conditions that would justify revisiting it. Do not use ADRs as implementation logs, task plans, or a record of routine preferences.

## Verify and report

Check that new definitions match the relevant product behavior and source where possible. If documentation and code disagree, report the discrepancy and ask which is authoritative before rewriting either. Preserve existing decisions unless the user asks to revisit them.

Summarize the terms or decisions changed, their locations, unresolved questions, and any evidence that remains unverified. Use `yeknal-markdown-management` for broader Markdown merges or audits. For a related domain-modeling reference, see [Matt Pocock's domain-modeling skill](https://github.com/mattpocock/skills/blob/f3fc5632f401156837ee3872f14fe33ccf1024ea/skills/engineering/domain-modeling/SKILL.md); this skill adapts the ideas to Yeknal's repository-neutral workflow without copying its text.
