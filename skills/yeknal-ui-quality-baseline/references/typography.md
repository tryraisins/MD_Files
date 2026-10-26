# Typography

Load this when choosing or pairing typefaces, configuring font loading, or repairing text that reads badly at its real size. The shared type rules in the main skill still apply; this file is the selection and implementation detail behind them.

## Choose the face before you choose the size

Size and weight cannot rescue a face chosen for the wrong job. Decide three things first:

1. **Reading condition.** Long-form body copy at 15–18px needs open counters, a generous x-height, and moderate contrast. A display face with hairline strokes is not a body face, however good it looks in a hero.
2. **Voice.** Editorial serif, neutral grotesque, technical monospace, or a humanist sans. The voice must come from the product's subject, not from the current trend.
3. **Coverage.** Confirm the face supports every language the product ships in, including the diacritics and scripts you actually need. A face that lacks a glyph forces a fallback and silently breaks the type system mid-sentence.

Do not default to the same handful of fashionable AI-stack faces on every project. If a project has no brand, choose a face that suits the subject and say why in the design document.

Free candidates that have already passed a license and coverage check are listed in [typeface options](typeface-options.md). Use that list to test a choice, never to make one: a listed face still has to answer the three questions above and earn a written reason in the design document.

## Pairing

- One display or editorial family plus one highly readable product family is the ceiling. A monospace face is a third family only for short technical metadata.
- Pair across a real contrast axis: serif with grotesque, geometric with humanist, tight display with open text. Two faces that differ slightly read as a mistake, not a pairing.
- Never mix two faces of the same class at the same size (two grotesques) unless they are visibly different in width or weight and the difference carries meaning.
- Use one family in multiple weights before adding a second family. Weight is a cheaper hierarchy axis than a new typeface.
- A monospace face signals code, tokens, IDs, or tabular values. It is not a stylistic texture for headings.

## Loading

- Load only the weights and styles you use. Every extra weight is a request and a parse.
- Prefer a variable font when the design needs a continuous range or several weights; otherwise load static weights and let the browser pick.
- Never rely on synthesized bold or italic. If the family has no true italic, do not ask for one.
- Declare a metric-compatible fallback and `font-display` behavior deliberately: `swap` for body copy, `optional` for display text that must not shift. Prevent layout shift by matching fallback metrics with `size-adjust` and `ascent-override` where the shift is measurable.
- Self-host where the license allows it. A third-party font request is a privacy and reliability dependency, and it fails closed in some networks.
- Verify the rendered result, not the CSS: a font that 404s falls back silently and the page still "works".

## Scale and rhythm

- Build a small scale with a clear step ratio. Four or five sizes cover most products; more sizes mean the hierarchy is being decided per element instead of by system.
- Line height shrinks as size grows: roughly 1.5–1.6 for body, 1.2–1.3 for headings, 1.05–1.15 for large display text.
- Set measure by character count, not by container width: 45–75 characters for comfortable body reading, narrower for long-form editorial, wider only for short scanning text.
- Space above a heading exceeds space below it, so the heading groups with the text it introduces.
- Use `clamp()` or container queries for responsive type. Do not scale a desktop scale down proportionally; set floor and ceiling per role.

## Optical detail

- Tracking is size-dependent. Large display text wants slightly negative tracking; small text wants slightly positive. A single `letter-spacing` value is wrong somewhere.
- Do not track lowercase body copy tightly to look modern; it damages word recognition.
- Never place an italic word inside a roman heading for emphasis. Use weight, a different sentence, or a separate line.
- Avoid all-caps for anything longer than a short label, and never for body copy. If a label is set in caps, add tracking; caps set at zero tracking read as a wall.
- Balance headings with `text-wrap: balance` and body copy with `text-wrap: pretty` where supported. Both are progressive enhancements; the layout must work without them.
- Use tabular numerals (`font-variant-numeric: tabular-nums`) wherever numbers are compared in a column, animate, or update in place. Proportional figures elsewhere.
- Use a real ellipsis character in truncated text, and never truncate a control label, a required field name, or an error message.

## Truncation and overflow

- Truncate as a last resort, after shortening the copy and adjusting the layout.
- When you must truncate, give the full value another path: a tooltip, an expanded row, a detail view, or the accessible name.
- Never let text determine a control's height or width. Clamp the label, then fix the control geometry.
- On mobile, keep inputs at 16px or larger to prevent automatic zoom on focus in iOS Safari. This is a hard floor, not a style preference.

## Verification

- Read the actual rendered page at the target sizes before claiming the type works. Check the longest strings, the narrowest column, the largest zoom level, and the fallback state with the webfont blocked.
- Check numeric alignment in tables and stat blocks, not only in isolation.
- Check that the chosen weights actually loaded: compare against a deliberate fallback render.
