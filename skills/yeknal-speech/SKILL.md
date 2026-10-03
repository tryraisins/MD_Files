---
name: "yeknal-speech"
description: "Use when the user asks for text-to-speech narration or voiceover, accessibility reads, audio prompts, or batch speech generation via the OpenAI Audio API; run the bundled CLI (`scripts/text_to_speech.py`) with built-in voices and require `OPENAI_API_KEY` for live calls. Custom voice creation is out of scope."
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

## Dependencies (install if missing)
Prefer `uv` for dependency management.

Python packages:
```
uv pip install openai
```
If `uv` is unavailable:
```
python3 -m pip install openai
```

## Environment
- Live API calls require `OPENAI_API_KEY`.

If the key is missing, give the user these steps:
1. Create an API key in the OpenAI platform UI: https://platform.openai.com/api-keys
2. Set `OPENAI_API_KEY` as an environment variable in their system.
3. Offer to guide them through setting the environment variable for their OS/shell if needed.
- Never ask the user to paste the full key in chat. Ask them to set it locally and confirm when ready.

If installation is not possible here, tell the user which dependency is missing and how to install it locally.

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

## Guidance by use case
Use these modules when the request is for a specific delivery style; they provide targeted defaults and templates.
- Narration / explainer: `references/narration.md`
- Product demo / voiceover: `references/voiceover.md`
- IVR / phone prompts: `references/ivr.md`
- Accessibility reads: `references/accessibility.md`

## CLI + environment notes
- CLI commands + examples: `references/cli.md`
- API parameter quick reference: `references/audio-api.md`
- Instruction patterns + examples: `references/voice-directions.md`
- If network approvals or sandbox settings get in the way: `references/codex-network.md`

## Reference map
- **`references/cli.md`**: how to run speech generation and batches through `scripts/text_to_speech.py` (commands, flags, recipes).
- **`references/audio-api.md`**: API parameters, limits, and the voice list.
- **`references/voice-directions.md`**: instruction patterns and examples.
- **`references/prompting.md`**: instruction best practices (structure, constraints, iteration).
- **`references/sample-prompts.md`**: copy/paste instruction recipes (examples only; no extra theory).
- **`references/narration.md`**: templates and defaults for narration and explainers.
- **`references/voiceover.md`**: templates and defaults for product-demo voiceover.
- **`references/ivr.md`**: templates and defaults for IVR and phone prompts.
- **`references/accessibility.md`**: templates and defaults for accessibility reads.
- **`references/codex-network.md`**: environment, sandbox, and network-approval troubleshooting.
