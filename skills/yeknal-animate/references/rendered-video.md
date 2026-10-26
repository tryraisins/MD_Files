# Rendered video

Use this only when the deliverable is a video file: a product demo, a launch clip, a changelog reel, a social cut. It is not a substitute for a working page, and a page that needs a video to explain itself has a layout problem.

## The gate is different here

Interactive motion is ranked by frequency. A rendered clip is watched once, linearly, at whatever pace the editor chose, with no way to hover, interrupt, or scrub back. Frequency is a constant, so it decides nothing.

The UI rules do not transfer either. `prefers-reduced-motion`, hover gating, interruptibility, `transform-origin` at the trigger, and the sub-300ms ceiling all describe a person operating a control. In a video there is no operator. Three things govern instead:

- **Attention.** What the viewer looks at, and whether anything in the frame tells them where to look.
- **Comprehension time.** How long a line of copy or a chart actually needs before it can be read.
- **Sequence.** What has to be understood before the next shot makes sense.

Judge a clip on those three. A clip that passes every accessibility and easing check and fails these is a bad clip.

## When it is justified

- A product demo where the interaction itself is the argument.
- A launch or changelog clip that will be posted where a link cannot be clicked.
- A looping silent background for a hero, where a video is materially better than an image and the file is small.

Not justified: an animated hero that exists because the page felt static, or a video standing in for content that should be readable.

## Choose the technique

Name the technique for every shot before building it. A shot that needs two techniques is two shots.

| Technique | Use when | Disqualifier |
| --- | --- | --- |
| Screen recording, cursor choreographed | the interaction itself is the argument | any frame whose copy the viewer has to read; a feature that does not exist yet |
| Still frame with a camera move (push, pan, Ken Burns) | a still is the subject and the shot needs life, or one detail inside a wider frame needs emphasis | text that must be read; content that already moves; more than about 40% of the shots |
| Kinetic typography | a claim, a number, or a transition with no useful visual | copy that restates what the screen is already showing; more than about six words per beat; body copy |
| Real state change (A to B, before and after) | cause and effect is the point | either state is staged, or the change is not what the product actually does |
| Data or metric reveal | the number is the argument | animating a value that did not change; more than one number per beat |
| B-roll and environment | the product is physical, or the audience needs context before the screen means anything | stock footage that implies capability the product lacks |
| Diagram and explainer build | a process, a relationship, or a system is the argument | an invented diagram that implies a mechanism the product does not have |
| Abstract graphic motion (shapes, particles, line art) | a title sequence, a transition, or a launch beat where no interface is on screen | used as filler between real shots; a second visual system inside a short piece |
| Narration over screen | the explanation is too layered for text plus image | the voice competes with copy on screen |

The most common failure in generated demos is a slow push across a dashboard. It looks like craft and it destroys reading: the eye re-fixates every frame, so a viewer who could have read the panel in two seconds reads nothing. Push and pan for texture, product shots, and single elements. Hold still for anything containing words or numbers.

Kinetic type is the second most common failure, used as decoration on top of a shot that already carries the message. If the screen already says it, the type is noise. Kinetic type earns its place when there is nothing to show, such as a transition, a claim, or a stat.

## Technique vocabulary

Build the vocabulary before choosing shots, not while rendering. [MotionVideo](https://motionvideo.xyz/en) collects AI-made motion clips together with the prompts behind them, grouped by the technique they actually use: product UI, phone, charts, diagrams, kinetic type, shapes, particles, characters, photos, music, and code. Use the categories as the checklist for what a piece could be, and the clips to see how a technique holds for a full shot rather than a single frame.

Two cautions. Its clips are references, not timing specifications: do not measure a duration off a reel and copy it, because the right duration depends on the content in your shot. And the site sells a paid agent skill pack, so link the free gallery and vendor nothing from it.

## Sequence

- The first 1.5 to 2 seconds carry the outcome or the problem. Not a logo, not a fade from black, not a brand sting. That window is where the viewer decides whether to keep watching.
- One idea per shot.
- The arc is problem, smallest first action, visible result. A tour of features ordered by navigation or by engineering pride is not an arc.
- Every shot must show something the viewer could not predict from the previous one. If it does not, cut it.
- The result of an action is a shot, or the settled tail of the action shot. Never cut before it lands.
- Copy and narration say only what the image cannot. Restating the screen spends the viewer's attention twice.
- End on the state the viewer wants, not on a logo card, unless the logo is the deliverable.

## Budget: what is on screen

- One point of focus. At most two things move, and one of them is subordinate.
- Reading is measured, not assumed: about three words per second for comfortable reading, plus a beat to land. Six words need roughly two seconds of stillness, twelve words need four. A two-to-four-second shot cannot carry twelve words. Split it or cut it.
- One sentence of copy per shot: a headline plus at most three supporting words.
- Show the panel the viewer needs now. A full dashboard at 1080p is unreadable on a phone, and progressive reveal demonstrates the product instead of describing it.
- Crop to the decision. If the screen has twelve controls, show the two that matter.
- One number per beat, unless the comparison is the point.

## Budget: how much motion

- At most one continuous camera move per shot, and roughly 40% of shots or fewer with one. A push on every shot is the video equivalent of `transition: all`.
- A camera move carried across a cut is a defect.
- Camera speed: slow enough that frames a second apart differ, without any single frame jumping. In practice 2 to 6 percent scale over the shot, or a 5 to 10 percent pan.
- One motion vocabulary per beat. A camera push, a text slide, a cursor move, and a chart drawing at once read as noise, not richness.
- Entrances inside a shot run 200 to 400ms. The UI 300ms ceiling does not apply because nothing is waiting on input, but anything under about 200ms at 30fps reads as a pop.
- Nothing moves for the whole duration of a shot except the designated move. Static frames are allowed and are usually the better choice.

## Land, hold, cut

- Finish the motion before the cut.
- Hold the settled result for at least half a second. Generated clips routinely cut on the last frame of the change, which means the payoff is never seen.
- Hold the final shot longer, about one to one and a half seconds.
- Cut on the beat when there is music. Do not straddle it.

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

## Reviewing the result

Run this list on the full render, in order. It is about pacing and sequence, which only show up in sequence.

1. Watch the first two seconds. Is the subject clear before any explanation arrives?
2. For each shot: what is the one thing the viewer should look at, and is that the thing that moves?
3. Count the words in the busiest frame against the time that frame is on screen.
4. Count the camera moves. If more than half the shots move, cut half of them.
5. Does every action shot show its result, for at least half a second?
6. Is there stillness anywhere? A clip with no still frame has no emphasis and no rhythm.
7. Are captions present, readable at delivery size, and matched to the audio?
8. Does any shot claim a capability the product does not have?

## Verification

1. Render a 2-second slice before the full composition. A broken first frame is the common failure, and it is cheap to catch.
2. Watch the full render at 1x, muted, then with sound. Do not review it by scrubbing.
3. Check the first two seconds for a black, blank, or mid-transition frame.
4. Check captions against the audio, and audio levels against clipping.
5. Check the file size and dimensions against where it will be posted.
6. For a looping hero, check the loop point frame by frame; a visible jump is the defect.

Report the command used to render and the output path. A video nobody can re-render is not an artifact.
