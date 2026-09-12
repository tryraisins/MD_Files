---
name: brainstorm
description: Generate and compare alternatives before implementation. Use for brainstorming, concept exploration, or ambiguous problem framing.
---

# Brainstorm

## Usage
```
/brainstorm [topic] [--format json|markdown|mindmap] [--depth shallow|deep|comprehensive] [--export <path>]
```

## Auto-Persona Activation
- **Mentor**: Educational guidance and knowledge transfer
- **Architect**: Systems thinking and scalable solutions
- **Analyzer**: Evidence-based investigation and pattern recognition

## Tool integration

- Use repository search and current primary sources when facts or constraints need verification.
- Use structured comparison only when it materially clarifies tradeoffs; do not invent unavailable tools or agents.

## Arguments
- `[topic]` - Subject or problem to brainstorm about
- `--format` - Output format (json, markdown, mindmap)
- `--depth` - Analysis depth level
  - `shallow`: Quick ideas and initial concepts
  - `deep`: Detailed analysis with pros/cons
  - `comprehensive`: Full analysis with implementation roadmap
- `--export <path>` - Save results to specified file

## Examples
```bash
# Quick brainstorm on user experience
/brainstorm "improving user onboarding" --depth shallow

# Comprehensive analysis with export
/brainstorm "microservices architecture" --depth comprehensive --export ./brainstorm-results.md

# Technical solution exploration
/brainstorm "performance optimization strategies" --format json --depth deep
```

## Output Structure
- **Problem Analysis**: Current situation and challenges
- **Idea Categories**: Organized solution concepts
- **Implementation Approaches**: Practical next steps
- **Risk Assessment**: Potential challenges and mitigation
- **Priority Matrix**: Ranked recommendations with effort/impact analysis
