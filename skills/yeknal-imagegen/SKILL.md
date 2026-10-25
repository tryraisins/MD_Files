---
name: "yeknal-imagegen"
description: Generate, edit, or batch-produce images with the OpenAI Image API through the bundled `scripts/image_gen.py` CLI. Use when the user asks to generate an image, inpaint or mask an edit, replace a background, or make variants.
metadata:
  internal: true
---


# Image Generation Skill

Create or edit images for the current project (for example website assets, game assets, UI mockups, product mockups, wireframes, logo design, photorealistic images, infographics). Prefer the bundled CLI for deterministic, reproducible runs.

## When to use
- Generate a new image (concept art, product shot, cover, website hero)
- Edit an existing image (inpainting, masked edits, lighting or weather transformations, background replacement, object removal, compositing, transparent background)
- Batch runs (many prompts, or many variants across prompts)

## Decision tree (generate vs edit vs batch)
- If the user supplies an input image (or says “edit/retouch/inpaint/mask/translate/localize/change only X”) → **edit**
- Else if the user needs many different prompts/assets → **generate-batch**
- Else → **generate**

## Workflow
1. Decide the intent: generate vs edit vs batch (see the decision tree above).
2. Collect the inputs first: prompt(s), exact text (verbatim), constraints/avoid list, and any input image(s)/mask(s). For multi-image edits, label each input by index and role; for edits, list the invariants explicitly.
3. If batch: write a temporary JSONL under tmp/ (one job per line), run once, then delete the JSONL.
4. Augment the prompt into a short labeled spec (structure + constraints) without inventing new creative requirements.
5. Run the bundled CLI (`scripts/image_gen.py`) with sensible defaults (see references/cli.md).
6. For complex edits or generations, inspect the outputs (open/view images) and validate subject, style, composition, text accuracy, and invariants/avoid items.
7. Iterate: make one targeted change (prompt or mask), re-run, re-check.
8. Save and return the final outputs, noting the final prompt and flags used.

## Temp and output conventions
- Use `tmp/imagegen/` for intermediate files (for example JSONL batches); delete them when done.
- Write final artifacts under `output/imagegen/` when working in this repo.
- Use `--out` or `--out-dir` to control output paths; keep filenames stable and descriptive.

## Setup

Install the `openai` and `pillow` packages: `uv pip install openai pillow` (`python -m pip install openai pillow` if `uv` is unavailable). `OPENAI_API_KEY` must be set for live calls, so send the user to https://platform.openai.com/api-keys and have them set it locally. Never ask the user to paste the key in chat. If installation is impossible here, name the missing dependency and how to install it locally.

## Defaults & rules
- Use `gpt-image-1.5` unless the user explicitly asks for `gpt-image-1-mini` or explicitly prefers a cheaper/faster model.
- Assume the user wants a new image unless they explicitly ask for an edit.
- Require `OPENAI_API_KEY` before any live API call.
- Use the OpenAI Python SDK (`openai` package) for all API calls; do not use raw HTTP.
- If the user requests edits, use `client.images.edit(...)` and include input images (and a mask if provided).
- Prefer the bundled CLI (`scripts/image_gen.py`) over writing new one-off scripts.
- Never modify `scripts/image_gen.py`. If something is missing, ask the user before doing anything else.
- If the result isn’t clearly relevant or doesn’t satisfy the constraints, iterate with small targeted prompt changes; only ask a question when a missing detail blocks success.

## Prompt augmentation
Reformat user prompts into a structured, production-oriented spec. Make implicit details explicit only; do not invent new requirements.

## Use-case taxonomy (exact slugs)
Classify each request into one generate or edit slug from the taxonomy in `references/prompting.md`, and keep that slug consistent across the prompt, the constraints, and the reference lookup.

Quick clarification (augmentation vs invention):
- If the user says “a hero image for a landing page”, you may add *layout/composition constraints* implied by that use (for example, “generous negative space on the right for headline text”).
- Do not introduce new creative elements the user didn’t ask for (for example, a mascot, a changed subject, or invented brand names/logos).

Template (include only relevant lines):
```
Use case: <taxonomy slug>
Asset type: <where the asset will be used>
Primary request: <user's main prompt>
Scene/background: <environment>
Subject: <main subject>
Style/medium: <photo/illustration/3D/etc>
Composition/framing: <wide/close/top-down; placement>
Lighting/mood: <lighting + mood>
Color palette: <palette notes>
Materials/textures: <surface details>
Quality: <low/medium/high/auto>
Input fidelity (edits): <low/high>
Text (verbatim): "<exact text>"
Constraints: <must keep/must avoid>
Avoid: <negative constraints>
```

Augmentation rules:
- Keep it short; add only details the user already implied or provided elsewhere.
- Always classify the request into one taxonomy slug and tailor constraints, composition, and quality to that bucket. Use the slug to find the matching example in `references/sample-prompts.md`.
- If the user gives a broad request (for example, "Generate images for this website"), use judgment to propose tasteful, context-appropriate assets and map each to a taxonomy slug.
- For edits, list the invariants explicitly ("change only X; keep Y unchanged").
- If a critical detail is missing and blocks success, ask a question; otherwise proceed.

## Examples

### Generation example (hero image)
```
Use case: stylized-concept
Asset type: landing page hero
Primary request: a minimal hero image of a ceramic coffee mug
Style/medium: clean product photography
Composition/framing: centered product, generous negative space on the right
Lighting/mood: soft studio lighting
Constraints: no logos, no text, no watermark
```

### Edit example (invariants)
```
Use case: precise-object-edit
Asset type: product photo background replacement
Primary request: replace the background with a warm sunset gradient
Constraints: change only the background; keep the product and its edges unchanged; no text; no watermark
```

## Prompting best practices (short list)
- Structure the prompt as scene -> subject -> details -> constraints.
- Include the intended use (ad, UI mock, infographic) to set the mode and polish level.
- Use camera/composition language for photorealism.
- Quote exact text and specify typography plus placement.
- For tricky words, spell them letter-by-letter and require verbatim rendering.
- For multi-image inputs, reference images by index and describe how to combine them.
- For edits, repeat invariants every iteration to reduce drift.
- Iterate with single-change follow-ups.
- For latency-sensitive runs, start with quality=low; use quality=high for text-heavy or detail-critical outputs.
- For strict edits (identity/layout lock), consider input_fidelity=high.
- If results feel “tacky”, add a brief “Avoid:” line (stock-photo vibe; cheesy lens flare; oversaturated neon; harsh bloom; oversharpening; clutter) and specify restraint (“editorial”, “premium”, “subtle”).

More principles: `references/prompting.md`. Copy/paste specs: `references/sample-prompts.md`.

## Guidance by asset type
Asset-type templates (website assets, game assets, wireframes, logo) are consolidated in `references/sample-prompts.md`.

## CLI + environment notes
- CLI commands + examples: `references/cli.md`
- API parameter quick reference: `references/image-api.md`

## Reference map
- **`references/cli.md`**: how to *run* image generation/edits/batches via `scripts/image_gen.py` (commands, flags, recipes).
- **`references/image-api.md`**: what knobs exist at the API level (parameters, sizes, quality, background, edit-only fields).
- **`references/prompting.md`**: prompting principles (structure, constraints/invariants, iteration patterns).
- **`references/sample-prompts.md`**: copy/paste prompt recipes (generate + edit workflows; examples only).
