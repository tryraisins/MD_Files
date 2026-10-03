---
name: yeknal-content-seo
description: Unified content marketing and technical SEO guidance for useful, accessible web content. Use when planning, writing, auditing, or improving pages, metadata, information architecture, structured data, crawlability, sitemaps, canonicalization, or change-driven IndexNow submission.
metadata:
  internal: true
  indexnow-source-reviewed: "2026-09-07"
---

# Content and SEO

Anchor every decision in reader intent and product evidence. Produce genuinely useful content first, then structure it so people and search engines can understand it.

## Workflow

1. Define the audience, search intent, decision stage, primary action, and success measure.
2. Audit the current content, search intent, internal links, structured data, titles, descriptions, headings, canonical URLs, and indexability.
3. Shape a clear information hierarchy: one primary topic per page, with descriptive links throughout.
4. Write specific, accurate, scannable copy that uses real examples and accessible language.
5. Add metadata and structured data only where they truthfully describe visible content.
6. Verify mobile layout, performance, accessibility, crawlability, sitemap accuracy, and analytics events.
7. When published URLs are added, materially updated, redirected, or deleted, evaluate IndexNow as a change-notification channel. Read [the IndexNow workflow](references/indexnow.md) before implementing or submitting.

## Rules

- Never keyword-stuff, hide text, fabricate expertise, or promise rankings.
- Prefer original evidence, clear authorship, and useful depth over padded length.
- Keep headings, metadata, URLs, and schema aligned with the actual page.
- Report technical SEO checks separately from editorial recommendations.
- Treat sitemap discovery, an IndexNow `200`/`202`, crawl activity, and actual indexing as separate proof boundaries. Submission alone never guarantees ranking or indexing.

## Metadata review

For every changed public page, check the full page-level contract rather than just the title:

- a unique, accurate title and description that match the visible page and the search intent;
- one canonical URL with the intended protocol, host, path, trailing-slash policy, and query handling;
- indexing directives, robots behavior, sitemap inclusion, locale/alternate links, and pagination where applicable;
- Open Graph and platform card title, description, URL, image dimensions/crop, and a truthful fallback;
- icons, manifest, theme color, and structured data that agree with the rendered product identity and visible content.

Inspect the rendered document or framework output whenever possible. Static source or a successful build does not prove the deployed host, canonical origin, crawler access, social-card cache, or search-engine interpretation.
