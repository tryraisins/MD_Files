# Design eval harness

Measures whether this catalog's design skills actually improve output. Every other check in `tools/` proves the catalog is well-formed; this one is the only place that asks whether the skills make a page better.

Adapted from the [Hallmark](https://github.com/nutlope/hallmark) eval design (MIT) and its blind-critic principle: anyone who knows what a page is meant to do scores the intent instead of the screen.

## What it measures

Two different things, deliberately kept apart:

- **Conformance** — deterministic, checkable from the page and its source. Did the skill load, did the build succeed, is there horizontal overflow, are console errors clean, does the DOM contain the states the brief demanded.
- **Quality** — a blind judgement against the rubric in [rubric.md](rubric.md), made by a fresh agent that sees only screenshots and measurements, never the source or the brief's intent beyond what a visitor would know.

Conformance is cheap and honest. Quality is expensive and honest only if the judge is blind. Do not merge them into one number.

## Running it

```bash
node tools/design-eval/capture.mjs --url http://localhost:3000 --out runs/b1-claude
```

Requirements:

- Node 20 or newer.
- [Playwright](https://playwright.dev) available for capture (`npm i -D playwright` in the project being tested, or globally). The harness refuses to fake a capture when it is missing.

The capture writes a run folder:

```
runs/<brief>-<arm>/
  manifest.json      viewports, measurements, console, build info
  shots/
    390.png
    390-reduced.png
    768.png
    1440.png
    1440-reduced.png
```

## Scoring

1. Capture a run for each arm you are comparing (for example `--arm control` with no skill, `--arm catalog` with the skill loaded).
2. Hand the run folder to a **fresh agent** with [judge-prompt.md](judge-prompt.md). It must not see the source, the brief, or this README.
3. Feed its JSON back:

```bash
node tools/design-eval/score.mjs --judge runs/b1-catalog/judgement.json --manifest runs/b1-catalog/manifest.json --out runs/b1-catalog/scorecard.md
```

The scorecard separates conformance failures (binary) from quality scores (1–5 per dimension), and states what could not be verified.

## Rules that keep it honest

- **Same brief, same model, one variable.** Change one thing between arms: the skill loaded, or the rule added. Changing the model and the skill together measures nothing.
- **Small and repeated beats large and once.** Eight briefs run twice is worth more than one brief run forty times.
- **Never let the judge see the code.** A judge that reads the source scores the implementation's intentions.
- **Record the cheap checks even when the score is good.** Overflow and console errors are the defects that survive a beautiful screenshot.
- **Report what did not run.** A capture that silently failed is worse than no capture.

## What this harness cannot do

- It cannot tell you whether a page converts, is accessible in practice, or survives a screen reader. Those need real users and real assistive technology.
- It cannot score taste reliably. It can detect defects and rank differences; it cannot prove a direction is good.
- It cannot replace a human look at the rendered page. It exists so that look starts from evidence instead of from memory.
