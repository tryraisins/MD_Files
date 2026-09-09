# Page and component pattern atlas

Use this when the research target is a page, section, or reusable component. It describes questions to answer, not templates to reproduce.

## Navigation

- Choose the model from information architecture: a short stable set can stay visible; nested families may need dropdowns; broad taxonomies may justify a mega menu; tool-heavy products may need a sidebar; large content sets often need search.
- Preserve identity, current location, the primary route or action, and a reliable way home.
- On narrow screens, transform by priority. A hamburger is not mandatory: short navigation may remain visible, secondary links may move to an overflow sheet, and search may become a dedicated mode.
- Define focus order, open and close behavior, outside click, Escape, Back, deep links, sticky behavior, and scroll restoration.

## Hero or first task surface

- Lead with the user's job and the product object: a working control, product view, credible artifact, or subject-specific image can carry more truth than decorative abstract art.
- Keep one dominant claim, one primary action, and only the proof needed before that action.
- Verify that essential meaning and action survive without animation, background video, or a desktop crop.
- A marketing hero and an authenticated product home solve different problems. The latter should usually surface work, state, and next action sooner.

## Calls to action

- Match the verb to the outcome and commitment: `Preview`, `Create draft`, `Start trial`, `Pay`, and `Delete` must not look or read as equivalent.
- Put risk, price, scope, permission, or reversibility close to the action that creates it.
- Define idle, focus, pressed, disabled, pending, success, failure, retry, and duplicate-submission behavior.
- A pre-footer CTA should resolve the page's argument; it should not repeat the hero without new proof or context.

## Footer

- Treat the footer as continuation and recovery: primary routes, contact or support, status where relevant, required legal links, locale or theme controls when justified, and a clear product or brand signature.
- Group links by user intent. On mobile, stack small groups directly; use disclosure only when the volume warrants the extra interaction.
- Avoid a generic four-column link farm, but do not remove required navigation merely to appear minimal.

## 404 and dead-end recovery

- State what happened in plain language without blaming the user.
- Preserve recognizable navigation and provide the best recovery path: home, search, back, recent work, or a relevant category.
- Do not turn an error page into a visual joke that hides recovery, traps keyboard users, or downloads an expensive scene before showing the next step.

## Bento and modular grids

- Let spans encode priority, sequence, comparison, or a real content relationship.
- Keep DOM order logical when the visual grid reorders or spans items.
- Design each cell around its content model rather than forcing every item into the same card anatomy.
- On narrow screens, preserve the story: merge dependent cells, use deliberate horizontal overflow for inspectable galleries, or stack by priority. Do not shrink a desktop mosaic until text becomes decorative.

## Open Graph and social artboards

- Treat the share image as a separate fixed-ratio composition, commonly 1.91:1, with its own safe area and text budget.
- Make the brand and subject recognizable at small preview sizes. Avoid interface-detail screenshots whose meaning disappears in a feed.
- Test long titles, localization, absent imagery, and platform crops. The page's responsive CSS does not validate the generated image.

## Product flows

- Study sequences, not isolated screens: entry, setup, working state, commitment, success, recovery, and return.
- Record what each transition means—push, replace, modal, sheet, inline disclosure, overlay, or external system handoff.
- Compare desktop and mobile versions to learn what moved, condensed, became a sheet, or disappeared. Copying desktop pixels into a phone viewport is not responsiveness.

## Source-owned components

- Confirm license, maintenance, peer dependencies, React and styling versions, client/server boundary, and bundle effect.
- Audit semantic element choice, accessible name, focus behavior, keyboard operation, pointer assumptions, reduced motion, touch targets, state coverage, and width constraints.
- Install or copy one selected component at a time. Review the diff, remove demo assets and styles, map to product tokens, then test in context.
- Novelty is not a selection criterion. The component must improve feedback, comprehension, spatial continuity, or a rare moment of delight.

## Motion references

For any motion example, capture:

1. trigger and frequency;
2. purpose;
3. start, intermediate, and settled state;
4. interruption and reversal;
5. exit path;
6. input modality;
7. reduced-motion equivalent;
8. performance cost on the slowest supported device.

If a recording does not expose these, it is a mood reference—not an implementation specification.
