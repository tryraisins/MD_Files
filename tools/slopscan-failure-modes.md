# Slop scan failure modes

Written before the tests, as the repository requires. Each entry names a concrete way `npx yeknal slopscan` can be wrong, what the scanner does about it, and how it is verified. Where a failure is not covered by an automated check, it says so.

## 1. Copy rules fire on strings that never reach a reader

**Failure:** a matcher sees the word "unleash" in a backend error message, a test fixture, a migration comment, a tutorial, or a translation dictionary, and reports it as shipped marketing copy. Left unchecked the scanner would flag its own phrase list and its own fixtures.

**Mitigation:** comments are blanked before extraction; only markup text positions and a fixed attribute list (`title`, `alt`, `aria-label`, `placeholder`, `label`) are read; test, fixture, story, mock, snapshot and end-to-end paths are excluded; and the phrase list itself lives in a JSON data file, not in a scannable source string.

**Verification:** a fixture containing the phrase list in a comment produces no copy finding. Self-scans of this repository and of the Slop Detector repository produce no copy findings.

## 2. Comment blanking corrupts offsets or misreads strings

**Failure:** replacing comments with nothing shifts every later line number. Replacing them with spaces is safe only if strings, template literals and regular expressions are skipped correctly; a `//` inside `"https://example.com"` or inside `/foo\/\/bar/` must not start a comment.

**Mitigation:** blanking preserves byte offsets and newlines; string, template and regular-expression literals are skipped; a regular expression is only assumed where the previous significant character can precede one.

**Verification:** a fixture with a URL in a string and a slash-heavy regular expression keeps its line numbers and reports nothing from inside those literals.

## 3. A measured rule reports something it cannot know

**Failure:** `skipped-headings` runs on a React component and invents a jump that does not exist on the rendered page, because a layout renders `h1` and a card renders `h3`.

**Mitigation:** `skipped-headings` only runs on complete documents (`.html`, `.astro`). `missing-alt` skips any element carrying spread props or a dynamic `alt` binding. `broken-image` only judges empty sources and literal paths it can resolve; everything else is left unresolved. Each rule declares `measured` or `heuristic` and the report prints that label.

**Verification:** a component fixture with `h1` then `h3` produces no heading finding; a plain HTML document with the same jump does.

## 4. Supporting signals decide quality on their own

**Failure:** a project using shadcn, lucide and the Tailwind blue scale is reported as slop for three normal choices, which is exactly what the product rules forbid.

**Mitigation:** supporting rules are kept out of the primary section, and are only reported as counted when at least one non-supporting slop signal was found. The report says plainly when they were observed but not counted.

**Verification:** a fixture containing only a lucide import and kit colour classes produces zero counted findings and states that the supporting gate stayed closed.

## 5. `default-palette` ignores a theme override, or executes the config

**Failure:** a project recolours Tailwind in `tailwind.config.js`, so `bg-blue-600` is the brand, not a kit default. Worse, reading that config with `require()` would execute user code during a scan.

**Mitigation:** the config is only read as text, never executed. When it sets `theme.colors`, the rule stands down. The report notes that an untouched default is not established even when the classes match.

**Verification:** a fixture with a Tailwind config that defines its own colours produces no `default-palette` finding. No scan ever loads project code.

## 6. `broken-image` misreads an alias, a URL or a public path

**Failure:** `/logo.svg` may resolve through a bundler alias, a `public/` root, a CDN base or a build step. Reporting it as broken is a false positive that erodes trust in the whole report.

**Mitigation:** remote URLs, protocol-relative paths, data URIs, hash targets and dynamic expressions are skipped. Only literal relative or root-absolute paths are resolved, against the nearest package's `public/`, `static/` or `assets/` directory, and only when that directory exists. The lookup is case-exact at every path segment.

**Verification:** a fixture with `public/logo.png` reports `/LOGO.PNG` and `/missing.png` as broken, leaves `/logo.png` alone, and reports `src=""` as empty. A fixture with no public directory reports nothing.

## 7. `motion-behavior` invents a problem that a global guard already solves

**Failure:** the guard usually lives once, in `index.css`, in a Tailwind `motion-safe:` variant, or in a React MotionConfig. A per-file check would report every animated component.

**Mitigation:** the check is per package. If any scanned file in the package contains a reduced-motion guard, nothing is reported. One animation counts once; a keyframe block and the rule that uses it are not double counted.

**Verification:** a package with an animation plus a `prefers-reduced-motion` block reports nothing. The same package with the block removed reports the animation once.

## 8. `unsourced-stats` states a verdict it cannot support

**Failure:** the source of a figure can be a sibling component, a prop, a footnote or a linked page. Declaring a number unsourced from one file is overreach.

**Mitigation:** the rule is `heuristic`, it is exempt when a source word appears in the same block, and the finding text says the source may live elsewhere and that this is a candidate for review.

**Verification:** a fixture where the claim and the "according to" line sit in one block produces nothing; the claim alone produces a candidate.

## 9. The report itself breaks a product rule

**Failure:** the em-dash rule must quote source that contains an em dash, but generated documents must not contain one.

**Mitigation:** the log renders an em dash in quoted evidence as `[em dash]` and says so in its header. The JSON keeps the exact character through the `\u2014` escape, so a parser recovers the original bytes.

**Verification:** an automated check asserts that neither the log nor the JSON contains a literal em dash, and that the JSON still parses and still contains the escape.

## 10. Machine output is polluted

**Failure:** a warning or progress line on stdout breaks `--json` for any caller piping it into a parser.

**Mitigation:** with `--json` the human summary is suppressed entirely and every diagnostic goes to stderr.

**Verification:** `--json` output parses on its own with no surrounding text.

## 11. Exit codes break a build or hide a failure

**Failure:** a non-zero exit on cosmetic findings breaks continuous integration for every project that adopts the tool. An unreadable repository exiting zero is worse, because it reports success with no evidence.

**Mitigation:** exit `0` by default, `1` only when `--fail-on` is met, and `2` for a usage error, a missing path or a report that could not be written at all.

**Verification:** the three cases are asserted separately.

## 12. The report mutates a repository it should not touch

**Failure:** the security command's `.gitignore` handling creates the file in folders that are not repositories, throws on a read-only file after the reports are already written, and ignores `--out`.

**Mitigation:** the slop scan only touches `.gitignore` when a `.git` directory or an existing `.gitignore` is present; the write is wrapped so a read-only file produces a warning rather than a failure; entries are written without disturbing CRLF files; and an `--out` directory outside the repository is left alone. A report target that is a symbolic link is refused.

**Verification:** a read-only `.gitignore` still exits `0` and still writes the reports. A scan in a folder that is neither a repository nor has a `.gitignore` creates nothing.

## 13. A thin report is mistaken for a clean one

**Failure:** files over the size limit, unreadable paths, ignored folders and excluded test paths all reduce coverage. A reader sees zero findings and concludes the codebase is clean.

**Mitigation:** the report always prints coverage: files read, skipped, too large, unreadable, too deep and excluded by policy. A run whose root has neither `package.json` nor `.git` prints a warning.

**Verification:** the coverage block is asserted to appear and to carry the excluded count when test paths exist.

## 14. Inputs break the reader

**Failure:** a BOM shifts the first line, CRLF changes line counts, UTF-16 produces NUL bytes, a minified line thousands of characters long causes runaway matching, a binary file slips through, and 8.3 Windows aliases defeat a naive path comparison.

**Mitigation:** a BOM is stripped, NUL-containing files are skipped, lines are counted on `\n` after CRLF normalisation by the reader, files with any line over 5,000 characters are skipped, files marked `@generated` or `DO NOT EDIT` are skipped, declared extensions are allow-listed, and symlinks are never followed.

**Verification:** BOM, CRLF, NUL and long-line fixtures each behave as described.

## 15. Ordering is not deterministic

**Failure:** findings appear in filesystem order, so two runs on the same commit produce different reports and a diff is meaningless.

**Mitigation:** findings are sorted by path, then line, then rule id, and paths are printed with forward slashes.

**Verification:** two consecutive runs produce byte-identical reports.

## 16. Git is missing or the folder is not a work tree

**Failure:** the `.gitignore`-aware file listing fails and the scan silently covers nothing.

**Mitigation:** the Git listing returns null on any failure and the walker takes over. The walker keeps its own ignore rules and reports what it skipped.

**Verification:** a folder with no `.git` is scanned through the walker and produces findings.

## Not covered by an automated check

- Whether a reported phrase would actually look generic to a reader. That is editorial judgment, and the report frames findings as candidates for review.
- Whether a chosen gradient or glow is decoration or part of a deliberate illustration. The scanner cannot see the composition.
- False-positive rates on third-party codebases. The real-repository pass records evidence but does not establish a rate, and the same repositories are never used both for tuning and for validation.
- Behaviour on Node versions below 18 and on platforms other than Windows and Linux CI.
