---
name: Security
description: Comprehensive security policy and implementation guide for auditing and hardening web applications and APIs. Use when reviewing, designing, or implementing secure architecture including authentication, authorization, API protection, security headers, rate limiting, input validation, database security, secrets management, logging, and deployment checklists. Covers all OWASP top 10 concerns.
---

# Security Skill

Use this skill when writing, reviewing, or auditing code that touches authentication, authorization, API endpoints, database operations, secrets, file uploads, or deployment configuration. Treat security requirements as **non-optional**.

For full implementation details and code examples, reference `Security-Master.md` in this folder.

## Core Principles (MEMORIZE)

1. **Treat every client as hostile** — never trust user input, headers, or cookies
2. **UI restrictions are NOT security** — JavaScript validation can be bypassed in seconds
3. **Enforce everything server-side** — the backend is the only source of truth
4. **Defense in depth** — multiple layers of security, never rely on just one
5. **Principle of least privilege** — give minimum permissions required
6. **Fail securely** — errors should deny access, not grant it
7. **Security by default** — secure configurations out of the box

## Secrets & Environment

- **Never commit secrets**: database passwords, JWT secrets, API keys, service account keys, admin credentials
- Client-side env vars must be limited to public-safe values only (public API URLs, publishable keys)
- Privileged keys may only be used in server-side route handlers, serverless functions, or trusted backend workers — never in browser code
- All credentials must live in environment variables, never hardcoded
- `.gitignore` must cover: `.env*`, `.env.local`, `.env.*.local`, private keys, IDE files
- Never log passwords, API keys, credit card numbers, session tokens, or PII

## Authentication & Authorization

- **Never trust client auth state** — server always verifies tokens/sessions
- **JWT verification**: check signature, expiration (`exp`), issuer (`iss`), audience (`aud`) server-side
- **Short-lived tokens**: access tokens 15 min or less; rotate refresh tokens on every use
- **No tokens in localStorage** — use `httpOnly`, `Secure`, `SameSite=Strict` cookies
- **Password hashing**: bcrypt (cost >= 12), scrypt, or argon2 only — never MD5, SHA-1, or SHA-256
- **Rate limit auth endpoints**: login 5/min per IP, magic link/OTP 3/15min per email
- **RBAC roles**: `anonymous` (read-only public), `authenticated` (own data only), `admin` (verified server-side)
- Never trust role claims from the client — validate against database state
- Session revocation: users must be able to log out of all devices
- Password changes must invalidate all existing sessions

## API Security

- **Validate all input** on every endpoint — request body, query params, path params — using zod, yup, or joi
- **Rate limit all public endpoints**: login/signup 5-10/min, public reads 60-120/min, authenticated per-user
- **Auth before processing**: check auth first, validate input second, then process
- **Never expose internal errors**: generic messages to clients, full details server-side only, no stack traces
- **CORS**: specific origin whitelist only — never `*` on authenticated endpoints
- **Pagination**: default 20-50, max 100, validate filter params against allowlist
- **Idempotency**: POST with idempotency keys, PUT/DELETE idempotent by design

### Server Route Pattern

```typescript
export async function POST(request: Request) {
  // 1. Authenticate
  const session = await verifySession(request);
  if (!session) return Response.json({ error: { code: "UNAUTHORIZED" } }, { status: 401 });

  // 2. Validate input
  const body = await request.json();
  const parsed = schema.safeParse(body);
  if (!parsed.success) return Response.json({ error: { code: "VALIDATION_ERROR" } }, { status: 400 });

  // 3. Process
  const result = await doTheThing(parsed.data);

  // 4. Respond
  return Response.json(result, { status: 200 });
}
```

## Security Headers

Configure these on every response:

- `X-Content-Type-Options: nosniff`
- `X-Frame-Options: DENY`
- `X-XSS-Protection: 1; mode=block`
- `Strict-Transport-Security: max-age=31536000; includeSubDomains; preload`
- `Referrer-Policy: strict-origin-when-cross-origin`
- `Permissions-Policy: camera=(), microphone=(), geolocation=()`
- `Content-Security-Policy` — customize per project

Use Helmet for Express or configure via `next.config.js` headers for Next.js.

## Database Security

- **ORM or parameterized queries only** — never concatenate user input into SQL/NoSQL queries
- Any table with user data must have access control (row-level security, middleware checks, or ORM policies)
- Direct client-to-database writes are not allowed — all writes through server endpoints
- Database credentials in environment variables, never hardcoded
- Admin tables accessible only via privileged server-side credentials
- Sanitize MongoDB queries — block `$where`, `$function`, `$accumulator` operators
- Validate all ObjectIds / primary keys before use

## File Upload Security

- Max file size: 5MB (configurable), max files: 5
- Whitelist allowed MIME types and extensions — never blacklist
- Generate random filenames, do not trust user-provided names
- Validate actual file type matches declared MIME type
- Use cloud storage in production, not local filesystem

## Rate Limiting

| Tier | Limit | Use |
|------|-------|-----|
| `auth` | 5 per 15 min | Login, token generation |
| `passwordReset` | 3 per hour | Password reset, magic links |
| `api` | 60 per minute | Authenticated API calls |
| `upload` | 10 per minute | File uploads |
| `public` | 100 per minute | Public read endpoints |

Return 429 with `Retry-After` header when limits exceeded.

## Dependencies

- Run `npm audit` regularly, fix critical/high immediately
- Commit lock files (`package-lock.json`, `yarn.lock`)
- Use `npm ci --frozen-lockfile` in CI/CD
- Enable Dependabot or similar automated scanning

## Incident Response

1. Rotate exposed keys immediately
2. Audit access control policies and function grants
3. Review logs for unusual access patterns
4. Add regression test/checklist entry to prevent recurrence

## Pre-Merge Checklist

- [ ] No secrets, keys, or credentials in code
- [ ] All inputs validated with schema (zod/yup/joi)
- [ ] Auth checked before business logic on protected endpoints
- [ ] Rate limiting on all public endpoints
- [ ] CORS configured for specific origins only
- [ ] Error responses do not leak internal details
- [ ] Security headers configured
- [ ] Database queries use ORM or parameterized queries
- [ ] Tokens stored in httpOnly cookies, not localStorage
- [ ] Password hashing uses bcrypt/argon2/scrypt (cost >= 12)
- [ ] .gitignore covers .env files, secrets, and keys
- [ ] `npm audit` clean (no critical/high vulnerabilities)
