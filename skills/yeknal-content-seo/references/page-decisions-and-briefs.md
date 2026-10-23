# Page Decisions and Briefs

Most expensive SEO mistakes are avoidable before any writing: publishing a second page for an intent the site already serves, or publishing a page that adds nothing to what already ranks.

## Update or create

Decide with query and page data, not with the keyword list.

1. Filter performance data by the exact query, then look at the pages that received impressions or clicks.
2. If a page already earns clicks for the query, improve that page. Do not create a competitor inside the same site.
3. If a page earns impressions but few clicks, it is already eligible and appearing somewhere. Improve it before adding another URL.
4. If no page appears for the query at all, create one.

When no performance data is available, search the site for the query and read the closest pages. Treat the decision as provisional and say so.

### Cannibalisation

Two URLs targeting one intent alternate, split links, and give the engine no clear answer. Detect it by checking whether more than one URL receives impressions for the same query in the same period.

Resolution order:

1. Keep the URL with the strongest combination of clicks, links, and internal link support.
2. Merge the unique material from the other URL into it.
3. Redirect the weaker URL to the survivor, with a single-hop permanent redirect, when the content is genuinely merged.
4. Rewrite the weaker URL for a different, evidenced intent if it has its own value.

Do not keep both because both have some traffic. That is the condition, not the defence.

## Harvest the secondary queries

The page that ranks first for the primary query is also earning impressions for a cluster of related queries. That cluster is evidence of what the engine considers the same page.

1. Identify the current top result for the primary query.
2. List the queries that exact URL receives impressions for, or ranks for, beyond the primary one.
3. Keep only the queries the page can genuinely answer with the content it will contain.
4. Use them in the title, the headings, and the body where they fit naturally. Do not add sections that exist only to contain a phrase.

This is how one page earns several related queries without becoming a list of unrelated headings.

## Title and description

- The title is the page's identity and its strongest relevance signal. One precise noun phrase decides which query cluster the page belongs to. A qualifier in parentheses can legitimately cover a second, closely related query when the page serves both.
- The description rarely changes ranking. Its job is to earn the click, so state the differentiator, price, constraint, or outcome.
- Judge both by rendered width in a realistic result preview, not by a character count remembered from an old article. Truncation depends on the pixel width of the glyphs, and the preview differs by device.
- Do not add "best", a year, or a superlative unless the page supports the claim and the information is current.

## The brief

Write the brief before the page. A brief that cannot be written means the decision is not settled.

| Field | Content |
| --- | --- |
| Primary query | The exact query, with the intent and result page type observed |
| Decision | Update or create, with the URL |
| Audience | Who is searching and what they are deciding |
| Sections | The sections the top results all cover, in the order the results answer them |
| Differentiator | The one thing this page has that the others do not |
| Secondary queries | Evidenced related queries the page genuinely answers |
| Internal links | Source pages that should link here, and the anchor text |
| Structured data | The types that truthfully describe this page |
| Success measure | The outcome that shows the page worked |

Save the brief where the project keeps SEO notes. Do not edit the site while writing it.

## The differentiator

Every page needs one element the competing results lack. Google's spam policy on scaled content applies regardless of whether the content came from automation, people, or both, and it targets large amounts of unoriginal content that gives readers little value. Volume is not the violation. Unoriginal is.

Choose from:

- original data the team measured or collected;
- a calculator, simulator, estimator, or quiz that routes the reader to an answer;
- real photographs of the work, team, place, or product;
- video that answers the query;
- a first-hand result, with the method and limits stated;
- a verdict that names where the alternative is better.

One of these per page, or do not publish the page. The differentiator is also the thing most likely to disappear in an automated rewrite, which is why [publishing and change control](publishing-and-change-control.md) gates it.

## Template and process file

An agent without a template invents a layout and drifts. Two artefacts prevent that.

**Template.** Rebuild one existing page the project already likes as the canonical template: same structure, title pattern, description pattern, heading hierarchy, recurring blocks, call to action placement, and locale pairs. Rebuild it from the rendered source, not from a screenshot description. Verify the rebuilt version against the original before adopting it.

**Process file.** A short file the agent reads before every page. Keep it to rules that are specific to this site:

- build on the template, never invent a layout;
- add contextual links from related pages, from inside body text, with anchors that describe the destination;
- keep locale pairs linked with correct language annotations;
- add only structured data that matches what is on the page;
- update the sitemap on every publish;
- request indexing only through the project's existing workflow.

The internal link rule is the one that pays, because no person remembers to do it consistently.

### The sitemap trap

Leaving a CMS removes the plugin that used to maintain the sitemap. The page goes live, the sitemap stops changing, and nothing warns anyone. Verify after publishing that the new or updated URL appears with an accurate last-modified value. Do not treat sitemap inclusion as indexing, and do not treat its absence as harmless.

## Duplicating a pattern

Once one page in a pattern is right, the next pages are the same brief with a different variable. Build the first one carefully; every weakness multiplies.

Every variant needs substance only that variant can carry: local facts, prices, projects, photographs, testimonials, availability. A page where only the city or product name changes is a template with find and replace. Google's spam policies describe doorway abuse in exactly those terms: pages targeted at specific regions that funnel users to one destination.

Cadence follows capacity and evidence, not a universal number. A steady schedule that the team can sustain for months is better than a burst followed by silence, but do not impose a fixed daily or weekly count as an SEO rule and do not add filler to look active.

## Multilingual

- A country-code domain signals a country strongly. Use a `.com` with language subdirectories when the goal is genuinely multilingual; do not assume a country domain can serve several markets because the markup is correct.
- The language switcher must reach the equivalent URL, not the homepage.
- Set the document language and reciprocal alternate links between every translated pair.
- Incorrect alternates make the versions compete with each other instead of covering two markets.
- Translate the substance, not the labels. A machine translation of a page whose examples are local to one market is not a second market page.

## Failure modes

- Creating a page because the query is new to the team, not to the site.
- Keeping two URLs because both have some clicks.
- A brief that lists headings but no differentiator.
- A title written for a character count rather than a preview.
- Publishing a pattern before the first page has proven the pattern.
- Leaving the CMS and assuming the sitemap still updates.
- Translation as a find-and-replace on a page built for one market.
