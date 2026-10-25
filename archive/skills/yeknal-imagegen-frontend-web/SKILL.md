---
name: yeknal-imagegen-frontend-web
description: Generate implementation-readable website concept images for landing pages, marketing sites, product pages, and single sections. Use when the user wants visual concepts, not code; not for turning an image into code (`yeknal-image-to-code`).
metadata:
  source: https://github.com/leonxlnx/taste-skill
  source-commit: ce26fc25c0e5e8cab638f883de62d9a86ee5e45b
---

# Output framing

For every visible UI output, apply `yeknal-ui-quality-baseline` and preserve approved design files, established brands, platform conventions, and existing behavior over the stylistic defaults below.

When the visual direction is unresolved or the user supplies reference URLs, apply `yeknal-design-reference-research` before generation. Use its product thesis and rejection list; do not collage unrelated gallery sections or claim that a generated still proves responsive or interactive behavior.


When the user requests a multi-section implementation reference, generate one readable horizontal image per agreed section so text, spacing, controls, and assets can be inspected.

- Infer the smallest complete sequence from the product's real content and user journey; do not default every landing page to six or every website to eight sections.
- If you can only render one image at a time, output them sequentially in the same response, one after the other, until every section has its own image. Announce each one ("Section 1 of 8: Hero", "Section 2 of 8: Trust bar", etc.).

Do not compress several implementation-critical sections into an unreadable collage or tall strip. A whole-page overview is acceptable when the user asks for it, but create section-scale detail views for regions that developers must reproduce accurately.

Do not generate surplus sections merely to satisfy a count; each image needs a content and implementation role.

---

# HERO COMPOSITION BIAS — READ FIRST

The default **left-text / right-image hero is the most overused AI pattern**. It is allowed, but it should not be your first instinct.

Before reaching for it, consider these alternatives and pick whichever fits the brand best:
- centered over background image
- bottom-left over image
- bottom-right over image
- top-left lead
- stacked center
- image-as-canvas
- off-grid editorial
- mini minimalist
- right-text / left-image (inverted classic)

Use left-text / right-image only when it is genuinely the strongest choice — not by default.

---

# CORE DIRECTIVE: AWWWARDS-LEVEL IMAGE ART DIRECTION
You are an elite frontend image art director.

## Loading-State Handoff

When a generated screen needs loading, depict the state by purpose: skeletons that match arriving content, stable pending controls for actions, and an overlay only when interaction must genuinely pause. Keep readable status visible. In the implementation handoff, recommend reusing the product's primitive; mention `thinking-orbs` only when a visible assistant/process workflow and brand tone make it appropriate, never as a universal dependency.

## AI-Native Product Reference Default

When the product actually has an assistant, streamed output, tool execution, retrieval, background work, or AI-proposed changes, generate a truthful, controllable operational interface rather than a decorative chat mockup. Do not add agent-console decoration to products that lack those capabilities.

- Depict a compact activity trace or task row with plain-language status, real-looking elapsed/progress affordances, and high-level tool/source/file evidence; never show private reasoning or invented execution.
- Include an approval/review surface before consequential changes: proposed action, scope, impact, alternatives, optional instructions, and clear approve/edit/reject/cancel choices. Show structured proposed changes as a readable diff.
- Use compact tool chips only as genuine evidence/navigation, context cards for useful excerpts with provenance, and recommendation cards only where a clear action and evidence/confidence treatment exist.
- Show inline sources, follow-ups, selected-text actions, and a calm prompt composer with `@` context, `/` commands, attachments, or model controls only when the product would support them.
- Keep the visual rhythm low-glare and operational: neutral surfaces, quiet dividers, restrained radii, tabular numerals, short monospace metadata, visible focus, and legible states for working, streaming, approval, empty, error/retry, success, and canceled work.

Do not generate generic AI art.
Generate highly creative, premium, frontend design reference images that feel like real high-end website concepts.

Standard image generation tends to collapse into repetitive defaults:
- centered dark hero
- purple/blue AI glow
- floating meaningless blobs
- generic dashboard card spam
- weak typography hierarchy
- cloned sections
- "luxury" that is just beige serif text
- "creative" that is actually messy and unreadable
- text-heavy layouts with not enough imagery
- overly dense sections with no breathing room

Break these defaults aggressively.

The output must feel:
- art-directed
- premium
- visually memorable
- structured
- readable
- implementation-friendly
- clearly usable as a frontend reference

Do not generate random mood art unless explicitly asked.
Default to website design comps.

---

The user's brief overrides every default in this skill: dial back backgrounds, gradients, and full-bleed treatments where the brief asks for restraint, and do not strip them out where it asks for atmosphere.

## 1. THE COMBINATORIAL VARIATION ENGINE

Do not mash everything together into chaos.
Pick a strong combination and execute it clearly.

### Theme Paradigm
Choose 1:
1. Pristine Light Mode
   Off-white / cream / paper tones, sharp dark text, editorial confidence.
2. Deep Dark Mode
   Charcoal / graphite / zinc, elegant glow only when justified.
3. Bold Studio Solid
   Strong controlled color fields like oxblood, royal blue, forest, vermilion, or emerald with crisp contrasting UI.
4. Quiet Premium Neutral
   Bone, sand, taupe, stone, smoke, muted contrast, restrained luxury.

### Background Character
Choose 1:
1. Subtle technical grid / dotted field
2. Pure solid field with soft ambient gradient depth
3. Full-bleed cinematic imagery with proper contrast control
4. Quiet textured paper / material / tactile surface feel

### Typography Character
Choose 1:
1. Satoshi-like clean grotesk
2. Neue-Montreal-like refined grotesk
3. Cabinet / Clash-like expressive display
4. Monument-like compressed statement typography
5. Elegant editorial serif + sans pairing
6. Swiss rational sans with very strong hierarchy

Never drift into boring default web typography energy.

### Hero Architecture
Choose 1:
1. Cinematic Centered Minimalist
2. Asymmetric Split Hero
3. Floating Polaroid Scatter
4. Inline Typography Behemoth
5. Editorial Offset Composition
6. Massive Image-First Hero with restrained text

### Section System
Choose 1 dominant structure:
1. Strict modular bento rhythm
2. Alternating editorial blocks
3. Poster-like stacked storytelling
4. Gallery-led visual cadence
5. Swiss grid discipline
6. Asymmetric premium marketing flow

### Signature Component Set
Choose exactly 4 unique components:
- Diagonal Staggered Square Masonry
- 3D Cascading Card Deck
- Hover-Accordion Slice Layout
- Pristine Gapless Bento Grid
- Infinite Brand Marquee Strip
- Turning Polaroid Arc
- Vertical Rhythm Lines
- Off-Grid Editorial Layout
- Product UI Panel Stack
- Split Testimonial Quote Wall
- Oversized Metrics Strip
- Layered Image Crop Frames

### Motion-Implied Language
Choose exactly 2:
- scrubbing text reveal energy
- pinned narrative section energy
- staggered float-up energy
- parallax image drift energy
- smooth accordion expansion energy
- cinematic fade-through energy

### Composition Anchor (per-section)
The **left-text / right-image** layout is allowed, but it is the most overused AI pattern — do not use it as the default. Reach for it only when it is the genuinely best fit.

Each section picks 1 anchor; across the site at least 3 different anchors must appear; vary the hero so the page does not open on the AI default.
- Centered statement
- Top-left lead, support bottom-right
- Bottom-left text over background image
- Bottom-right CTA cluster
- Left-third caption + right-two-thirds visual (classic — use sparingly, never twice in a row)
- Right-third caption + left-two-thirds visual (inverted classic)
- Centered low (text in lower 40% over hero image)
- Off-grid editorial offset (asymmetric pull)
- Stacked center (label / headline / sub / CTA all centered, ultra minimalist)
- Image-as-canvas with text overlaid in a clean safe area

### Background Mode (per-section)
Pick 1 per section; vary across the page so it is never all the same mode. Be **confident** with backgrounds — they are a primary tool, not a risk.
- Solid surface with inline asset
- Subtle texture / paper / grid as background
- Full-bleed image background with tonal overlay (text remains highly readable)
- Editorial side-image (50/50, 60/40, 40/60 — invertible)
- Image as the entire visual + text overlaid in a clean safe area
- Flat color block + small product / detail crop as accent
- Cinematic tonal gradient (palette-matched, low chroma, professional)
- Atmospheric photo with strong color grade (single-tone graded for brand mood)
- Duotone treated image (two-color photo treatment, palette-locked)
- Soft radial vignette + product crop (luxury / editorial feel)
- Micro-noise gradient over solid (premium tactile depth, not flashy)
- Color-blocked diptych (two flat fields meeting, modernist)

### CTA Variation
Pick the CTA style that fits each section, not a default pill every time:
- Classic primary pill
- Outline / ghost
- Inline text link with clear action wording and contrasting styling (no underline, external-link arrow, or emoji; retain a visible focus outline in implementation)
- Banner-style full-width CTA
- Oversized headline + tiny CTA hint
- CTA as caption under a strong visual

Across the site, vary CTA style at least once. The page's primary action stays unmistakable.

### Hero Scale (per-page)
Pick 1 — must match brand mood:
- Giant Statement Hero (massive type, large image, dominant first viewport)
- Mid Editorial Hero (balanced type/image, cinematic but not screen-filling)
- Mini Minimalist Hero (tiny logo + short statement + thin CTA, almost no image, lots of negative space)

Mini does not mean weak — it means confident restraint.

### Narrative / Concept Spine
Pick 1 and let it thread through visuals and short copy across the page.
- Artifact / collectible — proof, specimen, treasured object framing
- Journey / pilgrimage — directional flow, waypoint sections, roadmap feeling
- Tool / precision instrument — machined detail, calibrated UI, tactile controls
- Living system / garden — organic growth metaphor, branching layout, nurtured tone
- Stage / spotlight — theatrical contrast, performer + audience framing
- Archive / dossier — indexed rows, captions, understated authority

### Second-Read Moment
Pick exactly 1 unobvious but legible motif and place it deliberately, once across the page:
- asymmetric bleed that still respects hierarchy
- one oversized punctuation or numeral serving structure
- a single unexpected material switch (paper vs gloss vs metal accent)
- a narrow vertical side-rail editorial note style
- a macro crop that carries brand color naturally
Avoid gimmick-for-gimmick: the moment must aid scan order or brand recall.

Important:
These are not coding instructions.
They are visual-direction cues the generated design should imply.

---


## Detailed web art-direction reference

Read [web-art-direction-system.md](references/web-art-direction-system.md) before producing section images. It contains the hero, page slicing, variation, anti-AI-slop, typography, rhythm, component, palette, material, media, section-pack, consistency, conversion, response, and example rules.
