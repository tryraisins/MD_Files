# Loading, skeletons, overlays, and timing buffers

Choose feedback by what the user is waiting for:

### Layout-shaped content loading

- Use skeletons that match the final content's geometry, spacing, hierarchy, and radius. Random gray bars are not a content model.
- Preserve layout dimensions to prevent cumulative layout shift.
- Use the project's design-system skeleton first. In React projects without one, `react-loading-skeleton` is an acceptable lightweight option; a small tokenized CSS primitive is often sufficient.
- Keep shimmer quiet and directional. Under `prefers-reduced-motion`, use a static or gently fading placeholder.
- Do not show skeletons for destructive writes or short button actions; they imply content is arriving, not that a mutation is processing.

### Server-rendered and already-available content

- Never replace content the server already rendered with a skeleton when client JavaScript takes over. Swapping real text for placeholders and back costs the user the same content twice and reads as a regression, not a load.
- When data resolves inside the 120-200ms reveal delay, skip the placeholder and render the content. A skeleton that flashes for one frame is worse than the wait it covered.
- Reserve image geometry with `width` and `height` attributes or `aspect-ratio` before the file arrives, so revealing it causes no layout shift.
- Reveal an image as it decodes rather than gating the whole region on it, and put the fade behind the reduced-motion guard.
- Treat visible server-rendered content as final. A skeleton is for content that has not arrived, never for content the runtime has not hydrated yet.

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
