---
name: "yeknal-speech"
description: "Generate text-to-speech narration, voiceover, IVR prompts, or accessibility reads with the OpenAI Audio API and built-in voices. Use for spoken-audio requests; requires `OPENAI_API_KEY`. Custom voice creation is out of scope."
metadata:
  internal: true
---

# Speech Generation Skill

Produce spoken audio for the current project: narration, product-demo voiceover, IVR prompts, accessibility reads. Default to `gpt-4o-mini-tts-2025-12-15` with built-in voices, and prefer the bundled CLI for deterministic, reproducible runs.

## When to use
- Produce one spoken clip from text
- Produce a batch of prompts: many lines, many files

## Decision tree (single vs batch)
- Many lines/prompts or many desired outputs -> **batch**
- Otherwise -> **single**

## Workflow
1. Pick the intent: single or batch (see the decision tree above).
2. Collect inputs up front: the exact text (verbatim), the voice, the delivery style, the format, and any constraints.
3. For batch work, write a temporary JSONL under tmp/ (one job per line), run it once, then delete the JSONL.
4. Augment the instructions into a short labeled spec without rewriting the input text.
5. Run the bundled CLI (`scripts/text_to_speech.py`) with sensible defaults (see references/cli.md).
6. For important clips, validate intelligibility, pacing, pronunciation, and adherence to constraints.
7. Iterate with a single targeted change (voice, speed, or instructions), then re-check.
8. Return the final outputs and note the final text, instructions, and flags used.

## Temp and output conventions
- Keep intermediate files in `tmp/speech/` (for example JSONL batches); delete them when done.
- Write final artifacts under `output/speech/` when working in this repo.
- Control output paths with `--out` or `--out-dir`; keep filenames stable and descriptive.

## Environment

Live API calls require `OPENAI_API_KEY` and the `openai` package (`uv pip install openai`, or `pip install openai`). If the key is missing, point the user at https://platform.openai.com/api-keys and let them set it locally; never ask them to paste it in chat. If installation is not possible here, tell the user which dependency is missing and how to install it locally.

## Defaults & rules
- Use `gpt-4o-mini-tts-2025-12-15` unless the user asks for another model.
- Default voice: `cedar`. For a brighter tone, prefer `marin`.
- Built-in voices only; custom voices are out of scope for this skill.
- `instructions` work with GPT-4o mini TTS models, but not with `tts-1` or `tts-1-hd`.
- Cap each request at 4096 characters; split longer text into chunks.
- Enforce 50 requests/minute; the CLI caps `--rpm` at 50.
- Require `OPENAI_API_KEY` before any live API call.
- Disclose clearly to end users that the voice is AI-generated.
- Make every API call through the OpenAI Python SDK (`openai` package); do not use raw HTTP.
- Prefer the bundled CLI (`scripts/text_to_speech.py`) over new one-off scripts.
- Never modify `scripts/text_to_speech.py`. If something is missing, ask the user before anything else.

## Instruction augmentation
Reformat the user's direction into a short, labeled spec. Make only implicit details explicit; do not invent requirements.

Quick clarification (augmentation vs invention):
- If the user says "narration for a demo", you may add implied delivery constraints (clear, steady pacing, friendly tone).
- Do not introduce a persona, accent, or emotional style the user did not ask for.

Template (include only relevant lines):
```
Voice Affect: <overall character and texture of the voice>
Tone: <attitude, formality, warmth>
Pacing: <slow, steady, brisk>
Emotion: <key emotions to convey>
Pronunciation: <words to enunciate or emphasize>
Pauses: <where to add intentional pauses>
Emphasis: <key words or phrases to stress>
Delivery: <cadence or rhythm notes>
```

Augmentation rules:
- Keep it short; add only details the user already implied or supplied.
- Do not rewrite the input text.
- If a critical detail is missing and blocks success, ask; otherwise proceed.

## Examples

### Single example (narration)
```
Input text: "Welcome to the demo. Today we'll show how it works."
Instructions:
Voice Affect: Warm and composed.
Tone: Friendly and confident.
Pacing: Steady and moderate.
Emphasis: Stress "demo" and "show".
```

### Batch example (IVR prompts)
```
{"input":"Thank you for calling. Please hold.","voice":"cedar","response_format":"mp3","out":"hold.mp3"}
{"input":"For sales, press 1. For support, press 2.","voice":"marin","instructions":"Tone: Clear and neutral. Pacing: Slow.","response_format":"wav"}
```

## Instructioning best practices (short list)
- Order directions as affect, tone, pacing, emotion, pronunciation/pauses, then emphasis.
- Keep 4 to 8 short lines; avoid conflicting guidance.
- For names and acronyms, add pronunciation hints (for example "enunciate A-I") or a phonetic spelling in the text.
- For edits and iterations, repeat invariants (for example "keep pacing steady") to reduce drift.
- Iterate with single-change follow-ups.

More principles: `references/prompting.md`. Copy/paste specs: `references/sample-prompts.md`.

## References

- `references/cli.md`: commands, flags, and batch recipes for `scripts/text_to_speech.py`.
- `references/audio-api.md`: API parameters, limits, and the voice list.
- `references/voice-directions.md` and `references/prompting.md`: instruction patterns and best practices.
- `references/sample-prompts.md`: copy/paste instruction recipes.
- `references/narration.md`, `references/voiceover.md`, `references/ivr.md`, `references/accessibility.md`: templates and defaults per delivery style.
- `references/codex-network.md`: environment, sandbox, and network-approval troubleshooting.
