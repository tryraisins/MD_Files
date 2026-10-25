# Icons

Load this when choosing an icon set, sizing icons, or adding animated icons. The shared iconography rules in the main skill still govern; this file covers selection, coverage, and the animated case.

## Verify coverage before committing

The most common way a surface drifts into mixed icon families is one missing glyph. You pick a set, hit an icon it does not have, and pull in a second library.

Before adopting a family:

1. List the glyphs the product actually needs, from real screens, not from imagination.
2. Confirm every one exists in the candidate family at the weight you will use.
3. Confirm the family has the state variants you need (outline and filled, or the filled state is derivable).
4. Only then install it.

Browsers like [Icônes](https://icones.js.org) (Iconify) index hundreds of sets side by side and are the fastest way to check coverage. Use them to compare and to check glyphs; do not fetch icon geometry from an icon API at runtime.

**Runtime icon fetching is a defect in most products.** It adds a third-party request on the critical path, shifts layout when icons resolve late, and fails closed on restricted networks. Bundle the icons you use, or inline the SVG paths.

## Sizing and alignment

- Size icons relative to the label, not to the container. An icon that reads louder than its label is a hierarchy defect; when the icon competes, reduce the icon, not the text.
- Keep a consistent optical size across a family. Matching nominal pixel values across different families does not produce matching optical weight.
- Match stroke weight to the surrounding text weight. A hairline icon beside semibold text looks broken, and so does a heavy icon beside body copy.
- Center the icon-and-label group as one unit. Do not center each child against the container.
- Give the icon and label a gap large enough that they read as two elements. At very small gaps they merge into a single shape.
- Filled icons mean selected, active, or critical. Outline means default. Do not mix the convention within a surface.

## Animated icons

Animated icons are the most common decorative motion in generated UI, and mostly they are noise. Apply [the motion gate](../../yeknal-animate/SKILL.md) before considering one: if the action happens many times a minute, the icon does not animate.

Legitimate cases are narrow: a single celebratory confirmation, a stateful control whose animation communicates the state change itself (a play/pause morph, a theme toggle), or a branded loading indicator tied to real async work.

### Format decides the trade-off

| Format | Use when | Cost |
| --- | --- | --- |
| Animated SVG (CSS/SMIL) | You control the artwork and need `currentColor` theming | Hand-authored, rarely a coherent set |
| Lottie (JSON + runtime) | You need vector quality with a designer-authored animation | A runtime dependency, and it cannot inherit `currentColor` |
| APNG / WebM | Photographic or complex motion that is not flat vector | Heavy, inconsistent support, cannot theme |
| GIF | Never for UI | 256 colors, no soft alpha, blurry on HiDPI, large |
| Rive / component-level animation | Interactive state machines, or icon-as-component systems | Own runtime, or framework lock-in |

- Theming is the deciding constraint more often than quality. A Lottie icon cannot take the text color, so a themed UI ends up hardcoding colors per icon.
- Keep any animated icon's loop budget explicit. Continuous looping in a working surface is almost always wrong.
- Every animated icon needs a `prefers-reduced-motion` branch that preserves the state meaning without the motion.

### Licensing

Check the license before shipping an animated icon set into a product or a client project. Many popular animated icon libraries are paid or attribution-required, which is a commercial constraint rather than a design one. Record the requirement where the asset is installed, not only in a design note.

## Accessibility

- An icon that carries meaning stands alone with an accessible name (for example `aria-label` on a button, or visually hidden text).
- An icon that decorates a visible label is hidden from assistive technology (`aria-hidden="true"`).
- Never use an icon as the only indicator of state. Pair it with text, or with a shape or position cue.
- Icon-only controls need a visible tooltip when the meaning is not universal, and a target of at least 44 by 44 CSS pixels even when the glyph is 16px.
