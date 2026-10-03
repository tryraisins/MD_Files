---
name: "yeknal-transcribe"
description: "Transcribe audio files to text with optional diarization and known-speaker hints. Use when a user asks to transcribe speech from audio/video, extract text from recordings, or label speakers in interviews or meetings."
metadata:
  internal: true
---

# Audio Transcribe

Turn audio into text with OpenAI, adding speaker diarization only when asked. For deterministic, repeatable runs, use the bundled CLI.

## Workflow
1. Gather inputs: the audio path(s), the response format you want (text/json/diarized_json), an optional language hint, and any known speaker references.
2. Confirm `OPENAI_API_KEY` is set. If it is missing, ask the user to export it locally; never ask them to paste the key.
3. Run the bundled `transcribe_diarize.py` CLI with sensible defaults for fast text transcription.
4. Check the result for transcription quality, speaker labels, and segment boundaries, then make one targeted change at a time if needed.
5. When working in this repo, write results under `output/transcribe/`.

## Decision rules
- Start with `gpt-4o-mini-transcribe` and `--response-format text` for fast transcription.
- When the user wants speaker labels or diarization, run `--model gpt-4o-transcribe-diarize --response-format diarized_json`.
- For audio longer than about 30 seconds, keep `--chunking-strategy auto`.
- Prompting is unsupported for `gpt-4o-transcribe-diarize`.

## Output conventions
- Put evaluation runs in `output/transcribe/<job-id>/`.
- When handling several files, use `--out-dir` so outputs do not overwrite each other.

## Dependencies (install if missing)
Prefer `uv` for dependency management.

```
uv pip install openai
```
If `uv` is unavailable:
```
python3 -m pip install openai
```

## Environment
- Live API calls require `OPENAI_API_KEY`.
- If the key is missing, tell the user to create one in the OpenAI platform UI and export it in their shell.
- Never ask the user to paste the full key in chat.

## Skill path (set once)

```bash
export CODEX_HOME="${CODEX_HOME:-$HOME/.codex}"
export TRANSCRIBE_CLI="$CODEX_HOME/skills/transcribe/scripts/transcribe_diarize.py"
```

User-scoped skills install under `$CODEX_HOME/skills` (default: `~/.codex/skills`).

## CLI quick start
Single file (fast text default):
```
python3 "$TRANSCRIBE_CLI" \
  path/to/audio.wav \
  --out transcript.txt
```

Diarization with known speakers (up to 4):
```
python3 "$TRANSCRIBE_CLI" \
  meeting.m4a \
  --model gpt-4o-transcribe-diarize \
  --known-speaker "Alice=refs/alice.wav" \
  --known-speaker "Bob=refs/bob.wav" \
  --response-format diarized_json \
  --out-dir output/transcribe/meeting
```

Plain text output (explicit):
```
python3 "$TRANSCRIBE_CLI" \
  interview.mp3 \
  --response-format text \
  --out interview.txt
```

## Reference map
- `references/api.md`: supported formats, limits, response formats, and known-speaker notes.
