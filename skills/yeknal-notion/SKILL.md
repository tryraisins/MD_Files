---
name: yeknal-notion
description: Capture, prepare, research, or update Notion pages. Turn conversations into wiki entries and decisions, build meeting agendas from templates, write cited research briefs, and refresh existing pages. Use when the request names Notion.
metadata:
  internal: true
  short-description: Capture, meet, research, and update in Notion
---

# Notion

One hub for the four things a request can ask of a Notion workspace. The mode is chosen by what the user wants to end up with, not by which page they opened.

## Modes

| Mode | The user wants | Read |
| --- | --- | --- |
| Capture | a decision, how-to, FAQ, learning, or wiki entry written down and linked | `references/*-database.md` |
| Meeting | an agenda or pre-read for a specific meeting | [references/meetings.md](references/meetings.md) |
| Research brief | findings from several Notion pages, with citations | [references/research-brief.md](references/research-brief.md) |
| Update | an existing page corrected, extended, or re-statused | the Update steps below |

If a request spans two modes, finish the document first, then update it. Never run two modes against the same page at once.

## Connect Notion before the first call

The Notion tools arrive through an MCP server configured in the user's agent client. If a call fails because Notion is not connected, stop and say so, name the client you are running in, and ask the user to connect the Notion MCP server for that client. Do not paste setup commands for a different client, and do not retry the call until it is connected.

Once it is connected, re-read the page or search result rather than trusting an earlier attempt.

## 1. Capture

1. Pin down what to capture and for whom: purpose, audience, freshness, and whether this is new or an update.
2. Pick the destination database from `references/`: team wiki, how-to, FAQ, decision log, learning, or documentation. Confirm its required properties (title, tags, owner, status, date, relations). When several fit, ask which; otherwise use the primary wiki or documentation database.
3. Pull prior context with `Notion:notion-search`, then `Notion:notion-fetch`, so the new page links to what already exists.
4. Extract the facts, decisions, actions, and rationale. For a decision record, include alternatives, rationale, and outcome. For a how-to or doc, include steps, prerequisites, asset and code links, and edge cases. For an FAQ, phrase each entry as a question with a short answer and a link to the deeper doc.
5. Create the page with `Notion:notion-create-pages` against the correct `data_source_id`, structured by the database's template.
6. Add relations and backlinks to hub pages and related records, plus a short summary a future reader can scan.

## 2. Meeting

1. Establish the objective, the decisions needed, attendees, duration, and prior material.
2. Search and fetch the relevant Notion pages: past notes, specs, OKRs, open actions.
3. Choose the template with the selection guide in [references/meetings.md](references/meetings.md), then adapt its sections.
4. Write the agenda or pre-read with `Notion:notion-create-pages`: owner and timebox per item, expected output per item, and links to the pre-reading.
5. Add follow-up owners and dates, and create or link tasks in the relevant database.

Agenda prose does not need research padding. Add outside facts only where a decision depends on them, and cite each one.

## 3. Research brief

1. Search with targeted queries, confirm the scope, then fetch the pages and record each URL or ID as you go.
2. Select the output shape: quick brief, research summary, comparison, or comprehensive report.
3. Outline before writing, grouping findings by question or theme. Note evidence with source IDs and flag gaps and contradictions.
4. Draft with `Notion:notion-create-pages`: title, summary, key findings, supporting evidence, and recommendations where relevant.
5. Cite with page mentions and a Sources section, following [references/research-brief.md](references/research-brief.md). Link back to every source page.
6. Close with highlights, risks, open questions, and any follow-up tasks.

## 4. Update

1. Fetch the page first; never edit from memory of an earlier fetch.
2. Change only the sections the request names, preserving unrelated content, properties, and relations.
3. Keep properties current: status, owner, and dates move with the content.
4. Add a one-line changelog entry when the page has readers who track changes.
5. Report the page URL and exactly what changed.

## References

| File | Read when |
| --- | --- |
| `references/*-database.md` | Choosing or configuring a capture destination |
| [references/meetings.md](references/meetings.md) | Preparing a meeting or picking a template |
| [references/research-brief.md](references/research-brief.md) | Citing sources or shaping a brief |
| `examples/` | Seeing a finished capture |

Adapted from the Notion knowledge-capture, meeting-intelligence, and research-documentation skills (Notion Labs, MIT). Licence: [LICENSE.txt](LICENSE.txt).
