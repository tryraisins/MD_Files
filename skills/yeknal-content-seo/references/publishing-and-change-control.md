# Publishing and Change Control

An agent that can edit a live site can quietly remove the one thing a page existed for. The controls here exist because that failure produces no error and no warning.

## Prepare before publishing

1. Work in the repository, a branch, or a CMS draft. Never edit a live page directly.
2. Capture the current version: rendered HTML, the visible sections, the structured data, and the internal links pointing at the page.
3. Keep the current version retrievable until the change has been reviewed and the new version is confirmed.

## The diff gate

Before publishing over an existing page, or changing a template that several pages use, list every element present in the old version and missing from the new one:

- tables, rankings, comparisons;
- forms, quizzes, calculators, and interactive blocks;
- images, video, and embeds;
- testimonials and reviews;
- structured data types;
- internal links in and out;
- locale pairs and alternate links;
- the differentiator identified in the brief.

Show the list before publishing. If it is not empty, say so in the first line of the report and treat the change as blocked until the user decides.

The list is not decoration. The element most likely to disappear is the original one, which is exactly the element the page needed in order to be worth publishing. A rewrite that drops it makes the page thinner while every other check still passes.

## Publish and verify

After publishing, check in this order:

1. The intended URL returns the new content with the expected status code.
2. The canonical points at the intended absolute URL, including protocol, host, path, and trailing-slash policy.
3. Indexing directives and robots behavior are unchanged unless the change intended them.
4. The sitemap includes the URL with an accurate last-modified value when the project maintains one outside the CMS.
5. The rendered page, not only the source, contains the title, description, headings, structured data, and internal links.
6. A share-card preview resolves to a real image at the expected crop.
7. Analytics events still fire where the change touched them.

Exclude the CDN or cache from the reasoning: verify the origin response and the served response separately when they can differ.

## Approval tiers

Adapt the names to the project, keep the split. The model may operate freely in the first tier, must ask in the second, and may not act in the third.

| Tier | Work |
| --- | --- |
| Allow | Read search and analytics data, read crawl output, draft content, write review notes and reports, prepare a branch |
| Require approval | Publish or update a live page, change a title or description on a page that earns clicks, add or change a redirect, change a template used by more than one page, remove an internal link, alter a sitemap |
| Block | Delete a page, edit robots directives or canonical tags without explicit instruction, bulk noindex, mass-generate URLs, send outreach email outside the organization, buy anything |

The tiers are not a suggestion. They are the difference between an audit and an incident.

## Code holds the veto on deletion

Do not let a model make an irreversible call about content removal. Removal is blocked in code for any page that meets a materiality threshold set by the project, for example a minimum word count, any clicks in a comparable period, or any external links.

The model may rank candidates for removal and explain the reasoning. The code or the person holds the veto. This is a guardrail, not an SEO rule; the threshold is arbitrary on purpose and should be easy to inspect and change.

## Learn from rejections

Every time the user rejects a draft or reverses a change, record the reason in a short standards file the agent reads before the next draft.

Examples of entries:

- Do not claim results we have not measured.
- Never compare us to a competitor without naming a row where they win.
- Local pages need one verified local detail each.
- Do not use the word "seamless".

That file becomes the editorial line, written by real decisions. It outlives the current tool, the current model, and the current campaign.

## The change record

For every material change, record:

- what changed, with the URL or template;
- why, with the evidence;
- the date, and the baseline metrics for the period before;
- the signal that should move, and the date to review it;
- who approved it.

A change with no record cannot be evaluated later, and the next person repeats it.

## Rollback

Keep the previous version and the redirect plan until the new version has produced a measurable result. If the page loses clicks after the review window, restore rather than stacking another change on top. A second unverified change makes the first one impossible to interpret.
