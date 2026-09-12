---
name: "openai-docs"
description: "Use official OpenAI documentation for product/API guidance, current model selection or migration, and GPT-6 Astra prompt or skill audits that require current citations."
---


# OpenAI Docs

Provide authoritative, current guidance from official OpenAI documentation. Prefer a configured OpenAI documentation tool; if it is unavailable or returns no useful result, browse only official OpenAI domains. Bundled references are migration aids, not current authority.

## Quick start

- Use `mcp__openaiDeveloperDocs__search_openai_docs` to find the most relevant doc pages.
- Use `mcp__openaiDeveloperDocs__fetch_openai_doc` to pull exact sections and quote/paraphrase accurately.
- Use `mcp__openaiDeveloperDocs__list_openai_docs` only when you need to browse or discover pages without a clear query.
- Load only the relevant file from `references/` for model selection or an explicit GPT-5.4 legacy upgrade.

## OpenAI product snapshots

1. Apps SDK: Build ChatGPT apps by providing a web component UI and an MCP server that exposes your app's tools to ChatGPT.
2. Responses API: A unified endpoint designed for stateful, multimodal, tool-using interactions in agentic workflows.
3. Chat Completions API: Generate a model response from a list of messages comprising a conversation.
4. Codex: OpenAI's coding agent for software development that can write, understand, review, and debug code.
5. gpt-oss: Open-weight OpenAI reasoning models (gpt-oss-120b and gpt-oss-20b) released under the Apache 2.0 license.
6. Realtime API: Build low-latency, multimodal experiences including natural speech-to-speech conversations.
7. Agents SDK: A toolkit for building agentic apps where a model can use tools and context, hand off to other agents, stream partial results, and keep a full trace.

## If the documentation tool is missing

Continue with official web documentation. Do not install or reconfigure MCP connections unless the user asks for that environment change.

## Workflow

1. Identify whether the request is a docs lookup, current model choice or migration, Astra prompt/skill audit, or explicit GPT-5.4 legacy upgrade.
2. If it is a model-selection request, load `references/latest-model.md`.
3. If it is an explicit GPT-5.4 upgrade request, load `references/upgrading-to-gpt-5p4.md`.
4. If the upgrade may require prompt changes, or the workflow is research-heavy, tool-heavy, coding-oriented, multi-agent, or long-running, also load `references/gpt-5p4-prompting-guide.md`.
5. For Astra prompt or skill audits, search and read the current official model guidance and the official “Rethinking skills and prompts for GPT-6 Astra” article before recommending changes. Prefer short discriminating descriptions, progressive disclosure, and task-specific guidance over large generic instruction sets.
6. Search docs with a precise query.
7. Fetch the best page and the exact section needed (use `anchor` when possible).
8. For model upgrades, make each usage site's target model, reasoning recommendation, compatibility status, and required prompt or host changes explicit.
9. Answer concisely with citations, using bundled references only as helper context.

## Reference map

Read only what you need:

- `references/latest-model.md` -> model-selection and "best/latest/current model" questions; verify every recommendation against current OpenAI docs before answering.
- `references/upgrading-to-gpt-5p4.md` -> only for explicit GPT-5.4 upgrade and upgrade-planning requests; verify the checklist and compatibility guidance against current OpenAI docs before answering.
- `references/gpt-5p4-prompting-guide.md` -> prompt rewrites and prompt-behavior upgrades for GPT-5.4; verify prompting guidance against current OpenAI docs before answering.

## Quality rules

- Treat OpenAI docs as the source of truth; avoid speculation.
- Keep quotes short and within policy limits; prefer paraphrase with citations.
- If multiple pages differ, call out the difference and cite both.
- Reference files are convenience guides only; for volatile guidance such as recommended models, upgrade instructions, or prompting advice, current OpenAI docs always win.
- If docs do not cover the user’s need, say so and offer next steps.

## Tooling notes

- Always use MCP doc tools before any web search for OpenAI-related questions.
- If the MCP server is installed but returns no meaningful results, then use web search as a fallback.
- When falling back to web search, restrict to official OpenAI domains (`developers.openai.com`, `platform.openai.com`, and `learn.chatgpt.com`) and cite sources.
