---
name: frontend-design
description: Design and implement distinctive, production-grade frontend interfaces for any web UI task (components, pages, apps, dashboards, landing pages, and design systems). Use when the task depends on art direction, visual hierarchy, restrained composition, imagery, and motion — not component count. Generates creative, polished code that avoids generic AI aesthetics.
license: Complete terms in LICENSE.txt
---

# Frontend Design Skill

Use this skill when the quality of the work depends on art direction, hierarchy, restraint, imagery, and motion rather than component count.

Goal: ship interfaces that feel deliberate, premium, and current. Default toward award-level composition: one big idea, strong imagery, sparse copy, rigorous spacing, and a small number of memorable motions.

## Working Model

Before coding, write three things:

- **Visual thesis**: one sentence describing mood, material, and energy (e.g., "matte-black editorial calm with a single electric-blue accent").
- **Content plan**: hero, support, detail, final CTA — each section gets one job, one dominant visual idea, and one primary takeaway or action.
- **Interaction thesis**: 2-3 motion ideas that change the feel of the page.

Then commit to a BOLD aesthetic direction:
- **Purpose**: What problem does this interface solve? Who uses it?
- **Tone**: Pick a clear flavor — brutally minimal, maximalist chaos, retro-futuristic, organic/natural, luxury/refined, playful/toy-like, editorial/magazine, brutalist/raw, art deco/geometric, soft/pastel, industrial/utilitarian, etc. Use these for inspiration but design one that is true to the aesthetic direction.
- **Differentiation**: What makes this UNFORGETTABLE? What's the one thing someone will remember?

**CRITICAL**: Choose a clear conceptual direction and execute it with precision. Bold maximalism and refined minimalism both work — the key is intentionality, not intensity.

Then implement working code (HTML/CSS/JS, React, Vue, etc.) that is:
- Production-grade and functional
- Visually striking and memorable
- Cohesive with a clear aesthetic point-of-view
- Meticulously refined in every detail

## Beautiful Defaults

- Start with composition, not components.
- Prefer a full-bleed hero or full-canvas visual anchor.
- Make the brand or product name the loudest text.
- Keep copy short enough to scan in seconds.
- Use whitespace, alignment, scale, cropping, and contrast before adding chrome.
- Limit the system: two typefaces max, one accent color by default.
- Default to cardless layouts. Use sections, columns, dividers, lists, and media blocks instead.
- Treat the first viewport as a poster, not a document.

## Typography

- Choose fonts that are beautiful, unique, and characterful. Avoid generic fonts like Arial, Inter, Roboto, and system defaults.
- Pair a distinctive display font with a refined body font.
- Dominant scale contrast: hero type should be dramatically larger than body.
- NEVER converge on common AI choices (Space Grotesk, for example) across generations. Vary choices every time.

## Color & Theme

- Commit to a cohesive palette using CSS variables for consistency.
- Dominant colors with sharp accents outperform timid, evenly-distributed palettes.
- One accent color unless the product already has a strong multi-color system.
- Vary between light and dark themes across projects. No design should look the same.
- Never default to purple gradients on white backgrounds or other cliched AI color schemes.

## Spatial Composition

- Unexpected layouts. Asymmetry. Overlap. Diagonal flow. Grid-breaking elements.
- Generous negative space OR controlled density — match the vision.
- Backgrounds should create atmosphere and depth: gradient meshes, noise textures, geometric patterns, layered transparencies, dramatic shadows, grain overlays.
- No solid white/gray backgrounds as a lazy default.

## Landing Pages

Default sequence:

1. **Hero**: brand or product, promise, CTA, and one dominant visual
2. **Support**: one concrete feature, offer, or proof point
3. **Detail**: atmosphere, workflow, product depth, or story
4. **Final CTA**: convert, start, visit, or contact

### Hero rules

- One composition only.
- Full-bleed image or dominant visual plane.
- **Canonical full-bleed rule**: on branded landing pages, the hero itself must run edge-to-edge with no inherited page gutters, framed container, or shared max-width; constrain only the inner text/action column.
- Brand first, headline second, body third, CTA fourth.
- No hero cards, stat strips, logo clouds, pill soup, or floating dashboards by default.
- Keep headlines to roughly 2-3 lines on desktop and readable in one glance on mobile.
- Keep the text column narrow and anchored to a calm area of the image.
- All text over imagery must maintain strong contrast and clear tap targets.

If the first viewport still works after removing the image, the image is too weak. If the brand disappears after hiding the nav, the hierarchy is too weak.

### Viewport budget

- If the first screen includes a sticky/fixed header, that header counts against the hero. The combined header + hero content must fit within the initial viewport at common desktop and mobile sizes.
- When using `100vh`/`100svh` heroes, subtract persistent UI chrome (`calc(100svh - header-height)`) or overlay the header instead of stacking it in normal flow.

## App UI

Default to Linear-style restraint:

- Calm surface hierarchy
- Strong typography and spacing
- Few colors, dense but readable information
- Minimal chrome
- Cards only when the card IS the interaction

Organize around:

- Primary workspace
- Navigation
- Secondary context or inspector
- One clear accent for action or state

Avoid:

- Dashboard-card mosaics
- Thick borders on every region
- Decorative gradients behind routine product UI
- Multiple competing accent colors
- Ornamental icons that do not improve scanning

If a panel can become plain layout without losing meaning, remove the card treatment.

## Imagery

Imagery must do narrative work.

- Use at least one strong, real-looking image for brands, venues, editorial pages, and lifestyle products.
- Prefer in-situ photography over abstract gradients or fake 3D objects.
- Choose or crop images with a stable tonal area for text overlay.
- Do not use images with embedded signage, logos, or typographic clutter fighting the UI.
- Do not generate images with built-in UI frames, splits, cards, or panels.
- If multiple moments are needed, use multiple images, not one collage.

The first viewport needs a real visual anchor. Decorative texture alone is not enough.

## Copy

- Write in product language, not design commentary.
- Let the headline carry the meaning.
- Supporting copy should usually be one short sentence.
- Cut repetition between sections.
- Do not include prompt language or design commentary in the UI.
- Give every section one responsibility: explain, prove, deepen, or convert.

If deleting 30% of the copy improves the page, keep deleting.

### Utility Copy (Product UI)

When the work is a dashboard, app surface, admin tool, or operational workspace, default to utility copy over marketing copy.

- Prioritize orientation, status, and action over promise, mood, or brand voice.
- Start with the working surface itself: KPIs, charts, filters, tables, status, or task context. Do not introduce a hero section unless the user explicitly asks for one.
- Section headings should say what the area is or what the user can do there. Good: "Selected KPIs", "Plan status", "Search metrics", "Top segments", "Last sync".
- Avoid aspirational hero lines, metaphors, campaign-style language, and executive-summary banners on product surfaces unless specifically requested.
- Supporting text should explain scope, behavior, freshness, or decision value in one sentence.
- If a sentence could appear in a homepage hero or ad, rewrite it until it sounds like product UI.
- If a section does not help someone operate, monitor, or decide, remove it.
- **Litmus check**: if an operator scans only headings, labels, and numbers, can they understand the page immediately?

## Motion

Use motion to create presence and hierarchy, not noise.

Ship at least 2-3 intentional motions for visually led work:

- One entrance sequence in the hero
- One scroll-linked, sticky, or depth effect
- One hover, reveal, or layout transition that sharpens affordance

Prefer Framer Motion (or Motion library) when available for:

- Section reveals with staggered animation-delay
- Shared layout transitions
- Scroll-linked opacity, translate, or scale shifts
- Sticky storytelling
- Carousels that advance narrative, not just fill space
- Menus, drawers, and modal presence effects

For HTML-only work, prioritize CSS-only solutions.

### Motion rules

- Noticeable in a quick recording
- Smooth on mobile
- Fast and restrained
- Consistent across the page
- Removed if ornamental only
- One well-orchestrated page load with staggered reveals creates more delight than scattered micro-interactions

## Hard Rules

- No cards by default.
- No hero cards by default.
- No boxed or center-column hero when the brief calls for full bleed.
- No more than one dominant idea per section.
- No section should need many tiny UI devices to explain itself.
- No headline should overpower the brand on branded pages.
- No filler copy.
- No split-screen hero unless text sits on a calm, unified side.
- No more than two typefaces without a clear reason.
- No more than one accent color unless the product already has a strong system.
- No generic AI-generated aesthetics: overused fonts (Inter, Roboto, Arial), cliched color schemes, predictable layouts, cookie-cutter patterns.
- No design should look the same as another. Vary themes, fonts, and aesthetics across every generation.

## Reject These Failures

- Generic SaaS card grid as the first impression
- Beautiful image with weak brand presence
- Strong headline with no clear action
- Busy imagery behind text
- Sections that repeat the same mood statement
- Carousel with no narrative purpose
- App UI made of stacked cards instead of layout
- Purple gradient on white as default palette
- Overused font families (Inter, Space Grotesk, Roboto) across multiple generations
- Decorative shadows and chrome masking weak composition

## Litmus Checks

- Is the brand or product unmistakable in the first screen?
- Is there one strong visual anchor?
- Can the page be understood by scanning headlines only?
- Does each section have one job?
- Are cards actually necessary?
- Does motion improve hierarchy or atmosphere?
- Would the design still feel premium if all decorative shadows were removed?
- Match implementation complexity to the aesthetic vision: maximalist designs need elaborate code; minimalist designs need restraint, precision, and careful spacing.

Remember: You are capable of extraordinary creative work. Don't hold back — show what can truly be created when thinking outside the box and committing fully to a distinctive vision.
