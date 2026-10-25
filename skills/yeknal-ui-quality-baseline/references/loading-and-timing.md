# Loading, skeletons, overlays, and timing buffers

Choose feedback by what the user is waiting for:

### Layout-shaped content loading

- Use skeletons that match the final content's geometry, spacing, hierarchy, and radius. Random gray bars are not a content model.
- Preserve layout dimensions to prevent cumulative layout shift.
- Use the project's design-system skeleton first. In React projects without one, `react-loading-skeleton` is an acceptable lightweight option; a small tokenized CSS primitive is often sufficient.
- Keep shimmer quiet and directional. Under `prefers-reduced-motion`, use a static or gently fading placeholder.
- Do not show skeletons for destructive writes or short button actions; they imply content is arriving, not that a mutation is processing.

### Action or process loading

- A pending button keeps its label or an equally clear status, retains its dimensions, sets `aria-busy`, prevents accidental duplicate submission, and remains understandable without animation.
- Reuse the project's existing progress primitive. `thinking-orbs` is appropriate only when the product tone and visible assistant/process workflow support it; it is not a universal replacement for every spinner and must not be forced into ordinary branded products.
- Use determinate progress when real progress exists. Never fabricate percentages, steps, elapsed time, or tool activity.
- Route progress libraries such as `nextjs-toploader` or NProgress are for actual navigation latency, not data fetching or arbitrary decoration.

### Blocking overlays

- Use a full-screen or modal overlay only when interaction must genuinely pause: session restoration, a consequential operation, or a transition that cannot safely continue in the background.
- Provide a readable status, `role="status"` for non-modal feedback or correct dialog semantics for modal feedback, focus containment when modal, and focus restoration afterward.
- Do not dismiss authentication or session-loading UI until signed-in or signed-out state is actually confirmed. Avoid flashes of the wrong screen.
- Do not trigger navigation overlays on pointer-down or touch-start; scrolling must never look like navigation.

### Timing buffers

- Tie visibility to the real promise, transition, or state machine. Never use a fixed timeout as proof that work completed.
- Immediate actions should acknowledge input at once. For page-level placeholders or overlays, a short 120-200ms reveal delay may prevent flashes when work finishes almost instantly.
- Once a substantial overlay is shown, an optional short minimum-visible window around 250-400ms can prevent flicker, but it must never delay interaction unnecessarily or outlive the real operation.
- Every loader needs a failure, retry, cancellation, or timeout path appropriate to the operation. Infinite unexplained loading is a bug.
