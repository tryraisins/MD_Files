---
name: yeknal-slopscan
description: Scan a codebase locally for AI-slop signs such as stock marketing copy, placeholder text, gradient headline text, decorative emoji, and template leftovers, then act on the report. Use before a launch or when a project reads as generic.
---

# Slop scan

Run `npx yeknal slopscan` to read a codebase for the familiar signs of a shipped template, and use the report to decide what to change. The scan is local, needs no network, launches no browser, and writes a readable log plus a JSON report. Every finding carries its file, line, the matched text, a plain explanation and a fix.

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
```

The command writes `yeknal-slopscan.log` and `yeknal-slopscan.json`, and adds both to `.gitignore` when it runs inside a repository. It exits `0` by default so cosmetic findings never break a build, `1` when `--fail-on` is met, and `2` for a usage or input error.

## Reading the report

The log has five parts.

1. **Slop signals.** Familiar template patterns: stock copy, placeholder text, gradient headline text, decorative emoji, arrow-decorated links, mixed icon styles, invented proof and unsourced claims.
2. **Quality issues.** Measured defects: images without alt text, broken local image paths, click-only boxes, missing control names, removed focus outlines and unguarded motion.
3. **Supporting signals.** Stock icon sets and kit default colors. These are normal choices. They are reported only when a slop signal was also found, and they never count on their own.
4. **Not checked.** The checks that need the rendered page. These are not guessed.
5. **Coverage.** How many files were read, skipped, too large or unreadable, so a thin report is not mistaken for a clean one.

Each rule is labelled `measured` or `heuristic`. A measured finding is syntactically certain, such as an image element written with no alt attribute. A heuristic finding means the source shows the pattern but the inference is not certain, such as a buzzword in a string that may never render.

## Acting on findings

Work in this order, because it matches certainty.

1. **Fix quality issues first.** Missing alt text, a broken image path, a click-only box, a removed focus outline and unguarded motion are defects with a known fix. Change them without ceremony.
2. **Then unfinished template content.** Placeholder words, chat residue and links that go nowhere mean something shipped before it was finished. Replace the content or remove it.
3. **Then copy.** Rewrite the stock phrases as the fix lines suggest: say what the product does, who it helps and what changes for them.
4. **Then surface and proof.** Gradient text, decorative effects, arrows on every link, invented proof and unsourced numbers. Keep the ones that carry meaning and drop the rest.

Read the whole report before editing. One finding is never a verdict, and the fixes are suggestions in the product's voice, not a specification.

## What the scan cannot do

- It cannot see the rendered page, so layout, computed styles and the accessibility tree are out of reach. Rules that need them are listed as not checked, and the report points at https://sloplens.tryraisins.dev, where scanning the live URL returns a 0 to 100 score with a tier and points per rule. The command prints that address and never contacts it.
- It reads English copy only.
- It does not score the repository. A repository-wide number would measure size rather than quality, so the report gives counts instead.
- It cannot tell who or what wrote the code.

## Changing the scanner

Prove the behavior, not the shape of the output: scan a fixture with planted slop and confirm every expected rule fires, scan a clean fixture and confirm nothing fires, and scan a fixture with only a stock icon set and confirm the supporting gate stays closed. Keep generated reports out of commits.
