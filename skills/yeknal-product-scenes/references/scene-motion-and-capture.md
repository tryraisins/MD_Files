# Scene motion and capture

Load this when the scene loops, when a cursor appears in it, or when the artifact has to be exported and checked. A still scene needs only the capture section.

## One causal chain

A scene animates one action and its consequence. Structure it as four beats, in this order:

1. **Frame.** The surface at rest, already showing the content the claim is about, held for 400 to 700ms so the viewer can read the context before anything moves.
2. **Approach.** The pointer travels to the target in 450 to 700ms and stops once it lands. Aimed pointing in the real world takes about half a second, and a faster cursor on a small canvas reads as a teleport.
3. **Action.** The press. Visible state change on the target itself: pressed fill, label to pending, row highlight.
4. **Consequence.** The result appears. This is the beat that carries the claim, so give it the most time.

Everything else in the scene holds still. A secondary element that animates during the chain competes with the consequence and makes the loop read as a loading screen.

## Timings

| Beat | Duration | Notes |
|---|---|---|
| Frame at rest | 400 to 700ms | Long enough to read the context |
| Pointer travel | 450 to 700ms | Aimed pointing speed, not a flick |
| Press and immediate response | 80 to 120ms | Match the product's real press feedback |
| Content response | match the real product | If the product streams, stream; do not smooth it into a fade |
| Hold on the result | 500ms plus 330ms per word in the result | The beat the viewer must read |
| Loop reset | cut, or a 150 to 250ms fade | Never animate backwards through the chain |

Whole loop: 2.5 to 5 seconds, which caps a readable result at about six to nine words. Above 6 seconds the viewer leaves before the payoff and the clip stops working as a loop. If the result needs more words than that, cut the words or split the claim into two scenes.

- Use the product's own easing token, or the easing table in [the motion rules](../../yeknal-animate/SKILL.md). Never invent a curve per scene: linear motion reads as mechanical, and a curve outside the system makes the scene feel like a different product.
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

- The poster is the consequence state with the cursor faded out. It must carry the claim on its own, and it is a separate file, not the video's first frame. A clip that opens on its result then cuts back to the start reads as a flash.
- Under `prefers-reduced-motion`, show the poster, or a single crossfade between frame and consequence with no cursor travel.
- Keep the reduced-motion version as a real export, not a paused animation that some players will still start.
- Add `poster="…"` to the video so the still shows before playback, and never let the first frame be a blank or black canvas.
- A looping autoplay needs a way to stop it: WCAG 2.2.2 requires a pause, stop, or hide control for motion that runs longer than five seconds. A short loop that ends is exempt; an endless marketing loop is not.
- Never autoplay a loop that moves more than a cursor and one element. The motion budget rules live in `yeknal-animate`; a page that already moves is not the place for another loop.

## Capture

Capture from a real render, never from a design tool screenshot pasted into a slide.

- **Browser route:** render the scene in a hidden route or a local page, then drive it with Playwright: wait for fonts and images, disable caret blinking, set a fixed device pixel ratio of 2, and capture a sequence of frames or record video. This is the default and needs no extra tooling.
- **React video route:** use Remotion when the scene needs frame-exact timing, repeated rendering, or many variants from one component. Its `renderStill` and `renderMedia` produce the still and the loop from the same source.
- Fixed seed and fixed clock. A scene that renders different numbers on every export cannot be compared or approved.
- Disable any animation that depends on wall-clock time or random values inside the scene component.
- Export: PNG or WebP at the size the placement needs, MP4 H.264 at the target ratio for loops, and the poster as its own file referenced by `poster=`.
- Name the artifacts so the brief and the export stay together: `claim-slug.ratio.still.png`, `claim-slug.ratio.loop.mp4`, `claim-slug.ratio.poster.png`.

## Verification checklist

Look at the exported files, not the running editor.

- Still read at display size: claim legible in under two seconds.
- Still at 400%: radii consistent, no sub-pixel seams, no clipped text, no aliased icon.
- Loop watched twice: the second pass does not look broken, the reset is not visible as a rewind.
- The consequence beat is the longest beat.
- Only one thing moved per beat, and the cursor is gone from the poster.
- Reduced-motion export exists and still carries the claim.
- Sample data plainly sample data; label present in the crop, readable, and at 4.5:1.
- The poster is its own file and is wired to `poster=`; any looping video has a pause control.
- File weight sits near these working defaults, and going over is a decision rather than an accident: roughly 400KB for a still, 3MB for a short loop.
- The export, the alt text and the one-sentence claim are stored together, so the next person knows what it was supposed to prove.
