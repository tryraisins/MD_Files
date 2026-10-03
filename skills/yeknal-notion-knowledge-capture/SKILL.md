---
name: yeknal-notion-knowledge-capture
description: Capture conversations and decisions into structured Notion pages; use when turning chats/notes into wiki entries, how-tos, decisions, or FAQs with proper linking.
metadata:
  internal: true
  short-description: Capture conversations into structured Notion pages
---

# Knowledge Capture

Turn conversations and notes into structured, linkable Notion pages that are easy to reuse.

## Quick start
1) Pin down what to capture (decision, how-to, FAQ, learning, documentation) and who it is for.
2) Find the right database/template in `reference/` (team wiki, how-to, FAQ, decision log, learning, documentation).
3) Pull prior context from Notion with `Notion:notion-search` → `Notion:notion-fetch` (existing pages to update or link).
4) Draft the page with `Notion:notion-create-pages` using the database’s schema; include summary, context, source links, and tags/owners.
5) Link from hub pages and related records; keep status/owners current with `Notion:notion-update-page` as the source evolves.

## Workflow
### 0) If any MCP call fails because Notion MCP is not connected, pause and set it up:
1. Add the Notion MCP:
   - `codex mcp add notion --url https://mcp.notion.com/mcp`
2. Enable remote MCP client:
   - Set `[features].rmcp_client = true` in `config.toml` **or** run `codex --enable rmcp_client`
3. Log in with OAuth:
   - `codex mcp login notion`

After successful login, the user will have to restart codex. Finish your answer and tell them that, so their next attempt can continue with Step 1.

### 1) Define the capture
- Ask about purpose, audience, freshness, and whether this is net-new or an update.
- Determine the content type: decision, how-to, FAQ, concept/wiki entry, learning/note, or documentation page.

### 2) Locate destination
- Pick the correct database using the `reference/*-database.md` guides; confirm required properties (title, tags, owner, status, date, relations).
- If several databases are candidates, ask the user which to use; otherwise create in the primary wiki/documentation DB.

### 3) Extract and structure
- Pull facts, decisions, actions, and rationale out of the conversation.
- For decisions, record alternatives, rationale, and outcomes.
- For how-tos/docs, capture steps, pre-reqs, links to assets/code, and edge cases.
- For FAQs, phrase entries as Q&A with concise answers and links to deeper docs.

### 4) Create/update in Notion
- Use `Notion:notion-create-pages` with the correct `data_source_id`; set properties (title, tags, owner, status, dates, relations).
- Use templates in `reference/` to structure content (section headers, checklists).
- If updating an existing page, fetch it first, then edit via `Notion:notion-update-page`.

### 5) Link and surface
- Add relations/backlinks to hub pages, related specs/docs, and teams.
- Add a short summary/changelog for future readers.
- If follow-up tasks exist, create them in the relevant database and link them.

## References and examples
- `reference/` — database schemas and templates (e.g., `team-wiki-database.md`, `how-to-guide-database.md`, `faq-database.md`, `decision-log-database.md`, `documentation-database.md`, `learning-database.md`, `database-best-practices.md`).
- `examples/` — capture patterns in practice (e.g., `decision-capture.md`, `how-to-guide.md`, `conversation-to-faq.md`).
