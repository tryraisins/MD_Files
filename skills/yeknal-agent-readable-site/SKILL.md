---
name: yeknal-agent-readable-site
description: "Use when a public site must be readable and quotable by AI agents: per-page markdown, llms.txt, llms-full.txt, ai.txt, head signals, crawler policy and a coverage check. Not content strategy or keywords."
metadata:
  internal: true
  llmstxt-spec-reviewed: "2026-10-26"
  ai-discovery-files-reviewed: "2026-10-26"
---

# Agent-Readable Site

Give every public page a clean machine copy and give agents the files that explain who the site is, how it is laid out, and what they may do with it. This is the delivery layer, not the content layer.

## Boundary

`yeknal-content-seo` owns the query, the page, the metadata, the structured data and the measurement. This skill owns the routes, files and headers those decisions ship through. Do not re-plan keywords here, and do not hand a content brief to this skill.

The split inside `robots.txt` follows the same line: general crawl controls, canonicals, sitemaps and status codes belong to content-seo, while the AI user-agent groups and the site-level agent files belong here.

An agent-readable surface changes what an agent can fetch cheaply. It does not earn a citation. [content-seo](../yeknal-content-seo/SKILL.md) measures whether anything was cited, and its rules against guaranteed AI placement apply here unchanged.

## Workflow

1. **Inventory public routes.** Table every route: path, data source, included in markdown, included in the full dump. Exclude admin, dashboard, auth, account, checkout, drafts, preview, internal search results and anything already `noindex`. Keep the exclusions in the same list the coverage check reads.
2. **Detect the platform tier before promising anything.** A static host cannot negotiate content types or set response headers. Read [markdown endpoints](references/markdown-endpoints.md) and record which tier is real.
3. **Build one registry**, not one route file per page. Static pages get their own renderer; a dynamic page gets a pattern renderer that reuses the same data loader the HTML route already calls.
4. **Render from data.** Never convert rendered HTML to markdown. Reuse the existing data functions so the machine copy cannot drift from the page.
5. **Generate the site files from the existing site config**: name, canonical URL, description, contact, social links. Never hardcode those facts a second time. Follow [site files](references/site-files.md).
6. **Add the head signals** on every public page: the markdown alternate link and an `ai-summary` matching what the page really contains.
7. **Set the crawler policy** in `robots.txt`, splitting answer-engine crawlers from training crawlers, and record the owner's decision on each training crawler.
8. **Run the coverage check** against the built output or the live host. A route with no renderer is a defect, not a follow-up task.
9. **Report the tiers honestly.** Say which requirements the host can satisfy, which are platform-blocked, and which you verified against the live response.

## Markdown page contract

```markdown
# <page title>

> <one factual sentence>

Canonical: https://example.com/products/widget
Last updated: 2026-01-31

<main content in reading order, as real markdown>

## Related
- [Visible label](https://example.com/related-page)
```

Rules: absolute links pointing at the HTML URL, never the `.md` one; headings and lists instead of scraped layout; tables for prices, specs and comparisons; `### Question` plus answer for FAQ blocks; listing pages paginated exactly as the HTML paginates. Leave out navigation, footer, cookie banners, modals, repeated calls to action, and anything hidden in the page.

Omit the `Last updated` line when the source has no real date. A pinned revision, content hash or genuine publish date is a fact; a build timestamp is not one, and dressing it up as `Last updated` makes every page look freshly edited.

## Rules

- Never claim that markdown endpoints, `llms.txt`, `ai.txt` or a metadata tag produces an AI citation, inclusion, ranking or traffic increase. These are affordances.
- Never expose a page the HTML version protects. If the HTML requires a session, the markdown does too, or it does not exist.
- Mirror only text a human can see on that page, including user-generated content sanitised the same way. Agent-only content is a cloaking and prompt-injection surface.
- Markdown is an alternate representation: the HTML stays canonical, the markdown response is `noindex, follow`, and `.md` URLs stay out of the sitemap.
- One source of truth per fact. If the site config does not know a value, the generated files do not invent it.
- Treat token counts, including `X-Markdown-Tokens`, as estimates and label them as such.
- Verify crawler names against the vendor's current documentation at implementation time and record the date. Names and compliance behaviour change.
- No new dependency for HTML-to-markdown conversion, and no third-party service in the read path.

## Verification

Run [the surface checker](scripts/check-ai-surface.mjs) against the deployed host, not against a build log:

```bash
node scripts/check-ai-surface.mjs https://example.com --coverage
```

It separates MUST failures from SHOULD warnings and reports host-blocked requirements as unsupported rather than passing. Keep its output as the record. A green build, a generated file list or a sitemap entry proves nothing about the response an agent receives; [technical audit](../yeknal-content-seo/references/technical-audit.md) holds the wider crawl contract.
