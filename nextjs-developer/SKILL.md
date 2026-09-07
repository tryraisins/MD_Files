---
name: nextjs-developer
description: Build and maintain full-stack Next.js applications using the repository's installed version, router, rendering model, and deployment target. Use when work involves Next.js routes, components, data access, caching, or server boundaries.
---

# Next.js Developer

Treat the repository as the source of truth. Inspect `package.json`, lockfiles, configuration, route structure, deployment target, and existing conventions before choosing an API or migration path.

## Workflow

1. Identify the installed Next.js and React versions, package manager, router, runtime, rendering modes, and existing validation scripts.
2. Trace server/client boundaries, data sources, authentication, caching, revalidation, mutations, errors, metadata, and deployment assumptions.
3. Implement the smallest complete change using APIs supported by the installed version.
4. Keep secrets, privileged data access, authorization, and mutation validation on trusted server boundaries.
5. Run focused tests plus the repository's type, lint, and build scripts as appropriate.
6. Distinguish local build evidence from browser, identity-provider, database, edge-runtime, and production proof.

## Rendering and data

- Prefer server rendering for initial data and non-interactive content when it fits the existing architecture.
- Mark only interactive leaves as client components; do not move a large subtree client-side without need.
- Make caching and revalidation explicit. Never infer current framework defaults from memory when behavior affects correctness.
- Validate and authorize every mutation on the server. Use idempotency where retries can duplicate effects.
- Provide deliberate loading, empty, error, not-found, unauthorized, and retry states.
- Avoid hydration drift, request waterfalls, accidental dynamic rendering, and secret leakage into client bundles.

## UI and motion

Apply `ui-quality-baseline` to every visible change. An approved design system or a more specific design skill takes precedence over generic style advice here.

- Reuse installed styling and component systems before adding dependencies.
- Do not impose Tailwind, dark mode, glassmorphism, a font blacklist, custom cursors, background effects, or an animation library unless the brief and repository support them.
- Choose loading feedback by wait type: geometry-matched skeletons for content, stable pending controls for mutations, and focus-managed overlays only for genuinely blocking work.
- Tie feedback to real state with status announcements, `aria-busy`, visible focus, reduced-motion support, failure, and retry behavior.
- Use `oil-motion` only for deliberate frame-based media timelines that ordinary UI motion cannot express.

## AI-enabled features

Only apply these rules when the product genuinely includes model, tool, retrieval, or agent behavior:

- Render high-level server-provided events; never expose or invent private chain-of-thought or tool activity.
- Require a clear review boundary before consequential model-proposed mutations.
- Show provenance, scope, errors, retries, cancellation, and refresh-safe reconciliation.
- Treat prompts, retrieved content, files, tool output, and stored memory as untrusted input; apply `application-security`.

## Guardrails

- Do not claim performance, accessibility, SEO, or Core Web Vitals scores without measurement.
- Do not assume edge-runtime compatibility; verify every dependency and API used there.
- Do not silently change routing, caching, data contracts, authentication, environment variables, or deployment behavior.
