# Scoring rubric

The judge scores the screen, not the code. Five dimensions, each scored 1–5, plus a binary conformance gate and a ranked list of defects.

Weights are stated so the total is auditable. They are not sacred; if a brief is primarily a marketing page, say so and reweight in the scorecard rather than silently.

| Dimension | Weight | Question |
| --- | --- | --- |
| Visual design | 30% | Does it look designed for this subject, not generated? |
| Usability | 25% | Can a visitor find the point and complete the main job? |
| Craft | 20% | Are the details right at the pixel level? |
| Content | 15% | Is every visible string honest and useful? |
| Motion | 10% | Does motion explain, or does it decorate? |

Accessibility is not weighted. It is a gate: any confirmed accessibility defect makes the run **fail** regardless of the total.

## Anchors

Score against the anchor, not against a feeling. If a page sits between two anchors, score the lower one.

### Visual design

| Score | Anchor |
| --- | --- |
| 5 | A clear visual thesis carries the whole page; hierarchy is unmistakable; type, color, and spacing read as one system built for this subject. Nothing could be swapped into another product unchanged. |
| 4 | A real direction is present and consistent, with one or two places where it thins out. |
| 3 | Competent and coherent, but generic: it would not embarrass anyone and would not be remembered. |
| 2 | Inconsistent system: mismatched radii, competing type sizes, hierarchy that changes section to section. |
| 1 | Unstyled or actively broken visual system. |

### Usability

| Score | Anchor |
| --- | --- |
| 5 | The page's job is obvious within seconds; the primary action is unmissable; every state a visitor can reach is handled. |
| 4 | The main job is clear with minor friction; secondary paths are discoverable. |
| 3 | The job is findable but requires reading; one or two flows dead-end. |
| 2 | The point is unclear; primary and secondary actions compete; states are missing. |
| 1 | A visitor cannot tell what to do. |

### Craft

| Score | Anchor |
| --- | --- |
| 5 | Optical alignment, consistent control geometry, correct numerals, sane truncation, no visible jitter or overlap at any captured width. |
| 4 | Detail is right almost everywhere; one or two small defects. |
| 3 | Noticeably drafted rather than crafted: centered-but-wrong labels, uneven spacing, inconsistent sizes. |
| 2 | Multiple visible geometry defects at common widths. |
| 1 | Broken layout, overlap, or horizontal scroll. |

### Content

| Score | Anchor |
| --- | --- |
| 5 | Every string is specific to this product; no invented metrics, testimonials, or filler; nothing that could be a placeholder. |
| 4 | Honest and specific with one generic patch. |
| 3 | Correct but bland; some sentences could belong to any product. |
| 2 | Filler, duplicated headings, or copy that explains the layout instead of the product. |
| 1 | Fabricated claims, placeholder text, or content that contradicts the screen. |

### Motion

| Score | Anchor |
| --- | --- |
| 5 | Motion explains cause and effect, is absent where frequency says it should be, respects reduced motion, and never delays input. |
| 4 | Judicious, with one place it adds nothing. |
| 3 | Pleasant but decorative; the reduced-motion state exists but loses meaning. |
| 2 | Motion on high-frequency or keyboard actions, or motion that delays the first interaction. |
| 1 | Motion hides state, hijacks scroll, or ignores reduced motion. |

Not applicable is a valid answer for Motion on a static page. Record `null`, not a guessed score, and drop the weight.

## Conformance gate

Any of these fails the run outright:

- horizontal overflow at any captured width
- console error on load
- a state the brief required that is unreachable
- a fabricated metric, testimonial, or customer logo
- a required label replaced by a placeholder
- the submit or primary action not reachable by keyboard

## Findings

Every finding needs: what is wrong, where (viewport and region), the observable consequence, and the smallest correction. Rank by severity, not by category order. A finding without a location is an opinion and does not belong on the card.
