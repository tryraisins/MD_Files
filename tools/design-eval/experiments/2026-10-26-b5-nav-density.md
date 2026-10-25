# Experiment: does a rule set change output? (b5, nav density)

Date: 2026-10-26
Brief: `b5` from [briefs.json](../briefs.json) — an app shell with a twelve-item sidebar in four groups, a top bar, and one working content view.
Question: does pasting the catalog's nav-density rules into the build prompt measurably change the page?

## Method

- Same model for both arms, same brief, same output contract (single self-contained `index.html`, no libraries, no CDN).
- The only variable is the rule text: the treatment prompt carried the navigation rules and the six-row density table from `yeknal-ui-quality-baseline/references/component-patterns.md`; the control prompt carried the brief alone.
- Both pages captured with `capture.mjs` at 390, 768 and 1440 plus two reduced-motion variants, then judged blind from screenshots and measurements only, by the same lane, in neutralised folders with the arm labels stripped from the manifest.

## Result

| Arm | Weighted quality | Gate | Notes from the judge |
| --- | --- | --- | --- |
| Control | **3.56 / 5** | pass | Mobile detail text clipped at the right edge; header claims 6 carriers, list shows 5 |
| Treatment | **4.17 / 5** | pass | Two `h1` elements in one view; date columns vanish below 1000px; no row action |

Both arms: zero console errors, zero horizontal overflow, zero unnamed controls.

## What the probes showed

`conformance.mjs` measures each nav rule directly, so this part is not a judgement.

| Rule | Target | Control | Treatment |
| --- | --- | --- | --- |
| Row height | 32px | 34 | **32** |
| Row radius | 12px | 7 | 8 |
| Icon width | 18px | none | **18** |
| Label size | 14px | 14 | 14 |
| Group gap | 20px | 39 | 40 |
| Selection inset | 8px | 0 | 0 |
| Active items | 1 | 1 | 1 |
| `h1` count | 1 | 1 | **2** (fail) |

Treatment applied two rules to the exact value, ignored three, and introduced a high-severity regression the control did not have.

## The finding worth keeping

**Rules that name a property and a value land. Rules that describe a relationship do not.**

- "Row height 32px" and "icon 18px" were both reproduced exactly.
- "Row inset 8px from the panel edge" and "group gap 20px between groups" were ignored by both arms, because the wording does not say which property to set on which element. An implementer has to guess whether the inset is row padding, row margin, or container padding, and guessing produces zero.
- The `h1` regression happened because the treatment prompt carried only the nav rules. A real skill run loads the whole contract; this experiment pasted a fragment, which is a limitation of the method, not a property of the skill.

`component-patterns.md` has been rewritten to name the CSS property and value for each rule, which is the change this experiment paid for.

## Why the score difference does not demonstrate skill lift

Three reasons, in order of severity.

1. **The rubric never scored the treatment.** Nav density is not a dimension in `rubric.md`. The judge had no reason to look at row height, inset, icon size or group gap, and did not mention them in either arm. The measured difference comes from content honesty and mobile handling, which are not what the rule text addressed.
2. **n = 1 per arm, with different inventions.** Each build chose its own product domain, dataset and copy. A 0.61 difference between two unrelated pages is noise, not a treatment effect.
3. **The arms differ in ways nobody controlled.** The treatment page rendered two `h1`s; the control page clipped text at 390px. Both are defects the other arm did not have.

## Next

- Re-run with n of at least 3 per arm, with the page's own content pinned so only styling varies.
- Paste the whole relevant contract rather than the nav fragment, so a regression like the second `h1` is prevented by the run and not by luck.
- Extend probes to the other rule sets that already have exact values: motion durations, touch targets, type floors, contrast ratios.

## Artifacts

Run folders in `%TEMP%\design-eval-run\runs\b5-control` and `runs\b5-treatment`: five screenshots, `manifest.json`, `judgement.json`, `scorecard.md`, `conformance.md` and `conformance.json` each. Not committed, because they are several megabytes of PNG.
