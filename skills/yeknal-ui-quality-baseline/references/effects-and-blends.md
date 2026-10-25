# Effects and blends

Load this when a design calls for knockout text, blend modes, glass, glow, or layered transparency. Most of these effects are legitimate in small doses and catastrophic when applied to text that must be read.

## Blend modes

`mix-blend-mode` composites an element against whatever is painted behind it. The common application is knockout text: a dark panel with light text set to `multiply`, so the glyphs become windows onto the backdrop.

```css
.sticker {
  background: #000;
  color: #fff;
  mix-blend-mode: multiply;
}
```

That works, and it is also where most implementations break. Three things must be true:

1. **Isolate the blend.** Without `isolation: isolate` on the containing section, the element blends with every ancestor backdrop, including the page background, gradients behind the section, and sibling layers. The result then depends on where the element happens to sit. Wrap the intended backdrop in a container with `isolation: isolate`.
2. **Control the backdrop.** Knockout text has no contrast of its own; the letters *are* the backdrop. Over a photo, a video, or a busy illustration, contrast is whatever the image happens to be at that moment and can drop below 4.5:1 on parts of a single word. A knockout headline is decorative unless the backdrop is controlled: a flat tint, a darkened image, or a deliberately chosen block of color.
3. **Provide a fallback.** Blend modes flatten under `forced-colors` and often in print, which can produce white-on-white or black-on-black. Add an explicit reset:

```css
@media (forced-colors: active) {
  .sticker { mix-blend-mode: normal; background: Canvas; color: CanvasText; }
}
```

The inverse for dark UI is a white panel with black text and `mix-blend-mode: screen`.

Other practical rules:

- Blending forces a composited layer. Do not put it on large areas that scroll, and never combine it with `backdrop-filter` on the same element.
- Blending is not supported in the same way across engines for SVG and Canvas children. Verify the specific composition you built.
- `background-blend-mode` blends layers *inside* one element. `mix-blend-mode` blends the element with its backdrop. Confusing the two produces effects that appear to work in isolation and break in layout.

## Text morphs across elements

The "blend" technique behind libraries like Blendy transitions one element into another by stacking both in a blend layer and animating the opacity or size between them. It is the same mechanism and inherits all three caveats above: it needs an isolating container, it needs a controlled backdrop, and it needs a forced-colors fallback. It also needs the two elements to share a background, so it does not work when the source and destination sit on different surfaces.

## Glass and translucency

- `backdrop-filter: blur()` is expensive: it forces a new layer and re-filters on every frame that changes what is behind it. Keep the blur radius small (roughly 8–20px); the visual difference between 20px and 40px is small and the cost is not.
- Never stack a translucent surface on another translucent surface. Legibility collapses and the layering reads as muddy rather than deep.
- Text on glass needs a solid or sufficiently opaque backing, or a contrast guarantee is impossible. Test against the busiest content that will scroll under it.
- Gate glass behind a feature check and provide an opaque fallback; a failed `backdrop-filter` must not leave text on an unreadable background.
- Honor `prefers-reduced-transparency` where the platform exposes it.

## Glows, shadows, and light effects

- Shadows communicate elevation, not decoration. One elevation scale, applied by role.
- Do not animate `box-shadow`. Animate a pseudo-element's `opacity` or a `transform` on a shadow layer instead.
- Colored glows read as "AI-generated" when they surround unrelated elements. If a glow exists, it belongs to one element and means something.
- Large soft shadows on many cards at once flatten the hierarchy they were meant to create.
