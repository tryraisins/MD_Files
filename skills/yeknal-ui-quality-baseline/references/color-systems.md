# Color systems

Load this when you are building or repairing a palette, adding a theme, or deciding whether a color choice is a system value or a one-off. The shared rules in the main skill still govern; this file supplies the construction method.

## Build in OKLCH

Work in `oklch()` rather than hex or HSL when you are constructing a palette. Tailwind CSS v4 already emits its default palette in OKLCH, so this is the native space for the default stack.

Why it matters:

- Lightness in OKLCH is perceptual. Two colors with the same `L` look equally light, so a ramp built at fixed `L` steps reads evenly. HSL lightness does not: a yellow and a blue at `hsl(60 100% 50%)` are wildly different in perceived brightness.
- Chroma is independent of hue, so you can hold saturation constant while moving around the wheel.
- Hue steps are consistent, so a four-hue accent set does not collapse on one hue and scream on another.

`oklch(L C H)` takes lightness `0–1`, chroma `0–0.4`, and hue `0–360`. Chroma above roughly `0.15` is already vivid; above `0.25` most hues leave the sRGB gamut.

## Construct a ramp before you style anything

1. Pick one hue anchor per role family: neutral, accent, and any semantic families (success, warning, danger, info).
2. Generate a lightness ramp at fixed hue, tuning chroma per step. Chroma usually peaks in the mid-tones and tapers at both ends; a flat chroma ramp looks synthetic at the extremes.
3. Verify each step is distinguishable from its neighbor at the size it will be used, not on a swatch board.
4. Name steps by role or by scale position, never by appearance ("gray-500", not "lightGray" or "slate-ish").

Neutrals are not gray by default. A neutral tinted a few degrees toward the brand hue reads warmer and more coherent than pure gray, and it costs nothing. Keep the tint subtle: over-saturated neutrals turn muddy.

## Clip the gamut deliberately

Browsers clip out-of-gamut `oklch()` to the display gamut without warning, which changes the color silently and can flatten two adjacent ramp steps into one.

- Check that every step survives clipping: render it and sample the computed result.
- Use `color(display-p3 ...)` only as a deliberate wide-gamut enhancement with an sRGB fallback, never as the only declaration.
- Never specify a color by picking a hex from a design tool and calling it a token; hex hides which channel moved when it was adjusted.

## Semantic roles, not scale values

Components consume roles. The scale is an implementation detail of the palette.

| Role | Use |
| --- | --- |
| `background` | Page canvas |
| `surface` | Cards, panels, sheets above the canvas |
| `surface-raised` | Menus, popovers, anything layered over a surface |
| `border` / `border-strong` | Separators; strong for hovered or pressed edges |
| `text` / `text-muted` | Primary copy; hints, placeholders, metadata |
| `accent` | Selection, progress, primary action, one helpful highlight |
| `success` / `warning` / `danger` | Semantic state, always paired with a label or icon |

Rules that follow from this:

- Accent marks selection and progress. It is not a decoration budget: a screen where three unrelated things are accent-colored has no accent.
- `text-muted` is for subordinate content only. Never use it for body copy that carries meaning, and never for a form label.
- Semantic colors carry a label or icon. Color alone never communicates state.
- Surfaces must be distinguishable from the canvas at a glance but must not compete with content. If you need a border and a shadow and a fill to separate a card, the elevation system is wrong, not the card.

## Light and dark are separate palettes

Do not invert. Dark values are tuned independently: lightness inverts, but chroma usually drops and hue often shifts a few degrees to avoid a neon look on a dark canvas.

- Pure `#000` and pure `#fff` are usually wrong. Use near-black and near-white so text has somewhere to sit and so elevation can be expressed between the canvas and the raised surface.
- Check every text and control color against every surface it appears on, in both themes. A muted color that passes on the canvas can fail on the raised surface.
- Set the theme before first paint so a dark-mode user never sees a light flash. Persist the choice and honor the system preference when there is no explicit choice.
- When a brand color is forced into the dark theme, keep its hue and adjust lightness and chroma; do not reuse the light value.

## Contrast is checked, never assumed

- Body text, labels, and icons that carry meaning meet at least 4.5:1 against their actual background. Large display text meets 3:1.
- Check against the real surface, including translucent and image-backed surfaces. A color that passes on a flat swatch can fail over a photo, a gradient, or a blurred material.
- If text sits on a variable background, give it a solid or sufficiently opaque backing, or the contrast claim is unverifiable.
- Alpha and `opacity` are not a shade system. `rgba()` or `opacity` on text, borders, and fills produces a different color on every background, so the token cannot be checked. Name the resolved color per surface, or define the token with `color-mix()`, and measure the composite. A rich scale of tints is fine; the problem is unnamed, unmeasured values, not their number.
- Do not use a low-contrast pair to look refined. Refinement comes from restraint in hue and count, not from unreadable gray.
- Test at 200% zoom and with forced-colors mode, where the OS overrides your palette entirely. Meaning must survive that override.

## Failure modes to reject

- A palette with more than one accent, or an accent used as ornament.
- Gradients that exist only to make a flat page feel designed.
- Purple-to-blue gradient hero treatments and teal-on-near-black "AI" defaults.
- A dark theme produced by inverting the light theme.
- Semantic colors with no text label, or a red that means both "error" and "brand".
- Every surface a card, every card a shadow, every icon colored.
- Color values hardcoded in components while tokens exist.
