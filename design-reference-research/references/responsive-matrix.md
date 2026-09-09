# Responsive and device matrix

Use representative viewports to expose layout decisions, not to chase device names. Add product-specific devices and embedded contexts when the audience requires them.

## Minimum matrix

| Context | Representative checks | What it catches |
| --- | --- | --- |
| Small phone | 320x568 and 360x800 | Minimum wrapping, target crowding, fixed bars, legacy devices. |
| Common phone | 390x844 and 430x932 | Primary mobile composition, safe areas, long content, modern tall screens. |
| Tablet portrait and landscape | 768x1024 and 1024x768 | Awkward middle states, master-detail decisions, keyboard and orientation changes. |
| Compact desktop | 1280x720 | Reduced height, browser chrome, sticky collisions, modal fit. |
| Standard desktop | 1440x900 or 1440x1000 | Intended desktop composition and density. |
| Wide desktop | 1920x1080 or wider | Overstretched reading lines, weak max widths, excessive empty space. |
| Accessibility | 200% browser zoom, large text, keyboard only, reduced motion, forced-colors where supported | Reflow, clipping, focus, hidden meaning, and motion dependence. |

Also test coarse pointer, fine pointer, hover/no-hover, light/dark theme, slow network, offline or failed requests, and virtual-keyboard appearance where relevant.

## Transformation questions

For each breakpoint or container change, state what happens to:

- navigation and search;
- primary and secondary actions;
- reading order and landmark order;
- columns, spans, and sidebars;
- tables, charts, code, and other wide content;
- media crop, focal point, and captions;
- dialogs, sheets, popovers, and tooltips;
- sticky headers, bottom actions, and safe-area insets;
- density, labels, and optional metadata;
- footer groups and legal links.

Use content pressure and task changes to place breakpoints. Do not inherit a framework breakpoint without observing where the actual composition fails.

## Acceptable transformations

- A sidebar can become an inline filter bar, drawer, or dedicated filter screen depending on frequency and complexity.
- A wide table can preserve columns with controlled horizontal scrolling, expose a priority subset with row details, or become cards only when row comparison is not the primary job.
- A dense toolbar can keep the primary action visible and move secondary commands to overflow; icon-only compression needs accessible names and must not hide unfamiliar actions.
- A multi-column hero can stack, reorder, or replace media, but the claim, proof, and primary action must retain a coherent reading order.
- A bento grid can re-span, merge related content, or become a deliberate carousel; a blind one-column stack often destroys the intended relationships.
- Desktop popovers and menus may become bottom sheets on touch devices when reach, available height, or keyboard interaction makes the desktop treatment unsuitable.

## Pass criteria

- No unintended page-level horizontal scroll.
- No clipped or overlapping text, controls, focus rings, menus, or validation messages.
- Primary work and recovery actions remain reachable.
- Touch targets meet the platform requirement and do not overlap.
- The virtual keyboard does not hide the focused field or submission path.
- Sticky or fixed elements do not consume the usable viewport on short screens.
- Typography reflows without dropping essential labels below the product's readable minimum.
- Source order, tab order, visual order, and announced state remain coherent.
- Motion, hover, and drag are never the only ways to discover or perform an action.

Record pass/fail per row of the matrix. “Responsive” is a claim only after rendered checks; source inspection alone proves intent, not behavior.
