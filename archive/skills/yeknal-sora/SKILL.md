---
name: "yeknal-sora"
description: "Generate, edit, extend, poll, download, or delete Sora videos, build non-human character references, and run local video queues with the bundled CLI. Use for AI video requests; requires `OPENAI_API_KEY` and Sora API access."
metadata:
  internal: true
---

# Sora Video Generation Skill

Create and manage Sora video jobs for the current project: product demos, marketing spots, cinematic shots, social clips, UI mocks. Default to `sora-2` with structured prompt augmentation, and prefer the bundled CLI for deterministic runs. Note: `$sora` is a skill tag in prompts, not a shell command.

## When to use
- Generate a new video clip from a prompt
- Create a reusable character reference from a short non-human source clip
- Edit an existing generated video with a targeted prompt change
- Extend a completed video with a continuation prompt
- Poll status, list jobs, or download assets (video/thumbnail/spritesheet)
- Run a local multi-job queue now, or plan a true Batch API submission for offline rendering

## Decision tree
- A short non-human reference clip the user wants to reuse across shots -> `create-character`
- A completed video where the user wants the next beat/continuation -> `extend`
- A completed video where the user wants a targeted change while preserving the shot -> `edit`
- A video id where the user wants status or assets -> `status`, `poll`, or `download`
- Many renders needed immediately in one session -> `create-batch` (local fan-out, not the Batch API)
- Many renders needed for offline processing or a studio pipeline -> use the official Batch API flow described in `references/video-api.md`
- Anything else -> `create` (or `create-and-poll` when a ready asset is needed in one step)

## Workflow
1. Decide the intent: create vs create-character vs edit vs extend vs status/download vs local queue vs official Batch API.
2. Collect inputs: prompt, model, size, seconds, any image reference, and any character IDs.
3. Prefer CLI augmentation flags (`--use-case`, `--scene`, `--camera`, etc.) over hand-writing a long structured prompt. If you already have a structured prompt file, pass `--no-augment`.
4. Run the bundled CLI (`scripts/sora.py`) with sensible defaults. For long prompts, prefer `--prompt-file` to avoid shell-escaping issues.
5. For async jobs, poll until a terminal status (or use `create-and-poll`).
6. Download assets (video/thumbnail/spritesheet) and save them locally before the URLs expire.
7. For continuity across many shots, create character assets first, then reference them in later `create` calls.
8. To iterate on a completed shot, prefer `edit`; to continue the shot in time, prefer `extend`.
9. Make one targeted change per iteration.

## Defaults & rules
- Default model: `sora-2` (use `sora-2-pro` for higher fidelity).
- Default size: `1280x720`.
- Default seconds: `4` (allowed: `"4"`, `"8"`, `"12"`, `"16"`, `"20"`).
- Always set size and seconds through API params; prose will not change them.
- `sora-2-pro` is required for `1920x1080` and `1080x1920`.
- Use up to two characters per generation.
- Use the OpenAI Python SDK (`openai` package). If high-level SDK helpers lag the latest Sora guide, use low-level `client.post/get/delete` inside the official SDK rather than standalone HTTP code.
- Require `OPENAI_API_KEY` before any live API call. If it is missing, point the user at https://platform.openai.com/api-keys and let them set it locally; never ask them to paste the key in chat.
- If uv cache permissions fail, point `UV_CACHE_DIR` at a writable temp directory.
- Input reference images must be jpg/png/webp and should match the target size.
- JSON `input_reference` objects use either `file_id` or `image_url`; uploaded file paths use multipart.
- Download URLs expire after about 1 hour; copy assets to your own storage.
- Batch-generated videos remain downloadable for up to 24 hours after the batch completes.
- `create-batch` in `scripts/sora.py` is a local concurrent queue, not the official Batch API.
- Prefer the bundled CLI and **never modify** `scripts/sora.py` unless the user asks.
- Sora can generate audio; when a user requests voiceover/audio, state it explicitly in the `Audio:` and `Dialogue:` lines and keep it short.

## Guardrails (must enforce)
- Only content suitable for audiences under 18.
- No copyrighted characters or copyrighted music.
- No real people (including public figures).
- Input images with human faces are rejected.
- Character uploads in this skill are for non-human subjects only.

## Prompt augmentation
Reformat prompts into a structured, production-oriented spec. Make only implicit details explicit; do not invent new creative requirements.

Template (include only relevant lines):
```
Use case: <where the clip will be used>
Primary request: <user's main prompt>
Scene/background: <location, time of day, atmosphere>
Subject: <main subject>
Action: <single clear action>
Camera: <shot type, angle, motion>
Lighting/mood: <lighting + mood>
Color palette: <3-5 color anchors>
Style/format: <film/animation/format cues>
Timing/beats: <counts or beats>
Audio: <ambient cue / music / voiceover if requested>
Text (verbatim): "<exact text>"
Dialogue:
<dialogue>
- Speaker: "Short line."
</dialogue>
Constraints: <must keep/must avoid>
Avoid: <negative constraints>
```

Augmentation rules:
- Keep it short; add only details the user already implied or provided elsewhere.
- For edits, list invariants explicitly ("same shot, change only X").
- For character-based shots, mention the character name verbatim in the prompt.
- Keep one main action and one camera move per shot, and use counts or beats for timing.
- If a critical detail is missing and blocks success, ask a question; otherwise proceed.
- If you pass a structured prompt file to the CLI, add `--no-augment` so the tool does not re-wrap it.

## Examples

### Generation example (single shot)
```
Use case: product teaser
Primary request: a close-up of a matte black camera on a pedestal
Action: slow 30-degree orbit over 4 seconds
Camera: 85mm, shallow depth of field, gentle handheld drift
Lighting/mood: soft key light, subtle rim, premium studio feel
Constraints: no logos, no text
```

### Edit example (invariants)
```
Primary request: same shot and framing, switch palette to teal/sand/rust with warmer backlight
Constraints: keep the subject and camera move unchanged
```

### Character consistency example
```
Primary request: Mossy, a moss-covered teapot mascot, hurries through a lantern-lit market at dusk
Camera: cinematic tracking shot, 35mm, shoulder height
Lighting/mood: warm dusk practicals, soft haze
Constraints: keep Mossy's silhouette and moss texture consistent across the shot
```

## API limitations

- API access to Sora models requires an organization-verified account.
- Character uploads work best with short 2-4 second non-human MP4s in 16:9 or 9:16 at 720p-1080p, and extensions do not support characters or image references.
- Extensions add up to 20 seconds each, up to six times per source video, to a maximum of 120 seconds.
- The official Batch API supports `POST /v1/videos` only, with JSON bodies rather than multipart uploads.
- Video creation is async; poll before downloading. Rate limits apply by usage tier.

## References

- `references/cli.md`: create, edit, extend, create-character, poll, and download flows through `scripts/sora.py`.
- `references/video-api.md`: models, sizes, duration, characters, edits, extensions, and the official Batch API.
- `references/prompting.md`: prompt structure, character continuity, editing, and extension guidance.
- `references/sample-prompts.md`: copy/paste prompt recipes.
- `references/cinematic-shots.md` and `references/social-ads.md`: templates per artifact type.
- `references/troubleshooting.md` and `references/codex-network.md`: errors, fixes, network approval.
