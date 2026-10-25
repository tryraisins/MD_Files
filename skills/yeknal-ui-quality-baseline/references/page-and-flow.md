# Page and flow anatomy

For page- or screen-level work, map entry, primary job, commitment, completion, escape, recovery, and next step before polishing individual sections.

- Include likely entry from search, shared links, bookmarks, or notifications. Interior pages must explain their purpose and current location without requiring a visit to the home page; preserve the intended destination through sign-in where applicable.
- Navigation exposes structure, current location, and a reliable way home. Its mobile form follows priority and task frequency rather than defaulting blindly to a hamburger.
- Heroes or first task surfaces keep one dominant purpose, one primary action, and credible product evidence. Essential meaning must survive without animation or a desktop crop.
- On a public home page, state in one clear line what the product does. Give each page one visually dominant primary action; keep secondary actions visibly subordinate.
- CTAs use outcome-specific verbs and place risk, price, scope, permission, or reversibility near the commitment.
- Footers support continuation, support, required legal paths, and recovery; do not delete useful structure just to avoid a conventional footer.
- 404, empty, error, offline, and permission states explain what happened and provide the best next action.
- Bento and modular grids use spans to communicate hierarchy or relationships, keep logical DOM order, and transform intentionally on smaller screens.
- Open Graph and share images are separate fixed-ratio artifacts with their own crop, type, fallback, and localization checks.

### Respect choice and attention

Persuasion must leave the user informed and able to decline. Avoid invented urgency, concealed costs, misleading defaults, and needless obstacles to cancellation or refusal. Add confirmation or review when the consequence warrants it; keep routine, reversible actions fluid.

Interrupt only for information that is actionable and time-sensitive or requires a decision before continuing. Keep routine feedback in the flow and make optional notifications controllable. Ask only for input needed for the task, reuse known values when appropriate, and accept equivalent valid formats without weakening validation.

### Public website launch checks

For a public multi-page website, audit the real routes and shared shell before calling the work complete. Apply the checks that fit the project; do not add empty content or features just to satisfy a checklist.

- Check every page at phone widths for horizontal overflow, clipped content, unusable controls, and layout that still assumes a desktop screen. A mobile menu is needed when the existing navigation cannot fit and remain usable; preserve its links, keyboard and touch behavior, expanded state, and close behavior.
- Verify internal links, footer links, logo destinations, and calls to action against the actual route map. Remove navigation only when the destination is confirmed obsolete or intentionally unavailable; do not hide a broken destination by deleting useful information architecture.
- Make the logo link to the site's home route. Use `tel:` and `mailto:` links for visible phone numbers and email addresses when they are intended as contact methods.
- Ensure each public page has a distinct, accurate title and useful meta description, and that the site has a working favicon. Keep page metadata aligned with visible content; use `yeknal-content-seo` for broader canonical, indexing, social-card, sitemap, or structured-data work.
- Provide a deliberate not-found page with a useful route back into the site. Keep copyright dates current using the project's established convention; if generated dynamically, use a real date source and verify the rendered year.
- Inspect visible copy for lorem ipsum, stale template instructions, and placeholder labels. Confirm each button performs its stated action and has a visible, accessible success or error result when its action can succeed or fail.
- Never use staccato sentences in interface prose, design notes, or handoff copy. Connect related ideas with complete sentences and a natural rhythm; avoid strings of clipped fragments and one-line paragraphs. Keep labels, headings, and status messages concise where the interface needs them, while writing supporting explanations in flowing prose.
- Check image dimensions and transfer size at rendered sizes. Resize oversized assets and prefer supported modern formats and responsive variants where the project supports them; retain appropriate quality, dimensions, and fallbacks rather than blindly recompressing every asset.
- Treat the site as responsive page by page: inspect every route at narrow phone width and representative common phone, tablet, and desktop widths, then check shared components and any page-specific exceptions at the viewport where their content is most constrained.

For an existing site audit, record each finding with its route, observed behavior, viewport or state, and the smallest appropriate correction. Separate confirmed broken behavior from optional polish.
