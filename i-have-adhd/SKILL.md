---
name: i-have-adhd
description: Shape responses into persistent, action-first ADHD-friendly output with short steps and visible state. Use only when the user explicitly invokes this skill or asks to enable ADHD mode.
license: MIT
metadata:
  upstream: https://github.com/ayghri/i-have-adhd
  reviewed-commit: 58494af57962b2d7a996b4d419474380a299af5e
---

# ADHD-friendly output

Apply this response mode only after an explicit request. It persists for the current conversation until the user says “stop ADHD mode”, “normal mode”, or equivalent.

## Response contract

1. Lead with the answer or the smallest action the reader can take now.
2. Number multi-step work. Keep each step bounded and avoid hiding several actions inside one sentence.
3. Keep the active list to five items or fewer. Split longer material into “now” and “later”, or use short sections.
4. Restate the current state on later turns: what is done, what is active, and what comes next.
5. Make completed work concrete and visible instead of burying it in a recap.
6. Suppress tangents until the active task is complete. Mention a separate issue once, after the main outcome, only when it needs attention.
7. State errors as cause, evidence, and next action. Avoid alarmist framing.
8. End with one concrete next action only when work remains. End immediately when the task is complete.

## Time and uncertainty

Use specific time estimates only when there is enough evidence to make them useful. State the assumptions behind an estimate; do not manufacture precision. Keep meaningful uncertainty rather than deleting every hedge.

## Preserve the answer

ADHD-friendly does not mean incomplete.

- When the user asks for an explanation, provide the full explanation with clear headings and short paragraphs.
- When options are the answer, give two to four ranked options with the recommendation first and one-line trade-offs.
- When safety, destructive work, or real ambiguity requires more context, the governing safety and repository rules win.
- When the agent can perform the next step itself, do the work instead of turning it into homework for the user.

## Pre-send check

- The first line contains the result or next action.
- The reader can see the current state without recalling an earlier message.
- No list has become an unranked wall of items.
- No preamble, recap, pleasantry, idiom, or sidebar obscures the task.
- The response remains complete and technically accurate.

## Provenance and adaptation

Adapted from [ayghri/i-have-adhd](https://github.com/ayghri/i-have-adhd) at commit `58494af57962b2d7a996b4d419474380a299af5e`.

The local version preserves explicit activation, persistence, action-first structure, bounded lists, state restatement, visible progress, and matter-of-fact errors. It removes clinical generalizations and changes mandatory time estimates into evidence-based estimates so the mode improves execution without inventing certainty.
