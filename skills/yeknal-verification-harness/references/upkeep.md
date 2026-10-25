# Harness upkeep

A feature map rots the moment the app changes. This is the upkeep loop for a verification skill written by `yeknal-verification-harness`, or for any project-local verification skill that carries a feature map. The unit of rigor is the feature, not every sentence: cover every feature file from source and exercise every feature live, without terminalising every bullet.

Adapted from the Cursor plugins verification-audit skill at commit `4ec7ffa173eaa70d3d9467a627baf0954645a353` (MIT). Licence: [../LICENSE.txt](../LICENSE.txt).

## When to run it

Use it when the user explicitly asks to audit, refresh, or maintain a verify skill or its feature map. No verification skill exists yet, or the harness is missing sections: go back to `SKILL.md` and generate one. What counts as proof: `yeknal-testing-strategy`. A live failure that needs a root cause rather than a map correction: `yeknal-troubleshoot`.

## Outcomes

Pick one and say which:

- **clean:** every feature got source and live coverage; nothing worth shipping. No branch, no pull request.
- **changed:** one pull request ships proven documentation, harness, or map corrections.
- **blocked:** coverage could not finish, or a proven fix could not ship safely. Say exactly what blocked it.

## Edit scope

Edit only the verification skill's own directory: its `SKILL.md`, `features/`, and any harness scripts it owns. Never edit product code during a run. A behaviour the map describes that the app no longer does is either documentation drift (fix the map) or a product regression (report it, do not paper over it in the docs).

## Pass

0. **Locate the target.** Find the project-local skill whose body has launch and drive sections plus a feature map. Several candidates: ask which one. None: stop and point at `SKILL.md` instead of inventing a target.

1. **Index hygiene.** Read the feature map README and glob its sibling files. Fix missing, extra, duplicate, or dead entries. This is lightweight; do not generate an inventory.

2. **Source wave.** Launch one read-only subagent per feature file, concurrently. Each explains how that user-facing feature works from source, flags likely documentation drift with citations, and returns one concise live-verification recipe. Children never drive the app and never edit files. Return shape: feature summary, source entry points, likely drift or none, one recipe.

3. **Reconcile.** Confirm every feature file has a returned summary. Merge overlapping recipes into as few app states as practical. Spot-check the drift that was cited; do not re-prove clean claims. Sweep recent churn for user-facing surfaces missing from the map, and require a concrete source path before calling one missing.

4. **Live pass.** Required even when source looks clean. The coordinator owns all driving and follows the verification skill's own launch model: one long-lived instance driven serially for servers and UIs, or a fresh isolated session per drive for short-lived CLIs. The skill's Launch section decides, not this one. Exercise every feature at least once, and hold three invariants for the whole pass, whatever goes wrong:
   - Never drive an instance that has not been health-checked since it last did something surprising. Doctor before the first drive, doctor on each fresh session where sessions are the unit, and doctor again after any failed drive. Where doctor cannot see the failure (a wedged UI on a healthy process), reset to a known state or relaunch instead of hoping.
   - Evidence captured so far survives every cleanup. Check it at its named location rather than assuming.
   - Nothing a drive started outlives that drive's usefulness. Clean failed-iteration residue whether the session is stuck, exited, or shared. For a shared instance, clean the residue, not the instance.

   A doctor failure caused by skill drift is drift: fix it under edit scope and retry once, restarting only what the fix invalidated, before calling the pass `blocked`. A feature that cannot be reached is `verified-unreachable` only with the concrete prerequisite (auth, entitlement, OS, external state) and the route attempted. If the map omits that prerequisite, that is drift. Re-drive any harness fix from triage before it ships. Final teardown happens after the last drive of the run, including those re-proofs, so nothing outlives the run. Evidence stays, per the skill.

5. **Triage.** Wrong or missing user-point-of-view description is documentation drift: fix it. Working behaviour the harness cannot drive is a harness gap: fix it, following the same helper rule as generation (scripts executable, invocation documented in the skill body). App behaviour that is actually broken is a product gap: record it for the user and keep it out of this change.

6. **Ship or stop.** For `changed`, open one pull request of proven corrections and re-read every changed file first. For `clean` or `blocked`, open nothing and report the outcome and the coverage honestly.

Keep concise run notes in a scratch location: features covered, unreachable prerequisites, confirmed drift, and the outcome. Do not commit them.
