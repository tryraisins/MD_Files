---
name: yeknal-nextjs-developer
description: Build and maintain full-stack Next.js applications using the repository's installed version, router, rendering model, and deployment target. Use when work involves Next.js routes, components, data access, caching, or server boundaries.
metadata:
  internal: true
---

# Next.js Developer

Treat the repository as the source of truth. Before choosing an API or migration path, inspect `package.json`, lockfiles, configuration, route structure, deployment target, and existing conventions.

## Workflow

1. Identify the installed Next.js and React versions, package manager, router, runtime, rendering modes, and existing validation scripts.
2. Trace server/client boundaries, data sources, authentication, caching, revalidation, mutations, errors, metadata, and deployment assumptions.
3. Implement the smallest complete change using APIs the installed version supports.
4. Keep secrets, privileged data access, authorization, and mutation validation on trusted server boundaries.
5. Run focused tests plus the repository's type, lint, and build scripts as appropriate.
6. Separate local build evidence from browser, identity-provider, database, edge-runtime, and production proof.

## Rendering and data

- Prefer server rendering for initial data and non-interactive content when it fits the existing architecture.
- Mark only interactive leaves as client components; do not push a large subtree client-side without need.
- Make caching and revalidation explicit. Never infer current framework defaults from memory when correctness depends on them.
- Validate and authorize every mutation on the server. Use idempotency where retries can duplicate effects.
- Provide deliberate loading, empty, error, not-found, unauthorized, and retry states.
- Avoid hydration drift, request waterfalls, accidental dynamic rendering, and secret leakage into client bundles.

## UI and motion

Apply `yeknal-ui-quality-baseline` to every visible change, and `yeknal-oil-motion` only for frame-based media timelines that ordinary UI motion cannot express. An approved design system or a more specific design skill outranks generic style advice.

## AI-enabled features

When the product includes model, tool, retrieval, or agent behavior, apply `yeknal-human-ai-interface-design`, and `yeknal-application-security` to prompts, retrieved content, files, tool output, and stored memory.

## Guardrails

- Do not assume edge-runtime compatibility; verify every dependency and API used there.
- Do not silently change routing, caching, data contracts, authentication, environment variables, or deployment behavior.
