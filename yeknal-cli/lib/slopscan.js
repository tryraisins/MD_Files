"use strict";

/**
 * yeknal slopscan
 *
 * A local, static source scan for AI-slop indicators.
 *
 * What this is: a reader for source files that looks for the familiar signs of
 * a shipped template. It reads markup, styles and interface copy, and reports
 * each indicator with its file, line, a plain explanation and a fix.
 *
 * What this is not: a rendered-page check. It never launches a browser, makes
 * no network request, and cannot see computed styles, layout or the
 * accessibility tree. Rules that need those are reported as not checked rather
 * than guessed. It also cannot tell who or what wrote the code, and it does not
 * try.
 *
 * Every rule carries an assessment. `measured` means the observation is
 * syntactically certain (a literal image element with no alt attribute).
 * `heuristic` means the source shows the pattern but the inference is not
 * certain (a buzzword in a string that may never render). `unassessed` means
 * the check needs the rendered page. A finding is a candidate for review.
 *
 * There is deliberately no score. SlopLens scores one rendered page; a
 * repository is not a page, and a repository-wide number would be driven by
 * size rather than quality.
 */

const fs = require("fs");
const path = require("path");
const { listGitVisibleFiles, safeReadFile, walkFiles } = require("./scan-files");

const CATALOG = require("./slop-rules.json");

// ==========================================================================
// Patterns, ported from the SlopLens detectors so the two agree on what
// counts. See the Slop Detector repository, server/detectors.ts.
// ==========================================================================

const PHRASES = [
  "unlock the power", "endless possibilities", "revolutionize your", "revolutionise your",
  "take it to the next level", "next level", "seamless experience", "seamlessly",
  "game-changing", "game changer", "in today's fast-paced", "elevate your", "transform your",
  "unleash", "supercharge", "empower your", "empowering", "harness the power", "cutting-edge",
  "next-gen", "next-generation", "all-in-one", "effortlessly", "effortless", "streamline your",
  "say goodbye to", "built for the future", "build the future", "scale without limits",
  "work smarter, not harder", "as technology continues to evolve", "reimagine", "reimagined",
  "like never before", "at your fingertips", "world-class", "best-in-class", "state-of-the-art",
  "look no further", "whether you're", "whether you are", "skyrocket", "boost your productivity",
  "unlock your", "designed to help you", "take control of",
];

const escapeRegExp = (value) => value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

// Whole words only, spaces and hyphens interchangeable, either apostrophe.
const PHRASE_PATTERNS = PHRASES.map((phrase) => ({
  label: phrase,
  re: new RegExp(
    `\\b${escapeRegExp(phrase).replace(/'/g, "['\u2019]").replace(/[ -]/g, "[\\s-]")}\\b`,
    "i",
  ),
}));

const SHAPE_PATTERNS = [
  {
    label: "not just X, it is Y",
    re: /\bnot (?:just|only) an? [^.!?]{1,40}[;,\u2014-]\s*(?:it|they|this|that)(?:\s+(?:is|are|was|were)|['\u2019](?:s|re))\b/i,
  },
  {
    label: "an authority with no name",
    re: /\b(?:experts|analysts|industry leaders|critics)\s+(?:say|believe|argue|agree|have (?:shown|found|long recognized))\b/i,
  },
];

const STOCK_PATTERNS = [...PHRASE_PATTERNS, ...SHAPE_PATTERNS];

const LEFTOVERS_RE = /\b(?:lorem ipsum|dolor sit amet|consectetur adipiscing|logoipsum|your company name|your brand name|company name here|logo here|your name here|insert (?:text|title|image|link) here|feature (?:one|two|three)|john doe|jane doe|acme (?:inc|corp)|featured title|paragraph of text beneath the heading|some quick example text|natural lead-in to additional content|this is some text inside of a div block|(?:heading|title|text|content) goes here|(?:your|add your) (?:title|heading|text|content|description) here)\b/i;
const BRACKETED_RE = /\[\s*(?:your|insert|add|placeholder|lorem)\b[^\]]{0,60}\]/i;
const RESIDUE_RE = /\bas an ai(?: language)? model\b|\bhere(?:'s| is) the (?:revised|updated|final) (?:article|draft|version|post)\b|\blet me know if you(?:'d| would) like me to\b|\[\s*cite:\s*\d+\s*\]|\bturn\d+search\d+\b/i;
const FAKE_COMPANY_RE = /\b(?:techcorp|tech corp|acme(?:\s+(?:inc|corp|co))?|your company|company name|lorem|ipsum|john doe|jane doe)\b/i;

const CLAIM_PATTERNS = [
  {
    label: "a customer count",
    re: /\b(?:trusted|used|loved|chosen|backed|preferred) by\s+(?:over\s+)?\d[\d,.]*\s*(?:k|m|\+)?\s*(?:teams|customers|users|businesses|companies|developers|creators|brands|organizations|people|professionals|stores|startups)\b/i,
  },
  {
    label: "a speed multiplier",
    re: /\b\d+(?:\.\d+)?\s*[x\u00d7]\s*(?:faster|quicker|more|better|cheaper|higher)\b/i,
  },
  {
    label: "a percentage claim",
    re: /\b\d+(?:\.\d+)?\s*%\s*(?:uptime|faster|less|more|cheaper|fewer|increase|higher|savings?|reduction|improvement|conversion|accuracy|growth)\b/i,
  },
  {
    label: "a time saving",
    re: /\bsav(?:e|es|ing)\s+\d+\s*(?:hours?|minutes?|days?|weeks?)\b/i,
  },
];

const SOURCE_WORDS_RE = /\b(?:source|sources|according to|measured|benchmark(?:ed)?|study|studies|report|audit|survey|research|SLA|methodology|see (?:our|the) data)\b/i;

// Emoji presentation only. Plain copyright, registered and trademark signs,
// arrows and check marks without the variation selector are text symbols.
const EMOJI_RE = /\p{Emoji_Presentation}|(?=\p{Extended_Pictographic})[\u{1F000}-\u{1FAFF}]|\p{Extended_Pictographic}\uFE0F|[#*0-9]\uFE0F?\u20E3|\p{Regional_Indicator}{2}/u;

const ARROW_RE = /[\u2197\u2196\u2198\u2199\u2192\u279C\u27F6]/u;

const COPY_TAGS = new Set(["h1", "h2", "h3", "h4", "p", "a", "button", "li"]);
const QUOTE_TAGS = new Set(["blockquote", "q", "cite", "figcaption"]);
const HEADING_TAGS = new Set(["h1", "h2", "h3", "h4", "h5", "h6"]);
const IMAGE_TAGS = new Set(["img", "image", "gatsbyimage", "nuxtimg"]);

const COPY_ATTRIBUTES = new Set(["title", "alt", "aria-label", "placeholder", "label"]);

// Icon packages whose presence is a stock icon set rather than drawn icons.
const ICON_PACKAGES = [
  "lucide-react", "lucide-svelte", "lucide-vue-next", "lucide", "lucide-static",
  "@heroicons/react", "@heroicons/vue", "heroicons",
  "react-icons", "@tabler/icons-react", "@tabler/icons", "@tabler/icons-vue",
  "@fortawesome/react-fontawesome", "@fortawesome/free-solid-svg-icons",
  "@fortawesome/free-regular-svg-icons", "font-awesome", "@phosphor-icons/react",
  "@phosphor-icons/vue", "phosphor-icons", "feather-icons", "react-feather",
  "bootstrap-icons", "material-icons", "@mui/icons-material", "ionicons",
  "remixicon", "boxicons", "react-bootstrap-icons", "iconoir-react", "iconoir",
];

// Tailwind accent families and the shades that read as kit defaults. Neutrals
// and status colours are left out, since nearly every project uses near-black
// text and a red error, kit or not.
const TAILWIND_ACCENTS = ["emerald", "teal", "cyan", "sky", "blue", "indigo", "violet", "purple", "fuchsia", "pink", "rose"];
const TAILWIND_SHADES = [300, 400, 500, 600, 700];
const TAILWIND_COLOR_CLASS_RE = new RegExp(
  `(?:^|[\\s"'\`])(?:[a-z-]+:)*(?:bg|text|border|from|via|to|ring|fill|stroke|shadow|accent|decoration|outline|divide|placeholder|caret)-(?:${TAILWIND_ACCENTS.join("|")})-(?:${TAILWIND_SHADES.join("|")})(?:\\/\\d{1,3})?(?=[\\s"'\`]|$)`,
);

// Kit default colours as literal values, from the SlopLens palette module.
const KIT_HEX = new Map([
  ["#818cf8", "Tailwind indigo-400"], ["#6366f1", "Tailwind indigo-500"], ["#4f46e5", "Tailwind indigo-600"], ["#4338ca", "Tailwind indigo-700"],
  ["#a78bfa", "Tailwind violet-400"], ["#8b5cf6", "Tailwind violet-500"], ["#7c3aed", "Tailwind violet-600"], ["#6d28d9", "Tailwind violet-700"],
  ["#c084fc", "Tailwind purple-400"], ["#a855f7", "Tailwind purple-500"], ["#9333ea", "Tailwind purple-600"], ["#7e22ce", "Tailwind purple-700"],
  ["#e879f9", "Tailwind fuchsia-400"], ["#d946ef", "Tailwind fuchsia-500"], ["#c026d3", "Tailwind fuchsia-600"], ["#a21caf", "Tailwind fuchsia-700"],
  ["#f472b6", "Tailwind pink-400"], ["#ec4899", "Tailwind pink-500"], ["#db2777", "Tailwind pink-600"], ["#be185d", "Tailwind pink-700"],
  ["#fb7185", "Tailwind rose-400"], ["#f43f5e", "Tailwind rose-500"], ["#e11d48", "Tailwind rose-600"], ["#be123c", "Tailwind rose-700"],
  ["#60a5fa", "Tailwind blue-400"], ["#3b82f6", "Tailwind blue-500"], ["#2563eb", "Tailwind blue-600"], ["#1d4ed8", "Tailwind blue-700"],
  ["#38bdf8", "Tailwind sky-400"], ["#0ea5e9", "Tailwind sky-500"], ["#0284c7", "Tailwind sky-600"], ["#0369a1", "Tailwind sky-700"],
  ["#22d3ee", "Tailwind cyan-400"], ["#06b6d4", "Tailwind cyan-500"], ["#0891b2", "Tailwind cyan-600"], ["#0e7490", "Tailwind cyan-700"],
  ["#2dd4bf", "Tailwind teal-400"], ["#14b8a6", "Tailwind teal-500"], ["#0d9488", "Tailwind teal-600"], ["#0f766e", "Tailwind teal-700"],
  ["#34d399", "Tailwind emerald-400"], ["#10b981", "Tailwind emerald-500"], ["#059669", "Tailwind emerald-600"], ["#047857", "Tailwind emerald-700"],
  ["#0d6efd", "Bootstrap primary blue"], ["#007bff", "Bootstrap 4 primary blue"], ["#6610f2", "Bootstrap indigo"],
  ["#6f42c1", "Bootstrap purple"], ["#d63384", "Bootstrap pink"], ["#20c997", "Bootstrap teal"], ["#0dcaf0", "Bootstrap cyan"], ["#17a2b8", "Bootstrap 4 info cyan"],
  ["#6200ee", "Material purple 500"], ["#3700b3", "Material purple 700"], ["#03dac6", "Material teal accent"], ["#3f51b5", "Material indigo"],
  ["#2196f3", "Material blue"], ["#673ab7", "Material deep purple"], ["#9c27b0", "Material purple"], ["#e91e63", "Material pink"],
]);

// Tailwind utility classes that carry a decorative effect.
const TAILWIND_EFFECT_RE = /(?:^|[\s"'`])(?:[a-z-]+:)*(?:bg-gradient-to-[a-z]+|bg-linear-to-[a-z]+|backdrop-blur(?:-\w+)?|shadow-\[[^\]]*\])(?=[\s"'`]|$)/;
const TAILWIND_ANIMATE_RE = /(?:^|[\s"'`])(?:[a-z-]+:)*(?:animate-(?!none)[a-z0-9-]+)(?=[\s"'`]|$)/;
const REDUCED_MOTION_RE = /prefers-reduced-motion|motion-safe:|motion-reduce:|useReducedMotion|MotionConfig|usePrefersReducedMotion/;

const TEXT_FILE_EXTENSIONS = new Set([
  "js", "ts", "jsx", "tsx", "mjs", "cjs", "vue", "svelte", "astro", "html", "css", "scss", "less",
]);

// Files that are never interface copy: tests, fixtures, stories and mocks.
// Their strings look exactly like shipped copy to a matcher, so they are left
// out by path. This is what keeps the scanner from flagging its own fixtures.
const NON_SHIPPED_PATH_RE = /(?:^|[/\\])(?:__tests__|__mocks__|__snapshots__|tests?|specs?|fixtures?|mocks?|e2e|stories)(?:[/\\]|$)|\.(?:test|spec|stories|story)\.[a-z]+$/i;

// ==========================================================================
// Comment blanking. Comments are replaced with spaces rather than removed, so
// every byte offset and therefore every line number stays correct.
// ==========================================================================

const REGEX_PRECEDERS = new Set(["", "(", ",", "=", ":", "[", "!", "&", "|", "?", "{", "}", ";", "+", "-", "*", "%", "~", "^", "<", ">", "\n"]);

function blankComments(source, options = {}) {
  const lineComments = options.lineComments !== false;
  const htmlComments = options.htmlComments === true;
  const out = source.split("");
  const n = source.length;
  const blank = (from, to) => {
    for (let k = from; k < to && k < n; k += 1) if (out[k] !== "\n") out[k] = " ";
  };

  let i = 0;
  let previous = "\n";
  while (i < n) {
    const ch = source[i];
    const next = source[i + 1];

    if (ch === '"' || ch === "'" || ch === "`") {
      const quote = ch;
      i += 1;
      while (i < n) {
        if (source[i] === "\\") { i += 2; continue; }
        if (source[i] === quote) { i += 1; break; }
        i += 1;
      }
      previous = quote;
      continue;
    }

    if (htmlComments && ch === "<" && source.startsWith("<!--", i)) {
      const end = source.indexOf("-->", i + 4);
      const stop = end === -1 ? n : end + 3;
      blank(i, stop);
      i = stop;
      continue;
    }

    if (ch === "/" && next === "*") {
      const end = source.indexOf("*/", i + 2);
      const stop = end === -1 ? n : end + 2;
      blank(i, stop);
      i = stop;
      continue;
    }

    if (ch === "/" && REGEX_PRECEDERS.has(previous)) {
      // A regular expression literal: skip it so a "//" inside is not read as
      // a comment. Character classes may contain an unescaped "/".
      let k = i + 1;
      let inClass = false;
      while (k < n) {
        const c = source[k];
        if (c === "\\") { k += 2; continue; }
        if (c === "\n") break;
        if (c === "[") inClass = true;
        else if (c === "]") inClass = false;
        else if (c === "/" && !inClass) { k += 1; break; }
        k += 1;
      }
      i = k;
      previous = "/";
      continue;
    }

    if (lineComments && ch === "/" && next === "/") {
      let end = source.indexOf("\n", i);
      if (end === -1) end = n;
      blank(i, end);
      i = end;
      continue;
    }

    if (!/\s/.test(ch)) previous = ch;
    else if (ch === "\n") previous = "\n";
    i += 1;
  }
  return out.join("");
}

// ==========================================================================
// Extraction
// ==========================================================================

function buildLineIndex(source) {
  const starts = [0];
  for (let i = 0; i < source.length; i += 1) if (source[i] === "\n") starts.push(i + 1);
  return starts;
}

function lineAt(starts, index) {
  let low = 0;
  let high = starts.length - 1;
  while (low < high) {
    const mid = (low + high + 1) >> 1;
    if (starts[mid] <= index) low = mid;
    else high = mid - 1;
  }
  return low + 1;
}

const ATTR_RE = /([A-Za-z_:@#][\w:.\-@#]*)\s*(?:=\s*(?:"([^"]*)"|'([^']*)'|\{([^{}]*)\}))?/g;

function parseAttributes(raw) {
  const attrs = {};
  const dynamic = new Set();
  ATTR_RE.lastIndex = 0;
  let match;
  while ((match = ATTR_RE.exec(raw)) !== null) {
    const name = match[1].toLowerCase();
    if (match[4] !== undefined) {
      // A braced value is an expression, so its text is not a literal string.
      attrs[name] = match[4];
      dynamic.add(name);
    } else {
      attrs[name] = match[2] ?? match[3] ?? "";
    }
  }
  // Spread props such as {...props} hide any attribute they set, so a rule
  // that depends on an absent attribute must stand down.
  const hasSpread = /\{\s*\.\.\./.test(raw);
  return { attrs, dynamic, hasSpread };
}

/**
 * Scan one tag starting at `start` (which points at '<').
 *
 * A regular expression cannot follow the nested braces in modern JSX, so the
 * attribute region is walked with brace depth and quote state instead. This
 * keeps the tag boundary, and therefore the line number, correct.
 */
function scanTag(source, start) {
  let i = start + 1;
  let closing = false;
  if (source[i] === "/") {
    closing = true;
    i += 1;
  }
  const nameStart = i;
  while (i < source.length && /[A-Za-z0-9.:_-]/.test(source[i])) i += 1;
  const tag = source.slice(nameStart, i);
  if (!tag) return null;

  const attrsStart = i;
  let quote = null;
  let depth = 0;
  while (i < source.length) {
    const ch = source[i];
    if (quote) {
      if (ch === "\\") { i += 2; continue; }
      if (ch === quote) quote = null;
      i += 1;
      continue;
    }
    if (ch === '"' || ch === "'" || ch === "`") { quote = ch; i += 1; continue; }
    if (ch === "{") { depth += 1; i += 1; continue; }
    if (ch === "}") { depth = Math.max(0, depth - 1); i += 1; continue; }
    if (ch === ">" && depth === 0) {
      let last = i - 1;
      while (last >= attrsStart && /\s/.test(source[last])) last -= 1;
      const selfClosing = source[last] === "/";
      return {
        closing,
        tag,
        rawAttrs: source.slice(attrsStart, selfClosing ? last : i),
        selfClosing,
        start,
        end: i + 1,
      };
    }
    i += 1;
  }
  return null;
}

/**
 * Extract markup elements from a JSX/HTML/Vue/Svelte/Astro source string.
 * This is a reader for the common shapes, not a parser. Anything ambiguous is
 * skipped rather than guessed.
 */
function extractMarkup(clean, starts) {
  const nodes = [];
  const classStrings = [];
  const stack = [];
  let cursor = 0;
  while (cursor < clean.length) {
    const lt = clean.indexOf("<", cursor);
    if (lt === -1) break;
    if (!/[A-Za-z/]/.test(clean[lt + 1] || "")) {
      cursor = lt + 1;
      continue;
    }
    const scanned = scanTag(clean, lt);
    if (!scanned) {
      cursor = lt + 1;
      continue;
    }
    cursor = scanned.end;

    const tag = scanned.tag.toLowerCase();
    if (scanned.closing) {
      const match = stack.map((entry) => entry.tag).lastIndexOf(tag);
      if (match !== -1) stack.length = match;
      continue;
    }

    const { attrs, dynamic, hasSpread } = parseAttributes(scanned.rawAttrs);
    const line = lineAt(starts, scanned.start);
    if (attrs.class) classStrings.push({ value: attrs.class, line });
    if (attrs.classname) classStrings.push({ value: attrs.classname, line });

    // A box inside another clickable box is the same defect, not a second
    // one, so the outermost handler is the one worth reporting.
    const insideClickable = stack.some((entry) => entry.clickable);
    const clickable = /\bonClick\b|@click\b|\bon:click\b/.test(scanned.rawAttrs);

    let text = "";
    let inner = "";
    if (!scanned.selfClosing) {
      const nextLt = clean.indexOf("<", scanned.end);
      const sliceEnd = nextLt === -1 ? clean.length : nextLt;
      text = clean.slice(scanned.end, sliceEnd).replace(/\{[^{}]*\}/g, " ").replace(/\s+/g, " ").trim();
      const lower = clean.toLowerCase();
      const closeIndex = lower.indexOf(`</${tag}`, scanned.end);
      inner = closeIndex === -1 ? clean.slice(scanned.end, sliceEnd) : clean.slice(scanned.end, closeIndex);
      stack.push({ tag, clickable });
    }

    nodes.push({ tag, text, inner, line, attrs, dynamic, raw: scanned.rawAttrs, hasSpread, insideClickable, selfClosing: scanned.selfClosing });
  }
  return { nodes, classStrings };
}

/** Extract style declarations and at-rule context from CSS-like source. */
function extractDeclarations(clean, starts) {
  const declarations = [];
  const ruleRe = /([^{}]+)\{([^{}]*)\}/g;
  let match;
  while ((match = ruleRe.exec(clean)) !== null) {
    const selector = match[1].trim();
    const body = match[2];
    const bodyStart = match.index + match[1].length + 1;
    const declRe = /([a-zA-Z-]+)\s*:\s*([^;{}]+)/g;
    let decl;
    while ((decl = declRe.exec(body)) !== null) {
      declarations.push({
        selector,
        body,
        property: decl[1].toLowerCase(),
        value: decl[2].trim(),
        line: lineAt(starts, bodyStart + decl.index),
      });
    }
  }
  return declarations;
}

/** Every string literal in the file, with its line, for import and copy scanning. */
function extractStringLiterals(clean, starts) {
  const values = [];
  const re = /(["'`])((?:\\.|(?!\1)[^\\])*)\1/g;
  let match;
  while ((match = re.exec(clean)) !== null) {
    values.push({ value: match[2], line: starts ? lineAt(starts, match.index) : 1 });
  }
  return values;
}

// ==========================================================================
// Small helpers
// ==========================================================================

/** Concrete detail: figures, prices, marks, or a proper noun in a sentence. */
function isSpecific(raw) {
  const text = raw.trim().replace(/^(?:step\s*)?\d{1,2}(?!\d)/i, "");
  if (/\d|[$€£¥%®™]/.test(text)) return true;
  const words = text.split(/\s+/).filter((word) => /^[A-Za-z]/.test(word));
  const inner = words.filter((word, i) => i > 0 && !/[.!?:]$/.test(words[i - 1]));
  const caps = inner.filter((word) => /^[A-Z][\w\u2019'-]/.test(word));
  return words.length >= 3 && caps.length > 0 && caps.length < inner.length * 0.6;
}

const isShortCopy = (text) => text.length >= 2 && text.length <= 240;
const isQuoted = (node) => QUOTE_TAGS.has(node.tag) || /^\s*["\u201c\u2018\u00ab]/.test(node.text);

function findClaim(text) {
  return CLAIM_PATTERNS.find((claim) => claim.re.test(text));
}

function findStockPhrase(text) {
  return STOCK_PATTERNS.filter((pattern) => pattern.re.test(text)).map((pattern) => pattern.label);
}

function findPlaceholder(text) {
  const match = text.match(LEFTOVERS_RE) || text.match(BRACKETED_RE) || text.match(RESIDUE_RE);
  return match ? match[0] : null;
}

function hasSpreadAttribute(raw) {
  return /\{\s*\.\.\./.test(raw);
}

// ==========================================================================
// Findings collection
// ==========================================================================

function createCollector() {
  const findings = [];
  return {
    findings,
    add(ruleId, file, line, text, detail) {
      findings.push({ ruleId, file, line, text: String(text || "").slice(0, 200), detail: detail || "" });
    },
  };
}

// ==========================================================================
// Per-file analysis
// ==========================================================================

function analyseFile(filePath, source, context) {
  const ext = path.extname(filePath).toLowerCase().slice(1);
  const collector = createCollector();
  const isStyle = ext === "css" || ext === "scss" || ext === "less";
  const isMarkup = ["jsx", "tsx", "vue", "svelte", "astro", "html"].includes(ext);

  const lineComments = !isStyle || ext === "scss" || ext === "less";
  const clean = blankComments(source, { lineComments, htmlComments: isMarkup });
  const starts = buildLineIndex(clean);

  const { nodes, classStrings } = isMarkup ? extractMarkup(clean, starts) : { nodes: [], classStrings: [] };
  const declarations = isStyle ? extractDeclarations(clean, starts) : [];
  const stringLiterals = extractStringLiterals(clean, starts);

  // For script files the class strings still matter, since Tailwind classes
  // often live in template literals rather than class attributes.
  if (!isMarkup && !isStyle) {
    for (const { value, line } of stringLiterals) {
      if (/[a-z-]+:(?:bg|text|border|from|via|to|ring|fill|stroke|shadow|backdrop|animate|outline)-/.test(value)) {
        classStrings.push({ value, line });
      }
    }
  }

  const shortCopy = nodes.filter((node) => COPY_TAGS.has(node.tag) && isShortCopy(node.text) && !isQuoted(node));

  runCopyRules(collector, filePath, nodes, shortCopy);
  const effectHits = runSurfaceRules(collector, filePath, { clean, starts, declarations, classStrings, nodes, isStyle, isMarkup, stringLiterals });
  runProofRules(collector, filePath, nodes, shortCopy, declarations);
  runSupportingRules(collector, filePath, { clean, stringLiterals, classStrings, declarations, tailwindConfigOverrides: context.tailwindConfigOverrides });
  runQualityRules(collector, filePath, { nodes, clean, declarations, classStrings, ext, isMarkup, resolveAsset: context.resolveAsset });

  return { findings: collector.findings, effectHits, clean, nodes, classStrings, declarations };
}

// ---- copy ----

function runCopyRules(collector, filePath, nodes, shortCopy) {
  // generic-copy
  const matched = shortCopy
    .map((node) => ({ node, found: findStockPhrase(node.text) }))
    .filter((entry) => entry.found.length);
  if (matched.length) {
    const share = matched.length / Math.max(1, shortCopy.length);
    const concrete = shortCopy.filter((node) => isSpecific(node.text)).length / Math.max(1, shortCopy.length);
    for (const { node, found } of matched) {
      const note = share >= 0.04
        ? `Stock phrases appear in ${matched.length} of ${shortCopy.length} short copy blocks in this file.`
        : "This is the only stock phrase in this file, too small a share to count more than once.";
      collector.add(
        "generic-copy", filePath, node.line, node.text,
        `Found ${found.map((phrase) => `"${phrase}"`).join(", ")}. ${note}${concrete >= 0.3 ? " Most of the other copy is concrete, so this counts lightly." : ""}`,
      );
    }
  }

  // em-dash-copy
  const dashed = shortCopy.filter((node) => /\u2014/.test(node.text.replace(/^\s*\u2014/, "").replace(/\d\s*\u2014\s*\d/g, "")));
  if (dashed.length >= 3 && dashed.length / Math.max(1, shortCopy.length) >= 0.06) {
    for (const node of dashed) {
      collector.add("em-dash-copy", filePath, node.line, node.text, `${dashed.length} of ${shortCopy.length} headings, buttons and short blurbs in this file use an em dash.`);
    }
  }
}

// ---- surface ----

function runSurfaceRules(collector, filePath, ctx) {
  const { declarations, classStrings, nodes, clean, starts, stringLiterals, isMarkup } = ctx;

  // gradient-text: both declarations in the same rule, or a text-clip utility
  // beside a gradient utility in the same class string.
  const clipRules = declarations.filter((decl) => decl.property === "background-clip" || decl.property === "-webkit-background-clip");
  const gradientRules = declarations.filter((decl) => /gradient\(/.test(decl.value) && /background/.test(decl.property));
  for (const clip of clipRules) {
    if (!/text/.test(clip.value)) continue;
    const sameRule = gradientRules.find((gradient) => gradient.selector === clip.selector);
    if (sameRule) {
      collector.add("gradient-text", filePath, clip.line, clip.selector, "This rule clips the background to the text and paints it with a gradient.");
    }
  }
  for (const cls of classStrings) {
    if (/bg-clip-text/.test(cls.value) && /(?:bg-gradient-to-|bg-linear-to-)/.test(cls.value)) {
      collector.add("gradient-text", filePath, cls.line, cls.value, "This class string clips the background to the text and paints it with a gradient.");
    }
  }

  // decorative-effects: recorded per file, then only reported when three or
  // more separate files carry one.
  const effectHits = [];
  for (const decl of declarations) {
    if (/gradient\(/.test(decl.value) && /background/.test(decl.property)) effectHits.push({ line: decl.line, detail: "a gradient background" });
    else if (decl.property === "backdrop-filter" && /blur/.test(decl.value)) effectHits.push({ line: decl.line, detail: "a frosted backdrop blur" });
    else if (decl.property === "box-shadow" && /rgba?\(\s*\d+\s*,\s*\d+\s*,\s*\d+/.test(decl.value) && /(\d{2,})px/.test(decl.value)) {
      const blur = (decl.value.match(/(-?[\d.]+)px/g) || []).map(parseFloat);
      const rgb = decl.value.match(/rgba?\((\d+)\s*,\s*(\d+)\s*,\s*(\d+)/);
      if (rgb && blur.length >= 3) {
        const [r, g, b] = [Number(rgb[1]), Number(rgb[2]), Number(rgb[3])];
        const vivid = Math.max(r, g, b) - Math.min(r, g, b) >= 60;
        if (vivid && blur[2] >= 24) effectHits.push({ line: decl.line, detail: "a large coloured glow" });
      }
    }
  }
  for (const cls of classStrings) {
    // A modal or sheet backdrop is an overlay, not a decorated section. Its
    // blur is one conventional pattern repeated by each dialog, so it is left
    // out rather than counted as surface slop.
    if (/(?:^|\s)inset-0(?:\s|$)/.test(cls.value)) continue;
    const effect = cls.value.match(TAILWIND_EFFECT_RE);
    if (effect) effectHits.push({ line: cls.line, detail: `the ${effect[0].trim()} utility` });
  }

  // emoji-decoration
  const emojiNodes = nodes.filter((node) => ["h1", "h2", "h3", "h4", "li", "button"].includes(node.tag) && EMOJI_RE.test(node.text));
  if (emojiNodes.length >= 2) {
    for (const node of emojiNodes) {
      collector.add("emoji-decoration", filePath, node.line, node.text, `${emojiNodes.length} headings, list items or buttons in this file include emoji.`);
    }
  }

  // link-decorations
  const links = nodes.filter((node) => node.tag === "a" && node.text.length >= 2);
  const arrowLinks = links.filter((node) => ARROW_RE.test(node.text));
  if (arrowLinks.length >= 3 && arrowLinks.length / Math.max(1, links.length) >= 0.15) {
    for (const node of arrowLinks) {
      collector.add("link-decorations", filePath, node.line, node.text, `${arrowLinks.length} of ${links.length} links in this file end with an arrow.`);
    }
  }

  // mixed-icons: two icon packages, or outline and solid variants of one.
  const importedIcons = ICON_PACKAGES.filter((pkg) => new RegExp(`from\\s+["'\`]${escapeRegExp(pkg)}["'\`]|require\\(\\s*["'\`]${escapeRegExp(pkg)}`).test(clean));
  if (importedIcons.length >= 2) {
    collector.add("mixed-icons", filePath, 1, importedIcons.join(", "), `This file imports icons from ${importedIcons.length} different icon packages.`);
  } else if (importedIcons.length === 1) {
    const outline = /Outline\b/.test(clean);
    const solid = /(?:Solid|Filled)\b/.test(clean);
    if (outline && solid) {
      collector.add("mixed-icons", filePath, 1, importedIcons[0], `This file uses both outline and solid variants from ${importedIcons[0]}.`);
    }
  }
  void stringLiterals;
  void starts;
  void isMarkup;
  return effectHits;
}

// ---- proof ----

function runProofRules(collector, filePath, nodes, shortCopy, declarations) {
  void declarations;

  // fake-testimonial
  for (const node of nodes) {
    if (!QUOTE_TAGS.has(node.tag)) continue;
    if (node.text.length < 8) continue;
    const match = node.text.match(FAKE_COMPANY_RE);
    if (match) {
      collector.add("fake-testimonial", filePath, node.line, node.text, `"${match[0]}" reads as a placeholder company name in an attribution.`);
    }
  }

  // unsourced-stats
  for (const node of shortCopy) {
    const text = node.text;
    if (text.length < 8 || text.length > 180) continue;
    if (SOURCE_WORDS_RE.test(text)) continue;
    if (node.tag === "a") continue;
    const claim = findClaim(text);
    if (claim) {
      collector.add("unsourced-stats", filePath, node.line, text, `This gives ${claim.label} with no source word in the same block. The source may live elsewhere, so this is a candidate for review.`);
    }
  }

  // template-text
  for (const node of nodes) {
    if (!COPY_TAGS.has(node.tag) || node.text.length < 2) continue;
    const placeholder = findPlaceholder(node.text);
    if (placeholder) {
      collector.add("template-text", filePath, node.line, node.text, `Found "${placeholder}" in interface copy.`);
    }
  }
  for (const node of nodes) {
    if (IMAGE_TAGS.has(node.tag) && node.attrs.alt) {
      const placeholder = findPlaceholder(node.attrs.alt);
      if (placeholder) collector.add("template-text", filePath, node.line, node.attrs.alt, `Found "${placeholder}" in image alt text.`);
    }
  }
  const deadLinks = nodes.filter((node) => {
    if (node.tag !== "a") return false;
    const href = node.attrs.href ?? "";
    const label = node.text || node.attrs["aria-label"] || "";
    if (label.length < 2 || /\d/.test(label)) return false;
    return href === "#" || href === "" || /^javascript:/i.test(href);
  });
  if (deadLinks.length >= 4) {
    for (const node of deadLinks) {
      collector.add("template-text", filePath, node.line, node.text, `${deadLinks.length} links in this file point at "#" or nowhere at all.`);
    }
  }
}

// ---- supporting ----

function runSupportingRules(collector, filePath, ctx) {
  const { clean, classStrings, declarations, stringLiterals } = ctx;

  // default-palette
  if (!ctx.tailwindConfigOverrides) {
    const classHits = classStrings.filter((cls) => TAILWIND_COLOR_CLASS_RE.test(cls.value));
    const hexHits = [];
    for (const literal of stringLiterals) {
      const hexes = literal.value.match(/#[0-9a-fA-F]{6}\b/g) || [];
      for (const hex of hexes) if (KIT_HEX.has(hex.toLowerCase())) hexHits.push({ hex, line: literal.line });
    }
    for (const decl of declarations) {
      const hexes = decl.value.match(/#[0-9a-fA-F]{6}\b/g) || [];
      for (const hex of hexes) if (KIT_HEX.has(hex.toLowerCase())) hexHits.push({ hex, line: decl.line });
    }
    const uses = classHits.length + hexHits.length;
    if (uses >= 3) {
      const example = classHits[0]
        ? { text: classHits[0].value, line: classHits[0].line, name: "a Tailwind accent class" }
        : { text: hexHits[0].hex, line: hexHits[0].line, name: KIT_HEX.get(hexHits[0].hex.toLowerCase()) };
      collector.add("default-palette", filePath, example.line, example.text, `${uses} uses of a kit accent colour in this file, including ${example.name}. The theme may override it, so an untouched default is not established.`);
    }
  }

  // icon-library
  for (const pkg of ICON_PACKAGES) {
    const importRe = new RegExp(`from\\s+["'\`]${escapeRegExp(pkg)}["'\`]`, "g");
    const imports = (clean.match(importRe) || []).length;
    if (imports >= 1) {
      collector.add("icon-library", filePath, 1, pkg, `This file imports icons from ${pkg}, a stock icon set. A stock set is a normal choice and is not evidence of poor quality on its own.`);
      break;
    }
  }
}

// ---- quality ----

function runQualityRules(collector, filePath, ctx) {
  const { nodes, declarations, classStrings, ext, isMarkup } = ctx;

  // missing-alt
  if (isMarkup) {
    for (const node of nodes) {
      if (!IMAGE_TAGS.has(node.tag)) continue;
      if (node.hasSpread) continue;
      if (Object.prototype.hasOwnProperty.call(node.attrs, "alt")) continue;
      const hasDynamicAlt = /\balt\s*=\s*\{/.test(node.raw || "");
      if (hasDynamicAlt) continue;
      collector.add("missing-alt", filePath, node.line, node.attrs.src || node.tag, `This <${node.tag}> element is written with no alt attribute.`);
    }

    // broken-image
    for (const node of nodes) {
      if (!IMAGE_TAGS.has(node.tag)) continue;
      const src = node.attrs.src;
      if (src === undefined) continue;
      // An expression, a spread or a template literal is not a literal path,
      // so it cannot be judged from source.
      if (node.dynamic.has("src")) continue;
      if (/\bsrc\s*=\s*\{/.test(node.raw || "")) continue;
      if (src === "") {
        collector.add("broken-image", filePath, node.line, "src=\"\"", "This image has an empty source, so nothing can load.");
        continue;
      }
      const verdict = ctx.resolveAsset ? ctx.resolveAsset(src, filePath) : null;
      if (verdict === "missing") {
        collector.add("broken-image", filePath, node.line, src, `The image source "${src}" does not exist, checked case-exactly, in the public directory beside this file.`);
      }
    }

    // click-targets
    for (const node of nodes) {
      if (node.tag !== "div" && node.tag !== "span") continue;
      if (node.insideClickable) continue;
      const raw = node.raw || "";
      // A modal backdrop that closes on an outside click is a conventional
      // overlay rather than a control, and it is not the defect this rule
      // describes.
      if (/\baria-hidden\b/.test(raw) || /\brole\s*=\s*["'](?:presentation|none)["']/.test(raw)) continue;
      if (/\b(?:fixed\s+)?inset-0\b/.test(raw)) continue;
      const clickable = /\bonClick\b/.test(raw) || /@click\b/.test(raw) || /\bon:click\b/.test(raw);
      if (!clickable) continue;
      if (/\brole\s*=/.test(raw) || /\btabIndex\s*=|\btabindex\s*=/.test(raw)) continue;
      if (/\bonKeyDown\b|\bonKeyUp\b|\bon:keydown\b/.test(raw)) continue;
      collector.add("click-targets", filePath, node.line, node.text || node.tag, `This <${node.tag}> reacts to a click with no role and no tab stop, so a keyboard cannot reach it.`);
    }

    // control-labels
    for (const node of nodes) {
      if (node.tag !== "button" && node.tag !== "a") continue;
      // Attribute names are checked on the raw tag text, because a JSX value
      // such as aria-label={`Edit ${title}`} contains nested braces that a
      // value regex cannot capture.
      if (/\b(?:aria-label|aria-labelledby|title)\s*=/.test(node.raw || "")) continue;
      if (node.hasSpread) continue;
      // Visible text anywhere inside the element counts as a label, including
      // text nested in child elements. Only an element whose entire content is
      // child tags, with no text and no expression, is a candidate.
      const remainder = (node.inner || "").replace(/<\/?[^>]+>/g, "").trim();
      if (remainder.length > 0) continue;
      if (!/<svg|<img|<[A-Z]/.test(node.inner || "")) continue;
      collector.add("control-labels", filePath, node.line, node.tag, `This <${node.tag}> holds only an icon and has no aria-label, aria-labelledby or title.`);
    }

    // skipped-headings, only for complete documents
    if (ext === "html" || ext === "astro") {
      const heads = nodes.filter((node) => HEADING_TAGS.has(node.tag) && node.text.length >= 2);
      for (let i = 1; i < heads.length; i += 1) {
        const from = Number(heads[i - 1].tag[1]);
        const to = Number(heads[i].tag[1]);
        if (to - from > 1) {
          collector.add("skipped-headings", filePath, heads[i].line, heads[i].text, `A <${heads[i].tag}> follows the <${heads[i - 1].tag}> "${heads[i - 1].text.slice(0, 50)}" in this document.`);
        }
      }
    }
  }

  // focus-indicators. Removing an outline is only a defect when nothing
  // replaces it. A box-shadow, border, background or ring in the same rule is
  // a replacement, and a file that defines :focus-visible anywhere covers its
  // own removals. Both are common in real design systems, so a narrower test
  // would report correct code.
  const fileHasFocusVisible = /:focus-visible|focus-visible:/.test(ctx.clean || "");
  if (!fileHasFocusVisible) {
    const outlineRules = declarations.filter((decl) => decl.property === "outline" && /^(?:none|0(?:px)?)$/i.test(decl.value));
    for (const decl of outlineRules) {
      if (!/focus/.test(decl.selector)) continue;
      if (/:focus-visible/.test(decl.selector)) continue;
      if (/(?:box-shadow|border|background|color|ring|filter|outline-color|outline-width)\s*:/i.test(decl.body || "")) continue;
      collector.add("focus-indicators", filePath, decl.line, `${decl.selector} { outline: ${decl.value} }`, "This rule removes the outline with no replacement style in the same rule, and the file defines no focus-visible rule.");
    }
  }
  for (const cls of classStrings) {
    if (!/(?:^|[\s"'`])outline-none(?:[\s"'`]|$)/.test(cls.value)) continue;
    if (/focus-visible:|focus:(?:ring|outline|border|shadow)/.test(cls.value)) continue;
    collector.add("focus-indicators", filePath, cls.line, cls.value, "This class string removes the outline with no focus-visible replacement in the same string.");
  }

  // motion-behavior is handled per package in the runner, which knows whether
  // any guard exists anywhere in the package. A per-file check would invent
  // problems wherever the guard lives in a global stylesheet.
}

// ==========================================================================
// Motion guard check (per package)
// ==========================================================================

function hasReducedMotionGuard(sources) {
  return sources.some((source) => REDUCED_MOTION_RE.test(source));
}

function collectMotionSites(files) {
  const sites = [];
  for (const file of files) {
    const declHits = [];
    for (const decl of file.declarations) {
      if (decl.property === "animation" || decl.property === "animation-name") {
        declHits.push({ line: decl.line, detail: `an animation declared in ${path.basename(file.path)}` });
      }
    }
    const classHits = [];
    for (const cls of file.classStrings) {
      const animate = cls.value.match(TAILWIND_ANIMATE_RE);
      if (animate) classHits.push({ line: cls.line, detail: `the ${animate[0].trim()} utility in ${path.basename(file.path)}` });
    }

    // One animation is one site. A keyframe block and the rule that uses it
    // describe the same motion, so the declaration wins and the block is only
    // used when nothing else names it.
    if (declHits.length) sites.push(...declHits.map((hit) => ({ path: file.path, ...hit })));
    else if (/@keyframes/.test(file.clean)) sites.push({ path: file.path, line: 1, detail: `a keyframe animation in ${path.basename(file.path)}` });
    else sites.push(...classHits.map((hit) => ({ path: file.path, ...hit })));
  }
  // One animation in one file is one finding, however many times the same
  // utility is repeated in that file.
  const seen = new Set();
  return sites.filter((site) => {
    const key = `${site.path}|${site.detail}`;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

// ==========================================================================
// Asset resolution (case-exact)
// ==========================================================================

function nearestPackageRoot(filePath, rootDir) {
  const absoluteRoot = path.resolve(rootDir);
  let dir = path.dirname(filePath);
  for (;;) {
    if (fs.existsSync(path.join(dir, "package.json"))) return dir;
    const parent = path.dirname(dir);
    if (parent === dir || !path.resolve(dir).startsWith(absoluteRoot)) return absoluteRoot;
    dir = parent;
  }
}

function makeAssetResolver(rootDir) {
  const dirCache = new Map();
  const listDir = (dir) => {
    if (!dirCache.has(dir)) {
      try {
        dirCache.set(dir, new Set(fs.readdirSync(dir)));
      } catch {
        dirCache.set(dir, null);
      }
    }
    return dirCache.get(dir);
  };

  // Windows 8.3 aliases such as NUBIAV~1 never appear in a directory listing,
  // so the existing prefix is resolved to its long form before any segment is
  // compared. Only the base has to exist; the segments below it are the ones
  // under test.
  const canonical = (value) => {
    try {
      return fs.realpathSync.native ? fs.realpathSync.native(value) : fs.realpathSync(value);
    } catch {
      return value;
    }
  };

  const existsExact = (base, segments) => {
    let cursor = canonical(base);
    for (const part of segments) {
      const entries = listDir(cursor);
      if (!entries || !entries.has(part)) return false;
      cursor = path.join(cursor, part);
    }
    return true;
  };

  const packageRoot = (filePath) => {
    let dir = path.dirname(filePath);
    for (;;) {
      if (fs.existsSync(path.join(dir, "package.json"))) return dir;
      const parent = path.dirname(dir);
      if (parent === dir || !dir.startsWith(rootDir)) return rootDir;
      dir = parent;
    }
  };

  return (src, filePath) => {
    if (typeof src !== "string" || src.length === 0) return null;
    if (/^(?:[a-z][a-z0-9+.-]*:|\/\/)/i.test(src)) return null; // URL, protocol or protocol-relative
    if (src.startsWith("data:") || src.startsWith("#")) return null;
    if (/[{}]/.test(src)) return null; // dynamic expression
    const root = packageRoot(filePath);
    if (src.startsWith("/")) {
      const segments = src.slice(1).split("/").filter(Boolean);
      const bases = [path.join(root, "public"), path.join(root, "static"), path.join(root, "assets")];
      for (const base of bases) {
        if (!listDir(base)) continue;
        return existsExact(base, segments) ? "ok" : "missing";
      }
      return null;
    }
    const base = path.dirname(filePath);
    const candidate = path.resolve(base, src);
    if (!candidate.startsWith(rootDir)) return null;
    const segments = path.relative(base, candidate).split(path.sep).filter(Boolean);
    return existsExact(base, segments) ? "ok" : "missing";
  };
}

// ==========================================================================
// Reports
// ==========================================================================

const EM_DASH = "\u2014";

function forLog(text) {
  return String(text).replace(/\u2014/g, "[em dash]");
}

function ruleById(id) {
  return CATALOG.rules.find((rule) => rule.id === id);
}

function summarise(results) {
  const byRule = new Map();
  for (const finding of results.findings) {
    if (!byRule.has(finding.ruleId)) byRule.set(finding.ruleId, []);
    byRule.get(finding.ruleId).push(finding);
  }
  const primary = [];
  const supporting = [];
  const unassessed = [];

  for (const rule of CATALOG.rules) {
    const findings = byRule.get(rule.id) || [];
    if (rule.assessment === "unassessed") {
      unassessed.push({ rule, findings });
    } else if (rule.supporting) {
      supporting.push({ rule, findings });
    } else {
      primary.push({ rule, findings });
    }
  }
  return { primary, supporting, unassessed, byRule };
}

/**
 * The supporting gate: a supporting signal only counts when at least one
 * non-supporting slop signal was found. A stock icon set or a kit palette is
 * a normal choice on its own and never establishes poor quality.
 */
function splitSignals(summary) {
  const primarySlopCount = summary.primary
    .filter((group) => group.rule.category === "slop")
    .reduce((total, group) => total + group.findings.length, 0);
  const gateOpen = primarySlopCount > 0;
  return { gateOpen, primarySlopCount };
}

function countPrimaryFindings(summary) {
  return summary.primary.reduce((total, group) => total + group.findings.length, 0);
}

function generateSlopScanLog(results) {
  const summary = summarise(results);
  const { gateOpen } = splitSignals(summary);
  const lines = [];

  lines.push("=".repeat(64));
  lines.push("YEKNAL SLOP SCAN");
  lines.push("=".repeat(64));
  lines.push("");
  lines.push(`Date:            ${results.timestamp}`);
  lines.push(`Project:         ${results.projectDir}`);
  lines.push(`Files read:      ${results.filesRead}`);
  lines.push(`Rule version:    ${results.ruleVersion}`);
  lines.push(`Rule source:     ${results.ruleSource}`);
  lines.push("");

  lines.push("What this scan can and cannot do");
  lines.push("-".repeat(64));
  for (const limitation of CATALOG.limitations) lines.push(`  ${forLog(limitation)}`);
  lines.push("");
  lines.push("  Em dashes inside quoted evidence are shown below as [em dash]. The JSON");
  lines.push("  report keeps the exact characters.");
  lines.push("");

  const section = (title, groups) => {
    const withFindings = groups.filter((group) => group.findings.length > 0);
    if (!withFindings.length) return;
    lines.push("-".repeat(64));
    lines.push(title);
    lines.push("-".repeat(64));
    lines.push("");
    for (const { rule, findings } of withFindings) {
      const assessment = rule.assessment === "measured" ? "measured" : "heuristic";
      lines.push(`  [${rule.id}] ${rule.name} (${assessment}) - ${findings.length} finding${findings.length === 1 ? "" : "s"}`);
      lines.push(`      ${forLog(rule.staticPlain)}`);
      lines.push("");
      for (const finding of findings) {
        lines.push(`      ${forLog(relative(results.projectDir, finding.file))}:${finding.line}`);
        if (finding.text) lines.push(`        seen: ${forLog(finding.text.slice(0, 160))}`);
        if (finding.detail) lines.push(`        ${forLog(finding.detail)}`);
        lines.push(`        fix: ${forLog(rule.fix)}`);
        lines.push("");
      }
    }
  };

  section("SLOP SIGNALS", summary.primary.filter((group) => group.rule.category === "slop"));
  section("QUALITY ISSUES", summary.primary.filter((group) => group.rule.category === "quality"));

  const quiet = summary.primary.filter((group) => group.findings.length === 0);
  if (quiet.length) {
    lines.push("-".repeat(64));
    lines.push("CHECKED, NOTHING FOUND");
    lines.push("-".repeat(64));
    lines.push("");
    for (const { rule } of quiet) {
      lines.push(`  [${rule.id}] ${rule.name} (${rule.assessment})`);
    }
    lines.push("");
  }

  lines.push("-".repeat(64));
  lines.push("SUPPORTING SIGNALS");
  lines.push("-".repeat(64));
  lines.push("");
  const supportingExamples = (findings) => {
    for (const finding of findings.slice(0, 5)) {
      lines.push(`      ${forLog(relative(results.projectDir, finding.file))}:${finding.line}  ${forLog(finding.detail)}`);
    }
    if (findings.length > 5) lines.push(`      and ${findings.length - 5} more`);
  };

  if (!summary.supporting.length) {
    lines.push("  None observed.");
    lines.push("");
  } else if (gateOpen) {
    lines.push("  These are reported because at least one slop signal was also found. They add");
    lines.push("  context and never count on their own.");
    lines.push("");
    for (const { rule, findings } of summary.supporting) {
      lines.push(`  [${rule.id}] ${rule.name} - ${findings.length} observation${findings.length === 1 ? "" : "s"}`);
      lines.push(`      ${forLog(rule.staticPlain)}`);
      supportingExamples(findings);
      lines.push("");
    }
  } else {
    lines.push("  Observed but not counted, because no slop signal was found alongside them.");
    lines.push("  A stock icon set or a kit palette is a normal choice and is not evidence of");
    lines.push("  poor quality on its own.");
    lines.push("");
    for (const { rule, findings } of summary.supporting) {
      lines.push(`  [${rule.id}] ${rule.name} - ${findings.length} observation${findings.length === 1 ? "" : "s"}`);
      supportingExamples(findings);
      lines.push("");
    }
  }

  lines.push("-".repeat(64));
  lines.push("NOT CHECKED");
  lines.push("-".repeat(64));
  lines.push("");
  lines.push("  These checks need the rendered page. They are not guessed here.");
  lines.push("");
  for (const { rule } of summary.unassessed) {
    lines.push(`  [${rule.id}] ${rule.name}`);
    lines.push(`      ${forLog(rule.unassessedReason || "Needs the rendered page.")}`);
  }
  lines.push("");
  lines.push("  For the rendered checks, scan the live page at the SlopLens site.");
  lines.push("");

  lines.push("-".repeat(64));
  lines.push("COVERAGE");
  lines.push("-".repeat(64));
  lines.push("");
  lines.push(`  Files read:        ${results.coverage.read}`);
  lines.push(`  Files skipped:     ${results.coverage.filtered} (ignored paths, not source, or excluded by policy)`);
  lines.push(`  Too large:         ${results.coverage.tooLarge}`);
  lines.push(`  Unreadable:        ${results.coverage.unreadable}`);
  lines.push(`  Too deep:          ${results.coverage.tooDeep}`);
  lines.push(`  Skipped by policy: ${results.coverage.excluded} (test, fixture, story or mock paths)`);
  lines.push("");

  lines.push("=".repeat(64));
  lines.push("END OF REPORT");
  lines.push("=".repeat(64));
  lines.push("");

  return lines.join("\n");
}

function relative(root, file) {
  return path.relative(root, file).replace(/\\/g, "/");
}

function generateSlopScanJson(results) {
  const summary = summarise(results);
  const { gateOpen } = splitSignals(summary);
  const payload = {
    schemaVersion: "1.0.0",
    tool: {
      name: "yeknal",
      command: "slopscan",
      informationUri: "https://github.com/tryraisins/MD_Files",
    },
    ruleVersion: results.ruleVersion,
    ruleSource: results.ruleSource,
    timestamp: results.timestamp,
    projectDir: results.projectDir,
    limitations: CATALOG.limitations,
    filesRead: results.filesRead,
    coverage: results.coverage,
    supportingGateOpen: gateOpen,
    findings: results.findings.map((finding) => ({
      ruleId: finding.ruleId,
      file: relative(results.projectDir, finding.file),
      line: finding.line,
      text: finding.text,
      detail: finding.detail,
    })),
    notChecked: summary.unassessed.map(({ rule }) => ({
      ruleId: rule.id,
      name: rule.name,
      reason: rule.unassessedReason || "Needs the rendered page.",
    })),
  };
  // Keep the serialized JSON free of literal em dashes while preserving the
  // exact characters through the \u2014 escape, so evidence survives a parse.
  return `${JSON.stringify(payload, null, 2).replace(/\u2014/g, "\\u2014")}\n`;
}

// ==========================================================================
// Runner
// ==========================================================================

async function collectCandidateFiles(rootDir, options) {
  const excluded = [];
  const gitFiles = await listGitVisibleFiles(rootDir);
  if (gitFiles && !options.forceWalk) {
    const files = [];
    for (const file of gitFiles) {
      const name = path.basename(file);
      const ext = path.extname(name).toLowerCase().slice(1);
      if (!TEXT_FILE_EXTENSIONS.has(ext)) continue;
      // Exclusions are matched against the path relative to the scan root, so
      // a project that itself lives under a folder named tests or tmp is not
      // silently skipped in its entirety.
      const rel = path.relative(rootDir, file).replace(/\\/g, "/");
      if (NON_SHIPPED_PATH_RE.test(rel)) { excluded.push(file); continue; }
      if (isExcludedByPatterns(file, rootDir, options.ignore)) { excluded.push(file); continue; }
      files.push(file);
    }
    return { files, coverage: { read: files.length, filtered: 0, tooLarge: 0, unreadable: 0, tooDeep: 0, excluded: excluded.length } };
  }

  const { files, coverage } = await walkFiles(rootDir, {
    accept: (name, fullPath) => {
      const ext = path.extname(name).toLowerCase().slice(1);
      if (!TEXT_FILE_EXTENSIONS.has(ext)) return false;
      const rel = path.relative(rootDir, fullPath).replace(/\\/g, "/");
      if (NON_SHIPPED_PATH_RE.test(rel)) { excluded.push(fullPath); return false; }
      if (isExcludedByPatterns(fullPath, rootDir, options.ignore)) { excluded.push(fullPath); return false; }
      return true;
    },
  });
  return { files, coverage: { ...coverage, excluded: excluded.length } };
}

function isExcludedByPatterns(file, rootDir, patterns) {
  if (!patterns || !patterns.length) return false;
  const rel = path.relative(rootDir, file).replace(/\\/g, "/");
  return patterns.some((pattern) => globMatch(rel, pattern));
}

/**
 * A small glob matcher for --ignore. Supports *, ** and ?, matches forward
 * slash relative paths, treats a trailing slash as a directory, and matches
 * case-insensitively on Windows.
 */
function globMatch(value, pattern) {
  let target = value;
  let source = pattern;
  if (process.platform === "win32") {
    target = target.toLowerCase();
    source = source.toLowerCase();
  }
  if (source.endsWith("/")) source = `${source}**`;
  const re = new RegExp(`^${globToRegExp(source)}$`);
  return re.test(target);
}

function globToRegExp(pattern) {
  let out = "";
  for (let i = 0; i < pattern.length; i += 1) {
    const ch = pattern[i];
    if (ch === "*") {
      if (pattern[i + 1] === "*") {
        const after = pattern[i + 2];
        if (after === "/") { out += "(?:.*/)?"; i += 2; }
        else { out += ".*"; i += 1; }
      } else {
        out += "[^/]*";
      }
    } else if (ch === "?") {
      out += "[^/]";
    } else {
      out += escapeRegExp(ch);
    }
  }
  return out;
}

function validateIgnorePatterns(patterns) {
  for (const pattern of patterns) {
    if (pattern.startsWith("!")) {
      throw new Error(`--ignore does not support negation patterns: ${pattern}`);
    }
  }
}

async function runSlopScan(options = {}) {
  const projectDir = path.resolve(options.path || process.cwd());
  if (!fs.existsSync(projectDir)) throw new Error(`scan path does not exist: ${projectDir}`);

  const ignore = options.ignore || [];
  validateIgnorePatterns(ignore);

  const warnings = [];
  if (!fs.existsSync(path.join(projectDir, "package.json")) && !fs.existsSync(path.join(projectDir, ".git"))) {
    warnings.push("This folder has neither a package.json nor a .git directory. Check that you are scanning the right path.");
  }

  const { files, coverage } = await collectCandidateFiles(projectDir, { ignore, forceWalk: options.forceWalk });

  // A Tailwind 3 configuration that sets its own colours makes the
  // default-palette check unsupportable, so it is stood down rather than
  // guessed. The config is never executed, only read as text.
  let tailwindConfigOverrides = false;
  for (const name of ["tailwind.config.js", "tailwind.config.cjs", "tailwind.config.mjs", "tailwind.config.ts"]) {
    const candidate = path.join(projectDir, name);
    if (fs.existsSync(candidate)) {
      const text = await safeReadFile(candidate);
      if (text && /theme\s*:/.test(text) && /colou?rs\s*:/.test(text)) tailwindConfigOverrides = true;
      break;
    }
  }

  const resolveAsset = makeAssetResolver(projectDir);
  const analysed = [];
  let filesRead = 0;

  for (const file of files) {
    const source = await safeReadFile(file);
    if (source === null) { coverage.unreadable += 1; continue; }
    if (source.includes("\0")) { coverage.filtered += 1; continue; }
    const text = source.charCodeAt(0) === 0xfeff ? source.slice(1) : source;
    // A generated banner may sit behind a comment token, so the marker is
    // looked for near the top of the file rather than exactly at offset zero.
    if (/(?:@generated|\bDO NOT EDIT\b)/i.test(text.slice(0, 500))) { coverage.filtered += 1; continue; }
    if (/(?:^|\n)[^\n]{5000,}/.test(text)) { coverage.filtered += 1; continue; }
    filesRead += 1;
    analysed.push({ path: file, ...analyseFile(file, text, { resolveAsset, tailwindConfigOverrides }) });
  }

  // Motion is judged per package, not per scan and not per file: a guard
  // anywhere in a package covers that package, and no further. A guard in
  // packages/docs must not hide an unguarded animation in packages/app.
  const findings = [];
  for (const file of analysed) findings.push(...file.findings);

  const byPackage = new Map();
  for (const file of analysed) {
    const pkg = nearestPackageRoot(file.path, projectDir);
    if (!byPackage.has(pkg)) byPackage.set(pkg, []);
    byPackage.get(pkg).push(file);
  }
  for (const group of byPackage.values()) {
    if (hasReducedMotionGuard(group.map((file) => file.clean))) continue;
    const sites = collectMotionSites(group);
    if (!sites.length) continue;
    // One fix per package: the guard is missing for the package, not for each
    // animated element. Reporting every site would bury the one action needed.
    const first = sites[0];
    findings.push({
      ruleId: "motion-behavior",
      file: first.path,
      line: first.line,
      text: "",
      detail: `This package has ${sites.length} animated place${sites.length === 1 ? "" : "s"} and no reduced-motion guard anywhere, for example ${first.detail}. The animation keeps running when someone asks for less motion.`,
    });
  }

  // Decorative effects are counted across files: the rule describes effects in
  // three or more separate places, so one decorated component does not count.
  const effectFiles = analysed.filter((file) => file.effectHits.length > 0);
  if (effectFiles.length >= 3) {
    for (const file of effectFiles) {
      const hit = file.effectHits[0];
      findings.push({
        ruleId: "decorative-effects",
        file: file.path,
        line: hit.line,
        text: "",
        detail: `This file declares ${hit.detail}. Effects of this kind appear in ${effectFiles.length} separate files.`,
      });
    }
  }

  findings.sort((a, b) => a.file.localeCompare(b.file) || a.line - b.line || a.ruleId.localeCompare(b.ruleId));

  return {
    timestamp: new Date().toISOString(),
    projectDir,
    filesRead,
    coverage,
    warnings,
    findings,
    ruleVersion: CATALOG.ruleVersion,
    ruleSource: `${CATALOG.source.project} ${CATALOG.ruleVersion} at ${CATALOG.source.commit}`,
  };
}

module.exports = {
  CATALOG,
  analyseFile,
  blankComments,
  collectCandidateFiles,
  collectMotionSites,
  countPrimaryFindings,
  generateSlopScanJson,
  generateSlopScanLog,
  globMatch,
  hasReducedMotionGuard,
  isSpecific,
  runSlopScan,
  splitSignals,
  summarise,
};
