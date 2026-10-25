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

## Why this does not demonstrate skill lift

Three reasons, in order of severity.

1. **The rubric never scored the treatment.** Nav density is not a dimension in `rubric.md`. The judge had no reason to look at row height, inset, icon size or group gap, and did not mention them in either arm. The measured difference comes from content honesty and mobile handling, which are not what the rule text addressed.
2. **n = 1 per arm, with different inventions.** Each build chose its own product domain, dataset and copy. A 0.61 difference between two unrelated pages is noise, not a treatment effect.
3. **The arms differ in ways nobody controlled.** The treatment page rendered two `h1`s; the control page clipped text at 390px. Both are defects the other arm did not have.

## What the rule check did show

A direct check of the declared CSS values, because the generic nav probe latched onto a one-row `<nav>` and measured nothing useful:

| Rule | Control | Treatment |
| --- | --- | --- |
| 32px rows | 1 declaration | 5 declarations |
| 14px labels | 0 | 3 |
| 20px group gap | 1 | 0 |
| 18px icons | 1 | 0 |
| 12px panel radius | 0 | 0 |

The treatment applied part of the rule set and silently dropped the rest. That is the useful finding: **a paragraph of rules transfers unevenly, and nothing in the current harness would tell you which rules landed.**

## Next

- Add a conformance probe: one deterministic check per rule (row height, inset, icon width, group gap, panel radius, `h1` count), reported as pass/fail beside the quality score. Rules without a probe are opinions; rules with one are contracts.
- Repeat with n of at least 3 per arm, and pin the page's content so only the styling rules vary.
- Score nav density explicitly when it is the thing under test, or the experiment cannot answer its own question.

## Artifacts

Run folders were produced in `%TEMP%\design-eval-run\runs\b5-control` and `runs\b5-treatment`: five screenshots, `manifest.json`, `judgement.json`, `scorecard.md` each. Not committed, because they are several megabytes of PNG.
