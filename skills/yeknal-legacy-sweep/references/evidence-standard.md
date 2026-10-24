# Evidence standard

A candidate becomes a removal only when its row is complete. The row exists so a later reader can disagree with the decision without redoing the investigation.

## The code row

Record these for every candidate, in the report or a working file:

| # | Line | Record |
| --- | --- | --- |
| 1 | Reference search | The patterns and files searched, and the result. Include config, templates, styles, tests, docs, scripts, and CI. |
| 2 | Dynamic paths | Which registration or lookup mechanisms were checked, and why they cannot reach this symbol. |
| 3 | Contract status | Public API, export, entry point, documented flag, or internal only, with the evidence. |
| 4 | External consumers | Package publishing, other repositories, deployed clients, scheduled jobs, or "checked, none found". |
| 5 | Replacement | The live path that duplicates the behaviour, or why nothing reaches it. |
| 6 | Tool output | The command and the finding that raised the candidate. |

A gap in any line is a blocker, not a lower-confidence deletion. Say which line is missing.

## What counts, and what does not

| Counts as evidence | Does not count |
| --- | --- |
| A repository-wide search including strings and config | A search of the obvious source folders only |
| A named framework mechanism and why it is unreachable | "No results in grep, so it is dead" |
| A caller removed in the same campaign, with its own row | "Nothing in this file uses it" |
| A test that fails when the code is removed, understood | A coverage percentage |
| A published surface checked against consumers | "It looks old" |
| An unreachable branch proven by the type or guard | A branch that is merely hard to exercise |

## Framework traps

Check these before trusting a zero-reference result:

- **Barrel files and re-exports**: `index.ts`, `__init__.py`, `mod.rs`. A symbol re-exported from a barrel is used even if no direct call appears.
- **Decorators and registries**: `@app.route`, `@task`, `@click.command`, `@receiver`, `@Component`, Spring annotations, Laravel service providers. The decorator is the caller.
- **Dependency injection**: constructor injection by type, container registration by name, auto-wiring, module providers. A type can be referenced only by its registration.
- **String keys**: event names, queue names, feature flags, cache keys, i18n keys, error codes, analytic event names, permission strings.
- **Serialization and ORM models**: Pydantic, dataclasses, Django models, Prisma and TypeORM entities, GraphQL schema, OpenAPI-generated clients, protobuf. Fields are read by generated code.
- **Templates and styles**: class names consumed from templates, CSS modules, Tailwind safelist entries, styled-component variants, design tokens.
- **Dynamic import and reflection**: `importlib`, `import()`, `require(variable)`, `getattr`, `globals()`, `Object.keys` driven dispatch, plugin loaders, DSL parsers.
- **Entry points**: `main`, CLI commands wired in `pyproject.toml` or `package.json`, route manifests, job schedulers, webhook handlers, cron definitions.
- **Framework conventions**: `conftest.py` fixtures injected by argument name, lifecycle hooks, middleware registered by convention, Next.js file routes, SvelteKit load functions.
- **Generated and vendored code**: migrations, `.pb.go`, `*.generated.*`, `dist/`, `vendor/`. Never candidates without explicit confirmation.
- **Duplicated implementations**: an old adapter kept alive only by a feature flag or a fallback branch. Confirm the flag is off and the fallback is unreachable, or that removing the pair is what the user wants.

## Tool matrix

Tools produce leads. The row decides.

| Ecosystem | Command | What it finds | Caveat |
| --- | --- | --- | --- |
| JS/TS | `npx knip` | Unused files, exports, dependencies, types | Blind to string keys and some framework registrations; add plugins before trusting |
| JS/TS | `npx ts-prune` | Unused exports | No awareness of barrels or external consumers |
| JS/TS | `npx depcheck` | Unused dependencies | Misses peer deps and runtime-only packages |
| JS/TS | `npx madge --orphans` or `dpdm` | Unreferenced files, cycles | Entry points must be configured |
| JS/TS | coverage report | Uncovered lines | Uncovered is not unused |
| Python | `ruff check --select F401,F811,F841` | Unused imports, redefinitions, local variables | Intra-file only |
| Python | `vulture --min-confidence 80` | Unused functions, classes, variables | High false-positive rate on frameworks and fixtures |
| Python | coverage report | Uncovered code | Same caveat |
| Go | `deadcode` or `staticcheck` | Unreachable functions | Build tags and reflection escape analysis |
| CSS | selector cross-reference against templates | Unused classes | Dynamic class composition defeats it |

Record the exact command, scope, and result. If the tool cannot be installed, say so and fall back to search, with the weaker evidence stated.

## The test row

For a test candidate, record:

- test name and location;
- the assertion's actual coverage, quoting the assertion, not the test title;
- a credible regression this test would catch that no survivor catches;
- non-test callers of any seam involved;
- the stronger remaining proof, or why no independent contract exists;
- history or ownership context when it explains why the test exists;
- the focused command that runs it;
- the outcome: retain, repair, consolidate, or remove.

## Confidence and blockers

Use three states only:

- **Proven**: every row line filled. Removable.
- **Blocked**: a named line is missing. Report the missing item and the reason it could not be obtained.
- **Judgment**: the removal is technically safe but changes product behaviour. Ask.

Do not invent a fourth state such as "probably fine". It is how a sweep deletes something load-bearing.

## Worked examples

**Proven**: `formatLegacyDate` in `src/dates.ts`. Searched all tracked files for the name and its string form; checked `index.ts` exports (not exported), the date-parsing registry (keyed by locale, not by function), and docs. The only caller was removed in lane 2 with its own row, and the replacement is `formatDate`. Row complete.

**Blocked**: `legacyWebhookVersion` in `src/api/webhooks.ts`. No direct reference, but the endpoint path is assembled from a config key whose values are supplied by a deployment manifest that is not in this repository. Cannot inspect the manifest. Report as blocked and name the manifest.

**Judgment**: `POST /v1/orders/legacy`. No caller in the repository, but it is documented in the public API reference and the changelog promises removal only in the next major version. This is a product decision, not a code decision.
