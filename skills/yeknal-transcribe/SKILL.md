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
5. When working in this repo, write results under `output/transcribe/`; use `--out-dir` when handling several files so outputs do not overwrite each other.

Live API calls require `OPENAI_API_KEY` and the `openai` package (`uv pip install openai`, or `pip install openai`). If the key is missing, tell the user to create one at https://platform.openai.com/api-keys and export it in their shell; never ask them to paste the full key in chat.

## Decision rules
- Start with `gpt-4o-mini-transcribe` and `--response-format text` for fast transcription.
- When the user wants speaker labels or diarization, run `--model gpt-4o-transcribe-diarize --response-format diarized_json`.
- For audio longer than about 30 seconds, keep `--chunking-strategy auto`.
- Prompting is unsupported for `gpt-4o-transcribe-diarize`.

## Reference map
- `references/api.md`: supported formats, limits, response formats, and known-speaker notes.

## CLI

Use `<path-to-skill>/scripts/transcribe_diarize.py` (`python` on Windows, `python3` on macOS or Linux).

```bash
# Fast text transcription
python <path-to-skill>/scripts/transcribe_diarize.py path/to/audio.wav --out transcript.txt

# Diarization with up to four known speakers
python <path-to-skill>/scripts/transcribe_diarize.py meeting.m4a --model gpt-4o-transcribe-diarize --known-speaker "Alice=refs/alice.wav" --known-speaker "Bob=refs/bob.wav" --response-format diarized_json --out-dir output/transcribe/meeting
```
