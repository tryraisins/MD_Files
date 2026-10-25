# Component patterns

Load this when building or repairing a specific surface. Each entry states the job of the pattern, its characteristic failure, and the rules that follow. These are defaults: an explicit brief or an established product convention wins.

The universal floor still applies everywhere: visible focus, keyboard operation, labeled controls, 44px targets on touch, reduced-motion branches, and content that survives zoom and translation.

## Navigation

**Job:** make the product's structure predictable and reachable in one action.

**Failure:** the nav is designed as a row of links rather than as a model of the information architecture, so it either spreads too shallow or hides depth behind overflow.

- Choose the model from the structure: a short stable set stays visible; nested families collapse into groups; broad taxonomies need search; tool-heavy products earn a sidebar.
- Label items for their contents ("Progress", "Library"), not vague umbrellas ("Home", "Dashboard"). Specificity is what makes navigation predictable.
- One active item at a time, visually and in `aria-current`. An active state that does not match the current route is a bug.
- Navigation does not animate on high-frequency use. Tab switches and route changes in a working surface are instant or near-instant.

### Sidebar and nav density

Each rule names the property to set, because a rule that describes a relationship rather than a declaration gets applied at the implementer's discretion. Measured on two controlled builds: rules that named a property and a value landed exactly; rules phrased as a relationship ("inset from the edge") were ignored by both.

| CSS | Value | Why |
| --- | --- | --- |
| `nav` row `height` | 32px | Below 30px the target is hard to hit; above 34px a dense sidebar loses its rhythm |
| Row `border-radius` | 12px | A row with a control-sized radius does not read as a selectable band |
| Row `padding-inline` on the selected state, with the container padding at 0 | 8px | The selection stops 8px before the panel edge. Padding the *row* is what produces the inset; margin on the row also works but must total 8px |
| Nav icon `width` and `height` | 18px | At 22px the icon out-shouts a 14px label |
| Icon-to-label `gap` | 10px | At 4px the pair reads as one shape |
| Group `margin-block` between groups | 20px | At 2px the groups read as one long list |
| Panel `border-radius` | 12px | A large panel with a 4px radius reads as an unstyled box |

- Selection is a full-width row with a radius matching the row, not a colored underline or a dot that duplicates the icon.
- Collapsed state is a real state, not an afterthought: tooltips for labels, preserved active state, and a transition that does not fight the pointer.

These seven values are checkable without judgement. `tools/design-eval/conformance.mjs` ships probes for row height, row radius, icon width, label size, group gap and selection inset.

## Footer

**Job:** hold the durable, low-frequency links and the legal and contact surface.

- Group by intent (product, resources, company, legal). Cap it at four groups.
- Never make the footer the only path to something required: contact, status, terms, or a primary destination.
- A footer is not a place to repeat the navigation that already exists above.
- Keep the height proportional to its content. A tall decorative footer on a short page pushes content and looks accidental.

## Error pages

**Job:** recovery. A 404 has exactly one job, and it is not entertainment.

- Say plainly what happened, in one line, without a joke replacing the message.
- Offer the three real exits: search, home, and the destinations people actually want (products, docs, status).
- Keep the site header and footer so the visitor is not stranded on a dead end.
- Return a real HTTP 404 status. A "soft 404" that returns 200 is a defect for crawlers and for anyone monitoring errors.
- A creative error page is allowed. It must load fast, must not autoplay media, must not hijack scroll, and must not delay the exits.

## Carousel

**Job:** show a set of peers when horizontal comparison matters more than seeing everything at once.

- Do not use a carousel for primary content, for anything a visitor must read, or to hide content the page is under pressure to fit. Content inside a carousel is measurably less likely to be seen.
- No autoplay without a visible pause control that persists. Respect `prefers-reduced-motion` by not starting it at all.
- Show position: dots are weak, a counter ("3 of 8") or a visible next item is honest. Dots beyond about seven carry no information.
- Keyboard operable: arrow keys move slides, focus moves with them, and off-screen slides are not focusable.
- Prefer native `scroll-snap` with `touch-action` set per axis over a hand-rolled gesture. A hand-rolled spring must handle rapid input without queueing.
- Announce slide changes only when the change is user-initiated.

## Empty states

**Job:** explain why the surface is empty and what to do next.

- Distinguish three cases: genuinely empty, empty because of filters, and failed to load. They need different copy and different actions.
- One primary action, not a menu of options. If there is nothing the user can do, say so and offer the nearest useful escape.
- Do not use illustration as a substitute for the explanation.
- Never show a decorative empty state while data is still loading; that is a loading state, and it must resolve or report failure.

## Toasts and inline feedback

**Job:** confirm an action that had no visible result on screen.

- Confirmations are inline and contextual where the change happened; toasts are for things with no home on screen.
- Toasts are not a place for errors that need a decision. Those belong inline, next to the control, with a recovery action.
- Auto-dismiss only non-critical confirmations, give at least five seconds, pause on hover or focus, and never dismiss something the user must read.
- Stack at most three. A stack that grows without bound hides the interface and is a runaway bug.
- Announce with appropriate urgency: `polite` for routine success, `assertive` sparingly and only for failure that changes what the user must do.

## Modals, drawers, and sheets

**Job:** interrupt for a decision or a task that genuinely should not share the screen.

- A modal is a claim that the task must interrupt. If the user can reasonably continue behind it, it should be a drawer, a popover, or an inline section.
- Trap focus while modal, restore focus to the trigger on close, close on Escape unless the operation cannot be dismissed, and lock background scroll without shifting layout.
- On mobile, prefer a sheet that can be dismissed by gesture *and* by a visible control. Gesture-only dismissal is inaccessible.
- Keep the primary action visible without scrolling inside the dialog at common viewport heights.
- The entrance transition never gates the ability to type or click. A 300ms slide that swallows the first keystroke is a defect.

## Tabs and segmented controls

**Job:** switch between peer views in the same context.

- Tabs change content; they are not navigation. Tabs do not push routes unless each tab is a real addressable view.
- The selected tab is a state, not a hover. Underline, fill, or pill are all fine; two of them at once is not.
- Arrow-key navigation within the tab list, `aria-selected`, and a single tab stop for the group.
- Preserve each tab's internal state (scroll, filters) when switching back, or the tabs are worse than separate pages.
- Segmented control is for two to four exclusive options that apply immediately; anything more belongs in a select.

## Command palette

**Job:** fast access to actions and destinations for expert users.

- It is an accelerator, never the only path to a feature.
- Ranking is by the user's intent, not by recency alone: exact label match first, then category match, then fuzzy.
- Show keyboard shortcuts inline, and make the shortcut work without opening the palette.
- Empty query shows a small, stable set of useful destinations, not a wall of everything.
- Announce result counts to assistive technology; the palette must be fully operable without the mouse.

## Destructive actions

**Job:** make an irreversible action hard to trigger by accident, without making it hard to perform deliberately.

- Prefer undo over confirmation. A confirmation dialog is a tax paid on every destruction; an undo toast is paid only when the destruction happens.
- When confirmation is required, name the object being destroyed in the dialog and in the button ("Delete invoice INV-1042"), never "Are you sure?".
- Hold-to-confirm suits actions with no undo and a real cost. Swipe-to-delete suits lists; give it a visible alternative and a keyboard path.
- Never put the destructive action where the primary action was a moment ago.
- The destructive button is visually distinct, not merely red text beside a gray button.

## Forms and inputs

**Job:** get accurate data with minimal correction.

- Labels are persistent and programmatically associated. A placeholder is not a label.
- One column. Multi-column forms increase errors and slow completion unless the fields are genuinely paired (city and postal code).
- Validate on blur and on submit, not on every keystroke. Showing an error while a person is still typing punishes them for being mid-word.
- Errors sit next to the field, say what is wrong and how to fix it, and are announced. Keep entered values on every failure path.
- Mark optional fields, not required ones, when most fields are required.
- Match input types to data: `inputmode`, `autocomplete`, and correct `type` reduce correction. Use one-time-code autocomplete for OTP.
- Never silently reformat or reject a value the person typed (phones, currency, spacing). Format for display, preserve the input.
- Multi-step forms keep progress visible, keep entered data when moving backward, and never lose a step on refresh.

## Theme toggle

**Job:** let someone pick the appearance they need, and remember it.

- Three states where the platform supports it: system, light, dark. "System" is a real choice and must stay available.
- Set the theme before first paint so nobody sees a flash of the wrong theme.
- Animate the transition once if at all; the control's own motion is fine, the whole page changing color is not.
- Update `color-scheme` and any `theme-color` metadata so browser chrome matches.
- The toggle is a labeled button, not a bare icon with an implicit meaning.
