---
name: yeknal-project-handoff
description: Create, update, or resume work from a concise repository-root HANDOFF.md so another agent can continue without the current conversation. Use for substantial ongoing projects, milestones, and task handoffs.
---

# Project handoff

Keep important project state in the repository so another capable agent can continue without the current conversation. A handoff is a compact working brief, not a transcript and not a substitute for source, tests, or repository instructions.

## Start or resume work

1. Read applicable `AGENTS.md` files and `HANDOFF.md` before substantial work.
2. Check the working tree, recent changes, relevant source, tests, and current runtime or build evidence.
3. Treat the handoff as a navigation aid, not unquestioned truth. Reconcile it against the repository and fix stale claims before relying on them.
4. Preserve useful existing context and unrelated user changes. Do not overwrite a still-useful handoff with a generic template.

## Web floor block

For a web project with user-facing routes, record the floor in the handoff so the next agent sees a missing piece without reading four skills:

```md
## Web floor
not-found:  app/not-found.tsx
icon:       public/icons/
meta:       app/layout.tsx metadata template
share:      app/opengraph-image.tsx
crawl:      public/robots.txt, app/sitemap.ts
analytics:  none
```

Write the real path, or the word `missing`. A path is a claim the next agent can check against the repository; `missing` is a work item with an owner. Never write `present`, `done`, or `ok`, because none of those can be verified from the tree.

Adapt the names to the stack. A Next.js app uses `app/not-found.tsx`; a React Router app uses a `path="*"` route; an Express server uses a terminal not-found middleware. The behavior is the constant, the path is not.

A private authenticated app takes `crawl: robots Disallow, no sitemap`. A public site takes both files. `analytics: none` is an honest answer and stays out of the floor; consent and purpose belong to `yeknal-launch-readiness`.

The block is a pointer, not a specification. The rules stay with their owners: recovery and states with `yeknal-ui-quality-baseline`, metadata and crawl files with `yeknal-content-seo`.

## Keep it safe and trustworthy

- Never put secrets, credentials, private keys, or sensitive personal data in the handoff.
- Do not record routine command output, full diffs, or conversation history.

When no handoff is warranted, leave the repository without one and summarize needed continuity in the task response.
