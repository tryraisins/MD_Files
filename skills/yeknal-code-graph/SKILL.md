---
name: yeknal-code-graph
description: Use when a task starts in an unfamiliar or large repository and you need the right files in one call instead of many searches. Builds a zero-dependency local index of content terms plus imports, routes and tests, then answers with a small ranked slice inside a token budget. It is retrieval, not GraphRAG, and it never replaces grep for exhaustive matches.
---

# Code graph

A local index and budgeted retriever for a codebase. Two signals, both built without calling a model:

- **Content terms.** Every identifier and word in every file, with counts. This is what lets a question find code whose name you do not know ("how is an uploaded CV turned into text").
- **Structure.** Files, symbols, imports, HTTP routes, and tests, as a graph for expansion and impact.

Output is ranked `path:line` snippets capped by a token budget, so one query replaces several exploratory searches and reads.

## What this is not

- **Not GraphRAG.** Nothing is extracted by an LLM and no embeddings are built. Building the index costs no tokens, which is the only reason it is worth doing inside a metered session.
- **Not exhaustive.** A budgeted answer shows the strongest few files. For "find every mention of X", run `grep -rn X` and treat this index as a way to decide where to look first.
- **Not a source of truth.** Line numbers and snippets go stale the moment you edit. Confirm with a real read before relying on any line.

## When to use it

- The repository has hundreds of files and you do not know where a behavior lives.
- The question is conceptual and grep would need three or four vocabulary guesses.
- You need call sites, importers, or which tests touch a route.
- You are resuming work in a repository whose `HANDOFF.md` is thin.

## When not to use it

- Fewer than roughly 100 source files: `grep` and `glob` already answer in one call.
- You already know the identifier. Search for it directly.
- Exhaustive coverage, cross-file refactors by symbol, or anything where a missed file is a defect.
- The index is stale and you are about to edit. Refresh first.

## Workflow

1. **Build once per checkout.** The index lives in `.codegraph/graph.json`; add that path to the project's ignore file.

   ```bash
   python "<path-to-skill>/scripts/codegraph.py" build --root .
   ```

2. **Ask with the task's words, not a guessed identifier.** Keep the budget small; raise it only when the answer is truncated.

   ```bash
   python "<path-to-skill>/scripts/codegraph.py" query --root . --task "rate limiting on api requests" --budget 800
   ```

3. **Read the returned files.** The snippets tell you where to look, not what the code does. Read the surrounding function before changing it.

4. **Answer structural questions directly.**

   ```bash
   python "<path-to-skill>/scripts/codegraph.py" query --root . --symbol ApplicationRequest
   python "<path-to-skill>/scripts/codegraph.py" query --root . --impact backend/rate_limit_storage.py
   python "<path-to-skill>/scripts/codegraph.py" query --root . --file frontend/src/App.tsx
   python "<path-to-skill>/scripts/codegraph.py" query --root . --task "tests covering signup" --tests
   ```

5. **Refresh after editing.** A rebuild on a few hundred files takes about a second; a stale index is worse than no index.

## Rules

- Cite what you read, not what the index said. Any claim about behavior must come from a file read in this session.
- If a query returns nothing, fall back to `grep` and do not retry the same task with different wording more than once.
- Treat a truncated answer as a signal to narrow the question, not to raise the budget until everything fits.
- Never paste the whole index into context. Query it.

## What it costs and what it saves

The measured comparison is in `references/measurements.md`, including the cases where the index lost to plain grep. Read it before promising anyone a token saving. The short version: on a 339-file, 110k-line repository, a concept query answered in about 800 tokens and found the main implementation file in one call, but it did not reproduce the full set of files that `grep` returns. Treat it as a first hop, not a replacement.

## Requirements

Python 3.9 or newer, standard library only. No network access. Works on any repository; TypeScript and Python get the richest structure, other languages fall back to imports and symbols only.

## Limits worth knowing before trusting it

- Framework magic is invisible: decorators that register behavior at runtime, Next.js file-based routes, code-generated clients.
- A single monolith file gets found but not split. The index tells you the file and shows matching lines; it cannot tell you the region.
- Term matching ignores semantics. "Authentication" and "login" are different terms.
- Generated, vendored, and build output are skipped by directory name. If your project uses different names, edit `IGNORE_DIRS` in the script.
