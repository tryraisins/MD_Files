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

## Credential File Safety During Testing

**This section is non-negotiable. Violations result in credentials being pushed to GitHub.**

### Mandatory order of operations — no exceptions

1. **Gitignore FIRST** — Before writing any credential content to a file, add that filename or pattern to `.gitignore`. Never write credentials then gitignore later. If no `.gitignore` exists, create it first.
2. **Test** — Run the test with the credential file in place.
3. **Delete immediately after** — Delete the file as soon as testing is done. Do not stage it. Do not leave it on disk.

### Red-flag file patterns — auto-trigger gitignore + deletion

Any file matching these patterns that contains credentials MUST be gitignored before creation and deleted after use:

- `*.test.env`, `test.env*`, `.env.test*`, `.env.ci*`, `.env.staging*`
- `*credentials*`, `*secrets*`, `*keyfile*`, `*service-account*`
- `*.json` containing `"private_key"`, `"client_secret"`, or `"password"`
- `*.pem`, `*.key`, `*.crt`, `*.p12`, `*.pfx`, `*.jks`
- Any file with a connection string that embeds a password: `://user:password@host`
- Shell scripts containing `export SECRET=` or `export API_KEY=`

### Pre-push gate — run before every `git push`

```bash
# Confirm no credential-pattern files are untracked or staged
git status
git diff --cached | grep -iE "(password|secret|api_key|private_key|token)"

# Confirm .gitignore covers all temp credential files from this session
cat .gitignore | grep -E "\.(env|pem|key|p12)"
```

If any credential-pattern file appears in `git status` output and is NOT listed in `.gitignore`, stop — do not push. Add the file to `.gitignore`, delete the file, then verify again.

### NEVER

- Create a credential file, commit it, then add to `.gitignore` as a follow-up step
- Leave test credential files on disk after testing is complete
- Use production credentials in test files — use test-environment credentials only
- Assume `.gitignore` covers a file without verifying the pattern matches the exact filename

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
| ------ | ------- | ----- |
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
- [ ] `.gitignore` was updated **before** any credential file was written (not after)
- [ ] All test credential files created this session have been **deleted from disk**
- [ ] `git status` shows no untracked files matching credential-pattern names
- [ ] `git diff --cached` contains no hardcoded passwords, API keys, or tokens

## Adversarial Security Audit Mode

When explicitly asked to perform a security audit, red-team review, or penetration-style analysis, activate adversarial mode. Think like an attacker with motivation and creativity — not a checklist runner.

### Attacker Profiles to Simulate

| Profile | Access Level | Primary Goal |
| --- | --- | --- |
| Anonymous user | Unauthenticated, public endpoints only | Auth bypass, data exfiltration, account takeover |
| Authenticated user | Valid session, standard permissions | Privilege escalation, IDOR, horizontal access |
| Insider / ex-employee | Knowledge of internal architecture | Credential theft, backdoor, data manipulation |
| API consumer | API key only, no browser | Rate limit bypass, scope escalation, key rotation abuse |
| Supply chain attacker | Dependency or CI/CD access | RCE via package, backdoor in build artifact |

### Full Attack Surface — Audit Every Layer

**Frontend:** Client-side auth bypass, DOM-based XSS, open redirects, client secret exposure (`NEXT_PUBLIC_*`, `REACT_APP_*`), localStorage token theft, clickjacking  
**Backend:** SSRF, command injection, deserialization attacks, mass assignment, unsafe `eval()`/`Function()`, path traversal  
**Authentication:** JWT algorithm confusion, session fixation, password reset link abuse, OAuth `state` param bypass, token leakage in URLs or logs  
**Database:** SQL/NoSQL injection, IDOR/BOLA (Broken Object Level Authorization), insecure direct object references, mass assignment via ORM  
**Infrastructure:** CORS wildcard on authenticated endpoints, exposed debug routes, `.env` file serving, cloud bucket misconfiguration, admin panel without auth  
**Dependencies:** Vulnerable packages (`npm audit`), malicious transitive dependencies, lock file tampering, typosquatting  

### Advanced Attack Patterns — Actively Probe These

- **Chained exploits**: Combine low-severity issues into critical paths (e.g., SSRF + CORS bypass + JWT token leakage = account takeover)
- **Race conditions**: Double-submit forms, check-then-act (TOCTOU), concurrent request abuse, double spending
- **Business logic abuse**: Skip payment/approval steps, replay completed transactions, bypass feature flags via URL params
- **Cache poisoning**: Unkeyed request headers, CDN cache pollution with attacker-controlled content
- **Timing attacks**: Auth comparison leaks, username enumeration via response time differences
- **Replay attacks**: Reuse expired tokens, replay magic links after single-use should have invalidated them
- **State desynchronization**: Multi-step wizard bypass, stale frontend state exploits, incomplete server-side validation

### Required Output Format

```markdown
### 1. Vulnerability Summary
- Critical: N | High: N | Medium: N | Low: N

### 2. Detailed Findings
For each vulnerability:
- Title + Severity (Critical/High/Medium/Low)
- Affected component + file/line if known
- Description of the flaw
- Exploitation scenario (step-by-step)
- Impact if exploited
- Recommended fix

### 3. Attack Chains
- Show how 2–4 lower-severity issues combine into a critical exploit path

### 4. Secure Design Recommendations
- Architectural improvements and safer patterns
```

### Adversarial Mindset Rules

- **Do NOT assume the code is safe** — every boundary is a potential entry point
- **Do NOT skip due to missing context** — infer risks and flag assumptions explicitly
- **Flag "that shouldn't be possible" scenarios** — they often are
- **Think in chains** — three low-severity issues can create a critical exploit
- **Assume breach** — what damage can an attacker do once they're inside?
