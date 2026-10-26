# Typeface options

Load this only when a project names one of these faces, or when the selection gate in [typography](typography.md) has already chosen a role and you need a licensable face that can fill it. This file never chooses a face for you; the brief, the product's existing system, and that gate decide. A candidate still has to pass the gate and earn a written reason in `DESIGN.md`.

## Admission test

A family belongs in the table only when it passes all five:

1. **License.** The license itself permits commercial use and self-hosting, and the source is the foundry, Google Fonts, or Fontsource. Never a mirror, a "free download" site, or a personal-use file.
2. **Coverage.** It has every glyph the product ships, not only basic Latin. Test the real strings, including marks outside Latin, before committing.
3. **Style axis.** It offers a true italic if the design uses italic anywhere, and a real weight range rather than synthesized bold.
4. **Role.** You can state whether it is text-capable at 14–18px or display-only. A display-only face never sets body copy or controls.
5. **Reason.** You can say why it is not the face every other product in this category already ships.

Failing any one of these makes a family ineligible, however good it looks. Price is not an admission criterion and goes stale, so it stays out of this file.

## Candidates

| Family | Role | License and source | Styles | Coverage | Right call | Wrong call |
|---|---|---|---|---|---|---|
| Plus Jakarta Sans | Product text and UI | SIL OFL 1.1 via Google Fonts or `@fontsource/plus-jakarta-sans` | Variable 200–800 with a true italic | Latin Extended Additional verified: Yoruba and Igbo dot-below letters, combining dot below, acute, and grave | A neutral product face that needs no procurement, where the display layer carries the personality | As the display idea itself, or chosen because it is free. It is common enough to count as a default, so "free" is not the reason |

Coverage was read from the served weight-400 file's character map, not from a listing page. Re-check if you load a different subset, source, or weight.

## Pairing

Pair a candidate across a real contrast axis, never with another face of the same class at the same size. The rules and the failure mode are in [Pairing](typography.md#pairing).

Plus Jakarta Sans is a product face, so it takes a display partner that contrasts in construction, serif, width, or tight display setting. Two neutral geometric sans read as a mistake, not a pair.

## Licenses the project must keep

- Record the family, the license, and the source in the project's `DESIGN.md`.
- A project may license a face that is absent here. Use it, record it, and keep it out of this catalog; this list is not a buying recommendation.
- If a license is missing or unclear, ask the user, keep the metric-compatible fallback stack in place, and never vendor a file from an unofficial source.

## Adding a row

1. Confirm the license at its source and the glyphs at the sizes you will ship.
2. Add one row and, when the check was specific, one evidence line under the table.
3. Keep the table ordered by role, not by preference. No prices, no mirrors, no unverified coverage claims.
4. Link to it from the project's `DESIGN.md` reason, not as a house default.
