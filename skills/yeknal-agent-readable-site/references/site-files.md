# Site Files

Three root files, all generated from the same site config, so a fact is written once.

## Single source of truth

Collect the canonical name, legal name, URL, one-paragraph description, contact address, logo, and social profiles from the config the site already uses. Generate `llms.txt`, `llms-full.txt`, `ai.txt` and the Organization JSON-LD from it. If a value is missing, leave it out rather than inventing it, and never paste the same string into several files by hand.

## llms.txt

`text/plain; charset=utf-8`, generated from code so it cannot go stale. It follows the [llmstxt.org](https://llmstxt.org) convention: a curated index for an agent that has chosen to read it, not a crawler instruction and not a ranking signal.

```markdown
# Site name

> Two or three sentences: what this is, who it is for, what makes it different.

Short paragraph of key facts: founding, pricing model, audience, contact.

## Core pages
- [Pricing](https://example.com/pricing.md): what the plans cost and what is included.

## Docs / Guides
- [Getting started](https://example.com/docs/start.md): install, first project, common errors.

## Main content
- [Latest 20 posts](https://example.com/blog.md): titles and dates; the full list is at /blog.

## Machine-readable
- [Full content](https://example.com/llms-full.txt)
- [Markdown catalog](https://example.com/api/md/_catalog)
- [Sitemap](https://example.com/sitemap.xml)
- [AI usage policy](https://example.com/ai.txt)

## Optional
- [Terms](https://example.com/terms.md), [Privacy](https://example.com/privacy.md)
```

- Point links at the `.md` versions, because that is the cheaper fetch for the reader this file is for.
- Describe each link factually. No superlatives, no marketing lines.
- Cap a dynamic collection at roughly 50 entries and name where the full list lives.
- Revalidate daily or on content change.
- If the repository also keeps an `llms.txt` of its own as a catalog index, keep the two clearly distinct. The site file describes the site; a catalog index describes a repository.

## llms-full.txt

`text/plain; charset=utf-8`, assembled from the same renderer registry so it cannot disagree with the individual pages.

```markdown
# Site name - full content
> One line describing the site.
Generated: 2026-01-31

---
<!-- source: https://example.com/pricing -->
<markdown of that page>

---
<!-- source: https://example.com/about -->
```

- Order: core pages, then docs, then main content, then legal.
- For a large collection, include the top N by importance or recency, state the limit and where the rest lives.
- Keep the total under roughly 500,000 characters and log a warning past it instead of silently truncating a page mid-sentence.
- Cache it hard (`s-maxage=86400`, `stale-while-revalidate=604800`), build it once, and never assemble it per request.

## ai.txt

Advisory permissions file. The current specification is `ai.txt` v1.7.0 inside the [AI Discovery Files](https://www.ai-visibility.org.uk/specifications/ai-txt/) set, currently v1.14.0. Read the live spec and its `registry.json` before publishing, because the file set and version numbers move.

The current documented form uses H2 headings. Earlier revisions used bracketed headers such as `[permissions]`, and consumers should still accept them, but publish the H2 form.

```markdown
# AI usage policy for Example Ltd

Lang: en-GB
Website: https://example.com
Last Updated: 2026-01-31

## Permissions

AI systems may summarise public pages, quote with attribution, answer factual questions about the business, and include the site in search results.

## Restrictions

AI systems must not generate quotes attributed to a named person without a source, imply endorsement, reproduce a full article instead of summarising and linking, or present general guidance as advice to a specific reader.

## AI Training

Public pages may be used for training. Client material and account data may not.

## Attribution Requirements

Cite the site name with the canonical URL, plus the page title and date where one exists.

## Contact

ai@example.com

## Related Files

- [llms.txt](https://example.com/llms.txt)
- [robots.txt](https://example.com/robots.txt)
```

- Required: one H1, the `Website:` and `Last Updated:` identity lines, a `Permissions` section with at least one item, and a `Restrictions` section with at least one item.
- Recommended: attribution, contact, related files. Optional: training, licence, citation format, crawler access, content types, scope, retention.
- Not permitted: contradictory rules, unenforceable demands, legal threats, vague language such as "be respectful", competitor comparisons, secrets, or a rule that contradicts `robots.txt`.
- The file states preference. It is not a contract and has no enforcement mechanism, which the spec says itself. Do not sell it to a client as protection.
- Keep the name and URL identical to `llms.txt` and the Organization JSON-LD.

## robots.txt

Split the AI user agents into three groups, because they mean different things.

| Group | User agents | Effect of allowing |
| --- | --- | --- |
| Answer-engine indexers | `OAI-SearchBot`, `Claude-SearchBot`, `PerplexityBot` | the site can be retrieved and cited in answers |
| User-initiated fetchers | `ChatGPT-User`, `Claude-User`, `Perplexity-User` | a user pasting or asking about a URL can be answered from it |
| Training controls | `GPTBot`, `ClaudeBot`, `CCBot`, `Bytespider`, plus the `Google-Extended` and `Applebot-Extended` tokens | whether content may train or ground models |

- Allow the first two groups on public paths. A vendor cannot retrieve what it is not allowed to fetch, so blocking these removes the site from that vendor's answers. Allowing them is necessary for that, and nothing more.
- Blocking the third group is the owner's decision, not the agent's. Say plainly that blocking training crawlers does not remove the site from answer engines, and that blocking `Google-Extended` does not affect Search inclusion because it is a control token rather than a crawler.
- User-initiated fetchers act on a user's request, and their `robots.txt` compliance varies by vendor. Do not treat a rule as a guarantee that no fetch happens.
- Disallow private paths for every agent, and keep that list identical to the excluded paths in `ai.txt`.
- Add `Sitemap:` and comments pointing at `/llms.txt` and `/ai.txt`. Each of the three files carries a "keep in sync with" note naming the other two. A `Content-Signal` directive is optional and non-standard; label it as such or omit it.

### The static-host gap

On a host that cannot set `X-Robots-Tag`, the `.md` files cannot carry `noindex`. Do not fix that by adding `Disallow` for them: that blocks the agents the whole surface exists for. Leave them out of the sitemap, link them only as `rel="alternate"`, and accept the residual risk, since `text/markdown` and `text/plain` are not indexed as pages.

## Head signals

- `<link rel="alternate" type="text/markdown" href="https://example.com/pricing.md">` on every public page.
- A `Link: <https://example.com/llms.txt>; rel="describedby"` response header advertising the three site files. Tier B only, since it is a header.
- `<meta name="ai-summary" content="...">`: one or two factual sentences describing what this page contains, written for a model that already fetched it. Default it to the page description and write a specific one for the home, pricing and main listing pages.
- Organization and WebSite JSON-LD on the home page, built from the same config. If the site already has them, check that the facts match and leave them alone.
- No MCP discovery file unless the project actually runs an MCP server. List that as skipped instead of shipping a dead document.

## What each artifact actually is

| Artifact | Status |
| --- | --- |
| `llms.txt`, `llms-full.txt` | community convention from llmstxt.org. No vendor guarantees that an agent reads it |
| `ai.txt` | an open, versioned specification whose own text calls it advisory |
| `ai-summary` meta | a non-standard hint with no documented consumer contract |
| `rel="alternate"` for markdown | a real HTML link relation, declaring an alternate representation of the page |
| AI user-agent groups in `robots.txt` | honoured where the crawler chooses to |
| Organization JSON-LD | documented structured data with feature-specific guidelines |

These files make the site fetchable and attributable by an agent that chooses to read them. Whether any agent does is not measured here, and no checker score should be reported as a citation.

## Verification boundary

Generated files in a build directory are not evidence. Fetch `/llms.txt`, `/llms-full.txt` and `/ai.txt` from the deployed host, confirm the content type, confirm every link in `llms.txt` resolves, and confirm the name and URL match the page's JSON-LD.
