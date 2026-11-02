# Notification surfaces

Load this when a design needs transient feedback: a save confirmation, a background sync result, an undo window, or a failed action. It extends the toasts entry in [component patterns](component-patterns.md) and covers the single-island variant, where the whole notification area is one element that morphs between states instead of a stack.

`notch-toast` is the reference implementation of the single-island variant: a React package that renders an edge-attached or floating panel, animates between loader, success, and error states, and replaces the visible panel on each new trigger. See [its documentation](https://notch.devsethi.me/docs) for the current API. Keep the selection and override rules here even if the package changes.

## Choose the surface before the library

Work down this order and stop at the first one that fits. Do not start from a library.

1. **Inline, where the change happened.** The default for confirmations, validation, and anything with a recovery action. It survives scrolling, it is associated with the control, and it does not disappear.
2. **The project's existing toast primitive.** If the project already ships Sonner, a shadcn toaster, or a design-system snackbar, use it. Do not introduce a second notification system for a visual preference.
3. **A single-island surface.** Only when the whole criteria set below holds.

A toast earns its place when feedback has no home on screen. It is not a place for errors that need a decision, and it is not a log.

## When the single-island variant genuinely fits

All of these must be true:

- **Events are sparse.** Roughly one notification at a time, and a new one makes the previous one obsolete.
- **Nothing concurrent is lost.** The user cannot miss a second, independent message that arrived while the first was visible.
- **Nothing consequential rides on it.** No approval, no payment outcome, no destructive undo that must remain available.
- **The interface already has a device-like material language.** Edge-attached or floating panels matching the product's surfaces, not a decorative island dropped onto an editorial page.
- **The motion is worth its weight.** The morph is the product's feedback model, not an animation added because the library demos well.

If a project needs a queue, an inbox, or a persistent action, that is a panel, a banner, or a list, not a larger toast.

## The replacement rule

A single island is latest-wins: a new trigger replaces the visible panel. That is the defining behavior and the most common defect.

- Never let the island be the only record of an unresolved failure, an unsaved state, or an available undo. If the user must be able to act on it later, it belongs inline or in a durable surface.
- Do not fire a routine confirmation over an error the user has not acknowledged. Sequence them, or suppress the routine one.
- A dismissed or replaced error must leave the affected control in a state that still shows the failure.
- Updating a panel in place by stable `id` is the correct way to morph loading into a result. Creating a second panel for the same job is not.

## Overrides that are not optional

Library defaults are chosen to demo well, not to satisfy the quality contract. Set these explicitly.

- **Duration.** `notch-toast` dismisses default, success, and info panels after 3.6 seconds. That is below the five-second floor for anything a user must read. Raise it, and use `duration: 0` for anything carrying an action or undo.
- **Dismissibility.** Default, success, and info panels are not dismissible by default, so there is no close control and Escape does nothing. Set `dismissible: true` whenever the panel is not purely decorative, contains an action, or stays longer than a few seconds.
- **Actions.** A panel with a button must stay until it is used or dismissed. Pair `duration: 0` with `dismissible: true` so keyboard users have a path out.
- **Errors.** Warning and error panels are persistent and dismissible by default, which is correct for a noncritical failure whose outcome is also recoverable elsewhere. An error that requires a decision stays inline next to the control, with a recovery action, regardless of what the toast can render.
- **Pause on hover and focus.** Verify it in the integration. If the implementation cannot pause while the pointer or keyboard focus is inside the panel, choose a different primitive rather than shipping a panel that disappears under a reading user.

"Stack at most three" remains a ceiling, not a target. A single island satisfies it.

## Verify in the running product, not from the README

Package accessibility claims are a starting assumption.

- Confirm the announcement: routine success is polite, failure that changes what the user must do is assertive, and updates to the same panel are not announced repeatedly.
- Confirm focus is not stolen on arrival, and that focus returns sensibly after dismissal.
- Confirm keyboard access to the action and the close control, and that Escape dismisses when `dismissible` is on and does nothing when it is off.
- Confirm `prefers-reduced-motion` keeps a static or opacity-only presentation with all text and controls intact.
- Confirm the panel's position does not cover the primary action, a modal's controls, or a mobile keyboard at common viewport heights, including bottom-attached mode on a short screen.

## Integration

- Mount one toaster per app, in the root layout or provider, and trigger from client components.
- Prefer the shadcn registry wrapper so the API lives in the project's own source tree: `npx shadcn@latest add https://notch.devsethi.me/r/notch-toaster.json`, then import from `@/components/ui/notch-toaster`. It installs `notch-toast` and `motion`.
- Adapt the wrapper to the product's tokens: radius, surface color, border, shadow, offset, and type must match the design system rather than the library's demo styling.
- Keep the motion preset quiet unless the visual thesis earns otherwise. `fluid` is the balanced default; `gooey` needs a playful, expressive product to justify it, and reduced motion must be honored automatically.
- Do not add this package to a project that already has a working toast system without an explicit migration decision, and never run two systems side by side.
- A failed save, a rejected form, or an offline submission still follows the form and network rules in the main contract: keep the entered values and say clearly that the action did not complete.
