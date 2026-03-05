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
  const origin = request.headers.get("origin");
  const headers = new Headers();

  // Only allow whitelisted origins
  if (origin && ALLOWED_ORIGINS.includes(origin)) {
    headers.set("Access-Control-Allow-Origin", origin);
  }

  headers.set("Access-Control-Allow-Methods", ALLOWED_METHODS.join(", "));
  headers.set("Access-Control-Allow-Headers", ALLOWED_HEADERS.join(", "));
  headers.set("Access-Control-Max-Age", String(MAX_AGE));
  headers.set("Access-Control-Allow-Credentials", "true");

  return headers;
}

export function handleCorsPreFlight(request: NextRequest): NextResponse | null {
  if (request.method === "OPTIONS") {
    return new NextResponse(null, {
      status: 204,
      headers: getCorsHeaders(request),
    });
  }
  return null;
}
```

### 5.2 Apply to API Routes

```typescript
// In your API route
import { getCorsHeaders, handleCorsPreFlight } from "@/lib/security/cors";

export async function OPTIONS(request: NextRequest) {
  return (
    handleCorsPreFlight(request) || new NextResponse(null, { status: 204 })
  );
}

export async function POST(request: NextRequest) {
  const corsHeaders = getCorsHeaders(request);

  // Your logic here
  const response = NextResponse.json({ data: "result" });

  // Apply CORS headers
  corsHeaders.forEach((value, key) => {
    response.headers.set(key, value);
  });

  return response;
}
```

---

## Phase 6: Input Validation & Sanitization

**Apply if:** All applications (critical - prevents injection attacks)

### 6.1 Validation Library Setup

```typescript
// Install: npm install zod
// src/lib/security/validation.ts
import { z } from "zod";

// Reusable validation schemas
export const schemas = {
  // Common field types
  email: z.string().email().max(254).toLowerCase().trim(),

  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .max(128, "Password too long")
    .regex(/[A-Z]/, "Password must contain uppercase letter")
    .regex(/[a-z]/, "Password must contain lowercase letter")
    .regex(/[0-9]/, "Password must contain number")
    .regex(/[^A-Za-z0-9]/, "Password must contain special character"),

  username: z
    .string()
    .min(3)
    .max(30)
    .regex(/^[a-zA-Z0-9_-]+$/, "Invalid characters in username"),

  // Sanitized string (no HTML/scripts)
  safeString: z.string().transform((val) => val.replace(/<[^>]*>/g, "").trim()),

  // UUID validation
  uuid: z.string().uuid(),

  // URL validation
  url: z.string().url().max(2048),

  // Pagination
  pagination: z.object({
    page: z.coerce.number().int().min(1).default(1),
    limit: z.coerce.number().int().min(1).max(100).default(20),
  }),

  // ID parameter
  id: z.string().regex(/^[a-zA-Z0-9_-]+$/),
};

// Example: API request validation
export const predictionRequestSchema = z
  .object({
    homeTeam: z.string().min(1).max(100).trim(),
    awayTeam: z.string().min(1).max(100).trim(),
    sport: z.enum(["football", "basketball", "tennis", "hockey"]),
    league: z.string().min(1).max(100).trim(),
    matchDate: z.string().datetime(),
  })
  .strict(); // Reject extra fields
```

### 6.2 Validation Middleware

```typescript
// src/lib/security/validateRequest.ts
import { NextRequest, NextResponse } from "next/server";
import { z, ZodSchema } from "zod";

export async function validateRequest<T>(
  request: NextRequest,
  schema: ZodSchema<T>,
): Promise<
  { success: true; data: T } | { success: false; error: NextResponse }
> {
  try {
    let body: unknown;

    const contentType = request.headers.get("content-type");
    if (contentType?.includes("application/json")) {
      body = await request.json();
    } else if (contentType?.includes("application/x-www-form-urlencoded")) {
      const formData = await request.formData();
      body = Object.fromEntries(formData);
    } else {
      body = {};
    }

    const data = schema.parse(body);
    return { success: true, data };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return {
        success: false,
        error: NextResponse.json(
          {
            error: "Validation failed",
            details: error.errors.map((e) => ({
              field: e.path.join("."),
              message: e.message,
            })),
          },
          { status: 400 },
        ),
      };
    }

    return {
      success: false,
      error: NextResponse.json(
        { error: "Invalid request body" },
        { status: 400 },
      ),
    };
  }
}
```

### 6.3 HTML/SQL Injection Prevention

```typescript
// src/lib/security/sanitize.ts

// HTML entity encoding
export function escapeHtml(str: string): string {
  const htmlEntities: Record<string, string> = {
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#x27;",
    "/": "&#x2F;",
  };
  return str.replace(/[&<>"'/]/g, (char) => htmlEntities[char]);
}

// Remove all HTML tags
export function stripHtml(str: string): string {
  return str.replace(/<[^>]*>/g, "").trim();
}

// Sanitize for database (use with ORM parameterized queries)
export function sanitizeForDb(str: string): string {
  return str.replace(/[\0\x08\x09\x1a\n\r"'\\\%]/g, (char) => {
    switch (char) {
      case "\0":
        return "\\0";
      case "\x08":
        return "\\b";
      case "\x09":
        return "\\t";
      case "\x1a":
        return "\\z";
      case "\n":
        return "\\n";
      case "\r":
        return "\\r";
      case '"':
      case "'":
      case "\\":
      case "%":
        return "\\" + char;
      default:
        return char;
    }
  });
}
```

---

## Phase 7: Authentication & Authorization

**Apply if:** Applications with user accounts

### 7.1 Password Security

```typescript
// src/lib/security/password.ts
import bcrypt from "bcrypt";
import crypto from "crypto";

const SALT_ROUNDS = 12; // Increase for more security (slower)

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, SALT_ROUNDS);
}

export async function verifyPassword(
  password: string,
  hash: string,
): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

// Generate secure random tokens
export function generateSecureToken(length: number = 32): string {
  return crypto.randomBytes(length).toString("hex");
}

// Generate password reset token (short-lived)
export function generateResetToken(): {
  token: string;
  hash: string;
  expires: Date;
} {
  const token = generateSecureToken(32);
  const hash = crypto.createHash("sha256").update(token).digest("hex");
  const expires = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

  return { token, hash, expires };
}
```

### 7.2 Session Security

```typescript
// src/lib/security/session.ts

// Session configuration best practices
export const SESSION_CONFIG = {
  // Cookie settings
  cookie: {
    httpOnly: true, // Prevent XSS access to cookies
    secure: process.env.NODE_ENV === "production", // HTTPS only in prod
    sameSite: "lax" as const, // CSRF protection
    maxAge: 7 * 24 * 60 * 60, // 7 days
    path: "/",
  },

  // Session settings
  session: {
    maxAge: 24 * 60 * 60 * 1000, // 24 hours
    updateAge: 60 * 60 * 1000, // Refresh every hour
    absoluteTimeout: 7 * 24 * 60 * 60 * 1000, // Force re-auth after 7 days
  },

  // Security settings
  security: {
    regenerateOnAuth: true, // New session ID on login
    rotateTokens: true, // Rotate refresh tokens
    singleSession: false, // Allow multiple sessions
    bindToIP: false, // Don't bind (causes issues with mobile)
    requireReauthForSensitive: true, // Re-auth for password change, etc.
  },
};
```

### 7.3 Authorization Middleware

```typescript
// src/lib/security/authorize.ts
import { NextRequest, NextResponse } from "next/server";
import { getAuth } from "@clerk/nextjs/server"; // Or your auth provider

type Role = "user" | "admin" | "superadmin";

export function withAuth(
  handler: (req: NextRequest, userId: string) => Promise<NextResponse>,
  requiredRoles?: Role[],
) {
  return async (req: NextRequest): Promise<NextResponse> => {
    const { userId } = getAuth(req);

    if (!userId) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 },
      );
    }

    // Check roles if required
    if (requiredRoles && requiredRoles.length > 0) {
      const userRole = await getUserRole(userId);

      if (!requiredRoles.includes(userRole)) {
        return NextResponse.json(
          { error: "Insufficient permissions" },
          { status: 403 },
        );
      }
    }

    return handler(req, userId);
  };
}

// Example usage:
// export const POST = withAuth(handler, ['admin', 'superadmin']);
```

---

## Phase 8: Database Security

**Apply if:** Applications with databases

### 8.1 Use ORM/ODM (Prevents SQL/NoSQL Injection)

```typescript
// ✅ GOOD: Using Prisma ORM (parameterized queries)
const user = await prisma.user.findUnique({
  where: { email: userInput.email },
});

// ✅ GOOD: Using Mongoose ODM
const user = await User.findOne({ email: userInput.email });

// ❌ BAD: Raw query with string concatenation
const user = await db.query(`SELECT * FROM users WHERE email = '${email}'`);

// ⚠️ If you MUST use raw queries, use parameterized:
const user = await db.query("SELECT * FROM users WHERE email = $1", [email]);
```

### 8.2 MongoDB Security Best Practices

```typescript
// src/lib/db/mongodb.ts
import { MongoClient, MongoClientOptions } from "mongodb";

const options: MongoClientOptions = {
  maxPoolSize: 10,
  minPoolSize: 5,
  retryWrites: true,
  w: "majority",

  // Security options
  authSource: "admin",
  ssl: true,
  tlsAllowInvalidCertificates: false,

  // Timeouts
  connectTimeoutMS: 10000,
  socketTimeoutMS: 45000,
  serverSelectionTimeoutMS: 10000,
};

// Always use environment variables for connection string
const uri = process.env.MONGODB_URI;

if (!uri) {
  throw new Error("MONGODB_URI environment variable is not set");
}

// Validate URI doesn't contain credentials in code
if (uri.includes("password_placeholder")) {
  throw new Error("Replace placeholder credentials in MONGODB_URI");
}
```

### 8.3 Query Filtering Security

```typescript
// Prevent NoSQL injection in MongoDB
import { z } from "zod";

// Validate MongoDB ObjectId
const objectIdSchema = z.string().regex(/^[0-9a-fA-F]{24}$/);

// Sanitize query operators (prevent $where injection)
export function sanitizeMongoQuery(
  query: Record<string, unknown>,
): Record<string, unknown> {
  const dangerousOperators = ["$where", "$function", "$accumulator"];

  const sanitize = (obj: Record<string, unknown>): Record<string, unknown> => {
    const result: Record<string, unknown> = {};

    for (const [key, value] of Object.entries(obj)) {
      // Block dangerous operators
      if (dangerousOperators.includes(key)) {
        throw new Error(`Operator ${key} is not allowed`);
      }

      // Recursively sanitize nested objects
      if (value && typeof value === "object" && !Array.isArray(value)) {
        result[key] = sanitize(value as Record<string, unknown>);
      } else {
        result[key] = value;
      }
    }

    return result;
  };

  return sanitize(query);
}
```

---

## Phase 9: File Upload Security

**Apply if:** Applications accepting file uploads

### 9.1 Secure File Upload Configuration

```typescript
// src/lib/security/fileUpload.ts

export const FILE_UPLOAD_CONFIG = {
  // Size limits
  maxFileSize: 5 * 1024 * 1024, // 5MB
  maxFiles: 5,

  // Allowed MIME types (whitelist, not blacklist)
  allowedMimeTypes: [
    "image/jpeg",
    "image/png",
    "image/gif",
    "image/webp",
    "application/pdf",
  ],

  // Allowed extensions
  allowedExtensions: [".jpg", ".jpeg", ".png", ".gif", ".webp", ".pdf"],

  // Storage
  uploadDir: "/tmp/uploads", // Use cloud storage in production
  preserveOriginalName: false, // Generate random names
};

export function validateFile(file: File): { valid: boolean; error?: string } {
  // Check file size
  if (file.size > FILE_UPLOAD_CONFIG.maxFileSize) {
    return { valid: false, error: "File too large" };
  }

  // Check MIME type
  if (!FILE_UPLOAD_CONFIG.allowedMimeTypes.includes(file.type)) {
    return { valid: false, error: "File type not allowed" };
  }

  // Check extension
  const ext = "." + file.name.split(".").pop()?.toLowerCase();
  if (!FILE_UPLOAD_CONFIG.allowedExtensions.includes(ext)) {
    return { valid: false, error: "File extension not allowed" };
  }

  // Validate MIME type matches extension
  const mimeToExt: Record<string, string[]> = {
    "image/jpeg": [".jpg", ".jpeg"],
    "image/png": [".png"],
    "image/gif": [".gif"],
    "image/webp": [".webp"],
    "application/pdf": [".pdf"],
  };

  if (!mimeToExt[file.type]?.includes(ext)) {
    return {
      valid: false,
      error: "File extension does not match content type",
    };
  }

  return { valid: true };
}

// Generate safe filename
export function generateSafeFilename(originalName: string): string {
  const ext = originalName.split(".").pop()?.toLowerCase() || "bin";
  const timestamp = Date.now();
  const random = crypto.randomBytes(16).toString("hex");
  return `${timestamp}-${random}.${ext}`;
}
```

### 9.2 File Content Validation

```typescript
// Validate file content matches declared type
import FileType from "file-type";

export async function validateFileContent(buffer: Buffer): Promise<{
  valid: boolean;
  detectedType?: string;
  error?: string;
}> {
  const result = await FileType.fromBuffer(buffer);

  if (!result) {
    return { valid: false, error: "Could not determine file type" };
  }

  if (!FILE_UPLOAD_CONFIG.allowedMimeTypes.includes(result.mime)) {
    return {
      valid: false,
      detectedType: result.mime,
      error: `Detected file type ${result.mime} is not allowed`,
    };
  }

  return { valid: true, detectedType: result.mime };
}
```

---

## Phase 10: Environment & Secrets Management

**Apply if:** All applications (critical)

### 10.1 Environment Variables Security

```typescript
// src/lib/config/env.ts
import { z } from "zod";

// Define and validate all environment variables
const envSchema = z.object({
  // Database
  MONGODB_URI: z.string().url().startsWith("mongodb"),

  // Authentication
  CLERK_SECRET_KEY: z.string().min(1),
  CLERK_PUBLISHABLE_KEY: z.string().startsWith("pk_"),

  // API Keys (never expose to client)
  GEMINI_API_KEY: z.string().min(1),

  // App config
  NEXT_PUBLIC_APP_URL: z.string().url(),
  NODE_ENV: z.enum(["development", "production", "test"]),

  // Security
  CRON_SECRET: z.string().min(32),
  JWT_SECRET: z.string().min(32),
});

// Parse and validate on startup
function validateEnv() {
  try {
    return envSchema.parse(process.env);
  } catch (error) {
    if (error instanceof z.ZodError) {
      const missing = error.errors.map((e) => e.path.join(".")).join(", ");
      throw new Error(`Missing or invalid environment variables: ${missing}`);
    }
    throw error;
  }
}

export const env = validateEnv();
```

### 10.2 Secrets Best Practices

```typescript
// ❌ NEVER do this:
const API_KEY = "sk_live_abc123"; // Hardcoded secret

// ❌ NEVER expose secrets to client:
// NEXT_PUBLIC_SECRET_KEY (the PUBLIC prefix exposes it)

// ✅ Always use environment variables:
const apiKey = process.env.API_KEY;

// ✅ Validate secrets exist at startup:
if (!process.env.JWT_SECRET) {
  throw new Error("JWT_SECRET is required");
}

// ✅ Use different secrets per environment:
// .env.local (development)
// .env.production (production - set in hosting platform)
```

### 10.3 .gitignore Security

```gitignore
# Environment files (MUST be ignored)
.env
.env.local
.env.development.local
.env.test.local
.env.production.local
.env*.local

# Secrets
*.pem
*.key
*.crt
secrets/

# IDE and system
.idea/
.vscode/
.DS_Store
Thumbs.db
```

---

## Phase 11: Logging & Monitoring

**Apply if:** All production applications

### 11.1 Security Event Logging

```typescript
// src/lib/security/auditLog.ts

interface SecurityEvent {
  type:
    | "auth_success"
    | "auth_failure"
    | "permission_denied"
    | "rate_limit"
    | "ip_blocked"
    | "suspicious_activity"
    | "data_access"
    | "data_modification"
    | "admin_action";
  userId?: string;
  ip: string;
  userAgent: string;
  resource: string;
  action: string;
  details?: Record<string, unknown>;
  timestamp: Date;
}

export function logSecurityEvent(event: SecurityEvent): void {
  // In production, send to logging service (DataDog, Sentry, etc.)
  const logEntry = {
    ...event,
    timestamp: event.timestamp.toISOString(),
    environment: process.env.NODE_ENV,
  };

  // Structured logging for easy parsing
  console.log(
    JSON.stringify({
      level:
        event.type.includes("failure") || event.type.includes("denied")
          ? "warn"
          : "info",
      category: "security",
      ...logEntry,
    }),
  );

  // For critical events, consider alerting
  if (
    ["permission_denied", "ip_blocked", "suspicious_activity"].includes(
      event.type,
    )
  ) {
    // sendAlertToSlack(event);
    // sendAlertToEmail(event);
  }
}
```

### 11.2 What to Log (and NOT Log)

```typescript
// ✅ DO log:
// - Authentication attempts (success/failure)
// - Authorization failures
// - Rate limit triggers
// - IP blocks
// - Admin actions
// - Data access to sensitive resources
// - Security configuration changes

// ❌ NEVER log:
// - Passwords (even hashed)
// - Full credit card numbers
// - API keys or secrets
// - Session tokens
// - Personal health information
// - Full social security numbers

// ⚠️ Mask sensitive data:
function maskEmail(email: string): string {
  const [local, domain] = email.split("@");
  return `${local.substring(0, 2)}***@${domain}`;
}

function maskIP(ip: string): string {
  const parts = ip.split(".");
  return `${parts[0]}.${parts[1]}.xxx.xxx`;
}
```

---

## Phase 12: Dependency Security

**Apply if:** All applications with dependencies

### 12.1 Regular Audits

```bash
# Check for vulnerabilities
npm audit

# Fix automatically (be careful with major version bumps)
npm audit fix

# For aggressive fixing (may break things)
npm audit fix --force

# Check outdated packages
npm outdated
```

### 12.2 Automated Security Updates

```yaml
# .github/dependabot.yml
version: 2
updates:
  - package-ecosystem: "npm"
    directory: "/"
    schedule:
      interval: "weekly"
    open-pull-requests-limit: 10
    reviewers:
      - "your-username"
    labels:
      - "dependencies"
      - "security"
```

### 12.3 Lock File Integrity

```bash
# Always commit package-lock.json (npm) or yarn.lock (yarn)
# Use --frozen-lockfile in CI/CD

# npm ci (not npm install) in production
npm ci --only=production
```

---

## Phase 13: API Security Checklist

### 13.1 Authentication Endpoints

| Endpoint                    | Rate Limit | Security Measures                                      |
| --------------------------- | ---------- | ------------------------------------------------------ |
| `/api/auth/login`           | 5/15min    | Brute force protection, CAPTCHA after 3 failures       |
| `/api/auth/register`        | 3/hour     | Email verification, CAPTCHA                            |
| `/api/auth/forgot-password` | 3/hour     | Timing-safe comparison, doesn't reveal if email exists |
| `/api/auth/reset-password`  | 5/hour     | Token expiration, single-use tokens                    |
| `/api/auth/verify-email`    | 10/hour    | Token expiration, single-use                           |

### 13.2 API Endpoint Security Matrix

```typescript
// Define security requirements per route
const API_SECURITY: Record<string, RouteSecurityConfig> = {
  "/api/public/*": {
    rateLimit: "public",
    auth: false,
    cors: true,
    ipBlocking: true,
  },
  "/api/user/*": {
    rateLimit: "api",
    auth: true,
    roles: ["user", "admin"],
    cors: true,
  },
  "/api/admin/*": {
    rateLimit: "api",
    auth: true,
    roles: ["admin"],
    cors: true,
    auditLog: true,
  },
  "/api/cron/*": {
    rateLimit: "none",
    auth: "cron-secret",
    cors: false,
    ipWhitelist: ["vercel-cron-ips"],
  },
};
```

---

## Phase 14: Security Implementation Checklist

### Critical (Must Have)

- [ ] All passwords hashed with bcrypt (cost factor ≥12)
- [ ] All secrets in environment variables, never in code
- [ ] Input validation on ALL user inputs (server-side)
- [ ] Parameterized queries / ORM for all database operations
- [ ] HTTPS enforced in production
- [ ] Security headers configured (Helmet or equivalent)
- [ ] CORS configured with whitelist
- [ ] Rate limiting on all endpoints
- [ ] Authentication on protected routes
- [ ] Authorization checks for all actions
- [ ] Secure session/cookie configuration
- [ ] .gitignore includes all sensitive files

### Important (Should Have)

- [ ] IP blocking for abusive clients
- [ ] Security event logging
- [ ] File upload validation and limits
- [ ] CAPTCHA on auth endpoints
- [ ] Dependency vulnerability scanning
- [ ] CSP (Content Security Policy) configured
- [ ] Account lockout after failed attempts

### Nice to Have

- [ ] Two-factor authentication
- [ ] Web Application Firewall (WAF)
- [ ] Intrusion detection system
- [ ] Penetration testing
- [ ] Security audit by third party
- [ ] Bug bounty program

---

## Execution Instructions

1. **Analyze the project** using Phase 1 checklists
2. **Start with Phase 2-3** (Headers, Rate Limiting) - quick wins
3. **Implement Phase 6** (Input Validation) - prevents most attacks
4. **Apply authentication** (Phase 7) if applicable
5. **Secure database access** (Phase 8)
6. **Configure environment** (Phase 10) - often overlooked
7. **Set up logging** (Phase 11) - critical for incident response
8. **Complete remaining phases** based on project type
9. **Run security checklist** (Phase 14) before deployment

---

## Project-Specific Adaptations

When applying this prompt, the AI should:

1. **Skip irrelevant sections** - No file upload security for an API-only project
2. **Match existing patterns** - Follow the project's coding conventions
3. **Prioritize by impact** - Fix critical vulnerabilities first
4. **Don't break functionality** - Security changes must not break the app
5. **Document all changes** - Explain what was secured and why
6. **Test after implementation** - Verify security measures work

---

## Security Mindset Reminders

> "The only secure computer is one that's unplugged, locked in a safe, and buried 20 feet underground. And I'm not even sure about that one."

- **Assume breach** - Design systems that limit damage when (not if) compromised
- **Defense in depth** - Never rely on a single security measure
- **Keep it simple** - Complex systems have more vulnerabilities
- **Update regularly** - Yesterday's secure is today's vulnerable
- **Verify, don't trust** - Check everything, especially "impossible" scenarios
- **Fail closed** - When in doubt, deny access

---

_This prompt provides comprehensive security coverage. Apply sections based on your project's actual needs and threat model. Security is not a one-time task—it's an ongoing process._
