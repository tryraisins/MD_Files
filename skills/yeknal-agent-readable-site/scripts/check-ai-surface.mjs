#!/usr/bin/env node
// Verifies that a deployed site exposes an agent-readable surface.
// No dependencies, Node 18+ (global fetch). Read-only: GET requests only.
//
//   node check-ai-surface.mjs https://example.com
//   node check-ai-surface.mjs https://example.com --coverage
//   node check-ai-surface.mjs http://localhost:4321 --coverage --exclude /login,/preview
//   node check-ai-surface.mjs https://example.com --json --timeout 15000 --max 20
//
// MUST failures exit 1. SHOULD warnings never fail the run. A requirement the
// host structurally cannot satisfy is reported as unsupported, never as a pass.
//
// Known limits: the target is treated as an origin, so a site deployed under a
// path prefix (`/docs/`) is not resolved correctly, and an origin that serves the
// right headers without negotiating `Accept` is classified as tier A.

const USAGE =
  "Usage: node check-ai-surface.mjs <baseUrl> [--coverage] [--json] [--timeout <ms>] [--max <n>] [--max-coverage <n>] [--exclude <prefix,...>]";

const DEFAULT_EXCLUDED = [
  "/admin", "/dashboard", "/account", "/signin", "/signout", "/login", "/logout",
  "/auth", "/checkout", "/cart", "/preview", "/draft", "/private", "/search",
  "/api", "/prototypes", "/404", "/500",
];

const NON_HTML = /\.(xml|json|txt|png|jpe?g|gif|svg|webp|avif|ico|css|js|mjs|pdf|zip|woff2?|mp4|webm)$/i;

const ANSWER_AGENTS = ["OAI-SearchBot", "ChatGPT-User", "Claude-SearchBot", "Claude-User", "PerplexityBot", "Perplexity-User"];

const results = [];
let baseUrl = "";
let declaredOrigin = "";
let ownedOrigins = new Set();
let excludedPrefixes = [...DEFAULT_EXCLUDED];
let tier = "unknown";
let timeoutMs = 12000;
let maxLinks = 20;
let maxCoverage = 250;

function add(id, severity, status, detail) {
  results.push({ id, severity, status, detail });
}

const pass = (id, severity, detail) => add(id, severity, "pass", detail);
const fail = (id, severity, detail) => add(id, severity, "fail", detail);
const warn = (id, detail) => add(id, "SHOULD", "warn", detail);
const unsupported = (id, severity, detail) => add(id, severity, "unsupported", detail);
const skip = (id, severity, detail) => add(id, severity, "skip", detail);

function parseArgs(argv) {
  const args = { coverage: false, json: false };
  const rest = [];
  for (let i = 0; i < argv.length; i += 1) {
    const arg = argv[i];
    if (arg === "--coverage") args.coverage = true;
    else if (arg === "--json") args.json = true;
    else if (arg === "--timeout") timeoutMs = Number(argv[++i]) || timeoutMs;
    else if (arg === "--max") maxLinks = Number(argv[++i]) || maxLinks;
    else if (arg === "--max-coverage") maxCoverage = Number(argv[++i]) || maxCoverage;
    else if (arg === "--exclude") excludedPrefixes.push(...String(argv[++i] || "").split(",").map((p) => p.trim()).filter(Boolean));
    else if (arg === "--help" || arg === "-h") args.help = true;
    else rest.push(arg);
  }
  args.baseUrl = rest[0];
  return args;
}

async function request(url, options = {}) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const response = await fetch(url, {
      redirect: "follow",
      signal: controller.signal,
      headers: { "user-agent": "yeknal-ai-surface-check/1.0", ...(options.headers || {}) },
    });
    const body = options.read === false ? "" : await response.text();
    return { ok: true, status: response.status, headers: response.headers, body, url: response.url };
  } catch (error) {
    return { ok: false, error: error.name === "AbortError" ? "timeout" : String(error.message || error) };
  } finally {
    clearTimeout(timer);
  }
}

const contentType = (result) => (result.headers.get("content-type") || "").toLowerCase();
const isHtml = (result) => contentType(result).includes("text/html");

function markdownTypeOk(result) {
  const type = contentType(result);
  if (type.includes("text/markdown") || type.includes("text/x-markdown")) return { ok: true, type };
  // A static host may label the file text/plain. The body is still markdown.
  if (type.includes("text/plain")) return { ok: true, type, plain: true };
  return { ok: false, type };
}

const mdPathFor = (pathname) => (pathname === "/" || pathname === "" ? "/index.md" : `${pathname.replace(/\/$/, "")}.md`);

function excluded(pathname) {
  const path = pathname.toLowerCase();
  if (NON_HTML.test(path)) return true;
  if (path.startsWith("/_next") || path.startsWith("/.well-known")) return true;
  return excludedPrefixes.some((prefix) => path === prefix || path.startsWith(`${prefix}/`));
}

const sitemapPaths = (xml) => [...xml.matchAll(/<loc>\s*([^<\s]+)\s*<\/loc>/gi)].map((match) => match[1]);

const onTarget = (url) => {
  const parsed = new URL(url);
  return `${baseUrl}${parsed.pathname}${parsed.search}`;
};

const ownedBySite = (url) => {
  try {
    return ownedOrigins.has(new URL(url).origin);
  } catch {
    return false;
  }
};

async function resolveDeclaredOrigin(origin) {
  ownedOrigins = new Set([new URL(origin).origin]);
  let fromSitemap = false;
  for (const candidate of [`${origin}/sitemap-index.xml`, `${origin}/sitemap.xml`]) {
    const response = await request(candidate);
    if (!response.ok || response.status !== 200) continue;
    const [first] = sitemapPaths(response.body);
    if (!first) continue;
    declaredOrigin = new URL(first).origin;
    ownedOrigins.add(declaredOrigin);
    fromSitemap = true;
    break;
  }
  if (fromSitemap) return;
  // No sitemap: fall back to the host named by llms.txt, so a preview of a site
  // whose links point at production can still be verified.
  const llms = await request(`${origin}/llms.txt`);
  const link = llms.ok && llms.status === 200 ? /\]\((https?:\/\/[^\s)]+)\)/.exec(llms.body) : null;
  declaredOrigin = link ? new URL(link[1]).origin : new URL(origin).origin;
  ownedOrigins.add(declaredOrigin);
}

async function toTier(origin) {
  const negotiation = await request(origin, { headers: { accept: "text/markdown" }, read: false });
  if (negotiation.ok && contentType(negotiation).includes("text/markdown")) {
    tier = "B";
    pass("negotiation", "MUST", "Accept: text/markdown returns markdown, so this host is tier B");
    return;
  }
  tier = "A";
  if (negotiation.ok && (negotiation.status === 404 || negotiation.status === 406)) {
    // Worse than not negotiating: an agent asking for markdown gets an error
    // instead of the HTML fallback it should have received.
    warn(
      "negotiation",
      `the host answers Accept: text/markdown with ${negotiation.status} instead of HTML, so an agent asking for markdown gets an error rather than a fallback`,
    );
    return;
  }
  unsupported(
    "negotiation",
    "MUST",
    negotiation.ok
      ? `host returned ${contentType(negotiation) || "no content type"}; static hosts cannot negotiate, so only the .md paths apply`
      : `probe failed: ${negotiation.error}`,
  );
}

async function checkDefaults(origin) {
  const html = await request(origin);
  if (!html.ok || html.status !== 200 || !isHtml(html)) {
    fail("homepage-html", "MUST", html.ok ? `status ${html.status}, type ${contentType(html) || "none"}` : html.error);
  } else {
    pass("homepage-html", "MUST", "a normal request returns HTML");
  }

  const wildcard = await request(origin, { headers: { accept: "*/*" }, read: false });
  if (wildcard.ok && isHtml(wildcard)) pass("accept-wildcard", "MUST", "Accept: */* returns HTML");
  else fail("accept-wildcard", "MUST", wildcard.ok ? `type ${contentType(wildcard) || "none"}` : wildcard.error);

  // fetch supplies its own default Accept, so an empty header is as close to
  // "missing" as a client can get. This proves the empty case, not a true absence.
  const empty = await request(origin, { headers: { accept: "" }, read: false });
  if (empty.ok && isHtml(empty)) pass("accept-empty", "MUST", "an empty Accept header still returns HTML");
  else fail("accept-empty", "MUST", empty.ok ? `type ${contentType(empty) || "none"}` : empty.error);

  if (html.ok && html.body) {
    if (/<meta[^>]+name=["']ai-summary["'][^>]*>/i.test(html.body)) pass("ai-summary", "SHOULD", "homepage carries a meta ai-summary");
    else warn("ai-summary", "homepage has no meta ai-summary");

    if (/<link[^>]+rel=["']alternate["'][^>]*type=["']text\/markdown["']/i.test(html.body)) {
      pass("markdown-alternate", "SHOULD", "homepage advertises a markdown alternate");
    } else {
      warn("markdown-alternate", "homepage does not link its markdown alternate");
    }
  }
}

async function checkSiteFiles() {
  const llms = await request(`${baseUrl}/llms.txt`);
  if (!llms.ok || llms.status !== 200) {
    fail("llms-txt", "MUST", llms.ok ? `status ${llms.status}` : llms.error);
  } else {
    pass("llms-txt", "MUST", `200, ${llms.body.length} bytes`);
    const links = [...llms.body.matchAll(/\]\((https?:\/\/[^\s)]+)\)/g)].map((match) => match[1]);
    const scoped = links.filter(ownedBySite);
    if (links.length === 0) {
      warn("llms-txt-links", "no absolute links were found to verify");
    } else if (scoped.length === 0) {
      fail(
        "llms-txt-links",
        "MUST",
        `${links.length} links, none on ${[...ownedOrigins].join(" or ")}; the index points somewhere the site does not own`,
      );
    } else {
      const sample = scoped.slice(0, maxLinks);
      let broken = 0;
      for (const link of sample) {
        const target = await request(onTarget(link), { read: false });
        if (!target.ok || target.status !== 200) {
          broken += 1;
          warn("llms-txt-links", `${link} returned ${target.ok ? target.status : target.error}`);
        }
      }
      if (broken === 0) pass("llms-txt-links", "MUST", `${sample.length} of ${scoped.length} same-site links resolve`);
      else fail("llms-txt-links", "MUST", `${broken} of ${sample.length} checked links are broken`);
    }
  }

  const full = await request(`${baseUrl}/llms-full.txt`, { read: false });
  if (full.ok && full.status === 200) pass("llms-full", "SHOULD", "llms-full.txt is served");
  else warn("llms-full", `llms-full.txt returned ${full.ok ? full.status : full.error}`);

  const ai = await request(`${baseUrl}/ai.txt`);
  if (!ai.ok || ai.status !== 200) {
    fail("ai-txt", "MUST", ai.ok ? `status ${ai.status}` : ai.error);
    return;
  }
  const missing = [];
  if (!/^#\s+\S/m.test(ai.body)) missing.push("H1 title");
  if (!/^Website:\s*\S/m.test(ai.body)) missing.push("Website: line");
  if (!/^Last Updated:\s*\S/m.test(ai.body)) missing.push("Last Updated: line");
  if (!/^##\s+Permissions/m.test(ai.body)) missing.push("## Permissions");
  if (!/^##\s+Restrictions/m.test(ai.body)) missing.push("## Restrictions");
  if (missing.length === 0) pass("ai-txt", "MUST", "ai.txt is served with the required sections");
  else fail("ai-txt", "MUST", `ai.txt is missing: ${missing.join(", ")}`);
}

// Parses robots.txt into groups, so consecutive User-agent lines share the
// directives that follow them, `*` is honoured, and a trailing comment cannot
// hide a rule.
function parseRobots(text) {
  const groups = [];
  let current = null;
  let inAgentBlock = false;
  for (const raw of text.split(/\r?\n/)) {
    const line = raw.replace(/#.*$/, "").trim();
    if (!line) continue;
    const match = /^([a-z-]+)\s*:\s*(.*)$/i.exec(line);
    if (!match) continue;
    const field = match[1].toLowerCase();
    const value = match[2].trim();
    if (field === "user-agent") {
      if (!inAgentBlock) {
        current = { agents: [], rules: [] };
        groups.push(current);
      }
      current.agents.push(value.toLowerCase());
      inAgentBlock = true;
      continue;
    }
    inAgentBlock = false;
    if (current && (field === "allow" || field === "disallow")) current.rules.push({ allow: field === "allow", path: value });
  }
  return groups;
}

function rootBlocked(groups, agent) {
  const rules = groups
    .filter((group) => group.agents.some((name) => name === agent.toLowerCase() || name === "*"))
    .flatMap((group) => group.rules)
    .filter((rule) => rule.path === "/");
  if (rules.length === 0) return false;
  // Equal-length paths: the allow wins.
  return !rules.some((rule) => rule.allow);
}

async function checkRobots() {
  const robots = await request(`${baseUrl}/robots.txt`);
  if (!robots.ok || robots.status !== 200) {
    warn("robots", `robots.txt returned ${robots.ok ? robots.status : robots.error}`);
    return;
  }
  const groups = parseRobots(robots.body);
  const blocked = ANSWER_AGENTS.filter((agent) => rootBlocked(groups, agent));
  if (blocked.length === 0) pass("robots", "SHOULD", "no answer-engine crawler has its root path disallowed");
  else warn("robots", `root path disallowed for: ${blocked.join(", ")}`);
  if (rootBlocked(groups, "*")) warn("robots", "the wildcard group disallows the root path, which affects every unnamed agent");
}

async function collectSitemapPaths(origin) {
  const paths = [];
  const queue = [`${origin}/sitemap-index.xml`, `${origin}/sitemap.xml`];
  const seen = new Set();
  while (queue.length > 0 && paths.length < 2000) {
    const url = queue.shift();
    if (seen.has(url)) continue;
    seen.add(url);
    const response = await request(url);
    if (!response.ok || response.status !== 200) continue;
    for (const loc of sitemapPaths(response.body)) {
      if (!ownedBySite(loc)) continue;
      if (NON_HTML.test(loc.split("?")[0])) {
        const child = onTarget(loc);
        if (!seen.has(child)) queue.push(child);
        continue;
      }
      paths.push(new URL(loc).pathname);
    }
  }
  return [...new Set(paths)];
}

async function checkMarkdownPage() {
  // `/index.md` is the contract for the homepage. A site without it has no
  // surface at all, which is a failure rather than a host limitation.
  const response = await request(`${baseUrl}/index.md`);
  if (!response.ok || response.status !== 200) {
    fail("markdown-index", "MUST", `/index.md returned ${response.ok ? response.status : response.error}`);
  } else {
    const type = markdownTypeOk(response);
    if (!type.ok) fail("markdown-type", "MUST", `/index.md served as ${type.type || "no content type"}`);
    else pass("markdown-type", "MUST", `/index.md served as ${type.type}${type.plain ? " (static host)" : ""}`);
    checkHeaders(response);
  }

  const random = `/.ai-surface-${Date.now().toString(36)}.md`;
  const missing = await request(`${baseUrl}${random}`, { read: false });
  if (missing.ok && missing.status === 404) pass("markdown-404", "MUST", "an unknown .md path returns 404");
  else fail("markdown-404", "MUST", missing.ok ? `status ${missing.status}` : missing.error);
}

function checkHeaders(response) {
  if (tier === "A") {
    // Reported rather than omitted: the host cannot do it, and the reader needs
    // to know the requirement exists and was not checked.
    unsupported("markdown-noindex", "MUST", "this host cannot set X-Robots-Tag, so the HTML canonical and the sitemap exclusion carry the duplicate risk");
    unsupported("markdown-content-location", "SHOULD", "this host cannot set Content-Location");
    unsupported("markdown-tokens", "SHOULD", "this host cannot set X-Markdown-Tokens");
    unsupported("markdown-vary", "SHOULD", "this host cannot negotiate, so there is nothing to Vary on");
    unsupported("markdown-cache", "SHOULD", "this host cannot set Cache-Control per route");
    unsupported("markdown-cors", "SHOULD", "this host cannot set Access-Control-Allow-Origin");
    return;
  }
  const robotsHeader = (response.headers.get("x-robots-tag") || "").toLowerCase();
  if (robotsHeader.includes("noindex")) pass("markdown-noindex", "MUST", "X-Robots-Tag carries noindex");
  else fail("markdown-noindex", "MUST", "markdown response has no X-Robots-Tag: noindex");

  const vary = (response.headers.get("vary") || "").toLowerCase();
  if (vary.includes("accept")) pass("markdown-vary", "SHOULD", "Vary includes Accept");
  else warn("markdown-vary", "Vary does not include Accept");

  const checks = [
    ["markdown-content-location", "Content-Location", response.headers.get("content-location")],
    ["markdown-tokens", "X-Markdown-Tokens", response.headers.get("x-markdown-tokens")],
    ["markdown-cache", "Cache-Control", response.headers.get("cache-control")],
    ["markdown-cors", "Access-Control-Allow-Origin", response.headers.get("access-control-allow-origin")],
  ];
  for (const [id, name, value] of checks) {
    if (value) pass(id, "SHOULD", `${name}: ${value}`);
    else warn(id, `${name} is missing`);
  }
}

async function checkCoverage() {
  const paths = (await collectSitemapPaths(baseUrl)).filter((path) => !excluded(path));
  if (paths.length === 0) {
    fail("coverage", "MUST", "no sitemap entries were found, so every markdown route is unverified");
    return;
  }
  const targeted = paths.slice(0, maxCoverage);
  const probes = await mapLimit(targeted, 5, async (path) => {
    const md = mdPathFor(path);
    // Read the body: the content type has to be inspected on the real response,
    // and an SPA that answers 200 with HTML must fail here, not pass.
    const response = await request(`${baseUrl}${md}`);
    if (!response.ok || response.status !== 200) return { md, kind: "missing", detail: response.ok ? String(response.status) : response.error };
    const type = markdownTypeOk(response);
    if (!type.ok) return { md, kind: "wrong-type", detail: type.type || "no content type" };
    return null;
  });
  const problems = probes.filter(Boolean);
  const missing = problems.filter((p) => p.kind === "missing");
  const wrongType = problems.filter((p) => p.kind === "wrong-type");
  const complete = targeted.length === paths.length;
  const scope = complete ? `all ${paths.length} sitemap routes` : `${targeted.length} of ${paths.length} sitemap routes`;

  if (problems.length > 0) {
    const parts = [];
    if (missing.length) parts.push(`${missing.length} missing: ${missing.slice(0, 8).map((p) => `${p.md} (${p.detail})`).join(", ")}`);
    if (wrongType.length) parts.push(`${wrongType.length} served as HTML: ${wrongType.slice(0, 8).map((p) => `${p.md} (${p.detail})`).join(", ")}`);
    fail("coverage", "MUST", `${scope} checked; ${parts.join("; ")}`);
    return;
  }
  // A truncated sample never reports a pass: absence of evidence is not coverage.
  if (!complete) skip("coverage", "MUST", `${scope} checked, no gaps in that subset; raise --max-coverage to finish`);
  else pass("coverage", "MUST", `${scope} return a markdown version`);
}

/** Runs `task` over `items` with a small worker pool so a large sitemap stays bounded. */
async function mapLimit(items, limit, task) {
  const output = new Array(items.length);
  let next = 0;
  const workers = Array.from({ length: Math.min(limit, items.length) }, async () => {
    while (next < items.length) {
      const index = next++;
      output[index] = await task(items[index]);
    }
  });
  await Promise.all(workers);
  return output;
}

// Only read the body when the type is ambiguous would be cleverer, but the
// content type cannot be known before the request, so ask for the body and keep
// the check honest.

function render() {
  const failures = results.filter((row) => row.severity === "MUST" && row.status === "fail");
  const warnings = results.filter((row) => row.status === "warn");
  const blocked = results.filter((row) => row.status === "unsupported");
  const partial = results.filter((row) => row.status === "skip");
  const lines = [
    `# Agent-readable surface: ${baseUrl}`,
    "",
    `- Host tier: ${tier === "B" ? "B (server or edge)" : tier === "A" ? "A (static)" : "unknown"}`,
    `- Declared site origin: ${declaredOrigin || baseUrl}`,
    `- MUST failures: ${failures.length}`,
    `- SHOULD warnings: ${warnings.length}`,
    `- Not supported by this host: ${blocked.length}`,
    `- Partially checked: ${partial.length}`,
    "",
    "| Check | Severity | Status | Detail |",
    "| --- | --- | --- | --- |",
  ];
  for (const row of results) {
    lines.push(`| ${row.id} | ${row.severity} | ${row.status} | ${String(row.detail || "").replace(/\|/g, "\\|")} |`);
  }
  return { text: lines.join("\n"), failures: failures.length, warnings: warnings.length, results, tier };
}

async function main() {
  const args = parseArgs(process.argv.slice(2));
  if (args.help || !args.baseUrl) {
    console.log(USAGE);
    process.exit(args.help ? 0 : 2);
  }
  baseUrl = args.baseUrl.replace(/\/+$/, "");
  if (!/^https?:\/\//i.test(baseUrl)) {
    console.error("baseUrl must start with http:// or https://");
    process.exit(2);
  }

  await resolveDeclaredOrigin(baseUrl);
  await toTier(baseUrl);
  await checkDefaults(baseUrl);
  await checkSiteFiles();
  await checkRobots();
  await checkMarkdownPage();
  if (args.coverage) await checkCoverage();

  const output = render();
  if (args.json) console.log(JSON.stringify({ baseUrl, tier: output.tier, results: output.results }, null, 2));
  else console.log(output.text);
  process.exit(output.failures > 0 ? 1 : 0);
}

main().catch((error) => {
  console.error(`check failed: ${error.message}`);
  process.exit(2);
});
