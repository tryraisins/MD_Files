---
name: yeknal-high-end-visual-design
description: Create premium, art-directed web interfaces with a product-specific visual thesis, expressive typography, deliberate composition, material, imagery, and motion. Use only when the brief explicitly asks for high-end, agency, editorial, experimental, or showcase-level visual direction; use frontend-design or design-taste-frontend for ordinary product UI.
metadata:
  source: https://github.com/leonxlnx/taste-skill
  source-commit: ce26fc25c0e5e8cab638f883de62d9a86ee5e45b
---

# High-end visual design

Build one coherent visual world, not a collection of fashionable effects. Premium work is recognizable by authorship, restraint, and finish—not by mandatory gradients, bentos, 3D, glass, grain, or scroll choreography.

Apply `yeknal-ui-quality-baseline`. Keep approved brand assets, existing design-system contracts, content, behavior, and accessibility intact.

## Ground the art direction

When the user has not supplied an approved direction, use `yeknal-design-reference-research` to study functionally relevant live work before designing. Extract structure, hierarchy, and behavior; never copy compositions or brand assets.

State a compact art-direction brief:

- **Subject:** the world this product belongs to and what users must feel or understand.
- **Thesis:** one sentence connecting that subject to a visual idea.
- **Signature:** the single device that makes the work memorable.
- **System:** the roles of type, color, grid, shape, imagery, material, and motion.
- **Restraint:** three tempting effects or patterns explicitly rejected.

Reject any thesis that survives unchanged after you swap the logo and the noun.

## Build a visual system, not a mood board

- Let product content and real artifacts supply the strongest imagery whenever possible.
- Choose type for voice and reading conditions. Spend expressive display type sparingly; keep a highly legible text face for sustained reading, and load only the weights and scripts you require.
- Name colors by role. Neutrals, accent, feedback states, data colors, and materials each need contrast behavior in every relevant theme.
- Define a grid with intentional alignments, spans, margins, and break behavior. Asymmetry earns its place when it creates focus or narrative; random offsets are noise.
- Establish a small vocabulary for radius, border, and elevation. A technique such as hard frames, soft shells, halftone, blur, grain, or continuous corners needs a subject-specific reason and a performance budget.
- Hold illustration, photography, icons, 3D, and generative assets to one language of palette, lighting, texture, and perspective.

## Compose the whole experience

Design the sequence, not only the hero:

- navigation exposes the information architecture and the user's current location;
- the first surface states the job, shows credible proof or the product object, and offers one primary next step;
- sections advance through evidence, explanation, comparison, and commitment without repeating one split layout;
- CTAs match commitment, risk, and outcome;
- the pre-footer resolves the narrative while the footer supports continuation, recovery, contact, and legal needs;
- 404, empty, loading, error, success, and offline states stay inside the same visual world;
- Open Graph and share art use a dedicated fixed-ratio composition, never a random page crop.

Bento, masonry, carousel, split-screen, editorial columns, and sticky chapters are options. Choose one only when its spatial relationships carry meaning.

## Choreograph motion

Motion follows a hierarchy:

1. input feedback and state continuity;
2. spatial explanation and navigation;
3. one optional narrative or signature moment;
4. rare delight.

Use the cheapest capable tool and the project's existing motion system. Keep native scroll unless a custom model materially improves the story and remains accessible. Keep high-frequency actions immediate, make gestures interruptible, prefer compositor-friendly properties, and provide reduced-motion behavior that preserves meaning.

When available, study motion references as full recordings. A still image cannot convey timing, interruption, exit, or performance.

## Responsive art direction

Do not shrink the desktop layout proportionally. At each meaningful width and height, decide:

- which element owns focus;
- what reorders, condenses, becomes a sheet, or moves to overflow;
- how the signature survives without obscuring the primary task;
- how imagery crops and type reflows;
- whether a complex grid should re-span, merge, scroll deliberately, or simplify.

Render at small phone, common phone, tablet portrait and landscape, compact desktop height, standard desktop, and wide desktop. Also check zoom, large text, keyboard, touch, reduced motion, slow loading, and long localized content.

## Implementation discipline

- Reuse existing primitives when they can express the direction; extend them through tokens and variants instead of forking look-alikes.
- Treat source registries as code suppliers, not art directors. Before adopting anything, review license, dependencies, semantics, focus, keyboard, touch, reduced motion, client boundaries, bundle cost, and responsive behavior.
- Do not force a framework migration or add several animation and icon libraries just for visual variety.
- Keep performance budgets explicit for video, shaders, canvas, blur, 3D, custom cursors, and scroll-linked effects. Ship a usable static or lightweight fallback.
- Use real product copy and believable content. Placeholder metrics, clichés, and repeated generic sections undermine even strong art direction.

## Final critique

Before delivery, answer:

- What is the one memorable idea, and why does it belong to this product?
- Which decisions came from user need, platform convention, product content, or reference evidence?
- Can users still complete the primary job if signature imagery or motion fails?
- Does every viewport feel composed rather than merely contained?
- Are components consistent across idle, focus, pressed, loading, empty, error, success, and disabled states?
- Was the complete flow inspected in motion and under reduced motion?
- Which one flourish was removed after the first complete pass?

Report rendered evidence separately from code inference. Never claim agency-level polish without inspecting the result at actual target sizes.
