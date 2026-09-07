---
name: oil-motion
description: Design, implement, optimize, and explain continuous interactive web animation built from generated or captured frames and controlled by scroll, pointer, drag, touch, device orientation, audio, data, or component state. Use when ordinary CSS or component motion cannot express a product transformation, character response, scene transition, or scrub-able media timeline.
license: MIT. See LICENSE.txt
compatibility: Media generation is optional. Deterministic processing may require Python 3, Pillow, ffmpeg, and ffprobe; browser implementations may require Canvas or WebGL.
metadata:
  source: https://github.com/oil-oil/oil-motion
  source-commit: eafd4a45dc9c996489df3c54ac4ebdcde2bd030b
  adapted: "2026-09-07"
---

# Oil Motion

Build motion as a verified media timeline controlled by a continuous parameter. Lock the visual states first, create or capture the transition, process it deterministically, then connect the prepared asset to the browser interaction.

This skill owns frame-based narrative or responsive media. Use `animate` for ordinary UI transitions, layout animation, springs, and component presence. Use `review-animations` for critique and `ui-quality-baseline` for the surrounding interface contract.

## Gate the technique

Choose this pipeline only when the visual change cannot be represented cleanly with CSS, SVG, DOM transforms, or a normal motion library. Strong fits include:

- a product assembling, disassembling, rotating, weathering, or changing material;
- a character or object responding continuously to pointer or device orientation;
- a cinematic zoom, wipe, chapter transition, or camera move scrubbed by scroll;
- generated imagery whose intermediate visual structure matters;
- a prepared timeline driven by live data or component state.

Do not use generated video to imitate a simple fade, drawer, number tween, accordion, or navigation transition. It adds weight, latency, and art-direction risk without improving meaning.

## Concept contract

Before generation or implementation, record:

1. `Purpose`: what the motion explains or makes possible.
2. `Subject invariants`: identity, geometry, proportions, logo, lighting, and details that must not drift.
3. `Key states`: start, important middle states, and end.
4. `Input`: scroll, pointer, drag, touch, orientation, audio, data, or discrete component state.
5. `Parameter space`: one-dimensional timeline or multi-dimensional pose field.
6. `Playback`: continuous scrubbing, event-triggered segments, or autonomous playback.
7. `Background ownership`: baked into the media or rendered separately.
8. `Display budget`: real desktop and mobile display sizes, target weight, memory ceiling, and fallback.
9. `Accessibility`: reduced-motion substitute, readable status, and non-motion access to the same information.

Input and playback are separate decisions. Scroll can drive continuous seeking or merely trigger a segment. Pointer X/Y may require a two-dimensional pose grid; a single left-right loop cannot represent a real two-axis response.

## Pipeline

### 1. Lock key frames

Create or select the few states that must remain accurate. Review each at its actual crop and display size. Do not generate the full transition until subject identity, structure, composition, and end-state correctness are stable.

If the user supplied assets, preserve their provenance and do not silently redraw protected logos, people, or product geometry. If generation requires a provider or key that is not already configured, explain the dependency and let the user configure it through the provider's secure mechanism. Never request a secret in chat or store it in the project.

### 2. Run a pilot

Generate or capture one short representative transition before batch work. Inspect it frame by frame for:

- subject or logo drift;
- duplicated parts, extra limbs, topology changes, or impossible occlusion;
- flash frames, hard cuts, pauses, or near-duplicates;
- inconsistent background, crop, lighting, or camera direction;
- a start or end that does not match the approved key state.

Record the approved inputs and a content hash or equivalent immutable identifier. A pilot is approval evidence only for the exact settings and assets it used.

### 3. Process deterministically

Decode frames, trim dead time, remove unintended duplicates, normalize dimensions and color handling, and encode for the actual device budget. Preserve raw inputs separately from generated derivatives.

Choose the primary format from the content and access pattern:

| Scenario | Primary asset | Reason |
| --- | --- | --- |
| Scene narrative, camera move, baked lighting or ground contact | All-keyframe MP4 | Preserves one continuous scene and seeks predictably |
| Small transparent, frequently sought one-dimensional motion | Alpha WebP sprite sheet | Fast random access with reusable transparency |
| Large or long transparent motion | Chroma/all-keyframe video plus WebGL keying | Avoids a very large RGBA atlas |
| Small deterministic vector or diagram state | SVG/Canvas/DOM | Prefer programmatic rendering over generated media |

Compress against the rendered size, not source dimensions. On-page clarity wins over an arbitrary file-size target, but mobile must not download a desktop asset by default.

### 4. Connect the controller

Map input to a normalized parameter and keep media mechanics behind a small controller interface. Clamp every input, smooth noisy signals, and make direction changes interruptible.

- Scroll: calculate against the element's real range and recompute on resize, zoom, and content shifts.
- Pointer: use element-relative coordinates; do not treat viewport position as stable after scroll.
- Drag/touch: capture and release pointers safely, preserve native scrolling when the gesture is not owned, and test cancellation.
- Orientation: request permission only after user intent, filter sensor noise, and provide a non-sensor control.
- Data/audio: bound update frequency and define behavior for gaps, spikes, disconnects, and re-entry.
- Discrete state: name segment boundaries and guarantee that rapid changes retarget without restarting from an unrelated frame.

### 5. Build loading and fallback states

Show a representative first frame before the interactive asset is ready. Preload only what the immediate experience needs. On failure, timeout, data saver, constrained memory, or reduced motion, show a stable image or simpler programmatic treatment that preserves the content.

Do not block the whole page while decorative media loads. Expose status only when the user is genuinely waiting on the animation to perform a task.

## Verification

Test inside the real page, not only in an isolated demo:

- frame-by-frame continuity at start, middle, end, and clip seams;
- fast input, reversal, overscroll, out-of-bounds values, resize, zoom, and orientation change;
- desktop and mobile decode time, memory, transfer size, and visible sharpness;
- slow network, failed asset, disabled autoplay, background tab, and page restore;
- keyboard/touch alternatives and `prefers-reduced-motion` fallback;
- cleanup of animation frames, event listeners, observers, video decoders, and WebGL resources;
- no layout shift, inaccessible overlay, or interaction lock while media initializes.

Report generated-media review separately from runtime verification. A successful encode does not prove subject continuity, and a smooth desktop demo does not prove mobile memory safety.

## Deliverables

Return only what the task needs:

- concept contract and approved key frames;
- prompts or capture instructions with source provenance;
- raw and processed media with a small manifest of dimensions, duration, frame count, hash, and intended display size;
- timeline controller and integration code;
- static/reduced-motion/mobile fallbacks;
- a preview or test page for input mapping;
- verification results and unresolved visual judgment.

Keep provider-specific generation details outside the product runtime. The shipped browser experience should use prepared deterministic assets and must not call a generation model during interaction.

## Sources and local adaptation

This skill adapts the media-contract, pilot, format-selection, deterministic-processing, and timeline-control approach from Oil Motion. It removes the upstream dependency on a single generation vendor and keeps provider choice subordinate to available tools, user intent, security policy, and project constraints.
