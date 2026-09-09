# UI source atlas

Reviewed 2026-09-09. Use this as routing guidance, not as a mandatory browse list. Recheck live sources when a task depends on current content.

## How the review was performed

All supplied URLs were attempted through a text-capable web reader and a rendered browser. Rendered pages were checked at 1440 by 1000 and 390 by 844 where the browser allowed it. Gallery availability is not evidence that the showcased design is usable or current.

- SaaSpo returned a Cloudflare block in the rendered browser; only its discoverable text/category surface was available, so any deeper behavior remains `UNVERIFIED`.
- 60fps loaded and exposed its motion taxonomy, but an automated screenshot timed out while waiting on page assets. Treat its clips as items to inspect individually when motion behavior matters.
- One Page Love's OG gallery overflowed horizontally in the 390px rendered check. This is an observed property of the gallery page, not of the designs it contains.

## Mobile products and platform conventions

| Source | Best use | Important boundary |
| --- | --- | --- |
| [Appllama skills](https://github.com/Appllama/appllama-skills) | Researching native mobile screens and full-flow navigation grammar; its two skills were reviewed at `dd5caaec3d5d50ad7fc0324da238119c6b7c3707`. | Extract patterns, not competitor pixels. MCP access is optional and may be paid. Use `mobile-app-design` for implementation. |
| [Apple Human Interface Guidelines](https://developer.apple.com/design/human-interface-guidelines) | Current Apple platform foundations, components, inputs, layout, accessibility, and platform conventions. | Apply to Apple platforms and Apple-like web behavior with judgment; do not impose iOS chrome on unrelated products. |
| [SaaSFrame](https://www.saasframe.io/) | End-to-end SaaS website and product flows, including paired desktop/mobile examples and state categories. | Gallery screens do not prove flow correctness; verify the original product when needed. |

## Page and section anatomy

| Source | Best use | What to extract |
| --- | --- | --- |
| [Navbar Gallery](https://www.navbar.gallery/) | Static, dropdown, mega-menu, sidebar, search, announcement, fullscreen, and breadcrumb navigation patterns. | Information architecture, priority, disclosure, active state, and responsive transformation. |
| [Supahero](https://supahero.io/) | Hero-section structures across products and visual styles. | Value proposition, proof, product object, action hierarchy, and first-viewport composition. |
| [404s](https://www.404s.design/) | Branded not-found and recovery pages. | Clear failure statement, recovery routes, search or navigation, and appropriate brand expression. |
| [Footer](https://www.footer.design/) | Footer systems categorized by typographic, small, illustrative, grid, flat, animated, card, bright, and dark treatments. | Continuation path, navigation grouping, legal requirements, contact, and responsive density. |
| [CTA Gallery](https://www.cta.gallery/) | Calls to action across buttons, commerce, downloads, forms, modals, navigation, newsletters, and pricing. | Commitment level, verb, supporting proof, proximity, risk, and success or failure state. |
| [Unsection](https://www.unsection.com/) | Whole-page section sequences, hover effects, templates, and searchable section types. | Narrative order and transitions between sections—not isolated section decoration. |
| [Gridddy](https://gridddy.framer.website/) | Pre-footer CTA compositions. | The final decision moment, preceding proof, exit paths, and relationship to the footer. |
| [One Page Love OG gallery](https://onepagelove.com/og) | Open Graph image compositions across industries and page types. | Separate share-artboard hierarchy, crop safety, recognizability, and concise text. |

## Product, landing-page, and visual-system references

| Source | Best use | Important boundary |
| --- | --- | --- |
| [SaaSpo](https://saaspo.com/) | SaaS website inspiration and page-category discovery. | Direct rendered access was blocked during this review; confirm live details elsewhere. |
| [Landing Love](https://www.landing.love/) | Full-page video recordings of animated websites. | Study the complete scroll and interaction story; do not cargo-cult cinematic motion into utility UI. |
| [Refero Styles](https://styles.refero.design/) | AI-readable `DESIGN.md` examples describing colors, type, spacing, and components. | Imported rules are hypotheses until reconciled with the real product and code. |
| [Recent](https://recent.design/?ref=godly) | Broad design discovery across web, interface, brand, product, type, motion, illustration, 3D, and editorial work. | Mix functional and stylistic references deliberately; do not treat feed ranking as authority. |
| [WebInspoo](https://webinspoo.com/) | SaaS references filtered by category, typography, palette, and technology stack. | Stack labels and screenshots can drift; verify before implementation. |
| [Curated](https://curated.design/) | Live websites grouped by industry and style. | Prefer the original live site for behavior, accessibility, and responsive claims. |
| [Rebrand](https://www.rebrand.gallery/) | Identity systems, launch narratives, brand applications, type, style, and emotional tone. | A brand reveal is not automatically a product-interface system. Translate identity into usable roles. |
| [UI Rules](https://uirules.com/) | Keeping brand rules, design tokens, voice, and component guidance available to AI tools. | Treat design guidance as versioned product data with ownership and review—not as a magic prompt. |

## Grids, components, and motion

| Source | Best use | Adoption gate |
| --- | --- | --- |
| [Bento Grids](https://bentogrids.com/) | Graphic, web, and animated bento compositions. | Spans must express priority or relationships. Reject equal-box cargo cults and preserve logical source order. |
| [Halftone Cards](https://halftone-cards.vercel.app/) | A focused treatment combining procedural halftone graphics, restrained type, and card structure. | Use as a technique study, not a page template; check contrast and performance. |
| [Rare UI](https://www.rareui.com/) | Distinctive shadcn-compatible React motion components. | Inspect the exact source and dependencies. Adapt tokens, focus, reduced motion, pointer gating, and small-screen behavior. |
| [Spell UI](https://github.com/xxtomm/spell-ui) | Copy-owned React source components including buttons, cards, text, inputs, loaders, and motion. Reviewed at `fffe96db7b67b44243bf35815916fdfc58fe5014`. | Source quality varies by component; check semantics, imports, client boundaries, keyboard use, reduced motion, and maintenance before adoption. |
| [Spectrum UI](https://ui.spectrumhq.in/) | shadcn/Tailwind/Motion components, blocks, charts, and agent-oriented patterns. | Verify licensing, current installation path, code quality, and whether the interaction is necessary. |
| [beUI](https://beui.dev/) | React 19/Tailwind 4 motion components and blocks distributed through shadcn. | Confirm project-version compatibility and avoid importing demo styling or gratuitous motion. |
| [60fps](https://60fps.design/) | Motion clips and taxonomy across controls, gestures, onboarding, loading, success, empty state, and navigation. | A clip is inspiration, not a timing specification. Reproduce purpose and physics only after measuring the product context. |
| [Design Spells](https://designspells.com/) | Small delightful details across mobile, desktop, interaction, skeuomorphism, error states, and motion. | Reserve delight for suitable frequency and tone; require a static and reduced-motion path. |

## Human-AI interaction

| Source | Best use | Routing |
| --- | --- | --- |
| [39 Principles for Designing Human-AI Interaction](https://syntaxstream.substack.com/p/42-principles-for-designing-humanai) | Appropriate reliance, expectation setting, provenance, control, graceful failure, co-creation, autonomy, and long-term governance. | Use `human-ai-interface-design`; verify high-stakes product decisions against applicable primary standards and policy. |
