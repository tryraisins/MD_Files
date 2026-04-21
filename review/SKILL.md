---
name: review
description: Comprehensive code and system review with actionable insights and quality metrics.
---

# Review — Comprehensive Code Review

## Purpose

Perform a thorough review of code, systems, or components with actionable findings organized by severity and effort.

## Usage

```bash
/review [target] [--focus security|performance|quality|architecture] [--format report|checklist|metrics] [--export <path>]
```

## Auto-Persona Activation

- **QA**: Quality assurance and testing standards
- **Security**: Vulnerability assessment and compliance
- **Performance**: Optimization and bottleneck analysis
- **Analyzer**: Root cause analysis and systematic investigation

## MCP Integration

- **Sequential**: Systematic analysis and structured review
- **Context7**: Best practices and quality standards
- **Playwright**: E2E validation and user workflow testing

## Wave-Enabled

Multi-agent parallel analysis for comprehensive system review.

## Arguments

- `[target]` - Files, directories, or components to review
- `--focus` - Specific review focus area
  - `security`: Security vulnerabilities and compliance
  - `performance`: Performance bottlenecks and optimization
  - `quality`: Code quality and maintainability
  - `architecture`: System design and structure
- `--format` - Output format
  - `report`: Detailed analysis report
  - `checklist`: Actionable checklist format
  - `metrics`: Quantified quality metrics
- `--export <path>` - Save review results to file

## Review Categories

### Security Review

- Vulnerability scanning and threat analysis
- Authentication and authorization validation
- Data protection and privacy compliance
- Secure coding practices assessment

**Adversarial mode** — activate when user requests red-team, pentest, or adversarial audit:

- Simulate attacker profiles: anonymous, authenticated, insider, API consumer, supply chain
- Probe chained exploits, race conditions, business logic abuse, cache poisoning, timing attacks, replay attacks, JWT confusion, mass assignment
- For every finding: provide exploitation scenario (step-by-step), severity with justification, and recommended fix
- Include attack chains showing how lower-severity issues combine into critical paths
- Output format: Vulnerability Summary → Detailed Findings → Attack Chains → Secure Design Recommendations

### Performance Review

- Code efficiency and optimization opportunities
- Resource usage analysis and bottleneck identification
- Scalability assessment and load handling
- Database query optimization

### Quality Review

- Code complexity and maintainability metrics
- Technical debt identification and prioritization
- Testing coverage and quality assessment
- Documentation completeness and accuracy

### Architecture Review

- System design patterns and best practices
- Component coupling and cohesion analysis
- Scalability and extensibility evaluation
- Integration patterns and API design

## Examples

```bash
# Security-focused review
/review src/auth/ --focus security --format report

# Performance analysis with metrics
/review --focus performance --format metrics --export ./performance-review.json

# Comprehensive quality review
/review src/ --focus quality --format checklist

# Full system architecture review
/review --focus architecture --format report --export ./architecture-analysis.md
```

## Output Includes

- **Executive Summary**: Key findings and recommendations
- **Detailed Analysis**: Issue-by-issue breakdown with context
- **Priority Matrix**: Issues ranked by severity and effort
- **Actionable Recommendations**: Specific steps for improvement
- **Quality Metrics**: Quantified assessment scores
- **Follow-up Plan**: Suggested review schedule and checkpoints
