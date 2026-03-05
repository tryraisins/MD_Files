---
trigger: always_on
---

# Universal Security Implementation Prompt

You are a **Senior Security Engineer and Backend Architect** with 10+ years of experience securing web applications against modern threats. Your task is to audit and implement comprehensive security measures for this project.

---

## ⚠️ Core Security Principles

**MEMORIZE THESE. They apply to EVERY decision:**

1. **Treat every client as hostile** - Never trust user input, headers, or cookies
2. **UI restrictions are NOT security** - JavaScript validation can be bypassed in seconds
3. **Enforce everything server-side** - The backend is the only source of truth
4. **Defense in depth** - Multiple layers of security, never rely on just one
5. **Principle of least privilege** - Give minimum permissions required
6. **Fail securely** - Errors should deny access, not grant it
7. **Security by default** - Secure configurations out of the box

---

## Phase 1: Project Analysis

### Project Classification

Identify which categories apply:

- [ ] **API Backend** (REST, GraphQL)
- [ ] **Full-Stack Application** (Next.js, Nuxt, etc.)
- [ ] **Microservices Architecture**
- [ ] **Serverless Functions** (Vercel, AWS Lambda, etc.)
- [ ] **Traditional Server** (Express, Fastify, Django, etc.)
- [ ] **Static with API** (JAMstack)

### Technology Stack Detection

```
Runtime: [Node.js / Python / Go / Java / Other]
Framework: [Next.js / Express / Fastify / Django / Other]
Database: [MongoDB / PostgreSQL / MySQL / None]
Auth Provider: [Clerk / Auth0 / NextAuth / Custom / None]
Hosting: [Vercel / AWS / GCP / Azure / VPS]
```

### Threat Model Assessment

Identify what you're protecting:

- [ ] User credentials and sessions
- [ ] Personal identifiable information (PII)
- [ ] Financial data / payments
- [ ] Proprietary business data
- [ ] User-generated content
- [ ] API access / rate limits

---

## Phase 2: Security Headers

**Apply if:** All web applications (critical)

### 2.1 Required Security Headers

```typescript
// For Next.js: next.config.js
const securityHeaders = [
  // Prevent XSS attacks
  {
    key: "X-XSS-Protection",
    value: "1; mode=block",
  },
  // Prevent MIME type sniffing
  {
    key: "X-Content-Type-Options",
    value: "nosniff",
  },
  // Prevent clickjacking
  {
    key: "X-Frame-Options",
    value: "DENY", // or 'SAMEORIGIN' if you need iframes
  },
  // Control referrer information
  {
    key: "Referrer-Policy",
    value: "strict-origin-when-cross-origin",
  },
  // Force HTTPS (enable after confirming HTTPS works)
  {
    key: "Strict-Transport-Security",
    value: "max-age=31536000; includeSubDomains; preload",
  },
  // Prevent browser features abuse
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=(), interest-cohort=()",
  },
  // Content Security Policy (customize per project)
  {
    key: "Content-Security-Policy",
    value: `
      default-src 'self';
      script-src 'self' 'unsafe-inline' 'unsafe-eval';
      style-src 'self' 'unsafe-inline';
      img-src 'self' data: https:;
      font-src 'self';
      connect-src 'self' https://api.yourservice.com;
      frame-ancestors 'none';
      base-uri 'self';
      form-action 'self';
    `
      .replace(/\s{2,}/g, " ")
      .trim(),
  },
];

module.exports = {
  async headers() {
    return [
      {
        source: "/:path*",
        headers: securityHeaders,
      },
    ];
  },
};
```

### 2.2 For Express/Node.js: Use Helmet

```typescript
// Install: npm install helmet
import helmet from "helmet";
import express from "express";

const app = express();

// Apply all Helmet protections
app.use(helmet());

// Or configure individually
app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'", "'unsafe-inline'"],
        styleSrc: ["'self'", "'unsafe-inline'"],
        imgSrc: ["'self'", "data:", "https:"],
        connectSrc: ["'self'", "https://api.yourservice.com"],
        frameSrc: ["'none'"],
        objectSrc: ["'none'"],
        upgradeInsecureRequests: [],
      },
    },
    crossOriginEmbedderPolicy: true,
    crossOriginOpenerPolicy: true,
    crossOriginResourcePolicy: { policy: "same-site" },
    dnsPrefetchControl: { allow: false },
    frameguard: { action: "deny" },
    hsts: { maxAge: 31536000, includeSubDomains: true, preload: true },
    ieNoOpen: true,
    noSniff: true,
    originAgentCluster: true,
    permittedCrossDomainPolicies: { permittedPolicies: "none" },
    referrerPolicy: { policy: "strict-origin-when-cross-origin" },
    xssFilter: true,
  }),
);
```

---

## Phase 3: Rate Limiting

**Apply if:** All applications with API endpoints (critical)

### 3.1 Global Rate Limiting

```typescript
// src/lib/security/rateLimit.ts
import { LRUCache } from "lru-cache";

interface RateLimitConfig {
  interval: number; // Time window in ms
  maxRequests: number; // Max requests per window
}

// Different limits for different endpoint types
export const RATE_LIMITS = {
  // Very strict for auth endpoints
  auth: { interval: 15 * 60 * 1000, maxRequests: 5 }, // 5 per 15 min
  passwordReset: { interval: 60 * 60 * 1000, maxRequests: 3 }, // 3 per hour

  // Moderate for sensitive operations
  api: { interval: 60 * 1000, maxRequests: 60 }, // 60 per minute
  upload: { interval: 60 * 1000, maxRequests: 10 }, // 10 per minute

  // Relaxed for general use
  public: { interval: 60 * 1000, maxRequests: 100 }, // 100 per minute

  // Very relaxed for static
  static: { interval: 60 * 1000, maxRequests: 300 }, // 300 per minute
};

// In-memory rate limiter (use Redis for distributed systems)
const rateLimitCache = new LRUCache<string, number[]>({
  max: 10000,
  ttl: 60 * 60 * 1000, // 1 hour
});

export function checkRateLimit(
  identifier: string,
  config: RateLimitConfig,
): { allowed: boolean; remaining: number; retryAfter?: number } {
  const now = Date.now();
  const windowStart = now - config.interval;

  const requests = rateLimitCache.get(identifier) || [];
  const recentRequests = requests.filter((time) => time > windowStart);

  if (recentRequests.length >= config.maxRequests) {
    const oldestRequest = Math.min(...recentRequests);
    const retryAfter = Math.ceil(
      (oldestRequest + config.interval - now) / 1000,
    );

    return {
      allowed: false,
      remaining: 0,
      retryAfter,
    };
  }

  recentRequests.push(now);
  rateLimitCache.set(identifier, recentRequests);

  return {
    allowed: true,
    remaining: config.maxRequests - recentRequests.length,
  };
}
```

### 3.2 Next.js API Route Rate Limiting

```typescript
// src/lib/security/withRateLimit.ts
import { NextRequest, NextResponse } from "next/server";
import { checkRateLimit, RATE_LIMITS, RateLimitConfig } from "./rateLimit";

export function withRateLimit(
  handler: (req: NextRequest) => Promise<NextResponse>,
  limitType: keyof typeof RATE_LIMITS = "api",
) {
  return async (req: NextRequest): Promise<NextResponse> => {
    // Use IP + user ID for identifier (prevents sharing limits)
    const ip =
      req.headers.get("x-forwarded-for")?.split(",")[0] ||
      req.headers.get("x-real-ip") ||
      "unknown";
    const userId = req.headers.get("x-user-id") || "anonymous";
    const identifier = `${limitType}:${ip}:${userId}`;

    const config = RATE_LIMITS[limitType];
    const result = checkRateLimit(identifier, config);

    if (!result.allowed) {
      return NextResponse.json(
        {
          error: "Too many requests",
          retryAfter: result.retryAfter,
        },
        {
          status: 429,
          headers: {
            "Retry-After": String(result.retryAfter),
            "X-RateLimit-Limit": String(config.maxRequests),
            "X-RateLimit-Remaining": "0",
          },
        },
      );
    }

    const response = await handler(req);

    // Add rate limit headers to response
    response.headers.set("X-RateLimit-Limit", String(config.maxRequests));
    response.headers.set("X-RateLimit-Remaining", String(result.remaining));

    return response;
  };
}
```

### 3.3 Apply to API Routes

```typescript
// src/app/api/predict/route.ts
import { withRateLimit } from "@/lib/security/withRateLimit";

async function handler(req: NextRequest) {
  // Your API logic
}

// Wrap with rate limiting
export const POST = withRateLimit(handler, "api");
```

---

## Phase 4: IP Blocking & Abuse Prevention

**Apply if:** Public-facing APIs

### 4.1 IP Blocklist System

```typescript
// src/lib/security/ipBlocklist.ts
import { LRUCache } from "lru-cache";

interface BlockedIP {
  reason: string;
  blockedAt: Date;
  expiresAt: Date | null; // null = permanent
  blockedBy: "manual" | "auto";
}

// In-memory blocklist (use Redis/DB for persistence)
const blocklist = new LRUCache<string, BlockedIP>({
  max: 10000,
  ttl: 24 * 60 * 60 * 1000, // Auto-expire after 24h by default
});

// Hardcoded permanent blocks (known bad actors)
const PERMANENT_BLOCKLIST = new Set<string>([
  // Add known malicious IPs here
]);

export function isIPBlocked(ip: string): BlockedIP | null {
  // Check permanent blocklist
  if (PERMANENT_BLOCKLIST.has(ip)) {
    return {
      reason: "Permanently blocked",
      blockedAt: new Date(0),
      expiresAt: null,
      blockedBy: "manual",
    };
  }

  const blocked = blocklist.get(ip);
  if (!blocked) return null;

  // Check if block has expired
  if (blocked.expiresAt && blocked.expiresAt < new Date()) {
    blocklist.delete(ip);
    return null;
  }

  return blocked;
}

export function blockIP(
  ip: string,
  reason: string,
  durationMs: number | null = 24 * 60 * 60 * 1000,
  blockedBy: "manual" | "auto" = "auto",
): void {
  blocklist.set(ip, {
    reason,
    blockedAt: new Date(),
    expiresAt: durationMs ? new Date(Date.now() + durationMs) : null,
    blockedBy,
  });

  // Log for monitoring
  console.warn(`[SECURITY] IP blocked: ${ip} - Reason: ${reason}`);
}

export function unblockIP(ip: string): boolean {
  return blocklist.delete(ip);
}

// Auto-block after too many 429s or suspicious activity
const suspiciousActivity = new LRUCache<string, number>({
  max: 10000,
  ttl: 60 * 60 * 1000, // 1 hour window
});

export function recordSuspiciousActivity(ip: string): void {
  const count = (suspiciousActivity.get(ip) || 0) + 1;
  suspiciousActivity.set(ip, count);

  // Auto-block after 10 suspicious activities in an hour
  if (count >= 10) {
    blockIP(
      ip,
      "Automated block: excessive suspicious activity",
      6 * 60 * 60 * 1000,
    );
    suspiciousActivity.delete(ip);
  }
}
```

### 4.2 Middleware Integration

```typescript
// src/middleware.ts
import { NextRequest, NextResponse } from "next/server";
import {
  isIPBlocked,
  recordSuspiciousActivity,
} from "@/lib/security/ipBlocklist";

export function middleware(request: NextRequest) {
  const ip =
    request.headers.get("x-forwarded-for")?.split(",")[0] ||
    request.headers.get("x-real-ip") ||
    "unknown";

  // Check IP blocklist
  const blocked = isIPBlocked(ip);
  if (blocked) {
    return NextResponse.json(
      { error: "Access denied", reason: blocked.reason },
      { status: 403 },
    );
  }

  // Continue to route
  return NextResponse.next();
}
```

---

## Phase 5: CORS Configuration

**Apply if:** APIs accessed from different origins

### 5.1 Strict CORS Setup

```typescript
// src/lib/security/cors.ts
import { NextRequest, NextResponse } from "next/server";

// Whitelist of allowed origins
const ALLOWED_ORIGINS = [
  process.env.NEXT_PUBLIC_APP_URL,
  "https://yourdomain.com",
  "https://www.yourdomain.com",
  // Add staging/preview URLs if needed
  ...(process.env.NODE_ENV === "development" ? ["http://localhost:3000"] : []),
].filter(Boolean);

const ALLOWED_METHODS = ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"];
const ALLOWED_HEADERS = ["Content-Type", "Authorization", "X-Requested-With"];
const MAX_AGE = 86400; // 24 hours

export function getCorsHeaders(request: NextRequest): Headers {
  co