"use strict";

// Behaviour tests for `npx yeknal slopscan`. The failure modes they answer are
// written down in tools/slopscan-failure-modes.md and numbered in the comments
// below. Fixtures are built on disk in the temp directory and scanned through
// the real scanner or the real CLI; nothing in the path under test is mocked.

const assert = require("node:assert/strict");
const fs = require("node:fs");
const fsp = fs.promises;
const os = require("node:os");
const path = require("node:path");
const { spawnSync } = require("node:child_process");
const test = require("node:test");

const slopscan = require("../lib/slopscan.js");

const CLI = path.join(__dirname, "..", "bin", "yeknal.js");
const EM_DASH = "—";

// The temp root is resolved to its long form so that the rule tests do not depend
// on a Windows 8.3 alias such as NUBIAV~1. The alias itself has its own test.
async function withTempDir(run, root = fs.realpathSync.native(os.tmpdir())) {
  const directory = await fsp.mkdtemp(path.join(root, "yeknal-test-"));
  try {
    return await run(directory);
  } finally {
    await fsp.rm(directory, { recursive: true, force: true });
  }
}

/** Write a { "relative/path": contents } tree under a directory. */
async function writeTree(directory, tree) {
  for (const [relative, contents] of Object.entries(tree)) {
    const target = path.join(directory, ...relative.split("/"));
    await fsp.mkdir(path.dirname(target), { recursive: true });
    await fsp.writeFile(target, contents);
  }
}

const lines = (...rows) => `${rows.join("\n")}\n`;

/** One-based line of the first row containing the needle. */
function lineOf(source, needle) {
  const index = source.split("\n").findIndex((row) => row.includes(needle));
  assert.notEqual(index, -1, `fixture has no line containing ${needle}`);
  return index + 1;
}

function runCli(args) {
  return spawnSync(process.execPath, [CLI, "slopscan", ...args], { encoding: "utf8" });
}

const scan = (directory, extra = {}) => slopscan.runSlopScan({ path: directory, ...extra });
const ofRule = (result, ruleId) => result.findings.filter((finding) => finding.ruleId === ruleId);
const ruleIds = (result) => new Set(result.findings.map((finding) => finding.ruleId));
const relativeFiles = (result) => [...new Set(result.findings.map((finding) => path.relative(result.projectDir, finding.file).replace(/\\/g, "/")))].sort();

// A component that plants every kind of signal the first test expects.
const SLOP_APP = lines(
  'export default function App() {',
  '  return (',
  '    <main>',
  '      <h1>Unleash the future of work</h1>',
  '      <span className="bg-gradient-to-r from-pink-500 to-violet-500 bg-clip-text text-transparent">Plans</span>',
  '      <img src="/hero.png" />',
  '      <img src="./missing.png" alt="Our team at work" />',
  '      <div onClick={() => open()}>Open the menu</div>',
  '      <a href="/a">Learn more →</a>',
  '      <a href="/b">See pricing →</a>',
  '      <a href="/c">Read the docs →</a>',
  '      <a href="/d">Start now →</a>',
  '      <h2>\u{1F680} Launch</h2>',
  '      <h2>✨ Shine</h2>',
  '      <blockquote>Best tool we ever used, said TechCorp</blockquote>',
  '      <p>Trusted by over 10,000 teams worldwide</p>',
  '      <p>Lorem ipsum dolor sit amet</p>',
  '      <button><Icon /></button>',
  '    </main>',
  '  );',
  '}',
);

const CLEAN_APP = lines(
  'export default function Invoices() {',
  '  return (',
  '    <section>',
  '      <h1>Invoices for Lagos freelancers</h1>',
  '      <p>Send an invoice in naira and see when it was opened, with 12 clients on the free plan.</p>',
  '      <img src="./logo.png" alt="Ledgerly wordmark in green" />',
  '      <button type="button" onClick={save}>Save draft</button>',
  '    </section>',
  '  );',
  '}',
);

const HEADLINE = lines('export const Hero = () => <h1>Unleash the future of work</h1>;');

// ---- what the scan reports ----

test("planted slop is reported against the right rule, file and line", async () => {
  await withTempDir(async (directory) => {
    await writeTree(directory, { "package.json": "{}", "src/App.jsx": SLOP_APP });
    const result = await scan(directory);

    // [where the signal sits in the fixture, rule that must fire there]
    const expectations = [
      ["Unleash the future", "generic-copy"],
      ["bg-clip-text", "gradient-text"],
      ['<img src="/hero.png" />', "missing-alt"],
      ['src="./missing.png"', "broken-image"],
      ["onClick", "click-targets"],
      ["Learn more", "link-decorations"],
      ["Launch", "emoji-decoration"],
      ["TechCorp", "fake-testimonial"],
      ["Trusted by over", "unsourced-stats"],
      ["Lorem ipsum", "template-text"],
      ["<button><Icon />", "control-labels"],
    ];
    for (const [needle, ruleId] of expectations) {
      const expectedLine = lineOf(SLOP_APP, needle);
      const hit = ofRule(result, ruleId).find((finding) => finding.line === expectedLine);
      assert.ok(hit, `${ruleId} did not fire on line ${expectedLine} (${needle})`);
      assert.equal(path.basename(hit.file), "App.jsx");
    }
  });
});

test("a handwritten component with concrete copy has no primary findings", async () => {
  await withTempDir(async (directory) => {
    await writeTree(directory, { "package.json": "{}", "src/Invoices.jsx": CLEAN_APP, "src/logo.png": "png" });
    const result = await scan(directory);

    assert.equal(result.filesRead, 1);
    assert.equal(slopscan.countPrimaryFindings(slopscan.summarise(result)), 0);
  });
});

// Failure mode 4: a stock icon set or kit palette never establishes poor quality.
test("a stock icon set and kit colours are observed but not counted until a real slop signal appears", async () => {
  await withTempDir(async (directory) => {
    await writeTree(directory, {
      "package.json": "{}",
      "src/Nav.jsx": lines(
        'import { Menu } from "lucide-react";',
        'export const Nav = () => (',
        '  <nav>',
        '    <button type="button" className="bg-indigo-600">Save plan</button>',
        '    <button type="button" className="bg-blue-500">Share plan</button>',
        '    <button type="button" className="bg-violet-600">Export plan</button>',
        '  </nav>',
        ');',
      ),
    });

    const quiet = await scan(directory);
    const quietSummary = slopscan.summarise(quiet);
    assert.ok(ofRule(quiet, "icon-library").length > 0, "icon import was not observed");
    assert.ok(ofRule(quiet, "default-palette").length > 0, "kit colours were not observed");
    assert.equal(slopscan.countPrimaryFindings(quietSummary), 0);
    assert.equal(slopscan.splitSignals(quietSummary).gateOpen, false);
    assert.equal(JSON.parse(slopscan.generateSlopScanJson(quiet)).supportingGateOpen, false);

    await writeTree(directory, { "src/Hero.jsx": HEADLINE });
    const loud = await scan(directory);
    assert.ok(slopscan.countPrimaryFindings(slopscan.summarise(loud)) > 0);
    assert.equal(JSON.parse(slopscan.generateSlopScanJson(loud)).supportingGateOpen, true);
  });
});

// Failure mode 1: the scanner must not read its own phrase list as product copy.
test("scanning the yeknal-cli package reports no copy findings from its own phrase list or fixtures", async () => {
  const result = await scan(path.join(__dirname, ".."));
  assert.ok(result.filesRead > 0, "the package scan read nothing, so the control proves nothing");

  const copyRules = new Set(["generic-copy", "em-dash-copy", "template-text"]);
  const stray = result.findings.filter((finding) => copyRules.has(finding.ruleId));
  assert.deepEqual(stray.map((finding) => `${finding.ruleId} ${path.relative(result.projectDir, finding.file)}:${finding.line}`), []);
});

// Failure mode 1, the other half: copy inside a comment never reaches a reader.
test("stock phrases inside comments and test paths are not read as shipped copy", async () => {
  await withTempDir(async (directory) => {
    await writeTree(directory, {
      "package.json": "{}",
      "src/Page.jsx": lines(
        '// Unleash the power of seamless experiences',
        'export const Page = () => <h1>Pricing for sole traders</h1>;',
      ),
      "src/Page.test.jsx": HEADLINE,
      "src/__tests__/Hero.jsx": HEADLINE,
    });
    const result = await scan(directory);
    assert.deepEqual(ofRule(result, "generic-copy"), []);
  });
});

// ---- failure mode 2: comment blanking keeps line numbers ----

test("comment blanking keeps line numbers when URLs and regular expressions contain double slashes", async () => {
  await withTempDir(async (directory) => {
    const source = lines(
      '/* Docs live at https://example.com/docs',
      '   // and a nested line comment',
      '   Unleash the future */',
      'const SLUG = /^https?:\\/\\/[^/]+\\/(.*)$/;',
      'const HOME = "https://example.com//start"; // trailing note',
      'export const Hero = () => (',
      '  <section>',
      '    <h1>Unleash the future of work</h1>',
      '  </section>',
      ');',
    );
    await writeTree(directory, { "package.json": "{}", "src/Hero.jsx": source });
    const result = await scan(directory);

    const hits = ofRule(result, "generic-copy");
    assert.equal(hits.length, 1, "the commented phrase must not count and the real one must");
    assert.equal(hits[0].line, lineOf(source, "<h1>"));
  });
});

// ---- failure mode 3: measured rules do not invent what they cannot know ----

test("skipped headings are judged on complete documents only, not on a component", async () => {
  await withTempDir(async (directory) => {
    const jump = lines('<h1>Ledger overview</h1>', '<h3>Recent entries</h3>');
    await writeTree(directory, {
      "package.json": "{}",
      "src/Card.jsx": `export const Card = () => (\n<>\n${jump}</>\n);\n`,
      "site/index.html": `<main>\n${jump}</main>\n`,
    });
    const result = await scan(directory);
    assert.deepEqual(relativeFiles({ ...result, findings: ofRule(result, "skipped-headings") }), ["site/index.html"]);
  });
});

// ---- failure mode 5: a theme override stands the palette rule down ----

test("the default palette rule stands down when the Tailwind config sets its own colours, and never runs the config", async () => {
  await withTempDir(async (directory) => {
    const buttons = lines(
      'export const Bar = () => (',
      '  <nav>',
      '    <button className="bg-indigo-600">Save plan</button>',
      '    <button className="bg-blue-500">Share plan</button>',
      '    <button className="bg-violet-600">Export plan</button>',
      '  </nav>',
      ');',
    );
    await writeTree(directory, { "package.json": "{}", "src/Bar.jsx": buttons });
    assert.ok(ofRule(await scan(directory), "default-palette").length > 0);

    // The config would throw if anything executed it.
    await writeTree(directory, {
      "tailwind.config.js": 'throw new Error("config was executed");\nmodule.exports = { theme: { colors: { brand: "#123456" } } };\n',
    });
    assert.deepEqual(ofRule(await scan(directory), "default-palette"), []);
  });
});

// ---- failure mode 6: broken-image ----

test("broken-image reports a case mismatch, an absent file and an empty source, and leaves a real file alone", async () => {
  await withTempDir(async (directory) => {
    await writeTree(directory, {
      "package.json": "{}",
      "public/logo.png": "png",
      "src/Logos.jsx": lines(
        'export const Logos = () => (',
        '  <div>',
        '    <img src="/logo.png" alt="Ledgerly mark" />',
        '    <img src="/LOGO.PNG" alt="Ledgerly mark, upper case" />',
        '    <img src="/missing.png" alt="A partner mark" />',
        '    <img src="" alt="An empty one" />',
        '  </div>',
        ');',
      ),
    });
    const result = await scan(directory);

    assert.deepEqual(ofRule(result, "broken-image").map((finding) => finding.text).sort(), ['/LOGO.PNG', '/missing.png', 'src=""']);
  });
});

test("broken-image does not guess at a root-absolute path when the repository has no public directory", async () => {
  await withTempDir(async (directory) => {
    await writeTree(directory, {
      "package.json": "{}",
      "src/Logo.jsx": 'export const Logo = () => <img src="/logo.png" alt="Ledgerly mark" />;\n',
    });
    assert.deepEqual(ofRule(await scan(directory), "broken-image"), []);
  });
});

// Failure mode 14 names the 8.3 alias. os.tmpdir() is the alias form on a
// Windows account whose name is longer than eight characters.
test("broken-image still finds a real file when the project is reached through a Windows 8.3 short path", async (t) => {
  const aliasRoot = os.tmpdir();
  if (fs.realpathSync.native(aliasRoot) === aliasRoot) {
    t.skip("this machine's temp directory has no 8.3 alias");
    return;
  }
  await withTempDir(async (directory) => {
    await writeTree(directory, {
      "package.json": "{}",
      "public/logo.png": "png",
      "src/Logo.jsx": 'export const Logo = () => <img src="/logo.png" alt="Ledgerly mark" />;\n',
    });
    assert.deepEqual(ofRule(await scan(directory), "broken-image"), []);
  }, aliasRoot);
});

// ---- failure mode 7: motion-behavior ----

const SPINNER_CSS = lines(
  '@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }',
  '.spinner { animation: spin 1s linear infinite; }',
);
const REDUCED_MOTION_CSS = lines('@media (prefers-reduced-motion: reduce) { .spinner { animation: none; } }');

test("an animation is reported once when nothing in the package honours reduced motion, and not at all when something does", async () => {
  await withTempDir(async (directory) => {
    await writeTree(directory, { "package.json": "{}", "src/spinner.css": SPINNER_CSS });
    const unguarded = ofRule(await scan(directory), "motion-behavior");
    assert.equal(unguarded.length, 1, "a keyframe block and its consuming rule were double counted");

    // The guard lives in a different file, which is where it usually lives.
    await writeTree(directory, { "src/index.css": REDUCED_MOTION_CSS });
    assert.deepEqual(ofRule(await scan(directory), "motion-behavior"), []);
  });
});

// The failure-mode note says the guard is judged per package. A guard in one
// package must not hide an unguarded animation in a sibling package.
test("a reduced-motion guard in one package does not cover an animation in a sibling package", async () => {
  await withTempDir(async (directory) => {
    await writeTree(directory, {
      "packages/docs/package.json": "{}",
      "packages/docs/src/index.css": REDUCED_MOTION_CSS,
      "packages/app/package.json": "{}",
      "packages/app/src/spinner.css": SPINNER_CSS,
    });
    const hits = ofRule(await scan(directory), "motion-behavior");
    assert.deepEqual(relativeFiles({ projectDir: directory, findings: hits }), ["packages/app/src/spinner.css"]);
  });
});

// ---- failure mode 8: a heuristic says it is a candidate ----

test("a claim with a source word in the same block is not flagged, and the same claim alone is", async () => {
  await withTempDir(async (directory) => {
    await writeTree(directory, {
      "package.json": "{}",
      "src/Proof.jsx": lines(
        'export const Proof = () => (',
        '  <section>',
        '    <p>Trusted by over 10,000 teams, according to our 2025 customer survey</p>',
        '    <p>Save 10 hours every week</p>',
        '  </section>',
        ');',
      ),
    });
    const hits = ofRule(await scan(directory), "unsourced-stats");
    assert.deepEqual(hits.map((finding) => finding.text), ["Save 10 hours every week"]);
    assert.match(hits[0].detail, /candidate for review/);
  });
});

// ---- failure mode 9: the report must not break the em dash rule ----

test("an em dash in quoted evidence is shown as [em dash] in the log and survives in the JSON as an escape", async () => {
  await withTempDir(async (directory) => {
    await writeTree(directory, {
      "package.json": "{}",
      "src/Quote.jsx": `export const Quote = () => <blockquote>Best tool we ever used ${EM_DASH} TechCorp</blockquote>;\n`,
    });
    const result = await scan(directory);
    const quoted = ofRule(result, "fake-testimonial");
    assert.equal(quoted.length, 1);
    assert.ok(quoted[0].text.includes(EM_DASH), "the fixture did not put an em dash into the evidence");

    const log = slopscan.generateSlopScanLog(result);
    assert.equal(log.includes(EM_DASH), false);
    assert.ok(log.includes("[em dash]"));

    const json = slopscan.generateSlopScanJson(result);
    assert.equal(json.includes(EM_DASH), false);
    assert.ok(json.includes("\\u2014"));
    assert.equal(JSON.parse(json).findings.find((finding) => finding.ruleId === "fake-testimonial").text, quoted[0].text);
  });
});

// ---- failure modes 10 and 11: the command line ----

test("--json writes one parseable document to stdout and nothing else", async () => {
  await withTempDir(async (directory) => {
    await writeTree(directory, { "package.json": "{}", "src/Hero.jsx": HEADLINE });
    const run = runCli(["--path", directory, "--json"]);

    assert.equal(run.status, 0, run.stderr);
    assert.ok(run.stdout.startsWith("{") && run.stdout.endsWith("}\n"), "stdout carries text besides the document");
    const document = JSON.parse(run.stdout);
    assert.ok(document.findings.some((finding) => finding.ruleId === "generic-copy"));
  });
});

test("exit code is 0 by default and 1 only when --fail-on is met", async () => {
  await withTempDir(async (directory) => {
    const clean = path.join(directory, "clean");
    const sloppy = path.join(directory, "sloppy");
    await writeTree(clean, { "package.json": "{}", "src/Invoices.jsx": CLEAN_APP, "src/logo.png": "png" });
    await writeTree(sloppy, { "package.json": "{}", "src/Hero.jsx": HEADLINE });

    assert.equal(runCli(["--path", clean]).status, 0, "clean fixture, no flag");
    assert.equal(runCli(["--path", sloppy]).status, 0, "findings alone must not fail a build");
    assert.equal(runCli(["--path", sloppy, "--fail-on", "any"]).status, 1);
    assert.equal(runCli(["--path", sloppy, "--fail-on", "999"]).status, 0, "threshold not reached");
    assert.equal(runCli(["--path", clean, "--fail-on", "any"]).status, 0);
  });
});

test("an unknown argument exits 2", async () => {
  await withTempDir(async (directory) => {
    await writeTree(directory, { "package.json": "{}", "src/Invoices.jsx": CLEAN_APP, "src/logo.png": "png" });
    assert.equal(runCli(["--path", directory, "--bogus"]).status, 2);
  });
});

test("a scan path that does not exist exits 2", async () => {
  await withTempDir(async (directory) => {
    assert.equal(runCli(["--path", path.join(directory, "absent")]).status, 2);
  });
});

test("--ignore excludes by glob, repeats, and rejects negation with exit 2", async () => {
  await withTempDir(async (directory) => {
    await writeTree(directory, {
      "package.json": "{}",
      "src/Hero.jsx": HEADLINE,
      "src/legacy/Old.jsx": HEADLINE,
      "src/marketing/Banner.jsx": HEADLINE,
    });
    const filesReported = (extra) => {
      const run = runCli(["--path", directory, "--json", ...extra]);
      assert.equal(run.status, 0, run.stderr);
      return [...new Set(JSON.parse(run.stdout).findings.map((finding) => finding.file))].sort();
    };

    assert.deepEqual(filesReported([]), ["src/Hero.jsx", "src/legacy/Old.jsx", "src/marketing/Banner.jsx"]);
    assert.deepEqual(filesReported(["--ignore", "src/legacy/**"]), ["src/Hero.jsx", "src/marketing/Banner.jsx"]);
    assert.deepEqual(filesReported(["--ignore", "src/legacy/**", "--ignore", "src/marketing/*.jsx"]), ["src/Hero.jsx"]);
    assert.equal(runCli(["--path", directory, "--ignore", "!src/Hero.jsx"]).status, 2);
  });
});

// ---- failure mode 15: ordering ----

test("two runs over the same tree give the same findings in path, line, rule order", async () => {
  await withTempDir(async (directory) => {
    // Written out of order so a directory-order result would show.
    await writeTree(directory, {
      "package.json": "{}",
      "src/zeta/Last.jsx": SLOP_APP,
      "src/alpha/First.jsx": SLOP_APP,
      "src/mid/Middle.jsx": HEADLINE,
    });
    // The report carries its creation time, so that field alone is set aside.
    const settle = (result) => JSON.parse(slopscan.generateSlopScanJson(result).replace(/"timestamp": "[^"]*"/, '"timestamp": ""'));
    const first = settle(await scan(directory));
    const second = settle(await scan(directory));

    assert.deepEqual(first, second);
    assert.equal(JSON.stringify(first), JSON.stringify(second));
    const keys = first.findings.map((finding) => [finding.file, finding.line, finding.ruleId]);
    const ordered = [...keys].sort((a, b) => (a[0] < b[0] ? -1 : a[0] > b[0] ? 1 : a[1] - b[1] || (a[2] < b[2] ? -1 : a[2] > b[2] ? 1 : 0)));
    assert.deepEqual(keys, ordered);
  });
});

// ---- failure mode 13: coverage ----

test("coverage reports the test and fixture paths it left out, so a thin scan is not read as a clean one", async () => {
  await withTempDir(async (directory) => {
    await writeTree(directory, {
      "package.json": "{}",
      "src/Hero.jsx": HEADLINE,
      "src/Hero.test.jsx": HEADLINE,
      "__tests__/Hero.jsx": HEADLINE,
      "fixtures/page.html": "<h1>Unleash the future</h1>\n",
    });
    const result = await scan(directory);

    assert.equal(result.coverage.excluded, 3);
    assert.deepEqual(relativeFiles(result), ["src/Hero.jsx"]);
    assert.match(slopscan.generateSlopScanLog(result), /Skipped by policy:\s+3/);
    assert.equal(JSON.parse(slopscan.generateSlopScanJson(result)).coverage.excluded, 3);
  });
});

// ---- failure mode 12: the report must not mutate the repository ----

test("reports are written without creating a .gitignore in a folder that is not a repository", async () => {
  await withTempDir(async (directory) => {
    await writeTree(directory, { "package.json": "{}", "src/Hero.jsx": HEADLINE });
    const run = runCli(["--path", directory]);

    assert.equal(run.status, 0, run.stderr);
    assert.equal(fs.existsSync(path.join(directory, "yeknal-slopscan.log")), true);
    assert.equal(fs.existsSync(path.join(directory, "yeknal-slopscan.json")), true);
    assert.equal(fs.existsSync(path.join(directory, ".gitignore")), false);
  });
});

test("inside a repository the report names are added to .gitignore once, and a read-only .gitignore does not fail the scan", async (t) => {
  await withTempDir(async (directory) => {
    await writeTree(directory, { "package.json": "{}", "src/Hero.jsx": HEADLINE, ".gitignore": "node_modules\n" });
    const gitignore = path.join(directory, ".gitignore");

    assert.equal(runCli(["--path", directory]).status, 0);
    assert.equal(runCli(["--path", directory]).status, 0);
    const entries = fs.readFileSync(gitignore, "utf8").split(/\r?\n/);
    assert.equal(entries.filter((entry) => entry === "yeknal-slopscan.log").length, 1);
    assert.equal(entries.filter((entry) => entry === "yeknal-slopscan.json").length, 1);
    assert.ok(entries.includes("node_modules"), "existing entries were disturbed");

    // A read-only file is only a read-only file for a user who is not root.
    if (typeof process.getuid === "function" && process.getuid() === 0) {
      t.diagnostic("read-only .gitignore case skipped: running as root");
      return;
    }
    await fsp.rm(path.join(directory, "yeknal-slopscan.log"));
    await fsp.rm(path.join(directory, "yeknal-slopscan.json"));
    await fsp.writeFile(gitignore, "node_modules\n");
    await fsp.chmod(gitignore, 0o444);
    try {
      const run = runCli(["--path", directory]);
      assert.equal(run.status, 0, run.stderr);
      assert.equal(fs.existsSync(path.join(directory, "yeknal-slopscan.json")), true);
    } finally {
      await fsp.chmod(gitignore, 0o666);
    }
  });
});

// ---- failure mode 14: awkward input ----

test("a BOM and CRLF line endings do not shift line numbers, and binary or minified files are skipped", async () => {
  await withTempDir(async (directory) => {
    const headline = '<h1>Unleash the future of work</h1>';
    await writeTree(directory, {
      "package.json": "{}",
      "src/Bom.jsx": `﻿export const A = () => ${headline};\n`,
      "src/Crlf.jsx": ["export const B = () => (", "  <section>", `    ${headline}`, "  </section>", ");", ""].join("\r\n"),
      "src/Binary.jsx": `export const C = () => ${headline};\n\0\0\n`,
      "src/Minified.jsx": `export const D = () => ${headline};\nconst blob = "${"x".repeat(6000)}";\n`,
    });
    const result = await scan(directory);
    const hits = ofRule(result, "generic-copy");

    assert.deepEqual(hits.map((finding) => [path.basename(finding.file), finding.line]).sort(), [["Bom.jsx", 1], ["Crlf.jsx", 3]]);
    assert.equal(result.filesRead, 2);
  });
});

// Failure mode 14 also promises generated files are skipped. Real generators
// put the marker behind a comment token, so that is the shape tested.
test("a file whose header says DO NOT EDIT is skipped as generated", async () => {
  await withTempDir(async (directory) => {
    await writeTree(directory, {
      "package.json": "{}",
      "src/schema.jsx": `// DO NOT EDIT. Generated by the build.\n${HEADLINE}`,
    });
    const result = await scan(directory);
    assert.deepEqual(ofRule(result, "generic-copy"), []);
  });
});

// ---- failure mode 16: no Git ----

test("a folder with no Git history is still scanned, through the file walker", async () => {
  await withTempDir(async (directory) => {
    await writeTree(directory, { "package.json": "{}", "src/Hero.jsx": HEADLINE });
    const result = await scan(directory);

    assert.equal(fs.existsSync(path.join(directory, ".git")), false);
    assert.ok(ruleIds(result).has("generic-copy"));
    assert.equal(result.filesRead, 1);
  });
});
