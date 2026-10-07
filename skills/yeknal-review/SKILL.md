---
name: yeknal-review
description: Review code or systems for concrete defects, regressions, and maintainability risks when the user requests an audit or quality assessment.
---

# Review — Comprehensive Code Review

## Purpose

Perform a thorough review of code, systems, or components, returning actionable findings organized by severity and effort.

## Usage

```bash
/review [target] [--focus security|performance|quality|architecture] [--format report|checklist|metrics] [--export <path>]
```

## Auto-Persona Activation

- **QA**: Quality assurance and testing standards
- **Security**: Vulnerability assessment and compliance
- **Performance**: Optimization and bottleneck analysis
- **Analyzer**: Root cause analysis and systematic investigation

## Tool integration

- Inspect source, diffs, tests, configuration, and history directly.
- Use browser testing when rendered behavior is in scope and the required tooling is available.
- Consult current primary documentation only where the repository cannot establish expected behavior.
- Do not invent unavailable tools or agents.

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

### Review the change on two independent axes

For a branch, pull request, or working-tree change, establish the comparison point and inspect the complete relevant diff before judging it. Verify the requested base or target resolves; for branch comparisons, use the merge base so unrelated target-branch changes are not attributed to the reviewed work. Include the commit range and originating requirement when available.

Report these axes separately so a strong result on one cannot conceal a failure on the other:

- **Standards**: does the change follow repository instructions, documented coding standards, established architecture, and relevant language or platform conventions? Name the rule and its source. Use smells as evidence-led heuristics, not automatic violations, and let explicit repository conventions take precedence.
- **Spec**: does the change implement the requested behavior and acceptance criteria? Trace each important requirement to the changed behavior. Call out missing, partial, incorrect, or unrequested behavior with the relevant requirement as evidence.

Find the specification in the user's supplied brief, referenced issue, or relevant repository spec. If none is available, say the spec axis could not be verified; do not invent requirements. For a review of a single file or system rather than a diff, apply the same distinction to the requested contract and the repository's standards.

Keep findings ordered by severity within each axis. Each finding needs a precise file and line, observable impact, evidence, and the smallest appropriate correction. Do not merge or average the two axis results into a single score. If an axis has no supported findings, say so. Existing categories below remain available as focused lenses and do not replace either axis.

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

### Refactoring and dead-code review

When the request is to refactor, simplify, or clean up code, inspect dependency direction, duplication, dead imports/functions/branches, naming, cohesion, and test coverage before proposing edits. Separate safe mechanical cleanup from behavior-changing redesign. Give each finding a file/line, impact, confidence, and smallest safe fix. Do not remove code merely because it looks unused without checking exports, dynamic imports, configuration, tests, and runtime entry points.

### Language simplification review

For TypeScript, Python, and Go, look for defensive over-engineering that obscures a known contract: generic values propagated beyond a boundary, fake validation that ends in a cast, silent empty fallbacks, catch-all or swallowed errors, repeated parsing, needless coercion, one-use extraction helpers, pass-through layers, and abstractions without a real substitution or policy boundary.

Do not flag real boundary validation, domain-specific normalization, idiomatic language error handling, framework-mandated interfaces, cancellation, retries, or deliberate public compatibility. A finding must name the actual contract, the observable risk or maintenance cost, and the smallest behavior-preserving simplification. Never recommend deleting a guard merely because it is defensive.

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
