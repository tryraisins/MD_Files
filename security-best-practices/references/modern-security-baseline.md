# Modern Cross-Stack Security Baseline

Reviewed: 2026-09-07

Use this before the relevant framework reference. The framework document provides implementation detail; this file supplies current cross-stack priorities and corrects stale defaults.

## Current reference set

- [OWASP Top 10:2025](https://owasp.org/Top10/)
- [OWASP ASVS 5.0](https://owasp.org/www-project-application-security-verification-standard/)
- [OWASP API Security Top 10:2023](https://owasp.org/API-Security/editions/2023/en/0x11-t10/)
- [OWASP Top 10 for LLM Applications 2025](https://genai.owasp.org/llm-top-10/)
- [CISA Secure by Design](https://www.cisa.gov/securebydesign)

## Review priorities

1. Trace attacker-controlled source, closest effective control, sensitive sink or operation, and realistic impact.
2. Check object, tenant, field, and function authorization on every protected path, including jobs, exports, webhooks, files, and batch operations.
3. Model sensitive workflows as state machines and test replay, race, double-submit, stale approval, exceptional-condition, and retry paths.
4. Bound parsers, bodies, collections, decompression, uploads, outbound requests, execution time, concurrency, and downstream fan-out.
5. Treat dependencies, lockfiles, CI workflows, build inputs, generated code, registries, plugins, models, and release artifacts as a software/data integrity surface.
6. Separate static evidence, local reproduction, deployed response, cloud/tenant configuration, and browser behavior.

## Correct modern defaults

- Prefer Argon2id with at least 19 MiB, 2 iterations, and parallelism 1. Use scrypt when unavailable. Treat bcrypt as a legacy fallback with cost 10+ and its 72-byte input limit.
- Prefer passkeys/WebAuthn or phishing-resistant MFA for privileged and high-risk access.
- Use `SameSite=Lax` as the usual session-cookie starting point, `Strict` only when compatible, and `None; Secure` only for justified cross-site flows with explicit CSRF protection.
- Protect cookie-authenticated unsafe methods with a proven CSRF design. SameSite, Origin/Referer, and Fetch Metadata are defense in depth.
- Use nonce/hash CSP and `frame-ancestors`; keep `X-Frame-Options` only as a compatible legacy fallback.
- Do not recommend `X-XSS-Protection: 1; mode=block`; it is deprecated and can introduce vulnerabilities.
- Enable HSTS only after HTTPS is correct for the target host. Treat `includeSubDomains` and preload as operational commitments.
- Rate-limit by abuse model and operation cost across relevant identity, tenant, token, device/session, and network dimensions. Avoid universal IP-only numbers.
- Use immutable package-manager installs: `npm ci`, `pnpm --frozen-lockfile`, `yarn --immutable`, or equivalent. Pin reusable CI actions by immutable commit SHA and prefer short-lived OIDC credentials.

## AI and agentic systems

- Treat prompts, retrieved documents, web pages, emails, tool output, memory, and peer-agent messages as untrusted input.
- Enforce identity, authorization, policy, and state transitions outside the model.
- Minimize tool functionality, permissions, data scope, network reach, lifetime, retries, and spend.
- Validate tool arguments and model output before SQL, shells, templates, browsers, workflows, or APIs consume it.
- Require review for consequential external actions unless a separately authorized bounded automation policy exists.
- Protect retrieval and memory against poisoning with provenance, tenant isolation, controlled writes, freshness, and rollback.

## Reporting

Do not promote a scanner pattern to a finding without reachability and impact evidence. For every finding include the invariant, exact evidence, source-control-sink path, preconditions, counterevidence, proof gap, severity rationale, smallest fix, and regression test. An empty report means no reportable issue was established in the reviewed coverage, not that the system is secure.
