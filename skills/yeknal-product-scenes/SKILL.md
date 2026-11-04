---
name: yeknal-product-scenes
description: "Build authored faux product UI for marketing and social surfaces: stills, feature cards, cursor demos and bento grids that read like the real product without pretending to be a live screenshot. Use for landing page hero art, README images, changelog cards, launch clips and social posts."
metadata:
  last-reviewed: "2026-11-03"
  reference-implementation: "Stageshow by Benji Taylor. Source MIT; bundled artwork and marks excluded, see its NOTICE.md. https://github.com/benjitaylor/skills/tree/main/stageshow"
---

# Product scenes

A product scene is an authored picture of the product: a cropped window, one action, one visible consequence. It is not a working interface and not a stock illustration.

Use this skill when the deliverable is the image or loop itself: a hero still, a feature card, a bento tile, a cursor demo, a launch clip, a changelog thumbnail, a README banner.

Do not use it for:

- Real UI. Build that with `yeknal-frontend-design`, `yeknal-frontend-developer`, and `yeknal-ui-quality-baseline`.
- General interface motion. That is `yeknal-animate`, and the gate in `yeknal-animate` decides whether motion is warranted at all.
- Brand identity boards. That is `yeknal-brandkit`.
- Rendered product video from real components. That is the Remotion row in `yeknal-pick-ui-library`.

`Stageshow` ([benjitaylor/skills/stageshow](https://github.com/benjitaylor/skills/tree/main/stageshow)) is the open reference implementation of this craft: it ships composition and motion guidance, a React kit, examples, and tooling that films the result. Its **source** is MIT (Copyright 2026 Benji Taylor). Its bundled artwork is not: `NOTICE.md` records app icons taken from product bundles, brand SVGs under their own licences, and product and OS names that stay with their owners and grant no trademark rights. Read it for method. Do not vendor the kit, do not reuse its icon or brand artwork, and do not inherit its aesthetic defaults. The brief and the product decide the look.

This skill owns stills and single-shot loops of five seconds or less. A multi-shot launch film, a narrated demo, or anything cut between scenes belongs to [rendered video](../yeknal-animate/references/rendered-video.md), which can use these scenes as its shots.

## The scene makes one claim

Write the claim before composing anything: one sentence, with the product surface it comes from.

- Weak: "AI for documents." It has no subject.
- Usable: "Draft an invoice from a photo in two taps." A surface, an action, and a payoff.

Then name what the viewer is looking at: which screen, which actor, which step. A scene with no named surface becomes a decorative gradient with a card floating in it, which is the failure mode this skill exists to prevent.

If the claim needs a caption to be understood, the claim is not visual yet. Fix the claim, not the caption.

## Borrow the real product

Every scene is derived, never invented. Read the actual product before drawing a frame:

- Pull real tokens: surface colors, border radii, spacing steps, shadow or no shadow, the type scale, the icon family.
- Match real component anatomy: where the title sits, how a row is built, what a primary button looks like at rest and while pending.
- Reuse the real wordmark and the real product name. Do not redraw a logo by eye if a source vector exists.
- Use the actual density. A sparse fake of a dense product reads as a different product.

Then subtract. A scene shows one surface at readable size, not a dashboard shrunk to illegibility. If the real screen is too dense to read at the target size, crop it and enlarge it rather than shrinking the whole thing.

If there is no real product to derive from, do not manufacture one. Either build the screen first, or make a type-led card that states the claim in the product's own words with no fake interface behind it, or stop and ask. An invented product UI is the single most common way this craft produces something worthless.

## Honesty rules

These are inherited from the evidence rule in `yeknal-design-taste-frontend`. They are not optional decoration, because a faux scene is the one place where a picture can be mistaken for proof.

- Never invent metrics, prices, customer names, avatars, testimonials, dates, logos, or press marks to make a scene look live.
- Use the product's own demo content, or plainly synthetic content that reads as sample data. A row called "Sample invoice" is honest. A row attributed to a plausible person is not.
- Never compose a scene so it reads as a screenshot of a running production build, especially any scene implying connected accounts, live traffic, or real customer data.
- Label the artifact where it appears: "Illustration", "Sample data", or the product's own wording. One visible label, in the layout, not a footnote.
- Put the label inside the image when the artifact will be posted where a caption cannot travel with it. A caption only carries the disclosure where the placement keeps it attached.
- Render the label at a readable size and at least 4.5:1 against whatever sits behind it. A label nobody can read is not a disclosure.
- Localise the sample content the way the product would: currency, dates, names, and address order. Translate the label too. A scene in English over a localised product contradicts the claim.
- If a scene depicts a capability that is not shipped, the scene does not ship. Do not illustrate a roadmap as a screenshot.

## Choose the form before the layout

| Form | Use when | Watch out for |
|---|---|---|
| Window still | The claim is one screen and one state | Cropping so hard the surface stops looking like software |
| Feature card | A page or grid needs one idea per tile | Four tiles that each need a paragraph to explain them |
| Bento tile | Tiles differ in size because their content differs | Tiles sized for symmetry, so the small ones are padding |
| Cursor demo | The claim is an interaction, not a screen | A cursor path that teleports, or moves without a target |
| Before and after | The product changes something the viewer can see | Two equally loud panels with no defined reading order |
| Loop clip | The claim needs time: reveal, reorder, progress | A loop with no reset, so the second pass looks broken |

One scene, one form. A bento grid of cursor demos is two forms arguing.

## Compose at final size

Design at the size and ratio the artifact will be displayed at, then export at twice that for images placed in a page. Never design at desktop width and scale down.

- Pick the ratio first: 16:9 or 21:9 for a hero, 1:1 or 4:5 for social, 3:2, 4:3 or 1.91:1 for a card or link preview, 9:16 for stories, 2:1 or 3:1 for a README banner.
- Resample for the placement, not uniformly. A page image exports at 2x of its displayed size. A link preview must be exactly 1200 by 630, so 2x makes it invalid. Video exports at native resolution.
- Recompose per ratio. Cropping a 16:9 scene to 9:16 deletes the product. A vertical version needs its own crop, its own type size, and often a different single element.
- Judge type at the smallest placement, not the design width. Text that is 14px on a 1600px canvas renders near 9px in a 1200px container and near 3px on a phone, so size it for the smallest container that will show it, and ship a separate mobile crop rather than one image for every width.
- Leave one deliberate focal point and let the rest recede. Everything at equal contrast is a texture, not a picture.

For a page or a bento set, treat the scenes as one system: shared canvas, frame treatment, corner radius, type scale, and label rule. One claim per tile. Allow one autoplaying loop per viewport; the rest are stills, or play once when scrolled into view.

Full geometry, crops, bento construct, and safe zones: [scene composition](references/scene-composition.md).

## Move one thing

Motion in a scene is the action and its consequence. Nothing else moves because nothing else changed.

- One causal chain: pointer arrives, presses, the surface responds, the result settles.
- Time the response the way the real component would. A press that resolves in 80ms in the product must not take 600ms in the scene.
- Give the loop a reset. Animating back to frame zero is a defect; hold the result, then cut, or fade to the next pass.
- Never animate a loading state the product would not show, and never fake a progress bar.
- Poster frame for reduced motion and for still export: the state that carries the claim, not an empty first frame.

Timings, easing, cursor choreography, and capture: [scene motion and capture](references/scene-motion-and-capture.md).

## Verify by looking

A scene is finished when you have looked at the exported artifact at its real display size, not when the component renders.

1. Export the still. Export and inspect a loop only when the claim needs time, or when the brief asked for one.
2. Open the still at its smallest real display size, and at 400% to inspect edges, radii, and type.
3. Watch the loop at least twice to catch the second pass.
4. Check: is the claim visible in under two seconds without the caption; does anything clip, blur, or fall below readable size; does the type match the product; is the sample data plainly sample data; is the label present, readable, and at 4.5:1; does reduced motion still carry the claim.
5. Write the alt text with the artifact: the claim, then the word illustration. "Illustration: draft an invoice from a photo in two taps." The image is unreadable to anyone using a screen reader, so the alt text carries the whole claim or it carries nothing.
6. Keep the export, the alt text, and the brief together as the evidence. A scene with no exported artifact was not verified.

## Failure modes

- A gradient panel with a floating card and three fake metric tiles. This is the default AI hero, not a product scene.
- Text rendered too small to read, because the whole dashboard was scaled instead of cropped.
- Browser chrome drawn from memory, with the wrong proportions, tab count, or traffic light order.
- A cursor that moves for no reason, or a click with no visible consequence.
- Real-looking customer names and numbers, which turn an illustration into a fabricated claim.
- The same scene reused across every ratio, letterboxed or cropped mid-word.
- Motion added to a scene whose claim is static, because the format allows it.
