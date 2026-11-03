---
name: yeknal-hot-path-audit
description: "Audit the code paths that run on every request for cost that hides in ordinary code: serialized I/O that could be one round trip, whole rows and JSONB documents fetched for a few fields, redundant URL parsing and regex construction, single hot keys trapped in large JSONB, and state that is really an undocumented state machine. Use for a hot-path review, a why-is-this-slow pass, or before a refactor that touches durable state."
metadata:
  last-reviewed: "2026-11-03"
  boundary: "Evidence-first. No finding without a call site, a count, and a measured or explicitly bounded cost. Noise is listed and rejected, not silently fixed."
---

# Hot-path audit

Find the structural cost inside code that already works. This is a read of the path, not a
measurement of the screen: the deliverable is a ranked findings table with the cost of each
finding attached, and an explicit list of what was rejected as noise.

## Where this fits

| Request | Use |
| --- | --- |
| "Why is this slow", hot-path review, "what in this path is expensive" | this skill |
| "Is it faster now", before and after numbers on a real surface | `yeknal-performance` |
| "Is this diff safe", standards and spec review | `yeknal-review` |
| "It broke", a feature that does not work | `yeknal-troubleshoot` |
| "What are the domain states and transitions", naming the model | `yeknal-domain-modeling` |
| "Delete what nobody uses", code at rest rather than code on a path | `yeknal-legacy-sweep` |

The split is deliberate. `yeknal-performance` owns the user-facing surface and the before and
after numbers, and it opens with a measurement. This skill owns the path itself: what is
structurally expensive, how many times per request it pays, and what state is undeclared. When
a finding needs a number this audit cannot produce, hand it to `yeknal-performance` rather than
guessing.

This skill does not re-architect, does not build a transitions framework, and does not own the
final performance claim. A finding is a hypothesis with a cost, not a win.

## Invocation

```
/hot-path-audit [--path <route or module>] [--audit] [--fix]
```

- `--path` narrows the pass to one route, handler, job, or module. Without it, cover every
  request-time path the repository can name.
- `--audit` reports only. This is the default.
- `--fix` also applies the safe tier described under Fix tiers. It never applies a gated or
  migration fix.

## The contract

A finding has five parts:

1. **Call site**: `file:line`, and the path it belongs to.
2. **The cost it pays**: a round trip, bytes transferred, a full scan, a parse, a detoast, a
   pass over the data.
3. **Frequency**: how many times per request, per row, or per rendered item.
4. **Expected gain**: in round trips, bytes, or passes, with the arithmetic shown.
5. **Risk of changing it**: what could break, and what proves it did not.

A finding missing any part is an observation. Observations go in the noise section, not the
findings table. Rank findings by measured or bounded cost, never by how interesting they are.

## Measure before you scan

Locate the instrumentation the repository already has before reading code: response timing
headers, a DB call counter, structured query logs, request traces, probe endpoints, framework
waterfalls, `EXPLAIN` access. Record a baseline artefact first, and cite its path in the report.

If none exists, say so plainly and label every number in the report an estimate, with the
assumption behind it. Never present an estimate as a measurement, and never report a
development-server number as production cost.

## The five check classes

### 1. Serialized I/O

**Grep for:** consecutive `await` statements in one handler, `for` loops that await per item,
`.then(` chains that do not feed the next call, and per-request fetch-then-fetch sequences.

**Real case:** two calls where neither needs the other's result and neither is gated by the
other's failure.

**The gate is no side-effect dependency, not "independent".** Two calls can look independent
and still be ordered by consequences: a save and an email, a write and a webhook, a charge and
a receipt. Parallelizing them changes failure semantics. If the first fails, the second still
ran.

**Fix:** one `Promise.all` (or `asyncio.gather`, `errgroup`) for the truly unordered set, or a
single query or batched call that replaces several round trips. Use `allSettled` where partial
results are usable; `Promise.all` rejects on the first failure and leaves the rest running.

**Traps:** ordered writes, rate-limited sends, steps that must fail before the next begins, and
calls sharing one database connection or transaction all stay serial; a pool of one queues them
anyway, so parallel syntax buys nothing. Parallel calls that mutate one accumulator introduce a
race the sequential form did not have. In an Electron main process, parallelizing awaits does
not unblock anything if it saturates the single event loop.

### 2. Over-fetching

**Grep for:** `SELECT *`, `findMany()` with no `select`, `db.get(id)` then one field read,
counts implemented by loading rows and taking `.length`, projections applied in application
code after the fetch, and casts on the filter column that defeat the index.

**Real case:** a wide row, a TOASTed column, or a large document loaded on a hot path where the
caller reads two or three fields.

**Fix:** project the needed fields in the query, keep filter and sort keys in the projection,
and add a covering index where the projection and the predicate line up.

**Traps:** narrowing a `SELECT *` that is serialized straight into the response changes the API
payload, which is a breaking change, not an optimization. Filtering done after the load needs
the filter keys, so a projection that omits them breaks the filter silently. `COUNT(*)` only
replaces a loaded-row count when every filter is an exact scalar; anything evaluated in
application code is not the same query.

### 3. Redundant URL and path parsing

**Grep for:** `new URL(` inside a per-item loop or a render body, the same string parsed twice
in one function, `url.searchParams.get(` on an already-parsed object's source string, and
manual `split("?")` beside a real parser.

**Real case:** the same value parsed more than once on one request, or parsing inside a loop
over rows.

**Fix:** parse once at the boundary and pass the parsed object down.

**Trap, and it is the important one:** `new URL()` is frequently the correct and safe parser.
Never replace it with string splitting or a regex. This catalog's own security guidance
mandates `new URL(value, base)` plus a protocol and host allowlist for untrusted input, and a
hand-rolled replacement is the classic SSRF and open-redirect vector. This class is about
repeated parsing, not about removing parsing. Resolving a relative path, reading query
parameters, and validating user input all stay.

### 4. Regex construction on hot paths

**Grep for:** `new RegExp(` and `re.compile(` inside a function, a loop, or a per-request
handler, and patterns built from runtime values.

**Real case:** a pattern compiled from a variable on every call, or compilation inside a loop
over rows. A literal pattern is compiled once by the engine and cached at that site.

**Fix:** hoist constant patterns to module scope. Hoist a dynamic pattern to a memoized builder
keyed by its source string.

**Traps:** hoisting a literal is style, not speed; do not report it as a performance finding. A
hoisted `/g` or `/y` regex carries `lastIndex` across calls, so `.test()` and `.exec()` start
returning intermittent false results. Reset `lastIndex`, or drop the `g` flag, whenever a
pattern is shared. A pattern built from user input is also a ReDoS surface, so bound the input
and prefer a non-backtracking shape.

### 5. Hot keys in large JSONB

**Grep for:** `->>` and `->` and `#>>` on a column also written by a whole-document update,
`.json.field` reads on a document fetched on every request, and JSONB columns whose
`pg_column_size` dwarfs the keys read from them.

**Real case:** a document read on every request or every row for one or two keys while another
key in the same document is large. Postgres detoasts the entire value to read one key.

**Measure the document before proposing anything:** `pg_column_size`, `pg_total_relation_size`,
the p95 row width, and how many rows the query touches.

**Fix, in order:**

1. An expression index on the hot key, which costs no migration of data.
2. A stored generated column, which is queryable, indexable, and still derived.
3. Promote to a real column only when the key needs planner statistics, a composite index, a
   foreign key, or a sort that the other options cannot serve.

**Traps:** promotion is a migration with a backfill, and a dual-write window where the column
and the document disagree. A whole-document rewrite can resurrect fields an earlier migration
stripped, so write the projection rather than the document. Flexible data read once does not
belong in a column, and an evolving schema turns every new key into a migration.

## State machines

Not a sixth cost class. This is correctness: state that exists but is undeclared causes bugs
the other five classes cannot see.

**Find them:** `CHECK (x IN (...))` constraints, status, state, stage, or phase columns, a
status column beside a history table, mirrored booleans (`isLoading` with `isError` with
`hasData`), nullable timestamps that mean "running", lease and lock columns, staged preference
fields, and wizard step numbers.

**Record for each:** the states, every site that writes a transition, the transitions that are
currently representable but should not be, and any fact stored twice.

**Rules:**

- Do not build a generic transitions framework. Guard only the machines with a real defect.
- Enforce atomically in the store: `UPDATE ... WHERE status = ANY(...)` and check the row count.
  A read, a check in Python or JS, then a write is a race, not a guard.
- Prefer deleting duplicated truth over reconciling it. Two columns holding one fact will drift.
- Where the model matters beyond a local fix, name it through `yeknal-domain-modeling` rather
  than inventing vocabulary in a migration.

For the review-side lens on the same defect, see the implicit state lens in `yeknal-review`.

## Fix tiers

| Tier | What it allows | Gate |
| --- | --- | --- |
| Safe | Hoisting a constant, parsing once, adding a projection, replacing serial calls with one batched call or one `allSettled` | No schema change, no response payload change, byte-identical output on a before and after diff |
| Gated | Changing a payload, a scoring input, or an ordering | An output comparison on real data, plus the caller updated in the same change |
| Migration | A new column, an index, a generated column, a backfill | A migration, a dual-write or backfill plan, and a follow-up that strips the old path |

Only the safe tier runs under `--fix`. Gated and migration findings are reported with their
plan, never applied silently.

## Output format

1. **Baseline**: what was measured or what was assumed, and the artefact path.
2. **Findings table**, ranked by cost:

   | # | Site | Cost | Frequency | Expected gain | Risk | Tier |
   | --- | --- | --- | --- | --- | --- | --- |

3. **What I rejected as noise, and why.** Mandatory. This is how the next agent avoids
   re-litigating the same micro-work. List the literal-pattern hoists, the single `new URL()`
   calls, the readable `SELECT *` on a one-row settings table, and anything else that looked
   like a finding and was not.
4. **Ordered work list**: safe tier first, then gated, then migrations, each with its proof.

## Traps

- **A fix list is not an audit.** Every entry is a hypothesis until a count or a measurement
  supports it. Importing a checklist wholesale recreates the problem this skill exists to
  prevent.
- **Round trips are milliseconds.** In one Postgres service measured at this boundary a round
  trip cost about 13 ms; a warm local connection is less and a cross-region one is far more.
  Trip-count savings are milliseconds unless the count is large, so show the count.
- **A queue enqueue is not cheaper than a single insert.** Moving work to a background job adds
  a hop, a failure mode, and a delay. It pays only when the work is genuinely deferrable.
- **An unordered `SELECT *` is load-bearing.** Any scoring, serializer, or client that reads an
  optional field shifts silently when the projection drops it.
- **A cast on unvalidated input is not a filter.** One bad id becomes a 500 or a silently empty
  result; validate before the cast.
- **A whole-document rewrite resurrects stripped fields.** Write the projection.
- **Sequential code is not automatically wrong.** Correctness, ordering, and one-connection
  queues all live in serial code. Name the dependency before you remove it.

## Verification

Use the repository's existing checks only: `python -m pytest`, `npm run lint`, `npm run build`,
`go test ./...`, the project's probe or health endpoint, and an end-to-end pass through the real
entry point. Do not write a unit test for a finding.

Each fixed finding gets a repeatable command and an artefact: a query plan before and after, a
call count from the log, a byte count, a response diff for a gated change, or a row count from
the atomic transition. A finding without its artefact is reported as unverified.
