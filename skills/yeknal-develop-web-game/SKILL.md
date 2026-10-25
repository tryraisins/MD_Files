---
name: yeknal-develop-web-game
description: "Build or iterate on a web game (HTML/JS) with a reliable dev and test loop: small changes, a Playwright action script, screenshot and text-state inspection, and console errors. Use when the deliverable is a browser game."
metadata:
  internal: true
---


# Develop Web Game

Build games in small steps and validate every change. Treat each iteration as: implement → act → pause → observe → adjust.

## Skill paths

Both files ship with this skill, relative to the skill folder:

- `scripts/web_game_playwright_client.js` — the Playwright action loop.
- `references/action_payloads.json` — example action payloads.

Run the client from the project you are testing, passing the absolute or relative path to the script.

## Workflow

1. **Pick a goal.** Define one feature or behavior to implement.
2. **Implement small.** Make the smallest change that moves the game forward.
3. **Ensure integration points.** Provide one canvas and `window.render_game_to_text` so the test loop can read state.
4. **Add `window.advanceTime(ms)`.** Strongly prefer a deterministic step hook so the Playwright script can advance frames reliably; without it, automated tests can be flaky.
5. **Initialize progress.md.** See [Progress Tracking](#progress-tracking): read an existing file first and keep its original prompt, or create it with `Original prompt: <prompt>` at the top.
6. **Verify Playwright availability.** Make sure `playwright` is available (local dependency or global install). If unsure, check `npx` first.
7. **Run the Playwright test script.** Run `scripts/web_game_playwright_client.js` after every meaningful change; do not invent a new client unless required.
8. **Use the payload reference.** Base actions on `references/action_payloads.json` to avoid guessing keys.
9. **Inspect state.** Capture screenshots and text state after each burst.
10. **Inspect screenshots.** Open the latest screenshot, verify the expected visuals, fix any issues, and rerun the script. Repeat until correct.
11. **Verify controls and state (multi-step focus).** Exercise every important interaction exhaustively. For each one, think through the full multi-step sequence it implies (cause → intermediate states → outcome) and verify the entire chain end-to-end. Confirm `render_game_to_text` reflects the same state shown on screen. If anything is off, fix it and rerun.
    Examples of important interactions: move, jump, shoot/attack, interact/use, select/confirm/cancel in menus, pause/resume, restart, and any special abilities or puzzle actions defined by the request. Multi-step examples: shooting an enemy should reduce its health; when health reaches 0 it should disappear and update the score; collecting a key should unlock a door and allow level progression.
12. **Check errors.** Review console errors and fix the first new issue before continuing.
13. **Reset between scenarios.** Avoid cross-test state when validating distinct features.
14. **Iterate with small deltas.** Change one variable at a time (frames, inputs, timing, positions), then repeat steps 7–13 until stable.

Example command (actions required):
```
node scripts/web_game_playwright_client.js --url http://localhost:5173 --actions-file references/action_payloads.json --click-selector "#start-btn" --iterations 3 --pause-ms 250
```

Example actions (inline JSON):
```json
{
  "steps": [
    { "buttons": ["left_mouse_button"], "frames": 2, "mouse_x": 120, "mouse_y": 80 },
    { "buttons": [], "frames": 6 },
    { "buttons": ["right"], "frames": 8 },
    { "buttons": ["space"], "frames": 4 }
  ]
}
```

## Test Checklist

Test every new feature the request adds and every area your logic changes could affect. Identify issues, fix them, and re-run the tests to confirm they are resolved.

Examples of things to test:
- Primary movement/interaction inputs (e.g., move, jump, shoot, confirm/select).
- Win/lose or success/fail transitions.
- Score/health/resource changes.
- Boundary conditions (collisions, walls, screen edges).
- Menu/pause/start flow if present.
- Any special actions tied to the request (powerups, combos, abilities, puzzles, timers).

## Test Artifacts to Review

- Latest screenshots from the Playwright run.
- Latest `render_game_to_text` JSON output.
- Console error logs (fix the first new error before continuing).

Open the latest screenshots and inspect them visually, not just generate them, and capture gameplay rather than the start screen. Treat a missing element as missing in the build. If a headless/WebGL capture looks wrong, rerun in headed mode. Fix and rerun until the screenshots and text state are correct.

## Core Game Guidelines

### Canvas + Layout
- Prefer a single canvas centered in the window.

### Visuals
- Keep on-screen text minimal; show controls on a start/menu screen rather than overlaying them during play.
- Avoid overly dark scenes unless the design calls for it. Make key elements easy to see.
- Draw the background on the canvas itself instead of relying on CSS backgrounds.

### Text State Output (render_game_to_text)
Expose a `window.render_game_to_text` function that returns a concise JSON string representing the current game state. The text should include enough information to play the game without visuals.

Minimal pattern:
```js
function renderGameToText() {
  const payload = {
    mode: state.mode,
    player: { x: state.player.x, y: state.player.y, r: state.player.r },
    entities: state.entities.map((e) => ({ x: e.x, y: e.y, r: e.r })),
    score: state.score,
  };
  return JSON.stringify(payload);
}
window.render_game_to_text = renderGameToText;
```

Keep the payload succinct and biased toward on-screen/interactive elements. Prefer current, visible entities over full history.
Include a clear coordinate system note (origin and axis directions), and encode all player-relevant state: player position/velocity, active obstacles/enemies, collectibles, timers/cooldowns, score, and any mode/state flags needed to make correct decisions. Avoid large histories; only include what's currently relevant and visible.

### Time Stepping Hook
Provide a deterministic time-stepping hook so the Playwright client can advance the game in controlled increments. Expose `window.advanceTime(ms)` (or a thin wrapper that forwards to your game update loop) and have the game loop use it when present.
The Playwright test script uses this hook to step frames deterministically during automated testing.

Minimal pattern:
```js
window.advanceTime = (ms) => {
  const steps = Math.max(1, Math.round(ms / (1000 / 60)));
  for (let i = 0; i < steps; i++) update(1 / 60);
  render();
};
```

### Fullscreen Toggle
- Use a single key (prefer `f`) to toggle fullscreen on/off.
- Allow `Esc` to exit fullscreen.
- When fullscreen toggles, resize the canvas/rendering so visuals and input mapping stay correct.

## Progress Tracking

Create a `progress.md` file if it doesn't exist, and append TODOs, notes, gotchas, and loose ends as you go so another agent can pick up seamlessly.
If it already exists, read it first, including the original user prompt at the top. Do not overwrite the original prompt; preserve it.
Update `progress.md` after each meaningful chunk of work (feature added, bug found, test run, or decision made), and leave TODOs and suggestions for the next agent at the end.

## Playwright Prerequisites

- Prefer a local `playwright` dependency if the project already has it.
- If unsure whether Playwright is available, check for `npx` (`npx --version`).
- If `npx` is missing, install Node/npm and then install Playwright globally (`npm install -g @playwright/mcp@latest`).
- Do not switch to `@playwright/test` unless explicitly asked; stick to the client script.

## Scripts and references

- `scripts/web_game_playwright_client.js` — Playwright-based action loop with virtual-time stepping, screenshot capture, and console error buffering. Pass an action burst via `--actions-file`, `--actions-json`, or `--click`.
- `references/action_payloads.json` — example action payloads (keyboard + mouse, per-frame capture). Use these to build your burst.
- `assets/` — the small SVG and PNG used by the example page.
