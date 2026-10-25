# Rendered video

Use this only when the deliverable is a video file: a product demo, a launch clip, a changelog reel, a social cut. It is not a substitute for a working page, and a page that needs a video to explain itself has a layout problem.

## When it is justified

- A product demo where the interaction itself is the argument.
- A launch or changelog clip that will be posted where a link cannot be clicked.
- A looping silent background for a hero, where a video is materially better than an image and the file is small.

Not justified: an animated hero that exists because the page felt static, or a video standing in for content that should be readable.

## Stack

[Remotion](https://remotion.dev) writes compositions in React and renders them with a bundled Chromium. [snapcn](https://snapcn.dev) supplies Remotion components for the shots a software demo is made of (streaming AI answers, terminals, device frames, captions) as MIT source installed through the shadcn CLI. Nothing ships as a runtime dependency: the code lands in the project and you own it.

Requirements: Node 20 or newer, and a render that downloads a browser on first run. Budget render time honestly; a 60-second 1080p render is minutes, not seconds, and it is not something to run on every save.

## Authoring rules

- **Frame-based, not CSS-based.** Every value is a function of the frame number. CSS transitions do not render deterministically and will drift between renders.
- **Deterministic by construction.** No `Math.random()` without a seed, no `Date.now()`, no network fetch during render. Two renders of the same composition must produce the same frames.
- **One composition per shot.** Each shot is independently previewable and re-renderable; a single 90-second composition is unreviewable.
- **Assets local.** Fonts, images, and audio are committed, not fetched. A missing font renders as a fallback without warning.
- **Type size is a video constraint, not a web one.** Body text below roughly 24px at 1080p is unreadable on a phone. Design at the delivery size, not the preview size.
- **Shots are short.** Two to four seconds per idea. A demo that holds one screen for eight seconds is a slideshow.
- **Captions ship.** Burned in or as a track, but present. Most viewing happens muted.
- **Never fake product behavior.** A demo showing a feature that does not exist is a false claim, and it is the most common failure in generated launch videos.

## Verification

1. Render a 2-second slice before the full composition. A broken first frame is the common failure, and it is cheap to catch.
2. Watch the full render at 1x, muted, then with sound. Do not review it by scrubbing.
3. Check the first two seconds for a black, blank, or mid-transition frame.
4. Check captions against the audio, and audio levels against clipping.
5. Check the file size and dimensions against where it will be posted.
6. For a looping hero, check the loop point frame by frame; a visible jump is the defect.

Report the command used to render and the output path. A video nobody can re-render is not an artifact.
