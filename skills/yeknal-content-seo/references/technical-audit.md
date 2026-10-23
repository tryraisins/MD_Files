# Technical Audit

Technical checks are separate from editorial recommendations. Report them separately, with the evidence for each, and do not present a passing check as a ranking outcome.

## Metadata contract

For every public page:

- a unique title that matches the visible page and the primary intent;
- a description written to earn the click, not to repeat the title;
- one canonical URL, absolute, with the intended protocol, host, path, and trailing-slash policy;
- indexing directives that match the page's purpose;
- locale and alternate links where the page has translations;
- Open Graph and platform card title, description, URL, and image with a truthful fallback;
- icons, manifest, and theme color that match the rendered identity;
- structured data that describes what is actually visible.

Judge title and description by rendered width in a realistic preview, not by a remembered character count.

## URL policy

- One host. Choose `www` or the apex and redirect the other permanently.
- One protocol. HTTPS everywhere, with a permanent redirect from HTTP.
- One trailing-slash policy, applied consistently, including in internal links and canonicals.
- Query parameters that do not change content should not create indexable duplicates. Prefer canonicalization or exclusion over blocking, and never chain redirects.
- Pagination should have distinct, crawlable URLs. Do not rely on deprecated `rel` hints; use clear links and, where appropriate, self-canonicals per page.
- Deleted pages return 404 or 410. Moved pages return a single 301 to the closest equivalent. Do not redirect everything to the homepage.

## Crawl and index controls

- `robots.txt` controls crawling, not indexing. A blocked URL can still be indexed from links.
- Use meta robots or response headers for page-level indexing decisions.
- Keep staging, search results, internal search parameters, and duplicate archives out of the index without blocking assets the pages need.
- Confirm that rendered content is reachable without JavaScript where the business depends on it, and that the rendered version matches what is served to crawlers.
- Check for orphan pages: URLs in the sitemap or internal data with no contextual inbound link.
- Return real status codes. A soft 404 is a page that says "not found" while returning 200.

## Sitemaps

- The sitemap is the complete inventory of canonical, indexable URLs.
- `lastmod` must reflect a real material change, not every build.
- Remove redirected, deleted, and noindex URLs.
- Keep the sitemap reachable and referenced from `robots.txt` when the project uses that convention.
- Submission is a hint, not indexing. Verify inclusion separately.

## Structured data

- Use types that truthfully describe the page. Do not mark up content that is not visible.
- Validate against the current general and feature-specific guidelines. Eligibility changes: FAQ and some other rich results have been restricted or retired, so check the current documentation before promising a rich result.
- Keep one consistent entity description across the site: organization name, URL, logo, and contact details.
- Do not add markup to influence a rich result the page does not qualify for.

## Core Web Vitals

Measure field data where the project has it; use lab tools to explain causes, not as the goal.

Published "good" thresholds: Largest Contentful Paint at or under 2.5 seconds, Interaction to Next Paint at or under 200 milliseconds, Cumulative Layout Shift at or under 0.1. Report the field value, the lab value, the date, the device class, and the URL set, separately.

Common fixes:

- **LCP:** compress and size the hero image, serve modern formats with a responsive source set, preload the actual LCP resource, remove render-blocking work ahead of it, and reduce server response time.
- **INP:** reduce JavaScript executed on interaction, split and defer non-critical bundles, break up long tasks, and avoid heavy work in event handlers.
- **CLS:** set explicit dimensions or aspect ratios on images, video, ads, and embeds; reserve space for late content; never insert content above existing content.

Lab and field disagree for legitimate reasons: device, network, cache state, and user behaviour. Report both when they differ and do not claim a ranking effect from a score.

## Internal linking and architecture

- One hub per topic, with cluster pages linking to it and to each other where the reader would continue.
- Contextual links inside body text, with anchors that describe the destination.
- Breadcrumbs on every page except the homepage, matching the visible hierarchy and the markup.
- Related content chosen by topic, not by recency.
- Check the depth of important pages: a page reachable only through several layers of navigation receives less attention than one linked from a hub.

## Implementation notes

Keep SEO logic in one place rather than scattered through templates:

- a metadata module that builds title, description, canonical, robots, Open Graph, and alternates from page data;
- a schema utility with one generator per type, fed by real page values;
- a sitemap route generated from the same source of truth as the pages;
- one component or helper that renders all head tags, so a page cannot ship half a contract.

The framework is an implementation detail. The rules above apply to static HTML, a server-rendered app, and a single-page app with prerendering alike. In a client-rendered app, confirm that the deployed HTML contains the metadata rather than only setting it after hydration.

## Pre-launch checklist

- Unique title and description on every public page, matching the visible content.
- Absolute canonical on every page, pointing at the intended URL.
- Structured data validates and matches the visible page.
- Sitemap is reachable, current, and free of non-canonical or noindex URLs.
- `robots.txt` allows the pages that should be crawled and blocks only what should not be.
- Core Web Vitals field data is within the good thresholds, or the exception is documented.
- Layout works at mobile widths with real content and real text sizes.
- No broken internal links, and no orphan pages in the sitemap.
- Images have meaningful alternative text.
- HTTPS is enforced, and every redirect is a single permanent hop.
- Share cards resolve to a real image at the expected crop.

## Verification boundary

A successful build does not prove the deployed host, the canonical origin, the CDN response, the crawler's view, or the search engine's interpretation. Inspect the rendered document and the served response from the real environment. State which of those you actually checked.
