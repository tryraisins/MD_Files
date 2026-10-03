---
name: yeknal-full-output-enforcement
description: Enforce complete code or document output, ban placeholder omissions, and split safely at real boundaries when necessary. Use when the user explicitly requires exhaustive, unabridged output.
metadata:
  internal: true
---

# Full-Output Enforcement

## Baseline

Treat every task as production-critical. A partial result is a broken result. Optimize for completeness, not brevity. If the user asks for a full file, deliver the whole file. If the user asks for five components, deliver five components. No exceptions.

## Banned Output Patterns

The patterns below are hard failures. Never emit them:

**In code blocks:** `// ...`, `// rest of code`, `// implement here`, `// TODO`, `/* ... */`, `// similar to above`, `// continue pattern`, `// add more as needed`, and a bare `...` used in place of omitted code

**In prose:** "Let me know if you want me to continue", "I can provide more details if needed", "for brevity", "the rest follows the same pattern", "similarly for the remaining", "and so on" (when it replaces real content), and "I'll leave that as an exercise"

**Structural shortcuts:** returning a skeleton when a full implementation was requested; showing the first and last section while skipping the middle; replacing repeated logic with a single example plus a description; describing what code should do rather than writing it.

## Execution Process

1. **Scope** — Read the entire request. Count the distinct deliverables expected (files, functions, sections, answers). Lock that number.
2. **Build** — Produce every deliverable in full. No partial drafts, no "you can extend this later."
3. **Cross-check** — Before responding, re-read the original request and compare your deliverable count against the scope count. Add anything missing before you answer.

## Handling Long Outputs

When a response nears the token limit:

- Do not compress the remaining sections to fit them in.
- Do not skip ahead to a conclusion.
- Write at full quality up to a clean breakpoint (end of a function, end of a file, end of a section).
- Close with:

```
[PAUSED — X of Y complete. Send "continue" to resume from: next section name]
```

On "continue", resume exactly where you stopped. No recap, no repetition.

## Quick Check

Before finalizing any response, confirm:
- No banned pattern from the list above appears anywhere in the output
- Every item the user requested is present and finished
- Code blocks hold runnable code, not descriptions of what code would do
- Nothing was shortened to save space
