---
name: yeknal-brainstorm
description: Generate and compare alternatives before implementation. Use for brainstorming, concept exploration, or ambiguous problem framing.
---

# Brainstorm

Explore several genuinely different options before committing to implementation.

## Invocation

```
/brainstorm [topic] [--format json|markdown|mindmap] [--depth shallow|deep|comprehensive] [--export <path>]
```

## Arguments

- `[topic]` - the subject or problem to explore.
- `--format` - output shape: `json`, `markdown`, or `mindmap`.
- `--depth` - how far to push:
  - `shallow`: quick divergent ideas.
  - `deep`: detailed analysis with pros and cons.
  - `comprehensive`: full analysis plus an implementation roadmap.
- `--export <path>` - write the result to a file.

## Method

1. Restate the problem and the constraints that actually bound it.
2. Generate options from distinct angles; avoid variations of one idea.
3. Compare them on effort, impact, risk, and reversibility. Verify facts against repository search or primary sources instead of guessing.
4. Recommend a direction and name the tradeoff it accepts.

## Examples

```bash
/brainstorm "improving user onboarding" --depth shallow
/brainstorm "microservices architecture" --depth comprehensive --export ./brainstorm-results.md
/brainstorm "performance optimization strategies" --format json --depth deep
```

## Output

- Problem analysis: current state and constraints.
- Idea categories: distinct solution concepts.
- Implementation approaches: practical next steps.
- Risk assessment: likely problems and how to mitigate them.
- Priority matrix: ranked recommendations by effort and impact.
