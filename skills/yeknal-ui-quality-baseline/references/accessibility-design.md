# Accessibility Design Checks

Use the sections that fit the affected UI. This reference supplies detail for the shared baseline; the UX designer skill owns participant research and design handoff. Follow the declared conformance target and platform requirements, and distinguish standards from the catalog's usability policies. Specialist targets such as TV, kiosks, vehicles, or XR require their own current platform guidance and testing context.

## Text, reflow, and system preferences

- Assess letter and number differentiation, stroke weight, reading width, and spacing with actual content at the intended size. Avoid treating a particular font family, x-height percentage, or word count as universally accessible. Match alignment and spacing to the language and script.
- Check text resizing to 200% without losing content or function. Separately check reflow at an effective width of 320 CSS pixels, such as 400% browser zoom from 1280px. Necessary two-dimensional regions may scroll, but surrounding content must still reflow.
- Apply user overrides together: line height 1.5 times font size, paragraph spacing 2 times font size, letter spacing 0.12 times font size, and word spacing 0.16 times font size. These are override-tolerance checks, not mandatory authored defaults. Apply the properties supported by the language/script, and inspect clipped controls, overlap, and access to truncated content.
- Check supported large/bold text settings and high-contrast or forced-color modes. Keep focus and semantic states perceivable when colors or background images change; do not assume a colorblindness simulation proves usability.

Sources: [Resize Text](https://www.w3.org/WAI/WCAG22/Understanding/resize-text.html), [Reflow](https://www.w3.org/WAI/WCAG22/Understanding/reflow.html), and [Text Spacing](https://www.w3.org/WAI/WCAG22/Understanding/text-spacing.html).

## Inputs, focus, and forms

- Preserve landmarks and heading hierarchy for screen-reader navigation. Reading order covers all content; sequential keyboard focus normally visits interactive elements. Provide a way to bypass repeated navigation, and keep focus from being obscured by fixed UI.
- Match accessible names to visible labels for voice control. Custom drag, swipe, multipoint, or path-based actions need a discoverable equivalent using a simple pointer action unless essential; keyboard support alone is insufficient for a touchscreen user. Native browser scrolling does not require an extra custom alternative.
- The baseline's 44 by 44 CSS pixel touch policy is deliberately stronger than WCAG 2.2 AA's 24 by 24 minimum, which has spacing and other exceptions. Keep native platform units distinct from CSS pixels.
- Specify focus on entry and return for dialogs and other context changes. A modal contains focus and blocks background interaction; a non-modal surface must not automatically inherit that behavior. The area equivalent to a 2 CSS pixel perimeter in Focus Appearance belongs to AAA; visible, sufficiently contrasted, unobscured focus remains relevant at AA.
- Keep labels visible and associated with fields; placeholders alone cannot provide the label. Associate help and errors with the field, indicate requirements in text, and use autocomplete/input-purpose semantics where applicable. Follow the established form pattern for an error summary and focus after failed submission; never announce every keystroke as an error.
- For task time limits, specify the warning, adjustment or extension, and recovery behavior according to the requirement and applicable exceptions. Follow the baseline's existing submission and draft-preservation rules.

Sources: [Dragging Movements](https://www.w3.org/WAI/WCAG22/Understanding/dragging-movements.html), [Pointer Gestures](https://www.w3.org/WAI/WCAG22/Understanding/pointer-gestures.html), [Label in Name](https://www.w3.org/WAI/WCAG22/Understanding/label-in-name.html), [Target Size](https://www.w3.org/WAI/WCAG22/Understanding/target-size-minimum.html), [Focus Appearance](https://www.w3.org/WAI/WCAG22/Understanding/focus-appearance.html), and [Timing Adjustable](https://www.w3.org/WAI/WCAG22/Understanding/timing-adjustable.html).

## Images, charts, and media

- Describe an informative image's relevant meaning, and a functional image's action or destination. Decorative images use empty alternatives. Avoid redundant descriptions when the same information is already available nearby.
- Complex charts need a useful summary and access to relevant values, relationships, or a longer description. Use labels, patterns, or other cues alongside color. Keep essential text as actual text where possible.
- When users publish images through the product, include an appropriate way to supply and edit descriptions. Review AI-generated descriptions before treating them as accurate content.
- Captions convey dialogue and meaningful non-speech audio. Specify readable presentation and controls that are discoverable, keyboard accessible, and usable over the media.
- Select media alternatives according to the content and target: prerecorded audio-only needs a text alternative at A; prerecorded synchronized media generally needs captions at A and audio description at AA when important visual information is not conveyed in the audio. A text alternative covering visual and audio information can satisfy the A media-alternative criterion, but does not replace required AA audio description. Honor the criteria's exceptions, including media that is a clearly labeled alternative for text; a dialogue transcript alone does not describe unseen visual information.
- Avoid unsolicited audio. Where automatic motion or updates require user controls, expose pause, stop, hide, or update-frequency controls as applicable. Choose a meaningful poster or settled composition for disabled motion, rather than assuming the first video frame contains the content.

Sources: [WAI Images Tutorial](https://www.w3.org/WAI/tutorials/images/), [Making Audio and Video Media Accessible](https://www.w3.org/WAI/media/av/), [Pause, Stop, Hide](https://www.w3.org/WAI/WCAG22/Understanding/pause-stop-hide.html), and [Reduced-motion media feature](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/At-rules/@media/prefers-reduced-motion).

## Dynamic feedback and announcements

- Define what changed, whether it needs an announcement, and its urgency. Routine results normally use non-interrupting status feedback; reserve urgent announcements for situations that warrant interruption. Routine updates must not move keyboard focus.
- Batch or summarize frequent changes rather than reading every update. Preserve the user's place while content refreshes. Choose immediate filters or an explicit Apply action according to update cost, stability, and user control; neither pattern is universally required.
- If a notification disappears, leave a discoverable way to recover information or act when needed. A timer and close button alone do not establish that users have enough time.

Source: [Status Messages](https://www.w3.org/WAI/WCAG22/Understanding/status-messages.html).

## Verify the affected journey

Choose combinations relevant to the platform and intended users instead of requiring every assistive tool for every edit. Exercise the real entry, action, feedback, failure, and recovery path:

| Applicable condition | Check in the running interface |
| --- | --- |
| Keyboard | Complete the task, bypass repeated UI, see focus, and return from overlays without a trap. |
| Screen reader | Navigate headings/landmarks, identify controls and values, activate actions, and understand results and errors. |
| Enlarged or spaced text | Apply the text checks above; retain full content and operable controls. |
| High contrast or forced colors | Identify focus, selected states, controls, and meaningful graphics. |
| Reduced motion or paused media | Reach essential content and actions without waiting for an effect or automatic advance. |
| Touch, voice, or alternative input | Reach custom gesture functions through the relevant equivalent controls. |

Record the tool/browser/device combination, task, result, and unresolved barrier using the project's existing verification artifact. Automated scans help find defects; passing scans or a proxy simulation do not prove conformance or replace observed use by disabled participants. Report unavailable checks explicitly.
