---
name: yeknal-content-seo
description: "Evidence-led search visibility: target queries, update-or-create decisions, metadata, structure, structured data, crawlability, sitemaps, canonicalization, local search, earned links, and AI answers. Use for SEO work."
metadata:
  internal: true
  indexnow-source-reviewed: "2026-09-07"
  google-ai-features-source-reviewed: "2026-10-07"
---

# Content and SEO

Anchor every decision in reader intent and product evidence. Produce genuinely useful content first, then structure it so people and search engines can understand it.

## Workflow

1. Define the audience, the decision they are making, the intent stage, the primary action, and the success measure.
2. Classify the target query by what the live results contain, not by assumption. Record the page type that occupies the top results and whether the site can serve that intent honestly. Use [keyword intent and patterns](references/keyword-intent-and-patterns.md) for the repeatable patterns.
3. Judge winnability at the site's current authority. Note the strength of the pages already ranking and whether the site has or can earn comparable support. Choose a narrower query when it cannot.
4. Map queries to existing URLs before proposing a new page. Use query and page data when available, and decide update or create per [page decisions](references/page-decisions-and-briefs.md).
5. For every SEO optimization request, assess whether branded-search or AI-search visibility is in scope and whether existing authoritative pages leave a real information gap. Create or update an AI-readable brand information page only when both are true. Follow [AI search and brand information](#ai-search-and-brand-information).
6. Name the one thing the page will contain that the competing results do not: first-hand data, a calculator or quiz, real photographs, video, or a clear answer drawn from experience. If there is nothing, fix that before writing.
7. Shape a clear information hierarchy: one primary topic per page, with descriptive links throughout.
8. Write specific, accurate, scannable copy that uses real examples and accessible language.
9. Add metadata and structured data only where they truthfully describe visible content and meet the search feature's guidelines.
10. Plan distribution before publishing: contextual links from related pages, earned coverage, a local profile, or map visibility per [local search](references/local-search.md). A page with no inbound path and no coverage does not circulate.
11. Verify mobile layout, performance, accessibility, crawlability, sitemap accuracy, analytics events, and rendered output. Follow [the technical audit](references/technical-audit.md).
12. Before replacing an existing page or template, run the diff gate in [publishing and change control](references/publishing-and-change-control.md).
13. When published URLs are added, materially updated, redirected, or deleted, evaluate IndexNow as a change-notification channel. Read [the IndexNow workflow](references/indexnow.md) before implementing or submitting.

## Rules

- Never keyword-stuff, hide text, fabricate expertise, or promise rankings.
- Never invent a search volume, difficulty score, ranking position, click-through rate, competitor detail, or citation. Write "not measured" and name what would measure it.
- Prefer original evidence, clear authorship, and useful depth over padded length.
- One primary intent per page. Create a second page only when query and page data, or a genuinely different result page type, supports the split.
- Every published page carries at least one element the competing results lack, and that element survives every later rewrite.
- Keep headings, metadata, URLs, and schema aligned with the actual page.
- Do not recommend a fixed page count, publishing cadence, link count, waiting period, or ranking target as a universal SEO rule. Base priorities on search intent, site evidence, business value, and relevant policy.
- Do not buy links, arrange reciprocal links for ranking credit, hide paid-link footprints, or create third-party pages primarily to borrow another site's ranking signals. Recommend genuine, editorially earned coverage instead.
- Use descriptive internal-link anchors that help readers; do not enforce an exact-match anchor quota. Add words such as "best" or a year to titles only when the page genuinely supports the claim and its information is current.
- Never imply that an AI-specific page, an `llms.txt` file, schema, or a particular title phrase guarantees AI Overview inclusion, citations, rankings, or traffic.
- Report technical SEO checks separately from editorial recommendations.
- Treat sitemap discovery, an IndexNow `200`/`202`, crawl activity, and actual indexing as separate proof boundaries. Submission alone never guarantees ranking or indexing.
- Live changes follow the approval tiers in [publishing and change control](references/publishing-and-change-control.md). Deletions, redirect edits, and bulk indexing changes are never the model's decision.

## AI search and brand information

For branded-search or generative-AI visibility work, first check the site's existing About, organization, product, service, contact, and policy pages. [Google's current guidance](https://developers.google.com/search/docs/appearance/ai-features) says established SEO practices apply to AI Overviews and AI Mode and that there are no additional technical requirements or special optimizations for inclusion.

When the audit finds a real information gap, create or update a public, human-useful **AI-readable brand information page** (sometimes requested as an "AI instructions page"). Treat it as an accurate source of facts, not a hidden prompt or an instruction that controls how a search engine or AI system must answer. Include only verified details relevant to the site, such as:

- the organization's canonical name, aliases, official website, and contact channels;
- products or services, locations actually served, and current policies or pricing when appropriate;
- concise, directly supported answers to recurring branded questions;
- links to the authoritative pages or primary sources behind important claims, plus a clear update date where the facts can change.

Use the canonical URL, page title, visible content, internal links, and indexing controls consistently with the site's existing information architecture. Keep it discoverable to people and eligible crawlers if search visibility is an objective. Do not publish claims that the page is an "official AI instruction" or that it will dramatically affect AI Overviews.

An optional `/llms.txt` file can act as a curated index to useful pages for agents that choose to read it. It is an independent proposal for agent discovery, not a documented Google ranking or AI Overview signal, and it does not replace useful public pages, crawlability, or a sitemap.

Assistants that answer from live search cite pages that already rank or are cited elsewhere, so useful pages and earned coverage come first. Model the short, recommendation-shaped queries an assistant would search rather than the sentence a customer would type, and build the prospect list from the pages those queries return. Do not place the site first in its own comparison content; readers and models discount it, and the claim is usually not true. [Authority and links](references/authority-and-links.md) covers citation prospecting, community threads, and the limits of each surface.

For measurement, record the branded queries, pages, dates, markets, and available Search Console/analytics baseline. AI-generated answers can vary by query, location, time, and system; report observed citations and traffic separately from hypotheses, and do not claim causation from a single appearance or fluctuation. Sample answers logged out, for a fixed query set, on a schedule, and record what was cited.

## Protect existing page value during optimization

Before substantially rewriting a page that already earns impressions, clicks, links, or conversions, capture the relevant baseline when data access is available. Compare the current and proposed versions and call out important material that would disappear, such as original evidence, ranking tables, product details, forms, testimonials, structured data, or internal links. Preserve useful material unless the user approves a reasoned change. Prepare changes in the repository, branch, or CMS draft; publish live only through the user's authorized workflow.

A rewrite is a regression until proven otherwise. The diff gate in [publishing and change control](references/publishing-and-change-control.md) makes the comparison explicit and blocks publishing while material is missing. The element that made the page worth publishing is the one an automated rewrite is most likely to drop.

When extending a keyword pattern across locations, products, or other variants, publish only pages with distinct, accurate information and a legitimate user purpose. Swapping a city or product name into a template, imposing a one-page-per-day schedule, or adding filler to avoid looking automated does not make thin or repetitive pages useful. Google's [spam policies](https://developers.google.com/search/docs/essentials/spam-policies) cover scaled content created primarily to manipulate rankings.

## Performance review

When ongoing measurement is in scope, compare consistent date ranges and segment by query and page. Prioritize changes by business-relevant outcomes (such as qualified leads or purchases) when analytics can support them; keep impressions, clicks, average position, and conversions distinct. Treat a short-term rise or fall as a signal to investigate, not proof of cause. Consider seasonality, recent edits, and indexing delays before recommending another change.

Use search results and Search Console together to decide whether to update or create a URL. Impressions alone do not prove a page entered the top 10; check query/page data, average position, click-through rate, market, device, date range, and seasonality where available. Avoid rigid "wait 60/90 days" rules: use sufficient comparable data and state uncertainty. [Content maintenance](references/content-maintenance.md) covers pruning, repointing, and restructuring.

## Metadata review

For every changed public page, check the full page-level contract rather than just the title:

- a unique, accurate title and description that match the visible page and the search intent;
- one canonical URL with the intended protocol, host, path, trailing-slash policy, and query handling;
- indexing directives, robots behavior, sitemap inclusion, locale/alternate links, and pagination where applicable;
- Open Graph and platform card title, description, URL, image dimensions/crop, and a truthful fallback;
- icons, manifest, theme color, and structured data that agree with the rendered product identity and visible content.

Structured data must follow [Google's general and feature-specific guidelines](https://developers.google.com/search/docs/appearance/structured-data/sd-policies), describe visible page content, and not be presented as a ranking boost or guaranteed rich result. Feature eligibility changes: check the current documentation instead of assuming a type still produces a rich result.

Inspect the rendered document or framework output whenever possible. Static source or a successful build does not prove the deployed host, canonical origin, crawler access, social-card cache, or search-engine interpretation. [Technical audit](references/technical-audit.md) holds the full checklist.
