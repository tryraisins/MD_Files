# Content Maintenance

The cheapest traffic a site has is already published. Fixing existing pages usually beats publishing another one, and the work is faster to verify.

Run the three moves in this order. Each one assumes the previous one is done.

1. Remove or merge pages that earn nothing and dilute the site's topic.
2. Repoint surviving pages at the queries they actually earn.
3. Group what remains into a structure with clear hubs.

## Move 1: prune

Candidate criteria, all of which must hold:

- no clicks in a comparable period;
- negligible impressions in the same period;
- published long enough to have had a fair chance;
- no business function the metrics cannot see.

Classify each candidate as delete, merge into another URL, redirect to a better match, rewrite, or keep. "Keep" is a legitimate outcome and should be recorded.

Never delete:

- a page that converts even without search clicks;
- a page required for legal, support, or trust reasons;
- a page that external sites link to, unless the link equity is redirected;
- a page newer than the evidence window.

Deletion is irreversible and is a person's decision. The model proposes and ranks; code or the user vetoes. See [publishing and change control](publishing-and-change-control.md).

A useful side effect: removing pages nobody needed makes the site's subject clearer, which helps the remaining pages.

## Move 2: repoint

This is the step most often skipped, and it usually moves the most traffic.

1. For each page, list the queries it earns impressions for.
2. Compare that list with the query the page was written for.
3. Where the two differ, decide whether the page can serve the earned query well.
4. If it can, bring the page into line: title, H1, description, the first paragraph, and the sections that answer the query.
5. If it cannot, the page is answering the wrong question. Rewrite the substance or merge it into the page that does answer it.

The last step is the one people skip. Swapping the heading and leaving the body answering something else makes the page worse, because now neither the reader nor the engine gets a clear answer.

Do not argue with the evidence. If the engine consistently associates the page with a query the page can serve, that association is an asset.

## Diagnose before choosing a fix

High impressions with low clicks has more than one cause, and the causes have opposite fixes.

| Signal | Likely cause | First fix |
| --- | --- | --- |
| Position roughly 8 to 20, decent impressions, low CTR | Ranking but not well enough to be chosen | Improve relevance, depth, and internal links; earn coverage for the page |
| Position 1 to 5, declining CTR over time, stable position | A result feature or an AI answer is taking the click | Check what now occupies the result; a title rewrite will not recover an answer panel |
| Impressions up, clicks flat, new queries appeared | The page entered a broader result set | Check the new queries; consider a dedicated page only if the intent differs |
| Clicks down, position down, no recent edit | Competitor, algorithm, or demand change | Check the result page and the market before editing |
| Clicks down shortly after an edit | Unverified change | Wait for a comparable window, then restore if it holds |

State which cause the evidence supports. Do not present one as the other.

## Move 3: regroup

1. Cluster the remaining pages by topic, using the queries they earn.
2. Create or designate one hub per cluster that links to its members and explains the topic.
3. Link members to each other where the reader would plausibly continue.
4. Put the links in body text, inside sentences that describe the destination.

Forty loose pages become four or five clusters. This compounds slowly rather than spiking, and it makes every later internal link decision easier.

## Evidence windows

Changes need a comparable period before they can be judged.

- Compare like with like: same query set, same market, same device split, same season if possible.
- Expect a dip after a material change. Do not revert on a short dip; revert when the comparable window shows a real loss.
- Do not apply calendar rules such as "always wait 60 days". Use enough comparable data to see a direction, and say what "enough" means for this site.
- On a young site, indexing and evaluation can take months. That is a reason to state uncertainty, not a reason to keep editing.

## A repeatable review

Produce one artifact per review, in the project's notes:

1. Period compared, and the exact query and page set.
2. Pages that gained and lost impressions and clicks, with the cause the evidence supports.
3. Pages that newly entered a strong position band, queued for a brief.
4. Pages edited recently, marked "wait" with the date they can be judged.
5. Pages with a good brief, outside the strong band, and older than the window, queued for links or a rewrite.
6. Five actions ranked by business value, not by traffic.

Ranking by business value is the part that gets skipped. A page with 40 clicks that produces leads outranks a page with 4,000 clicks that produces none.

## Failure modes

- Pruning new pages before they had a chance.
- Deleting because a model recommended it, with no materiality check.
- Swapping the H1 without rewriting the body.
- Treating a CTR drop as a ranking problem, or a ranking drop as a copy problem.
- Reverting a change during the normal dip.
- Rebuilding the structure before removing the dead pages.
- Reporting traffic without reporting what the traffic did.
