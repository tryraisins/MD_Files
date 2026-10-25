---
name: yeknal-openai-docs
description: Answer OpenAI product, API, and model questions from official OpenAI documentation with citations. Use for docs lookups, current model choice or migration, and GPT-5.4 upgrade planning.
metadata:
  internal: true
---

# OpenAI Docs

Give authoritative, current guidance drawn from official OpenAI documentation. Prefer a configured OpenAI documentation tool; if none is available or it returns nothing useful, browse only official OpenAI domains. The bundled references are migration aids, not current authority.

## Workflow

1. Classify the request: a docs lookup, current model choice or migration, or an explicit GPT-5.4 legacy upgrade.
2. Call `mcp__openaiDeveloperDocs__search_openai_docs` with a precise query. Use `mcp__openaiDeveloperDocs__list_openai_docs` only when you must browse without a clear query.
3. Call `mcp__openaiDeveloperDocs__fetch_openai_doc` for the exact section (use `anchor` when possible) and quote or paraphrase it accurately.
4. For model selection, load `references/latest-model.md`.
5. For an explicit GPT-5.4 upgrade request, load `references/upgrading-to-gpt-5p4.md`.
6. If the upgrade may require prompt changes, or the workflow is research-heavy, tool-heavy, coding-oriented, multi-agent, or long-running, also load `references/gpt-5p4-prompting-guide.md`.
7. For model upgrades, make each usage site's target model, reasoning recommendation, compatibility status, and required prompt or host changes explicit.
8. Answer concisely with citations, using bundled references only as helper context.

## Reference map

Read only what you need:

- `references/latest-model.md` -> model-selection and "best/latest/current model" questions; verify every recommendation against current OpenAI docs before answering.
- `references/upgrading-to-gpt-5p4.md` -> only for explicit GPT-5.4 upgrade and upgrade-planning requests; verify the checklist and compatibility guidance against current OpenAI docs before answering.
- `references/gpt-5p4-prompting-guide.md` -> prompt rewrites and prompt-behavior upgrades for GPT-5.4; verify prompting guidance against current OpenAI docs before answering.

## Tooling notes

- Always use MCP doc tools before any web search for OpenAI-related questions.
- If the MCP server is installed but returns no meaningful results, fall back to web search.
- When falling back to web search, restrict to official OpenAI domains (`developers.openai.com`, `platform.openai.com`, and `learn.chatgpt.com`) and cite sources.
- If multiple pages disagree, cite both and name the difference.
- If the docs do not cover the request, say so and offer next steps.
