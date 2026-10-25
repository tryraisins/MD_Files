---
name: yeknal-verification-harness
description: Generate a project-local verification harness that starts a real app, drives a feature like a user, and captures proof. Use only when explicitly asked to build one for a repository with no scripted way to prove behavior.
metadata:
  source: https://github.com/cursor/plugins
  source-commit: 4ec7ffa173eaa70d3d9467a627baf0954645a353
---

# Verification harness

A project needs one scripted way to drive the real app and prove behavior: start it, exercise a feature the way a user would, capture the evidence, tear it down. This skill writes that as a project-local skill tailored to the repository. You write the output for the next agent, not for a human. It will be read cold, mid-task, by an agent that has never seen the app.

Read `yeknal-testing-strategy` first. That skill sets the verification policy: end-to-end only, a repeatable artifact, and an honest report of anything unreachable. This skill builds the mechanism that policy needs.

## Related-skill routing

- Use `yeknal-testing-strategy` for what counts as proof and when to refuse an isolated test.
- Use `yeknal-playwright` when the browser driver itself needs configuring.
- Use `yeknal-troubleshoot` when the harness exposes a failure that needs a root cause.
- Read [references/upkeep.md](references/upkeep.md) for the upkeep loop once the harness exists.
- Use `yeknal-project-handoff` when the map should also carry session context.

## 1. Interview the repo, not the user

Answer these from the codebase. Ask the user only what cannot be observed:

- **Surface:** what does a user actually touch? A web UI, a CLI or TUI, a desktop app, an API, a mobile app, a library? A repo can have several. Pick the primary one and note the rest.
- **Run:** how does the app start locally? Prefer the repository's own documented dev command (package scripts, Makefile, README quickstart). Record ports, env vars, seed data, and auth.
- **Drive:** how can an agent interact with it programmatically? Existing harnesses first: Playwright or Cypress specs, expect scripts, PTY helpers, curl-able endpoints, a debug port. Only then choose a generic recipe: browser or CDP for web and Electron, a tmux or PTY harness for CLI and TUI, plain HTTP for services.
- **Observe:** what evidence can be captured? Screenshots, terminal transcripts, response bodies, logs, exit codes, database state.
- **Isolate:** can two instances run side by side (ports, data dirs, profiles)? If not, say so in the generated skill. Refusing to double-drive a shared instance beats corrupting the user's session.

If the checkout does not build or start as-is, fix that first or report it precisely before generating. A skill written against a broken base teaches wrong steps. When an irrelevant missing asset blocks startup (a static directory the API never serves, a sample config), the generated skill may create it, clearly marked as verification scaffolding, and remove it in cleanup.

## 2. Choose where the skill lives

Write the generated skill where this project's agents already look for project skills: an existing project skill directory such as `.agents/skills/`, `.claude/skills/`, `.cursor/skills/`, or the harness's documented equivalent. When none exists, create `.agents/skills/verify-<app>/`, the shared standard most harnesses scan from the working directory up to the repository root.

Keep the generated frontmatter to `name` and `description` unless the target harness documents additional fields. `name` must equal the directory (`verify-<app>`). Without frontmatter the skill never registers.

## 3. Generate the skill

Write `SKILL.md` with these sections, each grounded in what the interview actually found. Leave no placeholders.

- **Launch:** the exact command that starts the app for verification, and how to tell it is ready (a log line, a prompt). Launch must reach a usable state from an empty data directory, including migrations and seed data. Ready means usable, not that a process answers: a database health check can pass while its init scripts are still running. Include teardown. For a short-lived CLI or TUI there is no server to keep alive, so launch means build the binary or install dependencies once, then start each drive in its own isolated PTY or tmux session.
- **Doctor:** one read-only check that answers "is this instance worth driving?" Process up, right version or build, port owned by us, auth valid. An agent runs it first whenever anything looks off.
- **Drive:** the harness recipe with this repository's real selectors and commands, not examples. Prefer stable handles (ARIA labels, data attributes, prompt strings, route paths) over coordinates and tab order.
- **Evidence:** what to capture for a proof and where it goes. State the proof standards: exercise the real user path rather than internal setters or test-only endpoints; capture the action and the resulting state, not only the final screen; verify side effects (files written, rows inserted, messages sent) alongside what is visible. Do not mock. When an external boundary cannot be driven, name it as unreachable and capture the strongest real evidence instead. When the safe path is a dry-run or test mode, verify what it actually skips by observing files, network, and git refs instead of trusting its name. Some dry-runs still touch the network or open a browser.
- **Cleanup:** how to tear down instances this run created. Never kill by process name; kill what you started. Cleanup removes instances and scratch state, never the evidence. Proof artifacts survive teardown, in a location the skill names.
- **Helpers:** every script the skill ships is executable and its invocation appears in the skill body. A helper the reader has to reverse-engineer is not a helper.

## 4. Seed the feature map

Create `features/README.md` plus one file per user-facing feature, aiming for the top three to five from routes, commands, menus, or docs. Follow the shape in [`references/feature-map-example/`](references/feature-map-example/README.md): an index README and one file per feature.

Each feature file answers, from the user's point of view: what the feature is, how to reach it, how to drive it with the harness, and what observable end state proves it works. Use exactly these four H2s, in this order:

1. `Sub-features`
2. `How to get to it (user POV)`
3. `Driving it with <harness>`
4. `Gotchas`

If the seed data lacks a precondition that a journey needs, the journey reports a failure and the reason goes in that feature's `Gotchas`. Never weaken the journey to make it pass. The map is the repository's maintained verification source, so a proof that drives one convenient entry point is incomplete when the map lists others.

## 5. Prove the generated skill before handing it over

Run its own instructions end to end once: launch, doctor, drive one mapped feature, capture evidence, clean up. One feature is enough, because the map exists so later runs can cover the rest.

After cleanup, confirm the evidence still exists at the named location. A cleanup that eats the proof fails this step. Fix what fails, and run the generated cleanup after every failed iteration too, so broken attempts do not strand processes and ports. A generated skill that was never executed is a draft, not a deliverable.

If you proved it in a stand-in for the real target (a container in place of a fresh VM, a local stack in place of a remote one), list every setup step the stand-in performed that the target will not. Those steps stay unverified until a run on the real target covers them.

## 6. Hand off

Tell the user where the skill lives, which surface it drives, the command that launches and checks the app, where proof artifacts land, and which features are mapped. Point them at [references/upkeep.md](references/upkeep.md) for keeping the map honest as the app changes. Suggest a cadence only if they ask.
