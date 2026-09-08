---
name: mobile-app-design
description: Design and implement native-feeling mobile screens and flows, especially Expo or React Native apps. Use for navigation, native controls, screen states, accessibility, performance, and simulator-verified mobile UI; not for image-only concepts or motion-only changes.
license: MIT
metadata:
  upstream: https://github.com/Appllama/appllama-skills
  reviewed-commit: dd5caaec3d5d50ad7fc0324da238119c6b7c3707
---

# Mobile app design

Build mobile interfaces that respect the project’s existing stack and feel native on their target platforms. Preserve working behavior and established product design before applying this guidance.

## Related-skill routing

- Use `imagegen-frontend-mobile` when the deliverable is images or visual concepts only.
- Use `animate-expo` when the task is specifically gesture, transition, haptic, or Reanimated implementation.
- Use `ui-quality-baseline` for shared accessibility, state, token, and rendered-QA requirements.
- Use this skill for end-to-end mobile screen and flow design or implementation. Load [references/appllama-research.md](references/appllama-research.md) only when the Appllama MCP is connected or the user provides Appllama screen references.

## Workflow

1. Inspect the repository, installed dependencies, navigation structure, design tokens, supported devices, and current screen behavior.
2. Choose the dominant platform contract: iOS, Android, or deliberately neutral cross-platform. Do not mix platform conventions accidentally.
3. Study relevant reference flows when available. Extract navigation grammar, hierarchy, control choices, spacing, and state behavior; do not copy a competitor’s pixels or branding.
4. Define the full state cycle: loading, empty, populated, validation, pending action, success, recoverable error, offline or reconnect when relevant, and disabled permissions.
5. Implement the smallest complete flow using the project’s existing primitives and state architecture.
6. Run the screen in an iOS Simulator or Android emulator, exercise the whole flow, inspect screenshots and motion, fix defects, then verify on a release build and the slowest supported real device when performance is in scope.

## Native fidelity

- Prefer native controls or faithful project wrappers for switches, sliders, segmented controls, menus, date or media pickers, sheets, share actions, and context menus.
- Use semantic platform colors and verify light and dark modes. Resolve semantic colors to plain values before passing them into animation code.
- Follow the platform type scale, allow text scaling, use tabular numerals for counts and prices, and make useful data selectable.
- Use one icon family appropriate to the platform. Emoji belongs in content, not interface chrome.
- Respect safe areas, the Dynamic Island, home indicator, gesture navigation, keyboard, and supported orientations. Never hard-code device inset values.
- Keep tap targets at least 44 pt on iOS and 48 dp on Android; extend the hit area when the visual control is smaller.
- Use the navigator’s native header and large-title behavior where it fits instead of rebuilding navigation chrome inside the screen.

## Navigation semantics

Decide what each destination is before choosing an API:

- **Push:** a deeper destination the user should return from.
- **Replace:** a completed one-way state such as finished onboarding or an authentication wall that must not reappear on Back.
- **Modal:** a self-contained task with its own Cancel or Done path.
- **Sheet:** a short interruption such as filters, options, or picking a value.
- **Overlay:** a focused confirmation, lightbox, or coach mark over a still-visible screen.
- **System controller:** sharing, web, photo picking, and other platform-owned tasks.

Tabs are peers. Each tab keeps its own stack; switching tabs does not imply depth. Deep links must land with a valid stack underneath. Block Back only for an irreversible request in flight or unsaved modal work, and explain the blocked state visibly.

## Design discipline

- Derive palette, materials, typography, and layout from the product or studied references, not default AI gradients, glass cards, or decorative sparkles.
- Keep one intentional accent system, one neutral family, and a documented radius scale unless the product already defines different rules.
- Use elevation only when it communicates hierarchy. Prefer spacing, dividers, and grouping over walls of nested cards.
- Use one label for one intent throughout a flow.
- Match skeleton geometry to the final content. Empty states explain how to add data; errors identify what failed and how to recover.
- Keep the primary action reachable without crowding the bottom safe area or keyboard.

## State and performance

- Keep server state in the project’s query or cache layer, durable client state in its established small store, and ephemeral interaction state local to the component.
- Reflect safe optimistic actions immediately, reconcile in the background, and roll back visibly on failure.
- Virtualize lists that can grow and use stable keys. Right-size images, cache them with the installed image library, and use placeholders only when they improve continuity.
- Avoid re-rendering React state on every gesture or scroll frame. Keep continuous animation on the UI runtime and delegate implementation detail to `animate-expo`.
- Measure cold start, list performance, and transitions before adding memoization or replacing project architecture.

## Motion

Use platform navigation motion by default. Frequent interactions such as scrolling, keyboard movement, tab changes, and Back should not receive ornamental animation. Press feedback should be immediate and subtle. Gestures must remain interruptible, preserve release velocity, respect Reduce Motion, and stay off the JavaScript thread.

For implementation recipes and exact Reanimated behavior, use `animate-expo` instead of duplicating those instructions here.

## Verification

Exercise the complete flow, not a successful screenshot:

- navigation forward and back, including one-way doors;
- tab state and deep links;
- modal and sheet presentation, cancellation, and dismissal;
- keyboard appearance and dismissal;
- loading, long content, empty, error, offline, and rapid-input states;
- light and dark themes;
- large text and screen-reader labels;
- interrupted gestures, fast taps, and scroll extremes;
- reduced motion and contrast;
- release-build frame rate on representative hardware when performance is claimed.

Static review and simulator screenshots do not prove real-device performance, haptics, store behavior, or production data integration. State those proof boundaries in the handoff.

## Provenance and adaptation

Adapted from [Appllama/appllama-skills](https://github.com/Appllama/appllama-skills) at commit `dd5caaec3d5d50ad7fc0324da238119c6b7c3707`.

The two upstream skills were consolidated into this one capability. Detailed Reanimated guidance was not copied because `animate-expo` already owns it; image generation remains in `imagegen-frontend-mobile`; shared UI checks remain in `ui-quality-baseline`. Appllama research is optional and progressively disclosed rather than a requirement for all mobile work.
