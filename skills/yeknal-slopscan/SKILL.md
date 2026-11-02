---
name: yeknal-slopscan
description: Scan a codebase locally for AI-slop signs such as stock marketing copy, placeholder text, gradient headline text, decorative emoji, and template leftovers, then act on the report. Use before a launch or when a project reads as generic.
---

# Slop scan

Run `npx yeknal slopscan` to read a codebase for the familiar signs of a shipped template, and use the report to decide what to change. The scan is local, needs no network, launches no browser, and writes a readable log plus a JSON report. Every finding carries its file, line, the matched text, a plain explanation, a fix, and the class it authorizes.

The scan is a reader, not a judge. It reports candidates for review, and it says plainly which checks it could not perform.

## When to use this

- A landing page or marketing site should be checked before launch.
- Copy keeps sounding like every other product in the category.
- A project was assembled quickly and you suspect placeholder text or template leftovers survived.
- Someone asks whether a codebase reads as generic, and you want evidence rather than an opinion.
- You are reviewing a redesign and want to know which familiar patterns are still present.

Do not use it as an authorship detector or a quality verdict. It cannot tell who or what wrote the code, and it never tries.

## Running the scan

```bash
npx yeknal slopscan
```

Useful options:

```bash
npx yeknal slopscan --path ./apps/web        # scan a specific folder
npx yeknal slopscan --json                   # print only the JSON report to stdout
npx yeknal slopscan --out ./reports          # write reports somewhere other than the project root
npx yeknal slopscan --ignore "legacy/**"     # skip paths, repeatable, root relative
npx yeknal slopscan --fail-on any            # exit 1 when any primary finding exists
npx yeknal slopscan --fail-on 25             # exit 1 at 25 or more primary findings
npx yeknal slopscan --fail-on-defects        # exit 1 only when a certain defect exists
```

The command writes `yeknal-slopscan.log` and `yeknal-slopscan.json`, and adds both to `.gitignore` when it runs inside a repository. It exits `0` by default so cosmetic findings never break a build, `1` when `--fail-on` or `--fail-on-defects` is met, and `2` for a usage or input error.

`--fail-on` counts every primary finding, which includes heuristic slop signals and can gate a build on taste. `--fail-on-defects` counts only repair-class findings, the certain defects with a known fix, so it is the safe CI gate.

## Reading the report

The log has five parts.

1. **Slop signals.** Familiar template patterns: stock copy, placeholder text, gradient headline text, clipped slogans, accent words inside headings, numbered labels, decorative emoji, arrow-decorated links, mixed icon styles, invented proof and unsourced claims.
2. **Quality issues.** Images without alt text and broken local image paths are measured defects. Click-only boxes, missing control names, removed focus outlines and unguarded motion are also reported here, but each is heuristic: the pattern is certain, the defect is not until the rendered screen confirms it.
3. **Supporting signals.** Stock icon sets, kit default colors and dotted metadata strings. These are normal choices. They are reported only when a slop signal was also found, and they never count on their own.
4. **Not checked.** The checks that need the rendered page. These are not guessed.
5. **Coverage.** How many files were read, skipped, too large or unreadable, so a thin report is not mistaken for a clean one.

Each rule is labelled `measured` or `heuristic`, and each finding carries the class it authorizes: `repair`, `confirm`, or `evidence`. A measured finding is syntactically certain, such as an image element written with no alt attribute. A heuristic finding means the source shows the pattern but the inference is not certain, such as a buzzword in a string that may never render.

## What has authority

A scan finding never authorizes a restyle; only a calibration verdict does, and confirmed defects are fixed at any verdict. This skill reports what is measurable. `yeknal-redesign-existing-projects` decides how much a screen may change.

Every finding falls into one class, derived from its category and assessment:

- **Repair.** Measured quality findings: missing alt text, a broken local image path. Fix with the smallest edit at any verdict, including on a screen that needs no redesign.
- **Confirm.** Heuristic quality findings: a click-only box, a missing control name, a removed focus outline, unguarded motion. Check the rendered screen first. Once confirmed it is still a defect fix, so it stays in scope at any verdict.
- **Evidence.** Slop findings of any assessment: stock copy, gradient text, decorative emoji, unsourced claims. These inform the verdict and never authorize a restyle on their own.

## Acting on findings

Read the whole report before editing. One finding is never a verdict, and the fix lines are suggestions in the product's voice, not a specification.

1. **Repair at any verdict.** Fix every repair-class finding, and every confirm-class finding you verified on the rendered screen. Defects are not design changes, so they do not wait for permission to restyle.
2. **Take the rest to calibration.** Unfinished template content, copy, surface and proof findings are evidence for the scope decision in `yeknal-redesign-existing-projects`, not a work queue.
3. **Never let volume decide.** Forty evidence findings do not add up to a redesign, and a clean scan does not prove a screen is designed.

Scope a run to one screen with `--path` when the findings belong to a screen-level task, so a repo-wide report is not mistaken for a screen verdict.

## What the scan cannot do

- It cannot see the rendered page, so layout, computed styles and the accessibility tree are out of reach. Rules that need them are listed as not checked, and the report points at https://sloplens.tryraisins.dev, where scanning the live URL returns a 0 to 100 score with a tier and points per rule. The command prints that address and never contacts it.
- It reads English copy only.
- It does not score the repository. A repository-wide number would measure size rather than quality, so the report gives counts instead.
- It cannot tell who or what wrote the code.

## Changing the scanner

Prove the behavior, not the shape of the output: scan a fixture with planted slop and confirm every expected rule fires, scan a clean fixture and confirm nothing fires, and scan a fixture with only a stock icon set and confirm the supporting gate stays closed. Keep generated reports out of commits.

A finding's class is derived from the rule's `category` and `assessment`, never authored on the rule itself, so changing an assessment moves the finding between repair, confirm and evidence automatically. Do not add a separate per-rule action field that can drift away from those two.
