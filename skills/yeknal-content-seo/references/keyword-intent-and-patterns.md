# Keyword Intent and Patterns

Traffic is not the objective. A query is worth targeting when the person searching can act on the answer: they have a problem, a budget, or a decision to make. Treat every other query as a later-stage investment, not a first one.

## Decide what the query is worth

- A commercial query can be served by a page that sells, prices, compares, or routes to a next step.
- An informational query can build an audience, but it rarely pays in the first months and it is the easiest kind to write badly.
- Low volume is not disqualifying. A query with 90 monthly searches where every searcher is choosing a replacement can outperform a broad query with 20,000 searchers who want a definition.
- Judge by the action the page can offer, not by the size of the number.

## Read intent from the results page

A keyword tool labels a broad category. The live results show what Google decided the query means. Read the top results and record the dominant page type.

| Result type that dominates | Intent | Page that can win |
| --- | --- | --- |
| Definitions, explainers, how-to guides | Informational | Guide or reference page, usually not a first priority |
| Service pages, landing pages, category pages with prices | Commercial | Service, category, or product page |
| "X vs Y", "best X", "alternative to X", review roundups | Commercial investigation | Comparison, alternative, or an honest ranked list with verdicts |
| Product detail pages and marketplaces | Transactional | Product page with real availability and terms |
| Map pack, business profiles, local directories | Local commercial | Location page plus a complete business profile |
| Forum threads, video, social posts | Research and community | Coverage you earn inside those surfaces, not a page you own |

Two rules follow:

1. Do not target a query whose dominant result type the site cannot honestly produce. A blog post does not win a page full of priced service pages.
2. Check the result page again when the query is close but not identical. Two queries that look alike can return different page types, and that difference is the whole decision.

## One query is one page. A pattern is a system

A pattern is a set of queries with the same intent where the results return the same page type every time, and one variable changes.

Software examples:

- "[Tool A] vs [Tool B]"
- "Best [category] for [segment]"
- "[Tool] alternative"
- "[Tool] + [integration]"
- "[Tool] pricing"

Local examples:

- "[service] [city]"
- "[category] [city]"
- "[service] [neighbourhood]"

One pattern produces a set of pages with one brief each. If the result type changes as the variable changes, it is not one pattern; split it.

## Find patterns without paid tooling

1. Search suggestions. Type the seed with a wildcard before and after it (`* seed`, `seed *`), then read the suggestions. Each position surfaces a different batch.
2. People also ask and related searches. These show the questions Google already associates with the query.
3. Volume and difficulty from a keyword tool if the project has one. If it does not, write "not measured". Never estimate a volume from intuition or from another query's popularity.
4. Competitor structure. Search the competitor's domain for the pattern, read their sitemap, or look at their navigation. Their page inventory shows which patterns they consider worth maintaining.
5. Existing site data. Search Console queries that already produce impressions close to your pages are the cheapest patterns available, because the site has started to rank.

## Page-type families for software, in priority order

The order reflects intent strength and how hard the result page is to win.

1. **Alternative pages.** "Alternative to X", "free alternative to X", "cheaper alternative to X". The incumbent rarely writes a page that helps a buyer leave, so the field is thin.
2. **Comparison pages.** "X vs Y", "X or Y", "X vs Y vs Z". Most of the field is vendor copy and affiliate content. Be accurate about the rows where you lose; that is what makes the rest credible.
3. **Integration pages.** "X + [platform]". Each page borrows demand from another product's brand and usually faces little competition.
4. **Constraint pages.** "Without subscription", "open source", "no credit card". These are binary filters. If the product meets the constraint, the page can win outright. If it does not, do not write it.
5. **Pricing pages.** Buyers search price before product. Directories occupy many of these results, so expect to need some authority first.
6. **Use-case pages.** "For lead generation", "for prospecting". The page ranks for the job rather than the category. Slower to land.
7. **Problem pages.** The reader does not know the category exists. Weak competition, lower intent, real payoff later.
8. **Feature pages.** Only for features where the product genuinely leads. Otherwise the page is a directory listing about yourself.
9. **Company-size pages.** Usually the same page with three words changed. Treat as one page with sections, not a pattern, unless each segment has genuinely different needs and evidence.

## Local patterns

Local demand is served by service and place combinations:

- "[service] [city]" and "[category] [city]" for the main market;
- the same pattern for suburbs and neighbouring towns, where competition is thinner and the buyer is equally qualified;
- "[service] near me" is proximity, not a page. It cannot be targeted with copy.

A place page needs something only that place can say: local facts, prices, projects, photographs, response times, testimonials. See [local search](local-search.md).

## Judge winnability

Three filters, applied before any writing:

1. **Page-type match.** Can the site produce the page type that wins the results, better than the current top results, honestly?
2. **Support.** Do the ranking pages have a level of linking-site diversity, brand demand, and site depth the project could plausibly reach in its planning horizon? Look at the pages, not only at a third-party authority score. Those scores are estimates and none of them is Google.
3. **Narrower variant.** Is there a more specific version of the query with the same buyer and thinner results? Take that first.

A young site should start with one pattern, five to ten pages, and a measured demand signal. Head terms can wait until the site has topical depth and some coverage.

Record the evidence behind each judgement. "We cannot win this yet because the top five are all established vendors with thousands of referring sites" is useful. "Difficulty 62" is not.

## Output: a keyword map

Produce a table the project can act on, in its existing SEO notes if it keeps one:

| Query | Pattern | Volume | Result page type | Current URL | Decision | Reason |
| --- | --- | --- | --- | --- | --- | --- |
| ... | ... | measured or "not measured" | observed | existing URL or none | update, create, or skip | evidence |

Every row needs a decision. A list of queries without decisions is not a plan.

## Failure modes

- A list of informational queries because they were easy to find.
- Head terms first because they look impressive.
- A pattern whose variants would differ only by the swapped word. That is the doorway pattern in [page decisions and briefs](page-decisions-and-briefs.md).
- Sorting by volume, which puts the least winnable query at the top.
- Treating a third-party difficulty score as a Google threshold.
- Choosing a query whose result page the team cannot maintain.
