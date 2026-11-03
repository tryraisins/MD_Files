# Scene motion and capture

Load this when the scene loops, when a cursor appears in it, or when the artifact has to be exported and checked. A still scene needs only the capture section.

## One causal chain

A scene animates one action and its consequence. Structure it as four beats, in this order:

1. **Frame.** The surface at rest, already showing the content the claim is about. The viewer needs the context before the action.
2. **Approach.** The pointer travels to the target in 200 to 400ms and stops once it lands. It should read as decisive, not as a cursor being parked.
3. **Action.** The press. Visible state change on the target itself: pressed fill, label to pending, row highlight.
4. **Consequence.** The result appears. This is the beat that carries the claim, so give it the most time.

Everything else in the scene holds still. A secondary element that animates during the chain competes with the consequence and makes the loop read as a loading screen.

## Timings

| Beat | Duration | Notes |
|---|---|---|
| Pointer travel | 200 to 400ms | Longer than a real cursor, short enough to avoid waiting |
| Press and immediate response | 80 to 120ms | Match the product's real press feedback |
| Content response | match the real product | If the product streams, stream; do not smooth it into a fade |
| Hold on the result | 800 to 1500ms | The beat the viewer must read |
| Loop reset | cut, or a 150 to 250ms fade | Never animate backwards through the chain |

Whole loop: 2.5 to 5 seconds. Above 6 seconds the viewer leaves before the payoff and the clip stops working as a loop.

- Use `cubic-bezier(0.2, 0, 0, 1)` for movement that must feel decisive, and a mild ease-out for reveals. Linear motion reads as mechanical.
- Ease out into a pointer's target so it lands rather than stops dead, but keep the tail short. A long ease-out leaves the cursor drifting into the click, and an ease-in makes it flick at the target instead of arriving.
- Springs are acceptable for the consequence if the product's own UI uses them. Match the product's spring, do not pick one for taste.
- Animate transform and opacity, not layout properties. A scene that janks in export janks in the final.

## The cursor

The cursor is a claim about interaction, so it has to behave like an interaction.

- Draw the platform cursor for the target platform, at the platform's real size. Do not invent a custom cursor unless the product ships one.
- Move in a path with a slight arc, not a straight line, and land on the target's visual center, not the element's bounding box center.
- Show the pressed state: scale or darken within 100ms of the click, and release it before the consequence settles.
- Never show a hover effect the product does not have, and never show a hover on touch-targeted scenes.
- Do not show the cursor traveling between two unrelated screens. Cut instead; a cursor walking through navigation is a screen recording, not a scene.
- Fade the cursor in at the start of its approach and out after the press if it would otherwise sit frozen in the poster frame.

## Poster frame and reduced motion

- The poster frame is the consequence state with the cursor faded out. It must carry the claim on its own.
- Under `prefers-reduced-motion`, show the poster frame, or a single crossfade between frame and consequence with no cursor travel.
- Keep the reduced-motion version as a real export, not a paused animation that some players will still start.
- Never autoplay a loop that moves more than a cursor and one element. The motion budget rules live in `yeknal-animate`; a page that already moves is not the place for another loop.

## Capture

Capture from a real render, never from a design tool screenshot pasted into a slide.

- **Browser route:** render the scene in a hidden route or a local page, then drive it with Playwright: wait for fonts and images, disable caret blinking, set a fixed device pixel ratio of 2, and capture a sequence of frames or record video. This is the default and needs no extra tooling.
- **React video route:** use Remotion when the scene needs frame-exact timing, repeated rendering, or many variants from one component. Its `renderStill` and `renderMedia` produce the still and the loop from the same source.
- Fixed seed and fixed clock. A scene that renders different numbers on every export cannot be compared or approved.
- Disable any animation that depends on wall-clock time or random values inside the scene component.
- Export: PNG or WebP at 2x for stills, MP4 H.264 at the target ratio for loops, and the poster as both the first frame and a standalone file.
- Name the artifacts so the brief and the export stay together: `claim-slug.ratio.still.png`, `claim-slug.ratio.loop.mp4`, `claim-slug.ratio.poster.png`.

## Verification checklist

Look at the exported files, not the running editor.

- Still read at display size: claim legible in under two seconds.
- Still at 400%: radii consistent, no sub-pixel seams, no clipped text, no aliased icon.
- Loop watched twice: the second pass does not look broken, the reset is not visible as a rewind.
- The consequence beat is the longest beat.
- Only one thing moved per beat, and the cursor is gone from the poster.
- Reduced-motion export exists and still carries the claim.
- Sample data plainly sample data; label present in the crop.
- File weight sits near these working defaults, and going over is a decision rather than an accident: roughly 400KB for a still, 3MB for a short loop.
- The export and the one-sentence claim are stored together, so the next person knows what it was supposed to prove.
